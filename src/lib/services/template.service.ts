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
      // add mocked help command def if not exists
      let isHelpCommandDef = false;
      commands.forEach(decl => {
        const commandVal = decl.DEFAULT_VALUE[0];
        const cmd =
          typeof commandVal === 'string'
            ? commandVal
            : ((commandVal[0] as string).split(' ').shift() as string);
        if (cmd === 'help') {
          isHelpCommandDef = true;
        }
      });
      if (!isHelpCommandDef) {
        commands.push({
          DEFAULT_VALUE: ['help', 'Display help.'],
        } as DeclarationObject);
      }
      // build blocks
      const result: ContentBlock[] = [];
      const summaryArr: string[] = [];
      const detailBlocks: ContentBlock[] = [];
      commands.forEach(decl => {
        const [commandVal, description, ...cmdOptions] = decl.DEFAULT_VALUE as [
          string | string[],
          string,
          ...Array<[string, string]>
        ];
        // process command value
        const {
          cmd,
          params,
          cmdWithParams,
          aliases,
          parentCmd,
          subCmd,
          isProxy,
        } = (() => {
          let cmdWithParams: string;
          let aliases: string[];
          if (typeof commandVal === 'string') {
            cmdWithParams = commandVal;
            aliases = [];
          } else {
            cmdWithParams = commandVal.shift() as string;
            aliases = [...commandVal];
          }
          const [cmd, ...params] = cmdWithParams.split(' ');
          // a sub-command
          const [parentCmd, subCmd] =
            cmd.indexOf('-') !== -1 ? cmd.split('-') : [];
          return {
            cmd,
            params,
            cmdWithParams,
            aliases,
            parentCmd,
            subCmd,
            isProxy: !!parentCmd && !!subCmd,
          };
        })();
        // sum-up values
        const commandId = 'command-' + cmd;
        const proxyText = !isProxy
          ? ''
          : `Proxy to: [\`${parentCmd} ${subCmd}\`](#command-${parentCmd})`;
        const strOpts = cmdOptions
          .map(([opt]) =>
            opt.indexOf(', ') !== -1 ? opt.split(', ').pop() : opt
          )
          .join(' ');
        const cmdAndAliases =
          cmd + (!aliases.length ? '' : '|' + aliases.join('|'));
        const cmdAndAliasesWithParams =
          cmdAndAliases + (!params.length ? '' : ' ' + params.join(' '));
        const fullCommand = (
          commanderCmd +
          ' ' +
          cmdWithParams +
          ' ' +
          strOpts
        ).trim();
        const fullCommandWithAliases = (
          commanderCmd +
          ' ' +
          cmdAndAliasesWithParams +
          ' ' +
          strOpts
        ).trim();
        // summary
        if (!isProxy) {
          summaryArr.push(`- [\`${fullCommandWithAliases}\`](#${commandId})`);
        }
        // detail heading
        detailBlocks.push(
          contentService.blockHeading(`\`${cmd}\``, 3, commandId)
        );
        // detail description
        detailBlocks.push(
          contentService.blockText(description + ' ' + proxyText)
        );
        // detail full command
        detailBlocks.push(
          contentService.blockText('**Usage**: ' + `\`${fullCommand}\``)
        );
        // detail aliases
        if (aliases.length) {
          const aliasList = aliases.map(alias => `\`${alias}\``).join(', ');
          detailBlocks.push(
            contentService.blockText('**Aliases**: ' + aliasList)
          );
        }
        // detail parameters
        if (params.length) {
          // extract param descriptions
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
          detailBlocks.push(contentService.blockText('**Parameters**'));
          detailBlocks.push(
            contentService.blockList(
              params.map(param => [
                `\`${param}\``,
                paramTags[param] || `The \`${param}\` parameter.`,
              ])
            )
          );
        }
        // detail options
        if (cmdOptions.length) {
          detailBlocks.push(contentService.blockText('**Options**'));
          detailBlocks.push(
            contentService.blockList(
              cmdOptions.map(([v1, v2]) => [`\`${v1}\``, v2])
            )
          );
        }
      });
      // push blocks
      result.push(
        contentService.blockHeading('Command overview', 2, 'command-overview')
      );
      result.push(contentService.blockText(commanderDescription));
      result.push(
        contentService.blockText(summaryArr.join(contentService.EOL))
      );
      result.push(
        contentService.blockHeading('Command reference', 2, 'command-reference')
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
