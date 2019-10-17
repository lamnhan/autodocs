import { Rendering } from './services/renderer';

/**
 * Custom generator options
 * 
 * Options can be provided in 3 ways:
 *
 * - The `autodocs.json` file
 * - Under the __@lamnhan/autodocs__ property of `package.json` file
 * - By the `options` param when init new [`autodocs(options?)`](https://lamnhan.com/autodocs/global.html#autodocs) instance.
 *
 */
export interface Options {
  /**
   * Custom Typedoc output folder, default to `docs/`
   */
  out?: string;
  /**
   * Custom Typedoc readme
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
   * Ignore generator footer attribution
   */
  noAttr?: boolean;
}

export type BuiltinTemplate = 'mini' | 'full';
