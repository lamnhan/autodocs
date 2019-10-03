import { ReflectionKind, DeclarationReflection, Typedoc } from './typedoc';
import { Content } from './content';

export class Class {
  private typedoc: Typedoc;
  private content: Content;

  typedocClass: DeclarationReflection;

  constructor(typedoc: Typedoc, content: Content, name: string) {
    this.typedoc = typedoc;
    this.content = content;
    // get the interface
    this.typedocClass = this.typedoc.getDeclaration(name);
  }

  getClass() {
    return this.typedocClass;
  }

  getClassData() {
    return this.typedoc.parseDeclaration(this.typedocClass);
  }

  getProperties() {
    return this.typedoc.getDeclarationChildren(
      this.typedocClass,
      ReflectionKind.Property
    );
  }

  getPropertiesData() {
    return this.getProperties().map(property =>
      this.typedoc.parseDeclaration(property)
    );
  }

  getMethods() {
    return this.typedoc
      .getDeclarationChildren(this.typedocClass, ReflectionKind.Method)
      .map(({ signatures = [] }) => signatures[0]);
  }

  getMethodsData() {
    return this.getMethods().map(method => this.typedoc.parseSignature(method));
  }
}
