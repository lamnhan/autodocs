import chalk from 'chalk';
import * as commander from 'commander';

import { Docsuper } from '../lib/main';

export class CLI {
  private lib: Docsuper;

  constructor() {
    this.lib = new Docsuper();
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
    this.lib.outputLocal();
    // generate detail api
    this.lib.generateDocs();
  }
}
