const mainConfig = {
  sourceFile: "",
  destDir: "",
  newPageTag: "#LS-Page",
  indentSpaces: 2,
  defaultPage: "Page One"
};

const loadArgsToConfig = (conf, args) => {
  conf.sourceFile = args.i;
  conf.destDir = args.d;
  return conf;
}

export {
  mainConfig,
  loadArgsToConfig
};
