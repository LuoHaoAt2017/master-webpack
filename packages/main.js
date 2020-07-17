// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import FastClick from 'fastclick';
import App from './App';
import router from './router';
import store from './vuex/store';
import toastPlugin from './plugins/toast';
import datetime from './plugins/datetime';
import modal from './plugins/modal';
import './utils/flexible';

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body);
  }, false);
}

Vue.config.productionTip = false;
// Vue.use(toastPlugin);
// Vue.use(datetime);
// Vue.use(modal);
/* eslint-disable no-new */
const methods = ['push', 'go', 'replace', 'forward', 'back'];

methods.forEach((key) => {
  const method = router[key].bind(router);
  router[key] = (...args) => {
    if (key === 'push' || key === 'forward') {
      // console.log('forward');
      // router.direction = 'forward';
      store.commit('UPDATE_DIRECTION', 'forward');
    } else if (key === 'back' || key === 'go') {
      // console.log('back');
      // router.direction = 'back';
      store.commit('UPDATE_DIRECTION', 'back');
    }
    method(...args);
  };
});

new Vue({
  el: '#app',
  store,
  router,
  data: {
    eventHub: new Vue(),
  },
  components: { App },
  template: '<App/>',
});
