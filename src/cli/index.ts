import chalk from 'chalk';
import * as commander from 'commander';

import { Autodocs } from '../lib/main';
import { BatchRendering } from '../lib/services/renderer';

export class CLI {
  private lib: Autodocs;

  constructor() {
    this.lib = new Autodocs();
  }

  getApp() {
    commander
      .version(require('../../package.json').version, '-v, --version')
      .usage('autodocs [options] [command]')
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
//     const content = `
// <section id="xxx-1" title="AUTO-GENERATED CONTENT, DO NOT EDIT">

// ## XXX 1

// Lorem ipsum dolat init!

// </section>

// <section id="xxx-2" title="AUTO-GENERATED CONTENT, DO NOT EDIT">

// ## XXX 2

// Lorem ipsum dolat init!

// </section>
//     `;
//     console.log(this.lib.Content.extractSections(content));

    const { out, files = {} } = this.lib.Project.OPTIONS;
    const batchRendering: BatchRendering = {};
    // convert files to batch rendering
    Object.keys(files).forEach(path => {
      const value = files[path];
      batchRendering[path] =
        typeof value === 'string' ? this.lib.Project.getTemplate(value) : value;
    });
    // render files
    const batchCurrentContent = this.lib.Loader.batchLoad(
      Object.keys(batchRendering)
    );
    const batchResult = this.lib.Renderer.batchRender(
      batchRendering,
      batchCurrentContent
    );
    Object.keys(batchResult).forEach(path =>
      this.lib.Content.writeFileSync(path, batchResult[path])
    );
    // generate /docs
    // this.lib.Typedoc.generateDocs(out as string);
  }
}
