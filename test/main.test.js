import { expect } from 'chai';

import { main } from '../src/main.js';
import { AppState } from '../src/state.js';
import {
  AppConfig,
  defaultConfig
} from '../src/config.js';
import { readJsonFile } from '../src/fs.js';

const largeSampleData = "./test/data/wf_data_sample.json";

describe('main.js', () => {
  describe('main()', () => {
    it('Returns state object when testing', () => {
      const testState = new AppState(undefined, true);
      const testConfig = new AppConfig(defaultConfig)
      testConfig.set("defaultPage", "default");
      testConfig.set("collapseMode", "none");
      testConfig.set("sourceFile", largeSampleData )
      const testData = readJsonFile(testConfig.get("sourceFile"));

      const testResults = main(testState, testConfig, testData);      
      expect(testResults).to.be.an.instanceOf(AppState);
    });
  });
});
