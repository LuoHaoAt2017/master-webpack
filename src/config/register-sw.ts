/* eslint-disable no-console */
import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register('/sw.js', {
    ready () {
      console.log(
        'H3m application is serving',
      );
    },
    registered () {
      console.log('H3m-sw has been registered.');
    },
    cached () {
      console.log('资源已缓存');
    },
    updatefound () {
      console.log('氚云已更新，正在获取最新资源');
    },
    offline () {
      console.log('无网络连接，资源正在离线访问中');
    },
    error (error) {
      console.error('sw register error', error);
    },
  });
}
