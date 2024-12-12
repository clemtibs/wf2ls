import fs from 'fs';

const directoryExists = (path) => {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    console.error("Error: Destination directory \"" + path + "\" does not exist.");
  }
}

const readJsonFile = (fPath) => {
  const rawJson = fs.readFileSync(fPath);
  return JSON.parse(rawJson);
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

export { 
  readJsonFile,
  writeFile
};
