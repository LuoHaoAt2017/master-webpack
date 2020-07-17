import { isNumeric, isFalsy } from '../../utils';

function FormRadioButtonList() {
}

FormRadioButtonList.prototype.$valueType = String;

FormRadioButtonList.prototype.$clearValue = () => ({});

FormRadioButtonList.prototype.$setValue = function setValue(val) {
  let result = {};
  if (isFalsy(val) || val.constructor === Array) return result;
  if (val.constructor === Object) {
    val = val.Value ? val.Value : '';
  }
  return { Value: val, Text: val };
};

FormRadioButtonList.prototype.$initValue = function initValue(val) {
  return this.$setValue(val);
};

FormRadioButtonList.prototype.$getValue = function getValue(value) {
  return value.Value || '';
};

FormRadioButtonList.prototype.$addItem = function addItem(value, text) {
  if ((text || value) && this.options.Editable) {
    let txt = '';
    if (text) {
      txt = text;
    } else {
      txt = value;
    }
    this.options.defaultItems.push({ Value: value, Text: txt });
  }
};
FormRadioButtonList.prototype.$clearItems = function clearItems() {
  this.options.defaultItems = []; // 清空
};
FormRadioButtonList.prototype.$getRuleValue = function getRuleValue(value) {
  // 参与计算时，如果为数字格式 需要按数字计算
  return isNumeric(value) ? Number(value) : value;
};

export default FormRadioButtonList;
