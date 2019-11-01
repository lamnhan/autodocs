import { DocsuperModule } from '../../public-api';

export interface GenerateCommandOptions {
  config?: string;
}

export class GenerateCommand {

  constructor(
    private docsuperModule: DocsuperModule
  ) {}

  run({ config }: GenerateCommandOptions) {
    // get instance
    const docsuperModule = !config
      ? this.docsuperModule
      : this.docsuperModule.extend(config);
    // generate files
    docsuperModule.outputLocal();
    // generate detail api
    docsuperModule.generateDocs();
  }

}