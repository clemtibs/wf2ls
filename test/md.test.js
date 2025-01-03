import { expect } from 'chai';

import { convertHtmlToMd } from '../src/md.js';

describe('md.js', () => {
  describe('convertHtmlToMd()', () => {
    describe('Handles HTML Reserved Characters', () => {
      it.skip('Greater-than', () => { // an issue with turndown, see: https://github.com/mixmark-io/turndown/issues/395 
        let testContentPass = '&gt;'
        let testContentPassResult = '>'
        expect(convertHtmlToMd(testContentPass)).to.deep.equal(testContentPassResult);
      });
      it('Less-than', () => {
        let testContentPass = '&lt;'
        let testContentPassResult = '<'
        expect(convertHtmlToMd(testContentPass)).to.deep.equal(testContentPassResult);
      });
      it('Ampersand', () => {
        let testContentPass = '&amp;'
        let testContentPassResult = '&'
        expect(convertHtmlToMd(testContentPass)).to.deep.equal(testContentPassResult);
      });
      it('Apostrophe', () => {
        let testContentPass = '&apos;'
        let testContentPassResult = "'"
        expect(convertHtmlToMd(testContentPass)).to.deep.equal(testContentPassResult);
      });
      it('Quotation Mark', () => {
        let testContentPass = '&quot;'
        let testContentPassResult = '"'
        expect(convertHtmlToMd(testContentPass)).to.deep.equal(testContentPassResult);
      });
    });
    it('Preserves newlines outside of html content', () => {
      let testContentPass = '\nNon-html filler\n<a href="https://www.example.com">Example.com</a>\nmore filler'
      let testContentPassResult = '\nNon-html filler\n[Example.com](https://www.example.com)\nmore filler'
      expect(convertHtmlToMd(testContentPass)).to.deep.equal(testContentPassResult);
    });
    it('Anchors', () => {
      let testContentPass = 'Non-html filler <a href="https://www.example.com">Example.com</a> more filler'
      let testContentPassResult = 'Non-html filler [Example.com](https://www.example.com) more filler'
      expect(convertHtmlToMd(testContentPass)).to.deep.equal(testContentPassResult);
    });
    it('Bold text', () => {
      let testContentPass = 'Non-html filler <b>bold text</b> more filler'
      let testContentPassResult = 'Non-html filler **bold text** more filler'
      expect(convertHtmlToMd(testContentPass)).to.deep.equal(testContentPassResult);
    });
    it('Underline text', () => {
      let testContentPass = 'Non-html filler <u>underline text</u> more filler'
      let testContentPassResult = 'Non-html filler <u>underline text</u> more filler'
      expect(convertHtmlToMd(testContentPass)).to.deep.equal(testContentPassResult);
    });
    it('Italic text', () => {
      let testContentPass = 'Non-html filler <i>italic text</i> more filler'
      let testContentPassResult = 'Non-html filler _italic text_ more filler'
      expect(convertHtmlToMd(testContentPass)).to.deep.equal(testContentPassResult);
    });
    it('Strike-through text', () => {
      let testContentPass = 'Non-html filler <s>strike-through text</s> more filler'
      let testContentPassResult = 'Non-html filler ~~strike-through text~~ more filler'
      expect(convertHtmlToMd(testContentPass)).to.deep.equal(testContentPassResult);
    });
  });
});
