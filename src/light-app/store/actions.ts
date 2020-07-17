import { ActionTree } from 'vuex';
import { LightAppModuleState } from '.';
import { LightAppMutationType, LightAppActionType } from './types';
import { UniqueControls } from '@/light-app/config/form-control-type';
import {
  createLightApp,
  createForm,
  updateForm,
  updateFormName,
  renameLightSheet,
  getFormControls,
  getDataList
} from '@/light-app/service';

import { FORMERR } from 'dns';
const actions: ActionTree<LightAppModuleState, any> = {
  // 获取表单控件列表
  async [LightAppActionType.GetFormControls]({ commit, state }, data) {
    try {
      const res: any = await getFormControls(data);
      if (res.success) {
        const formControls = res.returnData.controls;
        const controls = [];
        let len = 0;
        if (formControls && formControls.length > 0) {
          formControls.forEach(control => {
            commit(LightAppMutationType.UpdateColsNameList, {name: control.Options.DisplayName});
            if(control.ChildControls && control.ChildControls.length > 0) {
              controls.push(...control.ChildControls);
            } else {
              controls.push(control);
            }
            // 获取已有的唯一控件
            if (UniqueControls.includes(control.Type)) {
              commit(LightAppMutationType.HandleUniqueControls, {status: 'add', control: control.Type});
            }
          });
          controls.forEach(control => {
            // 前端需要自增Key,在初次获取formControls时获取Key的最大值
            const keyList = control.Key.split('.');
            const key = keyList.length > 1 ? keyList[1]: control.Key;
            commit(LightAppMutationType.UpdateControlCodeList, { key });
          })
        }
        commit(LightAppMutationType.IsWorkflow, res.returnData.isWorkflow);
        commit(LightAppMutationType.UpdateFormName, {name: res.returnData.displayName, subSheet: false});
        commit(LightAppMutationType.FormControls, formControls);
        return res;
      } else {
        return false;
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
  // 创建应用
  async [LightAppActionType.CreateApp]({ commit }, data) {
    const res: any = await createLightApp(data);
    if (res.success) {
      const appCode = res.returnData.appCode;
      commit(LightAppMutationType.AppCode, appCode);
      return res.returnData;
    } else {
      return false;
    }
  },

  async [LightAppActionType.CreateForm]({ commit, state }, data) {
    const res: any = await createForm(data);
    if (res.success) {
      state.formDataUpdateStatus = false;
      return res.returnData;
    } else {
      return false;
    }
  },

  async [LightAppActionType.AsyncUpdateFormName]({ commit }, data) {
    const res: any = await updateFormName(data);
    if (res.success) {
      commit(LightAppMutationType.UpdateFormName, {name: data.displayName, subSheet: false});
      return res.returnData;
    } else {
      return false;
    }
  },
  async [LightAppActionType.UpdateForm]({ commit, state }, data) {
    const res: any = await updateForm(data);
    if (res.success) {
      state.formDataUpdateStatus = false;
      return res.returnData;
    } else {
      return false;
    }
  },
  // 表单重命名
  async [LightAppActionType.RenameSheet]({ commit }, data) {
    const res: any = await renameLightSheet(data);
    if (res.success) {
      commit(LightAppMutationType.HandleRenameSheet);
      return true;
    } else {
      return false;
    }
  },
  // get表单数据列表和搜索
  async [LightAppActionType.GetFormDataLists]({ commit }, data) {
    const {sheetCode, pageSize, pageIndex, keyValue} = data;
    const res: any = await getDataList(sheetCode, pageSize, pageIndex, keyValue);
    if (res.success) {
      const resultData = res.returnData;
      console.log('resultData', resultData);
      resultData.pageIndex = pageIndex;
      commit(LightAppMutationType.HandleFormDataLists, resultData);
      return true;
    } else {
      return false;
    }
  }
};

export default actions;
