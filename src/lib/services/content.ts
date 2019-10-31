import { readFileSync, outputFileSync } from 'fs-extra';
import { format as prettierFormater } from 'prettier';
import { ConverterOptions, Converter } from 'showdown';

export interface ContentBySections {
  [section: string]: string;
}

export type Block = HeadingBlock | TextBlock | ListBlock | TableBlock;

export interface Heading {
  title: string;
  level: number;
  id?: string;
  link?: string;
}
export interface HeadingBlock {
  type: 'heading';
  data: Heading;
}

export type Text = string | string[];
export interface TextBlock {
  type: 'text';
  data: Text;
}

export type List = Array<[string, string]>;
export interface ListBlock {
  type: 'list';
  data: List;
}

export type Table = string[][];
export interface TableBlock {
  type: 'table';
  data: Table;
}

export class ContentService {
  EOL = '\r\n';
  EOL2X = this.EOL.repeat(2);

  constructor() {}

  readFileSync(path: string) {
    return readFileSync(path, 'utf-8');
  }

  writeFileSync(path: string, content: string) {
    return outputFileSync(path, content);
  }

  buildId(title: string) {
    return title
      .trim()
      .toLowerCase()
      .replace(/[^\w\- ]+/g, ' ')
      .replace(/\s+/g, '-')
      .replace(/\-+$/, '');
  }

  sectionOpening(id: string, attrs: { [attr: string]: string } = {}) {
    let attrsStr = '';
    Object.keys(attrs).forEach(key => (attrsStr += ` ${key}="${attrs[key]}"`));
    return `<section id="${id}"${attrsStr}>`;
  }

  sectionClosing() {
    return '</section>';
  }

  extractSections(content: string) {
    const sections: ContentBySections = {};
    (content.match(/<section[^>]*>([\s\S]*?)<\/section>/g) || []).forEach(
      item => {
        const id = (/<section id="(.*?)"/.exec(item) || []).pop();
        if (!!id) {
          sections[id] = this.md2Html(
            item
            .replace(/<section [^\n]*/g, '')
            .replace('</section>', '')
          );
        }
      }
    );
    return sections;
  }

  extractHeadings(content: string) {
    const headings: HeadingBlock[] = [];
    (content.match(/<h[^>]*>([\s\S]*?)<\/h[^>]*>/g) || []).forEach(heading => {
      const level = Number(heading.charAt(2));
      if (!isNaN(level) && level < 7) {
        const title = (/<h[^>]*>([\s\S]*?)<\/h[^>]*>/.exec(heading) || []).pop();
        if (!!title) {
          const id = ((/<a[^>]* name="(.*?)">/.exec(heading) || []).pop() || '')
            .split('"')
            .shift()
            || this.buildId(title);
          headings.push(this.blockHeading(title, level, id));
        }
      }
    });
    return headings;
  }

  md2Html(mdContent: string, showdownOptions: ConverterOptions = {}) {
    return new Converter({
      omitExtraWLInCodeBlocks: true,
      parseImgDimensions: true,
      simplifiedAutoLink: true,
      excludeTrailingPunctuationFromURLs: true,
      strikethrough: true,
      tables: true,
      tasklists: true,
      ghMentions: true,
      // smartIndentationFix: true,
      disableForced4SpacesIndentedSublists: true,
      simpleLineBreaks: true,
      requireSpaceBeforeHeadingText: true,
      ...showdownOptions,
    }).makeHtml(mdContent);
  }

  html2Md(htmlContent: string, showdownOptions: ConverterOptions = {}) {
    return new Converter(showdownOptions).makeMarkdown(htmlContent);
  }

  formatMd(mdContent: string) {
    return prettierFormater(mdContent, { parser: 'markdown' });
  }

  formatHtml(htmlContent: string) {
    return prettierFormater(htmlContent, { parser: 'html' });
  }

  blockHeading(title: string, level: number, id?: string, link?: string) {
    const heading = { title, level, id, link };
    return { type: 'heading', data: heading } as HeadingBlock;
  }

  blockText(text: Text) {
    return { type: 'text', data: text } as TextBlock;
  }

  blockList(list: List) {
    return { type: 'list', data: list } as ListBlock;
  }

  blockTable(headers: string[], rows: string[][]) {
    const table = [ headers, ...rows ];
    return { type: 'table', data: table } as TableBlock;
  }

  renderTOC(blocks: Block[], offset = 2, tocId = 'master-toc') {
    const result: string[] = [];
    blocks.forEach(({ type, data }) => {
      if (type === 'heading') {
        const { title, level, id, link } = data as Heading;
        result.push(
          `${'    '.repeat(level - offset)}- [${title}](${
            !!id ? '#' + id : link
          })`
        );
      }
    });
    const mdContent = result.join(this.EOL);
    return this
      .md2Html(mdContent)
      .replace('<ul>', `<ul id="${tocId}">`);
  }

  renderContent(blocks: Block[]) {
    return this.formatHtml(
      blocks
      .map(block => this.renderBlock(block))
      .join(this.EOL)
    );
  }

  renderBlock({ type, data }: Block) {
    let content = '';
    switch (type) {
      case 'heading':
        content = this.renderHeading(data as Heading);
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

  renderHeading({ id, title, level, link }: Heading) {
    const h = 'h' + level;
    const a = `a name="${id}"` + (!!link ? ` href="${link}"` : ``);
    return `<${h}><${a}>${ this.md2Html(title) }</a></${h}>`;
  }

  renderText(text: Text, singleLine = false) {
    return this.md2Html(
      typeof text === 'string'
      ? text
      : text.join(singleLine ? this.EOL : this.EOL2X)
    );
  }

  renderList(list: List) {
    const blocks = list.map(
      ([title, description = '']) => `- ${title}: ${description}`
    );
    return this.md2Html(blocks.join(this.EOL));
  }

  renderTable([headers, ...rows]: Table) {
    const table = ['<table>'];
    table.push('  <tr>');
    headers.forEach(header => table.push(`    <th>${header}</th>`));
    table.push('  </tr>');
    rows.forEach(cells => {
      table.push('  <tr>');
      cells.forEach(cell => table.push(`    <td>${this.md2Html(cell)}</td>`));
      table.push('  </tr>');
    });
    table.push('</table>');
    return table.join(this.EOL);
  }

  convertLinks(content: string, buildLink: (id: string) => string) {
    // turns template into 'a' tag
    content = content
      .replace(/\[\[([^\]]*) \|[ ]*([^\]]*)\]\]/g, '<a data-sref="$1">$2</a>')
      .replace(/\[\[([^\]]*)\]\]/g, '<a data-sref="$1">$1</a>')
      .replace(/\{\@link ([^\}]*) \|[ ]*([^\}]*)\}/g, '<a data-sref="$1">$2</a>')
      .replace(/\{\@link ([^\}]*)\}/g, '<a data-sref="$1">$1</a>');
    // render link tag
    (content.match(/<a data-sref=".*">.*<\/a>/g) || []).forEach(item => {
      const id = ((/<a data-sref="(.*?)">/.exec(item) || []).pop() || '')
        .split('"')
        .shift();
      if (!!id) {
        const href = buildLink(id);
        if (!!href) {
          content = content.replace(
            new RegExp(`<a data-sref="${id}">`, 'g'),
            `<a data-sref="${id}" href="${href}">`
          );
        }
      }
    });
    // final result
    return content;
  }
}
