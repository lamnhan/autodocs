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

export type SRCInput = string | string[];

export interface TypeData {
  type: string;
  typeLink?: string;
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

  app: Application;
  project: ProjectReflection;

  constructor(src: SRCInput = 'src', configs = {}) {
    // init app
    this.app = new Application({
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
    //  init project
    const projectReflection = this.app.convert(
      this.app.expandInputFiles(typeof src === 'string' ? [src] : src),
    );
    if (!projectReflection) {
      throw new Error('Typedoc convert failed.');
    }
    this.project = projectReflection;
  }

  generateDocs(out: string) {
    return this.app.generateDocs(this.project, out);
  }
  
  getReflections(kind?: ReflectionKind) {
    return !!kind ? this.project.getChildrenByKind(kind) : this.project.children || [];
  }

  getReflection(name?: string) {
    const member = !!name ? this.project.getChildByName(name) : this.getReflections()[0];
    if (!member) {
      throw new Error('No member found.');
    }
    return member;
  }

  getDeclarations(kind?: ReflectionKind) {
    return this.getReflections(kind) as DeclarationReflection[];
  }

  getDeclaration(name?: string) {
    return this.getReflection(name) as DeclarationReflection;
  }
  
  getDeclarationChildren(declaration: DeclarationReflection, kind?: ReflectionKind) {
    return !!kind ? declaration.getChildrenByKind(kind) : declaration.children || [];
  }

  buildLink(name: string, kind: ReflectionKind) {
    // TODO: build full link
    name = name.toLowerCase();
    // build link
    let link = '';
    if (kind === ReflectionKind.Interface) {
      link = `interfaces/${name}.html`;
    } else if (kind === ReflectionKind.Class) {
      link = `classes/${name}.html`;
    } else {
      link = `globals.html#${name}`;
    }
    return link;
  }

  parseType(type?: Type) {
    const typeData = { type: 'unknown' } as TypeData;
    if (!!type) {
      typeData.type = type.toString();
      // build link
      if (type.type === 'reference') {
        const { reflection } = type as ReferenceType;
        const { name, kind } = reflection as Reflection;
        typeData.typeLink = this.buildLink(name, kind);
      }
    }
    return typeData;
  }
  
  parseReflection(reflection: Reflection) {
    const { name, kind, comment = {} } = reflection;
    const { shortText = '', text = '', returns = '' } = comment as Comment;
    return {
      name,
      shortText: shortText.replace(/(?:\r\n|\r|\n)/g, ' '),
      text,
      returns,
      link: this.buildLink(name, kind),
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
    return this.parseDeclaration(parameter as DeclarationReflection) as ParameterData;
  }

  parseSignature(signature: SignatureReflection) {
    // general
    const reflectionData = this.parseReflection(signature);
    // type
    const typeData = this.parseType(signature.type);
    // parameters
    const parameters: ParameterData[] = [];
    (signature.parameters || []).forEach(
      param => parameters.push(this.parseParameter(param)),
    );
    return { ...reflectionData, ...typeData, parameters } as SignatureData;
  }

}
