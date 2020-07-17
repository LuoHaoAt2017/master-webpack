import { home, homePages, singleApp } from './home.route';
import {
  apps, rootSchemas, appsPages, newBlankPages, lightTemplatePages, viewAllTemplatePages, lightTemplateDetailPages,
} from './app.route';
import commonPages from './common.route';
import formPages from './form.route';
import reportPages from './report.route';
import workflowPages from './workflow.route';
// import lightAppPages from './light-app.route';
import lightAppPages from '../light-app/router';
import boardPages from '../board/router';
const root = () => import(/* webpackChunkName: "home" */ '../pages/root/index.vue');

const routes = [
  {
    path: '',
    redirect: '/home',
  },
  {
    path: '/',
    name: 'root',
    component: root,
    children: [home, apps, rootSchemas, singleApp],
  },
  ...commonPages,
  ...homePages,
  ...appsPages,
  ...formPages,
  ...workflowPages,
  ...reportPages,
  ...newBlankPages,
  ...lightTemplatePages,
  ...viewAllTemplatePages,
  ...lightTemplateDetailPages,
  ...lightAppPages,
  ...boardPages,
];

export default routes;
