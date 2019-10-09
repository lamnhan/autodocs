import {
  Reflection,
  ReflectionData,
  ReflectionKind,
  Typedoc
} from '../services/typedoc';
import { Block, Content } from '../services/content';

import { Declaration } from './declaration';
import { Variable } from './variable';
import { Function } from './function';
import { Interface } from './interface';
import { Class } from './class';

export interface GlobalData extends ReflectionData {}

export class Global extends Declaration {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    reflection: Reflection,
  ) {
    super($Typedoc, $Content, reflection);
  }

  getData() {
    return super.getData() as GlobalData;
  }

  getVariables() {
    return this.Typedoc
      .getReflections(ReflectionKind.Variable, this.REFLECTION)
      .map(item =>
        new Variable(this.Typedoc, this.Content, item)
        .downLevel()
      );
  }

  getVariable(name: string) {
    const _variable = this.REFLECTION.getChildByName(name);
    if (!_variable) {
      throw new Error('No variable!');
    }
    return new Variable(this.Typedoc, this.Content, _variable)
      .downLevel()
  }

  getFunctions() {
    const functions: Function[] = [];
    // get all signatures
    this.Typedoc
      .getReflections(ReflectionKind.Function, this.REFLECTION)
      .forEach(item => item
        .getAllSignatures()
        .forEach((signature, i) => functions.push(
          // tslint:disable-next-line: no-any
          new Function(this.Typedoc, this.Content, signature as any)
            .setId(this.getChildId(signature.name + ' ' + i))
            .downLevel()
        ))
      );
    // result
    return functions;
  }

  getFunction(name: string) {
    const _function = this.REFLECTION.getChildByName(name);
    if (!_function) {
      throw new Error('No function!');
    }
    return new Function(this.Typedoc, this.Content, _function)
      .downLevel()
  }

  getInterfaces() {
    return this.Typedoc
      .getReflections(ReflectionKind.Interface, this.REFLECTION)
      .map(item =>
        new Interface(this.Typedoc, this.Content, item)
      );
  }

  getInterface(name: string) {
    const _interface = this.REFLECTION.getChildByName(name);
    if (!_interface) {
      throw new Error('No interface!');
    }
    return new Interface(this.Typedoc, this.Content, _interface);
  }

  getClasses() {
    return this.Typedoc
      .getReflections(ReflectionKind.Class, this.REFLECTION)
      .map(item =>
        new Class(this.Typedoc, this.Content, item)
      );
  }

  getClass(name: string) {
    const _class = this.REFLECTION.getChildByName(name);
    if (!_class) {
      throw new Error('No class!');
    }
    return new Class(this.Typedoc, this.Content, _class);
  }

  getRendering(mode: string) {
    switch (mode) {
      case 'full':
        return this.convertFull();
      case 'classes':
        return this.convertClasses();
      case 'interfaces':
        return this.convertInterfaces();
      case 'functions':
        return this.convertFunctions();
      case 'variables':
        return this.convertVariables();
      default:
        return super.getRendering(mode);
    }
  }

  convertVariables() {
    const blocks: Block[] = [];
    const interfaceName = this.REFLECTION.name;
    // get data
    const summaryRows: string[][] = [];
    const detailBlocks: Block[] = [];
    this.getVariables().forEach(variable => {
      // summary
      const { name, isOptional, type, typeLink, shortText } = variable.getData();
      summaryRows.push([
        `[${!isOptional ? `**${name}**` : name}](#${this.getChildId(name)})`,
        !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
        shortText || '',
      ]);
      // detail
      detailBlocks.push(...variable.convertSelf());
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

  convertFunctions() {
    const blocks: Block[] = [];
    const globalName = this.REFLECTION.name;
    // get data
    const summaryRows: string[][] = [];
    const detailBlocks: Block[] = [];
    this.getFunctions().forEach(_function => {
      // summary
      const { name, type, typeLink, shortText } = _function.getData();
      summaryRows.push([
        `[${name}](#${_function.ID})`,
        !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
        shortText || ''
      ]);
      // detail
      detailBlocks.push(..._function.convertSelf());
    });
    // summary blocks
    if (!!summaryRows.length) {
      const summaryText = this.Content.buildText(`**${globalName} functions**`);
      const summaryBlock = this.Content.buildTable(
        ['Function', 'Returns type', 'Description'],
        summaryRows
      );
      blocks.push(summaryText, summaryBlock);
    }
    // detail blocks
    if (!!detailBlocks.length) {
      const detailText = this.Content.buildText(`**${globalName} function detail**`);
      blocks.push(detailText, ...detailBlocks);
    }
    // result
    return blocks;
  }

  convertInterfaces() {
    const blocks: Block[] = [];
    // get data
    const summaryRows: string[][] = [];
    this.getInterfaces().forEach(_interface => {
      const { name, link, shortText } = _interface.getData();
      summaryRows.push([`[${name}](${link})`, shortText || '']);
    });
    // summary block
    if (!!summaryRows.length) {
      const summaryBlock = this.Content.buildTable(
        ['Interfaces', 'Description'],
        summaryRows
      );
      blocks.push(summaryBlock);
    }
    // result
    return blocks;
  }
  
  convertClasses() {
    const blocks: Block[] = [];
    // get data
    const summaryRows: string[][] = [];
    this.getClasses().forEach(_class => {
      const { name, link, shortText } = _class.getData();
      summaryRows.push([`[${name}](${link})`, shortText || '']);
    });
    // summary block
    if (!!summaryRows.length) {
      const summaryBlock = this.Content.buildTable(
        ['Classes', 'Description'],
        summaryRows
      );
      blocks.push(summaryBlock);
    }
    // result
    return blocks;
  }
  
  convertFull() {
    return [];
  }

}