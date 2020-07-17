const LightAppCreatePage = () =>
  import( /* webpackChunkName: "lightApps" */ '../pages/application/light-app/light-app-create.vue');
const LightFormDesignPage = () =>
  import( /* webpackChunkName: "lightApps" */ '../pages/application/light-app/form/form-design.vue');
  const LightFormSubSheetDesignPage = () =>
  import( /* webpackChunkName: "lightApps" */ '../pages/application/light-app/form/form-design.vue');
const LightFormNameEditPage = () =>
  import( /* webpackChunkName: "lightApps" */ '../pages/application/light-app/form/form-name-edit.vue');
const LightControlAttributePage = () =>
  import( /* webpackChunkName: "lightApps" */ '../pages/application/light-app/form/attribute/index.vue');
const LightFormPreviewPage = () =>
  import( /* webpackChunkName: "lightApps" */ '../pages/application/light-app/form/preview/form-preview.vue');
const LightFormSharePage = () =>
  import( /* webpackChunkName: "lightApps" */ '../pages/application/light-app/form/form-share.vue');
  
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
];
