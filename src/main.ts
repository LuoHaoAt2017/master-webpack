// zyq ;
import 'babel-polyfill'; // 转码es6 api
import Vue from 'vue';
import routes from '@/router';
// import vconsole from 'vconsole';
import VueLazyload from 'vue-lazyload';

import * as dd from 'dingtalk-jsapi';
import FastClick from 'fastclick';

import VueRouter from 'vue-router';
import '@/config/register-sw';
import { isDingtalk, isiOS } from '@/config/common';
import interceptors from '@/config/interceptors';
import storeStartup from '@/config/app-start/store-startup';
import backStack from '@/config/back-stack';
// 引入适配
import '@/config/rem';
import '@/config/helper';
import store from '@/store/';
import SentryPlugin from '@/config/sentry';

import App from '@/App.vue';
import Layout from '@/components/shared/layout/index.vue';
import appStart from '@/config/app-start';

// 下拉组件
import SelectPlugin from '@/plugins/select';
// 时间选择组件
import H3DateTimePlugin from '../packages/plugins/datetime';
import { H3Toast, H3ImageViewer, H3Modal } from '@h3/thinking-ui';

// 引入h3組件全局樣式
if (process.env.NODE_ENV === 'production') {
  Vue.config.devtools = false;
  Vue.config.productionTip = false;
}

// 解决ios12 input点击难以获取焦点的问题
FastClick.prototype.focus = function (targetElement) {
  let length;
  if (
    isiOS &&
    targetElement.setSelectionRange &&
    targetElement.type.indexOf('date') !== 0 &&
    targetElement.type !== 'time' &&
    targetElement.type !== 'month'
  ) {
    length = targetElement.value.length;
    targetElement.setSelectionRange(length, length);
    targetElement.focus();
  } else {
    targetElement.focus();
  }
};

// 全局配置
window.dd = dd;

if ('addEventListener' in document) {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      FastClick.attach(document.body);
    },
    false,
  );
}

// 浏览器版本,阻止钉钉（IOS版本）,下拉整个界面回弹
if (isDingtalk && isiOS) {
  dd.ready(() => {
    dd.ui.webViewBounce.disable({});
  });
}

// Vue extend
Vue.prototype.backStack = backStack;

/**
 * @deprecated 此方法在替换所有header后废弃
 */
VueRouter.prototype.goBack = function goBack () {
  window.history.go(-1);
};

Vue.use(H3Toast);
Vue.use(H3ImageViewer);
Vue.use(H3Modal);
Vue.use(SelectPlugin);
Vue.use(H3DateTimePlugin); // baosc
Vue.use(VueRouter);
Vue.use(SentryPlugin);
Vue.use(VueLazyload);

import('vconsole').then(Vconsole => {
  new Vconsole.default();
});
// 全局引用Layout组件
Vue.component('layout', Layout);

(async function startUp () {
  try {
    const globalConfig = await appStart();
    window.GlobalConfig = globalConfig;
    if (!window.GlobalConfig || window.GlobalConfig.LoginFailed) return;
    routes[0].redirect = window.GlobalConfig.homeAddress;
    const router = new VueRouter({ routes });
    router.beforeEach(interceptors.routerBeforeEach);
    window.GlobalConfig.VueInstance = new Vue({
      router,
      store: storeStartup(store),
      el: '#app',
      data: {
        eventHub: new Vue(),
      },
      render: h => h(App),
    });
  } catch (error) {
    console.error(error); //eslint-disable-line
    alert(`出错了，请联系管理员解决${error.message}`);
  }
})();
