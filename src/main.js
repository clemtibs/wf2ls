import { convertToMd } from './md.js';
import { parseWfData } from './parsers.js';

const main = (state, conf, data) => {
  const parsedData = parseWfData(state, data);
  state.startProgressBar();
  convertToMd({
    state: state,
    conf: conf,
    pageName: conf.get("defaultPage"),
    nodes: parsedData,
    nNodes: parsedData.length
  });
  state.stopProgressBar();

  if (state.isTestInstance) return state;
}

export { main };
