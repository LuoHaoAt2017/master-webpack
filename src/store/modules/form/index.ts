import { Module } from "vuex";
import actions from './actions';
import mutations from './mutations';
import viewModelModule from './viewModel';

export class FormModuleState {
  validatePanel: { show: boolean, msg: string } = {
    show: false,
    msg: '',
  };
  isKeyboardShow: boolean = false;
  currentFormId: string;
  currentForm!: any;
  /**
   * 迭代26 关联表单新增 目前仅允许一层新增，所以有一个主表单ID
   * 在关联表单新增的时候有值 推出新增页面后清空值
   */
  primaryBizObjectId : string = '';
  isSecondaryForm: boolean = false;
  primaryQueryParmers: any = {};
  frontEvents: any = {};  // 前端事件
}

const formModule: Module<FormModuleState, any> = {
  namespaced: true,
  state: new FormModuleState(),
  mutations,
  actions,
  modules: {
    ViewModel: viewModelModule,
  },
}

export default formModule;