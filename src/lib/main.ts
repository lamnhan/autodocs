import { Project } from './project';
import { Content } from './content';
import { Typedoc } from './typedoc';

import { Interface } from './interface';
import { Class } from './class';

export class Autodocs {
  project: Project;
  content: Content;
  typedoc: Typedoc;

  constructor() {
    this.project = new Project();
    this.content = new Content();
    this.typedoc = new Typedoc(this.project);
  }

  generateDocs(out = 'docs') {
    return this.typedoc.generateDocs(out);
  }

  getInterface(name: string) {
    return new Interface(this.typedoc, this.content, name);
  }

  getClass(name: string) {
    return new Class(this.typedoc, this.content, name);
  }
}
