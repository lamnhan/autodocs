import {pathExistsSync, readFileSync} from 'fs-extra';

import {CustomConvert} from '../services/convert.service';
import {AdvancedRendering} from '../services/render.service';
import {ContentBlock} from '../services/content.service';
import {TemplateService, TemplateOptions} from '../services/template.service';

import {DeclarationObject} from '../objects/declaration.object';

type DataByParent = Record<
  string,
  {
    subCmds: string[];
    subCommands: DeclarationObject[];
  }
>;

type RecordCommands = Record<string, DeclarationObject>;

export class CliTemplate {
  constructor(private templateService: TemplateService) {}

  getSections(options: TemplateOptions = {}, extra = false) {
    const {convertings = {}} = options;
    const customConvert: CustomConvert = (
      declaration,
      options,
      contentService
    ) => {
      const commanderProp = declaration.getChild('commander');
      const [commanderCmd, commanderDescription] = commanderProp.DEFAULT_VALUE;
      // get command defs
      const commands = declaration.getVariablesOrProperties(decl =>
        decl.NAME.endsWith('CommandDef')
      );
      // helper functions
      const parseCommandVal = (commandVal: string | string[]) => {
        let cmdWithParams: string;
        let aliases: string[];
        if (typeof commandVal === 'string') {
          cmdWithParams = commandVal;
          aliases = [];
        } else {
          const [a, ...b] = commandVal;
          cmdWithParams = a;
          aliases = b;
        }
        const [cmd, ...params] = cmdWithParams.split(' ');
        // a parent command
        const isGrouping = params[0] === '[subCommand]';
        // a sub-command
        const [parentCmd, subCmd] =
          cmd.indexOf('-') !== -1 ? cmd.split('-') : [];
        // is proxy
        const isProxy = !!parentCmd && !!subCmd;
        // proxy cmd
        const proxyCmd = !isProxy ? '' : `${parentCmd}-${subCmd}`;
        // parent sub cmd
        const parentSubCmd = !isProxy ? '' : `${parentCmd} ${subCmd}`;
        return {
          cmd,
          params,
          cmdWithParams,
          aliases,
          isGrouping,
          parentCmd,
          subCmd,
          isProxy,
          proxyCmd,
          parentSubCmd,
        };
      };
      const extractCommandDeclaration = (decl: DeclarationObject) => {
        const [commandVal, description, ...cmdOptions] = decl.DEFAULT_VALUE as [
          string | string[],
          string,
          ...Array<[string, string]>
        ];
        // process command value
        const commandValData = parseCommandVal(commandVal);
        const {cmd, params, cmdWithParams, aliases} = commandValData;
        // sum-up values
        const commandId = 'command-' + cmd;
        // string options
        const strOptions = cmdOptions
          .map(([opt]) =>
            opt.indexOf(', ') !== -1 ? opt.split(', ').pop() : opt
          )
          .join(' ');
        // command and aliases
        const cmdAndAliases =
          cmd + (!aliases.length ? '' : '|' + aliases.join('|'));
        // command and aliases with params
        const cmdAndAliasesWithParams =
          cmdAndAliases + (!params.length ? '' : ' ' + params.join(' '));
        // full command
        const fullCommand = (
          commanderCmd +
          ' ' +
          (cmd !== '*' ? cmdWithParams : '<cmd>') +
          ' ' +
          strOptions
        ).trim();
        // all full commands
        const fullCommands = aliases.map(alias =>
          (
            commanderCmd +
            ' ' +
            cmdWithParams.replace(cmd, alias) +
            ' ' +
            strOptions
          ).trim()
        );
        fullCommands.unshift(fullCommand);
        // full command with aliases
        const fullCommandWithAliases = (
          commanderCmd +
          ' ' +
          cmdAndAliasesWithParams +
          ' ' +
          strOptions
        ).trim();
        // alias string list
        const aliasList = aliases.map(alias => `\`${alias}\``).join(', ');
        // params
        const paramList = !params.length
          ? []
          : (() => {
              const paramTags: {[key: string]: string} = {};
              if (decl.REFLECTION.comment) {
                (decl.REFLECTION.comment.tags || []).forEach(
                  ({tagName, paramName, text}) => {
                    if (tagName === 'param') {
                      const isOptional = paramName.substr(-1) === '?';
                      const k = !isOptional
                        ? `<${paramName}>`
                        : `[${paramName.replace('?', '')}]`;
                      const desc = text.replace('\\n', '');
                      paramTags[k] = desc;
                    }
                  }
                );
              }
              return params.map(param => [
                `\`${param}\``,
                paramTags[param] || `The \`${param}\` parameter.`,
              ]);
            })();
        // options
        const optionList = !cmdOptions.length
          ? []
          : cmdOptions.map(([k, v]) => [`\`${k}\``, v]);
        // usage
        const usageTextArr = ['```sh'];
        fullCommands.forEach(fc => usageTextArr.push(fc));
        usageTextArr.push('```');
        const usageText = usageTextArr.join('\n');
        // result
        return {
          ...commandValData,
          description,
          strOptions,
          commandId,
          cmdAndAliases,
          cmdAndAliasesWithParams,
          fullCommand,
          fullCommands,
          fullCommandWithAliases,
          aliasList,
          paramList: paramList as Array<[string, string]>,
          optionList: optionList as Array<[string, string]>,
          usageText,
        };
      };
      const processDataForSubCommand = (
        parentCmd: string,
        dataByParent: DataByParent,
        recordCommands: RecordCommands
      ) => {
        // get sub command aliases
        const aliasesBySubCmd = (() => {
          const subCmds = dataByParent[parentCmd].subCmds || [];
          // get case values
          let cmdCaseValues = [] as string[];
          const p1 = `./src/cli/commands/${parentCmd}.command.ts`;
          const p2 = `./src/cli/commands/${parentCmd}/${parentCmd}.command.ts`;
          const filePath = pathExistsSync(p1)
            ? p1
            : pathExistsSync(p2)
            ? p2
            : null;
          if (filePath) {
            const fileContent = readFileSync(filePath, {
              encoding: 'utf8',
            }).replace(/\\n/g, '');
            cmdCaseValues = (
              fileContent.match(/case '(.*?)':/g) || []
            ).map(match => match.replace("case '", '').replace("':", ''));
          }
          // get indexes
          const indexes = subCmds.map(subCmd => cmdCaseValues.indexOf(subCmd));
          const sortedIndexes = [...indexes].sort();
          // group by index
          const cmdGroups = [] as string[][];
          for (let i = 0; i < sortedIndexes.length; i++) {
            const index = sortedIndexes[i];
            cmdGroups.push(
              [...cmdCaseValues].splice(
                index,
                (sortedIndexes[i + 1] || cmdCaseValues.length) - index
              )
            );
          }
          // get items
          const aliasesBySubCmd = {} as Record<string, string[]>;
          subCmds.forEach(subCmd => {
            for (let i = 0; i < cmdGroups.length; i++) {
              const [_subCmd, ...als] = cmdGroups[i];
              if (subCmd === _subCmd) {
                aliasesBySubCmd[subCmd] = als;
                break;
              }
            }
          });
          // result aliases by sub-commands
          return aliasesBySubCmd;
        })();
        // result
        return (dataByParent[parentCmd].subCommands || []).map(subDecl => {
          const subCommandData = extractCommandDeclaration(subDecl);
          const {
            cmd,
            parentCmd,
            subCmd,
            proxyCmd,
            parentSubCmd,
            params,
            fullCommand,
            strOptions,
          } = subCommandData;
          // sub aliases
          const subAliases = aliasesBySubCmd[subCmd] || [];
          // id
          const subCommandId = `command-${proxyCmd}`;
          // sub command and aliases
          const subCmdAndAliases =
            parentSubCmd +
            (!subAliases.length ? '' : '|' + subAliases.join('|'));
          // sub command and aliases with params
          const subCmdAndAliasesWithParams =
            subCmdAndAliases + (!params.length ? '' : ' ' + params.join(' '));
          // sub full command
          const subFullCommand = fullCommand.replace(cmd, parentSubCmd);
          // all full commands
          const subFullCommands = subAliases.map(alias =>
            fullCommand.replace(cmd, `${parentCmd} ${alias}`)
          );
          subFullCommands.unshift(subFullCommand);
          // sub full command with aliases
          const subFullCommandWithAliases = (
            commanderCmd +
            ' ' +
            subCmdAndAliasesWithParams +
            ' ' +
            strOptions
          ).trim();
          // sub aliases
          const subAliasList = subAliases
            .map(alias => `\`${alias}\``)
            .join(', ');
          // usage
          const subUsageTextArr = ['```sh'];
          subFullCommands.forEach(sfc => subUsageTextArr.push(sfc));
          subUsageTextArr.push('```');
          const subUsageText = subUsageTextArr.join('\n');
          // proxy
          const {
            fullCommands: proxyFullCommands,
            usageText: proxyUsageText,
          } = extractCommandDeclaration(recordCommands[proxyCmd]);
          // result
          return {
            ...subCommandData,
            subAliases,
            subCommandId,
            subCmdAndAliases,
            subCmdAndAliasesWithParams,
            subFullCommand,
            subFullCommands,
            subFullCommandWithAliases,
            subAliasList,
            subUsageText,
            proxyFullCommands,
            proxyUsageText,
          };
        });
      };
      // extract special data
      const {
        dataByParent,
        recordCommands,
        helpCommandDef,
        unknownCommandDef,
      } = (() => {
        let helpCommandDefIndex: undefined | number;
        let unknownCommandDefIndex: undefined | number;
        const recordCommands = {} as RecordCommands;
        const dataByParent = {} as DataByParent;
        commands.forEach((decl, i) => {
          const {cmd, parentCmd, subCmd} = parseCommandVal(
            decl.DEFAULT_VALUE[0]
          );
          // temp remove help/unknown command def if not exists
          if (cmd === 'help') {
            helpCommandDefIndex = i;
          } else if (cmd === '*') {
            unknownCommandDefIndex = i;
          }
          // save record commands
          recordCommands[cmd] = decl;
          // sub-command
          if (parentCmd) {
            if (!dataByParent[parentCmd]) {
              dataByParent[parentCmd] = {
                subCmds: [],
                subCommands: [],
              };
            }
            dataByParent[parentCmd].subCmds.push(subCmd);
            dataByParent[parentCmd].subCommands.push(decl);
          }
        });
        const helpCommandDef =
          helpCommandDefIndex !== undefined
            ? (commands
                .splice(helpCommandDefIndex, 1)
                .pop() as DeclarationObject)
            : ({
                DEFAULT_VALUE: ['help', 'Display help.'],
              } as DeclarationObject);
        const unknownCommandDef =
          unknownCommandDefIndex !== undefined
            ? (commands
                .splice(unknownCommandDefIndex - 1, 1)
                .pop() as DeclarationObject)
            : ({
                DEFAULT_VALUE: ['*', 'Any other command is not suppoted.'],
              } as DeclarationObject);
        return {
          dataByParent,
          recordCommands,
          helpCommandDef,
          unknownCommandDef,
        };
      })();
      // sort & add help/unknown
      commands
        .sort((decl1, decl2) => {
          const {cmd: cmd1} = parseCommandVal(decl1.DEFAULT_VALUE[0]);
          const {cmd: cmd2} = parseCommandVal(decl2.DEFAULT_VALUE[0]);
          return cmd1 > cmd2 ? 1 : cmd1 === cmd2 ? 0 : -1;
        })
        .push(helpCommandDef, unknownCommandDef);
      // build blocks
      const result: ContentBlock[] = [];
      const summaryArr: string[] = [];
      const detailBlocks: ContentBlock[] = [];
      commands.forEach(decl => {
        const {
          cmd,
          description,
          commandId,
          fullCommandWithAliases,
          isProxy,
          isGrouping,
          usageText,
          paramList,
          optionList,
        } = extractCommandDeclaration(decl);
        const subCommandItems = !isGrouping
          ? []
          : processDataForSubCommand(cmd, dataByParent, recordCommands);
        // render
        if (!isProxy) {
          // summary
          summaryArr.push(`- [\`${fullCommandWithAliases}\`](#${commandId})`);
          if (isGrouping) {
            subCommandItems.forEach(item => {
              const {subFullCommandWithAliases, subCommandId} = item;
              summaryArr.push(
                `  - [\`${subFullCommandWithAliases}\`](#${subCommandId})`
              );
            });
          }
          // detail
          detailBlocks.push(
            contentService.blockHeading(`\`${cmd}\``, 3, commandId)
          );
          detailBlocks.push(contentService.blockText(description));
          detailBlocks.push(
            contentService.blockText(['**Usage:**', usageText])
          );
          // detail has sub-commands
          if (isGrouping) {
            detailBlocks.push(contentService.blockText('**Sub-commands:**'));
            subCommandItems.forEach(item => {
              const {
                subCmd,
                subCommandId,
                description: subDescription,
                paramList: subParamList,
                optionList: subOptionList,
                subUsageText,
                proxyUsageText,
              } = item;
              detailBlocks.push(
                contentService.blockHeading(`\`${subCmd}\``, 4, subCommandId)
              );
              detailBlocks.push(contentService.blockText(subDescription));
              detailBlocks.push(
                contentService.blockText(['**Usage:**', subUsageText])
              );
              detailBlocks.push(
                contentService.blockText(['**Proxy use:**', proxyUsageText])
              );
              if (subParamList.length) {
                detailBlocks.push(contentService.blockText('**Parameters:**'));
                detailBlocks.push(contentService.blockList(subParamList));
              }
              if (subOptionList.length) {
                detailBlocks.push(contentService.blockText('**Options:**'));
                detailBlocks.push(contentService.blockList(subOptionList));
              }
            });
          }
          // detail no sub-commands
          else {
            if (paramList.length) {
              detailBlocks.push(contentService.blockText('**Parameters:**'));
              detailBlocks.push(contentService.blockList(paramList));
            }
            if (optionList.length) {
              detailBlocks.push(contentService.blockText('**Options:**'));
              detailBlocks.push(contentService.blockList(optionList));
            }
          }
        }
      });
      // push blocks
      result.push(
        contentService.blockHeading(
          'Command overview',
          2,
          'cli-command-overview'
        )
      );
      result.push(contentService.blockText(commanderDescription));
      result.push(
        contentService.blockText(summaryArr.join(contentService.EOL))
      );
      result.push(
        contentService.blockHeading(
          'Command reference',
          2,
          'cli-command-reference'
        )
      );
      result.push(...detailBlocks);
      // result
      return result;
    };
    const sections: AdvancedRendering = {
      cli: ['Cli', customConvert, convertings['cli'] || {}],
    };
    return this.templateService.createRendering(sections, extra);
  }
}
