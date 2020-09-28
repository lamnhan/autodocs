import {red} from 'chalk';
import {Command} from 'commander';
import {Lib as AyedocsModule} from '../lib/index';

import {GenerateCommand} from './commands/generate.command';
import {ShowCommand} from './commands/show.command';
import {PreviewCommand} from './commands/preview.command';

export class Cli {
  private ayedocsModule: AyedocsModule;
  generateCommand: GenerateCommand;
  showCommand: ShowCommand;
  previewCommand: PreviewCommand;

  commander = ['ayedocs', 'Document generator for Typescript projects.'];

  /**
   * @params [input] - The rendering input
   */
  showCommandDef: CommandDef = ['show [input]', 'Show Declaration info.'];

  /**
   * @params [input] - The rendering input
   * @params [output] - The converting output
   * @params [params...] - The convert options
   */
  previewCommandDef: CommandDef = [
    'preview [input] [output] [params...]',
    'Preview a rendering.',
  ];

  /**
   * @params [path] - Path to the output file
   */
  generateCommandDef: CommandDef = [
    'generate [path]',
    'Generate the documentation.',
    ['-c, --config [value]', 'Path to custom config file.'],
    ['-p, --package [value]', 'Path to custom package file.'],
    ['-t, --template [value]', 'Use this template for the [path] param.'],
  ];

  constructor() {
    this.ayedocsModule = new AyedocsModule();
    this.generateCommand = new GenerateCommand(this.ayedocsModule);
    this.showCommand = new ShowCommand(this.ayedocsModule.parseService);
    this.previewCommand = new PreviewCommand(
      this.ayedocsModule.contentService,
      this.ayedocsModule.convertService,
      this.ayedocsModule.parseService
    );
  }

  getApp() {
    const commander = new Command();

    // general
    const [command, description] = this.commander;
    commander
      .version(require('../../package.json').version, '-v, --version')
      .name(`${command}`)
      .usage('[options] [command]')
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
        .action((input, output, params) =>
          this.previewCommand.run(input, output, params)
        );
    })();

    // generate
    (() => {
      const [
        command,
        description,
        configOpt,
        packageOpt,
        templateOpt,
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
      .action(cmd => console.error(red(`Unknown command '${cmd.args[0]}'`)));

    return commander;
  }
}

type CommandDef = [string, string, ...Array<[string, string]>];
