const path = require('path');
const chalk = require('chalk');
const { fork } = require('child_process');

function apply(options, compiler) {
  let linterProcess;
  const { files = [] } = options;

  if (!files.length) {
    process.stdout.write(chalk.yellow.bold('\n[tslint-plugin] No `files` option specified.\n\n'));
    return;
  }

  options.files = Array.isArray(files) ? files : [files];

  compiler.plugin('compile', () => {
    if (linterProcess && linterProcess.kill) {
      // Exits any outstanding child process if one exists
      linterProcess.kill();
    }
  });

  compiler.plugin('emit', (compilation, callback) => {
    // Spawn a child process to run the linter
    linterProcess = fork(path.resolve(__dirname, 'linter.js'), [JSON.stringify(options)]);

    // Record status updates
    linterProcess.on('message', (msg) => {
      console.log(msg);
    });

    // Clean up the linterProcess when finished
    linterProcess.once('exit', () => {
      linterProcess = undefined;
    });


    // compilation.error.push('You Failed');
    callback();
  });

  compiler.plugin('done', () => {

  });
}

module.exports = function TSLintWebpackPlugin(options = {}) {
  return {
    apply: apply.bind(this, options)
  };
};
