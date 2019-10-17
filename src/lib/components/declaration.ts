import {
  Reflection,
  SignatureReflection,
  ReflectionKind,
  ReflectionData,
  DefaultValue,
  Typedoc,
} from '../services/typedoc';
import { ContentBySections, Content } from '../services/content';

export class Declaration {
  private $Typedoc: Typedoc;
  private $Content: Content;

  private reflection: Reflection;
  private id: string;
  private level: number;
  // reflection
  private name: string;
  private link: string;
  private shortText: string;
  private text: string;
  private returns: string;
  // declaration
  private type: string;
  private typeLink: string;
  private isOptional: boolean;
  private defaultValue: DefaultValue;
  // call signature
  private parameters: ReflectionData[];
  // custom
  private sections: ContentBySections;

  constructor($Typedoc: Typedoc, $Content: Content, reflection: Reflection) {
    this.$Typedoc = $Typedoc;
    this.$Content = $Content;
    // reflection
    this.reflection = reflection;
    // default values
    this.id = this.$Content.buildId(this.reflection.name);
    this.level = 2;
    // extract data
    const {
      name,
      link,
      shortText = '',
      text = '',
      returns = '',
      type = '',
      typeLink = '',
      isOptional = false,
      defaultValue = '',
    } = this.$Typedoc.extractReflection(this.reflection);
    // set data
    this.name = name;
    this.link = link;
    this.shortText = shortText;
    this.text = text.split('<section id="').shift() || '';
    this.returns = returns;
    this.type = type;
    this.typeLink = typeLink;
    this.isOptional = isOptional;
    this.defaultValue = defaultValue;
    this.parameters = (
      (this.reflection as SignatureReflection).parameters || []
    ).map(param => this.$Typedoc.extractReflection(param));
    this.sections = this.$Content.extractSections(text);
  }

  get REFLECTION() {
    return this.reflection;
  }

  get ID() {
    return this.id;
  }

  get LEVEL() {
    return this.level;
  }

  get NAME() {
    return this.name;
  }

  get LINK() {
    return this.link;
  }

  get SHORT_TEXT() {
    return this.shortText;
  }

  get TEXT() {
    return this.text;
  }

  get RETURNS() {
    return this.returns;
  }

  get TYPE() {
    return this.type;
  }

  get TYPE_LINK() {
    return this.typeLink;
  }

  get IS_OPTIONAL() {
    return this.isOptional;
  }

  get DEFAULT_VALUE() {
    return this.defaultValue;
  }

  get PARAMETERS() {
    return this.parameters;
  }

  get SECTIONS() {
    return this.sections;
  }

  childId(childName: string) {
    return this.$Content.buildId(this.id + ' ' + childName);
  }

  setId(id: string) {
    this.id = id;
    return this;
  }

  setLevel(level: number) {
    this.level = level;
    return this;
  }

  getSection(id: string) {
    return this.sections[id] || '';
  }

  isKind(kindString: keyof typeof ReflectionKind) {
    return this.$Typedoc.isReflectionKind(this.reflection, kindString);
  }

  hasVariablesOrProperties() {
    return (
      this.isKind('Global') || this.isKind('Interface') || this.isKind('Class')
    );
  }

  hasFunctionsOrMethods() {
    return this.isKind('Global') || this.isKind('Class');
  }

  hasInterfaces() {
    return this.isKind('Global');
  }

  hasClasses() {
    return this.isKind('Global');
  }

  getChild(name: string) {
    const reflection = this.$Typedoc.getChildReflection(this.reflection, name);
    return new Declaration(this.$Typedoc, this.$Content, reflection)
      .setId(this.childId(reflection.name))
      .setLevel(this.level + 1);
  }

  getVariablesOrProperties(offset = 1) {
    if (!this.hasVariablesOrProperties()) {
      throw new Error('No variables or properties.');
    }
    const variablesOrProperties = this.$Typedoc
      .getReflections('VariableOrProperty', this.reflection);
    const accessors = this.$Typedoc
      .getReflections('Accessor', this.reflection)
      .map(accessor => {
        if (accessor.getSignature) {
          accessor.type = accessor.getSignature.type;
        }
        return accessor;
      });
    return ([ ...variablesOrProperties, ...accessors ]).map(item =>
        new Declaration(this.$Typedoc, this.$Content, item)
          .setId(this.childId(item.name))
          .setLevel(this.level + offset)
      );
  }

  getFunctionsOrMethods(offset = 1) {
    if (!this.hasFunctionsOrMethods()) {
      throw new Error('No functions or methods.');
    }
    const result: Declaration[] = [];
    // get all signatures
    this.$Typedoc
      .getReflections('FunctionOrMethod', this.reflection)
      .forEach(item =>
        item.getAllSignatures().forEach((signature, i) =>
          result.push(
            // tslint:disable-next-line: no-any
            new Declaration(this.$Typedoc, this.$Content, signature as any)
              .setId(this.childId(signature.name) + '-' + i)
              .setLevel(this.level + offset)
          )
        )
      );
    // result
    return result;
  }

  getInterfaces(offset = 1) {
    if (!this.hasInterfaces()) {
      throw new Error('No interfaces.');
    }
    return this.$Typedoc
      .getReflections('Interface', this.reflection)
      .map(item =>
        new Declaration(this.$Typedoc, this.$Content, item).setLevel(
          this.level + offset
        )
      );
  }

  getClasses(offset = 1) {
    if (!this.hasClasses()) {
      throw new Error('No classes.');
    }
    return this.$Typedoc
      .getReflections('Class', this.reflection)
      .map(item =>
        new Declaration(this.$Typedoc, this.$Content, item).setLevel(
          this.level + offset
        )
      );
  }
}
