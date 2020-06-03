const path = require('path');
const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const config = require('./webpack.config');
const SizePlugin = require('size-plugin');

module.exports = WebpackMerge(config, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 8090,
        quiet: false,
        hot: true //开启模块热替换
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: ['style-loader','css-loader', 'sass-loader']
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'), //必须添加JSON.stringify
            'process.env.APP_URL': JSON.stringify('http://yyy')
        }),
        new SizePlugin(),
        new BundleAnalyzerPlugin()
    ]
});
