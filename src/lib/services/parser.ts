import { Reflection, DeclarationReflection, Typedoc } from './typedoc';
import { Content } from './content';

import { Declaration } from '../components/declaration';

/**
 * The `Parser` turns source code into [Declaration](#declaration)
 */
export class Parser {
  private $Typedoc: Typedoc;
  private $Content: Content;

  constructor($Typedoc: Typedoc, $Content: Content) {
    this.$Typedoc = $Typedoc;
    this.$Content = $Content;
  }

  parse(what?: string | string[], child?: string) {
    // any container
    let reflection = this.$Typedoc.getReflection(what);
    // call signature
    const callable = ((reflection as DeclarationReflection).signatures ||
      [])[0];
    if (!!callable) {
      reflection = callable;
    }
    // accessor
    else {
      const getter = (reflection as DeclarationReflection).getSignature;
      if (!!getter) {
        (reflection as DeclarationReflection).type = getter.type;
      }
    }
    // or a child
    if (!!child) {
      reflection = this.$Typedoc.getChildReflection(reflection, child);
    }
    // parse result
    return new Declaration(this.$Typedoc, this.$Content, reflection);
  }
}
