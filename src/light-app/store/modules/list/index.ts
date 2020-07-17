import { Module } from 'vuex';
import actions from './actions';
import mutations from './mutations';
import { Column, ViewData, Summary } from '@/light-app/typings/list';

export class LightListModuleState {
  total: number = 0;
  formRows: object[] = [];
  formCols: Column[] = [];
  isWorkflow: boolean = false;
  viewData: ViewData = null;
  sortSelectedCode: string = ''; //排序控件code
  sortSelectedType: number = -1; //排序控件类型升序降序
  isSortReset: boolean = false; //排序是否重置
  formBeCreated: boolean = false; // 表单数据新增权限
  formViewConfigs: any = null; // 列表视图配置
}

const LightListModule: Module<LightListModuleState, any> = {
  namespaced: true,
  state: new LightListModuleState(),
  mutations,
  actions
};

export default LightListModule;
