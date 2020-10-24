import {pathExists, outputFile, outputJson} from 'fs-extra';

import {ProjectService} from '../../lib/services/project.service';

interface InitCommandOptions {
  override?: boolean;
}

export class InitCommand {
  constructor(private projectService: ProjectService) {}

  async run(commandOptions: InitCommandOptions) {
    const {
      DEFAULT_CONFIG_PATH,
      DEFAULT_PACKAGE_PATH,
      PACKAGE,
    } = this.projectService;
    if ((await pathExists(DEFAULT_CONFIG_PATH)) && !commandOptions.override) {
      console.log(`Error: ${DEFAULT_CONFIG_PATH} exists.`);
    } else {
      // output file
      await outputFile(
        DEFAULT_CONFIG_PATH,
        [
          'module.exports = {',
          '  fileRender: {',
          "    'README.md': 'basicx',",
          '  },',
          '};',
          '',
        ].join('\n')
      );
      const packageContent = {...PACKAGE};
      if (!packageContent.scripts) {
        packageContent.scripts = {};
      }
      packageContent.scripts.docs = 'ayedocs generate';
      await outputJson(DEFAULT_PACKAGE_PATH, packageContent, {spaces: 2});
      // result
      console.log(`Create: ${DEFAULT_CONFIG_PATH}`);
      console.log('Update: scripts.docs');
    }
  }
}
