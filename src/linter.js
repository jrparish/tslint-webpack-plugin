const { Runner, run } = require('tslint/lib/runner');
const path = require('path');
const chalk = require('chalk');

const options = JSON.parse(process.argv[2]) || {};

function log(message) {
  if (!options.silent) {
    process.stdout.write(message);
  }
}

function runLinter(runnerOptions, write) {
  if (run) {
    const logger = {
      log: (message) => write(message),
      error: (message) => write(message)
    };

    return run(runnerOptions, logger);
  } else if (Runner) {
    return new Promise(resolve => {
      const runner = new Runner(runnerOptions, {write: write});
      runner.run(resolve);
    });
  } else {
    throw new Error('Unable to launch tslint. No suitable runner found.');
  }
}

log(chalk.cyan('[tslint-plugin] Starting linter in separate process...\n'));

if (!options.files.length) {
  log(chalk.yellow.bold('\n[tslint-plugin] Incorrect `files` argument.\n\n'));
  process.exit();
}

const runnerOptions = Object.assign({
  exclude: [],
  format: options.format || 'webpackPluginCustom',
  formattersDirectory: path.join(__dirname, 'formatters')
}, options);

runLinter(runnerOptions, log)
  .then(() => {
    log(chalk.green('[tslint-plugin] Linting complete.\n'));
    process.exit();
  }).catch(error => {
    log(chalk.red(`[tslint-plugin] Error starting linter: ${error}\n${error.stack}\n`));
  });
