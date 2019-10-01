import chalk from 'chalk';
import * as commander from 'commander';

export class CLI {

  constructor() {}

  getApp() {
    commander
      .version(require('../package.json').version, '-v, --version')
      .usage('autodocs [options] [command]')
      .description('Document generator for Typescript projects.');

    commander
      .command('help')
      .description('Display help.')
      .action(() => commander.outputHelp());

    commander
      .command('*')
      .description('Any other command is not supported.')
      .action((cmd: string) => console.error(chalk.red(`Unknown command '${cmd}'`)));

    return commander;
  }

}
