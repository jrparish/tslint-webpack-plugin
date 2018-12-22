const TSLintWebpackPlugin = require('tslint-webpack-plugin');

module.exports = {
  plugins: [
    new TSLintWebpackPlugin({ files: 'src/**/*.ts' })
  ],
  
  stats: {
    warnings: true
  }
};
