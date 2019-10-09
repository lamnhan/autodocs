// tslint:disable: no-any
import {
  Application,
  ReflectionKind,
  Reflection,
  ContainerReflection,
  ProjectReflection,
  DeclarationReflection,
} from 'typedoc';
import { ReferenceType } from 'typedoc/dist/lib/models';

import { Project } from './project';

export * from 'typedoc';
export * from 'typedoc/dist/lib/models';

export type KindString = keyof typeof ReflectionKind;

interface TypeData {
  type: string;
  typeLink?: string;
}

interface FlagData {
  isOptional?: boolean;
}

interface DefaultValueData {
  defaultValue?: any;
}

interface CommentData {
  shortText?: string;
  text?: string;
  returns?: string;
}

export interface ReflectionData
extends TypeData, FlagData, DefaultValueData, CommentData {
  name: string;
  link: string;
}

export type IterationHandler<Item, Data> = (event: IterationEvent<Item, Data>) => void;

export type IterationFormatter<Data> = (data: Data) => Data;

interface IterationEvent<Item, Data> {
  item: Item;
  data: Data;
  displayData: Data;
}

export class Typedoc {
  private $Project: Project;

  typedocApp: Application;
  typedocProject: ProjectReflection;

  constructor(
    $Project: Project,
    typedocApp?: Application,
    typedocProject?: ProjectReflection,
  ) {
    this.$Project = $Project;
    // init typedoc
    this.typedocApp = typedocApp || this.createApp();
    this.typedocProject = typedocProject || this.createProject(this.typedocApp, ['src']);
  }

  extend(src: string[], configs = {}) {
    const typedocApp = this.createApp(configs);
    const typedocProject = this.createProject(typedocApp, src);
    return new Typedoc(this.$Project, typedocApp, typedocProject);
  }

  createApp(configs = {}) {
    const { name: packageName } = this.$Project.PACKAGE;
    return new Application({
      // default
      name: `${packageName} API Reference`,
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

  createProject(app: Application, src: string[]) {
    //  init project
    const projectReflection = app.convert(app.expandInputFiles(src));
    if (!projectReflection) {
      throw new Error('Typedoc convert failed.');
    }
    return projectReflection;
  }

  generateDocs(out: string) {
    return this.typedocApp.generateDocs(this.typedocProject, out);
  }

  getReflections(kind?: ReflectionKind, container?: Reflection) {
    const parent = container as ContainerReflection || this.typedocProject;
    return !!kind ? parent.getChildrenByKind(kind) : parent.children || [];
  }

  getReflection(what?: string | string[]) {
    const reflection = (
      !what
      // default project
      ? this.typedocProject
      : typeof what === 'string'
      // class or interface
      ? this.typedocProject.getChildByName(what)
      // custom project
      // TODO: do not create new project
      : this.createProject(
          this.createApp({ name: what.join(' ').replace(/(src\/)/g, '@') }),
          what,
        )
    );
    if (!reflection) {
      throw new Error('No reflection found.');
    }
    return reflection;
  }

  extractReflection(reflection: Reflection) {
    const { name } = reflection;
    const link = this.getLink(reflection);
    const typeData = this.getType(reflection);
    const flagData = this.getFlags(reflection);
    const defaultValueData = this.getDefaultValue(reflection);
    const commentData = this.getComment(reflection);
    // result
    return {
      name,
      link,
      ...typeData,
      ...flagData,
      ...defaultValueData,
      ...commentData,
    } as ReflectionData;
  }

  private getTypeLink(name: string, kind: ReflectionKind) {
    const id = name.toLowerCase();
    // build link
    let link = '';
    if (kind === ReflectionKind.Interface) {
      link = `interfaces/${id}.html`;
    } else if (kind === ReflectionKind.Class) {
      link = `classes/${id}.html`;
    } else if (
      kind === ReflectionKind.Variable ||
      kind === ReflectionKind.Function
    ) {
      link = `globals.html#${id}`;
    } else {
      link = 'globals.html';
    }
    // result
    const { url } = this.$Project.OPTIONS;
    return url + '/' + link;
  }

  private getLink(reflection: Reflection) {
    const { name, kind, parent } = reflection;
    const fragment = name.toLowerCase();
    // interface/class props
    if (
      !!parent &&
      (parent.kind === ReflectionKind.Interface ||
        parent.kind === ReflectionKind.Class)
    ) {
      return this.getTypeLink(parent.name, parent.kind) + '#' + fragment;
    }
    // class methods
    else if (
      !!parent && // the method
      !!parent.parent && // the class
      parent.kind === ReflectionKind.Method &&
      parent.name === name
    ) {
      return (
        this.getTypeLink(parent.parent.name, parent.parent.kind) + '#' + fragment
      );
    }
    // interface | class | globals
    else {
      return this.getTypeLink(name, kind);
    }
  }

  private getType(reflection: Reflection) {
    const { type } = reflection as DeclarationReflection;
    // get type data
    const typeData = { type: 'none' } as TypeData;
    if (!!type) {
      typeData.type = type.toString();
      // build link
      if (type.type === 'reference') {
        const { reflection } = type as ReferenceType;
        const { name, kind } = reflection as Reflection;
        typeData.typeLink = this.getTypeLink(name, kind);
      }
    }
    // result
    return typeData;
  }

  private getFlags(reflection: Reflection) {
    const { flags, defaultValue } = reflection as DeclarationReflection;
    // get flag data
    const flagData: FlagData = { isOptional: false };
    if (!!flags) {
      flagData.isOptional = flags.isOptional || !!defaultValue;
    }
    // result
    return flagData;
  }

  private parseDefaultValue(value: any) {
    return value;
  }

  private getDefaultValue(reflection: Reflection) {
    const {
      kind, defaultValue = '', children = [],
    } = reflection as DeclarationReflection;
    // get default value data
    const defaultValueData: DefaultValueData = { defaultValue: '' };
    if (kind === ReflectionKind.Property) {
      // object
      if (!!children.length) {
        const value: {[name: string]: any} = {};
        children.forEach(({ name, defaultValue }) =>
          value[name] = this.parseDefaultValue(defaultValue),
        );
        defaultValueData.defaultValue = value;
      }
      // any
      else {
        defaultValueData.defaultValue = this.parseDefaultValue(defaultValue);
      }
    }
    // result
    return defaultValueData;
  }

  
  private getComment(reflection: Reflection) {
    const { comment } = reflection as DeclarationReflection;
    // get comment data
    const commentData: CommentData = {};
    if (!!comment) {
      const { shortText = '', text = '', returns = '' } = comment;
      commentData.shortText = shortText.replace(/(?:\r\n|\r|\n)/g, ' ');
      commentData.text = text;
      commentData.returns = returns;
    }
    // result
    return commentData;
  }

}
