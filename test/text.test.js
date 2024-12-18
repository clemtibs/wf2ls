import { expect } from 'chai';
import {
  tagInText,
  stripTag,
  toPageLink,
  makeBlockNamePrefix,
  makeBlockNotePrefix
} from '../src/text.js';

describe('text.js', () => {
  describe('tagInText()', () => {
    it('Pass when tag in string', () => {
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
});
