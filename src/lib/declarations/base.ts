import {
  DeclarationReflection,
  ParameterReflection,
  ReflectionKind,
  DeclarationData,
  Typedoc,
} from '../services/typedoc';
import { Block, Content } from '../services/content';

export class Base {

  private $Typedoc: Typedoc;
  private $Content: Content;

  private declaration: DeclarationReflection;
  private id: string;
  private level = 2;
  private data: DeclarationData;

  constructor(
    $Typedoc: Typedoc,
    $Content: Content,
    declaration: DeclarationReflection,
  ) {
    this.$Typedoc = $Typedoc;
    this.$Content = $Content;
    this.declaration = declaration;
    // set default id
    this.id = this.$Content.buildId(this.declaration.name);
    // extract data
    this.data = this.extractData();
  }

  private extractData() {
    let data = this.$Typedoc.extractDeclaration(this.declaration) as unknown;
    const { kind } = this.declaration;
    if (kind === ReflectionKind.CallSignature) {
      const {
        parameters: params = []
      } = this.declaration as {
        parameters?: ParameterReflection[],
      };
      const parameters = params.map(param => this.Typedoc.extractDeclaration(param));
      data = { ...data, parameters };
    }
    return data as DeclarationData;
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

  get DECLARATION() {
    return this.declaration;
  }
  
  setId(id?: string) {
    this.id = id || this.$Content.buildId(this.declaration.name);
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
    return this.convertSelf();
  }

  convertSelf() {
    const { name, kindString, shortText, text, link } = this.data;
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