import { readJsonSync } from 'fs-extra';

export interface Options {
  url?: string;
}

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
  constructor() {}

  getPackageJson(): PackageJson {
    return readJsonSync('package.json');
  }

  getOptions() {
    const {
      repository: { url: repoUrl },
      '@lamnhan/autodocs': options = {},
    } = this.getPackageJson();
    // default github url
    if (!options.url) {
      const [, org, repo] = repoUrl
        .replace('https://', '')
        .replace('.git', '')
        .split('/');
      options.url = `https://${org}.github.io/${repo}`;
    }
    // options
    return options;
  }
}
