import { DeclarationReflection, Typedoc } from '../services/typedoc';
import { Content } from '../services/content';

import { VariableData, Variable } from './variable';

export interface PropertyData extends VariableData {}

export class Property extends Variable {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    declaration: DeclarationReflection
  ) {
    super($Typedoc, $Content, declaration);
  }

  getData() {
    return super.getData() as PropertyData;
  }

}