import { Options } from './types';
import { Project } from './services/project';
import { Typedoc } from './services/typedoc';
import { ContentBySections, Content } from './services/content';
import { Loader } from './services/loader';
import { Parser } from './services/parser';
import { ConvertOptions, Converter } from './services/converter';
import { Rendering, Renderer } from './services/renderer';

import { Declaration } from './declaration';

class Main {
  private $Project: Project;
  private $Typedoc: Typedoc;
  private $Content: Content;
  private $Loader: Loader;
  private $Parser: Parser;
  private $Converter: Converter;
  private $Renderer: Renderer;

  constructor(options?: Options) {
    this.$Project = new Project(options);
    this.$Typedoc = new Typedoc(this.$Project);
    this.$Content = new Content();
    this.$Loader = new Loader(this.$Content);
    this.$Parser = new Parser(this.$Typedoc, this.$Content);
    this.$Converter = new Converter(this.$Project, this.$Content);
    this.$Renderer = new Renderer(
      this.$Project,
      this.$Content,
      this.$Parser,
      this.$Converter
    );
  }

  get Project() {
    return this.$Project;
  }

  get Typedoc() {
    return this.$Typedoc;
  }

  get Content() {
    return this.$Content;
  }

  get Loader() {
    return this.$Loader;
  }

  get Parser() {
    return this.$Parser;
  }

  get Converter() {
    return this.$Converter;
  }

  get Renderer() {
    return this.$Renderer;
  }

  parse(what?: string | string[]) {
    return this.$Parser.parse(what);
  }

  convert(declaration: Declaration, output: string, options?: ConvertOptions) {
    return this.$Converter.convert(declaration, output, options);
  }

  render(rendering: Rendering, currentContent: ContentBySections = {}) {
    return this.$Renderer.render(rendering, currentContent);
  }
}

export { Main as Autodocs };
