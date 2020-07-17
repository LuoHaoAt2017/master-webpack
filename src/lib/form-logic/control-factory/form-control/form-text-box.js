
import { isEmpty, isFalsy, addressConvert } from '../../utils';
import { commonDefaultValueSetter } from '../base-control/default-value'
import { FormActionType } from '@/store/modules/form/types';
import store from '@/store';
import { identityCodeValid } from '@/config/common';

function FormTextBox () {
}

FormTextBox.prototype.$valueType = String;

FormTextBox.prototype.$setValue = function setValue (val) {
  if (isFalsy(val)) {
    return '';
  }
  // 逻辑控件填充单行文本
  if (typeof val === 'boolean') {
    return val ? 'true' : 'false';
  }

  let res = val.toString();
  // 地址控件填充单行文本
  res = addressConvert(res);

  if (res.length > 200) {
    res = res.substr(0, 200);
  }
  return `${res}`/* .replace(/<\/?.+?>/g, '') */.replace(/[\r\n]/g, '');
};

FormTextBox.prototype.$getValue = function getValue (val) {
  val = (val === null || val === undefined) ? '' : `${val}`;
  const modes = ['Mobile', 'Telephone', 'Card', 'identityCard'];
  if (modes.indexOf(this.options.mode) !== -1) {
    val = val.replace(/\s|\./g, '');
  }
  val = val.toString();
  if (val.length > 200) {
    val = val.substr(0, 200);
  }
  // 去除换行
  val = val/* .replace(/<\/?.+?>/g, '') */.replace(/[\r\n]/g, '');
  val = val.trim();
  return val;
};

FormTextBox.prototype.$validate = function $validate (value = '') {
  let empty = false;
  const val = value.trim();
  this.valid = {};
  if (val === '') {
    if (this.options.Required) {
      empty = isEmpty(value);
      if (empty) {
        this.valid = { empty };
      }
    }
    return !empty;
  } else if (this.options.mode) {
    let exp = new RegExp('');
    let err = '';
    switch (this.options.mode) {
      case 'Email':
        // exp = /^[A-Za-z\d]+(_[A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z]{2,4}$/;
        exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        err = '请填写正确的邮箱格式';
        break;
      case 'Mobile':
      case 'Telephone':
        // 手机号：1、输入位数不满11个数时 2、开头3位非正确，校验格式： 1 {3丨4丨5丨6丨7丨8丨9] + 数字
        // 固话：校验格式： 区号(0开头3-4位数字) + 电话号码(7-8位数字)， 可有可无分隔符号(-)
        exp = /^(((0\d{2,3}-?)?\d{7,8})|(1[3456789]\d{9}))$/;
        err = '请填写正确的电话号码'; // "错误的电话或手机号码格式!";
        break;
      case 'Card':
        err = '请填写正确的身份证号码';
        break;
      default:
    }
    let isValid = true;
    if (this.options.mode === 'Card') {
      isValid = identityCodeValid(val);
    } else if (exp) {
      isValid = exp.test(val);
    }
    if (!isValid) {
      store.dispatch(`Form/${FormActionType.SHOWVALIDMSG}`, err);
      this.valid = { value: !isValid };
      return false;
    }
  }
  return true;
};

FormTextBox.prototype.$initDefaultValue = function initDefaultValue(value) {
  value = commonDefaultValueSetter.call(this, value);
  return this.$initValue(value);
};

// FormTextBox.prototype.$initValue = function initValue(value) {
//   // let v = reFilterText(value)
//   return this.$setValue(value);
// }



export default FormTextBox;
