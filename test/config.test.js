import { expect } from 'chai';

import {
  AppConfig,
  updateConfigFromCliArgs,
  updateConfigFromFile
} from '../src/config.js';


describe('config.js', () => {
  describe('AppConfig instances', () => {
    describe('Have required properties', () => {
      const testConfig = new AppConfig();
      it('sourceFile', () => {
        expect(testConfig.get("sourceFile")).to.deep.equal(null);
      });
      it('destDir', () => {
        expect(testConfig.get("destDir")).to.deep.equal(null);
      });
      it('newPageTag', () => {
        expect(testConfig.get("newPageTag")).to.deep.equal(null);
      });
      it('indentSpaces', () => {
        expect(testConfig.get("indentSpaces")).to.deep.equal(null);
      });
      it('defaultPage', () => {
        expect(testConfig.get("defaultPage")).to.deep.equal(null);
      });
      it('confFileLocation', () => {
        expect(testConfig.get("confFileLocation")).to.deep.equal(null);
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
      it('setting indentSpaces as number', () => {
        expect(testConfig.set("indentSpaces", 1)).to.be.ok;
        expect(() => testConfig.set("indentSpaces", "a string")).to.throw(/property value type/);
      });
      it('setting sourceFile as string', () => {
        expect(testConfig.set("sourceFile", "a string")).to.be.ok;
        expect(() => testConfig.set("sourceFile", 1)).to.throw(/property value type/);
      });
      it('setting destDir as string', () => {
        expect(testConfig.set("destDir", "a string")).to.be.ok;
        expect(() => testConfig.set("destDir", 1)).to.throw(/property value type/);
      });
      it('setting newPageTag as string', () => {
        expect(testConfig.set("newPageTag", "a string")).to.be.ok;
        expect(() => testConfig.set("newPageTag", 1)).to.throw(/property value type/);
      });
      it('setting defaultPage as string', () => {
        expect(testConfig.set("defaultPage", "a string")).to.be.ok;
        expect(() => testConfig.set("defaultPage", 1)).to.throw(/property value type/);
      });
      it('setting confFileLocation as string', () => {
        expect(testConfig.set("confFileLocation", "a string")).to.be.ok;
        expect(() => testConfig.set("confFileLocation", 1)).to.throw(/property value type/);
      });
    });
    describe('Import configuration object on creation', () => {
      const conf = {
        sourceFile: "one",
        destDir: "two",
        newPageTag: "three",
        indentSpaces: 1,
        defaultPage: "four",
        confFileLocation: "five"
      };
      const testConfig = new AppConfig(conf);
      it('sourceFile not null', () => {
        expect(testConfig.get("sourceFile")).to.not.deep.equal(null);
      });
      it('destDir not null', () => {
        expect(testConfig.get("destDir")).to.not.deep.equal(null);
      });
      it('newPageTag not null', () => {
        expect(testConfig.get("newPageTag")).to.not.deep.equal(null);
      });
      it('indentSpaces not null', () => {
        expect(testConfig.get("indentSpaces")).to.not.deep.equal(null);
      });
      it('defaultPage not null', () => {
        expect(testConfig.get("defaultPage")).to.not.deep.equal(null);
      });
      it('confFileLocation not null', () => {
        expect(testConfig.get("confFileLocation")).to.not.deep.equal(null);
      });
    });
    describe('Can be updated with updateConfigFromCliArgs()', () => {
      const conf = {
        sourceFile: "sourceFile",
        destDir: "destDir",
        newPageTag: "newPageTag",
        indentSpaces: 1,
        defaultPage: "defaultPage",
        confFileLocation: "confFileLocation"
      };
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
        expect(testConfig.get("newPageTag")).to.deep.equal("newPageTag");
        expect(testConfig.get("indentSpaces")).to.deep.equal(1);
        expect(testConfig.get("defaultPage")).to.deep.equal("defaultPage");
      });
    });
    describe('Can be updated with updateConfigFromFile()', () => {
      const conf = {
        sourceFile: "sourceFile",
        destDir: "destDir",
        newPageTag: "newPageTag",
        indentSpaces: 1,
        defaultPage: "defaultPage",
        confFileLocation: "confFileLocation"
      };
      const testConfig = new AppConfig(conf);
      const testConfFromFile = {
        confFileLocation: "confFileLocation-changed",
        defaultPage: "defaultPage-changed",
        destDir: "destDir-changed",
        highlightStyle: "default", // enforced list of options
        newPageTag: "newPageTag-changed",
        indentSpaces: 2,
        sourceFile: "sourceFile-changed",
      }
      updateConfigFromFile(testConfig, testConfFromFile)
      it('Updates defaultPage', () => {
        expect(testConfig.get("defaultPage")).to.deep.equal("defaultPage-changed");
      });
      it('Updates destDir', () => {
        expect(testConfig.get("destDir")).to.deep.equal("destDir-changed");
      });
      it('Updates indentSpaces', () => {
        expect(testConfig.get("indentSpaces")).to.deep.equal(2);
      });
      it('Updates newPageTag', () => {
        expect(testConfig.get("newPageTag")).to.deep.equal("newPageTag-changed");
      });
      it('Does not update confFileLocation', () => {
        expect(testConfig.get("confFileLocation")).to.deep.equal("confFileLocation");
      });
      it('Updates sourceFile', () => {
        expect(testConfig.get("sourceFile")).to.deep.equal("sourceFile-changed");
      });
    });
  });
});
