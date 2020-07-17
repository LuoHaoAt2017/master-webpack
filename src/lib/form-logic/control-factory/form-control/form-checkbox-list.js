import H3PluginDeveloper from '../../../h3-plugins-developer';
import { isFalsy } from '../../utils';

function FormCheckboxList() {

}
FormCheckboxList.prototype.$initValue = function initValue(value) {
  return this.$setValue(value);
};

FormCheckboxList.prototype.$valueType = String;

FormCheckboxList.prototype.$clearValue = () => ([]);

FormCheckboxList.prototype.$setValue = function setValue(value) {
  const result = [];
  if (isFalsy(value) || value.constructor === Object) return [];
  const isInSourceItems = this.options.defaultItems.some(item => item.Value === value);
  if (value.constructor === String) {
    value = value.split(';');
  } else if (value.constructor === Number || value.constructor === Boolean) {
    if (isInSourceItems) {
      result.push({ Value: value, Text: value });
      return result;
    }
  }
  for (const val of value) {
    result.push({ Value: val, Text: val });
  }
  // const newVal = value.filter(val => this.options.defaultItems.some(item => item.Value === val));
  return result;
};

// getValue 在控件取值的时候调用
FormCheckboxList.prototype.$getValue = function getValue(value) {
  const result = [];
  value.forEach((item) => {
    result.push(item.Value);
  });
  return result.join(';');
};
FormCheckboxList.prototype.$addItem = function addItem(value, text) {
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
FormCheckboxList.prototype.$clearItems = function clearItems() {
  this.options.defaultItems = []; // 清空
};

FormCheckboxList.prototype.$validate = function $validate(value) {

  let empty = false;
  let outofLength = true;
  if (this.options.Required && !value) {
    empty = true;
    this.valid = { empty };
  }
  // TODO 需求这样不允许超过200长度？
  if (value.length > 200) {
    outofLength = false;
    this.valid.outofLength = true;
    H3PluginDeveloper.IShowWarn(`[${this.options.DisplayName}]选项长度超过200`);
  }
  return !empty && outofLength;
};

export default FormCheckboxList;
