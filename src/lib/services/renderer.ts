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
  [id: string]: RenderResult;
}

export interface RenderResult {
  toc: string;
  content: string;
}

export class Renderer {
  private $Content: Content;
  private $Parser: Parser;
  private $Converter: Converter;

  constructor(
    $Content: Content,
    $Parser: Parser,
    $Converter: Converter,
  ) {
    this.$Content = $Content;
    this.$Parser = $Parser;
    this.$Converter = $Converter;
  }
  
  batchRender(
    batchRendering: BatchRendering,
    batchCurrentContent: {[id: string]: ContentBySections} = {}
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
    // get rendering data
    const renderingData = this.getData(rendering);
    // merge with current data
    const blocksOrContentBySections = { ...currentContent, ...renderingData };
    // extract toc data & render section content
    const tocData: Block[] = [];
    const contentData: string[] = [];
    Object.keys(blocksOrContentBySections).forEach(sectionName => {
      const sectionData = blocksOrContentBySections[sectionName];
      // toc data
      if (sectionData instanceof Array) {
        tocData.push(...sectionData);
      }
      // content data
      contentData.push(
        this.$Content.getSectionOpening(sectionName),
        (sectionData instanceof Array)
          ? this.$Content.renderContent(sectionData)
          : sectionData,
        this.$Content.getSectionClosing(sectionName),
      );
    });
    // result
    const toc = this.$Content.renderTOC(tocData);
    const content = this.$Content.renderText(contentData);
    return { toc, content } as RenderResult;
  }

  getBatchData(batchRendering: BatchRendering) {
    const batchData: BatchRenderingData = {};
    Object.keys(batchRendering).forEach(id =>
      batchData[id] = this.getData(batchRendering[id])
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
      const blockRenderings = (
        sectionRendering[0] instanceof Array
        ? sectionRendering
        : [sectionRendering]
      ) as BlockRendering[];
      // get section blocks
      blockRenderings.forEach(blockRendering => {
        const [source, output = 'self', options = {}] = blockRendering;
        const what = !source || source === '*'
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

}
