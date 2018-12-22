const path = require('path');
const chalk = require('chalk');
const { fork } = require('child_process');

function apply(options, compiler) {
  let linterProcess;
  let linterOutBuffer = [];

  function compileHook() {
    if (linterProcess && linterProcess.kill) {
      // Exits any outstanding child process if one exists
      linterProcess.kill();
    }

    let { files = [] } = options;

    if (!files.length) {
      process.stdout.write(chalk.yellow.bold('\n[tslint-plugin] No `files` option specified.\n'));
      return;
    }

    options.files = Array.isArray(files) ? files : [files];

    // Spawn a child process to run the linter
    linterOutBuffer = [];
    linterProcess = fork(path.resolve(__dirname, 'linter.js'), [JSON.stringify(options)], {
      silent: true
    });

    linterProcess.stdout.on('data', (message) => {
      if (message) {
        const msg = message.toString();

        if (msg.indexOf('tslint:') === 0) {
          const json = JSON.parse(msg.substring(7));

          for (let item of json) {
            linterOutBuffer.push(item);
          }
        } else if (msg.indexOf('tsinfo:') === 0) {
          process.stdout.write(chalk.cyan(`[tslint-plugin] ${msg.substring(7)}\n`));
        } else if (msg.indexOf('tserror:') === 0) {
          process.stderr.write(chalk.cyan(`[tslint-plugin] ${msg.substring(8)}\n`));
        } else {
          process.stderr.write(msg);
        }
      }
    });
  }

  function createError(message) {
    const error = new Error(message);
    delete error.stackTrace;
    return error;    
  }

  function emitHook(compilation, callback) {
    linterProcess.once('exit', () => {
      for (let r of linterOutBuffer) {
        const msg = `${r.name}:${r.startPosition.line + 1}:${r.startPosition.character + 1} [tslint] ${r.ruleName}: ${r.failure}`;

        if (r.ruleSeverity === 'ERROR' || options.warningsAsError) {
          compilation.errors.push(createError(msg));
        } else {
          compilation.warnings.push(createError(msg));
        }
      }

      callback();

      // Clean up the linterProcess when finished
      delete linterProcess;
    });
  }

  if (compiler.hooks) {
    // Webpack 4
    compiler.hooks.compile.tap('TSLintWebpackPlugin', compileHook);
    compiler.hooks.emit.tapAsync('TSLintWebpackPlugin', emitHook);
  } else {
    // Backwards compatibility
    compiler.plugin('compile', compileHook);
    compiler.plugin('emit', emitHook);
  }
}

module.exports = function TSLintWebpackPlugin(options = {}) {
  return {
    apply: apply.bind(this, options)
  };
};
