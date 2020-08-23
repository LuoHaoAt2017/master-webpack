
class LifeCyclePlugin {
  constructor(options) {

  }
  apply(compiler) {
    // 初始化阶段
    compiler.plugin('entry-option', function() {
      console.log('读取配置的入口，为每一个入口实例化一个入口插件，为入口的递归解析做准备。');
    });
    compiler.plugin('after-plugins', function() {
      console.log('调用完所有内置的和配置的插件的apply方法。');
    });

    // 编译阶段
    compiler.plugin('run', function() {
      console.log('启动一次新的编译');
    });
    compiler.plugin('watch-run', function() {
      console.log('在监听模式下，部分文件发生变化导致重新编译。');
    });
    compiler.plugin('compile', function() {
      console.log('一次新的编译即将启动');
    });
    compiler.plugin('compilation', function() {
      // 编译阶段最重要的事件，compilation阶段调用loader对文件进行转换。
      console.log('在开发模式下，当检测到文件发生变化时，一次新的compilation被创建。');
    });
    compiler.plugin('make', function() {
      console.log('一次compilation创建完毕，即将从入口开始递归地读取文件。');
    });
    compiler.plugin('after-compile', function() {
      console.log('一次compilation执行完毕。');
    });

    // 输出阶段
    compiler.plugin('emit', function (compilation, callback) {
      console.log(`
                0                    0        0  0  0  0  0\n
                0                    0                      0\n
                0                    0                       0\n
                0                    0                       0\n
                0                    0                       0\n
                 0                  0                       0\n
                   0  0  0  0  0  0          0  0  0  0  0  0\n
                 0                  0                       0\n
                0                    0                       0\n
                0                    0                       0\n
                0                    0                       0\n
                0                    0                     0\n
                0                    0       0  0  0  0  0\n
            `);
      callback();
    });
    compiler.plugin('after-emit', function() {
      console.log('文件输出完毕');
    });
    compiler.plugin('done', function() {
      console.log('成功完成一次完整的编译和输出流程');
    });
    compiler.plugin('failed', function () {
      console.log('在编译和输出的过程中遇到异常导致webpack退出。');
    });
  }
}

module.exports = LifeCyclePlugin;