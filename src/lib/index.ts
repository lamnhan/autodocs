import { Options } from './types';
import { DocsuperModule } from './main';

export function entry(options?: Options) {
  return new DocsuperModule(options);
}

export { entry as docsuper };