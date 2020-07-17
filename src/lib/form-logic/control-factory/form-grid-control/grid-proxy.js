import { isEmpty, deepCopy, isPromise } from '../../utils';
import { Mutation } from '../../modal/types';
import { State } from '../../utils/constants';

function rowDataSetter (control, namespace, isUpdatingRow) {
  control.$publish(namespace);
  // 兼容PC端，子表内变化，发布整个子表的消息，2019-5-15晚 修改逻辑为不绑定在子表上 以下代码注释
  // const gridControl = control.$form[control.parentDataField];
  // gridControl.$publish({
  //   source: gridControl.dataField,
  // });
  // 当isUpdatingRow，表示自定义代码的updateRow 不执行子表的整体自定义事件
  control.$triggerEvt(isUpdatingRow ? 'nogrid' : '');
}

function defineReactive (proxyControl, rowId, controlData) {
  const namespace = [proxyControl.parentDataField, rowId, proxyControl.dataField];
  // 设置value 属性的响应式更新
  Object.defineProperty(proxyControl, 'value', {
    get: function getter () {
      return proxyControl.$getValue(controlData.value);
    },
    set: function setter (newVal) {
      proxyControl.oldValue = deepCopy(proxyControl.value);
      newVal = isEmpty(newVal) ? proxyControl.$clearValue() : newVal;
      const isUpdatingRow = proxyControl.$form[proxyControl.parentDataField].updatingRow;
      const result = proxyControl.$setValue(newVal);
      if (isPromise(result)) {
        const asyncId = proxyControl.$form.$hangupAsync();
        result.then((response) => {
          proxyControl.$updateView(Mutation.SETINGRID, {
            namespace,
            value: response,
          });
          rowDataSetter(proxyControl, namespace, isUpdatingRow);
          proxyControl.$form.$resolveAsync(asyncId);
          if (this.valid.empty) {
            window.setTimeout(() => {
              this.$validate(response);
            }, 0);
          }
          return true;
        }).catch((error) => {
          if (proxyControl.$form.$$debugMode) {
            const errorMsg = `子表内控件${proxyControl.options.DisplayName}-${proxyControl.dataField} setValue请求失败`;
            proxyControl.$form.$errorHandler(errorMsg, error);
          }
          proxyControl.$form.$rejectAsync();
        });
      } else {
        proxyControl.$updateView(Mutation.SETINGRID, {
          namespace,
          value: result,
        });
        rowDataSetter(proxyControl, namespace, isUpdatingRow);
        if (this.valid.empty) {
          window.setTimeout(() => {
            this.$validate(result);
          }, 0);
        }
      }
    },
  });
  // 设置valid 属性的响应式更新
  Object.defineProperty(proxyControl, 'valid', {
    get: function getter () {
      return controlData.valid;
    },
    set: function setter (newValid) {
      proxyControl.$updateView(Mutation.VALIDINGRID, {
        namespace,
        valid: newValid,
      });
    },
  });
  // 设置visible 属性的响应式更新
  Object.defineProperty(proxyControl, 'visible', {
    get: function getter () {
      return controlData.visible;
    },
    set: function setter (newVisible) {
      const state = proxyControl.$form.$stateMachine.state;
      const oldVisible = controlData.visible;
      if (oldVisible !== newVisible && state === State.UPDATE) {
        // 控件由可见变为隐藏，并且原值不为空时，需要清空值
        if (controlData.clearable && !newVisible) {
          proxyControl.value = proxyControl.$clearValue();
        } else {
          controlData.clearable = true;
        }
      }
      proxyControl.$updateView(Mutation.SETVISIBLEINGRID, {
        namespace,
        visible: newVisible,
      });
    },
  });
  // 图片附件控件提交的数据和用来做计算规则隐藏规则的时候的值时不一样的，这个purevalue用来做计算规则
  Object.defineProperty(proxyControl, 'viewData', {
    get: function getter () {
      return controlData.value;
    },
  });
}

function initOptions (control, $data) {
  Object.defineProperty(control, 'options', {
    value: $data.options,
    writable: false,
    enumerable: true,
    configurable: false,
  });
}

// 子表控件的逻辑代理，将子表控件的处理，转移到对应子表控件的逻辑控件中处理
function GridProxy (rowId, controlData, needInit) {
  this.rowId = rowId;
  controlData.clearable = !needInit;
  initOptions(this, controlData);
  if (needInit) {
    const namespace = [this.parentDataField, rowId, this.dataField];
    const visible = this.visible;
    // 初始化时，取子表的visible的默认值
    this.$updateView(Mutation.SETVISIBLEINGRID, {
      namespace,
      visible,
    });
    // 初始化时，若为表单创建模式下，取value的默认值 此时this.value会从prototype上找也就是tmpl
    const IsCreateMode = this.$form.$responseContext.IsCreateMode;
    const value = (isEmpty(controlData.value) && IsCreateMode) ? deepCopy(this.value) : controlData.value;
    // 这里如果$store上的value为空
    const initResult = this.$$shouldInitDefaultValue?
      this.$initDefaultValue(value):
      this.$initValue(value);

    if (isPromise(initResult)) {
      this.$updateView(Mutation.SETINGRID, {
        namespace,
        value: this.$clearValue(),
      });
      const asyncId = this.$form.$hangupAsync();
      initResult.then((response) => {
        this.$updateView(Mutation.SETINGRID, {
          namespace,
          value: response,
        });
        defineReactive(this, rowId, controlData);
        this.$form.$resolveAsync(asyncId);
      }).catch((error) => {
        if (this.$form.$$debugMode) {
          const errorMsg = `子表内控件${this.options.DisplayName}-${this.dataField} initValue请求失败`;
          this.$form.$errorHandler(errorMsg, error);
        }
        this.$form.$rejectAsync();
      });
    } else {
      this.$updateView(Mutation.SETINGRID, {
        namespace,
        value: initResult,
      });
      defineReactive(this, rowId, controlData);
    }
  } else {
    // 在copyRow  时不需要初始化value， needInit = false
    defineReactive(this, rowId, controlData);
  }
}

export default GridProxy;
