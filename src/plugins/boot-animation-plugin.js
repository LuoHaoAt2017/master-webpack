class BootAnimationPlugin {
    constructor(options) {

    }
    apply(compiler) {
        // console.log('compiler: ', compiler);
        // 此处监听webpack的compilation事件
        compiler.plugin('compilation', function (compilation) {
            // compilation 当前这一轮的编译结果，当依赖发生改变时触发新一轮的compilation。
            console.log('启动啦，启动啦，启动啦');
        });
        // 此处监听emit事件，emit事件发生时，代表文件的转换和组装已经完成。
        // 在此处可以读取到 webpack的输出结果(文件资源，代码块，模块，依赖)
        compiler.plugin('emit', function (compilation, callback) {
            console.log('广播事件');
            callback();
        });
    }
}
module.exports = BootAnimationPlugin;