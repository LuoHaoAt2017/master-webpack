// const appsOld = () => import(/* webpackChunkName: "apps" */ '../pages/application-old/index.vue');
const appsPage = () => import(/* webpackChunkName: "apps" */ '../pages/application/index.vue');
const schemas = () => import(/* webpackChunkName: "apps" */ '../pages/application/schemas.vue');
const newBlank = () => import(/* webpackChunkName: "apps" */ '../pages/application/new-blank.vue');
const lightTemplate = () => import(/* webpackChunkName: "apps" */ '../pages/application/light-template.vue');
const viewAllTemplate = () => import(/* webpackChunkName: "apps" */ '../pages/application/view-all.vue');
const lightTemplateDetail = () => import(/* webpackChunkName: "apps" */ '../pages/application/light-template-detail.vue');

const apps = {
  // 应用页面
  path: '/apps',
  name: 'apps',
  component: appsPage,
};

const rootSchemas = {
  // 应用页面
  path: '/rootSchemas',
  name: 'rootSchemas',
  component: schemas,
};

const appsPages = [{
  // 应用页面
  path: '/schemas',
  name: 'schemas',
  component: schemas,
}];

const newBlankPages = [{
  // 应用页面
  path: '/newBlank',
  name: 'newBlank',
  component: newBlank,
}];

const lightTemplatePages = [{
  // 应用页面
  path: '/lightTemplate',
  name: 'lightTemplate',
  component: lightTemplate,
}];

const viewAllTemplatePages = [{
  // 应用页面
  path: '/viewAllTemplate',
  name: 'viewAllTemplate',
  component: viewAllTemplate,
}];

const lightTemplateDetailPages = [{
  // 应用页面
  path: '/lightTemplateDetail',
  name: 'lightTemplateDetail',
  component: lightTemplateDetail,
}];

export {
  apps, rootSchemas, appsPages, newBlankPages, lightTemplatePages, viewAllTemplatePages, lightTemplateDetailPages,
};
