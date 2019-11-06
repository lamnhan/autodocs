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

  private heading: {[path: string]: HeadingBlock[]} = {};
  private globalHeadings: HeadingBlock[] = [];
  private content: {[path: string]: string} = {};
  private option: {[path: string]: RenderOptions} = {};

  constructor(
    private projectService: ProjectService,
    private contentService: ContentService,
    private parseService: ParseService,
    private webService: WebService,
    data: RendererData
  ) {
    // save data by path
    Object.keys(data).forEach(path => {
      const { headings, content, options } = data[path];
      this.heading[path] = headings;
      this.content[path] = content;
      this.option[path] = options;
    });
    // save global heading
    this.globalHeadings = this.getGlobalHeadings();
  }

  getResult(path: string) {
    const { outputMode } = this.projectService.OPTIONS;
    const { title, webData = {} } = this.option[path] || {};
    // content
    let content = this.content[path];
    content = this.renderLinks(path, content);
    content = this.modifyHtml(content);
    // result
    return outputMode === 'file'
      ? content
      : this.webService.buildPage(
        content,
        this.contentService.md2Html(
          this.contentService.renderTOC(this.globalHeadings, 1),
        ),
        title,
        webData,
      );
  }

  getResultAll() {
    const result: {[path: string]: string} = {};
    Object.keys(this.content).forEach(path => result[path] = this.content[path]);
    return result;
  }

  private fileUrl(path: string) {
    const { url } = this.projectService.OPTIONS;
    return url + '/' + path;
  }
  
  private getGlobalHeadings() {
    const result: HeadingBlock[] = [];
    Object.keys(this.heading).forEach(path => {
      const { title } = this.option[path] || {};
      const headings = this.heading[path];
      // save data
      result.push(
        this.contentService.blockHeading(
          title || path,
          1,
          undefined,
          this.fileUrl(path)
        ),
        ...headings,
      );
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
    return content.replace(/<table>/g, '<table class="table">');
  }

}