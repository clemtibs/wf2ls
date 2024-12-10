import { loadSrcFile, writeFile } from './fs.js';
import { parse2md } from './md.js';
import { parseData } from './processing.js';

const main = (state, conf) => {
  const rawData = loadSrcFile(conf.sourceFile);
  const parsedData = parseData(state, rawData);
  state.startProgressBar();
  parse2md(state, conf, conf.defaultPage, parsedData, parsedData.length);
  state.stopProgressBar();

  if (!state.isTestInstance) {
    for (let [page, content] of state.pages) {
      writeFile(content, page + ".md", conf.destDir);
    }
  } else {
    return state
  }
}

export { main };
