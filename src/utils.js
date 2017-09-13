const path = require('path');
const fs = require('fs');
const glob = require('glob');
const { arrayify, flatMap } = require('tslint/lib/utils');

module.exports.resolveFile = function resolveFile(configPath) {
  return path.isAbsolute(configPath)
    ? configPath
    : path.resolve(process.cwd(), configPath);
};

module.exports.tryReadFile = function tryReadFile(filename) {
  const buffer = new Buffer(256);
  const fd = fs.openSync(filename, 'r');
  try {
    fs.readSync(fd, buffer, 0, 256, 0);
    if (buffer.readInt8(0, true) === 0x47 && buffer.readInt8(188, true) === 0x47) {
      // MPEG transport streams use the '.ts' file extension. They use 0x47 as the frame
      // separator, repeating every 188 bytes. It is unlikely to find that pattern in
      // TypeScript source, so tslint ignores files with the specific pattern.
      process.stdout.write(`${filename}: ignoring MPEG transport stream`);
      return undefined;
    }
  } finally {
    fs.closeSync(fd);
  }

  return fs.readFileSync(filename, 'utf8');
};

function trimSingleQuotes(str) {
  return str.replace(/^'|'$/g, '');
}

module.exports.resolveGlobs = function resolveGlobs(files, ignore, outputAbsolutePaths) {
  return flatMap(arrayify(files), file =>
    glob.sync(trimSingleQuotes(file), { ignore, nodir: true }))
    .map(file => (outputAbsolutePaths ? path.resolve(file) : path.relative(process.cwd(), file)));
};

