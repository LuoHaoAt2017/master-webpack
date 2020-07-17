
const snslist = () => import(/* webpackChunkName: "snslist" */ '../pages/sns/list.vue');
const snscomment = () => import(/* webpackChunkName: "snscomment" */ '../pages/sns/comment.vue');
const share = () => import(/* webpackChunkName: "share" */ '../pages/sns/share.vue');
const lightshare = () => import(/* webpackChunkName: "liaghtshare" */ '../pages/form/subPage/lightapp-share.vue');
const shareselect = () => import(/* webpackChunkName: "shareselect" */ '../pages/sns/share-select.vue');
const formPage = () => import(/* webpackChunkName: "formPage" */ '../pages/form/form.vue');
const externalForm = () => import(/* webpackChunkName: "externalform" */ '../pages/form/subPage/external-form.vue');
const formquery = () => import(/* webpackChunkName: "formquery" */ '../pages/query/index.vue');
const filterquery = () => import(/* webpackChunkName: "filterquery" */ '../pages/query/filter-query.vue');
const filterQueryCopy = () => import(/* webpackChunkName: "filterquery" */ '../pages/query/filter-query-copy.vue');
const sheethome = () => import(/* webpackChunkName: "sheethome" */ '../pages/sheet-home/index.vue');
const signature = () => import(/* webpackChunkName: "signature" */ '../pages/signature/index.vue');
// eslint-disable-next-line max-len
const userDepartmentChoosePage = () => import(/* webpackChunkName: "userDepartmentChoosePage" */ '../components/organization/user-department-choose-page.vue');
// eslint-disable-next-line max-len
const forwardSelect = () => import(/* webpackChunkName: "forwardSelect" */ '../components/forward/forward-select-page.vue');
const list = () => import(/* webpackChunkName: "list" */ '../pages/list/index.vue');
const dashboard = () => import(/* webpackChunkName: "dashboard" */ '../pages/dashboard/index.vue');
const externalShare = () => import(/* webpackChunkName: "externalShare" */ '../pages/form/external-share.vue');

const openQuery = () => import(/* webpackChunkName: "externalShare" */ '../pages/form/query/index.vue');
const videoPreview = () => import(/* webpackChunkName: "externalShare" */ '../pages/form/preview.vue');

export default [
  {
    // 列表
    path: '/list',
    name: 'list',
    component: list,
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
    path: '/share',
    name: 'share',
    component: share,
  },
  {
    path: '/lightshare',
    name: 'lightshare',
    component: lightshare,
  },
  {
    path: '/external/share',
    name: 'externalShare',
    component: externalShare,
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
  // 表单新增页面
  {
    path: '/formPage',
    name: 'formPage',
    component: formPage,
    meta: {
      keepAlive: true,
    },
    props: true,
  },
  {
    path: '/form/internal',
    name: 'formInternalSharing',
    component: formPage,
    meta: {
      keepAlive: true,
    },
    props: true,
  },
  // 关联表单新增的页面
  {
    path: '/formQueryPage',
    name: 'formQueryPage',
    component: formPage,
    meta: {
      keepAlive: true,
    },
    props: true,
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
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/filterquery',
    name: 'filterquery',
    component: filterquery,
  },
  {
    path: '/filterQueryCopy',
    name: 'filterQueryCopy',
    component: filterQueryCopy,
  },
  // 表单首页
  {
    path: '/sheet-home/:bizObjectId/:schemaCode',
    name: 'sheethome',
    component: sheethome,
    // redirect: {name: 'secFormPage'},
    children: [{
      path: '',
      name: 'secFormPage',
      component: formPage,
      meta: {
        keepAlive: true,
      },
      props: true,
    }],
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/userDepartmentChoosePage',
    name: 'userDepartmentChoosePage',
    component: userDepartmentChoosePage,
  },
  {
    path: '/forwardSelect',
    name: 'forwardSelect',
    component: forwardSelect,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard,
    meta: {
      keepAlive: false,
    },
  },
  {
    path: '/openquery/:schemaCode',
    name: 'openquery',
    component: openQuery,
  },
  // {
  //   path: '/openquery',
  //   name: 'openquery',
  //   component: openQuery,
  // },
  {
    path: '/preview',
    name: 'preview',
    component: videoPreview,
    meta: {
      keepAlive: false,
    },
  },
];
