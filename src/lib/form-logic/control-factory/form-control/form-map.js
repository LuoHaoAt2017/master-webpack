import H3PluginDeveloper from '../../../h3-plugins-developer';
import { jsonParse, isString, isFalsy } from '../../utils';

function FormMap() {
}

const isDingtalk = /DingTalk/.test(navigator.userAgent);

function IsJsonString(str) {
  const JSON_START = /^\[|^\{(?!\{)/;
  const JSON_ENDS = {
    '[': /]$/,
    '{': /}$/,
  };
  const jsonStart = str.match(JSON_START);
  return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
}

function getLocation() {
  return new Promise((resolve, reject) => {
    H3PluginDeveloper.ILocation(true, (result) => {
      const poidata = {
        Address: result.address,
        Point: {
          lat: result.lat,
          lng: result.lng,
        },
      };
      resolve(poidata);
    }, (err) => {
      reject(err)
    });
  });
}

FormMap.prototype.$clearValue = () => ({ Address: '', Point: { lat: 0, lng: 0 } });

FormMap.prototype.$valueType = String;

function formatMap(value) {
  if (value && value.constructor === String) {
    if (IsJsonString(value)) {
      value = jsonParse(value);
    } else {
      value = this.$clearValue(); // 不是json格式字符串就说明设置的值是错的,直接赋值''
    }
  } else if (isFalsy(value) || value.constructor === Array || value.constructor === Number
    || value.constructor === Boolean) {
    value = this.$clearValue();
  }
  return value && value.Address ? value : this.$clearValue();
}

FormMap.prototype.$validate = function validate(val) {
  let empty = false;
  if (this.options.Required) {
    const address = jsonParse(val).Address;
    empty = !address || address.trim() === '';
    if (empty) {
      this.valid = { empty };
    }
  }
  return !empty;
};

FormMap.prototype.$setValue = function setValue(val) {
  return formatMap.call(this, val);
};

FormMap.prototype.$getValue = function getValue(value) {
  let res = '';
  if (isString(value)) {
    return value;
  }
  res = JSON.stringify(value);
  return res;
};

FormMap.prototype.$initValue = function initValue(val) {
  // 异步请求
  if (isDingtalk && !this.$form.$responseContext.IsExternalForm &&
    this.$form.$responseContext.IsCreateMode) {
    return getLocation();
  }
  const res = formatMap.call(this, val);
  return res;
};

export default FormMap;
