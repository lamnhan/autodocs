import { Options } from './types';
import { Project } from './services/project';
import { Typedoc } from './services/typedoc';
import { Content } from './services/content';
import { Parser } from './services/parser';
import { Renderer } from './services/renderer';

class Main {
  private $Project: Project;
  private $Typedoc: Typedoc;
  private $Content: Content;
  private $Parser: Parser;
  private $Renderer: Renderer;

  constructor(options?: Options) {
    this.$Project = new Project(options);
    this.$Typedoc = new Typedoc(this.$Project);
    this.$Content = new Content();
    this.$Parser = new Parser(this.$Typedoc, this.$Content);
    this.$Renderer = new Renderer(
      this.$Content,
      this.$Parser,
      this.$Project.OPTIONS.files,
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

  get Parser() {
    return this.$Parser;
  }

  get Renderer() {
    return this.$Renderer;
  }

  generateDocs() {
    const { out } = this.Project.OPTIONS;
    return this.Typedoc.generateDocs(out as string);
  }
}

export { Main as Autodocs };
