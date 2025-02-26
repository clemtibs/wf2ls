import { 
  turndownDefaultConfig,
  turndownDefaultCustomRules,
  turndownSpanPluginRules,
  turndownSpanDefaultRules
} from './md.js';

class AppConfig {
  #option_values = {
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

  #option_types = {
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

  #option_allowed_values = {
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
    if (this.#option_values.turndownCustomRules !== null) {
      const plugRules = turndownSpanPluginRules;
      const defRules = turndownSpanDefaultRules;
      switch (this.#option_values.textColorMarkupMode) {
        case 'plugin':
            if (this.#option_values.turndownCustomRules.hasOwnProperty('spanTextColor')) {
              this.#option_values.turndownCustomRules.spanTextColor = plugRules.spanTextColorPlugin;
            }
            if (this.#option_values.turndownCustomRules.hasOwnProperty('spanHighlight')) {
              this.#option_values.turndownCustomRules.spanHighlight = plugRules.spanHighlightPlugin;
            }
        break;
        case 'default':
            if (this.#option_values.turndownCustomRules.hasOwnProperty('spanTextColor')) {
              this.#option_values.turndownCustomRules.spanTextColor = defRules.spanTextColorDefault;
            }
            if (this.#option_values.turndownCustomRules.hasOwnProperty('spanHighlight')) {
              this.#option_values.turndownCustomRules.spanHighlight = defRules.spanHighlightDefault;
            }
        break;
      }

      // Inject the date format into the plugin
      if (this.#option_values.turndownCustomRules.hasOwnProperty('dates')) {
        const baseDateRule = this.#option_values.turndownCustomRules.dates.replacement;
        this.#option_values.turndownCustomRules.dates.replacement = (content, node, options) => {
          const dateFormatSetting = this.#option_values.dateFormat;
          return baseDateRule(content, node, options, dateFormatSetting);
        }
      }
    }
  }

  constructor(config) {
    if (config) this.#option_values = { ...this.#option_values, ...config };
    // This code for checking allowed values on instantiation works, but leaving
    // it alone until I really need it. Makes testing more difficult.
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
          case 'dateFormat':
          case 'timeFormat':
          case 'textColorMarkupMode':
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
