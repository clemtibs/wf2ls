import { default as minimist } from 'minimist';

import { AppState } from './state.js';
import { 
  AppConfig,
  defaultConfig,
  loadArgsToConfig
} from './config.js';
import { mainProgressBar } from './progress.js';
import { main } from './main.js';
import { loadSrcFile, writeFile } from './fs.js';

// CLI entrypoint for main()
const mainState = new AppState(mainProgressBar);
const mainConfig = new AppConfig(defaultConfig);
loadArgsToConfig(mainConfig, minimist(process.argv.slice(2)))
const rawData = loadSrcFile(mainConfig.get("sourceFile"));

main(mainState, mainConfig, rawData);

for (let [page, content] of mainState.pages) {
  writeFile(content, page + ".md", mainConfig.get("destDir"));
}
