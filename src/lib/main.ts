import { SRCInput } from './typedoc';
import { Docs } from './docs';

export class Autodocs {

  constructor() {}

  getSRCDocs(configs = {}) {
    return this.getDocs('src', configs);
  }

  getDocs(path: SRCInput, configs = {}) {
    return new Docs(path, configs);
  }

}