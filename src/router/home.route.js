const homePage = () => import(/* webpackChunkName: "home" */ '../pages/home/index.vue');
const myWork = () => import(/* webpackChunkName: "home" */ '../pages/home/index.vue');
const bannerDetail = () => import(/* webpackChunkName: "home" */ '../pages/banner/banner-detail.vue');
const customSetting = () => import(/* webpackChunkName: "homereports" */ '../pages/home/custom-setting.vue');
const singleAppPage = () => import(/* webpackChunkName: "homesingleapp" */ '../pages/home/single-app.vue');

const home = {
    // 首页
    path: '/home',
    name: 'home',
    component: homePage
};

const singleApp = {
  // 单应用首页
  path: '/singleApp',
  name: 'singleApp',
  component: singleAppPage
};

const homePages = [
  {
    path: '/customsetting',
    name: 'customsetting',
    component: customSetting,
    props: true,
  },
  {
    path: '/bannerDetail',
    name: 'bannerDetail',
    component: bannerDetail,
  },
  {
    path: '/myWork',
    name: 'myWork',
    component: myWork,
  }
];

export {
  home, homePages, singleApp
}