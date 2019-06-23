const TSLintWebpackPlugin = require('tslint-webpack-plugin');

module.exports = {
  plugins: [
    new TSLintWebpackPlugin({
      files: 'src/**/*.ts'
      // project: 'tsconfig.json'
    })
  ],

  stats: {
    warnings: true
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  }
};
