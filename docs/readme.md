Loader和Plugin的区别：
使用方式和原理
https://juejin.im/post/5e6f4b4e6fb9a07cd443d4a5#heading-0

source-map
source-map 是将编译、打包、压缩后的代码映射回源代码的过程。
在不启用source-map的情况下，如果压缩后的代码报错，它只会提示错误
发生在那个chunk代码块中，并不能确切地定位到chunk中的某一个moudle。
