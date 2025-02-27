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
      testConfig.set("collapseMode", "none");
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
  // Unlike all the other tests which are defined inside their respective
  // files, these acceptance tests require actual json source files in the
  // 'test/acceptance' directory.
  describe('Acceptance tests', () => {
    describe('Basic Structure', () => {
      it('Empty Note Name is skipped', () => {
        runAcceptTest('empty_name');
        expect(testResults.getPage("default")).to.equal('\n');
      });
      it('Multiple newlines within note text', () => {
        runAcceptTest('multiple_newlines_within_note_text');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('Deeply nested bullets', () => {
        runAcceptTest('deeply_nested_bullets');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      describe('Mirrors', () => {
        let testName = 'mirrors';
        const inputFileName = acceptTestDir + testName + '.json';
        it('Converts reference style', () => {
            successTestOutput = acceptTestDir + testName + '_reference' + '.md';
            const testInputData = readJsonFile(inputFileName);
            testConfig.set("mirrorStyle", "reference");
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it('Converts embed style', () => {
            successTestOutput = acceptTestDir + testName + '_embed' + '.md';
            const testInputData = readJsonFile(inputFileName);
            testConfig.set("mirrorStyle", "embed");
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
      });
      it('Internal links to other WF nodes', () => {
        runAcceptTest('links_to_nodes');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      describe('Creation/Modification metadata', () => {
        it('Default setting (both off)', () => {
          let testName = 'metadata';
          const inputFileName = acceptTestDir + testName + '.json';
          successTestOutput = acceptTestDir + testName + '_default' + '.md';

          const testInputData = readJsonFile(inputFileName);
          testResults = main(testState, testConfig, testInputData);      
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it('Creation time only', () => {
          let testName = 'metadata';
          const inputFileName = acceptTestDir + testName + '.json';
          successTestOutput = acceptTestDir + testName + '_creation' + '.md';

          const testInputData = readJsonFile(inputFileName);
          testConfig.set('includeCreationMetadata', true)
          testResults = main(testState, testConfig, testInputData);      
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it('Modification time only', () => {
          let testName = 'metadata';
          const inputFileName = acceptTestDir + testName + '.json';
          successTestOutput = acceptTestDir + testName + '_modified' + '.md';

          const testInputData = readJsonFile(inputFileName);
          testConfig.set('includeCreationMetadata', false)
          testConfig.set('includeModifiedMetadata', true)
          testResults = main(testState, testConfig, testInputData);      
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it('Creation & Modification time on', () => {
          let testName = 'metadata';
          const inputFileName = acceptTestDir + testName + '.json';
          successTestOutput = acceptTestDir + testName + '_both_on' + '.md';

          const testInputData = readJsonFile(inputFileName);
          testConfig.set('includeCreationMetadata', true)
          testConfig.set('includeModifiedMetadata', true)
          testResults = main(testState, testConfig, testInputData);      
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
      });
    });
    describe('Bullet Types', () => {
      it('Regular', () => {
        runAcceptTest('bullet_type_regular');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('TODO', () => {
        runAcceptTest('bullet_type_todo');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('TODO complete', () => {
        runAcceptTest('bullet_type_todo_complete');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('H1', () => {
        runAcceptTest('bullet_type_h1');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('H2', () => {
        runAcceptTest('bullet_type_h2');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('Paragraph', () => {
        runAcceptTest('bullet_type_p');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('Board', () => {
        runAcceptTest('bullet_type_board');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('Quote', () => {
        runAcceptTest('bullet_type_quote');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('Codeblock', () => {
        runAcceptTest('bullet_type_codeblock');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
    });
    describe('Html -> Md Conversions', () => {
      describe('Text Formatting', () => {
        describe('Color Highlights', () => {
          it('Default setting', () => {
            let testName = 'text_color_highlights';
            const inputFileName = acceptTestDir + testName + '.json';
            successTestOutput = acceptTestDir + testName + '_default' + '.md';

            const testInputData = readJsonFile(inputFileName);
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.getPage("default")).to.equal(file(successTestOutput));
          });
          it('Plugin setting', () => {
            let testName = 'text_color_highlights';
            const inputFileName = acceptTestDir + testName + '.json';
            successTestOutput = acceptTestDir + testName + '_plugin' + '.md';

            const testInputData = readJsonFile(inputFileName);
            testConfig.set("textColorMarkupMode", "plugin");
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.getPage("default")).to.equal(file(successTestOutput));
          });
          it('Handles malformed spans with zero class membership or missing classes', () => {
            // A variety of malformed spans were found in some of my data. These
            // are bugs from Workflowy. These were color highlight spans that
            // either had zero class membership at all, or that were missing the
            // "colored" class.
            runAcceptTest('malformed_highlight_spans');
            expect(testResults.getPage("default")).to.equal(file(successTestOutput));
          });
        });
        describe('Text Color', () => {
          it('Default setting', () => {
            let testName = 'text_color';
            const inputFileName = acceptTestDir + testName + '.json';
            successTestOutput = acceptTestDir + testName + '_default' + '.md';

            const testInputData = readJsonFile(inputFileName);
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.getPage("default")).to.equal(file(successTestOutput));
          });
          it('Plugin setting', () => {
            let testName = 'text_color';
            const inputFileName = acceptTestDir + testName + '.json';
            successTestOutput = acceptTestDir + testName + '_plugin' + '.md';

            const testInputData = readJsonFile(inputFileName);
            testConfig.set("textColorMarkupMode", "plugin");
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.getPage("default")).to.equal(file(successTestOutput));
          });
        });
        it('Bold Text', () => {
          runAcceptTest('text_bold');
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it('Underline Text', () => {
          runAcceptTest('text_underline');
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it('Italic Text', () => {
          runAcceptTest('text_italic');
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it('Strikethrough Text', () => {
          runAcceptTest('text_strikethrough');
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
      });
      it('Web Links', () => {
        runAcceptTest('web_link');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('Inline Code', () => {
        runAcceptTest('inline_code');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('Ampersat Tagging', () => {
        runAcceptTest('tagging_ampersat');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      describe('Date & Time Tags', () => {
        it('Single Date', () => {
          runAcceptTest('dates');
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it.skip('Date range', () => {
          runAcceptTest('dates_range');
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it('Dates with time (12 hour)', () => {
          let testName = 'dates_with_time';
          const inputFileName = acceptTestDir + testName + '.json';
          successTestOutput = acceptTestDir + testName + '_12' + '.md';

          const testInputData = readJsonFile(inputFileName);
          testConfig.set('timeFormat', 'h:mm a');
          testResults = main(testState, testConfig, testInputData);      
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it('Dates with time (24 hour)', () => {
          let testName = 'dates_with_time';
          const inputFileName = acceptTestDir + testName + '.json';
          successTestOutput = acceptTestDir + testName + '_24' + '.md';

          const testInputData = readJsonFile(inputFileName);
          testResults = main(testState, testConfig, testInputData);      
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it.skip('Dates with time range', () => {
          runAcceptTest('dates_with_time_range');
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
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
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it('Collapse none', () => {
          let testName = 'collapse_mode';
          const inputFileName = acceptTestDir + testName + '.json';
          successTestOutput = acceptTestDir + testName + '_none' + '.md';

          const testInputData = readJsonFile(inputFileName);
          testConfig.set("collapseMode", "none");
          testResults = main(testState, testConfig, testInputData);      
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        it('Collapse all', () => {
          let testName = 'collapse_mode';
          const inputFileName = acceptTestDir + testName + '.json';
          successTestOutput = acceptTestDir + testName + '_all' + '.md';

          const testInputData = readJsonFile(inputFileName);
          testConfig.set("collapseMode", "all");
          testResults = main(testState, testConfig, testInputData);      
          expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        });
        describe('Collapse shallow', () => {
          let testName = 'collapse_mode';
          const inputFileName = acceptTestDir + testName + '.json';
          it('collapseDepth = 3 (default)', () => {
            successTestOutput = acceptTestDir + testName + '_shallow_default' + '.md';
            const testInputData = readJsonFile(inputFileName);
            testConfig.set("collapseMode", "shallow");
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.getPage("default")).to.equal(file(successTestOutput));
          });
          it('collapseDepth = 1', () => {
            successTestOutput = acceptTestDir + testName + '_shallow_1' + '.md';
            const testInputData = readJsonFile(inputFileName);
            testConfig.set("collapseMode", "shallow");
            testConfig.set("collapseDepth", 1);
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.getPage("default")).to.equal(file(successTestOutput));
          });
          it('collapseDepth = 4', () => {
            successTestOutput = acceptTestDir + testName + '_shallow_4' + '.md';
            const testInputData = readJsonFile(inputFileName);
            testConfig.set("collapseMode", "shallow");
            testConfig.set("collapseDepth", 4);
            testResults = main(testState, testConfig, testInputData);      
            expect(testResults.getPage("default")).to.equal(file(successTestOutput));
          });
        });
      });
    });
    describe('Opinionated Re-organization & Translation', () => {
      it.skip('Tasks Lists', () => {
        runAcceptTest('task_lists');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('Bookmarks', () => {
        testConfig.set("compressBookmarks", true)
        runAcceptTest('bookmarks');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it.skip('Tagging Conversions', () => {
        runAcceptTest('');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it.skip('File Uploads', () => {
        runAcceptTest('file_uploads');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it.skip('Comments', () => {
        runAcceptTest('comments');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('Templates', () => {
        runAcceptTest('templates');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it('Template buttons with ampersat (@)', () => {
        runAcceptTest('templates-with-ampersat');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
    });
    describe('Multiple Pages', () => {
      it('Single new page with new page tag in name', () => {
        let testName = 'single_new_page';
        let successTestOutputAlt1 = acceptTestDir + testName + '_1' + '.md';
        runAcceptTest(testName);
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        expect(testResults.getPage("A New LogSeq Page")).to.equal(file(successTestOutputAlt1));
      });
      it('Nested, multiple new pages with new page tags in the notes', () => {
        let testName = 'nested_new_pages';
        let successTestOutputAlt1 = acceptTestDir + testName + '_1' + '.md';
        let successTestOutputAlt2 = acceptTestDir + testName + '_2' + '.md';
        runAcceptTest(testName);
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
        expect(testResults.getPage("A Nested New LogSeq Page")).to.equal(file(successTestOutputAlt1));
        expect(testResults.getPage("Another New LogSeq Page Nested Deeper")).to.equal(file(successTestOutputAlt2));
      });
    });
    describe.skip('Journals', () => {
    });
    describe('Anomalies', () => {
      it('Email Addresses and Telephone Numbers', () => {
        runAcceptTest('various_protocols');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it.skip('Inline Code Ignores empty children', () => {
        runAcceptTest('inline_code');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
      it.skip('Ascii "Arrows"', () => { // linkify stumbles on this one. These are rare but definitely are used.
        runAcceptTest('ascii_arrows');
        expect(testResults.getPage("default")).to.equal(file(successTestOutput));
      });
    });
  });
});
