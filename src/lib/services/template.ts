import { ProjectService } from './project';
import { CustomConvert, ConvertOptions } from './convert';
import { AdvancedRendering } from './render';
import { ContentBlock } from './content';

export type BuiltinTemplate =
  | 'basic' | 'basicx'
  | 'full' | 'fullx'
  | 'angular' | 'angularx'
  | 'cli' | 'clix';

export interface TemplateOptions {
  topSecs?: AdvancedRendering;
  bottomSecs?: AdvancedRendering;
  convertings?: {[section: string]: ConvertOptions};
}

export type CustomTemplate = (
  options: TemplateOptions,
  projectService: ProjectService
) => AdvancedRendering;

export class TemplateService {

  constructor(
    private projectService: ProjectService
  ) {}

  getTemplate(
    template: BuiltinTemplate | CustomTemplate,
    options: TemplateOptions = {}
  ) {
    const { topSecs = {}, bottomSecs = {} } = options;
    // get template
    let templateSecs: undefined | AdvancedRendering;
    // custom
    if (template instanceof Function) {
      templateSecs = template(options, this.projectService);
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
          templateSecs = this.getAngularTemplate(options, template === 'angularx');
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

  private getBasicTemplate(options: TemplateOptions = {}, extra = false) {
    const { convertings = {} } = options;
    const sections: AdvancedRendering = {
      options: ['Options', 'FULL', convertings['options'] || {}],
      main: ['Main', 'FULL', convertings['main'] || {}],
    };
    return this.createRendering(sections, extra);
  }

  private getFullTemplate(options: TemplateOptions = {}, extra = false) {
    const { convertings = {} } = options;
    const sections: AdvancedRendering = {
      functions: ['*', 'FULL_FUNCTIONS', convertings['functions'] || {}],
      interfaces: [
        '*',
        'SUMMARY_INTERFACES',
        {
          ...(convertings['interfaces'] || {}),
          heading: true,
        }
      ],
      classes: ['*', 'FULL_CLASSES', convertings['classes'] || {}],
    };
    return this.createRendering(sections, extra);
  }

  private getAngularTemplate(options: TemplateOptions = {}, extra = false) {
    const { convertings = {} } = options;
    const sections: AdvancedRendering = {
      modules: [
        {
          type: 'heading',
          data: {
            title: 'Modules',
            id: 'modules',
            level: 2,
          }
        },
        [
          '*',
          'SUMMARY_CLASSES',
          {
            ...(convertings['modules'] || {}),
            filter: declaration => (
              declaration.NAME.endsWith('Module') &&
              !declaration.NAME.endsWith('ComponentModule') &&
              !declaration.NAME.endsWith('PipeModule')
            )
          }
        ]
      ],
      components: [
        {
          type: 'heading',
          data: {
            title: 'Components',
            id: 'components',
            level: 2,
          }
        },
        [
          '*',
          'SUMMARY_CLASSES',
          {
            ...(convertings['components'] || {}),
            filter: declaration => declaration.NAME.endsWith('Component')
          }
        ]
      ],
      services: [
        {
          type: 'heading',
          data: {
            title: 'Services',
            id: 'services',
            level: 2,
          }
        },
        [
          '*',
          'SUMMARY_CLASSES',
          {
            ...(convertings['services'] || {}),
            filter: declaration => declaration.NAME.endsWith('Service')
          }
        ]
      ],
      pipes: [
        {
          type: 'heading',
          data: {
            title: 'Pipes',
            id: 'pipes',
            level: 2,
          }
        },
        [
          '*',
          'SUMMARY_CLASSES',
          {
            ...(convertings['pipes'] || {}),
            filter: declaration => declaration.NAME.endsWith('Pipe')
          }
        ]
      ],
    };
    return this.createRendering(sections, extra);
  }

  private getCLITemplate(options: TemplateOptions = {}, extra = false) {
    const { convertings = {} } = options;
    const customConvert: CustomConvert = (declaration, options, contentService) => {
      const commanderProp = declaration.getChild('commander');
      const [ commanderCmd, commanderDescription ] = commanderProp.DEFAULT_VALUE;
      // get command defs
      const commands = declaration.getVariablesOrProperties(
        decl => decl.NAME.endsWith('CommandDef')
      );
      // build blocks
      const result: ContentBlock[] = [];
      const summaryArr: string[] = [];
      const detailBlocks : ContentBlock[] = [];
      commands.forEach(decl => {
        const [command, description, ...cmdOptions] = decl.DEFAULT_VALUE as [string, string, ...Array<[string, string]>];
        const [ cmd, ...params ] = command.split(' ');
        const commandId = 'command-' + cmd;
        const strOpts = cmdOptions
          .map(([ opt ]) => opt.indexOf(', ') !== -1 ? opt.split(', ').pop() : opt)
          .join(' ');
        const fullCommand = (commanderCmd + ' ' + command + ' ' + strOpts).trim();
        // summary
        summaryArr.push(`- [\`${fullCommand}\`](#${commandId})`);
        // detail
        detailBlocks.push(contentService.blockHeading(`\`${cmd}\``, 3, commandId));
        detailBlocks.push(contentService.blockText(description));
        // parameters
        if (!!params.length) {
          // extract param descriptions
          const paramTags: {[key: string]: string} = {};
          if (!!decl.REFLECTION.comment) {
            (decl.REFLECTION.comment.tags || []).forEach(({ text }) => {
              const [k, desc] = text.split('-').map(x => x.trim());
              paramTags[k] = desc;
            });
          }
          detailBlocks.push(contentService.blockText(`**Parameters**`));
          detailBlocks.push(contentService.blockList(
            params.map(param =>
              [`\`${param}\``, paramTags[param] || `The \`${param}\` parameter.`]
            )
          ));
        }
        // options
        if (!!cmdOptions.length) {
          detailBlocks.push(contentService.blockText(`**Options**`));
          detailBlocks.push(contentService.blockList(
            cmdOptions.map(([ v1, v2 ]) => [`\`${v1}\``, v2])
          ));
        }
      });
      // push blocks
      result.push(contentService.blockHeading('Command overview', 2, 'command-overview'));
      result.push(contentService.blockText(commanderDescription));
      result.push(contentService.blockText(summaryArr.join(contentService.EOL)));
      result.push(contentService.blockHeading('Command reference', 2, 'command-reference'));
      result.push(...detailBlocks);
      // result
      return result;
    };
    const sections: AdvancedRendering = {
      cli: [
        'Cli',
        customConvert,
        convertings['cli'] || {}
      ]
    };
    return this.createRendering(sections, extra);
  }

  private createRendering(rendering: AdvancedRendering = {}, extra = false) {
    const sections = Object.keys(rendering);
    // extra
    if (extra) {
      sections.unshift('head', 'tocx');
      sections.push('license');
    }
    // build template
    const result: AdvancedRendering = {};
    sections.forEach(name => result[name] = rendering[name] || true);
    // result
    return result;
  }
}