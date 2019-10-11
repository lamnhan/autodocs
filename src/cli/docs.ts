import { Autodocs } from '../lib/main';

export class DocsCommand {
  private lib: Autodocs;

  constructor(lib: Autodocs) {
    this.lib = lib;
  }

  docs() {
    const { files: batchRendering = {} } = this.lib.Project.OPTIONS;
    const batchCurrentContent = this.lib.Loader.batchLoad(
      Object.keys(batchRendering)
    );
    const batchResult = this.lib.Renderer.batchRender(
      batchRendering,
      batchCurrentContent,
    );
    Object.keys(batchResult).forEach(path => {
      const { toc, content } = batchResult[path];
      console.log('File: ', path);
      console.log(toc);
      console.log(content);
    });
  }

  api() {
    const { out } = this.lib.Project.OPTIONS;
    return this.lib.Typedoc.generateDocs(out as string);
  }

  readme() {
    console.log('readme');
  }
}
