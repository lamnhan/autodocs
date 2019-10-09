import { Reflection, Typedoc } from '../services/typedoc';
import { Content } from '../services/content';

import { VariableData, Variable } from './variable';

export interface PropertyData extends VariableData {}

export class Property extends Variable {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    reflection: Reflection
  ) {
    super($Typedoc, $Content, reflection);
  }

  getData() {
    return super.getData() as PropertyData;
  }

}