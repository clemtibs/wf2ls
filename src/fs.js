import fs from 'fs';

const directoryExists = (path) => {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
}

const fileExists = (fPath) => {
  try {
    return fs.existsSync(fPath);
  } catch (err) {
    return false;
  }
}

const makeDir = (dPath) => {
  try {
    fs.mkdirSync(dPath);
    return true;
  } catch (err) {
    let postMsg;
    if (directoryExists(dPath)) {
      postMsg = "\n\tdirectory already exists"
    } else {
      postMsg = "\n\tunknown error\n" + err;
    }
    throw new Error(
    "Could not create directory at \"" + dPath + "\", " + postMsg);
  }
}

const readJsonFile = (fPath) => {
  let rawJson;
  try {
    rawJson = fs.readFileSync(fPath);
  } catch (err) {
    throw err;
  }
  return JSON.parse(rawJson);
}

const removeDirAndContents = (dPath) => {
  try {
    fs.rmSync(dPath, { recursive: true });
    return true;
  } catch (err) {
    let postMsg;
    if (directoryExists(dPath)) {
      postMsg = "\n\tunknown error";
    } else {
      postMsg = "\n\tdirectory doesn't exist"
    }
    throw new Error(
    "Could not delete directory at \"" + dPath + "\", " + postMsg);
  }
}

// Doesn't touch filesystem, just manipulates the given path as a string.
// Leaving directory checks write attempts to writeFile()
const resolveGraphRootDir = (destDir) => {
  let destDirClean = '';
  let destDirCleanArr = [];
  let lastChildDir = '';
  let graphRoot = '';

  if (destDir.endsWith("/")) {
    destDirClean = destDir.slice(0, -1);
  } else {
    destDirClean = destDir;
  }

  destDirCleanArr = destDirClean.split('/');
  lastChildDir = destDirCleanArr[destDirCleanArr.length - 1]

  switch (lastChildDir) {
    case 'assets':
    case 'journals':
    case 'logseq':
    case 'pages':
    case 'whiteboards':
      graphRoot = destDirCleanArr.slice(0, -1).join('/');
      break;
    default:
      graphRoot = destDirCleanArr.join('/');
  }

  return graphRoot;
}

const writeFile = (data, file, destDir) => {
  let filePath = ""

  if (!directoryExists(destDir)) {
    throw new Error(
      "Could not write to \"" + destDir + "," + "\n\tdirectory doesn't exist.");
  }

  if (destDir.endsWith("/")) {
    filePath = destDir + file 
  } else {
    filePath = destDir + "/" + file
  }

  try {
    fs.writeFileSync(filePath, data)
    return true;
  } catch (err) {
    return err;
  }
}

export { 
  directoryExists,
  fileExists,
  makeDir,
  readJsonFile,
  removeDirAndContents,
  resolveGraphRootDir,
  writeFile
};
