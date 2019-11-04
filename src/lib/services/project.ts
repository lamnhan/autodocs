import { resolve } from 'path';
import { pathExistsSync, readJsonSync } from 'fs-extra';

import { Options } from '../types';

export type OptionsInput = string | Options;

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
  private defaultLocalPath = resolve('docsuper.config.js');

  private package: PackageJson;
  private options: ProjectOptions;

  constructor(optionsInput?: OptionsInput) {
    this.package = this.getPackage();
    this.options = this.getOptions(optionsInput);
  }

  get PACKAGE() {
    return this.package;
  }

  get OPTIONS() {
    return this.options;
  }

  private getPackage() {
    return readJsonSync('package.json') as PackageJson;
  }

  private getOptions(optionsInput?: OptionsInput) {
    const {
      repository: { url: repoUrl },
      '@lamnhan/docsuper': pkgOptions = {},
    } = this.package;
    // get options
    let options: Options = {};
    // by input
    if (!!optionsInput && optionsInput instanceof Object) {
      options = optionsInput;
    }
    // from path or package.json
    else {
      const path = optionsInput || this.defaultLocalPath;
      options = pathExistsSync(path) ? require(path) : pkgOptions;
    }
    // api url
    let apiUrl = options.apiUrl;
    if (!apiUrl) {
      const [, org, repo] = repoUrl
        .replace('https://', '')
        .replace('.git', '')
        .split('/');
      apiUrl = `https://${org}.github.io/${repo}`;
    }
    // options
    return {
      srcPath: 'src',
      outPath: '.',
      apiUrl,
      apiGenerator: 'typedoc',
      typedocConfigs: {},
      outputMode: 'file',
      websiteTheme: 'default',
      render: {},
      converts: {},
      noAttr: false,
      ...options,
    } as ProjectOptions;
  }

}
