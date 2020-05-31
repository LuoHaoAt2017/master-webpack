const WebpackMerge = require('webpack-merge');
const config = require('./webpack.config');

module.exports = WebpackMerge(config, {
    mode: 'production',
    devtool: 'source-map',
    devServer: {
        port: 8099
    }
});
