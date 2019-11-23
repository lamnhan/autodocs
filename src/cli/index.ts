import chalk from 'chalk';
import * as commander from 'commander';

import { ayedocs, DocsuperModule } from '../public-api';
import { GenerateCommand } from './commands/generate';
import { ShowCommand } from './commands/show';
import { PreviewCommand } from './commands/preview';

export class Cli {
  private docsuperModule: DocsuperModule;
  private generateCommand: GenerateCommand;
  private showCommand: ShowCommand;
  private previewCommand: PreviewCommand;

  commander = ['ayedocs', 'Document generator for Typescript projects.'];

  /**
   * @params [input] - The rendering input
   */
  showCommandDef: CommandDef = [
    'show [input]', 'Show Declaration info.'
  ];

  /**
   * @params [input] - The rendering input
   * @params [output] - The converting output
   * @params [params...] - The convert options
   */
  previewCommandDef: CommandDef = [
    'preview [input] [output] [params...]', 'Preview a rendering.'
  ];

  /**
   * @params [path] - Path to the output file
   */
  generateCommandDef: CommandDef = [
    'generate [path]',
    'Generate the documentation.',
    ['-c, --config [value]', 'Path to custom config file.'],
    ['-p, --package [value]', 'Path to custom package file.'],
    ['-t, --template [value]', 'Use this template for the [path] param.']
  ];

  constructor() {
    this.docsuperModule = ayedocs();
    this.generateCommand = new GenerateCommand(this.docsuperModule);
    this.showCommand = new ShowCommand(this.docsuperModule.Parse);
    this.previewCommand = new PreviewCommand(
      this.docsuperModule.Content,
      this.docsuperModule.Convert,
      this.docsuperModule.Parse,
    );
  }

  getApp() {
    const [command, description] = this.commander;
    commander
      .version(require('../../package.json').version, '-v, --version')
      .usage(`${command} [options] [command]`)
      .description(description);

    // show
    (() => {
      const [command, description] = this.showCommandDef;
      commander
        .command(command)
        .description(description)
        .action(input => this.showCommand.run(input));
    })();

    // preview
    (() => {
      const [command, description] = this.previewCommandDef;
      commander
        .command(command)
        .description(description)
        .action((input, output, params) => this.previewCommand.run(input, output, params));
    })();

    // generate
    (() => {
      const [
        command,
        description,
        configOpt,
        packageOpt,
        templateOpt
      ] = this.generateCommandDef;
      commander
        .command(command)
        .description(description)
        .option(...configOpt) // -c, --config
        .option(...packageOpt) // -c, --package
        .option(...templateOpt) // -t, --template
        .action((path, options) => this.generateCommand.run(path, options));
    })();

    // help
    commander
      .command('help')
      .description('Display help.')
      .action(() => commander.outputHelp());

    // *
    commander
      .command('*')
      .description('Any other command is not supported.')
      .action((cmd: string) =>
        console.error(chalk.red(`Unknown command '${cmd}'`))
      );

    return commander;
  }

}

type CommandDef = [string, string, ...Array<[string, string]>];
