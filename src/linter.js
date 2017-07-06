const { Runner, run } = require('tslint/lib/runner');
const path = require('path');
const chalk = require('chalk');

function runLinter(runnerOptions, stdout) {
  if (run) {
    const logger = {
      log: (message) => stdout.write(message),
      error: (message) => stdout.write(message)
    };

    return run(runnerOptions, logger);
  } else if (Runner) {
    return new Promise(resolve => {
      const runner = new Runner(runnerOptions, stdout);
      runner.run(resolve);
    });
  } else {
    throw new Error('Unable to launch tslint. No suitable runner found.');
  }
}

process.stdout.write(chalk.cyan('[tslint-plugin] Starting linter in separate process...\n'));

const options = JSON.parse(process.argv[2]) || {};

if (!options.files.length) {
  process.stdout.write(chalk.yellow.bold('\n[tslint-plugin] Incorrect `files` argument.\n\n'));
  process.exit();
}

const runnerOptions = Object.assign({
  format: 'custom',
  formattersDirectory: path.join(__dirname, 'formatters')
}, options);

runLinter(runnerOptions, process.stdout)
  .then(() => {
    process.stdout.write(chalk.green('[tslint-plugin] Linting complete.\n'));
    process.exit();
  });
