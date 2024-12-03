import { default as cliProgress } from 'cli-progress';

const mainProgressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

export { mainProgressBar };
