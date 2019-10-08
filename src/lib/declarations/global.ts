import {
  DeclarationReflection,
  DeclarationData,
  ReflectionKind,
  KindString,
  Typedoc
} from '../services/typedoc';
import { Content } from '../services/content';

import { Base } from './base';
import { Variable } from './variable';
import { Function } from './function';
import { Interface } from './interface';
import { Class } from './class';

export interface GlobalData extends DeclarationData {}

export class Global extends Base {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    item: DeclarationReflection,
  ) {
    super($Typedoc, $Content, item);
  }

  getData() {
    return super.getData() as GlobalData;
  }

  getChildren<Child>(kind: KindString) {
    let children: unknown = [];
    if (kind === 'Variable') {
      children = this.getVariables();
    } else if (kind === 'Function') {
      children = this.getFunctions();
    } else if (kind === 'Interface') {
      children = this.getInterfaces();
    } else if (kind === 'Class') {
      children = this.getClasses();
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
    if (kind === 'Variable') {
      child = new Variable(this.Typedoc, this.Content, declaration).downLevel();
    } else if (kind === 'Function') {
      const { signatures = [] } = declaration;
      // tslint:disable-next-line: no-any
      child = new Function(this.Typedoc, this.Content, signatures[0] as any).downLevel();
    } else if (kind === 'Interface') {
      child = new Interface(this.Typedoc, this.Content, declaration);
    } else if (kind === 'Class') {
      child = new Class(this.Typedoc, this.Content, declaration);
    } else {
      throw new Error('Not support kind of ' + kind);
    }
    // result
    return child as Child;
  }

  getVariables() {
    return this.Typedoc
      .getDeclarations(ReflectionKind.Variable, this.DECLARATION)
      .map(item =>
        new Variable(this.Typedoc, this.Content, item)
        .downLevel()
      );
  }

  convertVariables() {
    return this
      .getVariables()
      .map(variable => variable.convertSelf());
  }

  getFunctions() {
    const functions: Function[] = [];
    // get all signatures
    this.Typedoc
      .getDeclarations(ReflectionKind.Function, this.DECLARATION)
      .forEach(item => item
        .getAllSignatures()
        .forEach(signature => functions.push(
          // tslint:disable-next-line: no-any
          new Function(this.Typedoc, this.Content, signature as any).downLevel()
        ))
      );
    // result
    return functions;
  }

  convertFunctions() {
    return this
      .getFunctions()
      .map(_function => _function.convertSelf());
  }

  getInterfaces() {
    return this.Typedoc
      .getDeclarations(ReflectionKind.Interface, this.DECLARATION)
      .map(item =>
        new Interface(this.Typedoc, this.Content, item)
      );
  }

  getClasses() {
    return this.Typedoc
      .getDeclarations(ReflectionKind.Class, this.DECLARATION)
      .map(item =>
        new Class(this.Typedoc, this.Content, item)
      );
  }

}