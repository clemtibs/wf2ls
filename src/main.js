import { parse2md } from './md.js';
import { parseData } from './processing.js';

const main = (state, conf, data) => {
  const parsedData = parseData(state, data);
  state.startProgressBar();
  parse2md(state, conf, conf.defaultPage, parsedData, parsedData.length);
  state.stopProgressBar();
}

export { main };
