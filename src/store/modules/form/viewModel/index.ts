import { Module } from "vuex";
// import actions from './actions';

export class ViewModelState {
  [BOId: string]: any;
}

const viewModelModule: Module<ViewModelState, any> = {
  namespaced: true,
  state: new ViewModelState(),
  // actions,
}

export default viewModelModule;