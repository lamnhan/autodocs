import { OptionsInput } from './services/project';
import { Main } from './main';

export function main(optionsInput?: OptionsInput) {
  return new Main(optionsInput);
}
