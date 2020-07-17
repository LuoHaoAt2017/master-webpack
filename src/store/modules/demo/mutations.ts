import { MutationTree } from 'vuex';
import { DemoModuleState } from '.';
import { DemoMutationType } from './types';

const mutations: MutationTree<DemoModuleState> = {
  [DemoMutationType.Example](state, payload) {
    state.foo = '';
  }
};

export default mutations;