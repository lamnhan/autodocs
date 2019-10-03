import {
  ReflectionKind,
  DeclarationReflection,
  DeclarationData,
  Typedoc,
} from './typedoc';
import { Block, Content } from './content';

export interface IterateData {
  property: DeclarationReflection;
  propertyData: DeclarationData;
  displayData: {
    displayName: string;
    displayType: string;
  };
}

export class Interface {
  private typedoc: Typedoc;
  private content: Content;

  baseLevel = 2;
  anchorPrefix = '';
  typedocInterface: DeclarationReflection;

  constructor(typedoc: Typedoc, content: Content, name: string) {
    this.typedoc = typedoc;
    this.content = content;
    // get the interface
    this.typedocInterface = this.typedoc.getDeclaration(name);
  }

  setLevel(level: number) {
    this.baseLevel = level;
    return this;
  }

  setPrefix(prefix: string) {
    this.anchorPrefix = prefix;
    return this;
  }

  getInterface() {
    return this.typedocInterface;
  }

  getInterfaceData() {
    return this.typedoc.parseDeclaration(this.typedocInterface);
  }

  getProperties() {
    return this.typedoc.getDeclarationChildren(
      this.typedocInterface,
      ReflectionKind.Property
    );
  }

  getPropertiesData() {
    return this.getProperties().map(property =>
      this.typedoc.parseDeclaration(property)
    );
  }

  iterateProperties(handler: (data: IterateData) => void) {
    return this.getProperties().forEach(property => {
      const propertyData = this.typedoc.parseDeclaration(property);
      // build display values
      const { name, type, isOptional, typeUrl } = propertyData;
      const displayData = {
        displayName: !isOptional ? `**${name}**` : name,
        displayType: !!typeUrl ? `[\`${type}\`](${typeUrl})` : `\`${type}\``,
      };
      // emit event
      return handler({ property, propertyData, displayData });
    });
  }

  getInterfaceRendering() {
    const { name, shortText, text, link } = this.getInterfaceData();
    // build blocks
    const head = this.content.buildHeader(this.baseLevel, name, link);
    const body = this.content.buildText([
      shortText || `The \`name\` interface.`,
      text || '',
    ]);
    // result
    return [head, body];
  }

  getPropertiesRendering() {
    const summaryRows: string[][] = [];
    const detailBlocks: Block[] = [];
    // iterate and extract
    this.iterateProperties(({ propertyData, displayData }) => {
      const { name: parentName } = this.typedocInterface;
      const { shortText, text, link } = propertyData;
      const { displayName, displayType } = displayData;
      const description = shortText || '';
      const content = text || '';
      const anchor = this.content.anchor(parentName + '-' + displayName);
      // summary
      const displayNameAnchoring = `[${displayName}](#${anchor})`;
      summaryRows.push([displayNameAnchoring, displayType, description]);
      // detail
      const head = this.content.buildHeader(
        this.baseLevel + 2,
        displayName,
        link,
        anchor
      );
      const body = this.content.buildText([
        description,
        content,
        '**Type**',
        displayType,
        '---',
      ]);
      detailBlocks.push(head);
      detailBlocks.push(body);
    });
    // result
    const summaryBlock = this.content.buildTable(
      ['Name', 'Type', 'Description'],
      summaryRows
    );
    return { summaryBlock, detailBlocks };
  }

  getFullRendering() {
    const interfaceBlocks = this.getInterfaceRendering();
    const { summaryBlock, detailBlocks } = this.getPropertiesRendering();
    // summary & detail header
    const { name } = this.typedocInterface;
    const summaryHeader = this.content.buildHeader(
      this.baseLevel + 1,
      `${name} summary`
    );
    const detailHeader = this.content.buildHeader(
      this.baseLevel + 1,
      `${name} detail`
    );
    return [
      ...interfaceBlocks,
      summaryHeader,
      summaryBlock,
      detailHeader,
      ...detailBlocks,
    ] as Block[];
  }

  renderInterface() {
    const blocks = this.getInterfaceRendering();
    return this.content.renderContent(blocks);
  }

  renderSummary() {
    const { summaryBlock } = this.getPropertiesRendering();
    return this.content.renderBlock(summaryBlock);
  }

  renderDetail() {
    const { detailBlocks: blocks } = this.getPropertiesRendering();
    return this.content.renderContent(blocks);
  }

  renderFull() {
    const blocks = this.getFullRendering();
    return this.content.renderContent(blocks);
  }
}
