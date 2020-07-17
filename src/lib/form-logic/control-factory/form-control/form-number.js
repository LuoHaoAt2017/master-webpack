import { isEmpty, isFalsy, isString, isNumeric, IToKbit } from '../../utils';
import { commonDefaultValueSetter } from '../base-control/default-value';

const IntegerMaxLength = 15; // 整数最大表示长度
// const DecimalMaxLength = 5; // 小数最大表示长度

function FormNumber() {
}

// 位数补充
function toFixed(value) {
  const num = !Number.isNaN(this.options.decimalplaces) ? this.options.decimalplaces : 0;
  const floater = this.options.percentage ? num + 2 : num
  value = value.toString()
  if (value !== '') {
    const arr = value.split('.')
    const realFloat = (arr.length > 1 && arr[1]) ? arr[1].length : 0;
    if (realFloat > floater) {
      value = parseFloat(value || '0')
        // .toFixed(floater)
        // .toString();
      value = fomatFloat(value, floater); // tofixed方法不能在尾数为5时进一位
    } else if (floater > 0) {
      // 自动补全小数点和后面的位数
      const dot = value.indexOf('.') > -1 ? '' : '.';
      // 自动补全小数点前的0
      const zerro = dot === '' && value[0] === '.' ? '0' : '';
      value = `${zerro}${value}${dot}` +
        Array(floater - realFloat + 1).join('0');
    }
  }
  return value
}
// num为传入的值，n为保留的小数位
function fomatFloat(num, s) {
  var times = Math.pow(10, s);
  if (num < 0) {
      num = Math.abs(num);//先把负数转为正数，然后四舍五入之后再转为负数
      var des = parseInt((num * times + 0.5), 10) / times;
      return -des;
  } else {
      var des = parseInt((num * times + 0.5), 10) / times;
      return des;
  }
}

function formatNumber(value) {
  // 如果value是数组的话，数组只有一个值，处理成数字，如果有多个值，则处理成空
  // 计算规则主表某字段等于子表某字段情况
  if (isFalsy(value)) {
    return '';
  }
  if (!isString(value) && !isNumeric(`${value}`)) {
    return '';
  }
  let valStr = '';
  let val = `${value}`
  valStr = val.replace(/,/g, '');
  if (Number.isNaN(Number(valStr))) {
    return val;
  }
  // 处理15位整数
  if (valStr.indexOf('.') > -1) {
    const valSpieces = valStr.split('.');
    if (valSpieces[0].length > IntegerMaxLength) {
      valStr = `${valSpieces[0].substring(0, IntegerMaxLength)}.${valSpieces[1]}`;
    }
  } else if (valStr.length > IntegerMaxLength) {
    valStr = valStr.substring(0, IntegerMaxLength);
  }
  // 处理保留小数位
  // valStr = Number(valStr).toFixed(this.options.decimalplaces).toString();
  valStr = toFixed.call(this, Number(valStr).toString());
  // 处理千分位
  // if (this.options.showmode === '1') {
  //   valStr = IToKbit(valStr);
  // }
  return valStr;
}

FormNumber.prototype.$valueType = Number;

FormNumber.prototype.$setValue = function setValue(value) {
  return formatNumber.call(this, value);
};

FormNumber.prototype.$initDefaultValue = function initDefaultValue(value) {
  value = commonDefaultValueSetter.call(this, value);
  return this.$initValue(value);
};

FormNumber.prototype.$initValue = function initValue(value) {
  return formatNumber.call(this, value);
};

FormNumber.prototype.$getRuleValue = function getRuleValue(value) {
  if (!value) return 0;
  const res = Number(value);
  if (Number.isNaN(res)) {
    return 0
  }
  return res
};

FormNumber.prototype.$getValue = function getValue(value) {
  if (isFalsy(value)) {
    value = '';
  } else {
    const val = Number(value.toString().replace(/,/g, ''));
    value = Number.isNaN(val) ? '' : val;
  }
  return value + '';
};

FormNumber.prototype.$validate = function validate(value) {
  let empty = false;
  this.valid = {};
  if (this.options.Required) {
    empty = isEmpty(value);
    if (empty) {
      this.valid = { empty };
    }
  }
  return !empty && !this.valid.value;
};

export default FormNumber;
