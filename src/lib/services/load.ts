import { resolve } from 'path';
import { pathExistsSync } from 'fs-extra';

import { ContentBySections, ContentService } from './content';

export class LoadService {
  constructor(private contentService: ContentService) {}

  batchLoad(paths: string[]) {
    const batchContent: { [path: string]: ContentBySections } = {};
    paths.forEach(path => (batchContent[path] = this.load(path)));
    return batchContent;
  }

  load(path: string) {
    let contentBySections: ContentBySections = {};
    const filePath = resolve(path);
    if (!!pathExistsSync(filePath)) {
      const content = this.contentService.readFileSync(filePath);
      contentBySections = this.contentService.extractSections(content);
    }
    return contentBySections;
  }
}
