import { Store } from 'vuex';
import formMutations from '@/lib/form-logic/modal/mutations';
import formLogicService from '@/lib/form-logic/instance/service.js';
import { debugMutation } from '@/lib/form-logic/utils/debug';
import { init } from '@/lib/form-logic';
import formConverter from '@/lib/form-logic/utils/converter';
let initFinished = false;
const prefix = 'Form/ViewModel/';
/**
 * 动态注册vuex module
 * @param  {[type]} store    [description]
 * @param  {[type]} context  [description]
 * @param  {[type]} htmlData [description]
 * @return {[type]}          [description]
 */
function restoreFormData(store: Store<any>, { objectId, context, htmlData }) {
  const nestedModules = ['Form', 'ViewModel'];
  const formData = formConverter.convertState(context, htmlData);
  init(store);
  // 判断表单数据是否已经存在，如果已存在，直接覆盖值，不重新生成module
  // 当编辑表单时，表单数据会已存在
  if (store.state.Form.ViewModel[objectId]) {
    store.state.Form.ViewModel[objectId] = formData;
  } else {
    store.registerModule([...nestedModules, objectId], {
      namespaced: true,
			state: formData,
			mutations: formMutations
    });
  }
  return formData;
}

export function destory(store, objectId) {
  initFinished = false;
  formLogicService.destroy(objectId);
  store.unregisterModule(['Form', 'ViewModel', objectId]);
}

/**
 * mutation mixin
 * @param  {[object]} store vuex对象
 * @return {[null]}
 */
function regAfterMutation(store) {
	if (formLogicService.getConfig('debugMode')) {
		store.subscribe((mutation) => {
			if (mutation.type.startsWith(prefix)) {
				debugMutation(mutation)
			}
		})
	}
}


export function add(store: Store<any>, { objectId, context, htmlData }) {
	const formData = restoreFormData(store, { objectId, context, htmlData });
  const options = {
    bizObjectId: objectId,
    returnData: context.ReturnData,
		formData,
		updateView(mutType, result) {
			store.commit(`${prefix}${objectId}/${mutType}`, result);
		}

	};
  formLogicService.newInstance(options);
}
