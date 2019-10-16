import { Project } from './project';
import { DefaultValue } from './typedoc';
import { Block, Content } from './content';

import { Declaration } from '../components/declaration';

interface DeclarationOptions {
  id?: string;
  level?: number;
}

interface HeaderOptions {
  title?: string;
  link?: string;
}

export interface ConvertOptions extends DeclarationOptions, HeaderOptions {}

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
        return this.summaryVariablesOrProperties(
          declaration.getVariablesOrProperties()
        );
      case 'DETAIL_VARIABLES':
      case 'DETAIL_PROPERTIES':
        return this.detailVariablesOrProperties(
          declaration.getVariablesOrProperties()
        );
      case 'FULL_VARIABLES':
      case 'FULL_PROPERTIES':
        return this.fullVariablesOrProperties(declaration);
      case 'SUMMARY_FUNCTIONS':
      case 'SUMMARY_METHODS':
        return this.summaryFunctionsOrMethods(
          declaration.getFunctionsOrMethods()
        );
      case 'DETAIL_FUNCTIONS':
      case 'DETAIL_METHODS':
        return this.detailFunctionsOrMethods(
          declaration.getFunctionsOrMethods()
        );
      case 'FULL_FUNCTIONS':
      case 'FULL_METHODS':
        return this.fullFunctionsOrMethods(declaration);
      case 'SUMMARY_INTERFACES':
        return this.summaryInterfaces(declaration.getInterfaces());
      case 'DETAIL_INTERFACES':
        return this.detailInterfaces(declaration.getInterfaces());
      case 'FULL_INTERFACES':
        return this.fullInterfaces(declaration);
      case 'SUMMARY_CLASSES':
        return this.summaryClasses(declaration.getClasses());
      case 'DETAIL_CLASSES':
        return this.detailClasses(declaration.getClasses());
      case 'FULL_CLASSES':
        return this.fullClasses(declaration);
      case 'VALUE':
        return this.value(declaration);
      case 'VALUE_RAW':
        return this.value(declaration, true);
      case 'FULL':
        return this.full(declaration, options);
      case 'SELF':
      default:
        return this.self(declaration, options);
    }
  }

  private value(declaration: Declaration, rawObject = false) {
    const { DEFAULT_VALUE } = declaration;
    // converter
    const convertValue = (value: DefaultValue) => {
      if (value instanceof Array) {
        const items: string[] = [];
        value.forEach(item => {
          const valueText = convertValue(item);
          items.push('<li>' + this.$Content.md2Html(valueText) + '</li>');
        });
        return this.$Content.renderText(['<ol>', ...items, '</ol>'], true);
      } else if (value instanceof Object) {
        if (rawObject) {
          return this.$Content.renderText([
            `\`\`\`json`,
            JSON.stringify(value, null, 2),
            `\`\`\``,
          ]);
        } else {
          const items: string[] = [];
          const valueObj = value as { [key: string]: DefaultValue };
          Object.keys(valueObj).forEach(key => {
            const item = valueObj[key];
            const valueText = convertValue(item);
            items.push(
              '<li>' +
                this.$Content.md2Html(`**\`${key}\`**: ` + valueText) +
                '</li>'
            );
          });
          return this.$Content.renderText(['<ul>', ...items, '</ul>'], true);
        }
      } else if (
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'undefined'
      ) {
        return `\`${value}\``;
      } else {
        return value;
      }
    };
    // result
    const valueText = convertValue(DEFAULT_VALUE);
    return [this.$Content.blockText(valueText)];
  }

  private self(declaration: Declaration, options: ConvertOptions = {}) {
    const { title: customTitle, link: customLink } = options;
    const blocks: Block[] = [];
    const kindText = (
      declaration.REFLECTION.kindString || 'Unknown'
    ).toLowerCase();
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
    const body = this.$Content.blockText([
      '**' + (SHORT_TEXT || `The \`${NAME}\` ${kindText}.`) + '**',
      TEXT || '',
    ]);
    // function or method
    if (declaration.isKind('CallSignature')) {
      const params = PARAMETERS.map(({ name, isOptional }) =>
        isOptional ? name + '?' : name
      ).join(', ');
      const title = customTitle || `\`${NAME}(${params})\``;
      const link = customLink || LINK;
      blocks.push(this.$Content.blockHeader(title, LEVEL, ID, link), body);
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
          this.$Content.blockText(`**Parameters**`),
          this.$Content.blockTable(
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
        this.$Content.blockText([
          `**Returns**`,
          `${displayType}${!RETURNS ? '' : ' - ' + RETURNS}`,
        ])
      );
    }
    // variable or property
    else if (declaration.isKind('Variable') || declaration.isKind('Property')) {
      const title = customTitle || `\`${NAME}\``;
      const link = customLink || LINK;
      blocks.push(this.$Content.blockHeader(title, LEVEL, ID, link), body);
    }
    // any
    else {
      const title = customTitle || `The \`${NAME}\` ${kindText}`;
      const link = customLink || LINK;
      blocks.push(this.$Content.blockHeader(title, LEVEL, ID, link), body);
    }
    // result
    return blocks;
  }

  private full(declaration: Declaration, options: ConvertOptions = {}) {
    // self
    const self = this.self(declaration, options);
    // variables or properties
    const variablesOrPropertiesFull = declaration.hasVariablesOrProperties()
      ? this.fullVariablesOrProperties(declaration)
      : [];
    // functions or methods
    const functionsOrMethodsFull = declaration.hasFunctionsOrMethods()
      ? this.fullFunctionsOrMethods(declaration)
      : [];
    // interfaces
    const interfacesFull = declaration.hasInterfaces()
      ? this.fullInterfaces(declaration)
      : [];
    // classes
    const classesFull = declaration.hasClasses()
      ? this.fullClasses(declaration)
      : [];
    // all blocks
    return [
      ...self,
      ...variablesOrPropertiesFull,
      ...functionsOrMethodsFull,
      ...interfacesFull,
      ...classesFull,
    ];
  }

  private summaryVariablesOrProperties(
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
      const displayName = !IS_OPTIONAL ? `**${NAME}**` : NAME;
      const ref = standalone ? LINK : '#' + ID;
      summaryRows.push([
        `[${displayName}](${ref})`,
        !!TYPE_LINK ? `[\`${TYPE}\`](${TYPE_LINK})` : `\`${TYPE}\``,
        SHORT_TEXT || '',
      ]);
    });
    // summary blocks
    if (!!summaryRows.length) {
      const summaryBlock = this.$Content.blockTable(
        ['Name', 'Type', 'Description'],
        summaryRows
      );
      blocks.push(summaryBlock);
    }
    // result
    return blocks;
  }

  private detailVariablesOrProperties(declarations: Declaration[]) {
    const blocks: Block[] = [];
    declarations.forEach(declaration =>
      blocks.push(...this.self(declaration), this.$Content.blockText('---'))
    );
    return blocks;
  }

  private fullVariablesOrProperties(declaration: Declaration) {
    const parentName = declaration.NAME;
    const childKind = declaration.isKind('Global') ? 'variables' : 'properties';
    // children
    const children = declaration.getVariablesOrProperties();
    if (!children.length) {
      return [];
    }
    // summary
    const summaryText = this.$Content.blockText(
      `**${parentName} ${childKind} summary**`
    );
    const summaryBlocks = this.summaryVariablesOrProperties(children, false);
    // detail
    const detailText = this.$Content.blockText(
      `**${parentName} ${childKind} detail**`
    );
    const detailBlocks = this.detailVariablesOrProperties(children);
    // result
    return [summaryText, ...summaryBlocks, detailText, ...detailBlocks];
  }

  private summaryFunctionsOrMethods(
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
      const params = PARAMETERS.map(({ name, isOptional }) =>
        isOptional ? name + '?' : name
      ).join(', ');
      const displayName = `${NAME}(${params})`;
      const ref = standalone ? LINK : '#' + ID;
      summaryRows.push([
        `[${displayName}](${ref})`,
        !!TYPE_LINK ? `[\`${TYPE}\`](${TYPE_LINK})` : `\`${TYPE}\``,
        SHORT_TEXT || '',
      ]);
    });
    // summary blocks
    if (!!summaryRows.length) {
      const summaryBlock = this.$Content.blockTable(
        ['Function', 'Returns type', 'Description'],
        summaryRows
      );
      blocks.push(summaryBlock);
    }
    // result
    return blocks;
  }

  private detailFunctionsOrMethods(declarations: Declaration[]) {
    const blocks: Block[] = [];
    declarations.forEach(declaration =>
      blocks.push(...this.self(declaration), this.$Content.blockText('---'))
    );
    return blocks;
  }

  private fullFunctionsOrMethods(declaration: Declaration) {
    const parentName = declaration.NAME;
    const childKind = declaration.isKind('Global') ? 'functions' : 'methods';
    // children
    const children = declaration.getFunctionsOrMethods();
    if (!children.length) {
      return [];
    }
    // summary
    const summaryText = this.$Content.blockText(
      `**${parentName} ${childKind} summary**`
    );
    const summaryBlocks = this.summaryFunctionsOrMethods(children, false);
    // detail
    const detailText = this.$Content.blockText(
      `**${parentName} ${childKind} detail**`
    );
    const detailBlocks = this.detailFunctionsOrMethods(children);
    // result
    return [summaryText, ...summaryBlocks, detailText, ...detailBlocks];
  }

  private summaryInterfaces(interfaces: Declaration[], standalone = true) {
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
      const summaryBlock = this.$Content.blockTable(
        ['Interfaces', 'Description'],
        summaryRows
      );
      blocks.push(summaryBlock);
    }
    // result
    return blocks;
  }

  private detailInterfaces(declarations: Declaration[]) {
    const blocks: Block[] = [];
    declarations.forEach(_interface => blocks.push(...this.full(_interface)));
    return blocks;
  }

  private fullInterfaces(declaration: Declaration) {
    // children
    const children = declaration.getInterfaces();
    if (!children.length) {
      return [];
    }
    // summary
    const summaryBlocks = this.summaryInterfaces(children, false);
    // detail
    const detailBlocks = this.detailInterfaces(children);
    // result
    return [...summaryBlocks, ...detailBlocks];
  }

  private summaryClasses(classes: Declaration[], standalone = true) {
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
      const summaryBlock = this.$Content.blockTable(
        ['Classes', 'Description'],
        summaryRows
      );
      blocks.push(summaryBlock);
    }
    // result
    return blocks;
  }

  private detailClasses(declarations: Declaration[]) {
    const blocks: Block[] = [];
    declarations.forEach(_class => blocks.push(...this.full(_class)));
    return blocks;
  }

  private fullClasses(declaration: Declaration) {
    // children
    const children = declaration.getClasses();
    if (!children.length) {
      return [];
    }
    // summary
    const summaryBlocks = this.summaryClasses(children, false);
    // detail
    const detailBlocks = this.detailClasses(children);
    // result
    return [...summaryBlocks, ...detailBlocks];
  }
}
