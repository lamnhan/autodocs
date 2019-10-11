import { resolve } from 'path';
import { pathExistsSync, readJsonSync } from 'fs-extra';

import { Options } from '../types';

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
}
