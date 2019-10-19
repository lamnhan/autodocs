import { Project } from './project';
import { DefaultValue } from './typedoc';
import { Block, Content } from './content';

import { Declaration } from '../components/declaration';

export interface DeclarationOptions {
  id?: string;
  level?: number;
}

export interface HeadingOptions {
  title?: string;
  link?: string;
}

export interface ValueOptions {
  raw?: boolean;
}

export interface ConvertingOptions {
  heading?: boolean;
  local?: boolean;
}

export interface ConvertOptions extends
DeclarationOptions,
HeadingOptions,
ValueOptions,
ConvertingOptions
{}

/**
 * The `Converter` turns [Declaration](#declaration) into content blocks
 * 
 * ### Converter output
 *
 * A [Declaration](#declaration) supports certain output depended on its kind:
 *
 * | Output | Kinds | Description |
 * | --- | --- | ---|
 * | __FULL__ | any | All content |
 * | __SELF__ | any | Title, description, content WITHOUT local sections, parameters & returns (for function) |
 * | __SECTION:<SECTION_ID>__ | any | A local section |
 * | __VALUE__ | `Variable`, `Property` | Default value |
 * | __SUMMARY_VARIABLES__ | `Collection` | Summary table of variables |
 * | __DETAIL_VARIABLES__ | `Collection` | Detail list of variables |
 * | __FULL_VARIABLES__ | `Collection` | Summary table & detail list of variables |
 * | __SUMMARY_FUNCTIONS__ | `Collection` | Summary table of functions |
 * | __DETAIL_FUNCTIONS__ | `Collection` | Detail list of functions |
 * | __FULL_FUNCTIONS__ | `Collection` | Summary table & detail list of functions |
 * | __SUMMARY_PROPERTIES__ | `Interface`, `Class` | Summary table of properties |
 * | __DETAIL_PROPERTIES__ | `Interface`, `Class` | Detail list of properties |
 * | __FULL_PROPERTIES__ | `Interface`, `Class` | Summary table & detail list of properties |
 * | __SUMMARY_METHODS__ | `Class` | Summary table of methods |
 * | __DETAIL_METHODS__ | `Class` | Detail list of methods |
 * | __FULL_METHODS__ | `Class` | Summary table & detail list of methods |
 * | __SUMMARY_INTERFACES__ | `Collection` | Summary table of interfaces |
 * | __DETAIL_INTERFACES__ | `Collection` | Detail list of interfaces |
 * | __FULL_INTERFACES__ | `Collection` | Summary table & detail list of interfaces |
 * | __SUMMARY_CLASSES__ | `Collection` | Summary table of classes |
 * | __DETAIL_CLASSES__ | `Collection` | Detail list of classes |
 * | __FULL_CLASSES__ | `Collection` | Summary table & detail list of classes |
 * 
 */
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
    // section
    if (output.indexOf('SECTION:') !== -1) {
      const sectionId = output.replace('SECTION:', '');
      return this.getSection(declaration, sectionId);
    }
    // convert
    switch (output) {
      // full
      case 'FULL':
        return this.getFull(declaration, options);
      // value
      case 'VALUE':
        return this.getValue(declaration, options);
      // variables & properties
      case 'SUMMARY_VARIABLES':
      case 'SUMMARY_PROPERTIES':
        return this.getVariablesOrProperties(declaration, 'summary', options);
      case 'DETAIL_VARIABLES':
      case 'DETAIL_PROPERTIES':
        return this.getVariablesOrProperties(declaration, 'detail', options);
      case 'FULL_VARIABLES':
      case 'FULL_PROPERTIES':
        return this.getVariablesOrProperties(declaration, 'full', options);
      // functions & methods
      case 'SUMMARY_FUNCTIONS':
      case 'SUMMARY_METHODS':
        return this.getFunctionsOrMethods(declaration, 'summary', options);
      case 'DETAIL_FUNCTIONS':
      case 'DETAIL_METHODS':
        return this.getFunctionsOrMethods(declaration, 'detail', options);
      case 'FULL_FUNCTIONS':
      case 'FULL_METHODS':
        return this.getFunctionsOrMethods(declaration, 'full', options);
      // interfaces
      case 'SUMMARY_INTERFACES':
        return this.getInterfaces(declaration, 'summary', options);
      case 'DETAIL_INTERFACES':
        return this.getInterfaces(declaration, 'detail', options);
      case 'FULL_INTERFACES':
        return this.getInterfaces(declaration, 'full', options);
      // classes
      case 'SUMMARY_CLASSES':
        return this.getClasses(declaration, 'summary', options);
      case 'DETAIL_CLASSES':
        return this.getClasses(declaration, 'detail', options);
      case 'FULL_CLASSES':
        return this.getClasses(declaration, 'full', options);
      // self
      case 'SELF':
      default:
        return this.getSelf(declaration, options);
    }
  }

  private getFull(
    declaration: Declaration,
    headingOptions: HeadingOptions = {}
  ) {
    const result: Block[] = [];
    // self
    const self = this.getSelf(declaration, headingOptions);
    result.push(...self);
    // variables or properties
    if (declaration.hasVariablesOrProperties()) {
      result.push(
        ...this.getVariablesOrProperties(
          declaration,
          'summary',
          {
            heading: true,
          }
        )
      );
    }
    // functions or methods
    if (declaration.hasFunctionsOrMethods()) {
      result.push(
        ...this.getFunctionsOrMethods(
          declaration,
          'full',
          {
            heading: true,
            local: true,
          }
        )
      );
    }
    // interfaces
    if (declaration.hasInterfaces()) {
      result.push(
        ...this.getInterfaces(
          declaration,
          'full',
          {
            heading: true,
            local: true,
          }
        )
      );
    }
    // classes
    if (declaration.hasClasses()) {
      result.push(
        ...this.getClasses(
          declaration,
          'full',
          {
            heading: true,
            local: true,
          }
        )
      );
    }
    // result
    return result;
  }

  private getSelf(
    declaration: Declaration,
    headingOptions: HeadingOptions = {}
  ) {
    const { title: customTitle, link: customLink } = headingOptions;
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
      DISPLAY_TYPE,
      SHORT_TEXT,
      TEXT,
      RETURNS,
      PARAMETERS,
    } = declaration;
    // default blocks
    const body = this.$Content.blockText([
      '**' + (SHORT_TEXT || `The \`${NAME}\` ${kindText}.`) + '**',
      TEXT,
    ]);
    // function or method
    if (declaration.isKind('CallSignature')) {
      const params = PARAMETERS.map(({ name, isOptional }) =>
        isOptional ? name + '?' : name
      ).join(', ');
      const title = customTitle || `\`${NAME}(${params})\``;
      const link = customLink || LINK;
      blocks.push(this.$Content.blockHeading(title, LEVEL, ID, link), body);
      // params
      if (!!PARAMETERS.length) {
        const parameterRows = PARAMETERS.map(parameter => {
          const { name, isOptional, displayType, text } = parameter;
          return [
            !isOptional ? `**${name}**` : name,
            `<code>${displayType}</code>`,
            (text || '').replace(/(?:\r\n|\r|\n)/g, ''),
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
      blocks.push(
        this.$Content.blockText([
          `**Returns**`,
          `${DISPLAY_TYPE}${!RETURNS ? '' : ' - ' + RETURNS}`,
        ])
      );
    }
    // variable or property
    else if (
      declaration.isKind('Variable') ||
      declaration.isKind('Property') ||
      declaration.isKind('Accessor')
    ) {
      const title = customTitle || `\`${NAME}\``;
      const link = customLink || LINK;
      blocks.push(this.$Content.blockHeading(title, LEVEL, ID, link), body);
    }
    // any
    else {
      const title = customTitle || `The \`${NAME}\` ${kindText}`;
      const link = customLink || LINK;
      blocks.push(this.$Content.blockHeading(title, LEVEL, ID, link), body);
    }
    // result
    return blocks;
  }

  private getSection(
    declaration: Declaration,
    sectionId: string
  ) {
    const {[sectionId]: sectionContent = ''} = declaration.SECTIONS;
    const content = this.$Content.blockText(sectionContent);
    return [content];
  }

  private getValue(
    declaration: Declaration,
    valueOptions: ValueOptions = {}
  ) {
    const { raw: rawObject } = valueOptions;
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

  private getVariablesOrProperties(
    declaration: Declaration,
    mode: 'summary' | 'detail' | 'full',
    convertingOptions: ConvertingOptions = {},
  ) {
    const { heading: withHeading, local: localLinking } = convertingOptions;
    // get children
    const children = declaration.getVariablesOrProperties(withHeading ? 2 : 1);
    // build blocks
    const result: Block[] = [];
    if (!!children.length) {
      // heading
      if (withHeading) {
        const headingTitle = (
          declaration.NAME + ' ' +
          (
            declaration.isKind('Global')
            ? 'variables'
            : 'properties'
          )
        );
        const heading = this.$Content.blockHeading(
          headingTitle, 3, this.$Content.buildId(headingTitle),
        );
        result.push(heading);
      }
      //
      const summaryRows: string[][] = [];
      const detailBlocks: Block[] = [];
      children.forEach(child => {
        const {
          REFLECTION,
          ID,
          NAME,
          LINK,
          IS_OPTIONAL,
          DISPLAY_TYPE,
          SHORT_TEXT,
        } = child;
        const displayName = (
          !!REFLECTION.parent && REFLECTION.parent.kindString === 'Interface'
          ? (!IS_OPTIONAL ? `**${NAME}**` : NAME) // interface parent
          : NAME // collection or class
        );
        const ref = !!localLinking ? '#' + ID : LINK;
        //
        if (mode === 'summary' || mode === 'full') {
          summaryRows.push([
            `[${displayName}](${ref})`,
            DISPLAY_TYPE,
            SHORT_TEXT,
          ]);
        }
        //
        if (mode === 'detail' || mode === 'full') {
          detailBlocks.push(
            ...this.getSelf(child),
            this.$Content.blockText('---')
          );
        }
      });
      // summary table
      if (!!summaryRows.length) {
        result.push(
          this.$Content.blockTable(
            ['Name', 'Type', 'Description'],
            summaryRows
          )
        );
      }
      // detail
      if (!!detailBlocks.length) {
        result.push(...detailBlocks);
      }
    }
    // result
    return result;
  }

  private getFunctionsOrMethods(
    declaration: Declaration,
    mode: 'summary' | 'detail' | 'full',
    convertingOptions: ConvertingOptions = {},
  ) {
    const { heading: withHeading, local: localLinking } = convertingOptions;
    // get children
    const children = declaration.getFunctionsOrMethods(withHeading ? 2 : 1);
    // build blocks
    const result: Block[] = [];
    if (!!children.length) {
      // heading
      if (withHeading) {
        const headingTitle = (
          declaration.NAME + ' ' +
          (
            declaration.isKind('Global')
            ? 'functions'
            : 'methods'
          )
        );
        const heading = this.$Content.blockHeading(
          headingTitle, 3, this.$Content.buildId(headingTitle),
        );
        result.push(heading);
      }
      // 
      const summaryRows: string[][] = [];
      const detailBlocks: Block[] = [];
      children.forEach(child => {
        const {
          ID,
          NAME,
          LINK,
          DISPLAY_TYPE,
          SHORT_TEXT,
          PARAMETERS,
        } = child;
        const params = PARAMETERS.map(({ name, isOptional }) =>
          isOptional ? name + '?' : name
        ).join(', ');
        const displayName = `${NAME}(${params})`;
        const ref = localLinking ? '#' + ID : LINK;
        //
        if (mode === 'summary' || mode === 'full') {
          summaryRows.push([
            `[${displayName}](${ref})`,
            DISPLAY_TYPE,
            SHORT_TEXT || '',
          ]);
        }
        //
        if (mode === 'detail' || mode === 'full') {
          detailBlocks.push(
            ...this.getSelf(child),
            this.$Content.blockText('---')
          );
        }
      });
      // summary
      if (!!summaryRows.length) {
        result.push(
          this.$Content.blockTable(
            ['Function', 'Returns type', 'Description'],
            summaryRows
          )
        );
      }
      // detail
      if (!!detailBlocks.length) {
        result.push(...detailBlocks);
      }
    }
    // result
    return result;
  }

  private getInterfaces(
    declaration: Declaration,
    mode: 'summary' | 'detail' | 'full',
    convertingOptions: ConvertingOptions = {},
  ) {
    const { heading: withHeading, local: localLinking } = convertingOptions;
    // get children
    const children = declaration.getInterfaces(withHeading ? 2 : 1);
    // build blocks
    const result: Block[] = [];
    if (!!children.length) {
      // heading
      if (withHeading) {
        const headingTitle = declaration.NAME + ' interfaces';
        const heading = this.$Content.blockHeading(
          headingTitle, 3, this.$Content.buildId(headingTitle),
        );
        result.push(heading);
      }
      // 
      const summaryRows: string[][] = [];
      const detailBlocks: Block[] = [];
      children.forEach(child => {
        const { ID, NAME, LINK, SHORT_TEXT } = child;
        const ref = localLinking ? '#' + ID : LINK;
        //
        if (mode === 'summary' || mode === 'full') {
          summaryRows.push([`[${NAME}](${ref})`, SHORT_TEXT || '']);
        }
        //
        if (mode === 'detail' || mode === 'full') {
          detailBlocks.push(...this.getFull(child));
        }
      });
      // summary
      if (!!summaryRows.length) {
        result.push(
          this.$Content.blockTable(
            ['Interface', 'Description'],
            summaryRows
          )
        );
      }
      // detail
      if (!!detailBlocks.length) {
        result.push(...detailBlocks);
      }
    }
    // result
    return result;
  }

  private getClasses(
    declaration: Declaration,
    mode: 'summary' | 'detail' | 'full',
    convertingOptions: ConvertingOptions = {},
  ) {
    const { heading: withHeading, local: localLinking } = convertingOptions;
    // get children
    const children = declaration.getClasses(withHeading ? 2 : 1);
    // build blocks
    const result: Block[] = [];
    if (!!children.length) {
      // heading
      if (withHeading) {
        const headingTitle = declaration.NAME + ' classes';
        const heading = this.$Content.blockHeading(
          headingTitle, 3, this.$Content.buildId(headingTitle),
        );
        result.push(heading);
      }
      // 
      const summaryRows: string[][] = [];
      const detailBlocks: Block[] = [];
      children.forEach(child => {
        const { ID, NAME, LINK, SHORT_TEXT } = child;
        const ref = localLinking ? '#' + ID : LINK;
        //
        if (mode === 'summary' || mode === 'full') {
          summaryRows.push([`[${NAME}](${ref})`, SHORT_TEXT || '']);
        }
        //
        if (mode === 'detail' || mode === 'full') {
          detailBlocks.push(...this.getFull(child));
        }
      });
      // summary
      if (!!summaryRows.length) {
        result.push(
          this.$Content.blockTable(
            ['Class', 'Description'],
            summaryRows
          )
        );
      }
      // detail
      if (!!detailBlocks.length) {
        result.push(...detailBlocks);
      }
    }
    // result
    return result;
  }

}
