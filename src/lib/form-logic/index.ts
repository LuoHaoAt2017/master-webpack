import { Store } from 'vuex';
import formLogicService from './instance/service';
import formConverter from './utils/converter';
import formMutations from './modal/mutations';
import { debugAction, debugMutation } from './utils/debug';
import viewModelModule from '@/store/modules/form/viewModel';

const prefix = 'Form/ViewModel/';
let initFinished = false;

/**
 * 动态注册vuex module
 * @param  {[type]} store    [description]
 * @param  {[type]} context  [description]
 * @param  {[type]} htmlData [description]
 * @return {[type]}          [description]
 */
function restoreFormData (store: Store<any>, context: any, htmlData: any) {
  const nestedModules = ['Form', 'ViewModel'];
  const formData = formConverter.convertState(context, htmlData);
  // 判断表单数据是否已经存在，如果已存在，直接覆盖值，不重新生成module
  // 当编辑表单时，表单数据会已存在
  if (store.state.Form.ViewModel[context.BizObjectId]) {
    store.state.Form.ViewModel[context.BizObjectId] = formData;
  } else {
    store.registerModule([...nestedModules, context.BizObjectId], {
      namespaced: true,
      state: formData,
      mutations: formMutations,
    });
  }
  return formData;
}

/**
 * action mixin
 * @param  {[object]} store vuex对象
 * @return {[null]}
 */
function regBeforeAction (store) {
  store.subscribeAction(action => {
    debugAction(action);
  });
}

/**
 * mutation mixin
 * @param  {[object]} store vuex对象
 * @return {[null]}
 */
function regAfterMutation (store) {
  if (formLogicService.getConfig('debugMode')) {
    store.subscribe((mutation) => {
      if (mutation.type.startsWith(prefix)) {
        debugMutation(mutation);
      }
    });
  }
}

function init (store) {
  if (!initFinished) {
    regAfterMutation(store);
    regBeforeAction(store);
    initFinished = true;
    store.registerModule(['Form', 'ViewModel'], viewModelModule);
  }
}

function restore (bizObjectId) {
// 回显表单数据，此函数为空，目前预留占位，未来有可能会有调用
}

/**
 * 初始化表单逻辑
 * 传入store和接口数据，返回一个对象，调用
 * @param  {[object]} options.store       vuex store对象
 * @param  {[object]} options.viewContext 表单渲染数据
 * @param  {[string]} options.htmlData    表单html片段字符串
 * @param  {[string]} options.javascript  [description]
 * @return {[null]}
 */
function add (
  store: Store<any>,
  {
    Version,
    ViewContext,
    HtmlContent, // refator: 逻辑移动至formLogic/converter.js
    Javascript,
    CarryOverMapping,
  },
) {
  if (store === undefined ||
    ViewContext === undefined ||
    HtmlContent === undefined ||
    Javascript === undefined) {
    throw new Error('初始化表单传参出错');
  }

  const context = ViewContext;
  const bizObjectId = context.BizObjectId;
  const returnData = context.ReturnData;
  const formData = restoreFormData(store, context, HtmlContent);
  const options = {
    version: Version,
    bizObjectId,
    returnData,
    formData,
    Javascript,
    CarryOverMapping,
    updateView (mutType, payload) {
      store.commit(`${prefix}${bizObjectId}/${mutType}`, payload);
    },
  };
  formLogicService.newInstance(options);
}

/**
 * 销毁表单逻辑
 * @param  {[object]} options.store       vuex store对象
 * @param  {[string]} options.bizObjectId 表单对象id
 * @return {[null]}
 */
function destroy ({
  store,
  bizObjectId,
}) {
  if (store === undefined ||
    bizObjectId === undefined) {
    throw '销毁表单传参出错';
  }
  try {
    formLogicService.destroy(bizObjectId);
    store.unregisterModule(['Form', 'ViewModel', bizObjectId]);
  } catch (e) {

  }
}

/**
 * 模块导出接口
 */
export {
  init, add, destroy, restore, formLogicService,
};
