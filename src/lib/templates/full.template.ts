import {AdvancedRendering} from '../services/render.service';
import {TemplateService, TemplateOptions} from '../services/template.service';

export class FullTemplate {
  constructor(private templateService: TemplateService) {}

  getSections(options: TemplateOptions = {}, extra = false) {
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
    return this.templateService.createRendering(sections, extra);
  }
}
