import { Reflection, DeclarationReflection, Typedoc } from './typedoc';
import { Content } from './content';

import { Declaration } from '../components/declaration';

export class Parser {
  private $Typedoc: Typedoc;
  private $Content: Content;

  constructor($Typedoc: Typedoc, $Content: Content) {
    this.$Typedoc = $Typedoc;
    this.$Content = $Content;
  }

  parse(what?: string | string[], child?: string) {
    // container
    const anyReflection = this.$Typedoc.getReflection(what);
    const functionOrMethod = ((anyReflection as DeclarationReflection)
      .signatures || [])[0];
    let reflection = (functionOrMethod || anyReflection) as Reflection;
    // or a child
    if (!!child) {
      reflection = this.$Typedoc.getChildReflection(reflection, child);
    }
    // parse result
    return new Declaration(this.$Typedoc, this.$Content, reflection);
  }
}
