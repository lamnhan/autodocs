import {Reflection, SignatureReflection, ReflectionKind} from 'typedoc';

import {ProjectService} from '../services/project.service';
import {
  ReflectionData,
  DefaultValue,
  TypedocService,
} from '../services/typedoc.service';
import {ContentBySections, ContentService} from '../services/content.service';

export type DeclarationFilter = (declaration: DeclarationObject) => boolean;

/**
 * A DeclarationObject is an unit that holds the information of a source code element.
 */
export class DeclarationObject {
  private id: string;
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
  private fileName: string;
  // call signature
  private parameters: ReflectionData[];
  // custom
  private fullText: string;
  private sections: ContentBySections;

  constructor(
    private projectService: ProjectService,
    private typedocService: TypedocService,
    private contentService: ContentService,
    private reflection: Reflection
  ) {
    // default values
    this.id = this.contentService.buildId(this.reflection.name);
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
      fileName = '',
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
    this.fileName = fileName;
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

  get FILE_NAME() {
    return this.fileName;
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

  isRoot() {
    const {name: pkgName} = this.projectService.PACKAGE;
    return this.isCollection() && this.name === pkgName;
  }

  isCollection() {
    return this.reflection.isProject();
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
    return new DeclarationObject(
      this.projectService,
      this.typedocService,
      this.contentService,
      reflection
    ).setId(this.getChildId(reflection.name));
  }

  getVariablesOrProperties(filter?: DeclarationFilter) {
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
    return [...variablesOrProperties, ...accessors]
      .map(item =>
        new DeclarationObject(
          this.projectService,
          this.typedocService,
          this.contentService,
          item
        ).setId(this.getChildId(item.name))
      )
      .filter(item => (!filter ? true : filter(item)));
  }

  getFunctionsOrMethods(filter?: DeclarationFilter) {
    if (!this.hasFunctionsOrMethods()) {
      throw new Error('No functions or methods.');
    }
    const result: DeclarationObject[] = [];
    // get all signatures
    this.typedocService
      .getReflections('FunctionOrMethod', this.reflection)
      .forEach(item =>
        item
          .getAllSignatures()
          .forEach((signature, i) =>
            result.push(
              new DeclarationObject(
                this.projectService,
                this.typedocService,
                this.contentService,
                signature as any
              ).setId(this.getChildId(signature.name) + '-' + i)
            )
          )
      );
    // result
    return result.filter(item => (!filter ? true : filter(item)));
  }

  getInterfaces(filter?: DeclarationFilter) {
    if (!this.hasInterfaces()) {
      throw new Error('No interfaces.');
    }
    return this.typedocService
      .getReflections('Interface', this.reflection)
      .map(
        item =>
          new DeclarationObject(
            this.projectService,
            this.typedocService,
            this.contentService,
            item
          )
      )
      .filter(item => (!filter ? true : filter(item)));
  }

  getClasses(filter?: DeclarationFilter) {
    if (!this.hasClasses()) {
      throw new Error('No classes.');
    }
    return this.typedocService
      .getReflections('Class', this.reflection)
      .map(
        item =>
          new DeclarationObject(
            this.projectService,
            this.typedocService,
            this.contentService,
            item
          )
      )
      .filter(item => (!filter ? true : filter(item)));
  }
}
