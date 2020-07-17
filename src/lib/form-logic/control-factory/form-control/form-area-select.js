import { jsonParse, isFalsy, isString } from '../../utils';

function FormAreaSelect () {
}

function IsJsonString (str) {
  const JSON_START = /^\[|^\{(?!\{)/;
  const JSON_ENDS = {
    '[': /]$/,
    '{': /}$/,
  };
  const jsonStart = str.match(JSON_START);
  return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
}

FormAreaSelect.prototype.$valueType = Object;

FormAreaSelect.prototype.$clearValue = function clearValue () {
  return { adcode: '', adname: '', Detail: '' };
};

FormAreaSelect.prototype.$setValue = function setValue (value) {
  if (value && value.constructor === String) {
    if (IsJsonString(value)) {
      value = jsonParse(value);
    } else {
      value = this.$clearValue(); // 不是json格式字符串就说明设置的值是错的,直接赋值''
    }
  } else if (isFalsy(value) || value.constructor === Array || value.constructor === Number ||
    value.constructor === Boolean) {
    value = this.$clearValue();
  }
  // 如果有详细地址，也算有地址，不能直接清空
  return value && (value.adcode || value.Detail) ? value : this.$clearValue();
};

FormAreaSelect.prototype.$validate = function $validate (value) {
  if (IsJsonString(value)) {
    value = jsonParse(value);
  }
  let empty = false;
  if (this.options.Required) {
    empty = !value.adcode && !value.Detail;
    if (empty) {
      this.valid = { empty };
    }
  }
  return !empty;
};

FormAreaSelect.prototype.$getValue = function getValue (value) {
  if (value && value.constructor === Object) {
    return JSON.stringify(value);
  }
  return JSON.stringify({ adcode: '', adname: '', Detail: '' });
};

FormAreaSelect.prototype.$getRuleValue = function getRuleValue (value) {
  let area = value;
  if (IsJsonString(area)) {
    area = jsonParse(area);
  }
  let val = '';
  if (area) {
    const adname = area.adname;
    const detail = area.Detail;
    if (!adname && !detail) {
      val = '';
    } else {
      val = area;
    }
  }
  return val;
};

FormAreaSelect.prototype.$initValue = function initValue (value) {
  if (isFalsy(value)) {
    value = this.$clearValue();
  } else if (isString(value)) {
    value = jsonParse(value);
  } else {
    value = value;
  }
  return value;
};

FormAreaSelect.prototype.$isEmpty = function isEmpty () {
  const viewData = this.viewData;
  return !viewData || (!viewData.adcode && !viewData.Detail);
};

export default FormAreaSelect;
