import { expect } from 'chai';

import {
  AppConfig,
  updateConfigFromCliArgs,
  updateConfigFromFile
} from '../src/config.js';


describe('config.js', () => {
  const conf = {
    collapseMode: "collapseMode",
    collapseDepth: 1,
    confFileLocation: "confFileLocation",
    dateFormat: "dateFormat",
    defaultPage: "defaultPage",
    destDir: "destDir",
    textColorMarkupMode: "textColorMarkupMode",
    newPageTag: "newPageTag",
    indentSpaces: 1,
    sourceFile: "sourceFile",
    turndownConfig: {"turndown": "Config"},
    turndownCustomRules: {"turndown": "CustomRules"},
  };
  describe('AppConfig instances', () => {
    describe('Have required properties', () => {
      const testConfig = new AppConfig();
      Object.keys(conf).forEach((option) => {
        it(option, () => {
          expect(testConfig.get(option)).to.deep.equal(null);
        });
      });
    });
    describe('Throw errors on nonexistent keys', () => {
      const testConfig = new AppConfig();
      it('get()', () => {
        expect(() => testConfig.get("gibberish")).to.throw(/not found/);
      });
      it('set()', () => {
        expect(() => testConfig.set("gibberish")).to.throw(/not found/);
      });
    });
    describe('Enforces types', () => {
      const testConfig = new AppConfig();
      it('setting collapseMode as string', () => {
        expect(testConfig.set("collapseMode", "none")).to.be.ok;
        expect(() => testConfig.set("collapseMode", 1)).to.throw(/property value type/);
      });
      it('setting collapseDepth as number', () => {
        expect(testConfig.set("collapseDepth", 1)).to.be.ok;
        expect(() => testConfig.set("collapseDepth", "a string")).to.throw(/property value type/);
      });
      it('setting confFileLocation as string', () => {
        expect(testConfig.set("confFileLocation", "a string")).to.be.ok;
        expect(() => testConfig.set("confFileLocation", 1)).to.throw(/property value type/);
      });
      it('setting dateFormat as string', () => {
        expect(testConfig.set("dateFormat", "yyyy-MM-dd")).to.be.ok;
        expect(() => testConfig.set("dateFormat", 1)).to.throw(/property value type/);
      });
      it('setting defaultPage as string', () => {
        expect(testConfig.set("defaultPage", "a string")).to.be.ok;
        expect(() => testConfig.set("defaultPage", 1)).to.throw(/property value type/);
      });
      it('setting destDir as string', () => {
        expect(testConfig.set("destDir", "a string")).to.be.ok;
        expect(() => testConfig.set("destDir", 1)).to.throw(/property value type/);
      });
      it('setting textColorMarkupMode as string', () => {
        expect(testConfig.set("textColorMarkupMode", "default")).to.be.ok; // enforced list of options
        expect(() => testConfig.set("textColorMarkupMode", 1)).to.throw(/property value type/);
      });
      it('setting indentSpaces as number', () => {
        expect(testConfig.set("indentSpaces", 1)).to.be.ok;
        expect(() => testConfig.set("indentSpaces", "a string")).to.throw(/property value type/);
      });
      it('setting newPageTag as string', () => {
        expect(testConfig.set("newPageTag", "a string")).to.be.ok;
        expect(() => testConfig.set("newPageTag", 1)).to.throw(/property value type/);
      });
      it('setting sourceFile as string', () => {
        expect(testConfig.set("sourceFile", "a string")).to.be.ok;
        expect(() => testConfig.set("sourceFile", 1)).to.throw(/property value type/);
      });
      it('setting turndownConfig as object', () => {
        expect(testConfig.set("turndownConfig", { "an": "object"})).to.be.ok;
        expect(() => testConfig.set("turndownConfig", 1)).to.throw(/property value type/);
      });
    });
    describe('Enforces only allowed options', () => {
      const testConfig = new AppConfig();
      describe('collapseMode', () => {
        it('passes top, none, all, shallow', () => {
          expect(testConfig.set("collapseMode", "top")).to.be.ok;
          expect(testConfig.set("collapseMode", "none")).to.be.ok;
          expect(testConfig.set("collapseMode", "all")).to.be.ok;
          expect(testConfig.set("collapseMode", "shallow")).to.be.ok;
        });
        it('fails something else', () => {
          expect(() => testConfig.set("collapseMode", "something else")).to.throw(/Invalid option value/);
        });
      });
      describe('textColorMarkupMode', () => {
        it('passes default, plugin', () => {
          expect(testConfig.set("textColorMarkupMode", "default")).to.be.ok;
          expect(testConfig.set("textColorMarkupMode", "plugin")).to.be.ok;
        });
        it('fails something else', () => {
          expect(() => testConfig.set("textColorMarkupMode", "something else")).to.throw(/Invalid option value/);
        });
      });
      describe('dateFormat', () => {
        it('passes supported options', () => {
          expect(testConfig.set("dateFormat", "E, MM/dd/yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "E, MM-dd-yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "E, MM.dd.yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "E, yyyy/MM/dd")).to.be.ok;
          expect(testConfig.set("dateFormat", "EEE, MM/dd/yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "EEE, MM-dd-yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "EEE, MM.dd.yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "EEE, yyyy/MM/dd")).to.be.ok;
          expect(testConfig.set("dateFormat", "EEEE, MM/dd/yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "EEEE, MM-dd-yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "EEEE, MM.dd.yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "EEEE, yyyy/MM/dd")).to.be.ok;
          expect(testConfig.set("dateFormat", "MM-dd-yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "MM/dd/yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "MMM do, yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "MMMM do, yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "MM_dd_yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "dd-MM-yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "do MMM yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "do MMMM yyyy")).to.be.ok;
          expect(testConfig.set("dateFormat", "yyyy-MM-dd")).to.be.ok;
          expect(testConfig.set("dateFormat", "yyyy-MM-dd EEEE")).to.be.ok;
          expect(testConfig.set("dateFormat", "yyyy/MM/dd")).to.be.ok;
          expect(testConfig.set("dateFormat", "yyyyMMdd")).to.be.ok;
          expect(testConfig.set("dateFormat", "yyyy_MM_dd")).to.be.ok;
          expect(testConfig.set("dateFormat", "yyyy年MM月dd日")).to.be.ok;
        });
        it('fails something else', () => {
          expect(() => testConfig.set("dateFormat", "something else")).to.throw(/Invalid option value/);
        });
      });
    });
    describe('Import configuration object on creation', () => {
      const testConfig = new AppConfig(conf);
      Object.keys(conf).forEach((option) => {
        it(`${option} not null`, () => {
          expect(testConfig.get(option)).to.not.deep.equal(null);
        });
      });
    });
    describe('Can be updated with updateConfigFromCliArgs()', () => {
      const testConfig = new AppConfig(conf);
      const testCliArgs = {
        s: "sourceFile-changed",
        d: "destDir-changed",
        c: "confFileLocation-changed",
      }
      updateConfigFromCliArgs(testConfig, testCliArgs)

      it('Sucessfully updates', () => {
        expect(testConfig.get("sourceFile")).to.deep.equal("sourceFile-changed");
        expect(testConfig.get("destDir")).to.deep.equal("destDir-changed");
        expect(testConfig.get("confFileLocation")).to.deep.equal("confFileLocation-changed");
      });
      it('Only updates sourceFile, destDir, confFileLocation', () => {
        Object.entries(conf).forEach(([option, setting]) => {
          switch (option) {
            case 'sourceFile':
            case 'destDir':
            case 'confFileLocation':
              break;
            default:
              expect(testConfig.get(option)).to.deep.equal(setting);
          }
        });
      });
    });
    describe('Can be updated with updateConfigFromFile()', () => {
      const testConfig = new AppConfig(conf);
      const testConfFromFile = {
        collapseMode: "none", // enforced list of options
        collapseDepth: 2, // enforced list of options
        confFileLocation: "confFileLocation-changed",
        dateFormat: "MMMM do, yyyy", // enforced list of options
        defaultPage: "defaultPage-changed",
        destDir: "destDir-changed",
        textColorMarkupMode: "default", // enforced list of options
        newPageTag: "newPageTag-changed",
        indentSpaces: 2,
        sourceFile: "sourceFile-changed",
        turndownConfig: {"turndown": "Config-changed"},
        turndownCustomRules: {"turndown": "CustomRules-changed"},
      }
      updateConfigFromFile(testConfig, testConfFromFile)

      it('Does not update confFileLocation', () => {
        expect(testConfig.get("confFileLocation")).to.deep.equal("confFileLocation");
      });

      Object.entries(testConfFromFile).forEach(([option, setting]) => {
        switch (option) {
          case 'confFileLocation':
            break;
          default:
            it(`Updates ${option}`, () => {
              expect(testConfig.get(option)).to.deep.equal(setting);
            });
        }
      });
    });
  });
});
