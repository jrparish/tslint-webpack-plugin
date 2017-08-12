const Lint = require('tslint');
const chalk = require('chalk');

const Formatter = (function Formatter(_super) {

  Object.assign(Formatter, _super);

  function Formatter(...args) {
    _super.apply(this, args);
  }

  Formatter.prototype.format = function format(failures) {
    let previousFileName;

    const outputLines = failures.map(failure => {
      const fileName = failure.getFileName();
      const failureString = failure.getFailure();
      const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
      const positionTuple = `${lineAndCharacter.line + 1},${lineAndCharacter.character + 1}`;
      const sameAsPrevFile = fileName === previousFileName;
      const severity = failure.getRuleSeverity();
      const severityColor = severity === 'warning' ? 'blue' : 'red';

      previousFileName = fileName;

      return `${sameAsPrevFile ? '' : `\n${chalk.yellow.bold(fileName)}\n`}` +
        `[${chalk[severityColor](`${severity.charAt(0).toUpperCase() + severity.slice(1)} ${positionTuple}`)}]: ` +
        `${chalk.yellow.dim(failureString)} ` +
        `(${chalk.grey(failure.getRuleName())})`;
    });

    return outputLines.length ? `${outputLines.join('\n')}\n\n` : '';
  };

  return Formatter;

})(Lint.Formatters.AbstractFormatter);

exports.Formatter = Formatter;
