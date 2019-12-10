import { resolve } from 'path';
import { pathExistsSync, readJsonSync } from 'fs-extra';

import { Options, WebRender } from '../types';

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
  '@lamnhan/ayedocs': Options;
}

type ProjectOptions = {
  [P in keyof Options]-?: Options[P];
};

export class ProjectService {
  private defaultConfigPath = 'ayedocs.config.js';
  private defaultPackagePath = 'package.json';

  private package: PackageJson;
  private options: ProjectOptions;

  constructor(
    optionsInput?: OptionsInput,
    packagePath?: string
  ) {
    // set package
    this.package = !!packagePath
      ? this.getPackage(packagePath)
      : this.getLocalPackage();
    // set options
    this.options = !!optionsInput
      ? this.getOptions(optionsInput)
      : this.getLocalOptions();
  }

  get PACKAGE() {
    return this.package;
  }

  get OPTIONS() {
    return this.options;
  }

  get REF_URL() {
    const { url } = this.options;
    return url + (this.hasWebOutput() ? '/reference' : '');
  }

  hasWebOutput() {
    const { webRender } = this.options;
    return !!Object.keys(webRender.files).length;
  }

  private getLocalPackage() {
    return this.getPackage(this.defaultPackagePath);
  }

  private getLocalOptions() {
    return this.getOptions(
      pathExistsSync(this.defaultConfigPath)
      ? this.defaultConfigPath
      : this.package['@lamnhan/ayedocs'] || {}
    );
  }

  private getPackage(path: string) {
    return readJsonSync(resolve(path)) as PackageJson;
  }

  private getOptions(optionsInput: OptionsInput) {
    // get options
    const options: Options =
      typeof optionsInput === 'string'
      ? require(resolve(optionsInput)) // from path
      : optionsInput; // by input
    // url
    let url = options.url;
    if (!url) {
      const { repository: { url: repoUrl } } = this.package;
      const [, org, repo] = repoUrl
        .replace('https://', '')
        .replace('.git', '')
        .split('/');
      url = `https://${org}.github.io/${repo}`;
    }
    // web render
    const webRender: WebRender = {
      out: 'docs',
      files: {},
      ...(options.webRender || {})
    };
    // typedoc
    // tslint:disable-next-line: no-any
    const typedocConfigs: {[key: string]: any} = {};
    if (!!Object.keys(webRender.files).length) {
      typedocConfigs['readme'] = 'none';
    }
    // options
    return {
      url,
      srcPath: 'src',
      apiGenerator: 'typedoc',
      cleanOutput: false,
      fileRender: {},
      converts: {},
      ...options,
      typedocConfigs,
      webRender,
    } as ProjectOptions;
  }

}
