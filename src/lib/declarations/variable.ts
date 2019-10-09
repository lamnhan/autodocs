import {
  Reflection,
  ReflectionData,
  Typedoc
} from '../services/typedoc';
import { Content } from '../services/content';

import { Declaration } from './declaration';

export interface VariableData extends ReflectionData {}

export class Variable extends Declaration {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    reflection: Reflection
  ) {
    super($Typedoc, $Content, reflection);
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