import { Project } from './project';
import { ContentBySections, Block, Content } from './content';
import { Parser } from './parser';
import { ConvertOptions, Converter } from './converter';

export interface BatchRendering {
  [id: string]: Rendering;
}

export interface Rendering {
  [section: string]: SectionRendering;
}

export type SectionRendering =
  | BlockRendering // single
  | BlockRendering[]; // multiple

export type BlockRendering = [string, string?, ConvertOptions?];

export interface BatchRenderingData {
  [id: string]: RenderingData;
}

export interface RenderingData {
  [section: string]: SectionRenderingData;
}

export type SectionRenderingData = Block[];

export interface BatchRenderResult {
  [id: string]: string;
}

export class Renderer {
  private $Project: Project;
  private $Content: Content;
  private $Parser: Parser;
  private $Converter: Converter;

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

  batchRender(
    batchRendering: BatchRendering,
    batchCurrentContent: { [id: string]: ContentBySections } = {}
  ) {
    const batchResult: BatchRenderResult = {};
    Object.keys(batchRendering).forEach(id => {
      const rendering = batchRendering[id];
      const currentContent = batchCurrentContent[id] || {};
      batchResult[id] = this.render(rendering, currentContent);
    });
    return batchResult;
  }

  render(rendering: Rendering, currentContent: ContentBySections = {}) {
    const content = currentContent;
    // get rendering data
    const renderingData = this.getData(rendering);
    // extract toc data & render section content
    const tocData: Block[] = [];
    Object.keys(renderingData).forEach(sectionName => {
      const sectionBlocks = renderingData[sectionName];
      // toc data
      tocData.push(...sectionBlocks);
      // content data
      content[sectionName] = this.$Content.renderContent(sectionBlocks);
    });
    // add head
    if (!!content.head) {
      content.head = this.renderHead();
    }
    // add toc
    if (!!content.toc) {
      content.toc = this.renderTOC(tocData);
    }
    // add license
    if (!!content.license) {
      content.license = this.renderLicense();
    }
    // add attr
    if (!this.$Project.OPTIONS.noAttr) {
      content.attr = this.renderAttr();
    }
    // sum-up content
    const finalContent: string[] = [];
    Object.keys(content).forEach(sectionName => {
      const sectionContent = content[sectionName];
      finalContent.push(
        this.$Content.getSectionOpening(sectionName),
        '<!-- Auto-generated content, please DO NOT edit directly. -->',
        sectionContent,
        this.$Content.getSectionClosing(sectionName)
      );
    });
    // render final content
    return this.$Content.renderText(finalContent);
  }

  getBatchData(batchRendering: BatchRendering) {
    const batchData: BatchRenderingData = {};
    Object.keys(batchRendering).forEach(
      id => (batchData[id] = this.getData(batchRendering[id]))
    );
    return batchData;
  }

  getData(rendering: Rendering) {
    const data: RenderingData = {};
    // get data for every section
    Object.keys(rendering).forEach(sectionName => {
      const sectionBlocks: Block[] = [];
      // turn single block rendering to multiple
      const sectionRendering = rendering[sectionName];
      const blockRenderings = (sectionRendering[0] instanceof Array
        ? sectionRendering
        : [sectionRendering]) as BlockRendering[];
      // get section blocks
      blockRenderings.forEach(blockRendering => {
        const [source, output = 'self', options = {}] = blockRendering;
        const what =
          !source || source === '*'
            ? undefined
            : source.indexOf('@') !== -1
            ? source.replace(/\@/g, 'src/').split('+')
            : source;
        const declaration = this.$Parser.parse(what);
        const blocks = this.$Converter.convert(declaration, output, options);
        // add all blocks as section blocks
        sectionBlocks.push(...blocks);
      });
      // render content
      data[sectionName] = sectionBlocks;
    });
    // result
    return data;
  }

  private renderHead() {
    const { name, description } = this.$Project.PACKAGE;
    return this.$Content.renderText([`# ${name}`, description]);
  }

  private renderTOC(blocks: Block[]) {
    const tocContent = this.$Content.renderTOC(blocks);
    return this.$Content.renderText([`**Table of content**`, tocContent]);
  }

  private renderLicense() {
    const {
      name,
      license,
      repository: { url: repoUrl },
    } = this.$Project.PACKAGE;
    const licenseUrl = repoUrl.replace('.git', '') + '/blob/master/LICENSE';
    return this.$Content.renderText([
      '## License',
      `**${name}** is released under the [${license}](${licenseUrl}) license.`,
    ]);
  }

  private renderAttr() {
    return this.$Content.renderText([
      '---',
      `⚡️ This document is generated automatically using [@lamnhan/autodocs](https://github.com/lamnhan/autodocs).`
    ]);
  }
}
