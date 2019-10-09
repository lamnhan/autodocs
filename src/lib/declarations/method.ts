import {
  Reflection,
  Typedoc,
} from '../services/typedoc';
import { Content } from '../services/content';

import { FunctionData, Function } from './function';

export interface MethodData extends FunctionData {}

export class Method extends Function {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    reflection: Reflection,
  ) {
    super($Typedoc, $Content, reflection);
  }

  getData() {
    return super.getData() as MethodData;
  }

}