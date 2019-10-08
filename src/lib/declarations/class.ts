import {
  DeclarationReflection,
  ReflectionKind,
  DeclarationData,
  KindString,
  Typedoc,
} from '../services/typedoc';
import { Block, Content } from '../services/content';

import { Interface } from './interface';
import { Property } from './property';
import { Method } from './method';

export interface ClassData extends DeclarationData {}

export class Class extends Interface {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    item: DeclarationReflection,
  ) {
    super($Typedoc, $Content, item);
  }
  
  getData() {
    return super.getData() as ClassData;
  }

  getChildren<Child>(kind: KindString) {
    let children: unknown = [];
    if (kind === 'Property') {
      children = this.getProperties();
    } else if (kind === 'Method') {
      children = this.getMethods();
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
    } else if (kind === 'Method') {
      const { signatures = [] } = declaration;
      // tslint:disable-next-line: no-any
      child = new Method(this.Typedoc, this.Content, signatures[0] as any).downLevel();
    } else {
      throw new Error('Not support kind of ' + kind);
    }
    // result
    return child as Child;
  }

  getRendering(mode: string) {
    if (mode === 'full') {
      return this.convertFull();
    } else if (mode === 'methods') {
      return this.convertMethods();
    } else {
      return super.getRendering(mode);
    }
  }

  getMethods() {
    const methods: Method[] = [];
    // get all signatures
    this.Typedoc
      .getDeclarations(ReflectionKind.Method, this.DECLARATION)
      .forEach(item => item
        .getAllSignatures()
        .forEach(signature => methods.push(
          // tslint:disable-next-line: no-any
          new Method(this.Typedoc, this.Content, signature as any)
            .downLevel()
            .setId(this.getChildId(signature.name))
        ))
      );
    // result
    return methods;
  }

  convertMethods() {
    const summaryRows: string[][] = [];
    const detailBlocks: Block[] = [];
    this.getMethods().forEach(method => {
      // summary
      const { name, type, typeLink, shortText } = method.getData();
      summaryRows.push([
        `[${name}](#${this.getChildId(name)})`,
        !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
        shortText || ''
      ]);
      // detail
      detailBlocks.push(...method.convertSelf());
    });
    const summaryBlock = this.Content.buildTable(
      ['Method', 'Returns type', 'Description'],
      summaryRows
    );
    const className = this.DECLARATION.name;
    const summaryText = this.Content.buildText(`**${className} methods**`);
    const detailText = this.Content.buildText(`**${className} method detail**`);
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
    const methodsBlocks = this.convertMethods();
    return [ ...selfBlocks, ...propertiesBlocks, ...methodsBlocks ];
  }

}