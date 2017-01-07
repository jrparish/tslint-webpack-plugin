const { Runner } = require('tslint/lib/runner');
const path = require('path');
const chalk = require('chalk');

function apply(options, compiler) {
  compiler.plugin('done', function () {
    let { files = [] } = options;

    if (!files.length) {
      process.stdout.write(chalk.yellow.bold('TSLintWebpackPlugin: No `files` option specified.\n\n'));
      return;
    }

    if (!Array.isArray(files)) {
      files = [files];
    }

    const runner = new Runner({
      files,
      format: 'custom',
      formattersDirectory: path.join(__dirname, 'formatters')
    }, process.stdout);

    runner.run(() => { });
  });
}

module.exports = function TSLintWebpackPlugin(options = {}) {
  return {
    apply: apply.bind(this, options)
  };
};
