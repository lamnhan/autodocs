import { EOL as _EOL } from 'os';
import { readFile } from 'fs-extra';
import { format } from 'prettier';
const matchAll = require('match-all');

export interface TOCItem {
  title: string;
  anchor: string;
  level?: number;
}

export interface ListItem {
  title: string;
  description: string;
}

export interface DetailListItem {
  title: string;
  description: string;
  content?: string;
  parts?: string[];
}

export class Content {

  EOL = _EOL;
  EOL2X = _EOL.repeat(2);

  constructor() {}
  
  eol(repeat = 1) {
    return this.EOL.repeat(repeat);
  }

  contentBetween(
    input: string,
    prefix: string,
    suffix: string,
    includePrefix = true,
    includeSuffix = true
  ) {
    let prefixIndex = input.indexOf(prefix);
    let suffixIndex = input.indexOf(suffix);
    if (prefixIndex < 0 || suffixIndex < 0 || suffixIndex <= prefixIndex) {
      return '';
    } else {
      if (!includePrefix) {
        prefixIndex = prefixIndex + prefix.length;
      }
      if (includeSuffix) {
        suffixIndex = suffixIndex + suffix.length;
      }
      return input.substring(prefixIndex, suffixIndex);
    }
  }

  async getSections(path: string) {
    const sections: { [name: string]: string } = {};
    const content = await readFile(path, 'utf-8');
    const sectionNames = matchAll(
      content,
      /\<section\:([a-zA-Z0-9]+)\>/gi
    ).toArray();
    for (const name of sectionNames) {
      sections[name] = this.contentBetween(
        content,
        `<!-- <section:${name}> -->`,
        `<!-- </section:${name}> -->`
      );
    }
    return sections as {[name: string]: string};
  }

  formatMDContent(content: string) {
    return format(content, { parser: 'markdown' });
  }

  generateMDContent(content: string[]) {
    return this.formatMDContent(content.join(this.EOL2X));
  }

  generateMDTable(headers: string[], content: string[][]) {
    const rows = content.map(cells => {
      cells.map(x => (x || '').replace(/\|/g, '\\|')); // escape '|'
      return `| ${cells.join(' | ')} |`;
    });
    return this.formatMDContent(
      [
        `| ${headers.join(' | ')} |`,
        `| --- | --- | --- |`,
        ... rows,
      ]
      .join(this.EOL),
    );
  }

  generateMDList(items: ListItem[]) {
    const rows = items.map(({ title, description = '' }) =>
      `- ${title}: ${description}`,
    );
    return this.formatMDContent(rows.join(this.EOL));
  }

  generateMDDetailList(items: DetailListItem[]) {
    const rows = items.map(({ title, description, content = '', parts = [] }) =>
      [ title, description, content, ...parts, '---', ].join(this.EOL2X)
    );
    return this.formatMDContent(rows.join(this.EOL2X));
  }

  generateMDTOC(items: TOCItem[]) {
    const rows = items.map(({ title, anchor, level = 1 }) =>
      `${'  '.repeat(level - 1)}- [${title}](#${anchor})`,
    );
    return this.formatMDContent(rows.join(this.EOL));
  }

}