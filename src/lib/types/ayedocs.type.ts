import {TypedocConfigs, TypedocService} from '../services/typedoc.service';
import {BatchRender} from '../services/render.service';

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
   * Detail reference generator, default to 'typedoc'
   */
  refGenerator?: 'none' | 'typedoc' | CustomReferenceGenerator;
  /**
   * Custom [Typedoc](https://typedoc.org) configs
   */
  typedocConfigs?: TypedocConfigs;
  /**
   * Output as standalone file
   */
  fileRender?: BatchRender;
  /**
   * Output as a website
   */
  webRender?: WebRender;
  /**
   * Global clean output, can be overridden per file
   */
  cleanOutput?: boolean;
}

/**
 * Specific config for render as a website
 */
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

export type CustomReferenceGenerator = (
  typedocService: TypedocService,
  out: string
) => void;
