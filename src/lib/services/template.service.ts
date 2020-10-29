import {ProjectService} from './project.service';
import {ConvertOptions} from './convert.service';
import {AdvancedRendering} from './render.service';
import {ContentService} from './content.service';

import {BasicTemplate} from '../templates/basic.template';
import {FullTemplate} from '../templates/full.template';
import {AngularTemplate} from '../templates/angular.template';
import {CliTemplate} from '../templates/cli.template';

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
          templateSecs = new BasicTemplate(this).getSections(
            options,
            template === 'basicx'
          );
          break;
        case 'full':
        case 'fullx':
          templateSecs = new FullTemplate(this).getSections(
            options,
            template === 'fullx'
          );
          break;
        case 'angular':
        case 'angularx':
          templateSecs = new AngularTemplate(this).getSections(
            options,
            template === 'angularx'
          );
          break;
        case 'cli':
        case 'clix':
          templateSecs = new CliTemplate(this).getSections(
            options,
            template === 'clix'
          );
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
}
