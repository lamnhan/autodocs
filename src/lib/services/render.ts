import { ProjectService } from './project';
import { ContentBySections, ContentBlock, ContentService, HeadingBlock } from './content';
import { LoadService } from './load';
import { ParseService } from './parse';
import { ConvertOptions, ConvertService } from './convert';
import { BuiltinTemplate, TemplateOptions, TemplateService } from './template';
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

export interface RenderWithOptions extends RenderOptions {
  template?: BuiltinTemplate;
  rendering?: Rendering;
  file?: string;
}

export interface RenderOptions {
  title?: string;
  cleanOutput?: boolean;
  templateOptions?: TemplateOptions;
  webData?: WebData;
}

export interface BatchRender {
  [path: string]: RenderInput;
}

export interface RenderResult {
  src: string;
  value: string | ContentBlock[];
}

/**
 * The Renderer turns a rendering input into the final content
 *
 * Builtin sections:
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

  /**
   * Render content based on configuration.
   * @param rendering - Redering configuration
   * @param currentContent - Current content by sections
   */
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
    const renderingData = this.getRenderingData(rendering);
    // merge data
    const { cleanOutput: localCleanOutput } = renderOptions;
    const data: {
      [section: string]: string | RenderResult;
    } = {
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
        const { src, value } = sectionData;
        // attrs
        sectionAttrs['data-src'] = src;
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
      const toc = this.contentService.renderContent(
        !!data.tocx
        ? this.getDataTOCX(headings)
        : this.getDataTOC(headings)
      );
      content = content.replace(this.tocPlaceholder, toc);
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

  getRenderingData(rendering: Rendering) {
    const data: {[section: string]: RenderResult} = {};
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
        // attr
        else if (sectionName === 'attr') {
          sectionBlocks = this.getDataAttr();
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
        sectionResult = {
          src: sectionRendering,
          value: this.contentService.readFileSync(sectionRendering),
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
      data[sectionName] = sectionResult;
    });
    // result
    return data;
  }

  private processRenderInput(renderInput: RenderInput) {
    let rendering: Rendering = {};
    let renderOptions: RenderOptions = {};
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
      !renderInput.rendering
    ) {
      rendering = renderInput as Rendering;
    }
    // with options
    else {
      rendering =
        !!renderInput.template
        ? // template
          this.templateService.getTemplate(renderInput.template as BuiltinTemplate)
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

  private getDataAttr() {
    return [
      this.contentService.blockText(
        [
          '---',
          `⚡️ This document is generated automatically using [@lamnhan/docsuper](https://github.com/lamnhan/docsuper).`,
        ]
      ),
    ];
  }

  private getDataTOC(blocks: ContentBlock[]) {
    const tocContent = this.contentService.renderTOC(blocks);
    return [
      this.contentService.blockText(
        [
          `**Table of content**`,
          tocContent
        ]
      ),
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
