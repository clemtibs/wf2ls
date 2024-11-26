const date = require('./date.js');
const progress = require('./progress.js');
const utils = require('./utils.js');
const { config } = require('./config.js');
const {
  tagInText: tagInText,
  stripTag: stripTag,
  toPageLink: toPageLink,
  makeBlockPrefix: makeBlockPrefix,
  makeNotePrefix: makeNotePrefix
} = require('./text.js');

let argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
let totalNumNodes = 0;
let jobProgress = 0;
let pages = new Map();
let mirrors = new Map();

const loadArgsToConfig = (args) => {
  config.sourceFile = args.i;
  config.destDir = args.d;
}

const loadSrcFile = (fPath) => {
  const rawData = fs.readFileSync(fPath);
  return JSON.parse(rawData);
}

const parseData = (data) => {
  let newData = [];
  for (node of data) {
    if (node.nm !== "") {
      let newNode = {};
      // if (!node.metadata.isReferencesRoot) totalNumNodes += 1;
      totalNumNodes++;
      // console.log(node.nm + ": " + totalNumNodes)
      // if (!resultIdMap.get(node.id)) resultIdMap.set(node.id, newNode);
      newNode.name = node.nm;
      // newNode.id = node.id;
      // if (node.ct) newNode.created = date.wfTimeToLocalTime(node.ct, date.wfEpochSecondsPst);
      if (node.no) newNode.note = node.no;
      if (node.cp) newNode.completed = date.wfTimeToLocalTime(node.cp, date.wfEpochSecondsPst);
      if (node.metadata.layoutMode == "todo") newNode.layoutMode = "todo";
      // newNode.lastModified = date.wfTimeToLocalTime(node.lm, date.wfEpochSecondsPst);
      // node.mirrorRootItems?.forEach(item => mirrors.set(item.id, node.id));
      // if (node.ch) newNode.children = node.ch.map(child => parseData(child));
      if (node.ch) newNode.children = parseData(node.ch);
      newData.push(newNode)
    } else {
      continue;
    }
  };
  return newData;
}

const processNote = (node, indentTxt) => {
  let note = "";
  if (node.note) {
    let lines = node.note.split('\n');
    let prefixedLines = []
    lines.forEach(l => {
      prefixedLines.push(indentTxt + l);
    });
    note = '\n' + prefixedLines.join(`\n`);
  }

  return note;
}

const parse2md = (pageName, node, nNodes, indentLvl, isNewPage) => {
  pageName ? pageName : pageName = "content";
  indentLvl ? indentLvl : indentLvl = 0;
  isNewPage ? isNewPage : isNewPage = false;
  let pageBlocks = [];
  for (n of node) {
    jobProgress++;
    // console.log(n.name + ": " + jobProgress)
    progress.bar.update(jobProgress);
    if (n.name !== "") {
      let name = n.name.trim();
      let note = "";
      let completed = "";
      let marker = "";
      if (tagInText(config.newPageTag, n.name) ||
          tagInText(config.newPageTag, n.note) &&
          !isNewPage) {
            pName = stripTag(config.newPageTag, name).trim();
            n.name = toPageLink(pName);
            name = n.name;
            n.note = stripTag(config.newPageTag, n.note).trim();
            newNode = n.children;
            newNode.unshift(utils.makeNode(
              processNote( {note: n.note}, makeNotePrefix(0)),
              ''));
            totalNumNodes++
            progress.bar.setTotal(totalNumNodes);
            parse2md(pName.trim(), newNode, newNode.length, 0, true);
      }

      note = processNote(n, makeNotePrefix(indentLvl));

      if (n.layoutMode === "todo") {
        marker = "TODO ";
        if (n.completed) {
          completed = "\n" + makeNotePrefix(indentLvl) + "completed-on:: " + n.completed;
          marker = "COMPLETED ";
        }
      }

      pageBlocks.push(makeBlockPrefix(indentLvl) + marker + name + completed + note);

      if (n.children) {
        pageBlocks.push(parse2md(
          pageName.trim(),
          n.children,
          n.children.length,
          indentLvl + 1,
          false));
      }
    }
    nNodes -= 1;
  };

  if (nNodes === 0 && indentLvl > 0) {
    return pageBlocks.join('\n');
  }

  pages.set(pageName.trim(), pageBlocks.join('\n'));
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
  const rawData = loadSrcFile(config.sourceFile);
  const parsedData = parseData(rawData);
  progress.bar.start(totalNumNodes, 0);
  parse2md(config.defaultPage, parsedData, parsedData.length);
  progress.bar.stop();

  for (let [page, content] of pages) {
    writeMd(content, page + ".md", config.destDir);
  }

  // console.log(mirrors);
}

main();
