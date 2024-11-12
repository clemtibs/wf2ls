const time = require('./time.js');

let argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
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
  const rawData = fs.readFileSync(fPath);
  data = JSON.parse(rawData);
}

const processNode = (node) => {
  let result = {};
  // if (!resultIdMap.get(node.id)) resultIdMap.set(node.id, result);
  result.name = node.nm;
  // result.id = node.id;
  // if (node.ct) result.created = time.wfTimeToLocalTime(node.ct, time.wfEpochSecondsPst);
  if (node.no) result.note = node.no;
  // if (node.cp) result.completed = time.wfTimeToLocalTime(node.cp, time.wfEpochSecondsPst);
  // result.lastModified = time.wfTimeToLocalTime(node.lm, time.wfEpochSecondsPst);
  // node.mirrorRootItems?.forEach(item => mirrors.set(item.id, node.id));
  if (node.ch) result.children = node.ch.map(child => processNode(child));
  return result;
}

const parse2md = (node, spaces, indentLvl) => {
  spaces ? spaces : spaces = 2;
  indentLvl ? indentLvl : indentLvl = 0;
  let content = [];
  node.forEach(n => {
    if (n.name != "") {
      let firstPrefix = " ".repeat(spaces * indentLvl) + "- ";
      let restPrefix = " ".repeat(spaces * (indentLvl)) + "  ";
      let name = n.name;
      let note = "";
      if (n.note) note = "\n" + restPrefix + n.note;
      content.push(n.name = 
        firstPrefix + name +  note);
      if (n.children) {
        content.push(parse2md(n.children, 2, indentLvl + 1));
      };
    }
  });
  return content.join("\n");
}

const directoryExists = (path) => {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    console.error("Error: Destination directory \"" + path + "\" does not exist.");
  }
}

const writeMd = (data, file, destDir) => {
  let output = ""
  if (directoryExists(destDir)) {
    if (destDir.endsWith("/")) {
      output = destDir + file 
    } else {
      output = destDir + "/" + file
    }
  fs.writeFileSync(output, data)
  }
}

const main = () => {
  loadArgsToConfig(argv);
  loadSrcFile(config.sourceFile);
  let results = data.map(node => processNode(node));
  let output = parse2md(results);
  console.log(output);
  // writeMd(output, "file.md", config.destDir);
  // console.log(resultIdMap);
  // console.log(mirrors);
}

main();
