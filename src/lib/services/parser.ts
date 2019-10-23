import { DeclarationReflection, Typedoc } from './typedoc';
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

  parse(input?: string) {
    const { what, child } = this.extractInput(input || '*');
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

  private extractInput(input: string) {
    const [whatDef, child] = (
      input.indexOf('@') === -1
      ? input.split('.')
      : [input]
    );
    const what =
      !whatDef || whatDef === '*'
        ? undefined
        : whatDef.indexOf('@') !== -1
        ? whatDef.replace(/\@/g, 'src/').split('+')
        : whatDef;
    return { what, child };
  }
}
