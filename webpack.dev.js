const path = require('path');
const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const config = require('./webpack.config');

module.exports = WebpackMerge(config, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 8090
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: ['style-loader','css-loader']
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'), //必须添加JSON.stringify
            'process.env.APP_URL': JSON.stringify('http://yyy')
        }),
        new BundleAnalyzerPlugin()
    ]
});
