import { resolve } from 'path';
import { pathExistsSync, readJsonSync } from 'fs-extra';

import { Options, BuiltinTemplate } from '../types';
import { Rendering } from './render';

interface PackageJson {
  name: string;
  version: string;
  description: string;
  author: string;
  homepage: string;
  license: string;
  repository: {
    type: string;
    url: string;
  };
  // options
  '@lamnhan/docsuper': Options;
}

type ProjectOptions = {
  [P in keyof Options]-?: Options[P];
};

export class ProjectService {
  private optionsPath = resolve('docsuper.config.js');

  private package: PackageJson;
  private options: ProjectOptions;

  constructor(options: Options = {}) {
    this.package = this.getPackage();
    this.options = this.getOptions(options);
  }

  get PACKAGE() {
    return this.package;
  }

  get OPTIONS() {
    return this.options;
  }

  getTemplate(name: BuiltinTemplate) {
    switch (name) {
      case 'mini':
        return this.getMiniTemplate();
      case 'full':
        return this.getFullTemplate();
      default:
        throw new Error('No template name ' + name);
    }
  }

  private getPackage() {
    return readJsonSync('package.json') as PackageJson;
  }

  private getOptions(options: Options = {}) {
    const {
      repository: { url: repoUrl },
      '@lamnhan/docsuper': pkgOptions = {},
    } = this.package;
    // get local options
    const localOptions: Options = (
      pathExistsSync(this.optionsPath)
      ? require(this.optionsPath)
      : pkgOptions
    );
    // default url
    if (!localOptions.apiUrl) {
      const [, org, repo] = repoUrl
        .replace('https://', '')
        .replace('.git', '')
        .split('/');
      localOptions.apiUrl = `https://${org}.github.io/${repo}`;
    }
    // options
    return {
      // url: local url | github url
      typedoc: {},
      apiGenerator: 'typedoc',
      files: {},
      converts: {},
      noAttr: false,
      ...localOptions,
      ...options,
    } as ProjectOptions;
  }

  private getMiniTemplate() {
    return {
      head: true,
      tocx: true,
      options: ['Options', 'FULL', { title: 'Options' }],
      main: ['Main', 'FULL', { title: 'Main service' }],
      license: true,
    } as Rendering;
  }

  private getFullTemplate() {
    return {
      head: true,
      toc: true,
      interfaces: ['*', 'SUMMARY_INTERFACES', { heading: true }],
      functions: ['*', 'FULL_FUNCTIONS', { heading: true }],
      classes: ['*', 'FULL_CLASSES', { heading: true }],
      license: true,
    } as Rendering;
  }
}
