import {resolve} from 'path';

import {OptionsInput, ProjectService} from './services/project.service';
import {TypedocService} from './services/typedoc.service';
import {ContentService} from './services/content.service';
import {LoadService} from './services/load.service';
import {ParseService} from './services/parse.service';
import {ConvertService} from './services/convert.service';
import {FileRender, RenderService} from './services/render.service';
import {TemplateService} from './services/template.service';
import {WebService} from './services/web.service';

export class Lib {
  projectService: ProjectService;
  typedocService: TypedocService;
  contentService: ContentService;
  loadService: LoadService;
  parseService: ParseService;
  convertService: ConvertService;
  renderService: RenderService;
  templateService: TemplateService;
  webService: WebService;

  constructor(optionsInput?: OptionsInput, packagePath?: string) {
    this.projectService = new ProjectService(optionsInput, packagePath);
    this.typedocService = new TypedocService(this.projectService);
    this.contentService = new ContentService(this.projectService);
    this.loadService = new LoadService(this.contentService);
    this.parseService = new ParseService(
      this.projectService,
      this.typedocService,
      this.contentService
    );
    this.convertService = new ConvertService(this.contentService);
    this.templateService = new TemplateService(
      this.projectService,
      this.contentService
    );
    this.webService = new WebService(this.projectService, this.contentService);
    this.renderService = new RenderService(
      this.projectService,
      this.contentService,
      this.loadService,
      this.parseService,
      this.convertService,
      this.templateService,
      this.webService
    );
  }

  /**
   * Create a new instance
   * @param options - Custom options
   */
  extend(optionsInput?: OptionsInput, packagePath?: string) {
    return new Lib(optionsInput, packagePath);
  }

  /**
   * Render a file
   * @param path - Path to file
   * @param renderInput - Render input
   */
  render(path: string, renderInput: FileRender) {
    return this.renderService
      .render({
        [path]: renderInput,
      })
      .getResult(path);
  }

  /**
   * Render content based on local configuration.
   */
  renderLocal() {
    const {fileRender, webRender} = this.projectService.OPTIONS;
    // file
    const fileRenderer = this.renderService.render(fileRender);
    const file = fileRenderer.getResultAll();
    const fileArticle = fileRenderer.getArticleAll();
    const fileArticleMenu = fileRenderer.getArticleMenu();
    // web
    const webRenderer = this.renderService.render(webRender.files, {}, true);
    const web = webRenderer.getResultAll();
    const webArticle = webRenderer.getArticleAll();
    const webArticleMenu = webRenderer.getArticleMenu();
    return {
      file,
      fileArticle,
      fileArticleMenu,
      web,
      webArticle,
      webArticleMenu,
    };
  }

  /**
   * Render and save a document
   * @param path - Path to the document
   * @param renderInput - Render input
   */
  output(path: string, renderInput: FileRender) {
    const content = this.render(path, renderInput);
    return this.contentService.writeFileSync(path, content);
  }

  /**
   * Render and save documents based on local configuration.
   */
  outputLocal() {
    const {url, webRender} = this.projectService.OPTIONS;
    const {
      file,
      fileArticle,
      fileArticleMenu,
      web,
      webArticle,
      webArticleMenu,
    } = this.renderLocal();
    // save main render
    const docsPath = webRender.out + '/';
    // file
    Object.keys(file).forEach(path =>
      this.contentService.writeFileSync(path, file[path])
    );
    // web
    if (this.projectService.hasWebOutput()) {
      Object.keys(web).forEach(path =>
        this.contentService.writeFileSync(docsPath + path, web[path])
      );
      // copy assets
      this.webService.copyThemeAssets();
    }
    // api menu
    const apiRecordMenu = {...fileArticleMenu, ...webArticleMenu};
    // api articles
    const apiPath = docsPath + 'api/';
    const apiArticlesPath = apiPath + 'articles/';
    const apiRecordArticles = {} as Record<string, Record<string, unknown>>;
    const apiFullRecordArticles = {} as Record<string, Record<string, unknown>>;
    const articles = {...fileArticle, ...webArticle};
    Object.keys(articles).forEach(path => {
      const {title, originalSrc, src, type, ext, slug, content} = articles[
        path
      ];
      // output file
      this.contentService.writeFileSync(apiArticlesPath + path, content);
      // add article
      apiRecordArticles[path] = {title, originalSrc, src, type, ext, slug};
      apiFullRecordArticles[path] = {
        title,
        originalSrc,
        src,
        type,
        ext,
        slug,
        content,
      };
    });
    // jsons
    this.contentService.writeJsonSync(apiPath + 'articles.json', {
      docsUrl: url,
      recordMenu: apiRecordMenu,
      recordArticles: apiRecordArticles,
    });
    this.contentService.writeJsonSync(apiPath + 'full-articles.json', {
      docsUrl: url,
      recordMenu: apiRecordMenu,
      recordArticles: apiFullRecordArticles,
    });
  }

  /**
   * Generate the reference using Typedoc.
   *
   * The default folder is __/docs__. You can change the output folder by providing the `out` property of [[Options]].
   */
  generateRef() {
    const {refGenerator, webRender} = this.projectService.OPTIONS;
    const refOut = resolve(webRender.out as string, 'reference');
    // custom
    if (refGenerator instanceof Function) {
      refGenerator(this.typedocService, refOut);
    }
    // typedoc
    else if (refGenerator === 'typedoc') {
      this.typedocService.generateDocs(refOut);
    }
    // none
    else {
      console.log('No reference generated.');
    }
    // save redirect if no web output
    if (!this.projectService.hasWebOutput()) {
      const indexHtmlContent = this.webService.getIndex('reference/index.html');
      this.contentService.writeFileSync(
        webRender.out + '/' + 'index.html',
        indexHtmlContent
      );
    }
  }
}
