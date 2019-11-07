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

  getIndex(redirectUrl: string) {
    const { websiteIndex } = this.projectService.OPTIONS;
    // path
    const indexPath = 
      !websiteIndex || websiteIndex === 'default'
      ? this.vendorThemePath('index.html')
      : websiteIndex;
    // load content
    return this.contentService
      .readFileSync(indexPath)
      // default
      .replace('{{ redirectUrl }}', redirectUrl);
  }

  buildPage(
    content: string,
    menu: string,
    title = 'Untitled',
    data: WebData = {}
  ) {
    // load theme
    const theme = this.getTheme();
    // mandatory
    let result = theme
      .replace('{{ title }}', title)
      .replace('{{ menu }}', menu)
      .replace('{{ content }}', content);
    // extra data
    data = { ...this.getVendorData(), ...data };
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

  private getVendorData() {
    const data: WebData = {};
    const {
      name: pkgName,
      homepage,
      repository: { url: repoUrl } = { url: undefined }
    } = this.projectService.PACKAGE;
    const { url } = this.projectService.OPTIONS;
    if (!!pkgName) {
      data['siteName'] = pkgName + ' documentation';
    }
    if (!!url) {
      data['siteUrl'] = url;
    }
    if (!!homepage) {
      data['homeUrl'] = homepage || url;
    }
    if (!!repoUrl) {
      data['repoUrl'] = repoUrl.replace('.git', '');
    }
    return data;
  }

}