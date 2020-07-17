import { Mutation } from '../../modal/types';
import {
  identity, isEmpty, deepCopy, isPromise,
} from '../../utils';
import { State } from '../../utils/constants';

function valueSetter (control) {
  control.$publish();
  control.$triggerEvt();
}

// 为控件的value定义存取器
function defineValueProp (control, $data) {
  const propDef = {
    // 这里为了获取this，必须使用function定义
    get: function get () {
      return control.$getValue($data.value);
    },
    set: function set (newVal) {
      control.oldValue = deepCopy(control.value);
      newVal = isEmpty(newVal) ? this.$clearValue() : newVal;
      const result = this.$setValue(newVal);
      // if (result instanceof Promise) {
      if (isPromise(result)) {
        const asyncId = this.$form.$hangupAsync();
        result.then((response) => {
          // 注意顺序
          // 更新数据层
          control.$updateView(Mutation.SET, {
            dataField: control.dataField, value: response,
          });
          // 发消息
          valueSetter(this);
          // 当前异步标记解决
          this.$form.$resolveAsync(asyncId);
        }).catch((error) => {
          if (control.$form.$$debugMode) {
            const errorMsg = `控件${control.options.DisplayName}-${control.dataField} setValue请求失败`;
            control.$form.$errorHandler(errorMsg, error);
          }
          this.$form.$rejectAsync();
        });
      } else {
        this.$updateView(Mutation.SET, {
          dataField: control.dataField, value: result,
        });
        valueSetter(this);
      }
    },
  };
  Object.defineProperty(control, 'value', propDef);
}

function initVisible (control, $data) {
  const propDef = {
    get: function getter () {
      return $data.visible;
    },
    set: function setter (newVisible) {
      const state = control.$form.$stateMachine.state;
      if (control.visible && !newVisible && state === State.UPDATE) {
        if (!(control.controlKey === 'FormQuery' && !control.value)) {
          // 控件由可见变为隐藏，并且原值不为空时，需要清空值
          control.value = control.$clearValue();
        }
      }
      control.$updateView(Mutation.SETVISIBLE, {
        dataField: control.dataField, visible: newVisible,
      });
    },
  };
  Object.defineProperty(control, 'visible', propDef);
}

function initValid (control, $data) {
  const propDef = {
    get: function getter () {
      return $data.valid;
    },
    set: function setter (valid) {
      control.$updateView(Mutation.VALID, {
        dataField: control.dataField, valid,
      });
    },
  };
  Object.defineProperty(control, 'valid', propDef);
}

function initViewData (control, $data) {
  Object.defineProperty(control, 'viewData', {
    get: function getter () {
      return $data.value;
    },
  });
}

export function initProxy (control, $data) {
  initViewData(control, $data);
  initVisible(control, $data);
  initValid(control, $data);
  const value = isEmpty($data.value) ? control.$clearValue() : $data.value;
  // 创建时取默认值
  const initResult = control.$$shouldInitDefaultValue?
    control.$initDefaultValue(value):
    control.$initValue(value);

  if (isPromise(initResult)) {
    control.$updateView(Mutation.SET, {
      dataField: control.dataField, value: control.$clearValue(),
    });
    const asyncId = control.$form.$hangupAsync();
    initResult.then((response) => {
      control.$updateView(Mutation.SET, {
        dataField: control.dataField, value: response,
      });
      control.value = response;
      defineValueProp(control, $data);
      control.$form.$resolveAsync(asyncId);
      return true;
    }).catch((error) => {
      if (control.$form.$$debugMode) {
        const errorMsg = `控件${control.options.DisplayName}-${control.dataField} initValue请求失败`;
        control.$form.$errorHandler(errorMsg, error);
      }
      control.$form.$rejectAsync();
    });
  }
  // 这里仅触发非子表控件;
  else if(!control.isIngrid) {
    control.value = initResult;
    control.$updateView(Mutation.SET, {
      dataField: control.dataField, value: initResult,
    });
    defineValueProp(control, $data);
  }
}

export function proxyMixin (controlParam) {
  const control = controlParam;
  // 可在子类中实现
  control.prototype.$$shouldInitDefaultValue = false;
  control.prototype.$valueType = String;
  control.prototype.$getValue = identity;
  control.prototype.$setValue = identity;
  control.prototype.$initDefaultValue = identity;
  control.prototype.$initValue = identity;
  control.prototype.$getRuleValue = identity;
  control.prototype.$queryAssign = identity;
  control.prototype.$saveDataField = function saveDataField (value) {
    return { [this.dataField]: value };
  };
  control.prototype.$clearValue = () => '';
  control.prototype.$isEmpty = isEmpty;
  control.prototype.$validate = function validate (value) {
    let empty = false;
    this.valid = {};
    if (this.options.Required) {
      empty = isEmpty(value);
      if (empty) {
        this.valid = { empty };
      }
    }
    return !empty;
  };
}
