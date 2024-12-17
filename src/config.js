class AppConfig {
  #option_values = {
    sourceFile: null,
    destDir: null,
    newPageTag: null,
    indentSpaces: null,
    defaultPage: null,
    confFileLocation: null
  };

  #option_types = {
    sourceFile: 'string',
    destDir: 'string',
    newPageTag: 'string',
    indentSpaces: 'number',
    defaultPage: 'string',
    confFileLocation: 'string',
  };

  constructor(config) {
    if (config) this.#option_values = { ...this.#option_values, ...config };
  }

  get(prop) {
    if (this.#option_values.hasOwnProperty(prop)) {
      return this.#option_values[prop]
    } else {
      throw new Error("Property not found");
    }
  }

  set(key, value) {
    if (this.#option_values.hasOwnProperty(key)) {
      if (typeof value === this.#option_types[key]) {
        return this.#option_values[key] = value;
      } else {
        throw new Error("Invalid property value type");
      }
    } else {
      throw new Error("Property not found");
    }
  }
}

const defaultConfig = {
  sourceFile: "",
  destDir: "./output",
  newPageTag: "#LS-Page",
  indentSpaces: 2,
  defaultPage: "Workflowy Imports",
  confFileLocation: "./config_file.json",
};

const updateConfigFromCliArgs = (appConf, args) => {
  if (args.i) appConf.set("sourceFile", args.i);
  if (args.d) appConf.set("destDir", args.d);
  if (args.c) appConf.set("confFileLocation", args.c);
}

const updateConfigFromFile = (appConf, rawConf) => {
  if (rawConf.sourceFile) appConf.set("sourceFile", rawConf.sourceFile);
  if (rawConf.destDir) appConf.set("destDir", rawConf.destDir);
  if (rawConf.newPagetag) appConf.set("newPageTag", rawConf.newPageTag);
  if (rawConf.indentSpaces) appConf.set("indentSpaces", rawConf.indentSpaces);
  if (rawConf.defaultPage) appConf.set("defaultPage", rawConf.defaultPage);
  // specifically omiting "confFileLocation". We got to a specific config file
  // from either defaultConfig, or a specific -c option on the CLI. No need to 
  // change this value AFTER the window has passed for loading config files, will
  // only mess up debugging.
}

export {
  AppConfig,
  defaultConfig,
  updateConfigFromCliArgs,
  updateConfigFromFile
};
