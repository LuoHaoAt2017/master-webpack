const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, 'src/main.js'),
        //app: path.resolve(__dirname, 'src/server/index.js'),
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader'],
                include: path.resolve(__dirname, 'src'),
                sideEffects: false
            },
            {
                test: /\.(css|scss)$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jpg|png|svg)$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
        }),
        new CleanWebpackPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        port: 3000,
        hot: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
            }),
        ],
        splitChunks: {
            name: 'commons',
            chunks: 'async',
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
        }
    }
};
