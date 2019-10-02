import { Content } from './content';
import { Typedoc, SRCInput } from './typedoc';
import { Interface } from './interface';
import { Class } from './class';

export class Docs {

  content: Content;
  typedoc: Typedoc;

  constructor(path?: SRCInput, configs = {}) {
    this.content = new Content();
    this.typedoc = new Typedoc(path, configs);
  }

  generateDocs(out: string) {
    return this.typedoc.generateDocs(out);
  }
  
  getInterface(name?: string) {
    return new Interface(this, name);
  }

  getClass(name?: string) {
    return new Class(this, name);
  }

}