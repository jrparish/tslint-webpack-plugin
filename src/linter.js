const { Runner, run } = require('tslint/lib/runner');

const options = JSON.parse(process.argv[2]) || {};

function logToParent(message) {
<<<<<<< HEAD
  process.stdout.write(message + '\n');
=======
  process.stdout.write(message);
>>>>>>> 79c11ae35d9f0b55b5a190f216eabdfcc795378e
}

function runLinter(runnerOptions, write) {
  const logTsLint = message => {
    write('tslint:' + message)
  };

  if (run) {
    const logger = { log: logTsLint, error: logTsLint };

    return run(runnerOptions, logger);
  } else if (Runner) {
    return new Promise(resolve => {
      new Runner(runnerOptions, { write: logTsLint }).run(resolve);
    });
  } else {
    write('tsinfo:Unable to launch tslint. No suitable runner found.');
  }
}

logToParent('tsinfo:Linting started in separate process...');

const runnerOptions = Object.assign({
  exclude: [],
  format: 'json'
}, options);

runLinter(runnerOptions, logToParent)
  .then(() => {
    logToParent('tsinfo:Linting complete.');

    process.exit();
  }).catch(error => {
    logToParent(`tserror:Error starting linter: ${error}\n${error.stack}`);
  });