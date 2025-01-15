import { expect } from 'chai';
import {
  extractUrlFromMd,
  indentLines,
  linkTextToUrl,
  tagInText,
  stripMdLink,
  stripTag,
  toPageLink,
  mdLinkInText,
  makeBlockNamePrefix,
  makeBlockNotePrefix
} from '../src/text.js';

describe('text.js', () => {
  describe('extractUrlFromMd()', () => {
    it('Extracts URL info from markdown link', () => {
      let testStr = '[Example.com](https://www.example.com)' 
      let testResult = extractUrlFromMd(testStr)

      expect(testResult.full).to.equal(testStr);
      expect(testResult.text).to.equal('Example.com');
      expect(testResult.url).to.equal('https://www.example.com');
    });
  });
  describe('indentLines()', () => {
    it('Applies only a newline to node note with empty prefix', () => {
      let testContentPass = "Line 1\nLine 2\nLine 3"
      let testContentPassResult = "\nLine 1\nLine 2\nLine 3"
      expect(indentLines(testContentPass, '')).to.deep.equal(testContentPassResult);
      let testContentFail = "Line 1\nLine 2\nLine 3"
      let testNodeFailResult = "Line 1\nLine 2\nLine 3"
      expect(indentLines(testContentFail, '')).to.deep.not.equal(testNodeFailResult);
    });
    it('Applies prefix correctly to each line of note text in a node', () => {
      let testContentPass = "Line 1\nLine 2\nLine 3"
      let testContentPassResult = "\n  Line 1\n  Line 2\n  Line 3"
      expect(indentLines(testContentPass, '  ')).to.deep.equal(testContentPassResult);
    });
    it('Applies prefix correctly to each line with multiple inner newlines', () => {
      let testContentPass = "Line 1\n\nLine 2\n\nLine 3"
      let testContentPassResult = "\n  Line 1\n  \n  Line 2\n  \n  Line 3"
      expect(indentLines(testContentPass, '  ')).to.deep.equal(testContentPassResult);
    });
    it('Creates consistent start/end newline output regardless of input', () => {
      let testContentPassOne = "\nLine 1\nLine 2\nLine 3"
      let testContentPassTwo = "Line 1\nLine 2\nLine 3\n"
      let testContentPassThree = "\n\nLine 1\nLine 2\nLine 3"
      let testContentPassFour = "Line 1\nLine 2\nLine 3\n\n"
      let testContentPassResult = "\nLine 1\nLine 2\nLine 3"
      expect(indentLines(testContentPassOne, '')).to.deep.equal(testContentPassResult);
      expect(indentLines(testContentPassTwo, '')).to.deep.equal(testContentPassResult);
      expect(indentLines(testContentPassThree, '')).to.deep.equal(testContentPassResult);
      expect(indentLines(testContentPassFour, '')).to.deep.equal(testContentPassResult);
    });
    it('Always remove extra leading/ending whitespace regardless of input', () => {
      let testContentPassOne = " Line 1\nLine 2\nLine 3"
      let testContentPassTwo = "Line 1\nLine 2\nLine 3 "
      let testContentPassThree = "  Line 1\nLine 2\nLine 3"
      let testContentPassFour = "Line 1\nLine 2\nLine 3  "
      let testContentPassResult = "\nLine 1\nLine 2\nLine 3"
      expect(indentLines(testContentPassOne, '')).to.deep.equal(testContentPassResult);
      expect(indentLines(testContentPassTwo, '')).to.deep.equal(testContentPassResult);
      expect(indentLines(testContentPassThree, '')).to.deep.equal(testContentPassResult);
      expect(indentLines(testContentPassFour, '')).to.deep.equal(testContentPassResult);
    });
  });
  describe('linkTextToUrl()', () => {
    it('Unencrypted link', () => {
      let testUrl = 'http://www.example.com';
      let testUrlPass = '<a href="' + testUrl + '">' + testUrl + '</a>';
      expect(linkTextToUrl(testUrl)).to.deep.equal(testUrlPass);
    });
    it('Encrypted link', () => {
      let testUrl = 'https://www.example.com';
      let testUrlPass = '<a href="' + testUrl + '">' + testUrl + '</a>';
      expect(linkTextToUrl(testUrl)).to.deep.equal(testUrlPass);
    });
    it('Missing subdomain', () => {
      let testUrl = 'https://example.com';
      let testUrlPass = '<a href="' + testUrl + '">' + testUrl + '</a>';
      expect(linkTextToUrl(testUrl)).to.deep.equal(testUrlPass);
    });
    it('Missing protocol', () => {
      let testUrl = 'www.example.com';
      let testUrlPass = '<a href="https://' + testUrl + '">' + testUrl + '</a>';
      expect(linkTextToUrl(testUrl)).to.deep.equal(testUrlPass);
    });
  });
  describe('makeBlockNamePrefix()', () => {
    it('Returns "- " when indentLvl is 0, regardless of indent size', () => {
      expect(makeBlockNamePrefix(0, 0)).to.deep.equal('- ');
      expect(makeBlockNamePrefix(1, 0)).to.deep.equal('- ');
      expect(makeBlockNamePrefix(2, 0)).to.deep.equal('- ');
    });
    it('Returns appropriate number of spaces when indentLvl is > 0', () => {
      expect(makeBlockNamePrefix(0, 1)).to.deep.equal('- ');
      expect(makeBlockNamePrefix(1, 1)).to.deep.equal(' - ');
      expect(makeBlockNamePrefix(2, 1)).to.deep.equal('  - ');
      expect(makeBlockNamePrefix(3, 1)).to.deep.equal('   - ');
      expect(makeBlockNamePrefix(1, 2)).to.deep.equal('  - ');
      expect(makeBlockNamePrefix(2, 2)).to.deep.equal('    - ');
    });
  });
  describe('makeBlockNotePrefix()', () => {
    it('Returns "  " when indentLvl is 0, regardless of indent size', () => {
      expect(makeBlockNotePrefix(0, 0)).to.deep.equal('  ');
      expect(makeBlockNotePrefix(1, 0)).to.deep.equal('  ');
      expect(makeBlockNotePrefix(2, 0)).to.deep.equal('  ');
    });
    it('Returns appropriate number of spaces when indentLvl is > 0', () => {
      expect(makeBlockNotePrefix(0, 1)).to.deep.equal('  ');
      expect(makeBlockNotePrefix(1, 1)).to.deep.equal('   ');
      expect(makeBlockNotePrefix(2, 1)).to.deep.equal('    ');
      expect(makeBlockNotePrefix(3, 1)).to.deep.equal('     ');
      expect(makeBlockNotePrefix(1, 2)).to.deep.equal('    ');
      expect(makeBlockNotePrefix(2, 2)).to.deep.equal('      ');
    });
  });
  describe('mdLinkInText()', () => {
    it('Passes when Markdown link is in text', () => {
      let testStr = '[Example.com](https://www.example.com)' 
      expect(mdLinkInText(testStr)).to.be.true;

      testStr = 'Filler text [Example.com](https://www.example.com) filler text' 
      expect(mdLinkInText(testStr)).to.be.true;

      testStr = '[a](a)' 
      expect(mdLinkInText(testStr)).to.be.true;
    });
    it('Passes when contains multiple links', () => {
      let testStr = '[Example.com](https://www.example.com)' 
      expect(mdLinkInText(testStr + ' ' + testStr)).to.be.true;
      expect(mdLinkInText(testStr + '\n' + testStr)).to.be.true;
    });
    it('Fails when no links are present', () => {
      let testStr = 'Some other text' 
      expect(mdLinkInText(testStr)).to.be.false;

      testStr = '' 
      expect(mdLinkInText(testStr)).to.be.false;

      testStr = undefined;
      expect(mdLinkInText(testStr)).to.be.false;
    });
  });
  describe('stripMdLink()', () => {
    it('Strips Markdown link from text', () => {
      let testStr = '[Example.com](https://www.example.com)' 
      expect(stripMdLink(testStr)).to.equal('');

      testStr = 'Filler text [Example.com](https://www.example.com) filler text' 
      expect(stripMdLink(testStr)).to.equal('Filler text  filler text');
    });
  });
  describe('stripTag()', () => {
    it('Remove a tag from a string', () => {
      expect(stripTag('#Tag', 'A string with a #Tag')).to.deep.equal('A string with a ');
      expect(stripTag('#Tag', '#Tag first in a string')).to.deep.equal(' first in a string');
      expect(stripTag('#Tag', 'A #Tag within a string')).to.deep.equal('A  within a string');
    });
    it('Pass string when tag not in string', () => {
      expect(stripTag('#Tag', 'A string without a tag')).to.deep.equal('A string without a tag');
    });
    it('Pass string when given tag, but empty string', () => {
      expect(stripTag('#Tag', '')).to.deep.equal('');
    });
    it('Pass string when given empty tag', () => {
      expect(stripTag('', 'A string of things')).to.deep.equal('A string of things');
    });
    it('Pass string when given both empty tag and empty string', () => {
      expect(stripTag('', '')).to.deep.equal('');
    });
    it('Pass string when given undefined or null tag', () => {
      expect(stripTag(undefined, 'A string of things')).to.deep.equal('A string of things');
      expect(stripTag(null, 'A string of things')).to.deep.equal('A string of things');
    });
  });
  describe('tagInText()', () => {
    it('Passes when tag in string', () => {
      expect(tagInText('#Tag', '#Tag')).to.be.true;
    });
    it('Fail when tag not in string', () => {
      expect(tagInText('#Tag', 'Some other text')).to.be.false;
    });
    it('Fail when given string, but empty tag', () => {
      expect(tagInText('', 'Some other text')).to.be.false;
    });
    it('Fail when given string, but undefined or null tag', () => {
      expect(tagInText(undefined, 'Some other text')).to.be.false;
      expect(tagInText(null, 'Some other text')).to.be.false;
    });
    it('Fail when given tag, but empty string', () => {
      expect(tagInText('#Tag', '')).to.be.false;
    });
    it('Fail when given both empty tag and string', () => {
      expect(tagInText('', '')).to.be.false;
    });
  });
  describe('toPageLink()', () => {
    it('Returns page link with simple text', () => {
      expect(toPageLink('A string of things')).to.deep.equal('[[ A string of things ]]');
    });
    it('Returns trimmed page link with simple text that has whitespace before and after', () => {
      expect(toPageLink(' A string of things ')).to.deep.equal('[[ A string of things ]]');
    });
    it('Returns "Orphan" page when string is empty or contains only spaces', () => {
      expect(toPageLink('')).to.deep.equal('[[ Orphans ]]');
      expect(toPageLink(' ')).to.deep.equal('[[ Orphans ]]');
    });
  });
});
