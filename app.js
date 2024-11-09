let argv = require('minimist')(process.argv.slice(2));
let config = {
  sourceFile: "",
  destDir: ""
};
let data = {};

const processArgs = (args) => {
  config.sourceFile = args.i;
  config.destDir = args.d;
}

const processSrcFile = (fPath) => {
  const fs = require('fs');
  const rawData = fs.readFileSync(fPath);
  data = JSON.parse(rawData);
}
const main = () => {
  processArgs(argv);
  processSrcFile(config.sourceFile);
  // console.log(data[0].ch);
}

main();
