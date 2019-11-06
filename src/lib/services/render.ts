import { ProjectService } from './project';
import { ContentBySections, Block, ContentService } from './content';
import { LoadService } from './load';
import { ParseService } from './parse';
import { ConvertOptions, ConvertService } from './convert';
import { BuiltinTemplate, TemplateOptions, TemplateService } from './template';
import { WebData, WebService } from './web';

import { RendererData, RendererFileData, Renderer } from '../renderer';

export interface Rendering {
  [section: string]: true | SectionRendering;
}

export type SectionRendering =
  | BlockRendering // single
  | BlockRendering[]; // multiple

export type BlockRendering = Block | DeclarationRendering;

export type DeclarationRendering = [string, string?, ConvertOptions?];

export type RenderInput = BuiltinTemplate | Rendering | RenderWithOptions;

export interface RenderWithOptions extends RenderOptions {
  template?: BuiltinTemplate;
  rendering?: Rendering;
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
    batchCurrentContent: {[path: string]: ContentBySections} = {}
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
      rendererData
    );
  }

  getData(
    path: string,
    renderInput: RenderInput,
    currentContent: ContentBySections = {}
  ) {
    // process input
    const { rendering, renderOptions } = this.processRenderInput(renderInput);
    // get data by rendering
    const renderingData = this.getRenderingData(rendering);
    // merge data
    const data: {
      [section: string]: string | Block[];
    } = {
      ...(
        !renderOptions.cleanOutput
        ? this.loadService.load(path)
        : {}
      ),
      ...currentContent,
      ...renderingData,
    };
    // extract toc & content data
    const headings: Block[] = [];
    const contentStack: string[] = [];
    Object.keys(data).forEach(sectionName => {
      const sectionData = data[sectionName];
      // rendered content
      if (sectionData instanceof Array) {
        contentStack.push(
          this.contentService.sectionOpening(sectionName, {
            'data-note': 'AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY',
          }),
          sectionName === 'toc' || sectionName === 'tocx'
            ? this.tocPlaceholder
            : this.contentService.renderContent(sectionData),
          this.contentService.sectionClosing()
        );
        // section headings
        const sectionHeadings = sectionData.filter(block => block.type === 'heading');
        headings.push(...sectionHeadings);
      }
      // current content
      else {
        contentStack.push(
          this.contentService.sectionOpening(sectionName),
          sectionData,
          this.contentService.sectionClosing()
        );
        // section headings
        const sectionHeadings = this.contentService.extractHeadings(sectionData);
        headings.push(...sectionHeadings);
      }
    });
    // render content
    let content = this.contentService.renderText(contentStack);
    // add toc
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

  private processRenderInput(renderInput: RenderInput) {
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
    return { rendering, renderOptions };
  }

  getRenderingData(rendering: Rendering) {
    const data: {[section: string]: Block[]} = {};
    // get data for every section
    Object.keys(rendering).forEach(sectionName => {
      const sectionRendering = rendering[sectionName];
      let sectionBlocks: Block[] = [];
      // build-in sections
      if (sectionRendering === true) {
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
      }
      // declarations
      else {
        const declarationBlocks: Block[] = [];
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
        // render content
        sectionBlocks = declarationBlocks;
      }
      // save rendering data
      data[sectionName] = sectionBlocks;
    });
    // add attr
    const { noAttr, outputMode } = this.projectService.OPTIONS;
    if (!noAttr && outputMode === 'file') {
      data.attr = this.getDataAttr();
    }
    // result
    return data;
  }

  private getDataHead() {
    const { name, description } = this.projectService.PACKAGE;
    return [this.contentService.blockText([`# ${name}`, `**${description}**`])];
  }

  private getDataLicense() {
    const {
      name,
      license,
      repository: { url: repoUrl },
    } = this.projectService.PACKAGE;
    const licenseUrl = repoUrl.replace('.git', '') + '/blob/master/LICENSE';
    return [
      this.contentService.blockText([
        '## License',
        `**${name}** is released under the [${license}](${licenseUrl}) license.`,
      ]),
    ];
  }

  private getDataAttr() {
    return [
      this.contentService.blockText([
        '---',
        `⚡️ This document is generated automatically using [@lamnhan/docsuper](https://github.com/lamnhan/docsuper).`,
      ]),
    ];
  }

  private getDataTOC(blocks: Block[]) {
    const tocContent = this.contentService.renderTOC(blocks);
    return [
      this.contentService.blockText([`**Table of content**`, tocContent]),
    ];
  }

  private getDataTOCX(blocks: Block[]) {
    const apiUrl = this.projectService.API_URL;
    blocks.push(
      this.contentService.blockHeading(
        'Detail API reference',
        2,
        undefined,
        apiUrl
      )
    );
    return this.getDataTOC(blocks);
  }
}
