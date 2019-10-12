import { Rendering } from './services/renderer';

export interface Options {
  url?: string; // api reference url
  out?: string; // api reference folder
  noAttr?: boolean;
  files?: {
    [path: string]: BuiltinTemplate | Rendering;
  };
}

export type BuiltinTemplate = 'general' | 'full';
