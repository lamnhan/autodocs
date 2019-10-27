import { Options } from './types';
import { DocsuperModule } from './main';

export function docsuper(options?: Options) {
  return new DocsuperModule(options);
}
