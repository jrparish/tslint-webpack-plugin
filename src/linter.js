const { Runner } = require('tslint/lib/runner');
const path = require('path');
const chalk = require('chalk');

process.stdout.write(chalk.cyan('\n[tslint-plugin] Starting linter in separate process...\n'));

let files = process.argv[2] || [];

if (!files.length) {
  process.stdout.write(chalk.yellow.bold('\n[tslint-plugin] Incorrect `files` argument.\n\n'));
  process.exit();
}

if (!Array.isArray(files)) {
  files = [files];
}

const runner = new Runner({
  files,
  format: 'custom',
  formattersDirectory: path.join(__dirname, 'formatters')
}, process.stdout);

runner.run(() => {
  process.stdout.write(chalk.green('\n[tslint-plugin] Linting complete.\n\n'));
  process.exit();
});
