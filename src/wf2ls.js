const date = require('./date.js');
const { config } = require('./config.js');
const { loadSrcFile, writeFile } = require('./fs.js');
const { parse2md } = require('./md.js');
const { state } = require('./state.js');
const { nodeIsBacklink } = require('./node.js');

let argv = require('minimist')(process.argv.slice(2));

const loadArgsToConfig = (args) => {
  config.sourceFile = args.i;
  config.destDir = args.d;
}

/*
 * @params: {JSON}
 * @returns: {JSON}
 */
const parseData = (data) => {
  let newData = [];
  for (node of data) {
    if (node.nm !== "") {
      let newNode = {};
      state.addJob()
      // if (!resultIdMap.get(node.id)) resultIdMap.set(node.id, newNode);
      newNode.name = node.nm.trim();
      // newNode.id = node.id;
      // if (node.ct) newNode.created = date.wfTimeToLocalTime(node.ct, date.wfEpochSecondsPst);
      if (node.no) newNode.note = node.no.trim();
      if (node.cp) newNode.completed = date.wfTimeToLocalTime(node.cp, date.wfEpochSecondsPst);
      if (node.metadata.layoutMode == "todo") newNode.layoutMode = "todo";
      // newNode.lastModified = date.wfTimeToLocalTime(node.lm, date.wfEpochSecondsPst);
      // node.mirrorRootItems?.forEach(item => mirrors.set(item.id, node.id));
      if (node.ch) {
        if (!(node.ch.length === 1 && nodeIsBacklink(node.ch[0]))) {
          newNode.children = parseData(node.ch); 
        }
      }
      newData.push(newNode)
    } else {
      continue;
    }
  };
  return newData;
}

const main = () => {
  loadArgsToConfig(argv);
  const rawData = loadSrcFile(config.sourceFile);
  const parsedData = parseData(rawData);
  state.startProgressBar();
  parse2md(config.defaultPage, parsedData, parsedData.length); // writes to state.pages map
  state.stopProgressBar();

  for (let [page, content] of state.pages) {
    writeFile(content, page + ".md", config.destDir);
  }

}

main();
