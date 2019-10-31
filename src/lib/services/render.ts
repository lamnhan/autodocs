import { ProjectService } from './project';
import { ContentBySections, Block, Heading, ContentService } from './content';
import { ParseService } from './parse';
import { ConvertOptions, ConvertService } from './convert';

export interface Rendering {
  [section: string]: true | SectionRendering;
}

export type SectionRendering =
  | BlockRendering // single
  | BlockRendering[]; // multiple

export type BlockRendering = Block | DeclarationRendering;
export type DeclarationRendering = [string, string?, ConvertOptions?];

export interface RenderingData {
  [section: string]: SectionRenderingData;
}

export type SectionRenderingData = Block[];

export interface BatchRendering {
  [id: string]: Rendering;
}

export interface BatchRenderingData {
  [id: string]: RenderingData;
}

export interface BatchRenderResult {
  [id: string]: string;
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
    private parseService: ParseService,
    private convertService: ConvertService
  ) {}

  render(
    rendering: Rendering,
    currentContent: ContentBySections = {}
  ) {
    // get rendering data
    const renderingData = this.getData(rendering);
    // merge data
    const data: {
      [section: string]: string | Block[];
    } = {
      ...currentContent,
      ...renderingData,
    };
    // extract toc & content data
    const tocData: Block[] = [];
    const contentData: string[] = [];
    Object.keys(data).forEach(sectionName => {
      const sectionData = data[sectionName];
      // rendered content
      if (sectionData instanceof Array) {
        contentData.push(
          // opening
          this.contentService.sectionOpening(sectionName, {
            'data-note': 'AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY',
          }),
          // content
          sectionName === 'toc' || sectionName === 'tocx'
            ? this.tocPlaceholder
            : this.contentService.renderContent(sectionData),
          // closing
          this.contentService.sectionClosing()
        );
        // toc data
        tocData.push(...sectionData);
      }
      // current content
      else {
        contentData.push(
          // opening
          this.contentService.sectionOpening(sectionName),
          // content
          sectionData,
          // closing
          this.contentService.sectionClosing()
        );
        // toc data
        tocData.push(
          ...this.contentService.extractHeadings(sectionData)
        );
      }
    });
    // render content
    let content = this.contentService.renderText(contentData);
    // add toc
    if (!!data.toc || !!data.tocx) {
      const toc = this.contentService.renderContent(
        !!data.tocx ? this.getDataTOCX(tocData) : this.getDataTOC(tocData)
      );
      content = content.replace(this.tocPlaceholder, toc);
    }
    // render links
    const localHeadings: {[id: string]: Heading} = {};
    this.contentService.extractHeadings(content).forEach(
      block => localHeadings[block.data.id as string] = block.data
    );
    content = this.contentService.convertLinks(
      content,
      input => {
        try {
          const { ID, LINK } = this.parseService.parse(input);
          return !!localHeadings[ID] ? '#' + ID : LINK;
        } catch (error) {
          return '';
        }
      }
    );
    // result
    return content;
  }

  renderBatch(
    batchRendering: BatchRendering,
    batchCurrentContent: {
      [id: string]: ContentBySections;
    } = {}
  ) {
    const batchResult: BatchRenderResult = {};
    Object.keys(batchRendering).forEach(id => {
      const rendering = batchRendering[id];
      const currentContent = batchCurrentContent[id] || {};
      batchResult[id] = this.render(rendering, currentContent);
    });
    return batchResult;
  }

  getData(rendering: Rendering) {
    const data: RenderingData = {};
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
    if (!this.projectService.OPTIONS.noAttr) {
      data.attr = this.getDataAttr();
    }
    // result
    return data;
  }

  getDataBatch(batchRendering: BatchRendering) {
    const batchData: BatchRenderingData = {};
    Object.keys(batchRendering).forEach(
      id => (batchData[id] = this.getData(batchRendering[id]))
    );
    return batchData;
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
    const { apiUrl } = this.projectService.OPTIONS;
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
