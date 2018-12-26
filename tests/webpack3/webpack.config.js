const TSLintWebpackPlugin = require('tslint-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: 'dist/test.js'
  },
  plugins: [
    new TSLintWebpackPlugin({ files: 'src/**/*.ts' })
  ],
  stats: {
    warnings: true
  }
};
