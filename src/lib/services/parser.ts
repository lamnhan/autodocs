import { DeclarationReflection, Typedoc } from './typedoc';
import { Content } from './content';

import { Declaration } from '../declaration';

export class Parser {

  private $Typedoc: Typedoc;
  private $Content: Content;

  constructor($Typedoc: Typedoc, $Content: Content) {
    this.$Typedoc = $Typedoc;
    this.$Content = $Content;
  }
  
  parse(what?: string | string[]) {
    const anyReflection = this.$Typedoc.getReflection(what);
    const functionOrMethod = ((anyReflection as DeclarationReflection).signatures || [])[0];
    return new Declaration(
      this.$Typedoc,
      this.$Content,
      functionOrMethod || anyReflection
    );
  }

}