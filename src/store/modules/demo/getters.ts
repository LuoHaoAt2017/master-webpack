import { GetterTree } from 'vuex';
import { DemoModuleState } from '.';
import { GlobalState } from '../../index';

const getters: GetterTree<DemoModuleState, GlobalState> = {
  bar(state) {
    return state.foo;
  }
};

export default getters;