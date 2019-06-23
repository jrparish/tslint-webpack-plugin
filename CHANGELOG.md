## 2.1.0
- Allow `project` to be specified as a config option instead of `files`

## 2.0.4
- Fix for SyntaxError: Unexpected token on error

## 2.0.3
- Handle errors with json parsing

## 2.0.2
- Correctly parse the logs from child process

## 2.0.1
- Fix typings

## 2.0.0
- The plugin waits for the linter to complete
- The child process redirects the output to the parent as json and the parent parses the json and adds the result to the compilation object
- The tslint should produce the results faster and warning and error handling is respected

## 1.3.0
- Added silent option

## 1.2.2
- Fixes for Typescript typings

## 1.2.1
- Added Typescript typings

## 1.2.0
- Added support for webpack 4, keeping backwards compatability
