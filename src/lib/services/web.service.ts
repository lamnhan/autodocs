import {resolve, sep} from 'path';
import {pathExistsSync, copySync} from 'fs-extra';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const APP_ROOT = require('app-root-path');

import {ProjectService} from './project.service';
import {ContentService} from './content.service';

export interface WebData {
  siteName?: string;
  siteUrl?: string;
  homeUrl?: string;
  repoUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export class WebService {
  constructor(
    private projectService: ProjectService,
    private contentService: ContentService
  ) {}

  getIndex(redirectUrl: string) {
    const {
      webRender: {index: websiteIndex},
    } = this.projectService.OPTIONS;
    // path
    const indexPath = !websiteIndex
      ? this.defaultIndexPath()
      : this.localPath(websiteIndex);
    // load content
    return (
      this.contentService
        .readFileSync(indexPath)
        // default
        .replace('{{ redirectUrl }}', redirectUrl)
    );
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
      .replace('{{ content }}', this.modifyHtml(title, content));
    // extra data
    data = {...this.getVendorData(), ...data};
    Object.keys(data).forEach(
      key =>
        (result = result.replace(new RegExp(`{{ ${key} }}`, 'g'), data[key]))
    );
    // result
    return this.contentService.formatHtml(result);
  }

  copyThemeAssets() {
    const {webRender} = this.projectService.OPTIONS;
    const assetsPath = this.getAssetsPath();
    const outPath = resolve(webRender.out as string, 'assets');
    if (pathExistsSync(assetsPath)) {
      copySync(assetsPath, outPath);
    }
  }

  private modifyHtml(title: string, content: string) {
    content =
      `<div class="title"><h1>${title}</h1></div>` +
      this.contentService.EOL2X +
      content;
    return content.replace(/<table>/g, '<table class="table">');
  }

  private getTheme() {
    return this.contentService.readFileSync(this.getThemePath());
  }

  private getVendorData() {
    const data: WebData = {};
    const {
      name: pkgName,
      homepage,
      repository: {url: repoUrl} = {url: undefined},
    } = this.projectService.PACKAGE;
    const {url} = this.projectService.OPTIONS;
    if (pkgName) {
      data['siteName'] = pkgName + ' documentation';
    }
    if (url) {
      data['siteUrl'] = url;
    }
    if (homepage) {
      data['homeUrl'] = homepage || url;
    }
    if (repoUrl) {
      data['repoUrl'] = repoUrl.replace('.git', '');
    }
    return data;
  }

  private themesDir() {
    const localPath = resolve('node_modules', '@lamnhan', 'ayedocs');
    const appRoot = pathExistsSync(localPath) ? localPath : '' + APP_ROOT;
    return resolve(appRoot, 'src', 'lib', 'themes');
  }

  private defaultIndexPath() {
    return resolve(this.themesDir(), 'index.html');
  }

  private vendorThemePath(themeName: string) {
    return resolve(this.themesDir(), themeName, `${themeName}.html`);
  }

  private getThemePath() {
    const {
      webRender: {theme: websiteTheme = 'default'},
    } = this.projectService.OPTIONS;
    return websiteTheme.substr(-5) === '.html'
      ? this.localPath(websiteTheme)
      : this.vendorThemePath(websiteTheme);
  }

  private getAssetsPath() {
    const paths = this.getThemePath().split(sep);
    paths.pop(); // remove file name
    return paths.join(sep) + sep + 'assets';
  }

  private localPath(path: string) {
    return resolve(path.replace('@', 'src/').replace('~', 'node_modules/'));
  }
}
