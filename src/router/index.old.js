import VueRouter from 'vue-router';

/* eslint-disable global-require */
const root = () => import(/* webpackChunkName: "root" */ '../pages/root/index.vue');

const snslist = () => import(/* webpackChunkName: "snslist" */ '../pages/sns/list.vue');
const snscomment = () => import(/* webpackChunkName: "snscomment" */ '../pages/sns/comment.vue');
const share = () => import(/* webpackChunkName: "share" */ '../pages/sns/share.vue');
const shareselect = () => import(/* webpackChunkName: "shareselect" */ '../pages/sns/share-select.vue');
const graph = () => import(/* webpackChunkName: "graph" */ '../pages/instance-state/graph.vue');
const login = () => import(/* webpackChunkName: "login" */ '../pages/login/index.vue');
const formPage = () => import(/* webpackChunkName: "formPage" */ '../pages/form/form.vue');
const externalForm = () => import(/* webpackChunkName: "formPage" */ '../pages/form/subPage/external-form.vue');
const formquery = () => import(/* webpackChunkName: "formquery" */ '../pages/query/index.vue');
const filterquery = () => import(/* webpackChunkName: "filterquery" */ '../pages/query/filter-query.vue');
const sheethome = () => import(/* webpackChunkName: "sheethome" */ '../pages/sheet-home/index.vue');
const report = () => import(/* webpackChunkName: "report" */ '../pages/report/index.vue');
const User = () => import(/* webpackChunkName: "FormUser" */ '../components/form/common-controls/form-user.vue');
const blankForm = () => import(/* webpackChunkName: "blankForm" */ '../pages/form/blank-form.vue');
const myWork = () => import(/* webpackChunkName: "myWork" */ '../pages/my-work/index.vue');
const userDepartmentChoosePage = () => import(/* webpackChunkName: "userDepartmentChoosePage" */ '../components/organization/user-department-choose-page.vue');
const approve = () => import(/* webpackChunkName: "approve" */ '../components/workflow/approve.vue');
const signatureImg = () => import(/* webpackChunkName: "signatureImg" */ '../components/signatureImg/index.vue');
const forwardSelect = () => import(/* webpackChunkName: "forwardSelect" */ '../components/forward/forward-select-page.vue');
const errorShow = () => import(/* webpackChunkName: "errorShow" */ '../pages/error/index.vue');
const tipErrorShow = () => import(/* webpackChunkName: "tipErrorShow" */ '../pages/error/tip-error.vue');
const apphelp = () => import(/* webpackChunkName: "apphelp" */ '../pages/application/apphelp.vue');
// 新版应用页面(lhz)
const appsOld = () => import(/* webpackChunkName: "apps" */ '../pages/application-old/index.vue');
const apps = () => import(/* webpackChunkName: "apps" */ '../pages/application/index.vue');
const schemas = () => import(/* webpackChunkName: "apps" */ '../pages/application/schemas.vue');
const list = () => import(/* webpackChunkName: "list" */ '../pages/list/index.vue');
const signature = () => import(/* webpackChunkName: "signature" */ '../pages/signature/index.vue');
const guidance = () => import(/* webpackChunkName: "guidance" */ '../pages/home/subPages/guidance.vue');
const summaryhelp = () => import(/* webpackChunkName: "summaryHelp" */ '../pages/home/subPages/summary-help.vue');
const startWorkflow = () => import(/* webpackChunkName: "startWorkflow" */ '../pages/my-work/sub-pages/start-workflow.vue');
// 我的工作里面四个子页面
const approval = () => import(/* webpackChunkName: "approval" */ '../pages/my-work/sub-pages/approve.vue');
const fillsheet = () => import(/* webpackChunkName: "fillsheet" */ '../pages/my-work/sub-pages/fillsheet.vue');
const myapplication = () => import(/* webpackChunkName: "myapplication" */ '../pages/my-work/sub-pages/application.vue');
const circulate = () => import(/* webpackChunkName: "circulate" */ '../pages/my-work/sub-pages/circulate.vue');
// saas购买服务页面及相关页面
const servicePackage = () => import(/* webpackChunkName: "servicePackage" */ '../pages/personal/subPages/servicePackage.vue');
const serviceSuccess = () => import(/* webpackChunkName: "serviceSuccess" */ '../pages/personal/subPages/serviceSuccess.vue');
const serviceFail = () => import(/* webpackChunkName: "serviceFail" */ '../pages/personal/subPages/serviceFail.vue');
const guide = () => import(/* webpackChunkName: "guide" */ '../pages/guide/index.vue');
const guideState = () => import(/* webpackChunkName: "guideState" */ '../pages/guide/guide-state.vue');

/* eslint-enable global-require */
const routes =  [
  // 地址为空时跳转home页面
  {
    path: '',
    redirect: 'home',
  },
  {
    path: '/',
    name: 'root',
    component: root,
    children: [
      {
        // 首页
        path: '/home',
        name: 'home',
        component: home,
      },
      {
        // 待办
        path: '/myWork',
        name: 'myWork',
        component: myWork,
      },
      {
        // 应用页面
        path: '/apps-old',
        name: 'apps-old',
        component: appsOld,
      },
      {
        // 应用页面
        path: '/apps',
        name: 'apps',
        component: apps,
      },
      {
        // 应用页面
        path: '/schemas',
        name: 'schemas',
        component: schemas,
      },
      {
        // 个人中心
        path: '/personal',
        name: 'personal',
        component: personal,
      },
    ],
  },
  {
    path: '/favoriate',
    name: 'favoriatesetting',
    component: favoriateSetting,
  },
  {
    path: '/customsetting',
    name: 'customsetting',
    component: customSetting,
  },
  {
    path: '/summaryhelp',
    name: 'summaryhelp',
    component: summaryhelp,
  },
  {
    path: '/snslist',
    name: 'snslist',
    component: snslist,
  },
  {
    path: '/snscomment',
    name: 'snscomment',
    component: snscomment,
  },
  {
    path: '/graph',
    name: 'graph',
    component: graph,
  },
  {
    path: '/share',
    name: 'share',
    component: share,
  },
  {
    path: '/share-select',
    name: 'shareselect',
    component: shareselect,
  },
  {
    path: '/signature',
    name: 'signature',
    component: signature,
  },
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  // 表单新增页面
  {
    path: '/formPage',
    name: 'formPage',
    component: formPage,
    meta: {
      keepAlive: true,
    },
  },
  // 表单外链查看
  {
    path: '/externalForm',
    name: 'externalForm',
    component: externalForm,
    meta: {
      keepAlive: true,
    },
  },
  // 流程图与流程日志查看
  // {
  //   path: '/workflowLogs',
  //   name: 'workflowLogs',
  //   component: workflowLogs,
  //   meta: {
  //     keepAlive: true,
  //   },
  // },
  // 关联查询新增
  {
    path: '/queryFormPage',
    name: 'queryFormPage',
    component: formPage,
    meta: {
      keepAlive: true,
    },
  },
  // 关联列表
  {
    path: '/formquery',
    name: 'formquery',
    component: formquery,
  },
  {
    path: '/filterquery',
    name: 'filterquery',
    component: filterquery,
  },
  // 表单首页
  {
    path: '/sheet-home/:bizObjectId/:schemaCode',
    name: 'sheethome',
    component: sheethome,
  },
  // 报表页
  {
    path: '/report',
    name: 'report',
    component: report,
  },
  // 后台报错信息页
  {
    path: '/errorShow',
    name: 'errorShow',
    component: errorShow,
  },
  // 导入成功提示
  {
    path: '/tipErrorShow',
    name: 'tipErrorShow',
    component: tipErrorShow,
  },
  // 筛选过滤组件
  {
    path: '/filter/creater',
    name: 'form-user',
    component: User,
  },
  {
    path: '/blankForm',
    name: 'blankForm',
    component: blankForm,
  },
  {
    path: '/userDepartmentChoosePage',
    name: 'userDepartmentChoosePage',
    component: userDepartmentChoosePage,
  },
  {
    path: '/approve',
    name: 'approve',
    component: approve,
  },
  {
    path: '/signatureImg',
    name: 'signatureImg',
    component: signatureImg,
  },
  {
    path: '/forwardSelect',
    name: 'forwardSelect',
    component: forwardSelect,
  },
  {
    // 列表
    path: '/list',
    name: 'list',
    component: list,
  },
  {
    path: '/guidance',
    name: 'guidance',
    component: guidance,
  },
  {
    path: '/apphelp',
    name: 'apphelp',
    component: apphelp,
  },
  {
    path: '/startWorkflow',
    name: 'startWorkflow',
    component: startWorkflow,
  },
  {
    path: '/approval',
    name: 'approval',
    component: approval,
  },
  {
    path: '/fillsheet',
    name: 'fillsheet',
    component: fillsheet,
  },
  {
    path: '/myapplication',
    name: 'myapplication',
    component: myapplication,
  },
  {
    path: '/circulate',
    name: 'circulate',
    component: circulate,
  },
  {
    path: '/servicePackage',
    name: 'servicePackage',
    component: servicePackage,
  },
  {
    path: '/serviceSuccess',
    name: 'serviceSuccess',
    component: serviceSuccess,
  },
  {
    path: '/serviceFail',
    name: 'serviceFail',
    component: serviceFail,
  },
  {
    path: '/guide',
    name: 'guide',
    component: guide,
  },
  {
    path: '/guideState',
    name: 'guideState',
    component: guideState,
  },
];

export default new VueRouter({
  routes,
});
