import {
  Reflection,
  ReflectionKind,
  ReflectionData,
  Typedoc,
} from '../services/typedoc';
import { Block, Content } from '../services/content';

import { Interface } from './interface';
import { Method } from './method';

export interface ClassData extends ReflectionData {}

export class Class extends Interface {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    reflection: Reflection,
  ) {
    super($Typedoc, $Content, reflection);
  }
  
  getData() {
    return super.getData() as ClassData;
  }

  getMethods() {
    const methods: Method[] = [];
    // get all signatures
    this.Typedoc
      .getReflections(ReflectionKind.Method, this.REFLECTION)
      .forEach(item => item
        .getAllSignatures()
        .forEach((signature, i) => methods.push(
          // tslint:disable-next-line: no-any
          new Method(this.Typedoc, this.Content, signature as any)
            .setId(this.getChildId(signature.name + ' ' + i))
            .downLevel()
        ))
      );
    // result
    return methods;
  }
  
  getMethod(name: string) {
    const method = this.REFLECTION.getChildByName(name);
    if (!method) {
      throw new Error('No method!');
    }
    return new Method(this.Typedoc, this.Content, method)
      .setId(this.getChildId(method.name))
      .downLevel()
  }

  getRendering(mode: string) {
    switch (mode) {
      case 'full':
        return this.convertFull();
      case 'methods':
        return this.convertMethods();
      default:
        return super.getRendering(mode);
    }
  }

  convertMethods() {
    const blocks: Block[] = [];
    const className = this.REFLECTION.name;
    // get data
    const summaryRows: string[][] = [];
    const detailBlocks: Block[] = [];
    this.getMethods().forEach(method => {
      // summary
      const { name, type, typeLink, shortText } = method.getData();
      summaryRows.push([
        `[${name}](#${method.ID})`,
        !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
        shortText || ''
      ]);
      // detail
      detailBlocks.push(...method.convertSelf());
    });
    // summary blocks
    if (!!summaryRows.length) {
      const summaryText = this.Content.buildText(`**${className} methods**`);
      const summaryBlock = this.Content.buildTable(
        ['Method', 'Returns type', 'Description'],
        summaryRows
      );
      blocks.push(summaryText, summaryBlock);
    }
    // detail blocks
    if (!!detailBlocks.length) {
      const detailText = this.Content.buildText(`**${className} method detail**`);
      blocks.push(detailText, ...detailBlocks);
    }
    // result
    return blocks;
  }

  convertFull() {
    const selfBlocks = this.convertSelf();
    const propertiesBlocks = this.convertProperties();
    const methodsBlocks = this.convertMethods();
    return [ ...selfBlocks, ...propertiesBlocks, ...methodsBlocks ];
  }

}