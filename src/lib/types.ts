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
   * Detail API generator, default to 'typedoc'
   */
  apiGenerator?: 'none' | 'typedoc' | CustomApiGenerator;
  /**
   * Custom [Typedoc](https://typedoc.org) configs
   */
  typedocConfigs?: TypedocConfigs;
  /**
   * Global clean output, can be overridden per file
   */
  cleanOutput?: boolean;
  /**
   * No generator footer attribution
   */
  noAttr?: boolean;
  /**
   * Output as standalone file
   */
  fileRender?: BatchRender;
  /**
   * Output as a website
   */
  webRender?: WebRender;
  /**
   * Additional converts
   */
  converts?: AdditionalConverts;
}

export type CustomApiGenerator = (typedocService: TypedocService, out: string) => void;

export interface WebRender {
  /**
   * List of files
   */
  files: BatchRender;
  /**
   * Website output dir
   */
  out?: string;
  /**
   * Name of or path to a website theme, built-in themes: default
   */
  theme?: string;
  /**
   * Website article grouping
   */
  categories?: {
    [id: string]: string;
  };
  /**
   * Custom website index.html, default to a page that redirects to the first article
   */
  index?: string;
}
