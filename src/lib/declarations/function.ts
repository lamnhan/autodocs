import {
  DeclarationReflection,
  DeclarationData,
  Typedoc,
} from '../services/typedoc';
import { Block, Content } from '../services/content';

import { Base } from './base';

export interface FunctionData extends DeclarationData {
  parameters?: DeclarationData[];
}

export class Function extends Base {

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    declaration: DeclarationReflection,
  ) {
    super($Typedoc, $Content, declaration);
  }

  getData() {
    return super.getData() as FunctionData;
  }

  convertSelf() {
    const blocks: Block[] = [];
    const {
      name,
      kindString,
      type,
      typeLink,
      shortText,
      text,
      returns,
      link,
      parameters = [],
    } = this.getData();
    // self blocks
    const displayName = `${name}(${parameters.map(item => item.name).join(', ')})`;
    blocks.push(
      this.Content.buildHeader(this.ID, this.LEVEL, displayName, link),
      this.Content.buildText([
        shortText || `The \`name\` ${kindString.toLowerCase()}.`,
        text || '',
      ])
    );
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
        this.Content.buildTable(['Param', 'Returns type', 'Description'], parameterRows)
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