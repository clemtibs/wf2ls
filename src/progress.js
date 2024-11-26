const cliProgress = require('cli-progress');

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

module.exports = {
  bar
}
