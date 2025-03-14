import { default as _ } from 'lodash';

import { stripTag } from './text.js';

class AppState {
  #totalNumJobs;
  #jobProgress;
  #progressBar;
  #pages;
  #templates;
  #pageRefs;
  isTestInstance = false;

/*
 * @params:
 *  {cliProgres}, progress bar intance, use undefined for testing instances
 *  <testing:boolen>, is this an instance for testing?
 */
  constructor(appProgressBar, testing) {
    this.#totalNumJobs = 0;
    this.#jobProgress = 0;
    this.#pages = new Map();
    this.#pageRefs = new Map();
    this.#templates = new Map();
    if (appProgressBar) this.#progressBar = appProgressBar;
    if (testing) this.isTestInstance = testing;
  }

  addJob() {
    this.#totalNumJobs++;
    if (!this.isTestInstance) this.#progressBar.setTotal(this.#totalNumJobs);
  }

  addPage(pName, pageStr) {
    // TODO: A page specifically named "Orphans" needs to be detected and
    // appended to rather than overwritten. That page is for nodes that have
    // the newPageTag but end up with an empty node name or spaces as a result
    // of stripTag(). 
    this.#pages.set(pName, pageStr);
  }

  #appendPage(pName, str) {
    if (this.#pages.has(pName)) {
      let origContent = this.#pages.get(pName);
      this.#pages.set(pName, origContent += str);
    }
  }

  appendPage(pName, str) {
    this.#appendPage(pName, str)
  }

  getPage(pName) {
    let pContent = this.#pages.get(pName);
    // Newlines get added automatically at the end of each page (file) when
    // written to disk, but are absent in pages map, which means they are
    // missing for and fail the acceptance tests (since they compare against a
    // file that is being read, and ends in newlines). So when testing, we need
    // to add newlines back to end of every page so they can pass. 
    if (this.isTestInstance) pContent += "\n";
    return pContent;
  }

  getAllPages() {
    if (this.isTestInstance) {
      const pages = new Map();
      for (let [page, content] of this.#pages) {
        pages.set(page, content += "\n");
      }
      return pages;
    } else {
      return this.#pages
    }
  }

  getAllPagesExcept(pageList) {
    pageList ? pageList : pageList = [];
    const filteredPages = new Map();
    for (let [page, content] of this.#pages) {
      if (pageList.includes(page)) {
        continue;
      } else {
        if (this.isTestInstance) filteredPages.set(page, content += "\n");
        filteredPages.set(page, content);
      }
    }
    return filteredPages;
  }

  getNodeIdByPageRef(pRefStr) {
    return this.#pageRefs.get(pRefStr);
  }

  getTemplateButtonName(node) {
    const fullTemplateButtonRegex = /^(.+)\s#use-template:([0-9a-fA-F]{12}$)/;
    // I could probably do this in one regex pattern, but didn't have the energy.
    const partialTemplateButtonRegex = /^\s?#use-template:([0-9a-fA-F]{12}$)/;
    let matches;
    let lookupId;
    let templateName;
    if (matches = fullTemplateButtonRegex.exec(node.name)) {
      lookupId = matches[2];
      const templateButtonDesc = matches[1];
      templateName = this.#templates.get(lookupId);
      return [ templateButtonDesc, templateName ]
    } else if (matches = partialTemplateButtonRegex.exec(node.name)) {
      lookupId = matches[1];
      templateName = this.#templates.get(lookupId);
      return [ templateName, templateName ]
    }
  }

  incrementJobProgress() {
    this.#jobProgress++;
    if (!this.isTestInstance) this.#progressBar.update(this.#jobProgress);
  }

  registerPageRef(node) {
    this.#pageRefs.set(node.id.split("-")[4], node.id);
  }

  registerTemplateName(node) {
    this.#templates.set(node.id.split("-")[4], stripTag('#template', node.name).trim());
  }

  startProgressBar() {
    if (!this.isTestInstance) this.#progressBar.start(this.#totalNumJobs, 0);
  }

  stopProgressBar() {
    if (!this.isTestInstance) this.#progressBar.stop();
  }
}

export { 
  AppState
};
