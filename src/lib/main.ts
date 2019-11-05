import { resolve } from 'path';

import { RenderOptions } from './types';
import { OptionsInput, ProjectService } from './services/project';
import { TypedocService } from './services/typedoc';
import { ContentService } from './services/content';
import { LoadService } from './services/load';
import { ParseService } from './services/parse';
import { ConvertService } from './services/convert';
import { Rendering, BatchRendering, RenderService } from './services/render';
import { BuiltinTemplate, TemplateService } from './services/template';

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
  private templateService: TemplateService;

  constructor(optionsInput?: OptionsInput) {
    this.projectService = new ProjectService(optionsInput);
    this.typedocService = new TypedocService(this.projectService);
    this.contentService = new ContentService();
    this.loadService = new LoadService(this.contentService);
    this.parseService = new ParseService(
      this.projectService,
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
    this.templateService = new TemplateService();
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
   * Create a new instance
   * @param options - Custom options
   */
  extend(optionsInput?: OptionsInput) {
    return new Main(optionsInput);
  }

  /**
   * Render content based on local configuration.
   */
  renderLocal() {
    const { render } = this.projectService.OPTIONS;
    // convert files to batch rendering
    const batchRendering: BatchRendering = {};
    const currentContentPaths: string[] = [];
    Object.keys(render).forEach(path => {
      const renderValue = render[path];
      let renderOptions = {};
      // template
      if (typeof renderValue === 'string') {
        batchRendering[path] = this.templateService.getTemplate(
          renderValue as BuiltinTemplate
        );
      }
      // rendering
      else if (
        !renderValue.template &&
        !renderValue.rendering
      ) {
        batchRendering[path] = renderValue as Rendering;
      }
      // with options
      else {
        batchRendering[path] =
          !!renderValue.template
          ? this.templateService.getTemplate(renderValue.template as BuiltinTemplate)
          : renderValue.rendering as Rendering;
        // set options
        renderOptions = renderValue;
      }
      // clean output or not
      const { cleanOutput } = renderOptions as RenderOptions;
      if (!cleanOutput) {
        currentContentPaths.push(path);
      }
    });
    // render files
    const batchCurrentContent = this.loadService.batchLoad(currentContentPaths);
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
    const renderResult = this.renderService.render(
      rendering,
      currentContent,
      path.substr(-5) === '.html'
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
    const { apiGenerator, outPath } = this.projectService.OPTIONS;
    // api output, default to 'docs', 
    const apiOut = !outPath || outPath === '.'
      ? resolve('docs')
      : resolve(outPath, 'api');
    // custom
    if (apiGenerator instanceof Function) {
      apiGenerator(this.typedocService, apiOut);
    }
    // typedoc
    else if (apiGenerator === 'typedoc') {
      this.typedocService.generateDocs(apiOut);
    }
    // none
    else {}
  }
}
