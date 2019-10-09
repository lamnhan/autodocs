import {
  Reflection,
  ParameterReflection,
  ReflectionKind,
  ReflectionData,
  Typedoc,
} from '../services/typedoc';
import { Block, Content } from '../services/content';

export class Declaration {

  private $Typedoc: Typedoc;
  private $Content: Content;

  private reflection: Reflection;
  private kind: ReflectionKind;
  private id: string;
  private level = 2;
  private data: ReflectionData;

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    reflection: Reflection,
  ) {
    this.$Typedoc = $Typedoc;
    this.$Content = $Content;
    this.reflection = reflection;
    // kind
    this.kind = reflection.kind;
    // set default id
    this.id = this.$Content.buildId(this.reflection.name);
    // extract data
    this.data = this.extractData();
  }

  private extractData() {
    let data = this.$Typedoc.extractReflection(this.reflection) as unknown;
    const { kind } = this.reflection;
    if (kind === ReflectionKind.CallSignature) {
      const {
        parameters: params = []
      } = this.reflection as {
        parameters?: ParameterReflection[],
      };
      const parameters = params.map(param => this.Typedoc.extractReflection(param));
      data = { ...data, parameters };
    }
    return data as ReflectionData;
  }

  get Typedoc() {
    return this.$Typedoc;
  }

  get Content() {
    return this.$Content;
  }

  get ID() {
    return this.id;
  }

  get LEVEL() {
    return this.level;
  }

  get REFLECTION() {
    return this.reflection;
  }
  
  setId(id?: string) {
    this.id = id || this.$Content.buildId(this.reflection.name);
    return this;
  }

  downLevel(by = 1) {
    this.level = this.level + by;
    return this;
  }

  upLevel(by = 1) {
    this.level = this.level - by;
    return this;
  }

  getChildId(childName: string) {
    return this.$Content.buildId(this.id + ' ' + childName);
  }

  getData() {
    return this.data;
  }

  getRendering(mode: string) {
    switch (mode) {
      case 'self':
      default:
        return this.convertSelf();
    }
  }

  convertSelf() {
    const { name, shortText, text, link } = this.data;
    const { kindString = 'Unknown' } = this.reflection;
    // blocks
    const head = this.$Content.buildHeader(this.id, this.level, name, link);
    const body = this.$Content.buildText([
      shortText || `The \`${name}\` ${kindString.toLowerCase()}.`,
      text || '',
    ]);
    // result
    return [head, body] as Block[];
  }

}