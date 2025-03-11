import fs from 'fs';

import * as chai from 'chai';
import { default as chaiFiles } from 'chai-files';
chai.use(chaiFiles);
let expect = chai.expect;
let file = chaiFiles.file;
let dir = chaiFiles.dir;

import {
  directoryExists,
  fileExists,
  makeDir,
  removeDirAndContents,
  writeFile
} from '../src/fs.js';
import { cliWrapper } from '../src/wf2ls.js';

// The goal of these tests are to ensure the behavior of the CLI entrypoint
// regarding configuration loading and writing files to the filesystem. The
// content from markdown conversion is tested in 'acceptance.test.js', and full
// configuration options in 'config.test.js'.
const testDirRoot = import.meta.dirname; // src/test/
const inputDataSample = `${testDirRoot}/data/wf_data_sample.json`;
const tmpTestDir = testDirRoot + "/.tmp"; // src/test/.tmp
const testGraphRoot = tmpTestDir + "/testGraphRoot"; // src/test/.tmp/testGraphRoot
let configFilePath = tmpTestDir + "/config.json";
const mockCliArgs = [
  'wf2ls.test'
]

describe('wf2ls.js', () => {
  beforeEach(() => {
    if (!fileExists(tmpTestDir)) makeDir(tmpTestDir);
    process.chdir(tmpTestDir);
  });
  afterEach(() => {
    removeDirAndContents(tmpTestDir);
  });
  describe('Configuration Precedence', () => {
    beforeEach(() => {
      makeDir(testGraphRoot);
    });
    afterEach(() => {
      removeDirAndContents(testGraphRoot);
      if (fileExists(configFilePath)) removeDirAndContents(configFilePath);
    });
    it('Loads internal default configuration first', () => {
      // After succesfull init, default value of sourceFile changes from null
      // to empty string, so this should throw the "No source" error.
      expect(() => cliWrapper(mockCliArgs)).to.throw(/No source file given/);
    });
    it('Finds and loads custom config file in source root if present', () => {
      // SourceFile is empty string first, so should throw error
      expect(() => cliWrapper(mockCliArgs)).to.throw(/No source file given/);
      // Create config at default location: ./config.json
      const defaultUserConf = {
        "destDir": testGraphRoot,
        "sourceFile": inputDataSample 
      }
      writeFile(JSON.stringify(defaultUserConf), 'config.json', tmpTestDir);
      expect(file(configFilePath)).to.exist; // verify

      // We'll have a successful run in a new location if it found the config
      let { testConfig } = cliWrapper(mockCliArgs);
      expect(testConfig.get('destDir')).to.equal(testGraphRoot);
    });
    it('Overrides default config with custom config file', () => {
      // SourceFile is empty string first, so should throw error
      expect(() => cliWrapper(mockCliArgs)).to.throw(/No source file given/);
      // Create failing config at default location: ./config.json
      const failingDefaultUserConf = {
        "destDir": '',
        "sourceFile": ''
      }
      writeFile(JSON.stringify(failingDefaultUserConf), 'config.json', tmpTestDir);
      expect(file(configFilePath)).to.exist; // verify
      // Make sure it fails
      expect(() => cliWrapper(mockCliArgs)).to.throw(/No source file given/);

      // Create passing config at default location: ./passingConfig.json
      const passingDefaultUserConf = {
        "destDir": testGraphRoot,
        "sourceFile": inputDataSample,
        "defaultPage": 'New Pages'
      }
      writeFile(JSON.stringify(passingDefaultUserConf), 'passingConfig.json', tmpTestDir);
      expect(file(tmpTestDir + "/passingConfig.json")).to.exist; // verify

      const passingMockCliArgs = [...mockCliArgs]
      passingMockCliArgs.push('-c', `${tmpTestDir}/passingConfig.json`)

      // We'll have a successful run with defaultPage set
      let { testConfig } = cliWrapper(passingMockCliArgs);
      expect(testConfig.get('defaultPage')).to.equal('New Pages');
    });
    it('"-s" and "-d" options override custom config file', () => {
      // SourceFile is empty string first, so should throw error
      expect(() => cliWrapper(mockCliArgs)).to.throw(/No source file given/);
      // Create failing config at default location: ./config.json
      const failingDefaultUserConf = {
        "destDir": '',
        "sourceFile": '',
        "defaultPage": 'New Pages'
      }
      writeFile(JSON.stringify(failingDefaultUserConf), 'config.json', tmpTestDir);
      expect(file(configFilePath)).to.exist; // verify
      // Make sure it fails
      expect(() => cliWrapper(mockCliArgs)).to.throw(/No source file given/);

      // Create another failing config at default location: ./failingCustomConfig.json
      const failingCustomUserConf = {
        "destDir": './changed',
        "sourceFile": './doesNotExist',
        "defaultPage": 'Newer Pages'
      }
      writeFile(JSON.stringify(failingCustomUserConf), 'failingCustomConfig.json', tmpTestDir);
      expect(file(tmpTestDir + "/failingCustomConfig.json")).to.exist; // verify

      const failingMockCliArgs = [...mockCliArgs]
      failingMockCliArgs.push('-c', `${tmpTestDir}/failingCustomConfig.json`)

      // Make sure it fails
      expect(() => cliWrapper(failingMockCliArgs)).to.throw(/Can't find file/);

      // finally, specify the passing sourceFile and destDir locations via CLI
      const passingMockCliArgs = [...failingMockCliArgs]
      passingMockCliArgs.push('-s', inputDataSample)
      passingMockCliArgs.push('-d', testGraphRoot)

      // We'll have a successful run with defaultPage representing the newest change.
      let { testConfig } = cliWrapper(passingMockCliArgs);
      expect(testConfig.get('defaultPage')).to.equal('Newer Pages');
    });
  });
  describe('Configuration Checks', () => {
    it("Resolves relative default confFile path", () => {
      const defaultUserConf = {
        "destDir": testGraphRoot,
        "sourceFile": inputDataSample 
      }
      writeFile(JSON.stringify(defaultUserConf), 'config.json', tmpTestDir);
      expect(file(configFilePath)).to.exist; // verify

      let { testConfig } = cliWrapper(mockCliArgs);
      expect(testConfig.get('confFileLocation')).to.match(/^.*\/config\.json$/);
      expect(testConfig.get('confFileLocation')).to.not.match(/^\.\/config\.json$/);
    });
    it("Throws error when can't find custom confFile", () => {
      const failingMockCliArgs = [...mockCliArgs]
      failingMockCliArgs.push('-c', `${tmpTestDir}/confNotHere.json`)

      expect(file(`${tmpTestDir}/confNotHere.json`)).to.not.exist; // verify
      expect(() => cliWrapper(failingMockCliArgs)).to.throw(/Can't find file/);
    });
    it("Resolves relative sourceFile path", () => {
      const defaultUserConf = {
        "destDir": testGraphRoot,
        "sourceFile": '../data/wf_data_sample.json' 
      }
      writeFile(JSON.stringify(defaultUserConf), 'config.json', tmpTestDir);
      expect(file(configFilePath)).to.exist; // verify

      let { testConfig } = cliWrapper(mockCliArgs);
      expect(testConfig.get('sourceFile')).to.match(/^\/(.+)\/data\/wf_data_sample\.json$/);
      expect(testConfig.get('sourceFile')).to.not.match(/^\.\.\/data\/wf_data_sample\.json$/);
    });
    it("Throws error when can't find sourceFile", () => {
      const failingMockCliArgs = [...mockCliArgs]
      failingMockCliArgs.push('-s', `${tmpTestDir}/sourceNotHere.json`)

      expect(file(`${tmpTestDir}/sourceNotHere.json`)).to.not.exist; // verify
      expect(() => cliWrapper(failingMockCliArgs)).to.throw(/Can't find file/);
    });
    it("Resolves relative custom confFile path", () => {
      const passingDefaultUserConf = {
        "destDir": testGraphRoot,
        "sourceFile": inputDataSample
      }
      writeFile(JSON.stringify(passingDefaultUserConf), 'passingConfig.json', tmpTestDir);
      expect(file(tmpTestDir + "/passingConfig.json")).to.exist; // verify

      const passingMockCliArgs = [...mockCliArgs]
      passingMockCliArgs.push('-c', `./passingConfig.json`)

      let { testConfig } = cliWrapper(passingMockCliArgs);
      expect(testConfig.get('confFileLocation')).to.match(/^.*\/passingConfig\.json$/);
      expect(testConfig.get('confFileLocation')).to.not.match(/^\.\/passingConfig\.json$/);
    });
  });
  describe('Writing Files', () => {
    it('Makes all graph directories if missing', () => {
      expect(dir(testGraphRoot)).to.not.exist; // verify

      const passingMockCliArgs = [...mockCliArgs]
      passingMockCliArgs.push('-s', inputDataSample)
      passingMockCliArgs.push('-d', testGraphRoot)

      // let { testConfig } = cliWrapper(passingMockCliArgs);
      expect(() => cliWrapper(passingMockCliArgs)).to.not.throw();

      expect(dir(testGraphRoot)).to.exist; // verify
      expect(dir(`${testGraphRoot}/pages`)).to.exist; // verify
      expect(dir(`${testGraphRoot}/journals`)).to.exist; // verify
    });
    it('Reuses all graph directories if has existing content', () => {
      expect(dir(testGraphRoot)).to.not.exist; // verify

      // First pass to create initial content
      const passingMockCliArgs = [...mockCliArgs]
      passingMockCliArgs.push('-s', inputDataSample)
      passingMockCliArgs.push('-d', testGraphRoot)

      // let { testConfig } = cliWrapper(passingMockCliArgs);
      expect(() => cliWrapper(passingMockCliArgs)).to.not.throw();

      expect(dir(testGraphRoot)).to.exist; // verify
      expect(dir(`${testGraphRoot}/pages`)).to.exist; // verify
      expect(dir(`${testGraphRoot}/journals`)).to.exist; // verify
      expect(fs.readdirSync(`${testGraphRoot}/pages`).length).to.equal(4);

      // Second pass
      // Create passing config at default location: ./config.json
      const passingDefaultUserConf = {
        "destDir": testGraphRoot,
        "sourceFile": inputDataSample,
        "defaultPage": 'New Page' // <-- this page will be added to the first pass
      }

      writeFile(JSON.stringify(passingDefaultUserConf), 'config.json', tmpTestDir);
      expect(file(tmpTestDir + "/config.json")).to.exist; // verify

      // Will dectect new config.json in default location automatically
      expect(() => cliWrapper(passingMockCliArgs)).to.not.throw();

      expect(dir(testGraphRoot)).to.exist; // verify
      expect(dir(`${testGraphRoot}/pages`)).to.exist; // verify
      expect(dir(`${testGraphRoot}/journals`)).to.exist; // verify
      expect(fs.readdirSync(`${testGraphRoot}/pages`).length).to.equal(5);
    });
    it.skip('Writes journal data to graphRoot/journals', () => {
    });
    it.skip('Writes all other pages to graphRoot/pages', () => {
    });
  });
});
