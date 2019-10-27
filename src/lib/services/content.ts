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
  type: 'header';
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
          sections[id] = this.format(
            item.replace(/<section [^\n]*/g, '').replace('</section>', '')
          );
        }
      }
    );
    return sections;
  }

  extractHeadings(content: string) {
    const headings: HeadingBlock[] = [];
    (content.match(/(\n#{1}[^\n]*)|(<h[^>]*>([\s\S]*?)<\/h[^>]*>)/g) || [])
    .forEach(heading => {
      // html
      if (heading.charAt(0) === '<') {
        const level = Number(heading.charAt(2));
        if (!isNaN(level) && level < 7) {
          const title = (/<h[^>]*>([\s\S]*?)<\/h[^>]*>/.exec(heading) || []).pop();
          if (!!title) {
            const id = (/<a[^>]* name="(.*?)">/.exec(heading) || []).pop()
              || this.buildId(title);
            headings.push(this.blockHeading(title, level, id));
          }
        }
      }
      // md
      else {
        const [head, ...body] = heading.replace(/(?:\r\n|\r|\n)/g, '').split(' ');
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

  md2Html(mdContent: string, options?: ConverterOptions) {
    return new Converter(options).makeHtml(mdContent);
  }

  format(content: string) {
    return prettierFormater(content, { parser: 'markdown' });
  }

  blockHeading(title: string, level: number, id?: string, link?: string) {
    return {
      type: 'header',
      data: { title, level, id, link },
    } as HeadingBlock;
  }

  blockText(text: Text) {
    return { type: 'text', data: text } as TextBlock;
  }

  blockList(list: List) {
    return { type: 'list', data: list } as ListBlock;
  }

  blockTable(headers: string[], rows: string[][]) {
    rows.unshift(headers); // add headers
    return { type: 'table', data: rows } as TableBlock;
  }

  renderTOC(blocks: Block[], offset = 2) {
    const rows: string[] = [];
    blocks.forEach(({ type, data }) => {
      if (type === 'header') {
        const { title, level, id, link } = data as Heading;
        rows.push(
          `${'    '.repeat(level - offset)}- [${title}](${
            !!id ? '#' + id : link
          })`
        );
      }
    });
    return this.format(rows.join(this.EOL));
  }

  renderContent(blocks: Block[]) {
    const result = blocks.map(block => this.renderBlock(block));
    return this.format(result.join(this.EOL2X));
  }

  renderBlock({ type, data }: Block) {
    let content = '';
    switch (type) {
      case 'header':
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
    return this.format(`<${h}><${a}>${this.md2Html(title)}</a></${h}>`);
  }

  renderText(text: Text, single = false) {
    return this.format(
      typeof text === 'string' ? text : text.join(single ? this.EOL : this.EOL2X)
    );
  }

  renderList(list: List) {
    const blocks = list.map(
      ([title, description = '']) => `- ${title}: ${description}`
    );
    return this.format(blocks.join(this.EOL));
  }

  renderTable([headers, ...rows]: Table) {
    const tableRows = rows.map(cells => {
      // process value
      cells = cells.map(x => (x || '').replace(/\|/g, '\\|'));
      // build row
      return '| ' + cells.join(' | ') + ' |';
    });
    return this.format(
      [
        '| ' + headers.join(' | ') + ' |',
        '| --- | --- | --- |',
        ...tableRows,
      ].join(this.EOL)
    );
  }

  convertLinks(content: string, buildLink: (id: string) => string) {
    // turns template into 'a' tag
    content = content
      .replace(/\[\[(.*) \|[ ]*(.*)\]\]/g, '<a docsuper="$1">$2</a>')
      .replace(/\[\[(.*)\]\]/g, '<a docsuper="$1">$1</a>')
      .replace(/\{\@link (.*) \|[ ]*(.*)\}/g, '<a docsuper="$1">$2</a>')
      .replace(/\{\@link (.*)\}/g, '<a docsuper="$1">$1</a>');
    // render link tag
    (content.match(/<a docsuper=".*">.*<\/a>/g) || []).forEach(item => {
      const id = ((/<a docsuper="(.*?)">/.exec(item) || []).pop() || '').split('"').shift();
      if (!!id) {
        const href = buildLink(id);
        content = content.replace(
          new RegExp(`<a docsuper="${id}">`, 'g'),
          `<a docsuper="${id}" href="${href}">`
        );
      }
    });
    // final result
    return content;
  }

}
