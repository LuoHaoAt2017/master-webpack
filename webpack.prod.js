const path = require('path');
const WebpackMerge = require('webpack-merge');
const config = require('./webpack.config');

module.exports = WebpackMerge(config, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: ['css-loader', 'sass-loader']
      },
    ]
  },
  devServer: {
    port: 8099
  },
  plugins: [
  ]
});
