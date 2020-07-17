const path = require('path');
const webpack = require('webpack');
const env = require('./build/config');
const {VueLoaderPlugin} = require('vue-loader');
const tsImportPluginFactory = require('ts-import-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const VConsoleWebpackPlugin = require('vconsole-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const lessVars = require('@h3/theme-mobile/presets/h3yun/default');
const measure = new SpeedMeasurePlugin();

function resolve(name) {
    return path.resolve(__dirname, name);
}

module.exports = measure.wrap({
    mode: 'development',
    entry: resolve("src/main.ts"),
    output: {
        filename: "[name].bundle.js",
        path: resolve("dist")
    },
    module: {
        rules: [
            {
                test: /.vue$/,
                use: ['vue-loader'],
            },
            {
                test: /.js$/,
                use: ['thread-loader', 'babel-loader'],
                include: [
                    resolve('src'),
                    resolve('packages'),
                    resolve('node_modules/h3-template-detail/packages'),
                    resolve('node_modules/h3yun-formlogic'),
                    resolve('node_modules/h3-mobile-vue/src'),
                    resolve('node_modules/@h3/report'),
                    resolve('node_modules/@h3/thinking-ui')
                ]
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    allowTsInNodeModules: true,
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [ tsImportPluginFactory([
                            {
                                libraryName: '@h3/report',
                                libraryDirectory: 'lib',
                                style: false,
                            },
                            {
                                libraryName: '@h3/thinking-ui',
                                libraryDirectory: 'lib',
                                style: true,
                            },
                        ]) ]
                    }),
                    compilerOptions: {
                        module: 'es2015'
                    }
                },
            },
            {
                test: /.(less|css)$/,
                use: ['style-loader', 'css-loader', {
                    loader: 'less-loader',
                    options: {
                        ...lessVars,
                        javascriptEnabled: true
                    }
                }]
            },
            {
                test: /.(png|jpg|svg|jpeg|gif)$/,
                use: ['file-loader'],
                include: [
                    resolve('src'),
                    resolve('packages'),
                    resolve('node_modules/photoswipe'),
                    resolve('node_modules/h3-mobile-vue'),
                    resolve('node_modules/@h3/report'),
                    resolve('node_modules/@h3/thinking-ui/node_modules/@h3/theme-mobile')
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }
        ]
    },
    resolve: {
        alias: {
            '@': resolve('src'),
            'src': resolve('src'),
            'vue$': 'vue/dist/vue.common.js',
            'packages': resolve('packages'),
            'jquery': 'jquery'
        },
        extensions: ['.ts', '.js', '.vue']
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: resolve('public/index.html')
        }),
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.H3_ENV': JSON.stringify(process.env.H3_ENV),
            'process.env.PUBLIC_PATH': JSON.stringify(env.assetsPublicPath),
            'process.env.ASSETS_DIR': JSON.stringify(env.assetsSubDirectory),
            'process.env.RESOURCE_URL': JSON.stringify(process.env.H3_ENV === 'release' ? env.resourceUrl : env.resourceTestUrl), // eslint-disable-line
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
        }),
        new VConsoleWebpackPlugin({
            enable: process.env.H3_ENV === 'stage',
        })
    ]
});