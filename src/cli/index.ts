import chalk from 'chalk';
import * as commander from 'commander';

import { docsuper, DocsuperModule } from '../public-api';

export class CLI {
  private docsuperModule: DocsuperModule;

  constructor() {
    this.docsuperModule = docsuper();
  }

  /**
   * @ignore
   */
  getApp() {
    commander
      .version(require('../../package.json').version, '-v, --version')
      .usage('docsuper [options] [command]')
      .description('Document generator for Typescript projects.');

    commander
      .command('generate')
      .description('Generate the documentation.')
      .action(() => this.generate());

    commander
      .command('help')
      .description('Display help.')
      .action(() => commander.outputHelp());

    commander
      .command('*')
      .description('Any other command is not supported.')
      .action((cmd: string) =>
        console.error(chalk.red(`Unknown command '${cmd}'`))
      );

    return commander;
  }

  generate() {
    // generate files
    this.docsuperModule.outputLocal();
    // generate detail api
    this.docsuperModule.generateDocs();
  }
}
