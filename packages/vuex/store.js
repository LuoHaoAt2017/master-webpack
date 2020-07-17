import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  isLoading: false,
  direction: 'forward',
};
export default new Vuex.Store({
  state,
  mutations: {
    UPDATE_LOADING(context, status) {
      context.isLoading = status;
    },
    UPDATE_DIRECTION(context, direction) {
      context.direction = direction;
    },
  },
});
