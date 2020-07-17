import { MutationTree } from 'vuex';
import { FormModuleState } from '.';
import { FormMutationType } from './types';

const mutations: MutationTree<FormModuleState> = {
  [FormMutationType.SETVALIDATEPANEL](state, { show, msg }) {
    state.validatePanel = { show, msg };
  },
  [FormMutationType.TOGGLEKEYBOARDSHOW](state, val) {
    state.isKeyboardShow = val;
  },
  [FormMutationType.setPrimaryBizObjectId](state, val) {
    state.primaryBizObjectId = val;
  },
  [FormMutationType.setSecondaryForm](state, val) {
    state.isSecondaryForm = val;
  },
  [FormMutationType.setPrimaryQueryParmers](state, val) {
    state.primaryQueryParmers = val;
  },
  // 表单前端事件
  [FormMutationType.HandleFrontEvents] (state, val) {
    const frontEvents: any = {};
    const returnData = val.events.frontendEvents;
    returnData.forEach(e => {
      if (e.triggerFieldCode) {
        if (!frontEvents[e.triggerFieldCode]) {
          frontEvents[e.triggerFieldCode] = [];
        }
        frontEvents[e.triggerFieldCode].push({ ...e });
      }
    });
    state.frontEvents = frontEvents;
  },
};

export default mutations;