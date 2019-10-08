import { Options } from './types';
import { Autodocs } from './main';

export function autodocs(options?: Options) {
  return new Autodocs(options);
}
