const toString = Object.prototype.toString;

// 返回vue匹配的props的对象
const defaultProps = (props) => {
  const targetProps = props;
  for (const key of Object.keys(targetProps)) {
    const defaultValue = targetProps[key];

    // 支持String， Number等类型
    if (defaultValue && defaultValue.name && window[defaultValue.name] === defaultValue) {
      targetProps[key] = {
        type: defaultValue,
        default: null,
      };
      continue;
    }

    const type = toString.call(defaultValue).replace('[object ', '').replace(']', '');

    // 如果传进来的是vue的原生props对象的话
    if (type === 'Object') {
      if (defaultValue.type != null ||
          defaultValue.default != null ||
          defaultValue.validator != null ||
          defaultValue.twoWay != null ||
          defaultValue.required != null) {
        continue;
      }
    }

    // 支持 Object和Array的简洁声明方式
    // Todo: 目前看来这样并没有什么卵用
    if (type === 'Array' || type === 'Object') {
      targetProps[key] = {
        type: window[type],
        default: defaultValue,
      };
      continue;
    }

    targetProps[key] = {
      type: window[type],
      default: defaultValue,
    };
  }
  return targetProps;
};

const oneOfType = (validList, defaultValue) => {
  const validaObj = {};

  validaObj.default = defaultValue;
  validaObj.validator = (value) => {
    if (value == null) {
      return true;
    }
    const res = validList.some((item) => {
      let validName = null;
      if (typeof item === 'string') {
        validName = item;
      } else {
        validName = item.name;
      }
      if (toString.call(value).indexOf(validName) > -1) {
        return true;
      }
      return false;
    });
    return res;
  };

  return validaObj;
};

const oneOf = (validList, defaultValue) => {
  const validaObj = {};

  validaObj.default = defaultValue;
  validaObj.validator = (value) => {
    if (value == null) {
      return true;
    }

    for (const item of validList) {
      if (value === item) {
        return true;
      }
    }
    return false;
  };

  return validaObj;
};


export default {
  defaultProps,
  oneOfType,
  oneOf,
};
