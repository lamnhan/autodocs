import chalk from 'chalk';
import * as commander from 'commander';

import { Autodocs } from '../lib/main';
import { DocsCommand } from './docs';

export class CLI {
  private lib: Autodocs;
  private docsCommand: DocsCommand;

  constructor() {
    this.lib = new Autodocs();
    this.docsCommand = new DocsCommand(this.lib);
  }

  getApp() {
    commander
      .version(require('../../package.json').version, '-v, --version')
      .usage('autodocs [options] [command]')
      .description('Document generator for Typescript projects.');

    commander
      .command('docs')
      .description('Generate the readme.md & API reference.')
      .action(() => this.docsCommand.docs());

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
}
