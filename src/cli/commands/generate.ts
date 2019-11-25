import { AyedocsModule, BuiltinTemplate } from '../../public-api';

export interface GenerateCommandOptions {
  config?: string;
  package?: string;
  template?: BuiltinTemplate;
}

export class GenerateCommand {

  constructor(
    private ayedocsModule: AyedocsModule
  ) {}

  run(path?: string, options: GenerateCommandOptions = {}) {
    const { config, package: packagePath, template = 'mini' } = options;
    // path + template
    if (!!path) {
      this.ayedocsModule.output(path, template);
    } else {
      // get instance
      const ayedocsModule = !config
        ? this.ayedocsModule
        : this.ayedocsModule.extend(config, packagePath);
      // generate files
      ayedocsModule.outputLocal();
      // generate detail api
      ayedocsModule.generateDocs();
    }
  }

}