import { Autodocs } from '../lib/main';

export class DocsCommand {
  private lib: Autodocs;

  constructor(lib: Autodocs) {
    this.lib = lib;
  }

  docs() {
    this.lib.Renderer.render();
  }

  api() {
    return this.lib.generateDocs();
  }

  readme() {
    console.log('readme');
  }
}
