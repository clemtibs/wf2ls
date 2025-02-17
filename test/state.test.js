import { expect } from 'chai';

import { makeNode } from '../src/node.js';
import { AppState } from '../src/state.js';

const largeSampleDataLoc = "./test/data/wf_data_sample.json";

describe('state.js', () => {
  let testState;
  beforeEach(() => {
    testState = new AppState(undefined, true);
  });
  describe('AppState instances', () => {
    it('Has required properties', () => {
      expect(testState).to.have.all.keys('isTestInstance');
      expect(testState.addJob).to.be.an.instanceOf(Function);
      expect(testState.addPage).to.be.an.instanceOf(Function);
      expect(testState.appendPage).to.be.an.instanceOf(Function);
      expect(testState.getPage).to.be.an.instanceOf(Function);
      expect(testState.getAllPages).to.be.an.instanceOf(Function);
      expect(testState.getAllPagesExcept).to.be.an.instanceOf(Function);
      expect(testState.getNodeIdByPageRef).to.be.an.instanceOf(Function);
      expect(testState.getTemplateButtonName).to.be.an.instanceOf(Function);
      expect(testState.incrementJobProgress).to.be.an.instanceOf(Function);
      expect(testState.registerPageRef).to.be.an.instanceOf(Function);
      expect(testState.registerTemplateName).to.be.an.instanceOf(Function);
      expect(testState.startProgressBar).to.be.an.instanceOf(Function);
      expect(testState.stopProgressBar).to.be.an.instanceOf(Function);
    });
    it('Does not show internal properties', () => {
      expect(testState).to.not.have.all.keys(
        'totalNumJobs',
        'jobProgress',
        'progressBar',
        'pages',
        'templates',
        'pageRefs',
      );
    });
    describe('Console output', () => {
      const testState = new AppState(undefined, true);
      it('Does not call progressBar methods' , () => {
        //TODO: need to use console spies for this
        expect(testState.addJob()).to.be.undefined;
        expect(testState.startProgressBar()).to.be.undefined;
        expect(testState.incrementJobProgress()).to.be.undefined;
        expect(testState.stopProgressBar()).to.be.undefined;
      });
    });
  });
  describe('addPage()', () => {
    it('Can add a new page', () => {
      const pageContent = "Test\ncontent\nhere."
      testState.addPage('Page Name', pageContent);
      expect(testState.getPage('Page Name')).to.deep.equal(pageContent + "\n");
    });
  });
  describe('appendPage()', () => {
    it('Can append existing page', () => {
      const origPageContent = "Test\ncontent\nhere."
      const newLineContent = "\nAdditional line."

      testState.addPage('origPage', origPageContent);
      testState.appendPage('origPage', newLineContent);

      expect(testState.getPage('origPage')).to.deep.equal(origPageContent + newLineContent + "\n");
    });
  });
  describe('getPage()', () => {
    it('Returns a string with existing page content', () => {
      const pageContent = "Test\ncontent\nhere."

      testState.addPage('Test Page', pageContent);

      expect(testState.getPage('Test Page')).to.deep.equal(pageContent + "\n");
    });
  });
  describe('getAllPages()', () => {
    const pageOneContent = "Test\ncontent\nhere."
    const pageTwoContent = "Test\ncontent\nhere."
    const pageThreeContent = "Test\ncontent\nhere."
    it('Returns the pages map', () => {
      testState.addPage('Test Page One', pageOneContent);
      testState.addPage('Test Page Two', pageTwoContent);
      testState.addPage('Test Page Three', pageThreeContent);

      expect(testState.getAllPages()).to.be.an.instanceOf(Map)
        .and.have.all.keys('Test Page One', 'Test Page Two', 'Test Page Three');
    });
    it('Adds newlines to end of each page in test mode', () => {
      testState = new AppState(undefined, true);

      testState.addPage('Test Page One', pageOneContent);
      testState.addPage('Test Page Two', pageTwoContent);
      testState.addPage('Test Page Three', pageThreeContent);

      const allPages = testState.getAllPages();
      expect(allPages.get('Test Page One')).to.deep.equal(pageOneContent + "\n")
      expect(allPages.get('Test Page Two')).to.deep.equal(pageTwoContent + "\n")
      expect(allPages.get('Test Page Three')).to.deep.equal(pageThreeContent + "\n")
    });
    it('Do not add newlines to end of each page in regular mode', () => {
      testState = new AppState(undefined, false);

      testState.addPage('Test Page One', pageOneContent);
      testState.addPage('Test Page Two', pageTwoContent);
      testState.addPage('Test Page Three', pageThreeContent);

      const allPages = testState.getAllPages();
      expect(allPages.get('Test Page One')).to.deep.equal(pageOneContent)
      expect(allPages.get('Test Page Two')).to.deep.equal(pageTwoContent)
      expect(allPages.get('Test Page Three')).to.deep.equal(pageThreeContent)
    });
  });
  describe('getAllPagesExcept()', () => {
    const pageOneContent = "Test\ncontent\nhere."
    const pageTwoContent = "Test\ncontent\nhere."
    const pageThreeContent = "Test\ncontent\nhere."
    it('Returns all pages when called with no args', () => {
      testState.addPage('Test Page One', pageOneContent);
      testState.addPage('Test Page Two', pageTwoContent);
      testState.addPage('Test Page Three', pageThreeContent);

      expect(testState.getAllPagesExcept()).to.be.an.instanceOf(Map)
        .and.have.all.keys('Test Page One', 'Test Page Two', 'Test Page Three');
    });
    it('Exludes pages in arg list', () => {
      testState.addPage('Test Page One', pageOneContent);
      testState.addPage('Test Page Two', pageTwoContent);
      testState.addPage('Test Page Three', pageThreeContent);

      expect(testState.getAllPagesExcept(['Test Page Two'])).to.be.an.instanceOf(Map)
        .and.have.all.keys('Test Page One', 'Test Page Three');
    });
    it('Adds newlines to end of each page in test mode', () => {
      testState = new AppState(undefined, true);

      testState.addPage('Test Page One', pageOneContent);
      testState.addPage('Test Page Two', pageTwoContent);
      testState.addPage('Test Page Three', pageThreeContent);

      const allPages = testState.getAllPagesExcept(['Test Page Two']);
      expect(allPages.get('Test Page One')).to.deep.equal(pageOneContent + "\n")
      expect(allPages.get('Test Page Two')).to.deep.equal(undefined)
      expect(allPages.get('Test Page Three')).to.deep.equal(pageThreeContent + "\n")
    });
    it('Do not add newlines to end of each page in regular mode', () => {
      testState = new AppState(undefined, false);

      testState.addPage('Test Page One', pageOneContent);
      testState.addPage('Test Page Two', pageTwoContent);
      testState.addPage('Test Page Three', pageThreeContent);

      const allPages = testState.getAllPagesExcept(['Test Page Two']);
      expect(allPages.get('Test Page One')).to.deep.equal(pageOneContent)
      expect(allPages.get('Test Page Two')).to.deep.equal(undefined)
      expect(allPages.get('Test Page Three')).to.deep.equal(pageThreeContent)
    });
  });
  describe('registerPageRef(), getNodeIdByPageRef()', () => {
    const testNodeOne = makeNode({
      id: 'aff57398-663f-bad1-09fb-982e8186ff23'
    });
    const testNodeTwo = makeNode({
      id: '711e639d-9e77-4c17-8589-be91492efb04'
    });
    beforeEach(() => {
      testState.registerPageRef(testNodeOne);
      testState.registerPageRef(testNodeTwo);
    });
    it('Returns correct full id', () => {
      expect(testState.getNodeIdByPageRef('982e8186ff23')).to.deep.equal('aff57398-663f-bad1-09fb-982e8186ff23');
      expect(testState.getNodeIdByPageRef('be91492efb04')).to.deep.equal('711e639d-9e77-4c17-8589-be91492efb04');
    });
  });
  describe('registerTemplateName(), getTemplateButtonName()', () => {
    const templateNode = makeNode({
      id: 'ca4a1062-3c04-4cfc-ad74-b85be3ef7907',
      name: 'Some kind of template #template'
    });

    let templateButtonNode = makeNode({
      id: 'b52a06a5-6b09-4bcc-91c7-f71ce5e0416c',
      name: 'My template button #use-template:b85be3ef7907'
    });
    let templateButtonNodeWithAmpersat = makeNode({
      id: '6b4d6f75-d513-4ea5-bb85-e2059c2ab05e',
      name: '@My template button #use-template:b85be3ef7907'
    });
    it('Return description and template name seperately when button has description', () => {
      testState.registerTemplateName(templateNode);
      const [ tDesc, tName ] = testState.getTemplateButtonName(templateButtonNode);
      expect(tDesc).to.deep.equal('My template button');
      expect(tName).to.deep.equal('Some kind of template');
    });
    it('Use template name as button description when button does not have a description', () => {
      templateButtonNode = makeNode({
        id: 'b52a06a5-6b09-4bcc-91c7-f71ce5e0416c',
        name: '#use-template:b85be3ef7907'
      });
      testState.registerTemplateName(templateNode);
      let [ tDesc, tName ] = testState.getTemplateButtonName(templateButtonNode);
      expect(tDesc).to.deep.equal('Some kind of template');
      expect(tName).to.deep.equal('Some kind of template');

      templateButtonNode = makeNode({
        id: 'b52a06a5-6b09-4bcc-91c7-f71ce5e0416c',
        name: ' #use-template:b85be3ef7907' // <-leading whitespace
      });
      testState.registerTemplateName(templateNode);
      [ tDesc, tName ] = testState.getTemplateButtonName(templateButtonNode);
      expect(tDesc).to.deep.equal('Some kind of template');
      expect(tName).to.deep.equal('Some kind of template');
    });
    it('Work correctly when buttons have ampersat in the name', () => {
      testState.registerTemplateName(templateNode);
      const [ tDesc, tName ] = testState.getTemplateButtonName(templateButtonNodeWithAmpersat);
      expect(tDesc).to.deep.equal('@My template button');
      expect(tName).to.deep.equal('Some kind of template');
    });
  });
});
