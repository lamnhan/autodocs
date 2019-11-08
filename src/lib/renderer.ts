import { ProjectService } from './services/project';
import { HeadingBlock, ContentService } from './services/content';
import { ParseService } from './services/parse';
import { RenderOptions } from './services/render';
import { WebService } from './services/web';

export interface RendererData {
  [path: string]: RendererFileData;
}

export interface RendererFileData {
  headings: HeadingBlock[];
  content: string;
  options: RenderOptions;
}

export class Renderer {

  private webOutput: boolean;
  private heading: {[path: string]: HeadingBlock[]} = {};
  private webMenuHeadings: HeadingBlock[] = [];
  private content: {[path: string]: string} = {};
  private option: {[path: string]: RenderOptions} = {};

  constructor(
    private projectService: ProjectService,
    private contentService: ContentService,
    private parseService: ParseService,
    private webService: WebService,
    data: RendererData,
    webOutput = false
  ) {
    // file or web
    this.webOutput = webOutput;
    // save data by path
    Object.keys(data).forEach(path => {
      const { headings, content, options } = data[path];
      this.heading[path] = headings;
      this.content[path] = content;
      this.option[path] = options;
    });
    // save global heading
    this.webMenuHeadings = this.getWebMenuHeadings();
  }

  getResult(path: string) {
    const { title, webData = {} } = this.option[path] || {};
    // content
    let content = this.content[path];
    content = this.renderLinks(path, content);
    content = this.modifyHtml(content);
    // menu
    const activeLink = this.fileUrl(path);
    const menu = this.contentService
      .md2Html(this.contentService.renderTOC(this.webMenuHeadings, 1))
      .replace(new RegExp(`href="${activeLink}"`), `class="active" $&`);
    // result
    return this.webOutput
      ? this.webService.buildPage(content, menu, title, webData)
      : content;
  }

  getResultAll() {
    const result: {[path: string]: string} = {};
    const paths: string[] = [];
    // pages
    Object.keys(this.content).forEach(path => {
      paths.push(path);
      result[path] = this.getResult(path)
    });
    // index.html
    if (this.webOutput && !result['index.html']) {
      result['index.html'] = this.webService.getIndex(
        this.fileUrl(paths[0])
      );
    }
    // result
    return result;
  }

  private fileUrl(path: string) {
    const { url } = this.projectService.OPTIONS;
    return url + '/' + path;
  }
  
  private getWebMenuHeadings() {
    const result: HeadingBlock[] = [];
    Object.keys(this.heading).forEach(path => {
      const [category] = path.indexOf('/') !== -1
        ? path.split('/')
        : [undefined, path];
      // build heading
      const { title } = this.option[path] || {};
      const headingBlock = this.contentService.blockHeading(
        title || path,
        !!category ? 2 : 1,
        undefined,
        this.fileUrl(path)
      );
      // save data
      if (!!category) {
        const {
          webRender: {
            categories: websiteCategories = {}
          }
        } = this.projectService.OPTIONS;
        const categoryBlock = this.contentService.blockHeading(
          websiteCategories[category] || category,
          1,
        );
        result.push(categoryBlock);
      }
      result.push(headingBlock);
    });
    // result
    return result;
  }

  private renderLinks(currentPath: string, content: string) {
    const localHeadings: {[id: string]: true} = {};
    const peerHeadings: {[id: string]: string} = {};
    // build heading list
    Object.keys(this.heading).forEach(path => {
      // local
      if (currentPath === path) {
        this.heading[path].forEach(
          block => localHeadings[block.data.id as string] = true
        );
      }
      // peer
      else {
        this.heading[path].forEach(
          block => peerHeadings[block.data.id as string] = path
        );
      }
    });
    // render
    return this.contentService.convertLinks(
      content,
      input => {
        try {
          const { ID, LINK } = this.parseService.parse(input);
          // local
          if (!!localHeadings[ID]) {
            return '#' + ID;
          }
          // peer
          else if (!!peerHeadings[ID]) {
            return this.fileUrl(peerHeadings[ID]) + '#' + ID
          }
          // api
          else {
            return LINK;
          }
        } catch (error) {
          return '';
        }
      }
    );
  }

  private modifyHtml(content: string) {
    return content
      .replace(/<table>/g, '<table class="table">');
  }

}