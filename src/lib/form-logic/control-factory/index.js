import BaseControl from './base-control';
import formControlFactory from './form-control';
import { identity } from '../utils';

function SystemControl(options) {
  this.dataField = options.dataField;
  this.value = options.Value;
}

SystemControl.prototype.$queryAssign = identity;

SystemControl.prototype.$getRuleValue = function getRuleValue() {
  const ctrlField = this.dataField;
  let val = '';
  if (ctrlField === 'CreatedTime') { // 创建时间
    val = this.value;
  } else if (ctrlField === 'ModifiedTime') { // 修改时间
    val = this.value ? this.value : '';
  } else if (ctrlField === 'CreatedBy') { // 创建人
    val = this.value[0].UnitId;
  } else if (ctrlField === 'OwnerId' || ctrlField === 'OwnerDeptId') { // 拥有者
    val = this.value.length ? this.value[0].UnitId : '';
  } else {
    val = '';
  }
  return val;
};

function IControlFactory(formInstance, updateView) {
  function IControl() {}
  IControl.prototype = {
    $form: formInstance,
    $updateView: updateView,
  };
  const IProto = new IControl();
  const baseProto = Object.assign(IProto, BaseControl.prototype);
  function IBaseControl() {}
  IBaseControl.prototype = baseProto;
  const implControlCache = {};
  return function implControlFactory(options, $data) {
    const controlKey = options.controlkey;
    if (controlKey === 'FormGridView') {
      options.implControlFactory = implControlFactory;
    }
    if (implControlCache[controlKey]) {
      return new implControlCache[controlKey](options, $data);
    }
    const formControlCtor = formControlFactory(controlKey);
    function ImplControl(opts = {}, data) {
      try {
        BaseControl.call(this, opts, data);
        formControlCtor.call(this, opts, data);
      } catch (error) {
        if (formInstance.$$debugMode) {
          const errorMsg = `控件${opts.dataField}-${opts.DisplayName}-初始化失败 error: ${error.message}`;
          formInstance.$errorHandler(errorMsg, error);
        }
      }
    }
    if (controlKey) {
      const formControlProto = new IBaseControl();
      Object.assign(formControlProto, formControlCtor.prototype);
      ImplControl.prototype = formControlProto;
      implControlCache[controlKey] = ImplControl;
      return new ImplControl(options, $data);
    }
    return new SystemControl(options);
  };
}

export default IControlFactory;
