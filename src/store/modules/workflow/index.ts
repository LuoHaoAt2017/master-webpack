import { Module } from "vuex";
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export class WorkflowModuleState {
  schemaList: H3.Workflow.WorkflowSchemaData[] = [];
}

const workflowModule: Module<WorkflowModuleState, any> = {
  namespaced: true,
  state: new WorkflowModuleState(),
  actions,
  mutations,
  getters,
}

export default workflowModule;
