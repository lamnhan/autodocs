import {
  DeclarationReflection,
  DeclarationData,
  Typedoc
} from '../services/typedoc';
import { Content } from '../services/content';

import { Base } from './base';

export interface VariableData extends DeclarationData {}

export class Variable extends Base {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    declaration: DeclarationReflection
  ) {
    super($Typedoc, $Content, declaration);
  }

  getData() {
    return super.getData() as VariableData;
  }

  convertSelf() {
    const basicBlocks = super.convertSelf();
    const { type, typeLink } = this.getData();
    const displayType = !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``;
    const typeBlock = this.Content.buildText([`**Type**`, displayType]);
    return [ ...basicBlocks, typeBlock ];
  }

}