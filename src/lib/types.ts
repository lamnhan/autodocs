import { Rendering } from './services/renderer';

/**
 * The library options
 * 
 * Options can be provided in 3 ways:
 *
 * - The `autodocs.json` file
 * - Under the __@lamnhan/autodocs__ property of `package.json` file
 * - By the `options` param when init new [`autodocs(options?)`](https://lamnhan.github.io/global.html#autodocs) instance.
 */
export interface Options {
  /**
   * Custom API reference output folder, default to `docs/`
   */
  out?: string;
  /**
   * Custom API reference url, default to the Github Pages repo url
   */
  url?: string;
  /**
   * Ignore generator footer attribution
   */
  noAttr?: boolean;
  /**
   * List of documents to be generated; __key__ is the path to the document, __value__ is a template name or a rendering configuration
   */
  files?: {
    [path: string]: BuiltinTemplate | Rendering;
  };
}

export type BuiltinTemplate = 'mini' | 'full';
