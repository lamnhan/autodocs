import { RenderingConfig } from './services/renderer';

export interface Options {
  url?: string; // api reference url
  out?: string; // api reference folder
  noAttr?: boolean;
  files?: RenderingConfig;
}
