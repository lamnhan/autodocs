import { Options } from './types';
import { Project } from './services/project';
import { Typedoc } from './services/typedoc';
import { ContentBySections, Content } from './services/content';
import { Loader } from './services/loader';
import { Parser } from './services/parser';
import { ConvertOptions, Converter } from './services/converter';
import { Rendering, BatchRendering, Renderer } from './services/renderer';

import { Declaration } from './components/declaration';

/**
 * The Main service
 */
export class Main {
  private $Project: Project;
  private $Typedoc: Typedoc;
  private $Content: Content;
  private $Loader: Loader;
  private $Parser: Parser;
  private $Converter: Converter;
  private $Renderer: Renderer;

  constructor(options?: Options) {
    this.$Project = new Project(options);
    this.$Typedoc = new Typedoc(this.$Project);
    this.$Content = new Content();
    this.$Loader = new Loader(this.$Content);
    this.$Parser = new Parser(this.$Typedoc, this.$Content);
    this.$Converter = new Converter(this.$Project, this.$Content);
    this.$Renderer = new Renderer(
      this.$Project,
      this.$Content,
      this.$Parser,
      this.$Converter
    );
  }

  /**
   * Get the Project service
   */
  get Project() {
    return this.$Project;
  }

  /**
   * Get the Typedoc service
   */
  get Typedoc() {
    return this.$Typedoc;
  }

  /**
   * Get the Content service
   */
  get Content() {
    return this.$Content;
  }

  /**
   * Get the Loader service
   */
  get Loader() {
    return this.$Loader;
  }

  /**
   * Get the Parser service
   */
  get Parser() {
    return this.$Parser;
  }

  /**
   * Get the Converter service
   */
  get Converter() {
    return this.$Converter;
  }

  /**
   * Get the Renderer service
   */
  get Renderer() {
    return this.$Renderer;
  }

  /**
   * Turn the source code into a [Declaration](https://lamnhan.github.io/classes/declaration.html).
   * @param what - Parsing input
   * @param child - Parse a certain child
   */
  parse(what?: string | string[], child?: string) {
    return this.$Parser.parse(what, child);
  }

  /**
   * Convert a declaration into content blocks.
   * @param declaration - The declaration
   * @param output - Expected [output](#converter)
   * @param options - Custom convertion options
   */
  convert(declaration: Declaration, output: string, options?: ConvertOptions) {
    return this.$Converter.convert(declaration, output, options);
  }

  /**
   * Render content based on configuration.
   * @param rendering - Redering configuration
   * @param currentContent - Current content by sections
   */
  render(rendering: Rendering, currentContent: ContentBySections = {}) {
    return this.$Renderer.render(rendering, currentContent);
  }

  /**
   * Render content based on local configuration.
   */
  renderLocal() {
    const { files = {} } = this.$Project.OPTIONS;
    // convert files to batch rendering
    const batchRendering: BatchRendering = {};
    Object.keys(files).forEach(path => {
      const value = files[path];
      batchRendering[path] =
        typeof value === 'string' ? this.$Project.getTemplate(value) : value;
    });
    // render files
    const batchCurrentContent = this.$Loader.batchLoad(
      Object.keys(batchRendering)
    );
    // result
    return this.$Renderer.renderBatch(batchRendering, batchCurrentContent);
  }

  /**
   * Render and save a document
   * @param path - Path to the document
   * @param rendering - Rendering configuration
   */
  output(path: string, rendering: Rendering) {
    const currentContent = this.$Loader.load(path);
    const renderResult = this.render(rendering, currentContent);
    return this.$Content.writeFileSync(path, renderResult);
  }

  /**
   * Render and save documents based on local configuration.
   */
  outputLocal() {
    const batchRenderResult = this.renderLocal();
    Object.keys(batchRenderResult).forEach(path =>
      this.$Content.writeFileSync(path, batchRenderResult[path])
    );
  }

  /**
   * Generate the API reference using Typedoc.
   *
   * The default folder is __/docs__. You can change the output folder by providing the `out` property of [Options](#options).
   */
  generateDocs() {
    const { out } = this.$Project.OPTIONS;
    return this.$Typedoc.generateDocs(out as string);
  }
}

export { Main as Autodocs };
