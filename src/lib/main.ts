import { resolve } from 'path';

import { OptionsInput, ProjectService } from './services/project';
import { TypedocService } from './services/typedoc';
import { ContentService } from './services/content';
import { LoadService } from './services/load';
import { ParseService } from './services/parse';
import { ConvertService } from './services/convert';
import { RenderInput, RenderService } from './services/render';
import { TemplateService } from './services/template';
import { WebService } from './services/web';

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
  private webService: WebService;

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
    this.templateService = new TemplateService();
    this.webService = new WebService(
      this.projectService,
      this.contentService,
    );
    this.renderService = new RenderService(
      this.projectService,
      this.contentService,
      this.loadService,
      this.parseService,
      this.convertService,
      this.templateService,
      this.webService,
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
    return this.renderService
      .render({ [path]: renderInput })
      .getResult(path);
  }

  /**
   * Render content based on local configuration.
   */
  renderLocal() {
    const { render } = this.projectService.OPTIONS;
    return this.renderService
      .render(render)
      .getResultAll();
  }

  /**
   * Render and save a document
   * @param path - Path to the document
   * @param renderInput - Render input
   */
  output(path: string, renderInput: RenderInput) {
    const { outPath } = this.projectService.OPTIONS;
    const content = this.render(path, renderInput);
    return this.contentService.writeFileSync(outPath + '/' + path, content);
  }

  /**
   * Render and save documents based on local configuration.
   */
  outputLocal() {
    const { render } = this.projectService.OPTIONS;
    Object.keys(render).forEach(path => this.output(path, render[path]));
    // TODO: index
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
