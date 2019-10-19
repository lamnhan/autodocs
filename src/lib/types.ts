import { Block, Content } from './services/content';
import { ConvertOptions } from './services/converter';
import { Rendering } from './services/renderer';

import { Declaration } from './components/declaration';

/**
 * Custom generator options
 *
 * Options can be provided in 3 ways:
 *
 * - Under the __@lamnhan/autodocs__ property of `package.json` file
 * - The `autodocs.config.js` file for more advanced config
 * - By the `options` param when init new [`autodocs(options?)`](https://lamnhan.com/autodocs/index.html#autodocs) instance.
 *
 */
export interface Options {
  /**
   * Custom [Typedoc](https://typedoc.org) output folder, default to `docs/`
   */
  out?: string;
  /**
   * Custom [Typedoc](https://typedoc.org) readme
   */
  readme?: string;
  /**
   * Custom API reference url, default to the Github Pages repo url
   */
  url?: string;
  /**
   * List of documents to be generated: __key__ is the path to the document and __value__ is a template name or a rendering input
   */
  files?: {
    [path: string]: BuiltinTemplate | Rendering;
  };
  /**
   * Custom converts
   */
  converts?: CustomConverts;
  /**
   * Ignore generator footer attribution
   */
  noAttr?: boolean;
}

export type BuiltinTemplate = 'mini' | 'full';

export type CustomConvert = (
  declaration: Declaration,
  options: ConvertOptions,
  $Content: Content
) => Block[];

export interface CustomConverts {
  [output: string]: CustomConvert;
}
