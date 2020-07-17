const path = require('path');
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const VConsoleWebpackPlugin = require('vconsole-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const H3YunStaticLibraryPlugin = require('@h3yun/static-library-plugin');
const SentryPlugin = require('@sentry/webpack-plugin');
const WebpackBar = require('webpackbar');
const lessVars = require('@h3/theme-mobile/presets/h3yun/default');
const env = require('./build/config');
const utils = require('./build/utils');
const speedMeasure = new SpeedMeasurePlugin();

const webpackPluginArr = [];
if (process.env.NODE_ENV === 'production') {
  webpackPluginArr.push(
    new SentryPlugin({
      release: env.assetsSubDirectory,
      urlPrefix: env.assetsPublicPath,
      include: './dist',
      ignore: ['node_modules', 'vue.config.js'],
    }),
  );
}

/* eslint-disable no-useless-escape */
module.exports = {
  pages: {
    app: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: '氚云移动端',
      chunks: ['app', 'vendors', 'h3comp'],
    },
  },
  transpileDependencies: [
    'h3yun-formlogic',
  ],
  configureWebpack: speedMeasure.wrap({
    devtool: env.devtool,
    plugins: [
      ...webpackPluginArr,
      new webpack.DefinePlugin({
        'process.env.H3_ENV': JSON.stringify(process.env.H3_ENV),
        'process.env.PUBLIC_PATH': JSON.stringify(env.assetsPublicPath),
        'process.env.ASSETS_DIR': JSON.stringify(env.assetsSubDirectory),
        'process.env.RESOURCE_URL': JSON.stringify(process.env.H3_ENV === 'release' ? env.resourceUrl : env.resourceTestUrl), // eslint-disable-line
      }),
      // 兼容旧版代码中的jquery，
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
      }),
      new VConsoleWebpackPlugin({
        enable: process.env.H3_ENV === 'stage',
      }),
      new WebpackBar({
        color: '#107fff',
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'static'),
          to: env.assetsSubDirectory,
          ignore: ['.*'],
        },
      ]),
      new H3YunStaticLibraryPlugin({
        cdnHost:
          process.env.H3_ENV === 'release'
            ? env.resourceUrl
            : env.resourceTestUrl,
        libs: {
          bundle: {
            version: '1.0.3',
            min: process.env.NODE_ENV === 'production',
          },
          jquery: {
            min: true,
            version: '3.4.1',
          },
          sentry: {
            version: '1.0.3',
            min: true,
          },
        },
        pwa: true,
      }),
    ],
    externals: utils.externals,
    optimization: {
      runtimeChunk: false,
      minimize: true,
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -5,
            chunks: 'initial',
            minChunks: 1,
            reuseExistingChunk: true,
          },
          h3comp: {
            name: 'h3comp',
            test: /[\\/]node_modules[\\/](h3-mobile-vue)/,
            priority: -10,
            chunks: 'all',
            minChunks: 2,
          },
        },
      },
    },
  }),
  chainWebpack: config => {
    config.resolve.symlinks(false); // 修复热更新失效
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.common.js')
      .set('@', path.join(__dirname, 'src'))
      .set('packages', path.join(__dirname, 'packages'))
      .set('src', path.join(__dirname, 'src'))
      .set('jquery', 'jquery');
    // vue-loader 不删除标签之间的空格，兼容之前的配置
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options =>
        Object.assign(options, {
          compilerOptions: {
            previewWhiteSpace: true,
          },
        }),
      );
    config.module
      .rule('js')
      .use('thread-loader');
    config.module
      .rule('js')
      .test(/\.m?jsx?$/)
      .include.add(path.join(__dirname, 'src'))
      .add(path.join(__dirname, 'packages'))
      .add(path.join(__dirname, 'node_modules/webpack-dev-server/client'))
      .add(path.join(__dirname, 'node_modules/h3-template-detail/packages'))
      .add(path.join(__dirname, 'node_modules/h3yun-formlogic'))
      .add(path.join(__dirname, 'node_modules/h3-mobile-vue/src'))
      .add(path.join(__dirname, 'node_modules/@h3/report'))
      .add(path.join(__dirname, 'node_modules/@h3/thinking-ui'))
      .end()
      .exclude.clear();
    config.plugin('html-app').tap(args => {
      const opts = args[0];
      return [
        Object.assign(opts, {
          baseUrl: env.assetsPublicPath,
          lastModified: new Date().getTime(),
          version: env.version,
        }),
      ];
    });
    config.plugins.delete('prefetch-app');
    config.plugins.delete('progress');
    config.module
      .rule('ts')
      .test(/\.ts$/)
      .include.add(path.join(__dirname, 'src'))
      .add(path.join(__dirname, 'node_modules/h3-template-detail/packages'))
      .add(path.join(__dirname, 'node_modules/h3yun-formlogic'))
      .add(path.join(__dirname, 'node_modules/@h3/thinking-ui'))
      .add(path.join(__dirname, 'node_modules/@h3/report'));
    config.module
      .rule('ts')
      .use('thread-loader');
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options =>
        Object.assign(options, {
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory([
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
              ]),
            ],
          }),
        }),
      );
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compress').use(CompressionWebpackPlugin, [
        {
          filename: '[path].gz[query]',
          test: /\.(js|css)$/,
          threshold: 10240,
          minRatio: 0.8,
        },
      ]);
      if (process.env.BUNDLE_REPORT) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
          .BundleAnalyzerPlugin;
        config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
          {
            analyzerPort: 33669,
          },
        ]);
      }
    }
  },
  devServer: {
    hot: true,
    compress: true,
    // host: env.host || 'localhost',
    // port: env.port || 6595,
    open: env.autoOpenBrowser,
    overlay: env.errorOverlay ? { warnings: false, errors: true } : false,
    disableHostCheck: true,
    proxy: {
      '/apis': {
        // 不要在这里修改配置，通过env.local.json修改你的本地自定义配置
        target: env.proxyApiTarget,
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/apis': '' },
      },
      ...utils.getDevServers(env.devEnvs),
    },
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: env.poll,
    },
  },
  productionSourceMap: !!env.devtool,
  lintOnSave: env.lintOnSave,
  publicPath: env.assetsPublicPath,
  assetsDir: env.assetsSubDirectory,
  css: {
    sourceMap: env.cssSourceMap,
    loaderOptions: {
      less: {
        ...lessVars,
        javascriptEnabled: true,
      },
    },
  },
  outputDir: 'dist',
};
