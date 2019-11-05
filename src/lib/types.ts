// tslint:disable: no-any
import { TypedocConfigs, TypedocService } from './services/typedoc';
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
   * List of documents to be generated: __key__ is the path to the document (under the `outPath`) and __value__ is a template name or a rendering input
   */
  render?: {
    [path: string]: RenderInput;
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

export type CustomApiGenerator = (typedocService: TypedocService, out: string) => void;

export type RenderInput = BuiltinTemplate | Rendering | RenderWithOptions;
export interface RenderWithOptions extends RenderOptions {
  template?: BuiltinTemplate;
  rendering?: Rendering;
}
export interface RenderOptions {
  title?: string;
  cleanOutput?: boolean;
  templateOptions?: {[key: string]: any};
  webData?: {[key: string]: any};
}
