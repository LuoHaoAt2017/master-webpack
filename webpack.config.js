const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, 'src/main.js')
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
                use: [
                    "style-loader",
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        }
                    },
                    "css-loader",
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ],
                exclude: path.resolve(__dirname, 'node_modules'),
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 6291456,//默认单位为bytes
                        }
                    }
                ]
            },
            {
                test: /\.md$/,
                use: "raw-loader"
            },
        ]
    },
    devtool: 'inline-source-map', // 开发环境使用
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html'),
            filename: 'index.html',
            hash: true
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new CleanWebpackPlugin(),
        new OptimizeCSSAssetsPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
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
        minimizer: [
            new UglifyjsWebpackPlugin({
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules'),
                parallel: true,
                // sourceMap: true
            })
        ]
    }
};
