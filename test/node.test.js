import { expect } from 'chai';
import {
  nodeIsBacklink,
  nodeIsBullet,
  nodeIsBoard,
  nodeIsCodeBlock,
  nodeIsH1,
  nodeIsH2,
  nodeIsParagraph,
  nodeIsQuoteBlock,
  nodeIsTodo
} from '../src/node.js';

describe('node.js', () => {
  describe('Node Processing', () => {
    describe('indentNote()', () => {
      it('Creates indent equal to default for each line of text when indentTxt is 0');
      it('Creates default x n spaces for each line of text when indentTxt is n');
    });
  });

  describe('Idendity Tests', () => {
    describe('nodeIsBacklink()', () => {
      it('should detect backlink nodes', () => {
        let testNodePass = { 'metadata':
                        {'isReferencesRoot': true }}
        expect(nodeIsBacklink(testNodePass)).to.be.true;
        let testNodeFail = { 'metadata': {}}
        expect(nodeIsBacklink(testNodeFail)).to.be.false;
      });
    });
    describe('nodeIsBullet()', () => {
      it('should detect regular nodes', () => {
        let testNodePass = { 'metadata': {}}
        expect(nodeIsBullet(testNodePass)).to.be.true;
        let testNodeFail = { 'metadata':
                        {'layoutMode': 'todo'}}
        expect(nodeIsBullet(testNodeFail)).to.be.false;
      });
    });
    describe('nodeIsBoard()', () => {
      it('should detect board nodes', () => {
        let testNodePass = { 'metadata':
                        {'layoutMode': 'board'}}
        expect(nodeIsBoard(testNodePass)).to.be.true;
        let testNodeFail = { 'metadata': {}}
        expect(nodeIsBoard(testNodeFail)).to.be.false;
      });
    });
    describe('nodeIsCodeBlock()', () => {
      it('should detect code block nodes', () => {
        let testNodePass = { 'metadata':
                        {'layoutMode': 'code-block'}}
        expect(nodeIsCodeBlock(testNodePass)).to.be.true;
        let testNodeFail = { 'metadata': {}}
        expect(nodeIsCodeBlock(testNodeFail)).to.be.false;
      });
    });
    describe('nodeIsH1()', () => {
      it('should detect H1 nodes', () => {
        let testNodePass = { 'metadata':
                        {'layoutMode': 'h1'}}
        expect(nodeIsH1(testNodePass)).to.be.true;
        let testNodeFail = { 'metadata': {}}
        expect(nodeIsH1(testNodeFail)).to.be.false;
      });
    });
    describe('nodeIsH2()', () => {
      it('should detect H2 nodes', () => {
        let testNodePass = { 'metadata':
                        {'layoutMode': 'h2'}}
        expect(nodeIsH2(testNodePass)).to.be.true;
        let testNodeFail = { 'metadata': {}}
        expect(nodeIsH2(testNodeFail)).to.be.false;
      });
    });
    describe('nodeIsParagraph()', () => {
      it('should detect paragraph nodes', () => {
        let testNodePass = { 'metadata':
                        {'layoutMode': 'p'}}
        expect(nodeIsParagraph(testNodePass)).to.be.true;
        let testNodeFail = { 'metadata': {}}
        expect(nodeIsParagraph(testNodeFail)).to.be.false;
      });
    });
    describe('nodeIsQuoteBlock()', () => {
      it('should detect quote block nodes', () => {
        let testNodePass = { 'metadata':
                        {'layoutMode': 'quote-block'}}
        expect(nodeIsQuoteBlock(testNodePass)).to.be.true;
        let testNodeFail = { 'metadata': {}}
        expect(nodeIsQuoteBlock(testNodeFail)).to.be.false;
      });
    });
    describe('nodeIsTodo()', () => {
      it('should detect todo nodes', () => {
        let testNodePass = { 'metadata':
                        {'layoutMode': 'todo'}}
        expect(nodeIsTodo(testNodePass)).to.be.true;
        let testNodeFail = { 'metadata': {}}
        expect(nodeIsTodo(testNodeFail)).to.be.false;
      });
    });

  });
});
