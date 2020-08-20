html-webpack-plugin: 根据特定的模版创建html文件。

purgecss-webpack-plugin: css 的tree shaking。
mini-css-extract-plugin: 将css文件单独打包，从bundle.js中分离。
疑问：mini-css-extract-plugin分离css失效，
原因：https://www.cnblogs.com/marvelousone/p/12393013.html

webpack-uglifyjs-plugin: 多进程执行代码压缩，提升构建速度。
commons-chunk-plugin: 提取公共代码。
define-plugin: 定义环境变量。
clean-webpack-plugin: 每次编译前，清空上一次结果。
webpack-bundle-analyzer: 以可视化的方式呈现打包文件树，树的结构和大小。
speed-measure-webpack-plugin: 衡量loader和plugin的执行时间，找出瓶颈。
