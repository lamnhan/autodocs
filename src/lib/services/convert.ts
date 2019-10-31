import { ProjectService } from './project';
import { DefaultValue } from './typedoc';
import { Block, ContentService } from './content';

import { DeclarationFilter, Declaration } from '../declaration';

export interface DeclarationOptions {
  id?: string;
}

export interface HeadingOptions {
  title?: string;
  link?: string;
}

export interface ValueOptions {
  raw?: boolean;
}

export interface ConvertingOptions {
  level?: number;
  heading?: boolean;
  local?: boolean;
}

export interface FilterOptions {
  filter?: DeclarationFilter;
}

export interface ConvertOptions
  extends DeclarationOptions,
    HeadingOptions,
    ValueOptions,
    ConvertingOptions,
    FilterOptions {
  // tslint:disable-next-line: no-any
  [key: string]: any;
}

export type AdditionalConvert = (
  declaration: Declaration,
  options: ConvertOptions,
  $Content: ContentService
) => Block[];

export interface AdditionalConverts {
  [output: string]: AdditionalConvert;
}

/**
 * The Converter turns a [[Declaration]] into {@link Block | content blocks}
 *
 * ### Converter output
 *
 * A [[Declaration]] supports certain convert output depended on its kind. You can also provide your custom converts output, use the `converts` field of [[Options]]. 
 *
 * Here the list of default output:
 * 
 * | Output | Kinds | Options | Description |
 * | --- | --- | --- | --- |
 * | __SECTION:`ID`__ | any | [[ConvertingOptions]] | A local section |
 * | __VALUE__ | `Variable`, `Property` | [[ValueOptions]] | Default value |
 * | __SELF__ | any | [[DeclarationOptions]], [[ConvertingOptions]], [[HeadingOptions]] | Title, description, content WITHOUT local sections, parameters & returns (for function) |
 * | __FULL__ | any | [[DeclarationOptions]], [[ConvertingOptions]], [[HeadingOptions]] | All content (with headings) |
 * | __SUMMARY_VARIABLES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]] | Summary table of variables |
 * | __DETAIL_VARIABLES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]] | Detail list of variables |
 * | __FULL_VARIABLES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]] | Summary table & detail list of variables |
 * | __SUMMARY_FUNCTIONS__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]] | Summary table of functions |
 * | __DETAIL_FUNCTIONS__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]] | Detail list of functions |
 * | __FULL_FUNCTIONS__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]] | Summary table & detail list of functions |
 * | __SUMMARY_PROPERTIES__ | `Interface`, `Class` | [[DeclarationOptions]], [[ConvertingOptions]] | Summary table of properties |
 * | __DETAIL_PROPERTIES__ | `Interface`, `Class` | [[DeclarationOptions]], [[ConvertingOptions]] | Detail list of properties |
 * | __FULL_PROPERTIES__ | `Interface`, `Class` | [[DeclarationOptions]], [[ConvertingOptions]] | Summary table & detail list of properties |
 * | __SUMMARY_METHODS__ | `Class` | [[DeclarationOptions]], [[ConvertingOptions]] | Summary table of methods |
 * | __DETAIL_METHODS__ | `Class` | [[DeclarationOptions]], [[ConvertingOptions]] | Detail list of methods |
 * | __FULL_METHODS__ | `Class` | [[DeclarationOptions]], [[ConvertingOptions]] | Summary table & detail list of methods |
 * | __SUMMARY_INTERFACES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]] | Summary table of interfaces |
 * | __DETAIL_INTERFACES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]] | Detail list of interfaces |
 * | __FULL_INTERFACES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]] | Summary table & detail list of interfaces |
 * | __SUMMARY_CLASSES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]] | Summary table of classes |
 * | __DETAIL_CLASSES__ | `Collection`| [[DeclarationOptions]], [[ConvertingOptions]] | Detail list of classes |
 * | __FULL_CLASSES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]] | Summary table & detail list of classes |
 *
 * Provide options with the third item of a rendering input:
 *
 * - Declaration id: `{ id }`
 * - **SELF** header: `{ title, link }`
 * - Raw object: `{ raw: true }`
 * - Level: `{ level }`
 * - Use the default heading: `{ heading: true }`
 * - Use local anchors (instead of detail links): `{ local: true }`
 */
export class ConvertService {

  constructor(
    private projectService: ProjectService,
    private contentService: ContentService
  ) {}

  convert(
    declaration: Declaration,
    output: string,
    options: ConvertOptions = {}
  ) {
    const { id } = options;
    // override id
    if (!!id) {
      declaration.setId(id);
    }
    // convert
    output = output || 'SELF';
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
        return this.getSelf(declaration, options);
      // custom
      default:
        // local section
        if (output.indexOf('SECTION:') !== -1) {
          return this.getSection(declaration, output.replace('SECTION:', ''), options);
        }
        // custom convertion
        const { converts = {} } = this.projectService.OPTIONS;
        const customConvert = converts[output];
        if (!customConvert) {
          throw new Error('No output: ' + output);
        }
        return customConvert(declaration, options, this.contentService) || [];
    }
  }

  private getFull(
    declaration: Declaration,
    options: ConvertingOptions & HeadingOptions = {}
  ) {
    const result: Block[] = [];
    // prepare options
    const childrenOptions: ConvertingOptions = {
      ...options,
      heading: true,
      level: (options.level || 2) + 1,
    };
    // self
    const self = this.getSelf(declaration, options);
    result.push(...self);
    // variables or properties
    if (declaration.hasVariablesOrProperties()) {
      result.push(
        ...this.getVariablesOrProperties(declaration, 'summary', childrenOptions)
      );
    }
    // functions or methods
    if (declaration.hasFunctionsOrMethods()) {
      result.push(
        ...this.getFunctionsOrMethods(declaration, 'full', childrenOptions)
      );
    }
    // interfaces
    if (declaration.hasInterfaces()) {
      result.push(
        ...this.getInterfaces(declaration, 'full', childrenOptions)
      );
    }
    // classes
    if (declaration.hasClasses()) {
      result.push(
        ...this.getClasses(declaration, 'full', childrenOptions)
      );
    }
    // result
    return result;
  }

  private getSelf(
    declaration: Declaration,
    options: ConvertingOptions & HeadingOptions = {}
  ) {
    const { level = 2, title: customTitle, link: customLink } = options;
    const blocks: Block[] = [];
    const kindText = (
      declaration.REFLECTION.kindString || 'Unknown'
    ).toLowerCase();
    const {
      ID,
      NAME,
      LINK,
      DISPLAY_TYPE,
      SHORT_TEXT,
      TEXT,
      RETURNS,
      PARAMETERS,
    } = declaration;
    // process content
    const offset = level - 2;
    const content = !!offset
      ? this.contentService.modifyHeadings(TEXT, offset)
      : TEXT;
    // default blocks
    const body = this.contentService.blockText([
      '**' + (SHORT_TEXT || `The \`${NAME}\` ${kindText}.`) + '**',
      content,
    ]);
    // function or method
    if (declaration.isKind('CallSignature')) {
      const params = PARAMETERS.map(({ name, isOptional }) =>
        isOptional ? name + '?' : name
      ).join(', ');
      const title = customTitle || `\`${NAME}(${params})\``;
      const link = customLink || LINK;
      blocks.push(
        this.contentService.blockHeading(title, level, ID, link),
        body
      );
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
          this.contentService.blockText(`**Parameters**`),
          this.contentService.blockTable(
            ['Param', 'Type', 'Description'],
            parameterRows
          )
        );
      }
      // returns
      blocks.push(
        this.contentService.blockText([
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
      blocks.push(
        this.contentService.blockHeading(title, level, ID, link),
        body
      );
    }
    // any
    else {
      const title = customTitle || `The \`${NAME}\` ${kindText}`;
      const link = customLink || LINK;
      blocks.push(
        this.contentService.blockHeading(title, level, ID, link),
        body
      );
    }
    // result
    return blocks;
  }

  private getSection(
    declaration: Declaration,
    sectionId: string,
    options: ConvertingOptions = {}
  ) {
    const { level = 2 } = options;
    const offset = level - 3;
    const {[sectionId]: sectionContent = ''} = declaration.SECTIONS;
    const content = this.contentService.blockText(
      !!offset
      ? this.contentService
        .modifyHeadings(sectionContent, offset)
      : sectionContent
    );
    return [content] as Block[];
  }

  private getValue(declaration: Declaration, valueOptions: ValueOptions = {}) {
    const { raw: rawObject } = valueOptions;
    const { DEFAULT_VALUE } = declaration;
    // converter
    const convertValue = (value: DefaultValue) => {
      if (value instanceof Array) {
        const items: string[] = [];
        value.forEach(item => {
          const valueText = convertValue(item);
          items.push('<li>' + this.contentService.md2Html(valueText) + '</li>');
        });
        return this.contentService.renderText(
          ['<ol>', ...items, '</ol>'],
          true
        );
      } else if (value instanceof Object) {
        if (rawObject) {
          return this.contentService.renderText([
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
                this.contentService.md2Html(`**\`${key}\`**: ` + valueText) +
                '</li>'
            );
          });
          return this.contentService.renderText(
            ['<ul>', ...items, '</ul>'],
            true
          );
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
    return [this.contentService.blockText(valueText)];
  }

  private getVariablesOrProperties(
    declaration: Declaration,
    mode: 'summary' | 'detail' | 'full',
    options: ConvertingOptions & FilterOptions = {}
  ) {
    const { level = 2, heading, local, filter } = options;
    const withHeading = heading === undefined && mode === 'full' ? true : heading;
    const localLinking = local === undefined && mode === 'full' ? true : local;
    // process level
    const headingLevel = level - (withHeading ? 0 : 1);
    const childLevel = headingLevel + 1;
    // get children
    const children = declaration.getVariablesOrProperties(filter);
    // build blocks
    const result: Block[] = [];
    if (!!children.length) {
      // heading
      if (withHeading) {
        const headingTitle = declaration.isRoot()
          ? 'Variables'
          : (
              declaration.NAME +
              (declaration.isKind('Global') ? ' variables' : ' properties')
            );
        const heading = this.contentService.blockHeading(
          headingTitle,
          headingLevel,
          this.contentService.buildId(headingTitle)
        );
        result.push(heading);
      }
      // children
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
        const displayName =
          !!REFLECTION.parent && REFLECTION.parent.kindString === 'Interface'
            ? !IS_OPTIONAL
              ? `**${NAME}**`
              : NAME // interface parent
            : NAME; // collection or class
        const ref = localLinking ? '#' + ID : LINK;
        // summary / full
        if (mode === 'summary' || mode === 'full') {
          summaryRows.push([
            `[${displayName}](${ref})`,
            DISPLAY_TYPE,
            SHORT_TEXT,
          ]);
        }
        // detail / full
        if (mode === 'detail' || mode === 'full') {
          detailBlocks.push(
            ...this.getSelf(child, { level: childLevel }),
            this.contentService.blockText('---')
          );
        }
      });
      // summary table
      if (!!summaryRows.length) {
        result.push(
          this.contentService.blockTable(
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
    options: ConvertingOptions & FilterOptions = {}
  ) {
    const { level = 2, heading, local, filter } = options;
    const withHeading = heading === undefined && mode === 'full' ? true : heading;
    const localLinking = local === undefined && mode === 'full' ? true : local;
    // process level
    const headingLevel = level - (withHeading ? 0 : 1);
    const childLevel = headingLevel + 1;
    // get children
    const children = declaration.getFunctionsOrMethods(filter);
    // build blocks
    const result: Block[] = [];
    if (!!children.length) {
      // heading
      if (withHeading) {
        const headingTitle = declaration.isRoot()
          ? 'Functions'
          : (
              declaration.NAME +
              (declaration.isKind('Global') ? ' functions' : ' methods')
            );
        const heading = this.contentService.blockHeading(
          headingTitle,
          headingLevel,
          this.contentService.buildId(headingTitle)
        );
        result.push(heading);
      }
      // children
      const summaryRows: string[][] = [];
      const detailBlocks: Block[] = [];
      children.forEach(child => {
        const { ID, NAME, LINK, DISPLAY_TYPE, SHORT_TEXT, PARAMETERS } = child;
        const params = PARAMETERS.map(({ name, isOptional }) =>
          isOptional ? name + '?' : name
        ).join(', ');
        const displayName = `${NAME}(${params})`;
        const ref = localLinking ? '#' + ID : LINK;
        // summary / full
        if (mode === 'summary' || mode === 'full') {
          summaryRows.push([
            `[${displayName}](${ref})`,
            DISPLAY_TYPE,
            SHORT_TEXT || '',
          ]);
        }
        // detail / full
        if (mode === 'detail' || mode === 'full') {
          detailBlocks.push(
            ...this.getSelf(child, { level: childLevel }),
            this.contentService.blockText('---')
          );
        }
      });
      // summary
      if (!!summaryRows.length) {
        result.push(
          this.contentService.blockTable(
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
    options: ConvertingOptions & FilterOptions = {}
  ) {
    const { level = 2, heading, local, filter } = options;
    const withHeading = heading === undefined && mode === 'full' ? true : heading;
    const localLinking = local === undefined && mode === 'full' ? true : local;
    // process level
    const headingLevel = level - (withHeading ? 0 : 1);
    const childLevel = headingLevel + 1;
    // get children
    const children = declaration.getInterfaces(filter);
    // build blocks
    const result: Block[] = [];
    if (!!children.length) {
      // heading
      if (withHeading) {
        const headingTitle = declaration.isRoot()
          ? 'Interfaces'
          : declaration.NAME + ' interfaces';
        const heading = this.contentService.blockHeading(
          headingTitle,
          headingLevel,
          this.contentService.buildId(headingTitle)
        );
        result.push(heading);
      }
      // children
      const summaryRows: string[][] = [];
      const detailBlocks: Block[] = [];
      children.forEach(child => {
        const { ID, NAME, LINK, SHORT_TEXT } = child;
        const ref = localLinking ? '#' + ID : LINK;
        // summary / full
        if (mode === 'summary' || mode === 'full') {
          summaryRows.push([`[${NAME}](${ref})`, SHORT_TEXT || '']);
        }
        // detail / full
        if (mode === 'detail' || mode === 'full') {
          detailBlocks.push(...this.getFull(child, { level: childLevel }));
        }
      });
      // summary
      if (!!summaryRows.length) {
        result.push(
          this.contentService.blockTable(
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
    options: ConvertingOptions & FilterOptions = {}
  ) {
    const { level = 2, heading, local, filter } = options;
    const withHeading = heading === undefined && mode === 'full' ? true : heading;
    const localLinking = local === undefined && mode === 'full' ? true : local;
    // process level
    const headingLevel = level - (withHeading ? 0 : 1);
    const childLevel = headingLevel + 1;
    // get children
    const children = declaration.getClasses(filter);
    // build blocks
    const result: Block[] = [];
    if (!!children.length) {
      // heading
      if (withHeading) {
        const headingTitle = declaration.isRoot()
          ? 'Classes'
          : declaration.NAME + ' classes';
        const heading = this.contentService.blockHeading(
          headingTitle,
          headingLevel,
          this.contentService.buildId(headingTitle)
        );
        result.push(heading);
      }
      // children
      const summaryRows: string[][] = [];
      const detailBlocks: Block[] = [];
      children.forEach(child => {
        const { ID, NAME, LINK, SHORT_TEXT } = child;
        const ref = localLinking ? '#' + ID : LINK;
        // summary / full
        if (mode === 'summary' || mode === 'full') {
          summaryRows.push([`[${NAME}](${ref})`, SHORT_TEXT || '']);
        }
        // summary / full
        if (mode === 'detail' || mode === 'full') {
          detailBlocks.push(...this.getFull(child, { level: childLevel }));
        }
      });
      // summary
      if (!!summaryRows.length) {
        result.push(
          this.contentService.blockTable(['Class', 'Description'], summaryRows)
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
