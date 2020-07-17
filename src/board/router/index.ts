const BoardEntry = () =>
  import( /* webpackChunkName: "board" */ '@/board/pages/index.vue');

export default [{
    path: '/board',
    name: 'boardEntry',
    component: BoardEntry
  },
];
