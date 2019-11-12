import { Rendering, TemplateRenderOptions } from './render';

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
    const sections: Rendering = {
      // TODO: add commands section
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