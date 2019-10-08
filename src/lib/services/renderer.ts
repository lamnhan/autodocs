import { resolve } from 'path';
import { pathExistsSync } from 'fs-extra';

import { ContentBySections, Block, Content } from './content';
import { Parser } from './parser';

export interface RenderingConfig {
  [path: string]: FileRenderingConfig;
}

export interface FileRenderingConfig {
  [section: string]: SectionRenderingConfig;
}

export type SectionRenderingConfig = BlockRenderingConfig[];

export type BlockRenderingConfig = [string, string, string | string[]];

interface RenderingData {
  [path: string]: FileRenderingData;
};

interface FileRenderingData {
  [section: string]: Block[];
};

interface FilesContent {
  [path: string]: ContentBySections;
}

export class Renderer {

  private $Content: Content;
  private $Parser: Parser;

  private config: RenderingConfig = {};

  private currentContent: FilesContent = {};
  private renderingData: RenderingData = {};

  constructor (
    $Content: Content,
    $Parser: Parser,
    config: RenderingConfig = {},
  ) {
    this.$Content = $Content;
    this.$Parser = $Parser;
    this.config = config;
    // load data
    this.loadData();
  }

  extend(config: RenderingConfig) {
    return new Renderer(this.$Content, this.$Parser, config);
  }

  render() {
    const contentByFiles = this.getRenderedContent();
    Object.keys(contentByFiles).forEach(path => {
      console.log(path);
      console.log(contentByFiles[path]);
    });
  }

  private loadData() {
    const currentContent: FilesContent = {};
    const renderingData: RenderingData = {};
    // get data
    Object.keys(this.config).forEach(path => {
      // current content
      currentContent[path] = this.getFileCurrentContent(path);
      // redering data
      renderingData[path] = this.getFileRenderingData(this.config[path])
    });
    // result
    this.currentContent = currentContent;
    this.renderingData = renderingData;
  }

  private getFileCurrentContent(path: string) {
    let result: ContentBySections = {};
    const filePath = resolve(path);
    if (!!pathExistsSync(filePath)) {
      const content = this.$Content.readFileSync(filePath);
      result = this.$Content.extractSections(content);
    }
    return result;
  }

  private getFileRenderingData(fileConfig: FileRenderingConfig) {
    const result: FileRenderingData = {};
    Object.keys(fileConfig).forEach(sectionName =>
      result[sectionName] = this.getSectionRenderingData(fileConfig[sectionName])
    );
    return result;
  }

  private getSectionRenderingData(sectionConfig: SectionRenderingConfig) {
    const sectionBlocks: Block[] = [];
    // get section blocks
    sectionConfig.forEach(blockConfig => {
      const [ what, how, where ] = blockConfig;
      const item = this.$Parser.get(what, where);
      const blocks = item.getRendering(how);
      sectionBlocks.push(...blocks);
    });
    // result
    return sectionBlocks;
  }

  private getRenderedContent() {
    const result: {[path: string]: string} = {};
    Object.keys(this.config).forEach(path => {
      const contentBySections = this.getFileRenderedContentBySections(path);
      // add opening & closing
      const contentArr: string[] = [];
      Object.keys(contentBySections).forEach(sectionName => {
        const opening = this.$Content.getSectionOpening(sectionName);
        const closing = this.$Content.getSectionClosing(sectionName);
        const content = contentBySections[sectionName];
        contentArr.push(opening, content, closing);
      });
      // result
      result[path] = this.$Content.renderText(contentArr);
    });
    return result;
  }

  private getFileRenderedContentBySections(path: string) {
    // current content
    const currentFileContentBySections = this.currentContent[path] || {};
    // render content
    const fileRenderingData = this.renderingData[path] || {};
    const fileContentBySections: ContentBySections = {};
    Object.keys(fileRenderingData).forEach(sectionName =>
      fileContentBySections[sectionName] = this.$Content.renderContent(
        fileRenderingData[sectionName],
      ),
    );
    return {
      ...currentFileContentBySections,
      ...fileContentBySections,
    } as ContentBySections;
  }

}