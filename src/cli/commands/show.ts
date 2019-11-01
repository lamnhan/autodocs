import chalk from 'chalk';
const ttyTable = require('tty-table');

import { ParseService } from '../../public-api';

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
      return sectionContent.substr(0, 30) + '[...]' + sectionContent.substr(-30);
    });
    const params = PARAMETERS.map(param => param.name + (param.isOptional ? '?' : ''));
    // build table
    const table = ttyTable([
      { value: 'Name', width: 100, align: 'left' },
      { value: 'Key', width: 100, align: 'left' },
      { value: 'Value', width: 500, align: 'left' },
    ], []);
    table.push(['Id', chalk.magenta('ID'), chalk.green(ID)]);
    table.push(['Name', chalk.magenta('NAME'), chalk.green(NAME)]);
    table.push(['Type', chalk.magenta('TYPE'), chalk.green(TYPE)]);
    table.push(['Link', chalk.magenta('LINK'), chalk.green(LINK)]);
    table.push(['Source', chalk.magenta('FILE_NAME'), chalk.green(FILE_NAME)]);
    if (!!SHORT_TEXT) {
      table.push([
        'Description', chalk.magenta('SHORT_TEXT'), chalk.green(SHORT_TEXT)
      ]);
    }
    if (!!TEXT) {
      table.push([
        'Content', chalk.magenta('TEXT'), chalk.green(content)
      ]);
    }
    if (!!Object.keys(SECTIONS).length) {
      table.push([
        'Sections', chalk.magenta('SECTIONS'), chalk.green(sections.join('\r\n'))
      ]);
    }
    if (!!RETURNS) {
      table.push([
        'Returns', chalk.magenta('RETURNS'), chalk.green(RETURNS)
      ]);
    }
    if (!!PARAMETERS.length) {
      table.push([
        'Params', chalk.magenta('PARAMETERS'), chalk.green(params.join(', '))
      ]);
    }
    if (!!DEFAULT_VALUE) {
      table.push([
        'Value', chalk.magenta('DEFAULT_VALUE'), chalk.green(DEFAULT_VALUE)
      ]);
    }
    // render
    console.log(table.render());
  }

}