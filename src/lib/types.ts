import { TypedocConfigs } from './services/typedoc';
import { AdditionalConverts } from './services/convert';
import { Rendering } from './services/render';
import { BuiltinTemplate } from './services/template';

/**
 * Custom generator options
 *
 * Options can be provided in 3 ways:
 *
 * - Under the __@lamnhan/docsuper__ property of `package.json` file
 * - The `docsuper.config.js` file for more advanced config
 * - By the `options` param when init new [[docsuper | `docsuper(options?)`]] instance.
 *
 */
export interface Options {
  /**
   * Path to the source code, default to `src`
   */
  srcPath?: string;
  /**
   * Custom API reference url, default to the Github Pages repo url
   */
  apiUrl?: string;
  /**
   * Detail API generator
   */
  apiGenerator?: 'typedoc' | 'none';
  /**
   * Custom [Typedoc](https://typedoc.org) config
   */
  typedoc?: TypedocConfigs;
  /**
   * List of documents to be generated: __key__ is the path to the document and __value__ is a template name or a rendering input
   */
  files?: {
    [path: string]: BuiltinTemplate | Rendering;
  };
  /**
   * Additional redering options
   */
  filesOpt?: {
    [path: string]: OptionsForFiles;
  };
  /**
   * Additional converts
   */
  converts?: AdditionalConverts;
  /**
   * No generator footer attribution
   */
  noAttr?: boolean;
}

export interface OptionsForFiles {
  cleanOutput?: boolean;
}