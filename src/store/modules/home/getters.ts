import { GetterTree } from 'vuex';
import { HomeModuleState } from '.';
import { GlobalState } from '../../index';

const getters: GetterTree<HomeModuleState, GlobalState> = {
  showCustomCards(state) {
    return state.customCards.length > 0;
  }
};

export default getters;