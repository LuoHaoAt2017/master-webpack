import { GetterTree } from 'vuex';
import { AppModuleState } from '.';
import { GlobalState } from '../../index';

const getters: GetterTree<AppModuleState, GlobalState> = {
  isShowAddApp(state, getters, rootState) {
    // return rootState.UserInfo.isAdministrator && rootState.isAPaas && rootState.solutionCode !== 'school';
    return (rootState.UserInfo.isAdministrator || rootState.UserInfo.IsAppCreator) && rootState.isAPaas;
  },
  isShowEmptyAddApp(state, getters, rootState) {
    return (rootState.UserInfo.isAdministrator || rootState.UserInfo.IsAppCreator) && rootState.isAPaas;
  },
  operationPermission(state, getters, rootState) {
    const isAdministrator = rootState.UserInfo && rootState.UserInfo.isAdministrator;
    const appOperationPermission = state.appOperationPermission;
    return isAdministrator || appOperationPermission;
  }
};

export default getters;
