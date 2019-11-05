// tslint:disable: no-any
import { Rendering } from './render';

export type BuiltinTemplate =
  | 'mini' | 'minix'
  | 'full' | 'fullx'
  | 'angular' | 'angularx'
  | 'cli' | 'clix';

export interface TemplateOptions {
  [key: string]: any;
}

export class TemplateService {

  constructor() {}
  
  getTemplate(name: BuiltinTemplate, options: TemplateOptions = {}) {
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

  private getMiniTemplate(options: TemplateOptions = {}, extra = false) {
    const sections: Rendering = {
      options: ['Options', 'FULL', options['options'] || {}],
      main: ['Main', 'FULL', options['main'] || {}],
    };
    return this.createRendering(sections, extra);
  }

  private getFullTemplate(options: TemplateOptions = {}, extra = false) {
    const sections: Rendering = {
      functions: ['*', 'FULL_FUNCTIONS', options['functions'] || {}],
      interfaces: [
        '*',
        'SUMMARY_INTERFACES',
        {
          heading: true,
          ...(options['interfaces'] || {})
        }
      ],
      classes: ['*', 'FULL_CLASSES', options['classes'] || {}],
    };
    return this.createRendering(sections, extra);
  }

  private getAngularTemplate(options: TemplateOptions = {}, extra = false) {
    const sections: Rendering = {
      // TODO: add sections: services, components, pipes, ...
    };
    return this.createRendering(sections, extra);
  }

  private getCLITemplate(options: TemplateOptions = {}, extra = false) {
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