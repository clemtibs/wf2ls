import { 
  turndownDefaultConfig,
  turndownDefaultCustomRules,
  turndownDefaultSpanHighlightRules
} from './md.js';

class AppConfig {
  #option_values = {
    confFileLocation: null,
    defaultPage: null,
    destDir: null,
    highlightStyle: null,
    indentSpaces: null,
    newPageTag: null,
    sourceFile: null,
    turndownConfig: null,
    turndownCustomRules: null,
  };

  #option_types = {
    confFileLocation: 'string',
    defaultPage: 'string',
    destDir: 'string',
    highlightStyle: 'string',
    indentSpaces: 'number',
    newPageTag: 'string',
    sourceFile: 'string',
    turndownConfig: 'object',
    turndownCustomRules: 'object',
  };

  #option_allowed_values = {
    highlightStyle: ['default', 'plugin']
  };

  #updateTurndownCustomRules = () => {
    const tdHlOpts = turndownDefaultSpanHighlightRules;
    if (this.#option_values.highlightStyle === 'plugin') {
      if (this.#option_values.turndownCustomRules !== null &&
          this.#option_values.turndownCustomRules.hasOwnProperty('spanHighlight')) {
            this.#option_values.turndownCustomRules.spanHighlight = tdHlOpts.spanHighlightPlugin;
      }
    }
  }

  constructor(config) {
    if (config) this.#option_values = { ...this.#option_values, ...config };
    // This code for checking allowed values on instantiation works, but leaving
    // it alone until I really need it.
    //
    // for (let key in this.#option_allowed_values) {
      // if (!this.#option_allowed_values[key].includes(this.#option_values[key])) {
            // throw new Error(`Invalid option value: "${this.#option_values[key]}" for "${key}"`);
      // }
    // }
    this.#updateTurndownCustomRules();
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
        if (this.#option_allowed_values.hasOwnProperty(key) &&
            !this.#option_allowed_values[key].includes(value)) {
              throw new Error(`Invalid option value: "${value}" for "${key}"`);
        }
        switch (key) {
          case 'highlightStyle':
            this.#option_values[key] = value;
            this.#updateTurndownCustomRules();
            return true;
            break;
          default:
            return this.#option_values[key] = value;
        }
      } else {
        throw new Error("Invalid property value type");
      }
    } else {
      throw new Error("Property not found");
    }
  }
}

const defaultConfig = {
  confFileLocation: "./config.json",
  defaultPage: "Workflowy Imports",
  destDir: "./output",
  highlightStyle: "default",
  indentSpaces: 2,
  newPageTag: "#LS-Page",
  sourceFile: "",
  turndownConfig: turndownDefaultConfig,
  turndownCustomRules: turndownDefaultCustomRules,
};

const updateConfigFromCliArgs = (appConf, args) => {
  if (args.s) appConf.set("sourceFile", args.s);
  if (args.d) appConf.set("destDir", args.d);
  if (args.c) appConf.set("confFileLocation", args.c);
}

const updateConfigFromFile = (appConf, rawConf) => {
  // specifically omiting "confFileLocation". We got to a specific config file
  // from either defaultConfig, or a specific -c option on the CLI. No need to 
  // change this value AFTER the window has passed for loading config files, will
  // only mess up debugging.
  if (rawConf.defaultPage) appConf.set("defaultPage", rawConf.defaultPage);
  if (rawConf.destDir) appConf.set("destDir", rawConf.destDir);
  if (rawConf.highlightStyle) appConf.set("highlightStyle", rawConf.highlightStyle);
  if (rawConf.indentSpaces) appConf.set("indentSpaces", rawConf.indentSpaces);
  if (rawConf.newPageTag) appConf.set("newPageTag", rawConf.newPageTag);
  if (rawConf.sourceFile) appConf.set("sourceFile", rawConf.sourceFile);
  if (rawConf.turndownConfig) appConf.set("turndownConfig", rawConf.turndownConfig);
  if (rawConf.turndownCustomRules) appConf.set("turndownCustomRules", rawConf.turndownCustomRules);
}

export {
  AppConfig,
  defaultConfig,
  updateConfigFromCliArgs,
  updateConfigFromFile
};
