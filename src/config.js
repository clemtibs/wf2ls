import { 
  turndownDefaultConfig,
  turndownDefaultCustomRules,
  turndownSpanPluginRules,
  turndownSpanDefaultRules
} from './md.js';

class AppConfig {
  #optionValues = {
    collapseMode: null,
    collapseDepth: null,
    compressBookmarks: null,
    confFileLocation: null,
    dateFormat: null,
    defaultPage: null,
    destDir: null,
    textColorMarkupMode: null,
    includeCreationMetadata: null,
    includeModifiedMetadata: null,
    indentSpaces: null,
    mirrorStyle: null,
    newPageTag: null,
    sourceFile: null,
    timeFormat: null,
    turndownConfig: null,
    turndownCustomRules: null,
  };

  #optionTypes = {
    collapseMode: "string",
    collapseDepth: "number",
    compressBookmarks: 'boolean',
    confFileLocation: 'string',
    dateFormat: 'string',
    defaultPage: 'string',
    destDir: 'string',
    textColorMarkupMode: 'string',
    includeCreationMetadata: 'boolean',
    includeModifiedMetadata: 'boolean',
    indentSpaces: 'number',
    mirrorStyle: 'string',
    newPageTag: 'string',
    sourceFile: 'string',
    timeFormat: 'string',
    turndownConfig: 'object',
    turndownCustomRules: 'object',
  };

  #optionAllowedValues = {
    collapseMode: [
      'top',
      'none',
      'all',
      'shallow',
    ],
    dateFormat: [
      'E, MM/dd/yyyy',
      'E, MM-dd-yyyy',
      'E, MM.dd.yyyy',
      'E, yyyy/MM/dd',
      'EEE, MM/dd/yyyy',
      'EEE, MM-dd-yyyy',
      'EEE, MM.dd.yyyy',
      'EEE, yyyy/MM/dd',
      'EEEE, MM/dd/yyyy',
      'EEEE, MM-dd-yyyy',
      'EEEE, MM.dd.yyyy',
      'EEEE, yyyy/MM/dd',
      'MM-dd-yyyy',
      'MM/dd/yyyy',
      'MMM do, yyyy',
      'MMMM do, yyyy',
      'MM_dd_yyyy',
      'dd-MM-yyyy',
      'do MMM yyyy',
      'do MMMM yyyy',
      'yyyy-MM-dd',
      'yyyy-MM-dd EEEE',
      'yyyy/MM/dd',
      'yyyyMMdd',
      'yyyy_MM_dd',
      'yyyy年MM月dd日',
    ],
    mirrorStyle: ['embed', 'reference'],
    textColorMarkupMode: ['default', 'plugin'],
    timeFormat: [
      'HH:mm',
      'H:mm',
      'h:mm A',
      'h:mm a',
      'X',
      'x',
    ]
  };

  #updateTurndownCustomRules() {
    if (this.#optionValues.turndownCustomRules !== null) {
      const plugRules = turndownSpanPluginRules;
      const defRules = turndownSpanDefaultRules;
      switch (this.#optionValues.textColorMarkupMode) {
        case 'plugin':
            if (this.#optionValues.turndownCustomRules.hasOwnProperty('spanTextColor')) {
              this.#optionValues.turndownCustomRules.spanTextColor = plugRules.spanTextColorPlugin;
            }
            if (this.#optionValues.turndownCustomRules.hasOwnProperty('spanHighlight')) {
              this.#optionValues.turndownCustomRules.spanHighlight = plugRules.spanHighlightPlugin;
            }
        break;
        case 'default':
            if (this.#optionValues.turndownCustomRules.hasOwnProperty('spanTextColor')) {
              this.#optionValues.turndownCustomRules.spanTextColor = defRules.spanTextColorDefault;
            }
            if (this.#optionValues.turndownCustomRules.hasOwnProperty('spanHighlight')) {
              this.#optionValues.turndownCustomRules.spanHighlight = defRules.spanHighlightDefault;
            }
        break;
      }

      // Inject the date and time format into the plugin
      if (this.#optionValues.turndownCustomRules.hasOwnProperty('dates')) {
        const baseDateRule = this.#optionValues.turndownCustomRules.dates.replacement;
        this.#optionValues.turndownCustomRules.dates.replacement = (...args) => {
          return baseDateRule( ...args, this.#optionValues.dateFormat, this.#optionValues.timeFormat);
        }
      }
    }
  }

  constructor(config) {
    if (config) this.#optionValues = { ...this.#optionValues, ...config };
    // This code for checking allowed values on instantiation works, but leaving
    // it alone until I really need it. Makes testing more difficult.
    //
    // for (let key in this.#optionAllowedValues) {
      // if (!this.#optionAllowedValues[key].includes(this.#optionValues[key])) {
            // throw new Error(`Invalid option value: "${this.#optionValues[key]}" for "${key}"`);
      // }
    // }
    this.#updateTurndownCustomRules();
  }

  get(prop) {
    if (this.#optionValues.hasOwnProperty(prop)) {
      return this.#optionValues[prop];
    } else {
      throw new Error("Property not found");
    }
  }

  set(key, value) {
    if (this.#optionValues.hasOwnProperty(key)) {
      if (typeof value === this.#optionTypes[key]) {
        if (this.#optionAllowedValues.hasOwnProperty(key) &&
            !this.#optionAllowedValues[key].includes(value)) {
              throw new Error(`Invalid option value: "${value}" for "${key}"`);
        }
        switch (key) {
          case 'dateFormat':
          case 'timeFormat':
          case 'textColorMarkupMode':
            this.#optionValues[key] = value;
            this.#updateTurndownCustomRules();
            return true;
            break;
          default:
            return this.#optionValues[key] = value;
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
  collapseMode: "top",
  collapseDepth: 3,
  compressBookmarks: false,
  confFileLocation: "./config.json",
  dateFormat: 'yyyy-MM-dd',
  defaultPage: "Workflowy Imports",
  destDir: "./output",
  textColorMarkupMode: "default",
  includeCreationMetadata: false,
  includeModifiedMetadata: false,
  indentSpaces: 2,
  mirrorStyle: "embed",
  newPageTag: "#LS-Page",
  sourceFile: "",
  timeFormat: 'HH:mm',
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
  for (const [option, value] of Object.entries(rawConf)) {
    if (option !== 'confFileLocation') {
      try {
        appConf.set(option, value);
      } catch {
        throw new Error(`"${option}" is an invalid configuration option.\nDouble check user config file.`);
      }
    }
  }
}

export {
  AppConfig,
  defaultConfig,
  updateConfigFromCliArgs,
  updateConfigFromFile
};
