const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 将未用到的css进行清除(css的Tree-Shaking)
const PurgecssPlugin = require('purgecss-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

function resolve(param) {
    return path.resolve(__dirname, param);
}

module.exports = smp.wrap({
    watch: true, // 开启监听模式，文件发生变化，重新编译，webpack-dev-server 默认开启监听模式。
    watchOptions: {
        // 不监听的文件或者文件夹
        ignored: /node_modules/,
        // 监听到变化发生后会等300ms再去执行，默认300ms
        aggregateTimeout: 300,
        // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
        poll: 1000
    },
    entry: {
        main: resolve('src/main.js')
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['thread-loader', 'babel-loader'],
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name][hash:8].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ],
                exclude: path.resolve(__dirname, 'node_modules'),
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name][hash:8].[ext]',
                            outputPath: 'fonts/'
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
            template: resolve('./public/index.html'),
            favicon: resolve('./public/logo.ico'),
            filename: 'index.html',
            hash: true,
        }),
        new CleanWebpackPlugin(),
        new PurgecssPlugin({
            paths: glob.sync(`${resolve('src')}/**/*`, { nodir: true })
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: {
        minimizer: [
            new UglifyWebpackPlugin({
                test: /\.js$/,
                parallel: true, // 并行构建，加快构建，缩短时间。
                include: resolve('src')
            })
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendor", //第三方库
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 10 // 优先级
                },
                common: {
                    name: "common", //公共代码
                    test: /[\\/]src[\\/]/,
                    minSize: 1024,
                    chunks: "all",
                    priority: 5
                }
            }
        },
    }
});
