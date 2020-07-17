import Vue from 'vue';
import { ActionTree } from 'vuex';
import { AppModuleState } from '.';
import { GlobalState } from '../../index';
import { AppActionType, AppMutationType } from './types';
import { getAppList, getSchemaList, getFormFreeFlow } from '@/service/app.service';
import { deleteLightSheet } from '@/light-app/service';

const actions: ActionTree<AppModuleState, GlobalState> = {
  async [AppActionType.GetAppList]({ commit, state, rootState }) {
    const appCode = rootState.appCode || '';
    const solutionCode = rootState.solutionCode;
    const appType = '0';
    state.appList = new Array(5).fill({ loading: true }); // 展现加载状态
    try {
      const res = await getAppList(appCode, solutionCode);
      if (res.Successful) {
        commit(AppMutationType.HandleAppList, res.ReturnData);
        return res.ReturnData;
      } else {
        window.$h3.toast.show({
          text: res.ErrorMessage || '加载超时',
          iconType: 'warning'
        });
      }
    } catch (error) {
      window.$h3.toast.show({
        text: '加载超时',
        iconType: 'warning'
      });
      console.info('请求错误'); // eslint-disable-line
      throw '';
    }
  },
  async [AppActionType.GetAppSchemas](
    { commit, state, rootState },
    appCode: string
  ) {
    state.schemaList = new Array(5).fill({ loading: true }); // 展现加载状态
    try {
      const app_code = appCode || rootState.appCode;
      const res = await getSchemaList(app_code);
      // 设置是否为轻应用状态
      commit(AppMutationType.HandleIsLightApp, res.ReturnData.IsLightApp);
      if (res && res.Successful) {
        state.appOperationPermission = res.ReturnData.OperationPermission;
        if (res.ReturnData.Schemas) {
          commit(AppMutationType.HandleSchemaList, res.ReturnData);
        } else {
          commit(AppMutationType.HandleSchemaList, false);
          console.info('请求错误'); // eslint-disable-line
        }
        // 设置appName
        if (res.ReturnData.AppName) {
          commit(AppMutationType.HandleAppTitle, res.ReturnData.AppName);
        } else {
          commit(AppMutationType.HandleAppTitle, '');
          console.info('请求错误'); // eslint-disable-line
        }
      } else {
        state.appOperationPermission = false;
        // 设置appName
        if (res.ReturnData.AppName) {
          commit(AppMutationType.HandleAppTitle, res.ReturnData.AppName);
        }
        commit(AppMutationType.HandleSchemaList, false);
        console.info('请求错误'); // eslint-disable-line
      }
    } catch (error) {
      commit(AppMutationType.HandleSchemaList, false);
      console.info('请求错误'); // eslint-disable-line
    }
  },
  // 轻应用
  async [AppActionType.DelSheet]({ commit, state, rootState },
    SheetCode: string) {
    const res: any = await deleteLightSheet(SheetCode);
    if (res.success) {
      commit(AppMutationType.HandleDelSheet);
    } else {
      commit(AppMutationType.HandleDelSheet, false);
      console.info('请求错误'); // eslint-disable-line
    }
  },
  // 是否为自由流，开启外链分享
  async [AppActionType.GetFormFreeFlow]({ state }, workflowCode) {
    try {
      const result = await getFormFreeFlow(workflowCode);
      return result;
    } catch (error) {
      window.$h3.toast.show({
        text: '加载超时',
        iconType: 'warning'
      });
      console.info('请求错误'); // eslint-disable-line
      throw '';
    }
  },
};

export default actions;
