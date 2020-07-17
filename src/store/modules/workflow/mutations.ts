import { MutationTree } from 'vuex';
import { WorkflowModuleState } from '.';
import { WorkflowMutationType } from './types';

const mutations: MutationTree<WorkflowModuleState> = {
  [WorkflowMutationType.HandleWorkflowSchemaList](state, payload: H3.Workflow.WorkflowContentReturnData) {
    // state.schemaList = payload.Schemas;
    if (payload) {
      let workflowSchemas: H3.Workflow.WorkflowSchemaData[] = payload.WorkflowSchemas;
      workflowSchemas.forEach(s => {
          s.fold = true;
      })
      state.schemaList = workflowSchemas;
    } else {
      state.schemaList = [];
    }
  }
};

export default mutations;
