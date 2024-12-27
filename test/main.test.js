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
  describe('Acceptance tests', () => {
    describe('Basic Structure', () => {
      it('Multiple newlines within note text', () => {
        runAcceptTest('multiple_newlines_within_note_text');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it('Deeply nested bullets', () => {
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
      it.skip('H1', () => {
        runAcceptTest('bullet_type_h1');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('H2', () => {
        runAcceptTest('bullet_type_h2');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Paragraph', () => {
        runAcceptTest('bullet_type_p');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Board', () => {
        runAcceptTest('bullet_type_board');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Quote', () => {
        runAcceptTest('bullet_type_quote');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Codeblock', () => {
        runAcceptTest('bullet_type_codeblock');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
    });
    describe('Html -> Md Conversions', () => {
      describe('Text Formatting', () => {
        it.skip('Color Highlights', () => {
          runAcceptTest('text_color_highlights');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it.skip('Text color', () => {
          runAcceptTest('text_color');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it.skip('Bold Text', () => {
          runAcceptTest('text_bold');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it.skip('Underline Text', () => {
          runAcceptTest('text_underline');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it.skip('Italic Text', () => {
          runAcceptTest('text_italic');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
        it.skip('Strikethrough Text', () => {
          runAcceptTest('text_strikethrough');
          expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
        });
      });
      it.skip('Web Links', () => {
        runAcceptTest('web_link');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Inline Code', () => {
        runAcceptTest('inline_code');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Ampersat Tagging', () => {
        runAcceptTest('tagging_ampersat');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
      });
      it.skip('Date Tags', () => {
        runAcceptTest('dates');
        expect(testResults.pages.get("default")).to.equal(file(successTestOutput));
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
    });
  });
});
