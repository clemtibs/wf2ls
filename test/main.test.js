import * as chai from 'chai';
import { default as chaiFiles } from 'chai-files';
chai.use(chaiFiles);
let expect = chai.expect;
let file = chaiFiles.file;
let dir = chaiFiles.dir;

import { main } from '../src/main.js';
import { AppState } from '../src/state.js';
import {
  AppConfig,
  defaultConfig
} from '../src/config.js';
import { readJsonFile } from '../src/fs.js';

const largeSampleDataLoc = "./test/data/wf_data_sample.json";
const acceptTestDir = "./test/acceptance/"


describe('main.js', () => {
    let testState;
    let testConfig;
    let testResults;
    let successTestOutput;

    const runAcceptTest = (testName) => {
      const inputFileName = acceptTestDir + testName + '.json';
      successTestOutput = acceptTestDir + testName + '.md';

      const testInputData = readJsonFile(inputFileName);
      testResults = main(testState, testConfig, testInputData);      
    }

    beforeEach(() => {
      testState = new AppState(undefined, true);
      testConfig = new AppConfig(defaultConfig)
      testConfig.set("defaultPage", "default");
      testResults = undefined;
      successTestOutput = undefined;
    });
  describe('main()', () => {
    it('Returns state object when testing', () => {
      testConfig.set("sourceFile", largeSampleDataLoc )
      const testData = readJsonFile(testConfig.get("sourceFile"));

      const testResults = main(testState, testConfig, testData);      
      expect(testResults).to.be.an.instanceOf(AppState);
    });
  });
  describe('Acceptance tests', () => {
    describe('Basic Structure', () => {
      it('Empty Note Name is skipped', () => {
        runAcceptTest('empty_name');
        expect(testResults.pages.get("default")).to.equal('\n');
      });
      it('Multiple newlines within note text', () => {
        runAcceptTest('multiple_newlines_within_note_text');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it('Deeply nested bullets', () => {
        testConfig.set("collapseMode", "none");
        runAcceptTest('deeply_nested_bullets');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Mirrors', () => {
        runAcceptTest('mirrors');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Links to nodes', () => {
        runAcceptTest('links_to_nodes');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
    });
    describe('Bullet Types', () => {
      it('Regular', () => {
        runAcceptTest('bullet_type_regular');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it('TODO', () => {
        runAcceptTest('bullet_type_todo');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it('TODO complete', () => {
        runAcceptTest('bullet_type_todo_complete');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it('H1', () => {
        runAcceptTest('bullet_type_h1');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it('H2', () => {
        runAcceptTest('bullet_type_h2');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it('Paragraph', () => {
        runAcceptTest('bullet_type_p');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Board', () => {
        runAcceptTest('bullet_type_board');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it('Quote', () => {
        runAcceptTest('bullet_type_quote');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it('Codeblock', () => {
        runAcceptTest('bullet_type_codeblock');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
    });
    describe('Html -> Md Conversions', () => {
      describe('Text Formatting', () => {
        describe('Color Highlights', () => {
          it('Default setting', () => {
            let testName = 'text_color_highlights';
            const inputFileName = acceptTestDir + testName + '.json';
            successTestOutput = acceptTestDir + testName + '_default' + '.md';

            testConfig.set("collapseMode", "none");
            const testInputData = readJsonFile(inputFileName);
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
          });
          it('Plugin setting', () => {
            let testName = 'text_color_highlights';
            const inputFileName = acceptTestDir + testName + '.json';
            successTestOutput = acceptTestDir + testName + '_plugin' + '.md';

            testConfig.set("collapseMode", "none");
            const testInputData = readJsonFile(inputFileName);
            testConfig.set("textColorMarkupMode", "plugin");
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
          });
        });
        describe('Text Color', () => {
          it('Default setting', () => {
            let testName = 'text_color';
            const inputFileName = acceptTestDir + testName + '.json';
            successTestOutput = acceptTestDir + testName + '_default' + '.md';

            testConfig.set("collapseMode", "none");
            const testInputData = readJsonFile(inputFileName);
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
          });
          it('Plugin setting', () => {
            let testName = 'text_color';
            const inputFileName = acceptTestDir + testName + '.json';
            successTestOutput = acceptTestDir + testName + '_plugin' + '.md';

            testConfig.set("collapseMode", "none");
            const testInputData = readJsonFile(inputFileName);
            testConfig.set("textColorMarkupMode", "plugin");
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
          });
        });
        it('Bold Text', () => {
          runAcceptTest('text_bold');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it('Underline Text', () => {
          runAcceptTest('text_underline');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it('Italic Text', () => {
          runAcceptTest('text_italic');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it('Strikethrough Text', () => {
          runAcceptTest('text_strikethrough');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
      });
      it('Web Links', () => {
        testConfig.set("collapseMode", "none");
        runAcceptTest('web_link');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it('Inline Code', () => {
        runAcceptTest('inline_code');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Ampersat Tagging', () => {
        runAcceptTest('tagging_ampersat');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      describe('Date & Time Tags', () => {
        it('Single Date', () => {
          runAcceptTest('dates');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it.skip('Date range', () => {
          runAcceptTest('dates_range');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it.skip('Dates with time', () => {
          runAcceptTest('dates_with_time');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it.skip('Dates with time range', () => {
          runAcceptTest('dates_with_time_range');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
      });
      describe('Bullet Collapsing', () => {
        it('Collapse top', () => {
          let testName = 'collapse_mode';
          const inputFileName = acceptTestDir + testName + '.json';
          successTestOutput = acceptTestDir + testName + '_top' + '.md';

          const testInputData = readJsonFile(inputFileName);
          testConfig.set("collapseMode", "top");
          testResults = main(testState, testConfig, testInputData);      
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it('Collapse none', () => {
          let testName = 'collapse_mode';
          const inputFileName = acceptTestDir + testName + '.json';
          successTestOutput = acceptTestDir + testName + '_none' + '.md';

          const testInputData = readJsonFile(inputFileName);
          testConfig.set("collapseMode", "none");
          testResults = main(testState, testConfig, testInputData);      
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it('Collapse all', () => {
          let testName = 'collapse_mode';
          const inputFileName = acceptTestDir + testName + '.json';
          successTestOutput = acceptTestDir + testName + '_all' + '.md';

          const testInputData = readJsonFile(inputFileName);
          testConfig.set("collapseMode", "all");
          testResults = main(testState, testConfig, testInputData);      
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        describe('Collapse shallow', () => {
          let testName = 'collapse_mode';
          const inputFileName = acceptTestDir + testName + '.json';
          it('collapseDepth = 3 (default)', () => {
            successTestOutput = acceptTestDir + testName + '_shallow_default' + '.md';
            const testInputData = readJsonFile(inputFileName);
            testConfig.set("collapseMode", "shallow");
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
          });
          it('collapseDepth = 1', () => {
            successTestOutput = acceptTestDir + testName + '_shallow_1' + '.md';
            const testInputData = readJsonFile(inputFileName);
            testConfig.set("collapseMode", "shallow");
            testConfig.set("collapseDepth", 1);
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
          });
          it('collapseDepth = 4', () => {
            successTestOutput = acceptTestDir + testName + '_shallow_4' + '.md';
            const testInputData = readJsonFile(inputFileName);
            testConfig.set("collapseMode", "shallow");
            testConfig.set("collapseDepth", 4);
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
          });
        });
      });
    });
    describe('Opinionated Re-organization & Translation', () => {
      it.skip('Tasks Lists', () => {
        runAcceptTest('task_lists');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Bookmarks', () => {
        runAcceptTest('bookmarks');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Tagging Conversions', () => {
        runAcceptTest('');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('File Uploads', () => {
        runAcceptTest('file_uploads');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Comments', () => {
        runAcceptTest('comments');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Templates', () => {
        runAcceptTest('templates');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
    });
    describe('Multiple Pages', () => {
      it('Single new page with new page tag in name', () => {
        let testName = 'single_new_page';
        let successTestOutputAlt1 = acceptTestDir + testName + '_1' + '.md';
        runAcceptTest(testName);
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        expect(testResults.pages.get("A New LogSeq Page")).to.equal(file(successTestOutputAlt1));
      });
      it('Nested, multiple new pages with new page tags in the notes', () => {
        let testName = 'nested_new_pages';
        let successTestOutputAlt1 = acceptTestDir + testName + '_1' + '.md';
        let successTestOutputAlt2 = acceptTestDir + testName + '_2' + '.md';
        testConfig.set("collapseMode", "none");
        runAcceptTest(testName);
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        expect(testResults.pages.get("A Nested New LogSeq Page")).to.equal(file(successTestOutputAlt1));
        expect(testResults.pages.get("Another New LogSeq Page Nested Deeper")).to.equal(file(successTestOutputAlt2));
      });
    });
    describe.skip('Journals', () => {
    });
    describe('Anomalies', () => {
      it.skip('Inline Code Ignores empty children', () => {
        runAcceptTest('inline_code');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Ascii "Arrows"', () => { // linkify stumbles on this one. These are rare but definitely are used.
        runAcceptTest('ascii_arrows');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
    });
  });
});
