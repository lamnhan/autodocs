import { DeclarationReflection, ReflectionKind } from 'typedoc';

import { Docs } from './docs';

export class Class {

  private docs: Docs;

  classDeclaration: DeclarationReflection;

  constructor(docs: Docs, name?: string) {
    this.docs = docs;
    this.classDeclaration = this.docs.typedoc.getDeclaration(name);
  }

  getProperties() {
    return this.docs.typedoc.getDeclarationChildren(
      this.classDeclaration,
      ReflectionKind.Property,
    );
  }

  getMethods() {
    return this.docs.typedoc.getDeclarationChildren(
      this.classDeclaration,
      ReflectionKind.Method,
    );
  }

}
