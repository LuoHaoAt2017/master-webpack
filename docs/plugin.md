plugin的工作原理
webpack启动后在读取webpack.config.js配置文件的过程中会去实例化plugin。
webpack在compiler初始化完成后(可以将compiler理解为webpack实例)，依次
执行插件的apply方法。apply方法接受compiler作为参数。至此，插件就获取到了
compiler的引用。插件通过compiler('event', handler)的方式有选择地监听
webpack在构建过程中广播的事件，执行回调函数。
可以看到compiler是架设在webpack和plugin之间的桥梁。

compiler的监听和广播事件
能够使用compiler.plugin('event', callback)的方式来监听webpack广播的事件。
能够使用compiler.plugin('emit', function(compiler, callback))的方式广播事件。

webpack常用的API
1. 监听文件的变化
2. 读取输出的资源
3. 修改输出的资源
4. 判断webpack使用了哪些插件
