# master-webpack
webpack原理学习

将编译后的文件打包到内存。这就是为什么在开发的过程中，
你会发现dist目录没有打包后的代码，因为都在内存中。
原因就在于访问内存中的代码比访问文件系统中的文件更快，而且也减少了代码写入文件的开销。
当文件发生变化，就触发重新编译。同时还监听了每次编译结束的事件。
当监听到一次webpack编译结束，通过websoket给浏览器发送通知，检查下是否需要热更新。

### react-router 页面刷新，页面404。
将BrowserRouter改成HashRouter。

### 自己写一个webpack
