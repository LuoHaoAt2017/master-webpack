import { Module } from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export class AppModuleState {
  appList: H3.App.AppListItem[] = [];

  schemaList: H3.App.SchemaData[] = [];

  isNoSchema: boolean = false;

  appTitle: string = '应用名称';

  isLightApp: boolean = false; // 是否为轻应用

  delSheetIndex: number;

  renameSheetIndex: number;

  canCreateLightApp: boolean = false;

  canCreateOldApp:boolean =false;

  appOperationPermission: boolean = false; // 表单操作权限
}

const appModule: Module<AppModuleState, any> = {
  namespaced: true,
  state: new AppModuleState(),
  actions,
  mutations,
  getters,
};

export default appModule;
