class AppConfig {
  #option_values = {
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
  destDir: "",
  newPageTag: "#LS-Page",
  indentSpaces: 2,
  defaultPage: "Page One"
};

const updateConfigWithCliArgs = (conf, args) => {
  conf.set("sourceFile", args.i);
  conf.set("destDir", args.d);
}

export {
  AppConfig,
  defaultConfig,
  updateConfigWithCliArgs
};
