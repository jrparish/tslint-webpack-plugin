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
      const positionTuple = `[${lineAndCharacter.line + 1}, ${lineAndCharacter.character + 1}]`;
      const sameAsPrevFile = fileName === previousFileName;

      previousFileName = fileName;

      return `${sameAsPrevFile ? '' : `\n${chalk.yellow.bold(fileName)}\n`}` +
        `${positionTuple}: ` +
        `${chalk.cyan(failureString)}`;
    });

    return `${outputLines.join('\n')}\n\n`;
  };

  return Formatter;

})(Lint.Formatters.AbstractFormatter);

exports.Formatter = Formatter;
