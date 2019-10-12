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
    // override level
    if (!!level) {
      declaration.setLevel(level);
    }
    // override id
    if (!!id) {
      declaration.setId(id);
    }
    // convert
    switch (output) {
      case 'SUMMARY_VARIABLES':
      case 'SUMMARY_PROPERTIES':
        return this.convertVariablesOrPropertiesSummary(
          declaration.getVariablesOrProperties()
        );
      case 'DETAIL_VARIABLES':
      case 'DETAIL_PROPERTIES':
        return this.convertVariablesOrPropertiesDetail(
          declaration.getVariablesOrProperties()
        );
      case 'FULL_VARIABLES':
      case 'FULL_PROPERTIES':
        return this.convertVariablesOrPropertiesFull(declaration);
      case 'SUMMARY_FUNCTIONS':
      case 'SUMMARY_METHODS':
        return this.convertFunctionsOrMethodsSummary(
          declaration.getFunctionsOrMethods()
        );
      case 'DETAIL_FUNCTIONS':
      case 'DETAIL_METHODS':
        return this.convertFunctionsOrMethodsDetail(
          declaration.getFunctionsOrMethods()
        );
      case 'FULL_FUNCTIONS':
      case 'FULL_METHODS':
        return this.convertFunctionsOrMethodsFull(declaration);
      case 'SUMMARY_INTERFACES':
        return this.convertInterfacesSummary(declaration.getInterfaces());
      case 'SUMMARY_CLASSES':
        return this.convertClassesSummary(declaration.getClasses());
      case 'FULL':
        return this.convertFull(declaration);
      case 'SELF':
      default:
        return this.convertSelf(declaration);
    }
  }

  private convertSelf(declaration: Declaration) {
    const blocks: Block[] = [];
    const kindText = (declaration.REFLECTION.kindString || 'Unknown').toLowerCase();
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
      SHORT_TEXT || `The \`${NAME}\` ${kindText}.`,
      TEXT || '',
    ]);
    // function or method
    if (declaration.isKind('CallSignature')) {
      const params = PARAMETERS
        .map(({ name, isOptional }) => isOptional ? name + '?' : name)
        .join(', ');
      const displayName = `\`${NAME}(${params})\``;
      const head = this.$Content.buildHeader(ID, LEVEL, displayName, LINK);
      blocks.push(head, body);
      // params
      if (!!PARAMETERS.length) {
        const parameterRows = PARAMETERS.map(parameter => {
          const { name, isOptional, type, typeLink, text } = parameter;
          return [
            !isOptional ? `**${name}**` : name,
            !!typeLink ? `[\`${type}\`](${typeLink})` : `\`${type}\``,
            text || '',
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
    // variable or property
    else if (declaration.isKind('Variable') || declaration.isKind('Property')) {
      const displayName = `\`${NAME}\``;
      const head = this.$Content.buildHeader(ID, LEVEL, displayName, LINK);
      blocks.push(head, body);
    }
    // any
    else {
      const displayName = `The \`${NAME}\` ${kindText}`;
      const head = this.$Content.buildHeader(ID, LEVEL, displayName, LINK);
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
      const {
        ID,
        NAME,
        LINK,
        IS_OPTIONAL,
        TYPE,
        TYPE_LINK,
        SHORT_TEXT,
      } = declaration;
      const ref = standalone ? LINK : '#' + ID;
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
    if (!children.length) {
      return [];
    }
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
    declarations: Declaration[],
    standalone = true
  ) {
    const blocks: Block[] = [];
    // get data
    const summaryRows: string[][] = [];
    declarations.forEach(declaration => {
      const {
        ID,
        NAME,
        LINK,
        TYPE,
        TYPE_LINK,
        SHORT_TEXT,
        PARAMETERS,
      } = declaration;
      const params = PARAMETERS
        .map(({ name, isOptional }) => isOptional ? name + '?' : name)
        .join(', ');
      const displayName = `\`${NAME}(${params})\``;
      const ref = standalone ? LINK : '#' + ID;
      summaryRows.push([
        `[${displayName}](${ref})`,
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

  private convertFunctionsOrMethodsDetail(declarations: Declaration[]) {
    const blocks: Block[] = [];
    declarations.forEach(declaration =>
      blocks.push(...this.convertSelf(declaration))
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
    if (!children.length) {
      return [];
    }
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
