const TSLintWebpackPlugin = require('tslint-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: [
    new TSLintWebpackPlugin({ files: 'src/**/*.ts' })
  ]
};
