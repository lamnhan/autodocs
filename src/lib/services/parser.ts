import {
  DeclarationReflection,
  ReflectionKind,
  Typedoc,
} from './typedoc';
import { Content } from './content';

import { Declaration } from '../declarations/declaration';
import { Variable } from '../declarations/variable';
import { Property } from '../declarations/property';
import { Function } from '../declarations/function';
import { Method } from '../declarations/method';
import { Interface } from '../declarations/interface';
import { Class } from '../declarations/class';
import { Global } from '../declarations/global';

export class Parser {

  private $Typedoc: Typedoc;
  private $Content: Content;

  constructor($Typedoc: Typedoc, $Content: Content) {
    this.$Typedoc = $Typedoc;
    this.$Content = $Content;
  }

  get(what?: string | string[]) {
    const reflection = this.$Typedoc.getReflection(what);
    const kind = reflection.kind;
    return (
      kind === ReflectionKind.Variable
      ? new Variable(this.$Typedoc, this.$Content, reflection)
      : kind === ReflectionKind.Property
      ? new Property(this.$Typedoc, this.$Content, reflection)
      : kind === ReflectionKind.Function
      ? new Function(
          this.$Typedoc,
          this.$Content,
          ((reflection as DeclarationReflection).signatures || [])[0]
        )
      : kind === ReflectionKind.Method
      ? new Method(this.$Typedoc, this.$Content, reflection)
      : kind === ReflectionKind.Interface
      ? new Interface(this.$Typedoc, this.$Content, reflection)
      : kind === ReflectionKind.Class
      ? new Class(this.$Typedoc, this.$Content, reflection)
      : new Global(this.$Typedoc, this.$Content, reflection)
    ) as Declaration;
  }

  getVariables() {}

  getVariable() {}

  getFunctions() {}

  getFunction() {}

  getInterfaces() {}

  getInterface() {}

  getClasses() {}

  getClass() {}

}