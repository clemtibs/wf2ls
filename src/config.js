class AppConfig {
  #options = {
    sourceFile: null,
    destDir: null,
    newPageTag: null,
    indentSpaces: null,
    defaultPage: null,
  };

  #option_types = {
    sourceFile: 'string',
    destDir: 'string',
    newPageTag: 'string',
    indentSpaces: 'number',
    defaultPage: 'string',
  };

  constructor(config) {
    if (config) this.#options = { ...this.#options, ...config };
  }

  get(prop) {
    if (this.#options.hasOwnProperty(prop)) {
      return this.#options[prop]
    } else {
      throw new Error("Property not found");
    }
  }

  set(key, value) {
    if (this.#options.hasOwnProperty(key)) {
      if (typeof value === this.#option_types[key]) {
        return this.#options[key] = value;
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
  destDir: "",
  newPageTag: "#LS-Page",
  indentSpaces: 2,
  defaultPage: "Page One"
};

const loadArgsToConfig = (conf, args) => {
  conf.set("sourceFile", args.i);
  conf.set("destDir", args.d);
}

export {
  AppConfig,
  defaultConfig,
  loadArgsToConfig
};
