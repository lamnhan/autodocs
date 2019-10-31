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
          sections[id] = this.formatMd(
            item.replace(/<section [^\n]*/g, '').replace('</section>', '')
          );
        }
      }
    );
    return sections;
  }

  extractHeadings(content: string) {
    content = '\r\n' + content;
    const headings: HeadingBlock[] = [];
    (
      content.match(/(\n#{1}[^\n]*)|(<h[^>]*>([\s\S]*?)<\/h[^>]*>)/g) || []
    ).forEach(heading => {
      // html
      if (heading.charAt(0) === '<') {
        const level = Number(heading.charAt(2));
        if (!isNaN(level) && level < 7) {
          const title =
            ((/<h[^>]*>([\s\S]*?)<\/h[^>]*>/.exec(heading) || []).pop() || '')
            .replace(/(<([^>]+)>)/ig, '');
          if (!!title) {
            const id =
              ((/<a[^>]* name="(.*?)">/.exec(heading) || []).pop() || '')
              .split('"')
              .shift() ||
              this.buildId(title);
            const link = (/<a[^>]* href="(.*?)">/.exec(heading) || []).pop();
            headings.push(this.blockHeading(title, level, id, link));
          }
        }
      }
      // md
      else {
        const [head, ...body] = heading
          .replace(/(?:\r\n|\r|\n)/g, '')
          .split(' ');
        const level = head.length;
        if (level < 7) {
          const title = body.join(' ').replace(new RegExp(' ' + head, 'g'), '');
          const id = this.buildId(title);
          headings.push(this.blockHeading(title, level, id));
        }
      }
    });
    return headings;
  }

  modifyHeadings(content: string, offset: number) {
    const replacement: Array<{
      mdOriginal: string;
      mdNew: string;
      htmlOriginal: string;
      htmlNew: string;
    }> = [];
    // prepare
    this.extractHeadings(content).forEach(block => {
      const { data: heading } = block;
      const { level, title } = heading;
      const newLevel = level + offset;
      if (newLevel > 0 && newLevel < 7) {
        // md heading
        const mdOriginal = '#'.repeat(level) + ' ' + title;
        const mdNew = '#'.repeat(newLevel) + ' ' + title;
        // html heading
        const htmlOriginal = this.renderHeading(heading);
        const htmlNew = this.renderHeading({ ...heading, level: newLevel });
        // save replacement
        replacement.push({ mdOriginal, mdNew, htmlOriginal, htmlNew });
      } else {
        throw new Error('Heading level is out of range for modification.');
      }
    });
    // modification
    replacement.forEach(({ mdOriginal, mdNew, htmlOriginal, htmlNew }) => 
      content = content.replace(mdOriginal, mdNew).replace(htmlOriginal, htmlNew)
    );
    // result
    return content;
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

  renderTOC(blocks: Block[], offset = 2) {
    const rows: string[] = [];
    blocks.forEach(({ type, data }) => {
      if (type === 'heading') {
        const { title, level, id, link } = data as Heading;
        rows.push(
          `${'    '.repeat(level - offset)}- [${title}](${
            !!id ? '#' + id : link
          })`
        );
      }
    });
    return this.formatMd(rows.join(this.EOL));
  }

  renderContent(blocks: Block[]) {
    const result = blocks.map(block => this.renderBlock(block));
    return this.formatMd(result.join(this.EOL2X));
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
    return this.formatMd(`<${h}><${a}>${this.md2Html(title)}</a></${h}>`);
  }

  renderText(text: Text, single = false) {
    return this.formatMd(
      typeof text === 'string'
        ? text
        : text.join(single ? this.EOL : this.EOL2X)
    );
  }

  renderList(list: List) {
    const blocks = list.map(
      ([title, description = '']) => `- ${title}: ${description}`
    );
    return this.formatMd(blocks.join(this.EOL));
  }

  renderTable([headers, ...rows]: Table) {
    const tableRows = rows.map(cells => {
      // process value
      cells = cells.map(x => (x || '').replace(/\|/g, '\\|'));
      // build row
      return '| ' + cells.join(' | ') + ' |';
    });
    return this.formatMd(
      [
        '| ' + headers.join(' | ') + ' |',
        '| ' + new Array(headers.length).fill('---').join(' | ') + ' |',
        ...tableRows,
      ].join(this.EOL)
    );
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
