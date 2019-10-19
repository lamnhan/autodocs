import { resolve } from 'path';
import { pathExistsSync, readJsonSync } from 'fs-extra';

import { Options, BuiltinTemplate } from '../types';
import { Rendering } from './renderer';

export interface PackageJson {
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
  '@lamnhan/autodocs': Options;
}

export class Project {
  private optionsPath = resolve('autodocs.json');

  private package: PackageJson;
  private options: Options;

  constructor(options: Options = {}) {
    // package.json
    this.package = this.getPackageJson();
    // autodocs options
    const localOptions = this.getLocalOptions();
    this.options = {
      ...localOptions,
      ...options,
    };
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

  private getPackageJson() {
    return readJsonSync('package.json') as PackageJson;
  }

  private getLocalOptions() {
    const {
      repository: { url: repoUrl },
      '@lamnhan/autodocs': pkgOptions = {},
    } = this.package;
    // get options
    const options: Options = pathExistsSync(this.optionsPath)
      ? readJsonSync(this.optionsPath)
      : pkgOptions;
    // default github url
    if (!options.url) {
      const [, org, repo] = repoUrl
        .replace('https://', '')
        .replace('.git', '')
        .split('/');
      options.url = `https://${org}.github.io/${repo}`;
    }
    // default out
    options.out = options.out || 'docs';
    // default noAttr
    options.noAttr = options.noAttr || false;
    // default files
    options.files = options.files || {};
    // options
    return options;
  }

  private getMiniTemplate() {
    return {
      head: true,
      toc: true,
      options: ['Options', 'FULL', { title: 'Options' }],
      main: ['Main', 'FULL', { title: 'Main service' }],
      license: true,
    } as Rendering;
  }

  private getFullTemplate() {
    return {
      head: true,
      toc: true,
      interfaces: [
        {
          type: 'header',
          data: {
            id: 'interfaces',
            level: 2,
            title: 'Interfaces',
          },
        },
        ['*', 'SUMMARY_INTERFACES'],
      ],
      functions: [
        {
          type: 'header',
          data: {
            id: 'functions',
            level: 2,
            title: 'Functions',
          },
        },
        ['*', 'FULL_FUNCTIONS'],
      ],
      classes: [
        {
          type: 'header',
          data: {
            id: 'classes',
            level: 2,
            title: 'Classes',
          },
        },
        ['*', 'FULL_CLASSES'],
      ],
      license: true,
    } as Rendering;
  }
}
