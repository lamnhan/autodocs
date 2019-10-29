import { Rendering } from './render';

export type BuiltinTemplate = 'mini' | 'full' | 'angular' | 'cli';

export class TemplateService {

  constructor() {}
  
  getTemplate(name: BuiltinTemplate) {
    switch (name) {
      case 'mini':
        return this.getMiniTemplate();
      case 'full':
        return this.getFullTemplate();
      case 'angular':
        return this.getAngularTemplate();
      case 'cli':
        return this.getCLITemplate();
      default:
        throw new Error('No template name ' + name);
    }
  }

  private getMiniTemplate() {
    return {
      head: true,
      tocx: true,
      options: ['Options', 'FULL'],
      main: ['Main', 'FULL'],
      license: true,
    } as Rendering;
  }

  private getFullTemplate() {
    return {
      head: true,
      tocx: true,
      functions: ['*', 'FULL_FUNCTIONS'],
      interfaces: ['*', 'SUMMARY_INTERFACES', { heading: true }],
      classes: ['*', 'FULL_CLASSES'],
      license: true,
    } as Rendering;
  }

  private getAngularTemplate() {
    return {
      head: true,
      tocx: true,
      // TODO: add sections: services, components, pipes, ...
      license: true,
    } as Rendering;
  }

  private getCLITemplate() {
    return {
      head: true,
      tocx: true,
      // TODO: add commands section
      license: true,
    } as Rendering;
  }
}