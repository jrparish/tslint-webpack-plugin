const path = require('path');
const chalk = require('chalk');
const { fork } = require('child_process');

function apply(options, compiler) {
  compiler.plugin('done', function () {
    let { files = [] } = options;

    if (!files.length) {
      process.stdout.write(chalk.yellow.bold('\n[tslint-plugin] No `files` option specified.\n\n'));
      return;
    }

    fork(path.resolve(__dirname, 'linter.js'), [files]);
  });
}

module.exports = function TSLintWebpackPlugin(options = {}) {
  return {
    apply: apply.bind(this, options)
  };
};
