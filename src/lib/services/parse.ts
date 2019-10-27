import { DeclarationReflection } from 'typedoc';

import { TypedocService } from './typedoc';
import { ContentService } from './content';

import { Declaration } from '../declaration';

/**
 * The `Parser` turns source code into [Declaration](#declaration)
 */
export class ParseService {

  constructor(
    private typedocService: TypedocService,
    private contentService: ContentService
  ) {}

  parse(input?: string) {
    const { what, child } = this.extractInput(input || '*');
    // any container
    let reflection = this.typedocService.getReflection(what);
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
      reflection = this.typedocService.getChildReflection(reflection, child);
    }
    // parse result
    return new Declaration(this.typedocService, this.contentService, reflection);
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
