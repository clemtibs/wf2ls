const time = require('./time.js');

let argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
let config = {
  sourceFile: "",
  destDir: "",
  newPageTag: "#LS-Page",
  defaultPage: "content"
};
let data = {};
let pages = new Map();
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
  if (node.cp) result.completed = time.wfTimeToLocalTime(node.cp, time.wfEpochSecondsPst);
  if (node.metadata.layoutMode == "todo") result.layoutMode = "todo";
  // result.lastModified = time.wfTimeToLocalTime(node.lm, time.wfEpochSecondsPst);
  // node.mirrorRootItems?.forEach(item => mirrors.set(item.id, node.id));
  if (node.ch) result.children = node.ch.map(child => processNode(child));
  return result;
}

const tagInText = (tag, str) => {
  return (str ?? '').includes(tag);
}

const stripTag = (tag, str) => {
  return (str ?? '').replace(tag, '');
}

const makePageLink = (str) => {
  return `[[ ${(str ?? 'Orphans')} ]]` 
}

const processNote = (node, indent) => {
  let note = "";
  if (node.note) {
    let lines = node.note.split('\n');
    let prefixedLines = []
    lines.forEach(l => {
      prefixedLines.push(indent + l);
    });
    note = '\n' + prefixedLines.join(`\n`);
  }
  return note;
}

const parse2md = (pageName, node, nNodes, spaces, indentLvl, isNewPage) => {
  pageName ? pageName : pageName = "content";
  spaces ? spaces : spaces = 2;
  indentLvl ? indentLvl : indentLvl = 0;
  isNewPage ? isNewPage : isNewPage = false;
  let pageBlocks = [];
  for (n of node) {
    if (n.name === "") continue;
    let firstPrefix = " ".repeat(spaces * indentLvl) + "- ";
    let restPrefix = " ".repeat(spaces * indentLvl) + "  ";
    let name = n.name.trim();
    let note = "";
    let completed = "";
    let marker = "";
    
    if (tagInText(config.newPageTag, name) ||
        tagInText(config.newPageTag, n.note) && !isNewPage) {
      pName = stripTag(config.newPageTag, name).trim();
      n.name = pName;
      name = makePageLink(pName);
      note = stripTag(config.newPageTag, processNote(n, restPrefix)).trim();
      n.note = note;
      pageBlocks.push(firstPrefix + name + '\n' + note);
      parse2md(pName, [n], n.children.length, 2, 0, true);
    }

    note = processNote(n, restPrefix);

    if (n.layoutMode == "todo") {
      marker = "TODO ";
      if (n.completed) {
        completed = "\n" + restPrefix + "completed-on:: " + n.completed;
        marker = "COMPLETED ";
      }
    }

    pageBlocks.push(n.name = firstPrefix + marker + name + completed + note);

    if (n.children) pageBlocks.push(parse2md(
      pageName,
      n.children,
      n.children.length,
      2,
      indentLvl + 1,
      false));

    nNodes -= 1;

    if (nNodes == 0 && indentLvl > 0) {
      return pageBlocks.join('\n');
    }
  };
  pages.set(pageName, pageBlocks.join('\n'));
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
  let processedData = data.map(node => processNode(node));
  parse2md(config.defaultPage, processedData, processedData.length);

  // parse2md("Page One", processedData, processedData.length);
  // console.log(pages);

  for (let [page, content] of pages) {
    writeMd(content, page + ".md", config.destDir);
  }

  // console.log(mirrors);
}

main();
