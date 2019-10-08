import { EOL } from 'os';
import { readFile, readFileSync, outputFile } from 'fs-extra';
import { format as prettierFormater } from 'prettier';
const matchAll = require('match-all');

export interface ContentBySections {
  [sectionName: string]: string;
}

export type Block = BlockHeader | BlockText | BlockList | BlockTable;

export interface Header {
  id: string;
  level: number;
  title: string;
  link?: string;
}
export interface BlockHeader {
  type: 'header';
  data: Header;
}

export type Text = string | string[];
export interface BlockText {
  type: 'text';
  data: Text;
}

export type List = Array<[string, string]>;
export interface BlockList {
  type: 'list';
  data: List;
}

export type Table = string[][];
export interface BlockTable {
  type: 'table';
  data: Table;
}

const EOL2X = EOL.repeat(2);

export class Content {
  constructor() {}

  async readFile(path: string) {
    return readFile(path, 'utf-8');
  }

  readFileSync(path: string) {
    return readFileSync(path, 'utf-8');
  }

  async writeFile(path: string, content: string) {
    return outputFile(path, content);
  }

  contentBetween(
    content: string,
    prefix: string,
    suffix: string,
    includePrefix = false,
    includeSuffix = false
  ) {
    let prefixIndex = content.indexOf(prefix);
    let suffixIndex = content.indexOf(suffix);
    // invalid
    if (
      prefixIndex < 0 ||
      suffixIndex < 0 ||
      suffixIndex <= prefixIndex
    ) {
      return '';
    }
    // valid
    if (!includePrefix) {
      prefixIndex = prefixIndex + prefix.length;
    }
    if (includeSuffix) {
      suffixIndex = suffixIndex + suffix.length;
    }
    return content.substring(prefixIndex, suffixIndex);
  }

  getSectionOpening(name: string) {
    return `<!-- <section:${name}> -->`;
  }

  getSectionClosing(name: string) {
    return `<!-- </section:${name}> -->`;
  }

  extractSections(content: string) {
    const result: ContentBySections = {};
    const sectionNames = matchAll(
      content,
      /\<section\:([a-zA-Z0-9]+)\>/gi
    ).toArray();
    for (const name of sectionNames) {
      const opening = this.getSectionOpening(name);
      const closing = this.getSectionClosing(name);
      // save content
      result[name] = this.contentBetween(content, opening, closing);
    }
    return result;
  }

  format(content: string) {
    return prettierFormater(content, { parser: 'markdown' });
  }

  buildId(title: string) {
    return title
      .trim()
      .toLowerCase()
      .replace(/[^\w\- ]+/g, ' ')
      .replace(/\s+/g, '-')
      .replace(/\-+$/, '');
  }

  buildHeader(id: string, level: number, title: string, link?: string) {
    return {
      type: 'header',
      data: { id, level, title, link },
    } as BlockHeader;
  }

  buildText(text: Text) {
    return { type: 'text', data: text } as BlockText;
  }

  buildList(list: List) {
    return { type: 'list', data: list } as BlockList;
  }

  buildTable(headers: string[], rows: string[][]) {
    rows.unshift(headers); // add headers
    return { type: 'table', data: rows } as BlockTable;
  }

  renderTOC(blocks: Block[]) {
    const rows: string[] = [];
    blocks.forEach(({ type, data }) => {
      if (type === 'header') {
        const { id, title, level } = data as Header;
        rows.push(`${'  '.repeat(level - 1)}- [${title}](#${id})`);
      }
    });
    return this.format(rows.join(EOL));
  }

  renderContent(blocks: Block[]) {
    const result = blocks.map(block => this.renderBlock(block));
    return this.format(result.join(EOL2X));
  }

  renderBlock({ type, data }: Block) {
    let content = '';
    switch (type) {
      case 'header':
        content = this.renderHeader(data as Header);
        break;
      case 'list':
        content = this.renderList(data as List);
        break;
      case 'table':
        content = this.renderTable(data as Table);
        break;
      case 'text':
      default:
        content = this.renderText(data as Text);
        break;
    }
    return content;
  }

  renderHeader({ id, title, level, link }: Header) {
    const h = 'h' + level;
    const a = `a name="${id}"` + (!!link ? ` href="${link}"` : ``);
    return this.format(`<${h}><${a}>${title}</a></${h}>`);
  }

  renderText(text: Text) {
    return this.format(typeof text === 'string' ? text : text.join(EOL2X));
  }

  renderList(list: List) {
    const blocks = list.map(
      ([title, description = '']) => `- ${title}: ${description}`
    );
    return this.format(blocks.join(EOL));
  }

  renderTable([headers, ...rows]: Table) {
    const tableRows = rows.map(cells => {
      // process value
      cells.map(x => (x || '').replace(/\|/g, '\\|'));
      // build row
      return '| ' + cells.join(' | ') + ' |';
    });
    return this.format(
      [
        '| ' + headers.join(' | ') + ' |',
        '| --- | --- | --- |',
        ...tableRows,
      ].join(EOL)
    );
  }
}
