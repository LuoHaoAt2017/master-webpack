import { ActionTree } from 'vuex';
import { LightListModuleState } from '.';
import { LightListMutationType, LightListActionType } from './types';
import {
  getDataList
} from '@/light-app/service';

const actions: ActionTree<LightListModuleState, any> = {
  // get表单数据列表和搜索
  async [LightListActionType.GetFormDataLists]({ commit }, data) {
    const {sheetCode, pageSize, pageIndex, keyValue} = data;
    const res: any = await getDataList(sheetCode, pageSize, pageIndex, keyValue);
    if (res.success) {
      const resultData = res.returnData;
      resultData.pageIndex = pageIndex;
      commit(LightListMutationType.HandleFormDataLists, resultData);
      return resultData;
    } else {
      return false;
    }
  }
};

export default actions;
