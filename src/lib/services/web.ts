// tslint:disable: no-any
import { resolve } from 'path';

import { ProjectService } from './project';
import { ContentService } from './content';

export interface WebData {
  [key: string]: any;
};

export class WebService {

  constructor(
    private projectService: ProjectService,
    private contentService: ContentService,
  ) {}

  getIndex() {
    return 'index.html';
  }

  buildPage(
    content: string,
    menu: string,
    title = 'Untitled',
    data: WebData = {}
  ) {
    const theme = this.getTheme();
    // mandatory
    let result = theme
      .replace('{{ title }}', title)
      .replace('{{ menu }}', menu)
      .replace('{{ content }}', content);
    // extra data
    Object.keys(data).forEach(
      key => result = result.replace(`{{ ${key} }}`, data[key])
    );
    // result
    return this.contentService.formatHtml(result);
  }

  private getTheme() {
    const { websiteTheme } = this.projectService.OPTIONS;
    const themePath =
      websiteTheme.substr(-5) === '.html'
      ? websiteTheme
      : this.vendorThemePath(websiteTheme + '.html');
    return this.contentService.readFileSync(themePath);
  }

  private vendorThemePath(fileName: string) {
    return resolve(__dirname, '..', 'themes', fileName);
  }

}