import { Module } from "vuex";
import actions from './actions';
import mutations from './mutations';

export class DemoModuleState {
  foo: string = '';
}

const appModule: Module<DemoModuleState, any> = {
  namespaced: true,
  state: new DemoModuleState(),
  mutations,
  actions,
}

export default appModule;