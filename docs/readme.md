### Webpack构建流程
- 初始化：
读取命令行上的参数，合并参数，实例化plugin。

- 编译阶段：
初始化一个compiler对象，通过插件的apply方法加载插件，通过compiler.run执行编译。
根据entry找到入口，从入口模块开始调用loader对模块进行翻译，如果模块之间存在依赖，
对依赖的模块也调用loader进行翻译。编译完成之后得到编译的内容以及模块之间的依赖关系。

- 输出资源
根据模块之间的依赖关系，组装代码块。根据出口将资源输出到指定的文件目录下，一般是dist。

### 模块规范
Common.js
ES6 Module

模块异步加载
按需加载(懒加载)

如何判断哪些代码是异步
如何去执行异步代码

以异步的方式引入一个模块，这个模块以及其依赖的模块会单独打包成一个chunk。

### Loader和Plugin的区别：
作用不同

使用方式

参考：https://juejin.im/post/5e6f4b4e6fb9a07cd443d4a5#heading-0

### source-map的作用
source-map 是将编译、打包、压缩后的代码映射回源代码的过程。
在不启用source-map的情况下，如果压缩后的代码报错，它只会提示错误
发生在那个chunk代码块中，并不能确切地定位到chunk中的某一个moudle。

### 如何优化 Webpack 的构建速度
- 使用高版本的 Webpack
- 提取页面公共资源
- 缩小打包作用域 (exclude/include)
- 多进程构建 thread-loader
- 多进程并行压缩 webpack-uglify-js-plugin 中的paralle选项

### 文件监听原理
轮询判断文件的最后编辑时间是否变化，如果某个文件发生了变化，
并不会立刻告诉监听者websocket，而是先缓存起来，等 aggregateTimeout 后再执行。

- 开启watch: true
- 配置watchOptions
当文件发生变化时，并不会立刻去执行更新，而是需要等待一段时间。
这段时间的长度在watchOptions中aggregateTimeout中配置。

### Webpack 的热更新原理
webpack-dev-server 与浏览器之间维护了一个 Websocket，当本地资源发生变化时，
WDS 会向浏览器推送更新，并带上构建时的 hash，让浏览器与上一次资源进行对比。
浏览器对比出差异后会向 WDS 发起请求来获取该chunk的增量更新。

### 代码分割
两种极端方案
- 源代码直接上线：过程可控，但是http请求多。
- 打包成唯一脚本：服务器压力小，但是页面空白期长，用户体验不好。

### 自定义plugin

- Webpack打包的代码为什么可以直接在浏览器中跑
- 为什么webpack可以支持ES6语法
- 为什么在webpack中可以书写import ES6模块，也支持require CommonJS模块？

Webpack的构建过程大致分为三个阶段，初始化阶段，编译阶段，输出阶段。
每一个阶段都会广播各种事件，事件被插件监听，插件作出相应的改变。
未完待续...

### 自定义loader
