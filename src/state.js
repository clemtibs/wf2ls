class AppState {
  #totalNumJobs;
  #jobProgress;
  #progressBar;
  isTestInstance = false;

  constructor(appProgressBar, testing) {
    this.#totalNumJobs = 0;
    this.#jobProgress = 0;
    this.pages = new Map();
    this.mirrors = new Map();
    if (appProgressBar) this.#progressBar = appProgressBar;
    if (testing) this.isTestInstance = testing;
  }

  addJob() {
    this.#totalNumJobs++;
    if (!this.isTestInstance) this.#progressBar.setTotal(this.#totalNumJobs);
  }

  addPage(pName, pageStr) {
    this.pages.set(pName, pageStr);
  }

  incrementJobProgress() {
    this.#jobProgress++;
    if (!this.isTestInstance) this.#progressBar.update(this.#jobProgress);
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
