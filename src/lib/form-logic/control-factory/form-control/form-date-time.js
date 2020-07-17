import { isiOS } from '../../utils';
import { commonDefaultValueSetter } from '../base-control/default-value'

function FormDateTime() {
}

const $formatDateTime = function formatDateTime(value) {
  if (!value || value.length === 0 || value === -1) {
    return '';
  }
  value = `${value}`;
  let res = '';
  // 兼容ios手机
  // 加一个 不是时分的条件，解决ios时间计算不显示
  if (isiOS && this.options.datetimemode !== ('hh:ii' ||'hh:mm')) {
    if (value.length === 7) {
      value += '/01';
    } else if (value.length === 4) {
      value = `${value}/01/01`;
    } else if (value.length === 1 || value.length === 2) {
      value = `2001/${value}/01`;
    }
  }
  // 先判断传进来的值是否合法
  if (!(value instanceof Date) && value.indexOf('Date') < 0 && this.options.datetimemode !== 'hh:ii' && this.options.datetimemode !== 'hh:mm') {
    if (Number.isNaN(new Date(value.replace(/-/g, '/')).getTime())) {
      return '';
    }
  }
  if (this.options.datetimemode === 'yyyy-mm-dd') {
    if (value instanceof Date) {
      res = new Date(value).Format('yyyy-MM-dd');
    } else if (value.indexOf('Date') > -1) {
      res = new Date(parseInt(value.replace('/Date(', '').replace(')/', ''), 10)).Format('yyyy-MM-dd');
    } else {
      res = new Date(value.replace(/-/g, '/')).Format('yyyy-MM-dd');
    }
    // 验证是否是合法的日期
    // if (Number.isNaN(new Date(res).getTime())) {
    //   return '';
    // }
  } else if (this.options.datetimemode === 'hh:ii' || this.options.datetimemode === 'hh:mm') {
    if (value.length > 5) {
      const reg = /\d{4}(-|\/|.)\d{1,2}\1\d{1,2}/;
      if (reg.test(value)) {
        if (value.length === 10) {
          res = '00:00';
        } else {
          if (value.indexOf('Date') > -1) {
            value = new Date(parseInt(value.replace('/Date(', '').replace(')/', ''), 10)).Format('yyyy-MM-dd hh:mm');
          }
          res = value.slice(11, 16);
        }
      }
    } else {
      res = value.substr(0, 5);
    }
  } else if (this.options.datetimemode === 'yyyy-mm') {
    if (value instanceof Date) {
      res = new Date(value).Format('yyyy-MM');
    } else if (value.indexOf('Date') > -1) {
      res = new Date(parseInt(value.replace('/Date(', '').replace(')/', ''), 10)).Format('yyyy-MM');
    } else {
      res = new Date(value.replace(/-/g, '/')).Format('yyyy-MM');
    }
  } else if (value instanceof Date) {
    res = new Date(value).Format('yyyy-mm-dd hh:mm');
  } else if (value.indexOf('Date') > -1) {
    res = new Date(parseInt(value.replace('/Date(', '').replace(')/', ''), 10)).Format('yyyy-MM-dd hh:mm');
  } else {
    res = new Date(value.replace(/-/g, '/').replace(/T/g, ' ')).Format('yyyy-MM-dd hh:mm');
  }
  return res;
};

FormDateTime.prototype.$valueType = String;

FormDateTime.prototype.$setValue = function setValue(val) {
  const res = $formatDateTime.call(this, val);
  return res;
};

FormDateTime.prototype.$getValue = function getValue(val) {
  const res = $formatDateTime.call(this, val).replace(/\//g, '-');
  return res;
};

FormDateTime.prototype.$initDefaultValue = function initDefaultValue(value) {
  value = commonDefaultValueSetter.call(this, value);
  return this.$initValue(value);
};

FormDateTime.prototype.$initValue = function initValue(value) {
  return $formatDateTime.call(this, value);
};

FormDateTime.prototype.$getRuleValue = function getRuleValue(value) {
  const val = $formatDateTime.call(this, value);
  let v = `${val}`;
  v = v.replace(/T/g, ' ').replace(/\//g, '-');
  return v;
};

export default FormDateTime;
