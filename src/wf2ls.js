const date = require('./date.js');
const progress = require('./progress.js');

let argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
let config = {
  sourceFile: "",
  destDir: "",
  newPageTag: "#LS-Page",
  indentSpaces: 2,
  defaultPage: "Page One"
};
let totalNumNodes = 0;
let jobProgress = 0;
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
  if (!node.metadata.isReferencesRoot) totalNumNodes += 1;
  let result = {};
  // if (!resultIdMap.get(node.id)) resultIdMap.set(node.id, result);
  result.name = node.nm;
  // result.id = node.id;
  // if (node.ct) result.created = date.wfTimeToLocalTime(node.ct, date.wfEpochSecondsPst);
  if (node.no) result.note = node.no;
  if (node.cp) result.completed = date.wfTimeToLocalTime(node.cp, date.wfEpochSecondsPst);
  if (node.metadata.layoutMode == "todo") result.layoutMode = "todo";
  // result.lastModified = date.wfTimeToLocalTime(node.lm, date.wfEpochSecondsPst);
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

const toPageLink = (str) => {
  return `[[ ${(str ?? 'Orphans')} ]]` 
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

const makeBlockPrefix = (indentLvl) => {
  if (indentLvl < 0) {
    return ""
  } else {
    return " ".repeat(config.indentSpaces * indentLvl) + "- ";
  }
}

const makeNotePrefix = (indentLvl) => {
  if (indentLvl < 0) {
    return ""
  } else {
    return " ".repeat(config.indentSpaces * indentLvl) + "  ";
  }
}

const MakeNode = (name, note) => {
  // let this. = {};
  // id ? n.id = id : n.id = crypto.randomUUID();
  // name ? n.name = name : n.id = '';
  // if (note) n.note = note;
  // if (completed) n.completed = completed;
  // if (children) n.children = children;
  this.id = crypto.randomUUID();
  name ? this.name = name : this.name = '';
  if (note) this.note = note;
  // if (completed) n.completed = completed;
  // if (children) n.children = children;
  return this;
}

const parse2md = (pageName, node, nNodes, indentLvl, isNewPage) => {
  pageName ? pageName : pageName = "content";
  indentLvl ? indentLvl : indentLvl = 0;
  isNewPage ? isNewPage : isNewPage = false;
  let pageBlocks = [];
  for (n of node) {
    jobProgress++;
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
            newNode.unshift(MakeNode(
              processNote( {note: n.note}, makeNotePrefix(0)),
              ''));
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
  loadSrcFile(config.sourceFile);
  let processedData = data.map(node => processNode(node));
  progress.bar.start(totalNumNodes, 0);
  parse2md(config.defaultPage, processedData, processedData.length);
  progress.bar.stop();

  for (let [page, content] of pages) {
    writeMd(content, page + ".md", config.destDir);
  }

  // console.log(mirrors);
}

main();
