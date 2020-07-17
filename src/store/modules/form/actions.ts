
import { ActionTree } from 'vuex';
import { FormModuleState } from '.';
import { GlobalState } from '../../index';
import { FormActionType, FormMutationType } from './types';
import { getFormEvents } from '@/service/form.service';
let errMsg = []
let timer = null
const actions: ActionTree<FormModuleState, GlobalState> = {
  [FormActionType.SHOWVALIDMSG](context, msg) {
    errMsg.push(msg)
    if(timer){
      clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      if(errMsg[errMsg.length - 1].indexOf('必填') !== -1){
        msg = errMsg[errMsg.length - 1]
      }else{
        msg = errMsg.shift()
      }
      context.commit(FormMutationType.SETVALIDATEPANEL, { show: true, msg });
      errMsg = []
      setTimeout(() => {
        context.commit(FormMutationType.SETVALIDATEPANEL, { show: false, msg });
      }, 2000)
    }, 300);
  },
  // 取表单前端事件
  async [FormActionType.GetFrontEvents] ({ commit }, data) {
    const sheetCode = data;
    const res: any = await getFormEvents(sheetCode);
    if (res.success) {
      const resultData = res.returnData;
      commit(FormMutationType.HandleFrontEvents, resultData);
      return resultData;
    } else {
      return false;
    }
  },
};

export default actions;
