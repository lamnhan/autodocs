import { Autodocs } from '../lib/main';

export class DocsCommand {
  private lib: Autodocs;

  constructor(lib: Autodocs) {
    this.lib = lib;
  }

  docs() {
    const t1 = this.lib.getInterface('Options');
    // const t2 = this.lib.getClass('Main');
    console.log(t1.renderFull());
    // console.log(t2.getMethodsData());
  }

  api() {
    return this.lib.generateDocs('docs');
  }

  readme() {
    console.log('readme');
  }
}
