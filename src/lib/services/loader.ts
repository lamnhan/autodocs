import { resolve } from 'path';
import { pathExistsSync } from 'fs-extra';

import { ContentBySections, Content } from './content';

export class Loader {

  private $Content: Content;

  constructor($Content: Content) {
    this.$Content = $Content;
  }

  batchLoad(paths: string[]) {
    const batchContent: {[path: string]: ContentBySections} = {};
    paths.forEach(path => batchContent[path] = this.load(path));
    return batchContent;
  }
  
  load(path: string) {
    let contentBySections: ContentBySections = {};
    const filePath = resolve(path);
    if (!!pathExistsSync(filePath)) {
      const content = this.$Content.readFileSync(filePath);
      contentBySections = this.$Content.extractSections(content);
    }
    return contentBySections;
  }

}