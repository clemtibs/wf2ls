const fs = require('fs');

const loadSrcFile = (fPath) => {
  const rawData = fs.readFileSync(fPath);
  return JSON.parse(rawData);
}

const directoryExists = (path) => {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    console.error("Error: Destination directory \"" + path + "\" does not exist.");
  }
}

const writeFile = (data, file, destDir) => {
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

module.exports = {
  loadSrcFile,
  writeFile
}
