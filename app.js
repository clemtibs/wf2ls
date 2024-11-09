let argv = require('minimist')(process.argv.slice(2));
let config = {
  sourceFile: "",
  destDir: ""
};
let data = {};

const loadArgsToConfig = (args) => {
  config.sourceFile = args.i;
  config.destDir = args.d;
}

const loadSrcFile = (fPath) => {
  const fs = require('fs');
  const rawData = fs.readFileSync(fPath);
  data = JSON.parse(rawData);
}
const main = () => {
  loadArgsToConfig(argv);
  loadSrcFile(config.sourceFile);
  // console.log(data[0].ch);
}

main();
