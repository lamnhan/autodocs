import {resolve} from 'path';
import {pathExistsSync, readJsonSync, outputJsonSync} from 'fs-extra';

import {Options, WebRender} from '../types/ayedocs.type';

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
  scripts?: Record<string, string>;
  // options
  ayedocsrc: Options;
}

type ProjectOptions = {
  [P in keyof Options]-?: Options[P];
};

export class ProjectService {
  private defaultConfigPath = '.ayedocsrc.js';
  private defaultPackagePath = 'package.json';

  private package: PackageJson;
  private options: ProjectOptions;

  constructor(optionsInput?: OptionsInput, packagePath?: string) {
    // set package
    this.package = packagePath
      ? this.getPackage(packagePath)
      : this.getLocalPackage();
    // set options
    this.options = optionsInput
      ? this.getOptions(optionsInput)
      : this.getLocalOptions();
  }

  get DEFAULT_CONFIG_PATH() {
    return this.defaultConfigPath;
  }

  get DEFAULT_PACKAGE_PATH() {
    return this.defaultPackagePath;
  }

  get PACKAGE() {
    return this.package;
  }

  get OPTIONS() {
    return this.options;
  }

  get REF_URL() {
    const {url} = this.options;
    return url + (this.hasWebOutput() ? '/reference' : '');
  }

  hasWebOutput() {
    const {webRender} = this.options;
    return !!Object.keys(webRender.files).length;
  }

  getRepoUrl() {
    const {
      repository: {url: repoUrl} = {
        url: 'https://github.com/lamnhan/ayedocs.git',
      },
    } = this.package;
    return repoUrl;
  }

  getGithubInfo() {
    const repoUrl = this.getRepoUrl();
    const [, org, repo] =
      repoUrl.indexOf('github.com') !== -1
        ? repoUrl.replace('https://', '').replace('.git', '').split('/')
        : ['', 'lamnhan', 'ayedocs'];
    const url = `https://github.com/${org}/${repo}`;
    const ioUrl = `https://${org}.github.io/${repo}`;
    return {org, repo, url, ioUrl};
  }

  private getLocalPackage() {
    return this.getPackage(this.defaultPackagePath);
  }

  private getLocalOptions() {
    return this.getOptions(
      pathExistsSync(this.defaultConfigPath)
        ? this.defaultConfigPath
        : this.package['ayedocsrc'] || {}
    );
  }

  private getPackage(path: string) {
    if (!pathExistsSync(path)) {
      outputJsonSync(
        path,
        {
          name: '',
          version: '0.0.0',
          scripts: {},
        },
        {
          spaces: 2,
        }
      );
    }
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
      const {ioUrl: githubIOUrl} = this.getGithubInfo();
      url = githubIOUrl;
    }
    // web render
    const webRender: WebRender = {
      out: 'docs',
      files: {},
      ...(options.webRender || {}),
    };
    // typedoc
    const typedocConfigs: {[key: string]: unknown} = {};
    if (Object.keys(webRender.files).length) {
      typedocConfigs['readme'] = 'none';
    }
    // options
    return {
      url,
      srcPath: 'src',
      refGenerator: 'typedoc',
      cleanOutput: false,
      fileRender: {},
      ...options,
      typedocConfigs,
      webRender,
    } as ProjectOptions;
  }
}
