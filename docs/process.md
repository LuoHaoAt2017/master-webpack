### Webpack构建流程

- 初始化：
读取命令行上的参数，合并参数，实例化plugin。

- 编译阶段：
初始化一个compiler对象，通过插件的apply方法加载插件，通过compiler.run执行编译。
根据entry找到入口，从入口模块开始调用loader对模块进行翻译，如果模块之间存在依赖，
对依赖的模块也调用loader进行翻译。编译完成之后得到编译的内容以及模块之间的依赖关系。

- 输出资源
根据模块之间的依赖关系，组装代码块。根据出口将资源输出到指定的文件目录下，一般是dist。

### 事件和插件
Webpack的构建过程大致分为三个阶段，初始化阶段，编译阶段，输出阶段。
每一个阶段都会广播各种事件，事件被插件监听，插件作出相应的改变。
未完待续...

### 高阶内容
webpack生命周期钩子
官方文档
https://webpack.docschina.org/api/compiler-hooks/

compliation
模块创建
依赖收集
分块
打包

plugin是webpack的基石