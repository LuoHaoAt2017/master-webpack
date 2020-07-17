const graph = () => import(/* webpackChunkName: "graph" */ '../pages/instance-state/graph.vue');
const log = () => import(/* webpackChunkName: "log" */ '../pages/instance-state/workLog.vue');
const workDetail = () => import(/* webpackChunkName: "workDetail" */ '../pages/my-work/workDetail.vue');
const approval = () => import(/* webpackChunkName: "approval" */ '../pages/my-work/sub-pages/approve.vue');
const fillsheet = () => import(/* webpackChunkName: "fillsheet" */ '../pages/my-work/sub-pages/fillsheet.vue');
const myapplication = () => import(/* webpackChunkName: "myapplication" */ '../pages/my-work/sub-pages/application.vue');
const circulate = () => import(/* webpackChunkName: "circulate" */ '../pages/my-work/sub-pages/circulate.vue');
const approve = () => import(/* webpackChunkName: "approve" */ '../pages/workflows/approve.vue');
const signatureImg = () => import(/* webpackChunkName: "signatureImg" */ '../components/signatureImg/index.vue');
const startWorkflow = () => import(/* webpackChunkName: "startWorkflow" */ '../pages/my-work/sub-pages/start-workflow.vue');


export default [
  {
    path: '/workDetail',
    name: 'workDetail',
    component: workDetail,
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: 'workLog',
        alias: '/',
        name: 'workLog',
        component: log,
        meta: {
          keepAlive: true
        },
      },
      {
        path: 'workGraph',
        name: 'workGraph',
        component: graph,
        meta: {
          keepAlive: true
        },
      },
    ]
  },
  {
    path: '/approval',
    name: 'approval',
    component: approval,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/fillsheet',
    name: 'fillsheet',
    component: fillsheet,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/myapplication',
    name: 'myapplication',
    component: myapplication,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/circulate',
    name: 'circulate',
    component: circulate,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/approve',
    name: 'approve',
    component: approve,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/signatureImg',
    name: 'signatureImg',
    component: signatureImg,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/startWorkflow',
    name: 'startWorkflow',
    component: startWorkflow,
    meta: {
      keepAlive: true
    }
  }
];
