class AppState {
  #totalNumJobs;
  #jobProgress;
  #progressBar;

  constructor(appProgressBar) {
    this.#totalNumJobs = 0;
    this.#jobProgress = 0;
    this.pages = new Map();
    this.mirrors = new Map();
    this.#progressBar = appProgressBar;
  }

  addJob() {
    this.#totalNumJobs++;
    this.#progressBar.setTotal(this.#totalNumJobs);
  }

  addPage(pName, pageStr) {
    this.pages.set(pName, pageStr);
  }

  incrementJobProgress() {
    this.#jobProgress++;
    this.#progressBar.update(this.#jobProgress);
  }

  startProgressBar() {
    this.#progressBar.start(this.#totalNumJobs, 0);
  }

  stopProgressBar() {
    this.#progressBar.stop();
  }
}

export { 
  AppState
};
