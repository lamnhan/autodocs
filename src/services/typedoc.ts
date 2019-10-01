import {
  Application,
  Reflection,
  DeclarationReflection,
  SignatureReflection,
  ParameterReflection,
} from 'typedoc';

import {
  ReflectionData,
  DeclarationData,
  ParameterData,
  SignatureData
} from '../types';

export class Typedoc {

  typedocApp: Application;

  constructor(configs = {}) {
    this.typedocApp = new Application({
      // default
      mode: 'file',
      logger: 'none',
      target: 'ES2015',
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

  getProject(path: string | string[]) {
    // get project
    const projectReflection = this.typedocApp.convert(
      this.typedocApp.expandInputFiles(typeof path === 'string' ? [path] : path),
    );
    if (!projectReflection) {
      throw new Error('Typedoc convert failed.');
    }
    return projectReflection;
  }

  generateDocs(path: string | string[], out: string) {
    const projectReflection = this.getProject(path);
    return this.typedocApp.generateDocs(projectReflection, out);
  }

  getDeclaration(path: string | string[], name: string) {
    const projectReflection = this.getProject(path);
    // extract declaration
    let declaration;
    for (const child of projectReflection.children || []) {
      if (child.name === name) {
        declaration = child;
        break;
      }
    }
    // error
    if (!declaration) {
      throw new Error('No declaration found.');
    }
    // result
    return declaration;
  }

  parseReflection(reflection: Reflection) {
    const name = reflection.name;
    const description = ((reflection.comment || {}).shortText || '').replace(
      /(?:\r\n|\r|\n)/g,
      ' '
    );
    const content = (reflection.comment || {}).text || '';
    return { name, description, content } as ReflectionData;
  }

  parseDeclaration(declaration: DeclarationReflection) {
    const { name, description, content } = this.parseReflection(declaration);
    const type = !!declaration.type ? declaration.type.toString() : 'unknown';
    const isOptional =
      declaration.flags.isOptional || !!declaration.defaultValue;
    // result
    return { name, description, content, isOptional, type } as DeclarationData;
  }

  parseParameter(parameter: ParameterReflection) {
    return this.parseDeclaration(
      parameter as DeclarationReflection
    ) as ParameterData;
  }

  parseSignature(signature: SignatureReflection) {
    const { name, description, content } = this.parseReflection(signature);
    const returnType = !!signature.type ? signature.type.toString() : 'unknown';
    const returnDesc = (signature.comment || {}).returns || '';
    const params: DeclarationData[] = [];
    for (const param of signature.parameters || []) {
      const item = this.parseParameter(param);
      params.push(item);
    }
    return {
      name,
      description,
      content,
      params,
      returnType,
      returnDesc,
    } as SignatureData;
  }

  getInterface(path: string | string[], interfaceName: string) {
    const interfaceDeclaration = this.getDeclaration(path, interfaceName);
    const result: DeclarationData[] = [];
    for (const child of interfaceDeclaration.children || []) {
      result.push(
        this.parseDeclaration(child),
      );
    }
    return result;
  }

  getClass(path: string | string[], className: string) {
    const classDeclaration = this.getDeclaration(path, className);
    // parsing
    const methods: SignatureData[] = [];
    for (const method of classDeclaration.children || []) {
      if (method.kindString === 'Method' && method.flags.isExported) {
        const [signature] = method.signatures || [];
        const item: SignatureData = this.parseSignature(signature);
        methods.push(item);
      }
    }
    return methods;
  }

}
