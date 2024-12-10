import { default as minimist } from 'minimist';

import { AppState } from './state.js';
import { appConfig, loadArgsToConfig } from './config.js';
import { mainProgressBar } from './progress.js';
import { main } from './main.js';

const mainState = new AppState(mainProgressBar);
const mainConfig = loadArgsToConfig(appConfig, minimist(process.argv.slice(2)));

main(mainState, mainConfig);
