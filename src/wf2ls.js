import { default as minimist } from 'minimist';

import { AppState } from './state.js';
import { appConfig, loadArgsToConfig } from './config.js';
import { mainProgressBar } from './progress.js';
import { main } from './main.js';
import { loadSrcFile, writeFile } from './fs.js';

// CLI entrypoint for main()
const mainState = new AppState(mainProgressBar);
const mainConfig = loadArgsToConfig(appConfig, minimist(process.argv.slice(2)));
const rawData = loadSrcFile(mainConfig.sourceFile);

main(mainState, mainConfig, rawData);

for (let [page, content] of mainState.pages) {
  writeFile(content, page + ".md", mainConfig.destDir);
}
