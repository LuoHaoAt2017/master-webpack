const LightAppCreatePage = () =>
  import( /* webpackChunkName: "lightApps" */ '@/light-app/pages/light-app-create.vue');
const LightFormDesignPage = () =>
  import( /* webpackChunkName: "lightApps" */ '@/light-app/pages/form/form-design.vue');
  const LightFormSubSheetDesignPage = () =>
  import( /* webpackChunkName: "lightApps" */ '@/light-app/pages/form/form-design.vue');
const LightFormNameEditPage = () =>
  import( /* webpackChunkName: "lightApps" */ '@/light-app/pages/form/form-name-edit.vue');
const LightControlAttributePage = () =>
  import( /* webpackChunkName: "lightApps" */ '@/light-app/pages/form/attribute/index.vue');
const LightFormPreviewPage = () =>
  import( /* webpackChunkName: "lightApps" */ '@/light-app/pages/form/preview/form-preview.vue');
const LightFormSharePage = () =>
  import( /* webpackChunkName: "lightApps" */ '@/light-app/pages/form/form-share.vue');
const LightListPage = () =>
  import( /* webpackChunkName: "lightApps" */ '@/light-app/pages/list/index.vue');
const LightReportPage = () =>
  import( /* webpackChunkName: "lightApps" */ '@/light-app/pages/report/index.vue');
export default [{
    path: '/light-app-create',
    name: 'lightAppCreatePage',
    component: LightAppCreatePage
  },
  {
    path: '/form-design',
    name: 'lightFormDesignPage',
    component: LightFormDesignPage
  },
  {
    path: '/form-design-subsheet',
    name: 'lightFormSubSheetDesignPage',
    component: LightFormSubSheetDesignPage
  },
  {
    path: '/form-edit-name',
    name: 'lightFormNameEditPage',
    component: LightFormNameEditPage
  },
  {
    path: '/control-attribute',
    name: 'lightControlAttributePage',
    component: LightControlAttributePage
  },
  {
    path: '/form-preview',
    name: 'lightFormPreviewPage',
    component: LightFormPreviewPage
  },
  {
    path: '/form-share',
    name: 'lightFormSharePage',
    component: LightFormSharePage
  },
  {
    path: '/lists',
    name: 'lightListPage',
    component: LightListPage
  },
  {
    path: '/lists/report',
    name: 'lightReportPage',
    component: LightReportPage
  },
];
