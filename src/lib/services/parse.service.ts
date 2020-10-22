import {DeclarationReflection} from 'typedoc';

import {ProjectService} from './project.service';
import {TypedocService} from './typedoc.service';
import {ContentService} from './content.service';

import {DeclarationObject} from '../objects/declaration.object';

/**
 * The `Parser` turns source code into [[DeclarationObject]]
 */
export class ParseService {
  private cache: {[input: string]: DeclarationObject} = {};

  constructor(
    private projectService: ProjectService,
    private typedocService: TypedocService,
    private contentService: ContentService
  ) {}

  /**
   * Turn the source code into a [[DeclarationObject]].
   * @param input - Parsing input
   */
  parse(input?: string) {
    input = input || '*';
    // get from cache
    let declaration = this.cache[input];
    // no cached
    if (!declaration) {
      const {what, child} = this.extractInput(input);
      // any container
      let reflection = this.typedocService.getReflection(what);
      // call signature
      const callSignature = ((reflection as DeclarationReflection).signatures ||
        [])[0];
      if (callSignature) {
        reflection = callSignature;
      }
      // accessor
      else {
        const getSignature = (reflection as DeclarationReflection).getSignature;
        if (getSignature) {
          (reflection as DeclarationReflection).type = getSignature.type;
        }
      }
      // or a child
      if (child) {
        reflection = this.typedocService.getChildReflection(reflection, child);
      }
      // parse result
      declaration = new DeclarationObject(
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
    let what: undefined | string | string[];
    let child: undefined | string;
    if (!input || input === '*') {
      what = undefined;
    } else if (input.charAt(0) === '[' && input.substr(-1) === ']') {
      what = input
        .substring(1, input.length - 1)
        .split(',')
        .map(x => x.trim().replace(/@/g, 'src/').replace(/'|"/g, ''));
    } else {
      const inputSplit = input.split('.');
      what = inputSplit[0];
      child = inputSplit[1];
    }
    return {what, child};
  }
}
