import { Project } from './project';
import { Block, Content } from './content';

import { Declaration } from '../declaration';

export interface ConvertOptions {
  level?: number;
  id?: string;
}

export class Converter {
  private $Project: Project;
  private $Content: Content;

  constructor($Project: Project, $Content: Content) {
    this.$Project = $Project;
    this.$Content = $Content;
  }

  convert(
    declaration: Declaration,
    output: string,
    options: ConvertOptions = {}
  ) {
    const { level, id } = options;
    // override id
    if (!!id) {
      declaration.setId(id);
    }
    // override level
    if (!!level) {
      declaration.setLevel(level);
    }
    // convert
    switch (output) {
      case 'full':
        return this.convertFull(declaration);
      case 'summary_variables':
      case 'summary_properties':
        return this.convertVariablesOrPropertiesSummary(
          declaration.getVariablesOrProperties()
        );
      case 'detail_variables':
      case 'detail_properties':
        return this.convertVariablesOrPropertiesDetail(
          declaration.getVariablesOrProperties()
        );
      case 'full_variables':
      case 'full_properties':
        return this.convertVariablesOrPropertiesFull(declaration);
      case 'summary_functions':
      case 'summary_methods':
        return this.convertFunctionsOrMethodsSummary(
          declaration.getFunctionsOrMethods()
        );
      case 'detail_functions':
      case 'detail_methods':
        return this.convertFunctionsOrMethodsDetail(
          declaration.getFunctionsOrMethods()
        );
      case 'full_functions':
      case 'full_methods':
        return this.convertFunctionsOrMethodsFull(declaration);
      case 'summary_interfaces':
        return this.convertInterfacesSummary(declaration.getInterfaces());
      case 'summary_classes':
        return this.convertClassesSummary(declaration.getClasses());
      case 'self':
      default:
        return this.convertSelf(declaration);
    }
  }

  private convertSelf(declaration: Declaration) {
    const blocks: Block[] = [];
    const { kindString = 'Global' } = declaration.REFLECTION;
    const {
      LEVEL,
      ID,
      NAME,
      LINK,
      TYPE,
      TYPE_LINK,
      SHORT_TEXT,
      TEXT,
      RETURNS,
      PARAMETERS,
    } = declaration;
    // default blocks
    const body = this.$Content.buildText([
      SHORT_TEXT || `The \`${NAME}\` ${kindString.toLowerCase()}.`,
      TEXT || '',
    ]);
    // function or method
    if (declaration.isKind('CallSignature')) {
      const displayName = `${NAME}(${PARAMETERS.map(item => item.name).join(
        ', '
      )})`;
      const head = this.$Content.buildHeader(ID, LEVEL, displayName, LINK);
      blocks.push(head, body);
      // params
      if (!!PARAMETERS.length) {
        const parameterRows = PARAMETERS.map(parameter => {
          const { name, isOptional, type, typeLink, shortText } = parameter;
          return [
            !isOptional ? `**${name}**` : name,
            !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
            shortText || '',
          ];
        });
        blocks.push(
          this.$Content.buildText(`**Parameters**`),
          this.$Content.buildTable(
            ['Param', 'Type', 'Description'],
            parameterRows
          )
        );
      }
      // returns
      const displayType = !!TYPE_LINK
        ? `[\`${TYPE}\`](${TYPE_LINK})`
        : `\`${TYPE}\``;
      blocks.push(
        this.$Content.buildText([
          `**Returns**`,
          `${displayType}${!RETURNS ? '' : ' - ' + RETURNS}`,
        ])
      );
    }
    // any
    else {
      const head = this.$Content.buildHeader(ID, LEVEL, NAME, LINK);
      blocks.push(head, body);
    }
    // result
    return blocks;
  }

  private convertFull(declaration: Declaration) {
    // self
    const self = this.convertSelf(declaration);
    // variables or properties
    const variablesOrPropertiesFull = declaration.hasVariablesOrProperties()
      ? this.convertVariablesOrPropertiesFull(declaration)
      : [];
    // functions or methods
    const functionsOrMethodsFull = declaration.hasFunctionsOrMethods()
      ? this.convertFunctionsOrMethodsFull(declaration)
      : [];
    // all blocks
    return [...self, ...variablesOrPropertiesFull, ...functionsOrMethodsFull];
  }

  private convertVariablesOrPropertiesSummary(
    declarations: Declaration[],
    standalone = true
  ) {
    const blocks: Block[] = [];
    // get data
    const summaryRows: string[][] = [];
    declarations.forEach(declaration => {
      // summary
      const {
        NAME,
        LINK,
        IS_OPTIONAL,
        TYPE,
        TYPE_LINK,
        SHORT_TEXT,
      } = declaration;
      const ref = standalone ? LINK : '#' + declaration.getChildId(NAME);
      summaryRows.push([
        `[${!IS_OPTIONAL ? `**${NAME}**` : NAME}](${ref})`,
        !!TYPE_LINK ? `[\`${TYPE}\`](${TYPE_LINK})` : `\`${TYPE}\``,
        SHORT_TEXT || '',
      ]);
    });
    // summary blocks
    if (!!summaryRows.length) {
      const summaryBlock = this.$Content.buildTable(
        ['Name', 'Type', 'Description'],
        summaryRows
      );
      blocks.push(summaryBlock);
    }
    // result
    return blocks;
  }

  private convertVariablesOrPropertiesDetail(declarations: Declaration[]) {
    const blocks: Block[] = [];
    declarations.forEach(declaration =>
      blocks.push(...this.convertSelf(declaration))
    );
    return blocks;
  }

  private convertVariablesOrPropertiesFull(declaration: Declaration) {
    const parentName = declaration.NAME;
    const [t1, t2] = declaration.isKind('Global')
      ? ['variables', 'variable']
      : ['properties', 'property'];
    // children
    const children = declaration.getVariablesOrProperties();
    // summary
    const summaryText = this.$Content.buildText(`**${parentName} ${t1}**`);
    const summaryBlocks = this.convertVariablesOrPropertiesSummary(
      children,
      false
    );
    // detail
    const detailText = this.$Content.buildText(
      `**${parentName} ${t2} detail**`
    );
    const detailBlocks = this.convertVariablesOrPropertiesDetail(children);
    // result
    return [summaryText, ...summaryBlocks, detailText, ...detailBlocks];
  }

  private convertFunctionsOrMethodsSummary(
    executables: Declaration[],
    standalone = true
  ) {
    const blocks: Block[] = [];
    // get data
    const summaryRows: string[][] = [];
    executables.forEach(executable => {
      // summary
      const { NAME, LINK, TYPE, TYPE_LINK, SHORT_TEXT } = executable;
      const ref = standalone ? LINK : '#' + executable.ID;
      summaryRows.push([
        `[${NAME}](${ref})`,
        !!TYPE_LINK ? `[\`${TYPE}\`](${TYPE_LINK})` : `\`${TYPE}\``,
        SHORT_TEXT || '',
      ]);
    });
    // summary blocks
    if (!!summaryRows.length) {
      const summaryBlock = this.$Content.buildTable(
        ['Function', 'Returns type', 'Description'],
        summaryRows
      );
      blocks.push(summaryBlock);
    }
    // result
    return blocks;
  }

  private convertFunctionsOrMethodsDetail(executables: Declaration[]) {
    const blocks: Block[] = [];
    executables.forEach(executable =>
      blocks.push(...this.convertSelf(executable))
    );
    return blocks;
  }

  private convertFunctionsOrMethodsFull(declaration: Declaration) {
    const parentName = declaration.NAME;
    const [t1, t2] = declaration.isKind('Global')
      ? ['functions', 'function']
      : ['methods', 'method'];
    // children
    const children = declaration.getFunctionsOrMethods();
    // summary
    const summaryText = this.$Content.buildText(`**${parentName} ${t1}**`);
    const summaryBlocks = this.convertFunctionsOrMethodsSummary(
      children,
      false
    );
    // detail
    const detailText = this.$Content.buildText(
      `**${parentName} ${t2} detail**`
    );
    const detailBlocks = this.convertFunctionsOrMethodsDetail(children);
    // result
    return [summaryText, ...summaryBlocks, detailText, ...detailBlocks];
  }

  private convertInterfacesSummary(
    interfaces: Declaration[],
    standalone = true
  ) {
    const blocks: Block[] = [];
    // get data
    const summaryRows: string[][] = [];
    interfaces.forEach(_interface => {
      const { ID, NAME, LINK, SHORT_TEXT } = _interface;
      const ref = standalone ? LINK : '#' + ID;
      summaryRows.push([`[${NAME}](${ref})`, SHORT_TEXT || '']);
    });
    // summary block
    if (!!summaryRows.length) {
      const summaryBlock = this.$Content.buildTable(
        ['Interfaces', 'Description'],
        summaryRows
      );
      blocks.push(summaryBlock);
    }
    // result
    return blocks;
  }

  private convertClassesSummary(classes: Declaration[], standalone = true) {
    const blocks: Block[] = [];
    // get data
    const summaryRows: string[][] = [];
    classes.forEach(_class => {
      const { ID, NAME, LINK, SHORT_TEXT } = _class;
      const ref = standalone ? LINK : '#' + ID;
      summaryRows.push([`[${NAME}](${ref})`, SHORT_TEXT || '']);
    });
    // summary block
    if (!!summaryRows.length) {
      const summaryBlock = this.$Content.buildTable(
        ['Classes', 'Description'],
        summaryRows
      );
      blocks.push(summaryBlock);
    }
    // result
    return blocks;
  }
}
