const login = () => import(/* webpackChunkName: "login" */ '../pages/login/index.vue');
const errorShow = () => import(/* webpackChunkName: "errorShow" */ '../pages/error/index.vue');
const tipErrorShow = () => import(/* webpackChunkName: "errorShow" */ '../pages/error/tip-error.vue');
// 引导
const guide = () => import(/* webpackChunkName: "apps" */ '../pages/guide/index.vue');
// 欢迎首页
const introHome = () => import(/* webpackChunkName: "apps" */ '../pages/intro-home/index.vue');
// const guideState = () => import(/* webpackChunkName: "guideState" */ '../pages/guide/guide-state.vue');
const guidance = () => import(/* webpackChunkName: "apps" */ '../pages/home/guidance.vue');

const routers = [
// 后台报错信息页
{
  path: '/login',
  name: 'login',
  component: login,
},
// 导入成功提示
{
  path: '/tipErrorShow',
  name: 'tipErrorShow',
  component: tipErrorShow,
},
// 后台报错信息页
{
  path: '/errorShow',
  name: 'errorShow',
  component: errorShow,
},
{
  path: '/guide',
  name: 'guide',
  component: guide,
},
{
  path: '/intro-home',
  name: 'introHome',
  component: introHome,
},
// {
//   path: '/guideState',
//   name: 'guideState',
//   component: guideState,
// },
{
  path: '/guidance',
  name: 'guidance',
  component: guidance,
  meta: {
    title: '氚云'
  }
}
];

if (process.env.NODE_ENV === 'production') {
  const guidance = () => import(/* webpackChunkName: "apps" */ '../pages/home/guidance.vue');
  // 开发环境不运行欢迎页，可节省很多资源
  routers.push({
    path: '/guidance',
    name: 'guidance',
    component: guidance,
  });
}

export default routers;
