import { AdditionalConvert } from './convert';
import { Rendering, TemplateRenderOptions } from './render';
import { ContentBlock } from './content';

export type BuiltinTemplate =
  | 'mini' | 'minix'
  | 'full' | 'fullx'
  | 'angular' | 'angularx'
  | 'cli' | 'clix';

export class TemplateService {

  constructor() {}
  
  getTemplate(name: BuiltinTemplate, options: TemplateRenderOptions = {}) {
    switch (name) {
      case 'mini':
      case 'minix':
        return this.getMiniTemplate(options, name === 'minix');
      case 'full':
      case 'fullx':
        return this.getFullTemplate(options, name === 'fullx');
      case 'angular':
      case 'angularx':
        return this.getAngularTemplate(options, name === 'angularx');
      case 'cli':
      case 'clix':
        return this.getCLITemplate(options, name === 'clix');
      default:
        throw new Error('No template name ' + name);
    }
  }

  private getMiniTemplate(options: TemplateRenderOptions = {}, extra = false) {
    const { convertings = {} } = options;
    const sections: Rendering = {
      options: ['Options', 'FULL', convertings['options'] || {}],
      main: ['Main', 'FULL', convertings['main'] || {}],
    };
    return this.createRendering(sections, extra);
  }

  private getFullTemplate(options: TemplateRenderOptions = {}, extra = false) {
    const { convertings = {} } = options;
    const sections: Rendering = {
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

  private getAngularTemplate(options: TemplateRenderOptions = {}, extra = false) {
    const { convertings = {} } = options;
    const sections: Rendering = {
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

  private getCLITemplate(options: TemplateRenderOptions = {}, extra = false) {
    const { convertings = {} } = options;
    const customConvert: AdditionalConvert = (declaration, options, contentService) => {
      // get command defs
      const commands = declaration.getVariablesOrProperties(
        decl => decl.NAME.endsWith('CommandDef')
      );
      // build blocks
      const result: ContentBlock[] = [];
      // 
      const summaryArr: string[] = [];
      const detailBlocks : ContentBlock[] = [];
      commands.forEach(decl => {
        const [command, description, ...cmdOptions] = decl.DEFAULT_VALUE as [string, string, ...Array<[string, string]>];
        const [ cmd, ...params ] = command.split(' ');
        const commandId = 'command-' + cmd;
        const strOpts = cmdOptions
          .map(([ opt ]) => opt.indexOf(', ') !== -1 ? opt.split(', ').pop() : opt)
          .join(' ');
        const fullCommand = (command + ' ' + strOpts).trim();
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
      result.push(contentService.blockHeading('Commands', 2, 'commands'));
      result.push(contentService.blockText(summaryArr.join(contentService.EOL)));
      result.push(contentService.blockHeading('Reference', 2, 'reference'));
      result.push(...detailBlocks);
      // result
      return result;
    };
    const sections: Rendering = {
      commands: [
        'Cli',
        'CUSTOM',
        {
          ...(convertings['commands'] || {}),
          convert: customConvert,
        }
      ]
    };
    return this.createRendering(sections, extra);
  }

  private createRendering(rendering: Rendering = {}, extra = false) {
    const sections = Object.keys(rendering);
    // extra
    if (extra) {
      sections.unshift('head', 'tocx');
      sections.push('license');
    }
    // build template
    const result: Rendering = {};
    sections.forEach(name => result[name] = rendering[name] || true);
    // result
    return result;
  }
}