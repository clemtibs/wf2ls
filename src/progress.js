const cliProgress = require('cli-progress');

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

let totalNumNodes = 0;

module.exports = {
  bar,
  totalNumNodes
}
