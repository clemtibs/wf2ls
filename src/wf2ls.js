/* CLI entrypoint for main()
 *
 * Loading onfiguration files, CLI args, and source data from drive, writing to
 * output directory.
 */
import { default as minimist } from 'minimist';
import path from 'path';

import { AppState } from './state.js';
import { 
  AppConfig,
  defaultConfig,
  updateConfigFromCliArgs,
  updateConfigFromFile
} from './config.js';
import { mainProgressBar } from './progress.js';
import { main } from './main.js';
import {
  directoryExists,
  fileExists,
  makeDir,
  readJsonFile,
  resolveGraphRootDir,
  writeFile
} from './fs.js';

// Process config files first
//
// REMEMBER: all paths are relative to your PWD in your term. Easiest common
// reference is the root of src.
const mainConfig = new AppConfig(defaultConfig); // internal from config.js
let confFile = undefined;

if (fileExists(mainConfig.get("confFileLocation"))) { // ./config.json
  confFile = readJsonFile(mainConfig.get("confFileLocation"));
  updateConfigFromFile(mainConfig, confFile);
}

const cliArgs = minimist(process.argv.slice(2));
if (fileExists(cliArgs.c)) { // config from custom location, "-c" option on CLI
  confFile = readJsonFile(cliArgs.c);
  updateConfigFromFile(mainConfig, confFile);
}

// Give CLI args a chance to override anything from defaultConfig or confFile
updateConfigFromCliArgs(mainConfig, cliArgs);

//
// Main work loop
//
const rawData = readJsonFile(mainConfig.get("sourceFile"));
const mainState = new AppState(mainProgressBar);

main(mainState, mainConfig, rawData);

//
// Find the graph root directory
//
const graphRoot = resolveGraphRootDir(mainConfig.get("destDir"));
const resolvedFilePath = path.resolve(graphRoot);

//
// Make directories if needed
//
const pagesDir = `${resolvedFilePath}/pages`;
const journalsDir = `${resolvedFilePath}/journals` 

if (!directoryExists(resolvedFilePath)) {
  console.warn(`Output directory doesn't exist. Creating it at:\n${resolvedFilePath}`)
  makeDir(resolvedFilePath);
  makeDir(pagesDir);
  makeDir(journalsDir);
} else {
  console.warn(`Using existing graph root at:\n${resolvedFilePath}`)
}

//
// Write to appropriate sub folders of graph root
//
const journalRegex = /^[0-9]{4}_[0-9]{2}_[0-9]{2}$/;

for (let [page, content] of mainState.getAllPages()) {
  switch (true) {
    case journalRegex.test(page):
      writeFile(content, page + ".md", journalsDir);
    break;
    default:
      writeFile(content, page + ".md", pagesDir);
  }
}
