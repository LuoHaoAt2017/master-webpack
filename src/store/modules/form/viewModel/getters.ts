import { GetterTree } from 'vuex';
import { ViewModelState } from '.';
import { GlobalState } from '../../../index';

const getters: GetterTree<ViewModelState, GlobalState> = {
  currentForm(state) {
    return state.current;
  }
};

export default getters;