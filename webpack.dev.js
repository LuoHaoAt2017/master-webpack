const path = require('path');
const WebpackMerge = require('webpack-merge');
const config = require('./webpack.config');

module.exports = WebpackMerge(config, {
  mode: 'development',
  devServer: {
    port: 8090
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
    ]
  },
  plugins: [
  ]
});
