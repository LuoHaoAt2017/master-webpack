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
                test: /\.css$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: false //关闭样式的热替换
                    }
                }, 'css-loader']
            },
        ]
    },
    devServer: {
        port: 8099
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.APP_URL': JSON.stringify('http://xxx')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
});
