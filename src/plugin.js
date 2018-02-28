const path = require('path');
const chalk = require('chalk');
const { fork } = require('child_process');

function apply(options, compiler) {
  let linterProcess;

  function compileHook() {
    if (linterProcess && linterProcess.kill) {
      // Exits any outstanding child process if one exists
      linterProcess.kill();
    }
  }

  function doneHook() {
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
  }

  if (compiler.hooks) {
    // Webpack 4
    compiler.hooks.compile.tap('TSLintWebpackPlugin', compileHook);
    compiler.hooks.done.tap('TSLintWebpackPlugin', doneHook);
  } else {
    // Backwards compatibility
    compiler.plugin('compile', compileHook);
    compiler.plugin('done', doneHook);
  }
}

module.exports = function TSLintWebpackPlugin(options = {}) {
  return {
    apply: apply.bind(this, options)
  };
};
