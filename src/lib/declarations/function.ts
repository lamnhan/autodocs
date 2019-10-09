import {
  Reflection,
  ReflectionData,
  Typedoc,
} from '../services/typedoc';
import { Block, Content } from '../services/content';

import { Declaration } from './declaration';

export interface FunctionData extends ReflectionData {
  parameters?: ReflectionData[];
}

export class Function extends Declaration {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    reflection: Reflection,
  ) {
    super($Typedoc, $Content, reflection);
  }

  getData() {
    return super.getData() as FunctionData;
  }

  convertSelf() {
    const blocks: Block[] = [];
    const {
      name,
      type,
      typeLink,
      returns,
      link,
      parameters = [],
    } = this.getData();
    // self blocks
    const displayName = `${name}(${parameters.map(item => item.name).join(', ')})`;
    const head = this.Content.buildHeader(this.ID, this.LEVEL, displayName, link);
    const [ , body ] = super.convertSelf();
    blocks.push(head, body);
    // params
    if (!!parameters.length) {
      const parameterRows = parameters.map(parameter => {
        const { name, isOptional, type, typeLink, shortText } = parameter;
        return [
          !isOptional ? `**${name}**` : name,
          !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
          shortText || '',
        ];
      });
      blocks.push(
        this.Content.buildText(`**Parameters**`),
        this.Content.buildTable(['Param', 'Type', 'Description'], parameterRows)
      );
    }
    // returns
    const displayType = !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``;
    blocks.push(
      this.Content.buildText([
        `**Returns**`,
        `${displayType}${!returns ? '' : ' - ' + returns}`
      ])
    );
    // result
    return blocks;
  }

}