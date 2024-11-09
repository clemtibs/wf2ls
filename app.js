let argv = require('minimist')(process.argv.slice(2));
let config = {
  sourceFile: "",
  destDir: ""
};

const processArgs = (args) => {
  config.sourceFile = args.i;
  config.destDir = args.d;
}

const main = () => {
  processArgs(argv);
  console.log(config.sourceFile, config.destDir);
}

main();
