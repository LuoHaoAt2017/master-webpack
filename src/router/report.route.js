const report = () => import(/* webpackChunkName: "report" */ '../pages/report/index.vue');

export default [
// 报表页
{
  path: '/report',
  name: 'report',
  component: report,
}];