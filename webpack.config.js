const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');

function resolve(param) {
    return path.resolve(__dirname, param);
}

module.exports = {
    entry: {
        main: resolve('src/main.js')
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: resolve('dist')
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
                test: /\.scss$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: ['css-loader', 'sass-loader']
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
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html'),
            filename: 'index.html',
            hash: true
        }),
        new CleanWebpackPlugin()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: {
        minimizer: [
            new UglifyWebpackPlugin({
                test: /\.js$/i,
                parallel: true, // 并行构建，加快构建，缩短时间。
                include: resolve('src')
            })
        ]
    }
};
