const { Linter } = require('tslint');
const path = require('path');
const chalk = require('chalk');
const { resolveFile, tryReadFile, resolveGlobs } = require('./utils');

process.stdout.write(chalk.cyan('[tslint-plugin] Starting linter in separate process...\n'));

const options = JSON.parse(process.argv[2]) || {};

if (!options.files.length) {
  process.stdout.write(chalk.yellow.bold('\n[tslint-plugin] Incorrect `files` argument.\n\n'));
  process.exit();
}

const runnerOptions = Object.assign({
  format: options.format || 'webpackPluginCustom',
  formattersDirectory: path.join(__dirname, 'formatters'),
  tsConfigFile: 'tsconfig.json'
}, options);

let program;
if (options.typeCheck) {
  const tsconfigPath = resolveFile(options.tsConfigFile);
  program = Linter.createProgram(tsconfigPath);
}

const linter = new Linter(runnerOptions, program);
const files = resolveGlobs(options.files);

files.forEach((file) => {
  const contents = tryReadFile(file);
  if (contents !== undefined) {
    linter.lint(file, contents);
  }
});

process.stdout.write(chalk.green('[tslint-plugin] Linting complete.\n'));
process.send(linter.getResult());
process.exit();
