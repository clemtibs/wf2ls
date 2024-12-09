import { default as minimist } from 'minimist';

import { loadSrcFile, writeFile } from './fs.js';
import { parse2md } from './md.js';
import { parseData } from './processing.js';
import { AppState } from './state.js';
import { appConfig, loadArgsToConfig } from './config.js';
import { mainProgressBar } from './progress.js';

const mainState = new AppState(mainProgressBar);
const mainConfig = loadArgsToConfig(appConfig, minimist(process.argv.slice(2)));

const main = (state, conf) => {
  const rawData = loadSrcFile(conf.sourceFile);
  const parsedData = parseData(state, rawData);
  state.startProgressBar();
  parse2md(state, conf, conf.defaultPage, parsedData, parsedData.length);
  state.stopProgressBar();

  for (let [page, content] of state.pages) {
    writeFile(content, page + ".md", conf.destDir);
  }
}

main(mainState, mainConfig);
