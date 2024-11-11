const time = require('./time.js');

let argv = require('minimist')(process.argv.slice(2));
let config = {
  sourceFile: "",
  destDir: ""
};
let data = {};
let resultIdMap = new Map();
let mirrors = new Map();

const loadArgsToConfig = (args) => {
  config.sourceFile = args.i;
  config.destDir = args.d;
}

const loadSrcFile = (fPath) => {
  const fs = require('fs');
  const rawData = fs.readFileSync(fPath);
  data = JSON.parse(rawData);
}
const processNode = (node) => {
  let result = {};
  if (!resultIdMap.get(node.id)) resultIdMap.set(node.id, result);
  result.name = node.nm;
  result.id = node.id;
  if (node.no) result.note = node.no;
  if (node.cp) result.completed = node.completed;
  if (node.ct) result.created = time.wfTimeToLocalTime(node.ct, time.wfEpochSecondsPst);
  result.lastModified = node.lastModified;
  node.mirrorRootItems?.forEach(item => mirrors.set(item.id, node.id));
  if (node.children) result.children = node.children?.map(child => processNode(child));
  return result;
}

const main = () => {
  loadArgsToConfig(argv);
  loadSrcFile(config.sourceFile);
	let results = processNode(data[0]);
	console.log(results)
  // console.log(resultIdMap);
  // console.log(mirrors);

}

main();
