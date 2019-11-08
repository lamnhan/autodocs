// tslint:disable: no-any
import { TypedocConfigs, TypedocService } from './services/typedoc';
import { AdditionalConverts } from './services/convert';
import { BatchRender } from './services/render';

/**
 * Custom generator options
 *
 * Options can be provided in 3 ways:
 *
 * - Under the __@lamnhan/docsuper__ property of `package.json` file
 * - The `docsuper.config.js` file for more advanced config
 * - By the `options` param when init new [[docsuper | `docsuper(options?)`]] instance.
 */
export interface Options {
  /**
   * Docs homepage url, default to the Github Pages repo url
   */
  url?: string;
  /**
   * Path to the source code, default to `src`
   */
  srcPath?: string;
  /**
   * Root path to output files to, default to the project root
   */
  outPath?: string;
  /**
   * Detail API generator, default to 'typedoc'
   */
  apiGenerator?: 'none' | 'typedoc' | CustomApiGenerator;
  /**
   * Custom [Typedoc](https://typedoc.org) configs
   */
  typedocConfigs?: TypedocConfigs;
  /**
   * Output as standalone file or as a website
   */
  outputMode?: 'file' | 'website';
  /**
   * Name of or path to a website theme, built-in themes: default
   */
  websiteTheme?: string;
  /**
   * Website article grouping
   */
  websiteCategories?: {
    [id: string]: string;
  };
  /**
   * Custom website index.html
   */
  websiteIndex?: string;
  /**
   * List of documents to be generated: __key__ is the path to the document (under the `outPath`) and __value__ is a template name or a rendering input
   */
  render?: BatchRender;
  /**
   * Additional converts
   */
  converts?: AdditionalConverts;
  /**
   * Global clean output, can be overridden per file
   */
  cleanOutput?: boolean;
  /**
   * No generator footer attribution
   */
  noAttr?: boolean;
}

export type CustomApiGenerator = (typedocService: TypedocService, out: string) => void;
