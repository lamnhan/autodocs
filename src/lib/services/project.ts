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

  get API_URL() {
    const { url } = this.options;
    return url + (this.hasWebOutput() ? '/api' : '');
  }

  hasWebOutput() {
    const { webRender } = this.options;
    return !!Object.keys(webRender.files).length;
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
      const path = !!optionsInput ? resolve(optionsInput) : this.defaultLocalPath;
      options = pathExistsSync(path) ? require(path) : pkgOptions;
    }
    // api url
    let url = options.url;
    if (!url) {
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
    // options
    return {
      url,
      srcPath: 'src',
      apiGenerator: 'typedoc',
      typedocConfigs: {},
      cleanOutput: false,
      noAttr: false,
      fileRender: {},
      converts: {},
      ...options,
      webRender,
    } as ProjectOptions;
  }

}
