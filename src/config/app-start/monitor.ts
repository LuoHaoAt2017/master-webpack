
// const initMonitor = () => {
//   let url = '/MobileService/WriteLog';
//   url = process.env.NODE_ENV !== 'production' ? `apis${url}` : url;
//   const monitor = new Monitor({
//     itemID: 'authine', // 唯一的项目Id
//     url, // 若autoPush为true 则自动上报异常 ，跨域需要配置
//     autoPush: false, // 是否自动上报异常 ，默认为false
//     match: [
//       'https://www.h3yun.com',
//       'https://kappa.h3yun.cpm',
//       'https://swork.h3yun.com',
//       'https://master.h3yun.com',
//     ], // 需要上报的域名 开发环境下可以不选择上报
//     exclude: [], // 过滤的错误信息 根据details字段
//   });
//   monitor
//     .addPlugin(vuePlugin) // 添加vueError监听 根据errorHandler函数
//     .install()
//     .on('captureBefore', (data) => {
//       // 上报异常触发的回调 data 是上报的参数
//       console.log(data);
//     })
//     .on('onPointClick', (data) => {
//       // action = '{ "type":"adButton",name:"广告位点击" }'
//       console.log(data.value);
//       console.log(data);
//     });
//   // 设置
//   monitor.setConfig({
//     engineCode: window.GlobalConfig.engineCode,
//     corpId: window.GlobalConfig.corpId,
//   });
// }