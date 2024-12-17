import { expect } from 'chai';

import { AppConfig } from '../src/config.js';


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
        defaultPage: "four"
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
    });
  });
});
