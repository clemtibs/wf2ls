import { expect } from 'chai';

import {
  AppConfig,
  defaultConfig
} from '../src/config.js';
import { convertHtmlToMd } from '../src/md.js';

describe('md.js', () => {
  let testConfig;
  beforeEach(() => {
    testConfig = new AppConfig(defaultConfig)
  });
  describe('convertHtmlToMd()', () => {
    describe('Handles HTML Reserved Characters', () => {
      it.skip('Greater-than', () => { // an issue with turndown, see: https://github.com/mixmark-io/turndown/issues/395 
        let testContentPass = '&gt;'
        let testContentPassResult = '>'
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
      it('Less-than', () => {
        let testContentPass = '&lt;'
        let testContentPassResult = '<'
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
      it('Ampersand', () => {
        let testContentPass = '&amp;'
        let testContentPassResult = '&'
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
      it('Apostrophe', () => {
        let testContentPass = '&apos;'
        let testContentPassResult = "'"
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
      it('Quotation Mark', () => {
        let testContentPass = '&quot;'
        let testContentPassResult = '"'
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
    });
    it('Preserves newlines outside of html content', () => {
      let testContentPass = '\nNon-html filler\n<a href="https://www.example.com">Example.com</a>\nmore filler'
      let testContentPassResult = '\nNon-html filler\n[Example.com](https://www.example.com)\nmore filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
    });
    it('Anchors', () => { // for more rigourous test examples, see acceptance tests in main.test.js 
      let testContentPass = 'Non-html filler <a href="https://www.example.com">Example.com</a> more filler'
      let testContentPassResult = 'Non-html filler [Example.com](https://www.example.com) more filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
    });
    it('Bold text', () => {
      let testContentPass = 'Non-html filler <b>bold text</b> more filler'
      let testContentPassResult = 'Non-html filler **bold text** more filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
    });
    it('Underline text', () => {
      let testContentPass = 'Non-html filler <u>underline text</u> more filler'
      let testContentPassResult = 'Non-html filler <u>underline text</u> more filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
    });
    it('Italic text', () => {
      let testContentPass = 'Non-html filler <i>italic text</i> more filler'
      let testContentPassResult = 'Non-html filler _italic text_ more filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
    });
    it('Strike-through text', () => {
      let testContentPass = 'Non-html filler <s>strike-through text</s> more filler'
      let testContentPassResult = 'Non-html filler ~~strike-through text~~ more filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
    });
    it('Color highlight', () => {
      // testing subset of default conversions for simplicify. For complete
      // testing of all colors and plugins, see acceptance tests in
      // main.test.js
      let testContentPass = 'Non-html filler <span class=\"colored bc-red\">red highlight</span> more filler'
      let testContentPassResult = 'Non-html filler [[#red]]==red highlight== more filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);

      testContentPass = 'Non-html filler <span class=\"colored bc-yellow\">yellow highlight</span> more filler'
      testContentPassResult = 'Non-html filler ==yellow highlight== more filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);

      testContentPass = 'Non-html filler <span class=\"colored bc-green\">green highlight</span> more filler'
      testContentPassResult = 'Non-html filler [[#green]]==green highlight== more filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);

      testContentPass = 'Non-html filler <span class=\"colored bc-blue\">blue highlight</span> more filler'
      testContentPassResult = 'Non-html filler [[#blue]]==blue highlight== more filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
    });
    it('Color text', () => {
      // testing subset of default conversions for simplicify. For complete
      // testing of all colors and plugins, see acceptance tests in
      // main.test.js
      let testContentPass = 'Non-html filler <span class=\"colored c-red\">red text</span> more filler'
      let testContentPassResult = 'Non-html filler [[$red]]==red text== more filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);

      testContentPass = 'Non-html filler <span class=\"colored c-green\">green text</span> more filler'
      testContentPassResult = 'Non-html filler [[$green]]==green text== more filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);

      testContentPass = 'Non-html filler <span class=\"colored c-blue\">blue text</span> more filler'
      testContentPassResult = 'Non-html filler [[$blue]]==blue text== more filler'
      expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
    });
    describe('Internal Workflowy links', () => {
      let linkHtml;
      let linkHtmlResult;
      let fillerPre = 'Non-html filler';
      let fillerPost = 'more filler'; 
      it('Makes MD link with innerHTML when present', () => {
        linkHtml = '<a href=\"https://workflowy.com/#/982e8186ff23\">Link text here</a>';
        linkHtmlResult = '[Link text here](982e8186ff23)';
        let testContentPass = `${fillerPre} ${linkHtml} ${fillerPost}`;
        let testContentPassResult = `${fillerPre} ${linkHtmlResult} ${fillerPost}`;
        expect(convertHtmlToMd(testConfig, linkHtml)).to.deep.equal(linkHtmlResult);
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
      it('Uses a block reference when innerHTML is not present', () => {
        linkHtml = '<a href=\"https://workflowy.com/#/982e8186ff23\"></a>';
        linkHtmlResult = '((982e8186ff23))';
        let testContentPass = `${fillerPre} ${linkHtml} ${fillerPost}`;
        let testContentPassResult = `${fillerPre} ${linkHtmlResult} ${fillerPost}`;
        expect(convertHtmlToMd(testConfig, linkHtml)).to.deep.equal(linkHtmlResult);
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
      it('Uses a block reference when innerHTML is same as href', () => {
        linkHtml = '<a href=\"https://workflowy.com/#/982e8186ff23\">https://workflowy.com/#/982e8186ff23</a>';
        linkHtmlResult = '((982e8186ff23))';
        let testContentPass = `${fillerPre} ${linkHtml} ${fillerPost}`;
        let testContentPassResult = `${fillerPre} ${linkHtmlResult} ${fillerPost}`;
        expect(convertHtmlToMd(testConfig, linkHtml)).to.deep.equal(linkHtmlResult);
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
    });
    describe('Dates', () => {
      // TODO: rewrite all above with string literals
      let dateHtml;
      let fillerPre = 'Non-html filler';
      let fillerPost = 'more filler'; 
      it('Single date', () => {
        dateHtml = '<time startYear=\"2024\" startMonth=\"10\" startDay=\"31\">Thu, Oct 31, 2024</time>';
        let testContentPass = `${fillerPre} ${dateHtml} ${fillerPost}`;
        let testContentPassResult = `${fillerPre} [[ 2024-10-31 ]] ${fillerPost}`;
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
      it('Single date and time', () => {
        dateHtml = '<time startYear=\"2024\" startMonth=\"10\" startDay=\"31\" startHour=\"8\" startMinute=\"53\">Thu, Oct 31, 2024 at 08:53 am</time>';
        let testContentPass = `${fillerPre} ${dateHtml} ${fillerPost}`;
        let testContentPassResult = `${fillerPre} [[ 2024-10-31 ]] at 08:53 ${fillerPost}`;
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
      it("Midnight isn't confused with having no time at all", () => {
        dateHtml = '<time startYear=\"2024\" startMonth=\"10\" startDay=\"31\" startHour=\"0\" startMinute=\"00\">Thu, Oct 31, 2024 00:00 am</time>';
        let testContentPass = `${fillerPre} ${dateHtml} ${fillerPost}`;
        let testContentPassResult = `${fillerPre} [[ 2024-10-31 ]] at 00:00 ${fillerPost}`;
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
    });
    describe('Ampersat Tags', () => {
      let tagHtml;
      let tagHtmlResult;
      let fillerPre = 'Non-html filler';
      let fillerPost = 'more filler'; 
      it('Converts mention tags using "id" number', () => {
        tagHtml = '<mention id=\"286081\" by=\"286081\" ts=\"78804316\"> </mention>';
        tagHtmlResult = '[[@/286081]]';
        let testContentPass = `${fillerPre} ${tagHtml} ${fillerPost}`;
        let testContentPassResult = `${fillerPre} ${tagHtmlResult} ${fillerPost}`;
        expect(convertHtmlToMd(testConfig, tagHtml)).to.deep.equal(tagHtmlResult);
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
      it('Converts hardcoded "everyone" tags', () => {
        tagHtml = '<mention id=\"0\" by=\"286081\" ts=\"78804316\"> </mention>';
        tagHtmlResult = '[[@/everyone]]';
        let testContentPass = `${fillerPre} ${tagHtml} ${fillerPost}`;
        let testContentPassResult = `${fillerPre} ${tagHtmlResult} ${fillerPost}`;
        expect(convertHtmlToMd(testConfig, tagHtml)).to.deep.equal(tagHtmlResult);
        expect(convertHtmlToMd(testConfig, testContentPass)).to.deep.equal(testContentPassResult);
      });
    });
  });
});
