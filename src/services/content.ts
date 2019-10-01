import { EOL } from 'os';
import { readFile } from 'fs-extra';
import { format } from 'prettier';
const matchAll = require('match-all');

export class Content {

  constructor() {}

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

  generateMDTable(headers: string[], content: string[][]) {
    const rows: string[] = [];
    content.forEach(item => {
      // escape '|'
      item.map(x => x.replace(/\|/g, '\\|'));
      // save row
      rows.push(`| ${item.join(' | ')} |`);
    });
    return this.formatMDContent(
      [
        `| ${headers.join(' | ')} |`,
        `| --- | --- | --- |`,
        ... rows,
      ]
      .join(EOL),
    );
  }

}