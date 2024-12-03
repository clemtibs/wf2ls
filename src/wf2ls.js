import date from './date.js';
import { loadSrcFile, writeFile } from './fs.js';
import { parse2md } from './md.js';
import { nodeIsBacklink } from './node.js';
import { default as minimist } from 'minimist';
import { parseData } from './processing.js';
import { mainState } from './state.js';
import { mainConfig, loadArgsToConfig } from './config.js';

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

main(
  mainState,
  loadArgsToConfig(mainConfig, minimist(process.argv.slice(2)))
);
