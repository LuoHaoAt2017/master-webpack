import { MutationTree } from 'vuex';
import { AppModuleState } from '.';
import { AppMutationType } from './types';

const mutations: MutationTree<AppModuleState> = {
  [AppMutationType.HandleAppList] (state, payload: H3.App.AppListReturnData) {
    state.canCreateLightApp = payload.canCreateLightApp;
    state.canCreateOldApp = payload.CanCreateOldApp;
    if (payload.Apps && payload.Apps.length > 0) {
      state.appList = payload.Apps;
    } else {
      state.appList = [];
    }
  },
  [AppMutationType.HandleSchemaList] (state, payload: H3.App.AppContentReturnData) {
    // state.schemaList = payload.Schemas;
    if (payload) {
      const schemas: H3.App.SchemaData[] = payload.Schemas;
      schemas.forEach(s => {
        state.appTitle = s.DisplayName;
        if (s.GroupDisplayName === '未分组') {
          s.fold = false;
        } else {
          s.fold = false; // 迭代17 上线前默认分组展开
        }
      });
      state.schemaList = schemas;
    } else {
      // window.$h3.toast.show({
      //   text: '加载超时',
      //   iconType: 'warning',
      //   // onHide() {
      //   //   window.GlobalConfig.VueInstance.$router.replace('apps');
      //   // }
      // });
      state.schemaList = [];
    }
  },
  [AppMutationType.HandleAppTitle] (state, payload: string) {
    state.appTitle = payload;
  },
  [AppMutationType.HandleSchemaList] (state, payload: H3.App.AppContentReturnData) {
    // state.schemaList = payload.Schemas;
    if (payload) {
      const schemas: H3.App.SchemaData[] = payload.Schemas;
      schemas.forEach(s => {
        state.appTitle = s.DisplayName;
        if (s.GroupDisplayName === '未分组') {
          s.fold = false;
        } else {
          s.fold = false; // 迭代17 上线前默认分组展开
        }
      });
      state.schemaList = schemas;
    } else {
      // window.$h3.toast.show({
      //   text: '加载超时',
      //   iconType: 'warning',
      //   // onHide() {
      //   //   window.GlobalConfig.VueInstance.$router.replace('apps');
      //   // }
      // });
      state.schemaList = [];
    }
  },
  // 轻应用
  [AppMutationType.HandleIsLightApp] (state, payload: boolean) {
    state.isLightApp = payload;
  },
  [AppMutationType.HandleDelSheet] (state) {
    const delIndex: number = state.delSheetIndex;
    // 轻应用表单列表无须分组
    const schemaListArr = state.schemaList[0].Childrens;
    const resultArr = schemaListArr.filter(function (x, index) {
      return index !== delIndex;
    });
    state.schemaList[0].Childrens = resultArr;
    if (resultArr.length === 0) {
      state.schemaList.length = 0;
    }
  },
  [AppMutationType.DelSheetIndex] (state, index) {
    state.delSheetIndex = index;
  },
  [AppMutationType.HandleRenameSheetsIndex] (state, index) {
    state.renameSheetIndex = index;
  },
  [AppMutationType.HandleUpdataSheets] (state, payload) {
    state.schemaList[0].Childrens[payload.renameSheetIndex].DisplayName = payload.disPlayName;
  },
};

export default mutations;
