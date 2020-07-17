import { MutationTree } from 'vuex';
import { GlobalState } from '.';
import { MutationType } from './types';

const mutations: MutationTree<GlobalState> = {
  [MutationType.ToggleTabbarShow](state, payload: boolean = true) {
    state.tabbarShow = payload;
  },
  [MutationType.ExcludeComp](state, payload: []) {
    state.excludeComp = payload;
  }
};

export default mutations;
