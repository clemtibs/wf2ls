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
  readJsonFile,
  removeDirAndContents,
  resolveGraphRootDir,
  writeFile
} from '../src/fs.js';

describe('fs.js', () => {
  const testDirRoot = import.meta.dirname; // src/test/
  const testDir = testDirRoot + "/.tmp"; // src/test/.tmp
  const existingDir = testDir + "/here";
  const nonExistingDir = testDir + "/notHere";

  before(() => {
    makeDir(testDir);
  });
  after(() => {
    removeDirAndContents(testDir);
  });
  describe('directoryExists()', () => {
    before(() => {
      makeDir(existingDir);
    });
    after(() => {
      removeDirAndContents(existingDir);
    });
    it('Returns true for existing directory', () => {
      expect(directoryExists(existingDir)).to.be.true;
    });
    it('Returns false for non-existing directory', () => {
      expect(directoryExists(nonExistingDir)).to.be.false;
      expect(dir(nonExistingDir)).to.not.exist; // verify
    });
  });
  describe('fileExists()', () => {
    before(() => {
      makeDir(existingDir);
    });
    after(() => {
      removeDirAndContents(existingDir);
    });
    it('Returns true for existing file', () => {
      const existingFilePath = existingDir + "/tmpFile";
      expect(writeFile("data", "tmpFile", existingDir)).to.be.ok;
      expect(fileExists(existingFilePath)).to.be.true;
      expect(file(existingFilePath)).to.exist; // verify
    });
    it('Returns false for non-existing file', () => {
      const nonExistingFilePath = nonExistingDir + "/tmpFile";
      expect(fileExists(nonExistingFilePath)).to.be.false;
      expect(file(nonExistingFilePath)).to.not.exist; // verify
    });
  });
  describe('makeDir()', () => {
    after(() => {
      removeDirAndContents(existingDir);
    });
    it('Makes directory if it does not exist', () => {
      expect(dir(existingDir)).to.not.exist;
      expect(makeDir(existingDir)).to.be.ok;
      expect(dir(existingDir)).to.exist;
    });
    it('Throws error if directory already exists', () => {
      expect(dir(existingDir)).to.exist;
      expect(() => makeDir(existingDir)).to.throw(/already exists/);
      expect(dir(existingDir)).to.exist;
    });
    it('Throws error if destination is undefined', () => {
      expect(() => makeDir(undefined)).to.throw(/unknown error/);
    });
  });
  describe('readJsonFile()', () => {
    before(() => {
      makeDir(existingDir);
      writeFile('[{"key":"value"}]', "sampleJson", existingDir);
    });
    after(() => {
      removeDirAndContents(existingDir);
    });
    it('Reads and parses JSON file', () => {
      const testJsonData = readJsonFile(existingDir + "/sampleJson")
      expect(testJsonData[0].key).to.equal("value");
    });
  });
  describe('removeDirAndContents()', () => {
    it("Removes directory if it exists", () => {
      expect(dir(existingDir)).to.not.exist;
      expect(makeDir(existingDir)).to.be.ok;
      expect(removeDirAndContents(existingDir)).to.be.ok;
      expect(dir(existingDir)).to.not.exist;
    });
    it('Throws error if directory does not exist', () => {
      expect(dir(nonExistingDir)).to.not.exist;
      expect(() => removeDirAndContents(nonExistingDir)).to.throw(/doesn't exist/);
    });
    // Can't quite figure out how to make a file that can't be deleted for testing.
    it.skip('Throws error if directory removal fails for some other reason', () => {
      expect(dir(existingDir)).to.not.exist;
      expect(makeDir(existingDir)).to.be.ok;
      fs.chmod(existingDir, 0o000, (err) => { // this should do it...
        if (err) {
          return err;
        }
      });
      // this still works for some reason even though permissions were completely removed...
      expect(() => removeDirAndContents(existingDir)).to.throw(/unknown error/);
    });
  });
  describe('resolveGraphRootDir()', () => {
    const testRootDir = '/one/two/three';
    it('Always returns directory name without trailing slash regardless of input', () => {
      expect(resolveGraphRootDir(testRootDir)).to.equal(testRootDir);
      expect(resolveGraphRootDir(testRootDir + '/')).to.equal(testRootDir);
    });
    it('Returns parent dir when "assets","journals","logseq","pages", or "whiteboards" is given', () => {
      const graphSubDirs = [
        'assets',
        'journals',
        'logseq',
        'pages',
        'whiteboards'
      ]
      for (const d of graphSubDirs) {
        expect(resolveGraphRootDir(`${testRootDir}/${d}`)).to.equal(testRootDir);
      }
    });
  });
  describe('writeFile()', () => {
    before(() => {
      makeDir(existingDir);
    });
    after(() => {
      removeDirAndContents(existingDir);
    });
    it('Successfully writes a file when destDir does not end with /', () => {
      const testDir = existingDir
      expect(writeFile("data", "tmpFile", testDir)).to.be.ok;
      expect(file(testDir + "/tmpFile")).to.exist; // verify
    });
    it('Successfully writes a file when destDir ends with /', () => {
      const testDir = existingDir + "/";
      expect(writeFile("data", "tmpFile", testDir)).to.be.ok;
      expect(file(testDir + "tmpFile")).to.exist; // verify
    });
    it('Throws error when destination directory does not exist', () => {
      expect(() => writeFile("data", "tmpFile", nonExistingDir)).to.throw(/doesn't exist/);
      expect(dir(nonExistingDir)).to.not.exist; // verify
    });
  });
});
