import { expect } from 'chai';

import { AppState } from '../src/state.js';
import { AppConfig } from '../src/config.js';
import { main } from '../src/main.js';
import { readJsonFile } from '../src/fs.js';

const largeSampleDataLoc = "./test/data/wf_data_sample.json";

describe('state.js', () => {
  describe('AppState instances', () => {
    const testState = new AppState(undefined, true);
    it('Has required properties', () => {
      expect(testState).to.have.all.keys('pages', 'mirrors', 'isTestInstance');
      expect(testState.pages).to.be.an.instanceOf(Map);
      expect(testState.mirrors).to.be.an.instanceOf(Map);
      expect(testState.addJob).to.be.an.instanceOf(Function);
      expect(testState.addPage).to.be.an.instanceOf(Function);
      expect(testState.incrementJobProgress).to.be.an.instanceOf(Function);
      expect(testState.startProgressBar).to.be.an.instanceOf(Function);
      expect(testState.stopProgressBar).to.be.an.instanceOf(Function);
    });
    it('Does not show internal properties', () => {
      expect(testState).to.not.have.all.keys('totalNumJobs', 'jobProgress', 'progressBar');
    });
    describe('Console output', () => {
      const testState = new AppState(undefined, true);
      it('Does not call progressBar methods' , () => {
        expect(testState.addJob()).to.be.undefined;
        expect(testState.startProgressBar()).to.be.undefined;
        expect(testState.incrementJobProgress()).to.be.undefined;
        expect(testState.stopProgressBar()).to.be.undefined;
      });
    });
    it('Returns state object when testing', () => {
      const testState = new AppState(undefined, true);
      const testSettings = {
        sourceFile: largeSampleDataLoc,
        destDir: "",
        newPageTag: "#LS-Page",
        indentSpaces: 2,
        defaultPage: "Page One"
      };
      const testConfig = new AppConfig(testSettings)
      const testData = readJsonFile(testConfig.get("sourceFile"));
      const results = main(testState, testConfig, testData);      
      expect(results).to.be.an.instanceOf(AppState);
    });
  });
});
