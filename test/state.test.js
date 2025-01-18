import { expect } from 'chai';

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
      expect(testState.incrementJobProgress).to.be.an.instanceOf(Function);
      expect(testState.startProgressBar).to.be.an.instanceOf(Function);
      expect(testState.stopProgressBar).to.be.an.instanceOf(Function);
    });
    it('Does not show internal properties', () => {
      expect(testState).to.not.have.all.keys('totalNumJobs', 'jobProgress', 'progressBar', 'pages');
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
});
