import { DeclarationReflection } from 'typedoc';

import { ProjectService } from './project';
import { TypedocService } from './typedoc';
import { ContentService } from './content';

import { Declaration } from '../declaration';

/**
 * The `Parser` turns source code into [[Declaration]]
 */
export class ParseService {
  private cache: {[input: string]: Declaration} = {};

  constructor(
    private projectService: ProjectService,
    private typedocService: TypedocService,
    private contentService: ContentService
  ) {}

  parse(input?: string) {
    input = input || '*';
    // get from cache
    let declaration = this.cache[input];
    // no cached
    if (!declaration) {
      const { what, child } = this.extractInput(input);
      // any container
      let reflection = this.typedocService.getReflection(what);
      // call signature
      const callSignature = ((reflection as DeclarationReflection).signatures ||
        [])[0];
      if (!!callSignature) {
        reflection = callSignature;
      }
      // accessor
      else {
        const getSignature = (reflection as DeclarationReflection).getSignature;
        if (!!getSignature) {
          (reflection as DeclarationReflection).type = getSignature.type;
        }
      }
      // or a child
      if (!!child) {
        reflection = this.typedocService.getChildReflection(reflection, child);
      }
      // parse result
      declaration = new Declaration(
        this.projectService,
        this.typedocService,
        this.contentService,
        reflection
      );
      // save cache
      this.cache[input] = declaration;
    }
    // result
    return declaration;
  }

  private extractInput(input: string) {
    const [whatDef, child] =
      input.indexOf('@') === -1 ? input.split('.') : [input];
    const what =
      !whatDef || whatDef === '*'
        ? undefined
        : whatDef.indexOf('@') !== -1
        ? whatDef.replace(/\@/g, 'src/').split('+')
        : whatDef;
    return { what, child };
  }
}
