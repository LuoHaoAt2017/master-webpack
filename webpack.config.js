const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const LifeCyclePlugin = require('./src/plugins/life-cycle-plugin');

function resolve(param) {
  return path.resolve(__dirname, param);
}

module.exports = {
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
    new LifeCyclePlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      filename: 'index.html',
      hash: true
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${resolve('src')}/**/*`, { nodir: true })
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
};
