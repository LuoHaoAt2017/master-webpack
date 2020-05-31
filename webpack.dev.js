const path = require('path');
const WebpackMerge = require('webpack-merge');
const config = require('./webpack.config');

module.exports = WebpackMerge(config, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 8090
    }
});
