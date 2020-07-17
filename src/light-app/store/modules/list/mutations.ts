import Vue from 'vue';
import { MutationTree } from 'vuex';
import { LightListModuleState } from '.';
import { LightListMutationType } from './types';
import { ControlStatus } from '@/light-app/config/const';

const mutations: MutationTree<LightListModuleState> = {
  [LightListMutationType.HandleFormDataLists](state, payload) {
    state.total = payload.total;
    state.formCols = payload.cols;
    state.viewData = payload.viewData;
    state.isWorkflow = payload.isWorkflow;
    state.formViewConfigs = payload.viewConfigs;
    state.formBeCreated = payload.beCreated;
    let tempArr: any = [];
    if (payload.rows === undefined) return;
    if(payload.pageIndex === 0) {
      tempArr = [].concat(payload.rows);
    }else {
      tempArr = state.formRows.concat(payload.rows);
    }
    state.formRows = tempArr;
  },
  [LightListMutationType.HandleResetListData](state, payload) {
    state.total = payload.total;
    state.formRows = payload.rows;
    state.isWorkflow = payload.isWorkflow;
  },
  [LightListMutationType.HandleRealSearchRows](state, payload) {
    state.formRows = payload;
  },
  [LightListMutationType.HandleSortSelectedCode](state, payload) {
    state.sortSelectedCode = payload;
  },
  [LightListMutationType.HandleSortSelectedType](state, payload) {
    state.sortSelectedType = payload;
  },
  [LightListMutationType.HandleIsSortReset](state, payload) {
    state.isSortReset = payload;
  }
};

export default mutations;
