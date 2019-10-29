import { Options, BuiltinTemplate } from './types';
import { ProjectService } from './services/project';
import { TypedocService } from './services/typedoc';
import { ContentBySections, ContentService } from './services/content';
import { LoadService } from './services/load';
import { ParseService } from './services/parse';
import { ConvertOptions, ConvertService } from './services/convert';
import { Rendering, BatchRendering, RenderService } from './services/render';

import { Declaration } from './declaration';

/**
 * The Docsuper module
 */
export class Main {
  private projectService: ProjectService;
  private typedocService: TypedocService;
  private contentService: ContentService;
  private loadService: LoadService;
  private parseService: ParseService;
  private convertService: ConvertService;
  private renderService: RenderService;

  constructor(options?: Options) {
    this.projectService = new ProjectService(options);
    this.typedocService = new TypedocService(this.projectService);
    this.contentService = new ContentService();
    this.loadService = new LoadService(this.contentService);
    this.parseService = new ParseService(
      this.typedocService,
      this.contentService
    );
    this.convertService = new ConvertService(
      this.projectService,
      this.contentService
    );
    this.renderService = new RenderService(
      this.projectService,
      this.contentService,
      this.parseService,
      this.convertService
    );
  }

  /**
   * Get the Project service
   */
  get Project() {
    return this.projectService;
  }

  /**
   * Get the Typedoc service
   */
  get Typedoc() {
    return this.typedocService;
  }

  /**
   * Get the Content service
   */
  get Content() {
    return this.contentService;
  }

  /**
   * Get the Load service
   */
  get Load() {
    return this.loadService;
  }

  /**
   * Get the Parse service
   */
  get Parse() {
    return this.parseService;
  }

  /**
   * Get the Convert service
   */
  get Convert() {
    return this.convertService;
  }

  /**
   * Get the Render service
   */
  get Render() {
    return this.renderService;
  }

  /**
   * Turn the source code into a [[Declaration]].
   * @param input - Parsing input
   */
  parse(input?: string) {
    return this.parseService.parse(input);
  }

  /**
   * Convert a declaration into content blocks.
   * @param declaration - The declaration
   * @param output - Expected output, see [[ConvertService]]
   * @param options - Custom convertion options
   */
  convert(declaration: Declaration, output: string, options?: ConvertOptions) {
    return this.convertService.convert(declaration, output, options);
  }

  /**
   * Render content based on configuration.
   * @param rendering - Redering configuration
   * @param currentContent - Current content by sections
   */
  render(
    rendering: Rendering,
    currentContent: ContentBySections = {},
    html = false
  ) {
    return this.renderService.render(rendering, currentContent, html);
  }

  /**
   * Render content based on local configuration.
   */
  renderLocal() {
    const { files = {} } = this.projectService.OPTIONS;
    // convert files to batch rendering
    const batchRendering: BatchRendering = {};
    Object.keys(files).forEach(path => {
      const value = files[path];
      batchRendering[path] =
        typeof value === 'string'
          ? this.projectService.getTemplate(value as BuiltinTemplate)
          : value;
    });
    // render files
    const batchCurrentContent = this.loadService.batchLoad(
      Object.keys(batchRendering)
    );
    // result
    return this.renderService.renderBatch(batchRendering, batchCurrentContent);
  }

  /**
   * Render and save a document
   * @param path - Path to the document
   * @param rendering - Rendering configuration
   */
  output(path: string, rendering: Rendering) {
    const currentContent = this.loadService.load(path);
    const renderResult = this.render(
      rendering,
      currentContent,
      path.indexOf('.html') !== -1
    );
    return this.contentService.writeFileSync(path, renderResult);
  }

  /**
   * Render and save documents based on local configuration.
   */
  outputLocal() {
    const batchRenderResult = this.renderLocal();
    Object.keys(batchRenderResult).forEach(path =>
      this.contentService.writeFileSync(path, batchRenderResult[path])
    );
  }

  /**
   * Generate the API reference using Typedoc.
   *
   * The default folder is __/docs__. You can change the output folder by providing the `out` property of [[Options]].
   */
  generateDocs() {
    const { apiGenerator, typedoc } = this.projectService.OPTIONS;
    if (apiGenerator === 'typedoc') {
      this.typedocService.generateDocs(typedoc.out || 'docs');
    }
  }
}

export { Main as DocsuperModule };
