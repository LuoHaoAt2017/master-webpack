### 常见的loader
babel-loader 将ES6转换成ES5
eslint-loader ES语法检测
style-loader, css-loader, sass-loader
url-loader 处理小图片，将小图片转换成Base64编码
file-loader 加载图片，文字

### vue专用loader
vue-loader 加载vue单文件组件

### typescript专用loader
ts-loader 将ts转换成es
tslint-loader TS语法检测

### style-loader
只在开发环境下使用，生产环境没有必要。因为代码已经打包啦，不会再去修改代码。
在开发环境下，如果不配置style-loader，地球会爆炸。这涉及到样式文件的HMR。
样式文件的 HMR 是指什么呢？如果没有配置 HMR，开发模式下，修改 CSS 源文件的时候，页面并不会自动刷新加载修改后的样式。需要手动刷新页面，才会加载变化。而 HMR 实现了被修改模块的热更新，使得变化即时显示在页面上，不再需要刷新整个页面。

### thread-loader
首先使用SpeedMeasurePlugin插件找出在编译时，哪些loader耗时最长。
将thread-loader放置到这些耗时的loader之前。采取多进程加快翻译。
