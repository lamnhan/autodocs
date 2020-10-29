import {AdvancedRendering} from '../services/render.service';
import {TemplateService, TemplateOptions} from '../services/template.service';

export class BasicTemplate {
  constructor(private templateService: TemplateService) {}

  getSections(options: TemplateOptions = {}, extra = false) {
    const {convertings = {}} = options;
    const sections: AdvancedRendering = {
      options: ['Options', 'FULL', convertings['options'] || {}],
      lib: ['Lib', 'FULL', convertings['lib'] || {}],
    };
    return this.templateService.createRendering(sections, extra);
  }
}
