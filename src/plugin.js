const path = require('path');
const chalk = require('chalk');
const { fork } = require('child_process');

function apply(options, compiler) {
  let linterProcess;

  compiler.hooks.compile.tap('TSLintWebpackPlugin', function () {
    if (linterProcess && linterProcess.kill) {
      // Exits any outstanding child process if one exists
      linterProcess.kill();
    }
  });

  compiler.hooks.done.tap('TSLintWebpackPlugin', function () {
    let { files = [] } = options;

    if (!files.length) {
      process.stdout.write(chalk.yellow.bold('\n[tslint-plugin] No `files` option specified.\n\n'));
      return;
    }

    options.files = Array.isArray(files) ? files : [files];

    // Spawn a child process to run the linter
    linterProcess = fork(path.resolve(__dirname, 'linter.js'), [JSON.stringify(options)]);

    // Clean up the linterProcess when finished
    linterProcess.once('exit', () => delete linterProcess);
  });
}

module.exports = function TSLintWebpackPlugin(options = {}) {
  return {
    apply: apply.bind(this, options)
  };
};
