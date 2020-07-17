import Vue from 'vue';
import { ActionTree } from 'vuex';
import { WorkflowModuleState } from '.';
import { GlobalState } from '../../index';
import { WorkflowActionType, WorkflowMutationType } from './types';
import { getWorkflowSchemaList } from '@/service/workflow.service';

const actions: ActionTree<WorkflowModuleState, GlobalState> = {
  async [WorkflowActionType.GetWorkflowSchemas](
    { commit, state, rootState }
  ) {
    state.schemaList = new Array(5).fill({ loading: true }); // 展现加载状态
    try {
      const res = await getWorkflowSchemaList(rootState.solutionCode, rootState.appCode);
      if (res && res.Successful) {
        if (res.ReturnData.WorkflowSchemas) {
          commit(WorkflowMutationType.HandleWorkflowSchemaList, res.ReturnData);
        } else {
          commit(WorkflowMutationType.HandleWorkflowSchemaList, false);
          console.info('请求错误'); // eslint-disable-line
        }
      } else {
        commit(WorkflowMutationType.HandleWorkflowSchemaList, false);
        console.info('请求错误'); // eslint-disable-line
      }
    } catch (error) {
      commit(WorkflowMutationType.HandleWorkflowSchemaList, false);
      console.info('请求错误'); // eslint-disable-line
    }
  }
};

export default actions;
