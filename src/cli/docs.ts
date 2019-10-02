import { Autodocs } from '../lib/main';

export class DocsCommand {

  private lib: Autodocs;

  constructor(lib: Autodocs) {
    this.lib = lib;
  }

  docs() {
    const x = this.lib.getDocs('src/lib/types.ts').getInterface('Options');
    console.log(x.renderFull());
  }

  api() {
    return this.lib.getSRCDocs().generateDocs('docs');
  }

  readme() {
    console.log('readme');
  }

}