import { DeclarationReflection, ReflectionKind } from 'typedoc';

import { DetailListItem } from './content';
import { DeclarationData } from './typedoc';
import { Docs } from './docs';

export class Interface {

  private docs: Docs;

  interfaceDeclaration: DeclarationReflection;

  constructor(docs: Docs, name?: string) {
    this.docs = docs;
    this.interfaceDeclaration = this.docs.typedoc.getDeclaration(name);
  }

  getProperties() {
    return this.docs.typedoc.getDeclarationChildren(
      this.interfaceDeclaration,
      ReflectionKind.Property,
    );
  }

  iterateProperties(
    handler: (data: DeclarationData, rawData: DeclarationData) => void
  ) {
    return this.getProperties().forEach(prop => {
      const rawData = this.docs.typedoc.parseDeclaration(prop);
      const data = this.processData(rawData);
      return handler(data, rawData);
    });
  }

  processData(data: DeclarationData) {
    const { name, type, typeLink, isOptional, shortText = '', text, link } = data;
    return {
      name: !isOptional ? `**${name}**` : name,
      type: !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
      shortText,
      text,
      link,
    };
  }

  renderHeader() {
    const { name, shortText = '', text = '' } = this.docs.typedoc.parseDeclaration(this.interfaceDeclaration);
    return this.docs.content.generateMDContent([
      `## ${name}`,
      shortText,
      text,
    ]);
  }

  renderSummary() {
    const headers = ['Name', 'Type', 'Description'];
    const content: string[][] = [];
    this.iterateProperties(data => {
      const { name, type, shortText = '' } = data;
      content.push([ name, type, shortText ])
    });
    return this.docs.content.generateMDTable(headers, content);
  }

  renderDetail() {
    const items: DetailListItem[] = [];
    this.iterateProperties(data => {
      const { name, type, shortText = '', text } = data;
      items.push({
        title: `#### ${name}`,
        description: shortText,
        content: text,
        parts: [
          '**Type**', type,
        ]
      });
    });
    return this.docs.content.generateMDDetailList(items);
  }

  renderFull() {
    const { name } = this.interfaceDeclaration;
    const header = this.renderHeader();
    const summary = this.renderSummary();
    const detail = this.renderDetail();
    return this.docs.content.generateMDContent([
      header,
      `### ${name} summary`,
      summary,
      `### ${name} detail`,
      detail,
    ]);
  }

}