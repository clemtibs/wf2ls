import { expect } from 'chai';

import {
  AppConfig,
  defaultConfig
} from '../src/config.js';
import {
  makeNode,
  nodeHasNote,
  nodeIsBacklink,
  nodeIsChildBookmark,
  nodeIsNoteBookmark,
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
    describe('makeNode()', () => {
      it('New node has correct default properties', () => {
        let testNode = makeNode();
        expect(testNode).to.be.an('object');
        expect(testNode).to.include.all.keys(
          "id",
          "name",
        );
        expect(testNode.id).to.be.a('string').and.not.empty;
        expect(testNode.name).to.be.a('string').and.empty;
      });
      it('New node has all defined properties', () => {
        let testNode = makeNode({
          id: "1a2b3c4d",
          name: "name",
          note: "note",
          completed: "today"
        });
        expect(testNode).to.include.all.keys(
          "id",
          "name",
          "note",
          "completed"
        );
        expect(testNode.id).to.be.a('string').and.equal("1a2b3c4d");
        expect(testNode.name).to.be.a('string').and.equal("name");
        expect(testNode.note).to.be.a('string').and.equal("note");
        expect(testNode.completed).to.be.a('string').and.equal("today");
      });
      describe('Can be nested to create children nodes', () => {
        let testNodeWithChildren = makeNode(
          {children: [ 
            makeNode({ name: "child one"}),
            makeNode({ name: "child two"}) 
          ]}
        );
        it('Sucessfully', () => {
          expect(testNodeWithChildren).to.include.key('children');
        });
        it('Who are contained in an array', () => {
          expect(testNodeWithChildren.children).to.be.an('array');
          expect(testNodeWithChildren.children).to.be.an('array');
        });
        it('With correct number of children', () => {
          expect(testNodeWithChildren.children).to.have.lengthOf(2);
        });
        it('That have correct named properties', () => {
          expect(testNodeWithChildren.children[0].name).to.deep.equal('child one');
          expect(testNodeWithChildren.children[1].name).to.deep.equal('child two');
        });
      });
    });
  });
  describe('Idendity Tests', () => {
    describe('nodeHasNote()', () => {
      it('should detect node notes', () => {
        let testNodePass = { 'note': 'some note content' };
        expect(nodeHasNote(testNodePass)).to.be.true;
        let testNodeFail = {};
        expect(nodeHasNote(testNodeFail)).to.be.false;
      });
    });
    describe('nodeIsBacklink()', () => {
      it('should detect backlink nodes', () => {
        let testNodePass = { 'metadata':
                        {'isReferencesRoot': true }}
        expect(nodeIsBacklink(testNodePass)).to.be.true;
        let testNodeFail = { 'metadata': {}}
        expect(nodeIsBacklink(testNodeFail)).to.be.false;
      });
    });
    describe('nodeIsChildBookmark()', () => {
      let testConfig = new AppConfig(defaultConfig)
      it('should pass on most common format', () => {
        let testNodePass = {
          "name": "Example Site Name",
          "metadata": {},
          "children": [
              {
                "name": '<a href=\"https://www.example.com/\">Example</a>', // children will always have unconverted links
                "metadata": {},
              }
          ]
        }
        expect(nodeIsChildBookmark(testConfig, testNodePass)).to.be.true;
      });
      it('should pass only when child note has no real content', () => {
        let testNodePass = {
          "name": "Example Site Name",
          "metadata": {},
          "note": '  ', // <-- whitespace
          "children": [
              {
                "name": '<a href=\"https://www.example.com/\">Example</a>', // children will always have unconverted links
                "note": '  ', // <-- whitespace
                "metadata": {},
              }
          ]
        }
        expect(nodeIsChildBookmark(testConfig, testNodePass)).to.be.true;
        testNodePass = {
          "name": "Example Site Name",
          "metadata": {},
          "note": '  ', // <-- whitespace
          "children": [
              {
                "name": '<a href=\"https://www.example.com/\">Example</a>', // children will always have unconverted links
                "metadata": {},
              }
          ]
        }
        expect(nodeIsChildBookmark(testConfig, testNodePass)).to.be.true;
        testNodePass = {
          "name": "Example Site Name",
          "metadata": {},
          "children": [
              {
                "name": '<a href=\"https://www.example.com/\">Example</a>', // children will always have unconverted links
                "note": '  ', // <-- whitespace
                "metadata": {},
              }
          ]
        }
        expect(nodeIsChildBookmark(testConfig, testNodePass)).to.be.true;
        testNodePass = {
          "name": "Example Site Name",
          "metadata": {},
          "note": 'Some text',
          "children": [
              {
                "name": '<a href=\"https://www.example.com/\">Example</a>', // children will always have unconverted links
                "metadata": {},
              }
          ]
        }
        expect(nodeIsChildBookmark(testConfig, testNodePass)).to.be.true;
        testNodePass = {
          "name": "Example Site Name",
          "metadata": {},
          "note": 'Some text',
          "children": [
              {
                "name": '<a href=\"https://www.example.com/\">Example</a>', // children will always have unconverted links
                "note": '  ', // <-- whitespace
                "metadata": {},
              }
          ]
        }
        expect(nodeIsChildBookmark(testConfig, testNodePass)).to.be.true;
      });
      it('should fail gracefully when missing name or note fields', () => {
        let testNodeFail = { 'metadata': {}}
        expect(nodeIsChildBookmark(testConfig, testNodeFail)).to.be.false;
      });
      it('should fail when child note has content', () => {
        let testNodeFail = {
          "name": "Example Site Name",
          "metadata": {},
          "note": 'Some text',
          "children": [
              {
                "name": '<a href=\"https://www.example.com/\">Example</a>', // children will always have unconverted links
                "note": 'Some text',
                "metadata": {},
              }
          ]
        }
        expect(nodeIsChildBookmark(testConfig, testNodeFail)).to.be.false;
        testNodeFail = {
          "name": "Example Site Name",
          "metadata": {},
          "children": [
              {
                "name": '<a href=\"https://www.example.com/\">Example</a>', // children will always have unconverted links
                "note": 'Some text',
                "metadata": {},
              }
          ]
        }
        expect(nodeIsChildBookmark(testConfig, testNodeFail)).to.be.false;
      });
      it('should fail when child node has children', () => {
        let testNodeFail = {
          "name": "Example Site Name",
          "metadata": {},
          "children": [
              {
                "name": '<a href=\"https://www.example.com/\">Example</a>', // children will always have unconverted links
                "metadata": {},
                "children": [
                    {
                      "name": "Some stuff",
                      "metadata": {},
                    }
                ]
              }
          ]
        }
        expect(nodeIsChildBookmark(testConfig, testNodeFail)).to.be.false;
      });
    });
    describe('nodeIsNoteBookmark()', () => {
      it('should pass on most common format', () => {
        let testNodePass = {
          "name": "Example Site Name",
          "metadata": {},
          "note": "[Example](https://www.example.com/)",
        }
        expect(nodeIsNoteBookmark(testNodePass)).to.be.true;
      });
      it('should pass when note has whitespace around valid link', () => {
        let testNodePass = {
          "name": "Example Site Name",
          "metadata": {},
          "note": " [Example](https://www.example.com/) ", // <-- whitespace
        }
        expect(nodeIsNoteBookmark(testNodePass)).to.be.true;
      });
      it('should fail gracefully when missing name or note fields', () => {
        let testNodeFail = { 'metadata': {}}
        expect(nodeIsNoteBookmark(testNodeFail)).to.be.false;
      });
      it('should fail when note field has any other text', () => {
        let testNodeFail = {
          "name": "Example Site Name",
          "metadata": {},
          "note": "[Example](https://www.example.com/) Some other text",
        }
        expect(nodeIsNoteBookmark(testNodeFail)).to.be.false;
        testNodeFail = {
          "name": "Example Site Name",
          "metadata": {},
          "note": "Some other text [Example](https://www.example.com/)",
        }
        expect(nodeIsNoteBookmark(testNodeFail)).to.be.false;
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
