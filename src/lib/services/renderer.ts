import { EOL } from 'os';

import { Project } from './project';
import { ContentBySections, Block, Content } from './content';
import { Parser } from './parser';
import { ConvertOptions, Converter } from './converter';
import { ThisConverter } from 'typedoc/dist/lib/converter/types';

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
export class Renderer {
  private $Project: Project;
  private $Content: Content;
  private $Parser: Parser;
  private $Converter: Converter;

  private tocPlaceholder = '[TOC]';

  constructor(
    $Project: Project,
    $Content: Content,
    $Parser: Parser,
    $Converter: Converter
  ) {
    this.$Project = $Project;
    this.$Content = $Content;
    this.$Parser = $Parser;
    this.$Converter = $Converter;
  }

  render(rendering: Rendering, currentContent: ContentBySections = {}, html = false) {
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
          this.$Content.sectionOpening(sectionName, {
            note: 'AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY',
          }),
          // content
          sectionName === 'toc' || sectionName === 'tocx'
            ? this.tocPlaceholder
            : this.$Content.renderContent(sectionData),
          // closing
          this.$Content.sectionClosing()
        );
        // toc data
        tocData.push(...sectionData);
      }
      // current content
      else {
        contentData.push(
          // opening
          this.$Content.sectionOpening(sectionName),
          // content
          sectionData,
          // closing
          this.$Content.sectionClosing()
        );
        // toc data
        tocData.push(...this.$Content.extractHeadings(EOL + sectionData));
      }
    });
    // render content
    let content = this.$Content.renderText(contentData);
    // add toc
    if (!!data.toc || !!data.tocx) {
      const toc = this.$Content.renderContent(
        !!data.tocx
        ? this.getDataTOCX(tocData)
        : this.getDataTOC(tocData)
      );
      content = content.replace(this.tocPlaceholder, toc);
    }
    // render links
    content = this.$Content.convertLinks(content, id => this.$Parser.parse(id).LINK);
    // result
    // TODO: support html output
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
      batchResult[id] = this.render(
        rendering,
        currentContent,
        id.indexOf('.html') !== -1
      );
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
            const declaration = this.$Parser.parse(input);
            const blocks = this.$Converter.convert(declaration, output, options);
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
    if (!this.$Project.OPTIONS.noAttr) {
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
    const { name, description } = this.$Project.PACKAGE;
    return [this.$Content.blockText([`# ${name}`, `**${description}**`])];
  }

  private getDataLicense() {
    const {
      name,
      license,
      repository: { url: repoUrl },
    } = this.$Project.PACKAGE;
    const licenseUrl = repoUrl.replace('.git', '') + '/blob/master/LICENSE';
    return [
      this.$Content.blockText([
        '## License',
        `**${name}** is released under the [${license}](${licenseUrl}) license.`,
      ]),
    ];
  }

  private getDataAttr() {
    return [
      this.$Content.blockText([
        '---',
        `⚡️ This document is generated automatically using [@lamnhan/docsuper](https://github.com/lamnhan/docsuper).`,
      ]),
    ];
  }

  private getDataTOC(blocks: Block[]) {
    const tocContent = this.$Content.renderTOC(blocks);
    return [this.$Content.blockText([`**Table of content**`, tocContent])];
  }

  private getDataTOCX(blocks: Block[]) {
    const { apiUrl } = this.$Project.OPTIONS;
    blocks.push(this.$Content.blockHeading('Detail API reference', 2, undefined, apiUrl));
    return this.getDataTOC(blocks);
  }
}
