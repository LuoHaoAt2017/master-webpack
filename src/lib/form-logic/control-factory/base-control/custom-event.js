import { pairsForIn } from '../../utils';
import { debugCustomEvt } from '../../utils/debug';
/**
 *
 * 现在子表的自定义代码BindChange逻辑是这样的：
 *
 * 控件正常输入时，触发控件的BindChange，
 * 同时，在整个子表上触发一次BindChange，回调参数是发生变化的这个控件
 * （这个逻辑本身就不合理）
 *
 * AddRow CopyRow DeleteRow 回调参数数据会有第二个元素，对应 add copy delete
 *
 * AddRow 的时候要触发每个控件本身的BindChange,
 * 同时有多少个控件，就在整个子表上触发多少次BindChange，
 * 然后最后再触发一次，在子表上参数为 [ 这行的数据'add']
 * （神特么逻辑）
 *
 * UpdateRow 的时候
 * 只触发子表每个控件自己的BindChange，
 * 不要触发整个子表上的BindChange
 * （这逻辑不觉得和控件赋值冲突吗？？）
 *
 * CopyRow 的时候
 * 只要触发一次子表本身的BindChange，回调参数为[这行的数据, ’copy’]
 *
 *  DeleteRow 的时候
 * 只要触发一次子表本身的BindChange，回调参数为[空数据, ’delete']
 *
 */

function flushEventCallback(customEvts, ...params) {
  if (customEvts) {
    const control = this;
    pairsForIn(customEvts, (evt, callback) => {
      if (typeof callback === 'function') {
        try {
          callback(...params);
        } catch (err) {
          control.$form.$errorHandler(`自定义代码事件：${evt}回调失败`, err);
        } finally {
          debugCustomEvt(control, evt);
        }
      }
    });
  }
}


// 这个的机制真的太他妈恶心了，受不了了
// 子表内的控件的事件，需要触发整个子表的事件？？！！
// 赶紧改版
function executeCustomEvt(pubControl, action, payload) {
  let params = [];
  const $form = pubControl.$form;
  const customEvts = pubControl.$$customEvts;
  if (pubControl.controlKey === 'FormQuery' && !pubControl.isIngrid) {
    // 关联表单的回调参数特殊 这里很恶心能不能以后统一一下
    const valObj = pubControl.viewData || {};
    params = [{
      Name: valObj.name,
      ObjectId: valObj.objectId,
    }];
    flushEventCallback.call(pubControl, customEvts, params);
    return;
  }
  if (pubControl.controlKey === 'FormGridView') {
    // 子表的AddRow回调参数特殊 希望以后统一一下回调参数
    const gridParams = [customEvts];
    if (action && action !== 'nogrid') { // 兼容旧代码
      const rowId = payload;
      let rowApi = {};
      if (rowId) {
        const apiControl = $form.$customApi[pubControl.dataField];
        for (const field of pubControl.controlFields) {
          const childApiControl = apiControl.GetCellManager(rowId, field);
          rowApi[field] = childApiControl;
        }
      }
      if(action === 'delete'){
        gridParams.push([{ rowId }, action, rowApi]);
      }else{
        gridParams.push([rowApi, action]);
      }
    }
    flushEventCallback.call(pubControl, ...gridParams);
    return;
  }
  if (pubControl.isIngrid) {
    const gridControl = $form[pubControl.parentDataField];
    const parentCustomEvts = gridControl.$$customEvts;
    const parentApiControl = $form.$customApi[pubControl.parentDataField];
    const apiControl = parentApiControl.GetCellManager(pubControl.rowId, pubControl.dataField);
    params = [apiControl, action, payload].filter(p => !!p);
    flushEventCallback.call(pubControl, customEvts, []); // 触发控件本身的自定义事件, 不需要回调
    if (action !== 'nogrid') {
      flushEventCallback.call(gridControl, parentCustomEvts, params); // 触发子表的BindChange，回调参数为子表内控件
    }
  } else {
    flushEventCallback.call(pubControl, customEvts, []);
  }
}

export default function customEventMixin(control) {
  control.prototype.$triggerEvt = function triggerEvt(mark, payload) {
    if (this.$$hasBinding && this.$form.$stateMachine.state !== 'init') {
      executeCustomEvt(this, mark, payload);
    }
  };
}
