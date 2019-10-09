import {
  Reflection,
  ReflectionKind,
  ReflectionData,
  Typedoc
} from '../services/typedoc';
import { Block, Content } from '../services/content';

import { Declaration } from './declaration';
import { Property } from './property';

export interface InterfaceData extends ReflectionData {}

export class Interface extends Declaration {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    reflection: Reflection,
  ) {
    super($Typedoc, $Content, reflection);
  }

  getData() {
    return super.getData() as InterfaceData;
  }

  getProperties() {
    return this.Typedoc
      .getReflections(ReflectionKind.Property, this.REFLECTION)
      .map(item =>
        new Property(this.Typedoc, this.Content, item)
          .setId(this.getChildId(item.name))
          .downLevel()
      );
  }

  getProperty(name: string) {
    const property = this.REFLECTION.getChildByName(name);
    if (!property) {
      throw new Error('No property!');
    }
    return new Property(this.Typedoc, this.Content, property)
      .setId(this.getChildId(property.name))
      .downLevel()
  }

  getRendering(mode: string) {
    switch (mode) {
      case 'full':
        return this.convertFull();
      case 'properties':
        return this.convertProperties();
      default:
        return super.getRendering(mode);
    }
  }

  convertProperties() {
    const blocks: Block[] = [];
    const interfaceName = this.REFLECTION.name;
    // get data
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
    // summary blocks
    if (!!summaryRows.length) {
      const summaryText = this.Content.buildText(`**${interfaceName} properties**`);
      const summaryBlock = this.Content.buildTable(
        ['Name', 'Type', 'Description'],
        summaryRows
      );
      blocks.push(summaryText, summaryBlock);
    }
    // detail blocks
    if (!!detailBlocks.length) {
      const detailText = this.Content.buildText(`**${interfaceName} property detail**`);
      blocks.push(detailText, ...detailBlocks);
    }
    // result
    return blocks;
  }

  convertFull() {
    const selfBlocks = this.convertSelf();
    const propertiesBlocks = this.convertProperties();
    return [ ...selfBlocks, ...propertiesBlocks ];
  }

}
