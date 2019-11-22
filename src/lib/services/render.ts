import { pathExistsSync } from 'fs-extra';

import { ProjectService } from './project';
import { ContentBySections, ContentBlock, ContentService, HeadingBlock } from './content';
import { LoadService } from './load';
import { ParseService } from './parse';
import { ConvertOptions, ConvertService } from './convert';
import { BuiltinTemplate, TemplateService } from './template';
import { WebData, WebService } from './web';

import { RendererData, RendererFileData, Renderer } from '../renderer';

/**
 * Rendering unit
 * 
 * true = builtin
 * string = file path
 * SectionRendering = single/multile block rendering
 */
export interface Rendering {
  [section: string]: true | string | SectionRendering;
}

export type SectionRendering =
  | BlockRendering // single
  | BlockRendering[]; // multiple

export type BlockRendering = ContentBlock | DeclarationRendering;

export type DeclarationRendering = [string, string?, ConvertOptions?];

export type RenderInput = 
  | string // direct file
  | BuiltinTemplate // direct template
  | Rendering // direct rendering
  | RenderWithOptions; // with options

export interface RenderWithOptions
  extends
  LocalRenderOptions,
  TemplateRenderOptions,
  WebRenderOptions,
  FileRenderOptions {
    template?: BuiltinTemplate;
    file?: string;
    rendering?: Rendering;
}

/**
 * Local options override any corresponding global options
 */
export interface LocalRenderOptions {
  /**
   * Ignore global sections (current content will be replaced) 
   */
  cleanOutput?: boolean;
}

/**
 * Web options provides more information for a web page
 */
export interface WebRenderOptions {
  /**
   * The page title
   */
  pageTitle?: string;
  /**
   * Show top level headings in the menu 
   */
  deepMenu?: boolean;
  /**
   * Data used in the webpage
   */
  webData?: WebData;
}

/**
 * Additional option for file rendering
 */
export interface FileRenderOptions {
  /**
   * Offset all the headings
   */
  headingOffset?: number;
  /**
   * Extract all headings
   */
  autoTOC?: boolean;
}

/**
 * Additional option for template rendering
 */
export interface TemplateRenderOptions {
  /**
   * Custom convert options by sections
   */
  convertings?: {[section: string]: ConvertOptions};
  /**
   * Sections to be appended before template sections
   */
  topSecs?: Rendering;
  /**
   * Sections to be appended after template sections
   */
  bottomSecs?: Rendering;
}

export interface BatchRender {
  [path: string]: RenderInput;
}

export interface RenderResult {
  src: string;
  value: string | ContentBlock[];
}

/**
 * Turns a render input into the final content
 * 
 * ### Builtin sections
 *
 * - `head`: Package name & description
 * - `toc`: Table of content
 * - `tocx`: Table of content, with detail API reference link
 * - `license`: License information
 */
export class RenderService {
  private tocPlaceholder = '[TOC]';

  constructor(
    private projectService: ProjectService,
    private contentService: ContentService,
    private loadService: LoadService,
    private parseService: ParseService,
    private convertService: ConvertService,
    private templateService: TemplateService,
    private webService: WebService,
  ) {}

  render(
    batchRender: BatchRender,
    batchCurrentContent: {[path: string]: ContentBySections} = {},
    webOutput = false,
  ) {
    const rendererData: RendererData = {};
    Object.keys(batchRender).forEach(path => {
      const renderInput = batchRender[path];
      const currentContent = batchCurrentContent[path] || {};
      rendererData[path] = this.getData(
        path,
        renderInput,
        currentContent,
      );
    });
    return new Renderer(
      this.projectService,
      this.contentService,
      this.parseService,
      this.webService,
      rendererData,
      webOutput,
    );
  }

  getData(
    path: string,
    renderInput: RenderInput,
    currentContent: ContentBySections = {}
  ) {
    const { cleanOutput: globalCleanOutput } = this.projectService.OPTIONS;
    // process input
    const { rendering, renderOptions } = this.processRenderInput(renderInput);
    // get data by rendering
    const renderingData = this.getRenderingData(rendering, renderOptions);
    // merge data
    const { cleanOutput: localCleanOutput } = renderOptions;
    const data: {
      [section: string]: string | RenderResult;
    } = {
      // auto toc for file
      ...(
        renderOptions.autoTOC
        ? { toc: {src: 'true', value: []} }
        : {}
      ),
      // current content from file
      ...(
        !!localCleanOutput || // local = true
        (
          !!globalCleanOutput && // global = true
          localCleanOutput === undefined // local not provided
        )
        ? {}
        : this.loadService.load(path)
      ),
      // current content by arg
      ...currentContent,
      // rendering content
      ...renderingData,
    };
    // extract toc & content data
    const headings: ContentBlock[] = [];
    const contentStack: string[] = [];
    Object.keys(data).forEach(sectionName => {
      const sectionData = data[sectionName];
      // process section data
      let sectionContent: string;
      const sectionAttrs: {[attr: string]: string} = {};
      let sectionHeadings: string | HeadingBlock[] = [];
      // current content
      if (typeof sectionData === 'string') {
        sectionContent = sectionHeadings = sectionData;
      }
      // auto content
      else {
        const { value } = sectionData;
        // attrs
        sectionAttrs['data-note'] = 'AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!';
        // content
        if (typeof value === 'string') {
          sectionContent = sectionHeadings = value;
        } else {
          sectionContent =
            sectionName === 'toc' || sectionName === 'tocx'
            ? this.tocPlaceholder
            : this.contentService.renderContent(value);
          sectionHeadings = value
            .filter(block => block.type === 'heading') as HeadingBlock[];
        }
      }
      // save content to the stack
      contentStack.push(
        this.contentService.sectionOpening(sectionName, sectionAttrs),
        sectionContent,
        this.contentService.sectionClosing()
      );
      // save headings for toc
      headings.push(
        ...(
          typeof sectionHeadings === 'string'
          ? this.contentService.extractHeadings(sectionHeadings)
          : sectionHeadings
        )
      );
    });
    // render the content stack
    let content = this.contentService.renderText(contentStack);
    // add the toc
    if (!!data.toc || !!data.tocx) {
      const tocContent = this.contentService.renderContent(
        !!data.tocx
        ? this.getDataTOCX(headings)
        : this.getDataTOC(headings)
      );
      content = content.replace(this.tocPlaceholder, tocContent);
    }
    // result
    return {
      headings,
      content: (
        path.substr(-5) === '.html'
        ? this.contentService.md2Html(content)
        : content
      ),
      options: renderOptions,
    } as RendererFileData;
  }

  getRenderingData(rendering: Rendering, renderOptions: RenderWithOptions = {}) {
    const result: {[section: string]: RenderResult} = {};
    // get data for every section
    Object.keys(rendering).forEach(sectionName => {
      const sectionRendering = rendering[sectionName];
      let sectionResult: RenderResult;
      // build-in sections
      if (sectionRendering === true) {
        let sectionBlocks: ContentBlock[] = [];
        // head
        if (sectionName === 'head') {
          sectionBlocks = this.getDataHead();
        }
        // license
        else if (sectionName === 'license') {
          sectionBlocks = this.getDataLicense();
        }
        // toc, tocx ...
        else {
          sectionBlocks = [];
        }
        // builtin section result
        sectionResult = { src: 'true', value: sectionBlocks };
      }
      // file
      else if (typeof sectionRendering === 'string') {
        const { headingOffset } = renderOptions as FileRenderOptions;
        const filePath = sectionRendering.replace('@', 'src/');
        let content = 'TODO';
        if (pathExistsSync(filePath)) {
          content = this.contentService.readFileSync(filePath);
          if (!!headingOffset) {
            content = this.contentService.modifyHeadings(content, headingOffset);
          }
        }
        sectionResult = {
          src: sectionRendering,
          value: content,
        };
      }
      // declarations
      else {
        const declarationBlocks: ContentBlock[] = [];
        // turn single block rendering to multiple
        const blockRenderings =
          sectionRendering instanceof Array &&
          sectionRendering[0] instanceof Object // array or object
            ? // blocks or multi declarations
              (sectionRendering as BlockRendering[])
            : // a block or single declaration
              [sectionRendering as BlockRendering];
        // get section blocks
        blockRenderings.forEach(blockRendering => {
          // declaration
          if (blockRendering instanceof Array) {
            const [input, output = 'SELF', options = {}] = blockRendering;
            // parsing & converting
            const declaration = this.parseService.parse(input);
            const blocks = this.convertService.convert(
              declaration,
              output,
              options
            );
            // add all blocks as section blocks
            declarationBlocks.push(...blocks);
          }
          // block
          else {
            declarationBlocks.push(blockRendering);
          }
        });
        // declaration result
        sectionResult = {
          src: JSON.stringify(blockRenderings),
          value: declarationBlocks,
        };
      }
      // save rendering data
      result[sectionName] = sectionResult;
    });
    // result
    return result;
  }

  private processRenderInput(renderInput: RenderInput) {
    let rendering: Rendering = {};
    let renderOptions: RenderWithOptions = {};
    // file input
    if (
      typeof renderInput === 'string' &&
      renderInput.indexOf('.') !== -1 // a file
    ) {
      rendering = { content: renderInput };
    }
    // template
    else if (typeof renderInput === 'string') {
      rendering = this.templateService.getTemplate(
        renderInput as BuiltinTemplate
      );
    }
    // rendering
    else if (
      !renderInput.template &&
      !renderInput.rendering &&
      !renderInput.file
    ) {
      rendering = renderInput as Rendering;
    }
    // with options
    else {
      rendering =
        !!renderInput.template
        ? // template
          this.templateService.getTemplate(
            renderInput.template as BuiltinTemplate,
            renderInput as TemplateRenderOptions,
          )
        : !!renderInput.file
        ? // file
          { content: renderInput.file }
        : // rendering
          renderInput.rendering as Rendering;
      // set options
      renderOptions = renderInput;
    }
    return { rendering, renderOptions };
  }

  private getDataHead() {
    const { name, description } = this.projectService.PACKAGE;
    return [
      this.contentService.blockText(
        [
          `# ${name}`,
          `**${description}**`
        ]
      )
    ];
  }

  private getDataLicense() {
    const {
      name,
      license,
      repository: { url: repoUrl },
    } = this.projectService.PACKAGE;
    const licenseUrl = repoUrl.replace('.git', '') + '/blob/master/LICENSE';
    return [
      this.contentService.blockText(
        [
          '## License',
          `**${name}** is released under the [${license}](${licenseUrl}) license.`,
        ]
      ),
    ];
  }

  private getDataTOC(blocks: ContentBlock[]) {
    const tocContent = this.contentService.renderTOC(blocks);
    return [
      this.contentService.blockText(tocContent),
    ];
  }

  private getDataTOCX(blocks: ContentBlock[]) {
    const apiRef = this.contentService.blockHeading(
      'Detail API reference',
      2,
      undefined,
      this.projectService.API_URL,
    );
    blocks.push(apiRef); // add api ref link
    return this.getDataTOC(blocks);
  }
}
