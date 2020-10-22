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
   * @param [input] - The rendering input
   */
  showCommandDef: CommandDef = [
    ['show [input]', 's'],
    'Show Declaration info.',
  ];

  /**
   * @param [input] - The rendering input
   * @param [output] - The converting output
   * @param [params...] - The convert options
   */
  previewCommandDef: CommandDef = [
    ['preview [input] [output] [params...]', 'p'],
    'Preview a rendering.',
  ];

  /**
   * @param [path] - Path to the output file
   */
  generateCommandDef: CommandDef = [
    ['generate [path]', 'g'],
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
      const [[command, ...aliases], description] = this.showCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(input => this.showCommand.run(input));
    })();

    // preview
    (() => {
      const [[command, ...aliases], description] = this.previewCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action((input, output, params) =>
          this.previewCommand.run(input, output, params)
        );
    })();

    // generate
    (() => {
      const [
        [command, ...aliases],
        description,
        configOpt,
        packageOpt,
        templateOpt,
      ] = this.generateCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .option(...configOpt)
        .option(...packageOpt)
        .option(...templateOpt)
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

type CommandDef = [string | string[], string, ...Array<[string, string]>];
