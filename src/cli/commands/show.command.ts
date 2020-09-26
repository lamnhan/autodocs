import {magenta, green} from 'chalk';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ttyTable = require('tty-table');
import {ParseService} from '../../public-api';

export class ShowCommand {
  constructor(private parseService: ParseService) {}

  run(input?: string) {
    const {
      ID,
      NAME,
      TYPE,
      LINK,
      FILE_NAME,
      SHORT_TEXT,
      TEXT,
      SECTIONS,
      RETURNS,
      DEFAULT_VALUE,
      PARAMETERS,
    } = this.parseService.parse(input);
    const content = TEXT.substr(0, 30) + '[...]' + TEXT.substr(-30);
    const sections = Object.keys(SECTIONS).map(key => {
      const sectionContent = SECTIONS[key];
      return (
        sectionContent.substr(0, 30) + '[...]' + sectionContent.substr(-30)
      );
    });
    const params = PARAMETERS.map(
      param => param.name + (param.isOptional ? '?' : '')
    );
    // build table
    const table = ttyTable(
      [
        {value: 'Name', width: 100, align: 'left'},
        {value: 'Key', width: 100, align: 'left'},
        {value: 'Value', width: 500, align: 'left'},
      ],
      []
    );
    table.push(['Id', magenta('ID'), green(ID)]);
    table.push(['Name', magenta('NAME'), green(NAME)]);
    table.push(['Type', magenta('TYPE'), green(TYPE)]);
    table.push(['Link', magenta('LINK'), green(LINK)]);
    table.push(['Source', magenta('FILE_NAME'), green(FILE_NAME)]);
    if (SHORT_TEXT) {
      table.push(['Description', magenta('SHORT_TEXT'), green(SHORT_TEXT)]);
    }
    if (TEXT) {
      table.push(['Content', magenta('TEXT'), green(content)]);
    }
    if (Object.keys(SECTIONS).length) {
      table.push([
        'Sections',
        magenta('SECTIONS'),
        green(sections.join('\r\n')),
      ]);
    }
    if (RETURNS) {
      table.push(['Returns', magenta('RETURNS'), green(RETURNS)]);
    }
    if (PARAMETERS.length) {
      table.push(['Params', magenta('PARAMETERS'), green(params.join(', '))]);
    }
    if (DEFAULT_VALUE) {
      table.push(['Value', magenta('DEFAULT_VALUE'), green(DEFAULT_VALUE)]);
    }
    // render
    console.log(table.render());
  }
}
