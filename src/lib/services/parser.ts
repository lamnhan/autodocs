// tslint:disable: no-any
import {
  ContainerReflection,
  DeclarationReflection,
  SignatureReflection,
  ParameterReflection,
  DeclarationData,
  IterationHandler,
  IterationFormatter,
  ReflectionKind,
  KindString,
  Typedoc,
} from './typedoc';
import { Content } from './content';

import { Base } from '../declarations/base';
import { Global } from '../declarations/global';
import { Interface } from '../declarations/interface';
import { Class } from '../declarations/class';
import { Variable } from '../declarations/variable';
import { Property } from '../declarations/property';
import { Function } from '../declarations/function';
import { Method } from '../declarations/method';

// export interface Interface extends ContainerReflection {}
// export interface InterfaceData extends DeclarationData {}
// export type InterfaceIterationHandler = IterationHandler<Interface, InterfaceData>;
// export type InterfaceIterationFormatter = IterationFormatter<InterfaceData>;

// export interface Class extends ContainerReflection {}
// export interface ClassData extends DeclarationData {}
// export type ClassIterationHandler = IterationHandler<Class, ClassData>;
// export type ClassIterationFormatter = IterationFormatter<ClassData>;

// export interface Variable extends DeclarationReflection {}
// export interface VariableData extends DeclarationData {}
// export type VariableIterationHandler = IterationHandler<Variable, VariableData>;
// export type VariableIterationFormatter = IterationFormatter<VariableData>;

// export interface Property extends Variable {}
// export interface PropertyData extends VariableData {}
// export type PropertyIterationHandler = IterationHandler<Property, PropertyData>;
// export type PropertyIterationFormatter = IterationFormatter<PropertyData>;

// export interface Function extends SignatureReflection {}
// export interface FunctionData extends DeclarationData {
//   parameters?: DeclarationData[];
// }
// export type FunctionIterationHandler = IterationHandler<Function, FunctionData>;
// export type FunctionIterationFormatter = IterationFormatter<FunctionData>;

// export interface Method extends Function {}
// export interface MethodData extends FunctionData {}
// export type MethodIterationHandler = IterationHandler<Method, MethodData>;
// export type MethodIterationFormatter = IterationFormatter<MethodData>;

export class Parser {

  private $Typedoc: Typedoc;
  private $Content: Content;

  constructor($Typedoc: Typedoc, $Content: Content) {
    this.$Typedoc = $Typedoc;
    this.$Content = $Content;
  }

  get(what: string, where?: string | string[]) {
    const collection = this.getCollection(where);
    return (
      typeof ReflectionKind[what as KindString] === 'number'
        ? collection.getChildren(what as KindString)
        : collection.getChild(what)
    ) as Base;
  }

  getCollection(input?: string | string[]) {
    const container = this.$Typedoc.getContainer(input) as DeclarationReflection;
    return (
      container.kindString === 'Interface'
        ? new Interface(this.$Typedoc, this.$Content, container)
        : container.kindString === 'Class'
          ? new Class(this.$Typedoc, this.$Content, container)
          : new Global(this.$Typedoc, this.$Content, container)
    ) as Global | Interface | Class;
  }

  getVariables() {}

  getVariable() {}

  getFunctions() {}

  getFunction() {}

  getInterfaces() {}

  getInterface() {}

  getClasses() {}

  getClass() {}

  // getItems<Kind>(kindString: KindString, collection?: ContainerReflection) {
  //   let items = this.$Typedoc.getDeclarations(ReflectionKind[kindString], collection) as unknown[];
  //   // functions or methods
  //   if (kindString === 'Function' || kindString === 'Method') {
  //     const methods: unknown[] = [];
  //     items.forEach(item => {
  //       const { signatures = [] } = item as DeclarationReflection;
  //       signatures.forEach(signature => methods.push(signature));
  //     });
  //     items = methods;
  //   }
  //   // result
  //   return items as Kind[];
  // }

  // getItem<Item>(name: string, collection?: ContainerReflection) {
  //   let item = this.$Typedoc.getDeclaration(name, collection) as unknown;
  //   // function or method
  //   const { kindString } = item as DeclarationReflection;
  //   if (kindString === 'Function' || kindString === 'Method') {
  //     const { signatures = [] } = item as DeclarationReflection;
  //     item = signatures[0];
  //   }
  //   // result
  //   return item as Item;
  // }

  // extractItem<Data>(item: DeclarationReflection) {
  //   let data = this.$Typedoc.extractDeclaration(item) as unknown;
  //   // function or method
  //   const { kindString } = item as DeclarationReflection;
  //   if (kindString === 'Function' || kindString === 'Method') {
  //     const {parameters: params = []} = item as {parameters?: ParameterReflection[]};
  //     const parameters = params.map(param => this.$Typedoc.extractDeclaration(param));
  //     data = { ...data, parameters };
  //   }
  //   // result
  //   return data as Data;
  // }

  // getAny<Result>(what: string | KindString, where?: string | string[]) {
  //   const collection = !!where
  //     ? this.getCollection<ContainerReflection>(where) : undefined;
  //   // get result
  //   let result: unknown;
  //   if (typeof ReflectionKind[what as KindString] === 'number') {
  //     result = this.getItems(what as KindString, collection);
  //   } else {
  //     result = this.getItem(what, collection);
  //   }
  //   // result
  //   return result as Result;
  // }

  // getCollection<Collection>(input?: string | string[]) {
  //   return (this.$Typedoc.getContainer(input) as unknown) as Collection;
  // }

  // getItems<Kind>(kindString: KindString, collection?: ContainerReflection) {
  //   let items = this.$Typedoc.getDeclarations(ReflectionKind[kindString], collection) as unknown[];
  //   // functions or methods
  //   if (kindString === 'Function' || kindString === 'Method') {
  //     const methods: unknown[] = [];
  //     items.forEach(item => {
  //       const { signatures = [] } = item as DeclarationReflection;
  //       signatures.forEach(signature => methods.push(signature));
  //     });
  //     items = methods;
  //   }
  //   // result
  //   return items as Kind[];
  // }

  // getItem<Item>(name: string, collection?: ContainerReflection) {
  //   let item = this.$Typedoc.getDeclaration(name, collection) as unknown;
  //   // function or method
  //   const { kindString } = item as DeclarationReflection;
  //   if (kindString === 'Function' || kindString === 'Method') {
  //     const { signatures = [] } = item as DeclarationReflection;
  //     item = signatures[0];
  //   }
  //   // result
  //   return item as Item;
  // }

  // extractItem<Data>(item: DeclarationReflection) {
  //   let data = this.$Typedoc.extractDeclaration(item) as unknown;
  //   // function or method
  //   const { kindString } = item as DeclarationReflection;
  //   if (kindString === 'Function' || kindString === 'Method') {
  //     const {parameters: params = []} = item as {parameters?: ParameterReflection[]};
  //     const parameters = params.map(param => this.$Typedoc.extractDeclaration(param));
  //     data = { ...data, parameters };
  //   }
  //   // result
  //   return data as Data;
  // }

  // getInterfaces() {
  //   return this.$Typedoc.getDeclarations(ReflectionKind.Interface) as Interface[];
  // }

  // getInterface(interfaceName: string) {
  //   return this.$Typedoc.getDeclaration(interfaceName) as Interface;
  // }

  // extractInterface(item: Interface) {
  //   return this.$Typedoc.extractDeclaration(item) as InterfaceData;
  // }

  // iterateInterfaces(
  //   items: Interface[],
  //   handler: InterfaceIterationHandler,
  //   formatter?: InterfaceIterationFormatter,
  // ) {
  //   return items.forEach(item => {
  //     const data = this.extractInterface(item);
  //     const displayData = !!formatter ? formatter(data) : data;
  //     return handler({ item, data, displayData });
  //   });
  // }

  // getClasses() {
  //   return this.$Typedoc.getDeclarations(ReflectionKind.Class) as Class[];
  // }

  // getClass(className: string) {
  //   return this.$Typedoc.getDeclaration(className) as Class;
  // }

  // extractClass(item: Class) {
  //   return this.$Typedoc.extractDeclaration(item) as ClassData;
  // }

  // iterateClasses(
  //   items: Class[],
  //   handler: ClassIterationHandler,
  //   formatter?: ClassIterationFormatter,
  // ) {
  //   return items.forEach(item => {
  //     const data = this.extractClass(item);
  //     const displayData = !!formatter ? formatter(data) : data;
  //     return handler({ item, data, displayData });
  //   });
  // }

  // getVariables(container?: ContainerReflection) {
  //   return this.$Typedoc.getDeclarations(ReflectionKind.Variable, container) as Variable[];
  // }

  // getVariable(variableName: string, container?: ContainerReflection) {
  //   return this.$Typedoc.getDeclaration(variableName, container) as Variable;
  // }

  // extractVariable(item: Variable) {
  //   return this.$Typedoc.extractDeclaration(item) as VariableData;
  // }

  // iterateVariables(
  //   items: Variable[],
  //   handler: VariableIterationHandler,
  //   formatter?: VariableIterationFormatter,
  // ) {
  //   formatter = formatter || (data => {
  //     const { name, isOptional, type, typeLink } = data;
  //     return {
  //       ...data,
  //       name: !isOptional ? `**${name}**` : name,
  //       type: !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
  //     };
  //   });
  //   return items.forEach(item => {
  //     const data = this.extractVariable(item);
  //     const displayData = (formatter as VariableIterationFormatter)(data);
  //     return handler({ item, data, displayData });
  //   });
  // }

  // getProperties(container?: ContainerReflection) {
  //   return this.$Typedoc.getDeclarations(ReflectionKind.Property, container) as Property[];
  // }

  // getProperty(propertyName: string, container?: ContainerReflection) {
  //   return this.$Typedoc.getDeclaration(propertyName, container) as Property;
  // }

  // extractProperty(item: Property) {
  //   return this.$Typedoc.extractDeclaration(item) as PropertyData;
  // }

  // iterateProperties(
  //   items: Property[],
  //   handler: PropertyIterationHandler,
  //   formatter?: PropertyIterationFormatter,
  // ) {
  //   formatter = formatter || (data => {
  //     const { name, isOptional, type, typeLink } = data;
  //     return {
  //       ...data,
  //       name: !isOptional ? `**${name}**` : name,
  //       type: !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
  //     };
  //   });
  //   return items.forEach(item => {
  //     const data = this.extractProperty(item);
  //     const displayData = (formatter as PropertyIterationFormatter)(data);
  //     return handler({ item, data, displayData });
  //   });
  // }

  // getFunctions(allSignatures = true, container?: ContainerReflection) {
  //   const declarations = this.$Typedoc.getDeclarations(ReflectionKind.Function, container);
  //   // get signatures as methods
  //   const methods: Function[] = [];
  //   declarations.forEach(declaration => {
  //     const { signatures = [] } = declaration;
  //     if (allSignatures) {
  //       signatures.forEach(signature => methods.push(signature));
  //     } else {
  //       methods.push(signatures[0]);
  //     }
  //   });
  //   // result
  //   return methods;
  // }

  // getFunction(methodName: string, allSignatures = true, container?: ContainerReflection) {
  //   const { signatures = [] } = this.$Typedoc.getDeclaration(methodName, container);
  //   return allSignatures ? signatures as Function[] : signatures[0] as Function;
  // }

  // extractFunction(item: Function) {
  //   const { parameters: params = [] } = item;
  //   // get data
  //   const declarationData = this.$Typedoc.extractDeclaration(item);
  //   const parameters = params.map(param => this.$Typedoc.extractDeclaration(param));
  //   // result
  //   return { ...declarationData, parameters } as FunctionData;
  // }

  // iterateFunctions(
  //   items: Function[],
  //   handler: FunctionIterationHandler,
  //   formatter?: FunctionIterationFormatter,
  // ) {
  //   formatter = formatter || (data => {
  //     const { name, type, typeLink, parameters = [] } = data;
  //     const paramArr = parameters.map(parameter => parameter.name);
  //     return {
  //       ...data,
  //       name: `${name}(${paramArr.join(', ')})`,
  //       type: !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
  //     };
  //   });
  //   return items.forEach(item => {
  //     const data = this.extractFunction(item);
  //     const displayData = (formatter as FunctionIterationFormatter)(data);
  //     return handler({ item, data, displayData });
  //   });
  // }

  // getMethods(allSignatures = true, container?: ContainerReflection) {
  //   const declarations = this.$Typedoc.getDeclarations(ReflectionKind.Method, container);
  //   // get signatures as methods
  //   const methods: Method[] = [];
  //   declarations.forEach(declaration => {
  //     const { signatures = [] } = declaration;
  //     if (allSignatures) {
  //       signatures.forEach(signature => methods.push(signature));
  //     } else {
  //       methods.push(signatures[0]);
  //     }
  //   });
  //   // result
  //   return methods;
  // }

  // getMethod(methodName: string, allSignatures = true, container?: ContainerReflection) {
  //   const { signatures = [] } = this.$Typedoc.getDeclaration(methodName, container);
  //   return allSignatures ? signatures as Method[] : signatures[0] as Method;
  // }

  // extractMethod(item: Method) {
  //   const { parameters: params = [] } = item;
  //   // get data
  //   const declarationData = this.$Typedoc.extractDeclaration(item);
  //   const parameters = params.map(param => this.$Typedoc.extractDeclaration(param));
  //   // result
  //   return { ...declarationData, parameters } as MethodData;
  // }

  // iterateMethods(
  //   items: Method[],
  //   handler: MethodIterationHandler,
  //   formatter?: MethodIterationFormatter,
  // ) {
  //   formatter = formatter || (data => {
  //     const { name, type, typeLink, parameters = [] } = data;
  //     const paramArr = parameters.map(parameter => parameter.name);
  //     return {
  //       ...data,
  //       name: `${name}(${paramArr.join(', ')})`,
  //       type: !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
  //     };
  //   });
  //   return items.forEach(item => {
  //     const data = this.extractMethod(item);
  //     const displayData = (formatter as MethodIterationFormatter)(data);
  //     return handler({ item, data, displayData });
  //   });
  // }

}