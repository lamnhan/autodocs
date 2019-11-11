import { DocsuperModule, BuiltinTemplate } from '../../public-api';

export interface GenerateCommandOptions {
  config?: string;
  package?: string;
  template?: BuiltinTemplate;
}

export class GenerateCommand {

  constructor(
    private docsuperModule: DocsuperModule
  ) {}

  run(path?: string, options: GenerateCommandOptions = {}) {
    const { config, package: packagePath, template = 'mini' } = options;
    // path + template
    if (!!path) {
      this.docsuperModule.output(path, template);
    } else {
      // get instance
      const docsuperModule = !config
        ? this.docsuperModule
        : this.docsuperModule.extend(config, packagePath);
      // generate files
      docsuperModule.outputLocal();
      // generate detail api
      docsuperModule.generateDocs();
    }
  }

}