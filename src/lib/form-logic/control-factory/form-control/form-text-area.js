import { isFalsy, addressConvert } from '../../utils';
import { commonDefaultValueSetter } from '../base-control/default-value';

function FormTextArea () {
}

FormTextArea.prototype.$valueType = String;

// 不要用箭头函数
// getValue 在控件取值的时候调用
FormTextArea.prototype.$setValue = function setValue (val) {
  if (isFalsy(val)) {
    val = '';
  }

  // 逻辑控件填充单行文本
  if (typeof val === 'boolean') {
    return val ? 'true' : 'false';
  }

  let res = val.toString();
  // 地址控件填充单行文本
  res = addressConvert(res);

  if (res.length > 2000) {
    res = res.substr(0, 2000);
  }
  return val;
};

FormTextArea.prototype.$getValue = function getValue (val) {
  return (val === null || val === undefined) ? '' : `${val}`;
};

FormTextArea.prototype.$getRuleValue = function getRuleValue (val) {
  return val.replace(/[\r\n]/g, '');
};

FormTextArea.prototype.$initDefaultValue = function initDefaultValue (value) {
  value = commonDefaultValueSetter.call(this, value);
  return this.$initValue(value);
};

// FormTextArea.prototype.$initValue = function initValue(value) {
//   // let v = reFilterText(value)
//   return this.$setValue(value);
// }
export default FormTextArea;
