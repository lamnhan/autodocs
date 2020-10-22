import {ProjectService} from '../services/project.service';
import {HeadingBlock, ContentService} from '../services/content.service';
import {ParseService} from '../services/parse.service';
import {FileRenderWithOptions} from '../services/render.service';
import {WebService} from '../services/web.service';

export interface RendererData {
  [path: string]: RendererFileData;
}

export interface RendererFileData {
  headings: HeadingBlock[];
  content: string;
  options: FileRenderWithOptions;
}

export class RendererObject {
  private webOutput: boolean;
  private heading: {[path: string]: HeadingBlock[]} = {};
  private content: {[path: string]: string} = {};
  private option: {[path: string]: FileRenderWithOptions} = {};

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
      const {headings, content, options} = data[path];
      this.heading[path] = headings;
      this.content[path] = content;
      this.option[path] = options;
    });
  }

  getResult(path: string) {
    const {pageTitle, webData = {}} = this.option[path] || {};
    // finalize content
    const content = this.renderLinks(path, this.content[path]);
    // for stanalone file
    if (!this.webOutput) {
      return content;
    }
    // for web
    else {
      const menu = this.getWebMenu(path);
      return this.webService.buildPage(content, menu, pageTitle, webData);
    }
  }

  getResultAll() {
    const result: {[path: string]: string} = {};
    const paths: string[] = [];
    // pages
    Object.keys(this.content).forEach(path => {
      paths.push(path);
      result[path] = this.getResult(path);
    });
    // index.html
    if (this.webOutput && !result['index.html']) {
      result['index.html'] = this.webService.getIndex(this.fileUrl(paths[0]));
    }
    // result
    return result;
  }

  private fileUrl(path: string) {
    const {url} = this.projectService.OPTIONS;
    return url + '/' + path;
  }

  private getWebMenu(path: string) {
    // get headings
    const menuHeadings = this.getWebMenuHeadings(path);
    // render menu
    const activeLink = this.fileUrl(path);
    return this.contentService
      .md2Html(this.contentService.renderTOC(menuHeadings, 1))
      .replace(new RegExp(`href="${activeLink}"`), 'class="active" $&');
  }

  private getWebMenuHeadings(currentPath: string) {
    const result: HeadingBlock[] = [];
    let activeCategory: undefined | string;
    Object.keys(this.heading).forEach(path => {
      const [category] =
        path.indexOf('/') !== -1 ? path.split('/') : [undefined, path];
      // build heading
      const {pageTitle, deepMenu} = this.option[path] || {};
      const headingBlock = this.contentService.blockHeading(
        pageTitle || path,
        category ? 2 : 1,
        undefined,
        this.fileUrl(path)
      );
      // save category
      if (!!category && activeCategory !== category) {
        activeCategory = category;
        const {
          webRender: {categories: websiteCategories = {}},
        } = this.projectService.OPTIONS;
        const categoryBlock = this.contentService.blockHeading(
          websiteCategories[category] || category,
          1
        );
        result.push(categoryBlock);
      }
      // save heading
      result.push(headingBlock);
      // child menu
      if (deepMenu) {
        this.heading[path].forEach(block => {
          if (block.data.level === 2) {
            // down level if has category
            if (category) {
              ++block.data.level;
            }
            // modify deep links
            if (path !== currentPath) {
              block.data.link = this.fileUrl(path) + '#' + block.data.id;
              block.data.id = undefined;
            }
            // add block
            result.push(block);
          }
        });
      }
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
          block => (localHeadings[block.data.id as string] = true)
        );
      }
      // peer
      else {
        this.heading[path].forEach(
          block => (peerHeadings[block.data.id as string] = path)
        );
      }
    });
    const getAvailableHeadingLink = (id: string) => {
      let link: undefined | string;
      // local
      if (localHeadings[id]) {
        link = '#' + id;
      }
      // peer
      else if (peerHeadings[id]) {
        link = this.fileUrl(peerHeadings[id]) + '#' + id;
      }
      return link;
    };
    // render
    return this.contentService.convertLinks(content, input => {
      const headingLink = getAvailableHeadingLink(input);
      if (headingLink) {
        return headingLink;
      } else {
        try {
          const {ID, LINK} = this.parseService.parse(input);
          return getAvailableHeadingLink(ID) || LINK;
        } catch (error) {
          return undefined;
        }
      }
    });
  }
}