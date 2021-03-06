const path = require('path');
const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const config = require('./webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = WebpackMerge(config, {
    mode: 'production',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
        ]
    },
    devServer: {
        port: 8099,
        quiet: true,
        hot: false //关闭模块热替换
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.APP_URL': JSON.stringify('http://xxx')
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name][contenthash].css'
        })
    ]
});
