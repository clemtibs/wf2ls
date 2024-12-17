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
        let testNode = { 'metadata':
                        {'isReferencesRoot': true }}
        expect(nodeIsBacklink(testNode)).to.be.true;
      });
    });
    describe('nodeIsBullet()', () => {
      it('should detect regular nodes', () => {
        let testNode = { 'metadata': {}}
        expect(nodeIsBullet(testNode)).to.be.true;
      });
    });
    describe('nodeIsBoard()', () => {
      it('should detect board nodes', () => {
        let testNode = { 'metadata':
                        {'layoutMode': 'board'}}
        expect(nodeIsBoard(testNode)).to.be.true;
      });
    });
    describe('nodeIsCodeBlock()', () => {
      it('should detect code block nodes', () => {
        let testNode = { 'metadata':
                        {'layoutMode': 'code-block'}}
        expect(nodeIsCodeBlock(testNode)).to.be.true;
      });
    });
    describe('nodeIsH1()', () => {
      it('should detect H1 nodes', () => {
        let testNode = { 'metadata':
                        {'layoutMode': 'h1'}}
        expect(nodeIsH1(testNode)).to.be.true;
      });
    });
    describe('nodeIsH2()', () => {
      it('should detect H2 nodes', () => {
        let testNode = { 'metadata':
                        {'layoutMode': 'h2'}}
        expect(nodeIsH2(testNode)).to.be.true;
      });
    });
    describe('nodeIsParagraph()', () => {
      it('should detect paragraph nodes', () => {
        let testNode = { 'metadata':
                        {'layoutMode': 'p'}}
        expect(nodeIsParagraph(testNode)).to.be.true;
      });
    });
    describe('nodeIsQuoteBlock()', () => {
      it('should detect quote block nodes', () => {
        let testNode = { 'metadata':
                        {'layoutMode': 'quote-block'}}
        expect(nodeIsQuoteBlock(testNode)).to.be.true;
      });
    });
    describe('nodeIsTodo()', () => {
      it('should detect todo nodes', () => {
        let testNode = { 'metadata':
                        {'layoutMode': 'todo'}}
        expect(nodeIsTodo(testNode)).to.be.true;
      });
    });

  });
});
