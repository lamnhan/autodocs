import {
  Application,
  ReflectionKind,
  Reflection,
  ProjectReflection,
  DeclarationReflection,
  ParameterReflection,
  SignatureReflection,
} from 'typedoc';
import { Type, ReferenceType, Comment } from 'typedoc/dist/lib/models';

import { Project } from './project';

export * from 'typedoc';
export * from 'typedoc/dist/lib/models';

export type SrcInput = string | string[];

export interface TypeData {
  type: string;
  typeUrl?: string;
}

export interface ReflectionData {
  name: string;
  link?: string;
  shortText?: string;
  text?: string;
  returns?: string;
}

export interface DeclarationData extends ReflectionData, TypeData {
  isOptional?: boolean;
}

export interface ParameterData extends DeclarationData {}

export interface SignatureData extends ReflectionData, TypeData {
  parameters?: ParameterData[];
}

export class Typedoc {
  private project: Project;

  typedocApp: Application;
  typedocProject: ProjectReflection;

  constructor(project: Project) {
    this.project = project;
    // init typedoc
    this.typedocApp = this.createApp();
    this.typedocProject = this.createProject(this.typedocApp, 'src');
  }

  createApp(configs = {}) {
    return new Application({
      // default
      mode: 'file',
      logger: 'none',
      target: 'ES5',
      module: 'CommonJS',
      experimentalDecorators: true,
      ignoreCompilerErrors: true,
      excludeNotExported: true,
      excludePrivate: true,
      excludeProtected: true,
      readme: 'none',
      // custom
      ...configs,
    });
  }

  createProject(app: Application, src: SrcInput) {
    //  init project
    const projectReflection = app.convert(
      app.expandInputFiles(typeof src === 'string' ? [src] : src)
    );
    if (!projectReflection) {
      throw new Error('Typedoc convert failed.');
    }
    return projectReflection;
  }

  generateDocs(out: string) {
    return this.typedocApp.generateDocs(this.typedocProject, out);
  }

  getReflections(kind?: ReflectionKind) {
    return !!kind
      ? this.typedocProject.getChildrenByKind(kind)
      : this.typedocProject.children || [];
  }

  getReflection(name: string) {
    const member = this.typedocProject.getChildByName(name);
    if (!member) {
      throw new Error('No member found.');
    }
    return member;
  }

  getDeclarations(kind?: ReflectionKind) {
    return this.getReflections(kind) as DeclarationReflection[];
  }

  getDeclaration(name: string) {
    return this.getReflection(name) as DeclarationReflection;
  }

  getDeclarationChildren(
    declaration: DeclarationReflection,
    kind?: ReflectionKind
  ) {
    return !!kind
      ? declaration.getChildrenByKind(kind)
      : declaration.children || [];
  }

  getTypeUrl(name: string, kind: ReflectionKind) {
    name = name.toLowerCase();
    // build url
    let url = `globals.html#${name}`;
    if (kind === ReflectionKind.Interface) {
      url = `interfaces/${name}.html`;
    } else if (kind === ReflectionKind.Class) {
      url = `classes/${name}.html`;
    }
    // result
    const { url: webUrl } = this.project.getOptions();
    return webUrl + '/' + url;
  }

  getReflectionLink(name: string, kind: ReflectionKind, parent?: Reflection) {
    name = name.toLowerCase();
    // interface/class props
    if (
      !!parent &&
      (parent.kind === ReflectionKind.Interface ||
        parent.kind === ReflectionKind.Class)
    ) {
      return this.getTypeUrl(parent.name, parent.kind) + '#' + name;
    }
    // class methods
    else if (
      !!parent && // the method
      !!parent.parent && // the class
      parent.kind === ReflectionKind.Method &&
      parent.name === name
    ) {
      return (
        this.getTypeUrl(parent.parent.name, parent.parent.kind) + '#' + name
      );
    }
    // interface | class | globals
    else {
      return this.getTypeUrl(name, kind);
    }
  }

  parseType(type?: Type) {
    const typeData = { type: 'unknown' } as TypeData;
    if (!!type) {
      typeData.type = type.toString();
      // build link
      if (type.type === 'reference') {
        const { reflection } = type as ReferenceType;
        const { name, kind } = reflection as Reflection;
        typeData.typeUrl = this.getTypeUrl(name, kind);
      }
    }
    return typeData;
  }

  parseReflection(reflection: Reflection) {
    const { name, kind, comment = {}, parent } = reflection;
    const { shortText = '', text = '', returns = '' } = comment as Comment;
    return {
      name,
      shortText: shortText.replace(/(?:\r\n|\r|\n)/g, ' '),
      text,
      returns,
      link: this.getReflectionLink(name, kind, parent),
    } as ReflectionData;
  }

  parseDeclaration(declaration: DeclarationReflection) {
    // general
    const reflectionData = this.parseReflection(declaration);
    // type
    const typeData = this.parseType(declaration.type);
    // is optional
    const { flags, defaultValue } = declaration;
    const isOptional = flags.isOptional || !!defaultValue;
    // result
    return { ...reflectionData, ...typeData, isOptional } as DeclarationData;
  }

  parseParameter(parameter: ParameterReflection) {
    return this.parseDeclaration(
      parameter as DeclarationReflection
    ) as ParameterData;
  }

  parseSignature(signature: SignatureReflection) {
    // general
    const reflectionData = this.parseReflection(signature);
    // type
    const typeData = this.parseType(signature.type);
    // parameters
    const parameters: ParameterData[] = [];
    (signature.parameters || []).forEach(param =>
      parameters.push(this.parseParameter(param))
    );
    return { ...reflectionData, ...typeData, parameters } as SignatureData;
  }
}
