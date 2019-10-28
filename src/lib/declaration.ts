import { Reflection, SignatureReflection, ReflectionKind } from 'typedoc';

import {
  ReflectionData,
  DefaultValue,
  TypedocService,
} from './services/typedoc';
import { ContentBySections, ContentService } from './services/content';

/**
 * A Declaration is an object the holds information of a source code element.
 */
export class Declaration {
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
  private displayType: string;
  private isOptional: boolean;
  private defaultValue: DefaultValue;
  // call signature
  private parameters: ReflectionData[];
  // custom
  private fullText: string;
  private sections: ContentBySections;

  constructor(
    private typedocService: TypedocService,
    private contentService: ContentService,
    private reflection: Reflection
  ) {
    // default values
    this.id = this.contentService.buildId(this.reflection.name);
    this.level = 2;
    // extract data
    const {
      name,
      link,
      shortText = '',
      text = '',
      returns = '',
      type = '',
      displayType = '',
      isOptional = false,
      defaultValue = '',
    } = this.typedocService.extractReflection(this.reflection);
    // set data
    this.name = name;
    this.link = link;
    this.shortText = shortText;
    this.text = text.split('<section id="').shift() || '';
    this.returns = returns;
    this.type = type;
    this.displayType = '<code>' + displayType + '</code>';
    this.isOptional = isOptional;
    this.defaultValue = defaultValue;
    this.parameters = (
      (this.reflection as SignatureReflection).parameters || []
    ).map(param => this.typedocService.extractReflection(param));
    this.sections = this.contentService.extractSections(text);
    this.fullText = text
      .replace(/<section [^\n]*/g, '')
      .replace('</section>', '');
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

  get DISPLAY_TYPE() {
    return this.displayType;
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

  get FULL_TEXT() {
    return this.fullText;
  }

  setId(id: string) {
    this.id = id;
    return this;
  }

  setLevel(level: number) {
    this.level = level;
    return this;
  }

  isKind(kindString: keyof typeof ReflectionKind) {
    return this.typedocService.isReflectionKind(this.reflection, kindString);
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

  getChildId(childName: string) {
    return this.contentService.buildId(this.id + ' ' + childName);
  }

  getChild(name: string) {
    const reflection = this.typedocService.getChildReflection(
      this.reflection,
      name
    );
    return new Declaration(this.typedocService, this.contentService, reflection)
      .setId(this.getChildId(reflection.name))
      .setLevel(this.level + 1);
  }

  getVariablesOrProperties(offset = 1) {
    if (!this.hasVariablesOrProperties()) {
      throw new Error('No variables or properties.');
    }
    const variablesOrProperties = this.typedocService.getReflections(
      'VariableOrProperty',
      this.reflection
    );
    const accessors = this.typedocService
      .getReflections('Accessor', this.reflection)
      .map(accessor => {
        if (accessor.getSignature) {
          accessor.type = accessor.getSignature.type;
        }
        return accessor;
      });
    return [...variablesOrProperties, ...accessors].map(item =>
      new Declaration(this.typedocService, this.contentService, item)
        .setId(this.getChildId(item.name))
        .setLevel(this.level + offset)
    );
  }

  getFunctionsOrMethods(offset = 1) {
    if (!this.hasFunctionsOrMethods()) {
      throw new Error('No functions or methods.');
    }
    const result: Declaration[] = [];
    // get all signatures
    this.typedocService
      .getReflections('FunctionOrMethod', this.reflection)
      .forEach(item =>
        item.getAllSignatures().forEach((signature, i) =>
          result.push(
            // tslint:disable-next-line: no-any
            new Declaration(
              this.typedocService,
              this.contentService,
              signature as any
            )
              .setId(this.getChildId(signature.name) + '-' + i)
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
    return this.typedocService
      .getReflections('Interface', this.reflection)
      .map(item =>
        new Declaration(
          this.typedocService,
          this.contentService,
          item
        ).setLevel(this.level + offset)
      );
  }

  getClasses(offset = 1) {
    if (!this.hasClasses()) {
      throw new Error('No classes.');
    }
    return this.typedocService
      .getReflections('Class', this.reflection)
      .map(item =>
        new Declaration(
          this.typedocService,
          this.contentService,
          item
        ).setLevel(this.level + offset)
      );
  }
}
