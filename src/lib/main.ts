import { resolve } from 'path';

import { RenderInput, RenderOptions } from './types';
import { OptionsInput, ProjectService } from './services/project';
import { TypedocService } from './services/typedoc';
import { ContentService } from './services/content';
import { LoadService } from './services/load';
import { ParseService } from './services/parse';
import { ConvertService } from './services/convert';
import { Rendering, RenderService } from './services/render';
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
    this.contentService = new ContentService(this.projectService);
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
   * Render a file
   * @param path - Path to file
   * @param renderInput - Render input
   */
  render(path: string, renderInput: RenderInput) {
    let rendering: Rendering = {};
    let renderOptions: RenderOptions = {};
    // template
    if (typeof renderInput === 'string') {
      rendering = this.templateService.getTemplate(
        renderInput as BuiltinTemplate
      );
    }
    // rendering
    else if (
      !renderInput.template &&
      !renderInput.rendering
    ) {
      rendering = renderInput as Rendering;
    }
    // with options
    else {
      rendering =
        !!renderInput.template
        ? this.templateService.getTemplate(renderInput.template as BuiltinTemplate)
        : renderInput.rendering as Rendering;
      // set options
      renderOptions = renderInput;
    }
    // current content (clean output or not)
    const { cleanOutput } = renderOptions;
    const currentContent = !cleanOutput ? this.loadService.load(path) : {};
    // result
    return this.renderService.render(
      rendering,
      currentContent,
      path.substr(-5) === '.html'
    );
  }

  /**
   * Render content based on local configuration.
   */
  renderLocal() {
    const { render } = this.projectService.OPTIONS;
    // render
    const result: {[path: string]: string} = {};
    Object.keys(render).forEach(path => result[path] = this.render(path, render[path]));
    // result
    return result;
  }

  /**
   * Render and save a document
   * @param path - Path to the document
   * @param renderInput - Render input
   */
  output(path: string, renderInput: RenderInput) {
    const content = this.render(path, renderInput);
    return this.contentService.writeFileSync(path, content);
  }

  /**
   * Render and save documents based on local configuration.
   */
  outputLocal() {
    const batchContent = this.renderLocal();
    Object.keys(batchContent).forEach(path =>
      this.contentService.writeFileSync(path, batchContent[path])
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
