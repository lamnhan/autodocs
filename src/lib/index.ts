import { Options } from './types';
import { Main } from './main';

export function main(options?: Options) {
  return new Main(options);
}
