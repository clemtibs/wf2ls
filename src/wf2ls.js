/* CLI entrypoint for main()
 *
 * Loading onfiguration files, CLI args, and source data from drive, writing to
 * output directory.
 */
import path from 'path';
import { pathToFileURL } from 'url';

import { default as minimist } from 'minimist';

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

// npm run cli-convert 
const runningAsScript = (import.meta.url === pathToFileURL(process.argv[1]).href);

const cliWrapper = (args) => {
  let mainState = undefined;
  // Process config various files first
  //
  // REMEMBER: All paths are relative to your CWD in your term. Easiest common
  // reference is the root of src.
  const mainConfig = new AppConfig(defaultConfig); // internal from config.json
  let origConfFilePath = undefined;
  let origSourceFilePath = undefined;
  let resolvedConfigFilePath;
  let resolvedSourceFilePath;

  // Look for './config.json' first, optional
  origConfFilePath = mainConfig.get("confFileLocation");
  try {
    resolvedConfigFilePath = path.resolve(origConfFilePath);
  } catch {
    throw new Error(`Could not resolve relative path for "confFileLocation" value: ${origConfFilePath}`)
  }
  if (fileExists(resolvedConfigFilePath)) {
    mainConfig.set('confFileLocation', resolvedConfigFilePath)
    updateConfigFromFile(mainConfig, readJsonFile(resolvedConfigFilePath));
  }

  // Override config from custom location, if provided, via "-c" option on CLI.
  // Also optional but must be valid
  const cliArgs = minimist(args);

  if (cliArgs.hasOwnProperty('c')) {
    try {
      resolvedConfigFilePath = path.resolve(cliArgs.c);
    } catch {
      throw new Error(`Could not resolve relative path for custom configuration (given with "-c" option) with value of: ${cliArgs.c}`)
    }
    if (fileExists(resolvedConfigFilePath)) { 
      try {
        mainConfig.set('confFileLocation', resolvedConfigFilePath)
        updateConfigFromFile(mainConfig, readJsonFile(resolvedConfigFilePath));
      } catch {
        throw new Error(`Bad value for custom configuration location using "-c" option in "${cliArgs.c}"\nCan't access file.`)
      }
    } else {
      throw new Error(`Bad value for custom configuration location using "-c" option in "${cliArgs.c}"\nCan't find file.`)
    }
  }
  // Give CLI args a chance to override sourceFile or destDir, but not confFileLocation
  updateConfigFromCliArgs(mainConfig, cliArgs);

  //
  // Get source data
  //
  origSourceFilePath = mainConfig.get('sourceFile');
  let rawData = undefined;

  if (origSourceFilePath === '') {
    throw new Error('No source file given. Specify with "sourceFile" in your configuration file or using the "-s" argument.')
  } else {
    try {
      resolvedSourceFilePath = path.resolve(origSourceFilePath);
    } catch {
      throw new Error(`Could not resolve relative path for "sourceFile" value: ${origSourceFilePath}`)
    }
    if (fileExists(resolvedSourceFilePath)) {
      try {
        mainConfig.set('sourceFile', resolvedSourceFilePath)
        rawData = readJsonFile(resolvedSourceFilePath);
      } catch {
        throw new Error(`Bad value for "sourceFile" in "${origSourceFilePath}"\nCan't access file.`)
      }
    } else {
      throw new Error(`Bad value for "sourceFile" in "${origSourceFilePath}"\nCan't find file.`)
    }
  }

  //
  // Main work loop
  //
  let returnedState;
  if (runningAsScript) {
    mainState = new AppState(mainProgressBar); // npm run cli-convert 
    main(mainState, mainConfig, rawData);
  } else {
    mainState = new AppState(undefined, true); // no progress bar in test scripts
    returnedState = main(mainState, mainConfig, rawData); // test mode returns state
  }

  //
  // Find the graph root directory
  //
  const graphRoot = resolveGraphRootDir(mainConfig.get("destDir"));
  let resolvedGraphRootFilePath;
  try {
    resolvedGraphRootFilePath = path.resolve(graphRoot);
  } catch {
    throw new Error(`Could not resolve relative path for "destDir" value: ${graphRoot}`)
  }

  //
  // Make directories if needed
  //
  const pagesDir = `${resolvedGraphRootFilePath}/pages`;
  const journalsDir = `${resolvedGraphRootFilePath}/journals` 

  if (!directoryExists(resolvedGraphRootFilePath)) {
    console.log(`Output directory doesn't exist. Creating it at:\n${resolvedGraphRootFilePath}`)
    makeDir(resolvedGraphRootFilePath);
  } else {
    console.log(`Using existing graph root at:\n${resolvedGraphRootFilePath}`)
  }

  if (!directoryExists(pagesDir)) makeDir(pagesDir);
  if (!directoryExists(journalsDir)) makeDir(journalsDir);

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

  // Return state and config objects when testing this module only
  if (!runningAsScript && args[0] === 'wf2ls.test') {
    return {
      testState: returnedState,
      testConfig: mainConfig
    }
  }
};

if (runningAsScript) { // npm run cli-convert 
  cliWrapper(process.argv.slice(2));
}

export { cliWrapper };
