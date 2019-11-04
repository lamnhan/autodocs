import chalk from 'chalk';
import * as commander from 'commander';
import { docsuper, DocsuperModule } from '../public-api';

import { GenerateCommand } from './commands/generate';
import { ShowCommand } from './commands/show';
import { PreviewCommand } from './commands/preview';

type CommandDef = [string, string, ...Array<[string, string]>];

export class Cli {
  private docsuperModule: DocsuperModule;

  private generateCommand: GenerateCommand;
  private showCommand: ShowCommand;
  private previewCommand: PreviewCommand;

  root = ['docsuper', 'Document generator for Typescript projects.'];

  showCommandDef: CommandDef = [
    'show [input]', 'Show Declaration info.'
  ];
  previewCommandDef: CommandDef = [
    'preview [input] [output] [params...]', 'Preview a rendering.'
  ];
  generateCommandDef: CommandDef = [
    'generate', 'Generate the documentation.',
    ['-c, --config [value]', 'Path to custom config file.']
  ];

  constructor() {
    this.docsuperModule = docsuper();
    this.generateCommand = new GenerateCommand(this.docsuperModule);
    this.showCommand = new ShowCommand(this.docsuperModule.Parse);
    this.previewCommand = new PreviewCommand(
      this.docsuperModule.Content,
      this.docsuperModule.Convert,
      this.docsuperModule.Parse,
    );
  }

  getApp() {
    const [command, description] = this.root;
    commander
      .version(require('../../package.json').version, '-v, --version')
      .usage(`${command} [options] [command]`)
      .description(description);

    // show
    (() => {
      const [command, description] = this.showCommandDef;
      commander.command(command).description(description)
        .action(input => this.showCommand.run(input));
    })();

    // preview
    (() => {
      const [command, description] = this.previewCommandDef;
      commander.command(command).description(description)
        .action((input, output, params) => this.previewCommand.run(input, output, params));
    })();

    // generate
    (() => {
      const [command, description, configOpt] = this.generateCommandDef;
      commander.command(command).description(description)
        .option(...configOpt) // -c, --config
        .action(options => this.generateCommand.run(options));
    })();

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
