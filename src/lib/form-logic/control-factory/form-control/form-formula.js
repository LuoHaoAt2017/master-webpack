import { isNumeric, isFalsy, IToKbit } from '../../utils';
import { commonDefaultValueSetter } from '../base-control/default-value'

const BindControlType = {
  Text: 'text',
  DateTime: 'datetime',
  Number: 'number',
  Bool: 'boolean',
};

const NumberMode = {
  Normal: '0',
  Kbit: '1',
};

function FormFormula(options) {
  this.$valueType = {
    [BindControlType.Number]: Number,
    [BindControlType.Bool]: Boolean,
    [BindControlType.DateTime]: String,
    [BindControlType.Text]: String,
  }[options.bindtype] || String;
  // 整数最大长度，超过21位的话，就会变成科学计数法
  this.integerMaxLength = 15;
  // 小数最大长度，超过5位的话，就会变成科学计数法
  this.decimalMaxLength = 5;
}

// function convertValue(v) {
//   if (this.options.bindtype === BindControlType.DateTime) {
//     v = v && v.toString().trim();
//     v = v.replace(/-/g, '/');
//     v = new Date(v);
//     if (Number.isNaN(v.getFullYear()) || v.getFullYear() < 1971) {
//       v = '';
//     } else {
//       v = v.Format('yyyy-MM-dd hh:mm:ss');
//     }
//   }
//   if (this.options.bindtype === BindControlType.Bool) {
//     v = Boolean(v).toString();
//   }
//   if (this.options.bindtype === BindControlType.Number) {
//     if (!isNumeric(`${v}`.replace(/,/g, ''))) {
//       v = '0';
//     }
//   }
//   return v;
// }

// function valChange(vStr) {
//   vStr += '';
//   let v = vStr;
//   if (vStr.indexOf('.') > -1) {
//     if (vStr.split('.')[0].length > this.integerMaxLength) {
//       vStr = vStr.split('.')[0].substring(0, this.integerMaxLength) + vStr.split('.')[1];
//     }
//   } else if (vStr.length > this.integerMaxLength) {
//     vStr = vStr.substring(0, this.integerMaxLength);
//   }

//   if (isNumeric(this.options.decimalplaces)) {
//     if (this.options.bindtype === BindControlType.Number) {
//       vStr = vStr.replace(/,/g, '');
//       v = parseFloat(vStr).toFixed(this.options.decimalplaces);
//       if (this.options.showmode === NumberMode.Kbit) {
//         v = IToKbit(v);
//       }
//     }
//   }
//   return v;
// }

function handleNumber(val) {
  let valStr = `${val || ''}`.replace(/,/g, '').trim();
  if (!isNumeric(valStr)) {
    return '';
  }
  if (valStr.includes('.')) {
    let [intPart, decimalPart] = valStr.split('.');
    if (intPart.length > this.integerMaxLength) {
      intPart = intPart.substr(0, this.integerMaxLength);
    }
    if (decimalPart.length > this.decimalMaxLength) {
      decimalPart = decimalPart.substr(0, this.decimalMaxLength);
    }
    valStr = [intPart, decimalPart].join('.');
  } else if (valStr.length > this.integerMaxLength) {
    valStr = valStr.substr(0, this.integerMaxLength);
  }
  if (isNumeric(this.options.decimalplaces)) {
    valStr = Number(valStr).toFixed(this.options.decimalplaces);
  }
  if (this.options.showmode === NumberMode.Kbit) {
    valStr = IToKbit(valStr);
  }
  return valStr;
}

function handleDate(val) {
  let valStr = `${val}`.trim();
  valStr = valStr.replace(/-/g, '/');
  const dateVal = new Date(valStr);
  if (Number.isNaN(dateVal.getFullYear()) || dateVal.getFullYear() < 1971) {
    valStr = '';
  } else {
    valStr = dateVal.Format('yyyy-MM-dd hh:mm:ss');
  }
  return valStr;
}

function handleBool(val) {
  if (Array.isArray(val)) {
    val = val[0];
  }
  // 计算处理结果有可能是一个boolean字符串
  if (val === 'false') return false;
  if (val === 'true') return true;
  return (!!val).toString();
}

function formatValue(value) {
  switch (this.options.bindtype) {
    case BindControlType.Number:
      return handleNumber.call(this, value);
    case BindControlType.DateTime:
      return handleDate.call(this, value);
    case BindControlType.Bool:
      return handleBool.call(this, value);
    default:
      return `${value}`;
  }
}

FormFormula.prototype.$clearValue = () => '';

FormFormula.prototype.$getValue = function getValue(value) {
  if (this.options.showmode === NumberMode.Kbit) {
    value = isFalsy(value) ? '' : `${value}`.replace(/,/gi, '');
  }
  return value;
};

FormFormula.prototype.$setValue = formatValue;

FormFormula.prototype.$initDefaultValue = function initDefaultValue(value) {
  value = commonDefaultValueSetter.call(this, value);
  return this.$initValue(value);
};

FormFormula.prototype.$initValue = formatValue;

FormFormula.prototype.$getRuleValue = function getRuleValue(value) {
  // if (this.options.bindtype !== BindControlType.Number &&
  // this.options.bindtype !== BindControlType.Bool) {
  //   return value || '';
  // }

  // fix 公式型控件如果都是数值的时候相加的结果
  if (this.options.bindtype === BindControlType.Number) {
    const numValue = Number(value);
    return Number.isNaN(numValue) ? 0 : numValue;
  } else if (this.options.bindtype !== BindControlType.Bool) {
    return value || '';
  }
  return value;
};

FormFormula.prototype.$saveDataField = function saveDataField() {
  return {};
};

export default FormFormula;
