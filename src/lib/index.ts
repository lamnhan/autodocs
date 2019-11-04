import { Options } from './types';
import { DocsuperModule } from './main';

export function main(options?: Options) {
  return new DocsuperModule(options);
}

export { main as docsuper };