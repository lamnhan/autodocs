import {pathExistsSync, readFileSync} from 'fs-extra';

import {ProjectService} from './project.service';
import {CustomConvert, ConvertOptions} from './convert.service';
import {AdvancedRendering} from './render.service';
import {ContentBlock, ContentService} from './content.service';

import {DeclarationObject} from '../objects/declaration.object';

export type BuiltinTemplate =
  | 'basic'
  | 'basicx'
  | 'full'
  | 'fullx'
  | 'angular'
  | 'angularx'
  | 'cli'
  | 'clix';

export interface TemplateOptions {
  topSecs?: AdvancedRendering;
  bottomSecs?: AdvancedRendering;
  convertings?: {[section: string]: ConvertOptions};
}

export type CustomTemplate = (
  options: TemplateOptions,
  templateService: TemplateService,
  contentService: ContentService,
  projectService: ProjectService
) => AdvancedRendering;

export class TemplateService {
  constructor(
    private projectService: ProjectService,
    private contentService: ContentService
  ) {}

  getTemplate(
    template: BuiltinTemplate | CustomTemplate,
    options: TemplateOptions = {}
  ) {
    const {topSecs = {}, bottomSecs = {}} = options;
    // get template
    let templateSecs: undefined | AdvancedRendering;
    // custom
    if (template instanceof Function) {
      templateSecs = template(
        options,
        this,
        this.contentService,
        this.projectService
      );
    }
    // builtin
    else {
      switch (template) {
        case 'basic':
        case 'basicx':
          templateSecs = this.getBasicTemplate(options, template === 'basicx');
          break;
        case 'full':
        case 'fullx':
          templateSecs = this.getFullTemplate(options, template === 'fullx');
          break;
        case 'angular':
        case 'angularx':
          templateSecs = this.getAngularTemplate(
            options,
            template === 'angularx'
          );
          break;
        case 'cli':
        case 'clix':
          templateSecs = this.getCLITemplate(options, template === 'clix');
          break;
        // invalid
        default:
          break;
      }
    }
    // invalid
    if (!templateSecs) {
      throw new Error('Invalid templating!');
    }
    // result
    return {
      ...topSecs,
      ...templateSecs,
      ...bottomSecs,
    };
  }

  createRendering(rendering: AdvancedRendering = {}, extra = false) {
    const sections = Object.keys(rendering);
    // extra
    if (extra) {
      sections.unshift('head', 'tocx');
      sections.push('license');
    }
    // build template
    const result: AdvancedRendering = {};
    sections.forEach(name => (result[name] = rendering[name] || true));
    // result
    return result;
  }

  private getBasicTemplate(options: TemplateOptions = {}, extra = false) {
    const {convertings = {}} = options;
    const sections: AdvancedRendering = {
      options: ['Options', 'FULL', convertings['options'] || {}],
      lib: ['Lib', 'FULL', convertings['lib'] || {}],
    };
    return this.createRendering(sections, extra);
  }

  private getFullTemplate(options: TemplateOptions = {}, extra = false) {
    const {convertings = {}} = options;
    const sections: AdvancedRendering = {
      functions: ['*', 'FULL_FUNCTIONS', convertings['functions'] || {}],
      interfaces: [
        '*',
        'SUMMARY_INTERFACES',
        {
          ...(convertings['interfaces'] || {}),
          heading: true,
        },
      ],
      classes: ['*', 'FULL_CLASSES', convertings['classes'] || {}],
    };
    return this.createRendering(sections, extra);
  }

  private getAngularTemplate(options: TemplateOptions = {}, extra = false) {
    const {convertings = {}} = options;
    const sections: AdvancedRendering = {
      modules: [
        {
          type: 'heading',
          data: {
            title: 'Modules',
            id: 'modules',
            level: 2,
          },
        },
        [
          '*',
          'SUMMARY_CLASSES',
          {
            ...(convertings['modules'] || {}),
            filter: declaration =>
              declaration.NAME.endsWith('Module') &&
              !declaration.NAME.endsWith('ComponentModule') &&
              !declaration.NAME.endsWith('PipeModule'),
          },
        ],
      ],
      components: [
        {
          type: 'heading',
          data: {
            title: 'Components',
            id: 'components',
            level: 2,
          },
        },
        [
          '*',
          'SUMMARY_CLASSES',
          {
            ...(convertings['components'] || {}),
            filter: declaration => declaration.NAME.endsWith('Component'),
          },
        ],
      ],
      services: [
        {
          type: 'heading',
          data: {
            title: 'Services',
            id: 'services',
            level: 2,
          },
        },
        [
          '*',
          'SUMMARY_CLASSES',
          {
            ...(convertings['services'] || {}),
            filter: declaration => declaration.NAME.endsWith('Service'),
          },
        ],
      ],
      pipes: [
        {
          type: 'heading',
          data: {
            title: 'Pipes',
            id: 'pipes',
            level: 2,
          },
        },
        [
          '*',
          'SUMMARY_CLASSES',
          {
            ...(convertings['pipes'] || {}),
            filter: declaration => declaration.NAME.endsWith('Pipe'),
          },
        ],
      ],
    };
    return this.createRendering(sections, extra);
  }

  private getCLITemplate(options: TemplateOptions = {}, extra = false) {
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
        const {
          cmd,
          params,
          cmdWithParams,
          aliases,
          proxyCmd,
          isProxy,
        } = commandValData;
        // sum-up values
        const commandId = 'command-' + cmd;
        const subCommandId = !isProxy ? '' : `command-${proxyCmd}`;
        // string options
        const strOpts = cmdOptions
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
          strOpts
        ).trim();
        // all full commands
        const fullCommands = aliases.map(alias =>
          (
            commanderCmd +
            ' ' +
            cmdWithParams.replace(cmd, alias) +
            ' ' +
            strOpts
          ).trim()
        );
        fullCommands.unshift(fullCommand);
        const fullCommandWithAliases = (
          commanderCmd +
          ' ' +
          cmdAndAliasesWithParams +
          ' ' +
          strOpts
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
          commandId,
          subCommandId,
          fullCommand,
          fullCommands,
          fullCommandWithAliases,
          aliasList,
          paramList: paramList as Array<[string, string]>,
          optionList: optionList as Array<[string, string]>,
          usageText,
        };
      };
      type DataByParent = Record<
        string,
        {
          subCmds: string[];
          subCommands: DeclarationObject[];
        }
      >;
      type RecordCommands = Record<string, DeclarationObject>;
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
            fullCommand,
          } = subCommandData;
          // sub aliases
          const subAliases = aliasesBySubCmd[subCmd] || [];
          // full command
          const subFullCommand = fullCommand.replace(
            cmd,
            `${parentCmd} ${subCmd}`
          );
          // all full commands
          const subFullCommands = subAliases.map(alias =>
            fullCommand.replace(cmd, `${parentCmd} ${alias}`)
          );
          subFullCommands.unshift(subFullCommand);
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
            subFullCommand,
            subFullCommands,
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
        if (!isProxy) {
          // summary
          summaryArr.push(`- [\`${fullCommandWithAliases}\`](#${commandId})`);
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
            const subCommandItems = processDataForSubCommand(
              cmd,
              dataByParent,
              recordCommands
            );
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
    return this.createRendering(sections, extra);
  }
}
