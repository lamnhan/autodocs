#!/usr/bin/env node

import { CLI } from './cli';

const cliApp = new CLI().getApp();

// show help
if (!process.argv.slice(2).length) {
  cliApp.outputHelp();
}

// execution
cliApp.parse(process.argv);
