const { Runner, run } = require('tslint/lib/runner');
const path = require('path');
const chalk = require('chalk');

const options = JSON.parse(process.argv[2]) || {};

function log(message) {
  if (!options.silent) {
    process.stdout.write(message);
  }
}

const logBuffer = [];

function trimEnd(value, character) {
  while (value.slice(-1) === character) {
    value = value.slice(0, -1);
  }

  return value;
}

function logBuffered(message) {
  if (!options.silent) {
    logBuffer.push(message);
  }
}

function flushLog() {
  for (let i = 0; i < logBuffer.length; i++) {
    const message = logBuffer[i];

    if (i === logBuffer.length - 1) {
      process.stdout.write(trimEnd(message, '\n'));
    } else {
      process.stdout.write(message);
    }
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

const runnerOptions = Object.assign({
  exclude: [],
  format: options.format || 'webpackPluginCustom',
  formattersDirectory: path.join(__dirname, 'formatters')
}, options);

runLinter(runnerOptions, logBuffered)
  .then(() => {
  }).catch(error => {
    log(chalk.red(`[tslint-plugin] Error starting linter: ${error}\n${error.stack}\n`));
  });

process.on('message', msg => {
  if (msg === 'flush') {
    log(chalk.green('[tslint-plugin] Linting complete.'));
    flushLog();
    process.exit();
  }
});