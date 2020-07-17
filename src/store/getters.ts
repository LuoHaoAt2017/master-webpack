import { GetterTree } from 'vuex';
import { GlobalState } from '.';
import { isProductionMode } from '@/config/env';

const getters: GetterTree<GlobalState, any> = {
  isApp(state: GlobalState) { // 判断是平台还是应用
    if (!isProductionMode) return false;
    const appCode = state.appCode || '';
    const solutionCode = state.solutionCode || '';
    if (!solutionCode || (appCode !== solutionCode)) {
      return true;
    }
    return false;
  },
  isSingleApp(state: GlobalState) {
    if ((state.separatedAppCodeList && state.separatedAppCodeList.length === 1 && state.separatedAppCodeList[0] !== 'Sys_Workflow' && !state.UserInfo.isAdministrator) || state.backFromScanForm) {
      return true;
    }
    return false;
  }
};

export default getters;
