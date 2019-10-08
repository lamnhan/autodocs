import {
  DeclarationReflection,
  ReflectionKind,
  KindString,
  DeclarationData,
  Typedoc
} from '../services/typedoc';
import { Block, Content } from '../services/content';

import { Base } from './base';
import { Property } from './property';

export interface InterfaceData extends DeclarationData {}

export class Interface extends Base {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    declaration: DeclarationReflection,
  ) {
    super($Typedoc, $Content, declaration);
  }

  getChildren<Child>(kind: KindString) {
    let children: unknown = [];
    if (kind === 'Property') {
      children = this.getProperties();
    } else {
      throw new Error('Not support kind of ' + kind);
    }
    // result
    return children as Child[];
  }

  getChild<Child>(name: string) {
    const declaration = this.Typedoc.getDeclaration(name, this.DECLARATION);
    const kind = declaration.kindString;
    // get child
    let child: unknown;
    if (kind === 'Property') {
      child = new Property(this.Typedoc, this.Content, declaration).downLevel();
    } else {
      throw new Error('Not support kind of ' + kind);
    }
    // result
    return child as Child;
  }
  
  getData() {
    return super.getData() as InterfaceData;
  }

  getRendering(mode: string) {
    if (mode === 'full') {
      return this.convertFull();
    } else if (mode === 'properties') {
      return this.convertProperties();
    } else {
      return super.getRendering(mode);
    }
  }

  getProperties() {
    return this.Typedoc
      .getDeclarations(ReflectionKind.Property, this.DECLARATION)
      .map(item =>
        new Property(this.Typedoc, this.Content, item)
          .downLevel()
          .setId(this.getChildId(item.name))
      );
  }

  convertProperties() {
    const summaryRows: string[][] = [];
    const detailBlocks: Block[] = [];
    this.getProperties().forEach(property => {
      // summary
      const { name, isOptional, type, typeLink, shortText } = property.getData();
      summaryRows.push([
        `[${!isOptional ? `**${name}**` : name}](#${this.getChildId(name)})`,
        !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
        shortText || '',
      ]);
      // detail
      detailBlocks.push(...property.convertSelf());
    });
    const summaryBlock = this.Content.buildTable(
      ['Name', 'Type', 'Description'],
      summaryRows
    );
    const interfaceName = this.DECLARATION.name;
    const summaryText = this.Content.buildText(`**${interfaceName} properties**`);
    const detailText = this.Content.buildText(`**${interfaceName} property detail**`);
    return [
      summaryText,
      summaryBlock,
      detailText,
      ...detailBlocks
    ];
  }

  convertFull() {
    const selfBlocks = this.convertSelf();
    const propertiesBlocks = this.convertProperties();
    return [ ...selfBlocks, ...propertiesBlocks ];
  }

}
