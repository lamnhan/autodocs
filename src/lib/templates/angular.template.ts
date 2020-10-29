import {AdvancedRendering} from '../services/render.service';
import {TemplateService, TemplateOptions} from '../services/template.service';

export class AngularTemplate {
  constructor(private templateService: TemplateService) {}

  getSections(options: TemplateOptions = {}, extra = false) {
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
    return this.templateService.createRendering(sections, extra);
  }
}
