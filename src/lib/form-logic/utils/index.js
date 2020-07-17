import { ControlType } from './constants';

export const toArray = function toArray(param) {
  return param instanceof Array ? param : [param];
};

export const noop = () => {};

export const identity = arg => arg;

export const resolvedPromise = () => Promise.resolve();

export const isFalsy = (val) => {
  if (
    val === null ||
    val === undefined ||
    val === '' ||
    (typeof val === 'number' && Number.isNaN(val))
  ) {
    return true;
  }
  return false;
};

export const isEmpty = val =>
  isFalsy(val) ||
  (val instanceof Array && val.length === 0) ||
  (typeof val === 'object' && Object.keys(val).length === 0);

export const IGuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    /* eslint-disable no-bitwise */
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const inheritProto = (parentClass) => {
  function Sub() {}
  Sub.prototype = parentClass.prototype;
  return new Sub();
};

export const applyMixins = (derivedCtor, baseProtos) => {
  baseProtos.forEach(baseProto => {
      Object.getOwnPropertyNames(baseProto).forEach(name => {
          derivedCtor.prototype[name] = baseProto[name];
      });
  });
}


// 向指定的目标的指定的属性中的数组，追加元素，如果元素存在直接追加，如果元素不存在，先创建数组再追加
export const tryPush = function tryPush(targetParam, prop, value) {
  const target = targetParam;
  const targetArr = target[prop];
  if (targetArr && targetArr.length > 0) {
    target[prop] = targetArr.concat(value);
  } else {
    target[prop] = toArray(value);
  }
};

// 懒push 判断数组中是否有元素 没有则添加 有则不加
export const lazyPush = function lazyPush(arr, ele) {
  if (arr.includes(ele)) {
    return null;
  }
  return arr.push(ele);
};

export const deepCopy = function deepCopy(source) {
  if (isFalsy(source)) {
    return source;
  }
  const type = source.constructor;
  if (type === Number || type === String || type === Boolean) {
    return source;
  } else if (source instanceof Array) {
    return source.map(el => deepCopy(el));
  } else if (typeof source === 'object') {
    return JSON.parse(JSON.stringify(source));
  }
  return source;
};

export const isEmptyObject = function isEmptyObject(obj) {
  if (typeof obj === 'string') {
    if (!obj) {
      return true;
    }
    return false;
  }
  for (const name in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, name)) {
      return false;
    }
  }
  return true;
};

export const isNumeric = function isNumeric(obj) {
  return !Number.isNaN(parseFloat(obj)) && Number.isFinite(Number(obj));
};

export const isObject = function isObject(value) {
  return value !== null && typeof value === 'object' && value.constructor === Object;
};

export const isString = function isString(value) {
  return typeof value === 'string' && value.constructor === String;
};

export const isFunction = function isFunction(value) {
  return value !== null && typeof value === 'function';
};

export const pairsForIn = (pairs, callback) => {
  for (const key in pairs) {
    if (Object.prototype.hasOwnProperty.call(pairs, key)) {
      const value = pairs[key];
      callback(key, value);
    }
  }
};

export const getSourceControlKey = (sourceType) => {
  const type = parseInt(sourceType, 10)
  let controlKey = ''
  switch (type) {
    case 56:// 地址
      controlKey = 'FormAreaSelect';
      break;
    case 51:
      controlKey = 'FormMultiQuery';
      break;
    case 50:
      controlKey = 'FormQuery';
      break;
    case 27:
      controlKey = 'FormMultiUser';
      break;
    case 26:
      controlKey = 'FormUser';
      break;
    case 24:
      controlKey = 'FormAttachment';
      break;
    case 14:
      controlKey = 'FormTextBox';
      break;
    case 13:
      controlKey = 'FormTextArea';
      break;
    case 9:
      controlKey = 'FormTextBox';
      break;
    case 7:
      controlKey = 'FormNumber';
      break;
    case 5:
      controlKey = 'FormDateTime';
      break;
    case 1:// 是否
      controlKey = 'FormCheckbox';
      break;
    default: // 对于没有支持的控件先转成文本处理
      controlKey = 'FormTextBox';
      break;
  }
  return controlKey
}

/**
 *
 * @param {string} str 解析的字符串
 * @param {boolean} alwaysObject 是否一直返回对象，即使解析失败也返回空对象
 */
export const jsonParse = (str, alwaysObject = true) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    // if (alwaysObject) {
    //   console.error(`JSON字符串解析失败: ${str}`); // eslint-disable-line
    // }
    return alwaysObject ? {} : false;
  }
};

export const parsePath = (target, paths) => {
  paths = toArray(paths);
  paths.forEach((path) => {
    target = target[path];
  });
  return target;
};

// export const formatDateTime = (date) => {
//   if (typeof date === 'number') {
//     if (date < 13 && date > 0) {
//       return `2001/${date}/01`;
//     } else if (date > 1752 && date < 2200) {
//       return `${date}/01/01`;
//     }
//   } else if (`${date}`.length === 7) {
//     date += '/01';
//   }
// };

// 移动端缺少 formlogic 中的日期格式化
export const formatDate = (val, fmts) => {
  const date = new Date(val);
  let fmt = fmts;
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S+': date.getMilliseconds(),
  };
  if (/(y+)/.test(fmts)) {
    fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length))); }
  }
  return fmt;
};

export const dataset = (ele) => {
  if (ele.dataset) {
    return ele.dataset;
  }
  const ret = {};
  for (let i = 0, len = ele.attributes.length; i < len; i++) {
    const name = ele.attributes[i].name;
    if (name.includes('data-')) {
      const key = name.slice(5);
      const value = ele.attributes[i].value;
      ret[key] = value;
    }
  }
  return ret;
};

export const parseDom = (arg) => {
  const objE = document.createElement('div');
  objE.innerHTML = arg;
  const ret = objE.querySelectorAll('.page-header,.sheet-control');
  return ret;
};

//过滤一行两列信息
export const filterControls = (json) => {
  let jsonContent = []
  json.forEach(control => {
    const childControls = control.ChildControls
    // 布局控件（一行两列）
    const controlKey = ControlType[control.Type];
    if (controlKey === 'FormLayout' && childControls && childControls.length > 0) {
      childControls.forEach(childControl => {
        if (childControl) {
          jsonContent.push(childControl)
        }
      })
    } else {
      jsonContent.push(control)
    }
  })
  return jsonContent
};

export const hasClass = (function hasClass () {
  const div = document.createElement('div');
  if ('classList' in div && typeof div.classList.contains === 'function') {
    return function a (elem, className) {
      return elem.classList.contains(className);
    };
  }
  return function b (elem, className) {
    const classes = elem.className.split(/\s+/);
    for (let i = 0, len = classes.length; i < len; i += 1) {
      if (classes[i] === className) {
        return true;
      }
    }
    return false;
  };
}());

/*
 * 判断是否ios终端
 */
export const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

export const IToKbit = (nums) => {
  let num = nums;
  num = (num || 0).toString();
  let result = '';
  const temp = num;
  if (Number.isNaN(Number(num))) return 0;
  const numStr = `${num}`;
  const potIndex = numStr.indexOf('.');
  let decimal = '';
  if (potIndex > -1) {
    num = numStr.slice(0, potIndex);
    decimal = numStr.slice(potIndex);
  }
  num = parseInt(num, 10);
  let negative = false; // 负数
  if (parseFloat(temp) < 0) {
    negative = true;
    num = `${Math.abs(num)}`;
  }
  num += '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  if (potIndex > -1) {
    result += decimal;
  } else {
    // result += '.00';
  }
  if (negative) {
    result = `-${result}`;
  }
  return result;
};

/*
 * 是否是钉钉环境
 */
export const isDingtalk = /DingTalk/.test(navigator.userAgent);


/*
 * url公用前缀
 */
export const baseUrl = (() => {
  if (process.env.NODE_ENV === 'development') {
    return '/apis'
  } else {
    return ''
  }
})()

export const BizObjectStatus = {
  Draft: 0, // 草稿
  Effective: 1, // 审批通过或表单提交后
  Running: 2, // 流程运行中
  Canceled: 3, // 被取消
};

export const TipsMessage = {
  ExpireTitle: '超期提醒',
  WillExpireTitle: '温馨提醒',
  ExpireMessage: `<div style="text-align:left;font-size:15px;padding: 8px 6px 31px 6px;">尊敬的用户，氚云平台使用权<span style="color:#F5222D;font-size:15px">已到期</span>，为避免应用过期导致数据丢失，请及时购买续费，或拨打客服电话: 4000-899-893咨询
  <p style="color:rgba(0,0,0,0.65);margin-top:12px;font-size:15px">客服服务时间：周一至周五 上午9:00 - 12:00 下午 13:30 - 18:00</p></div>`,
  WillExpireMessage: `<div style="text-align:left;font-size:15px;padding: 8px 6px 31px 6px;">尊敬的用户，氚云平台使用权将于<span style="color:#F5222D;font-size:15px">到期时间</span>到期，为避免影响正常使用，请及时购买续费，或拨打客服电话: 4000-899-893咨询
  <p style="color:rgba(0,0,0,0.65);margin-top:12px;font-size:15px">客服服务时间：周一至周五 上午9:00 - 12:00 下午 13:30 - 18:00</p></div>`,
  FileSizeExceedMessage: `<div style="text-align:left;font-size:15px;padding: 8px 6px 31px 6px;">尊敬的用户，附件量<span style="color:#F5222D;font-size:15px">已达上限</span>，无法上传新附件，请及时购买服务包升级附件套餐，客服电话: 4000-899-893
  <p style="color:rgba(0,0,0,0.65);margin-top:12px;font-size:15px">客服服务时间：周一至周五 上午9:00 - 12:00 下午 13:30 - 18:00</p></div>`,
  FileSizeWillExceedMessage: `<div style="text-align:left;font-size:15px;padding: 8px 6px 31px 6px;">尊敬的用户，附件量剩余<span style="color:#F5222D;font-size:15px">剩余附件量</span>，为避免影响正常使用，请及时购买服务包升级附件套餐，客服电话: 4000-899-893
  <p style="color:rgba(0,0,0,0.65);margin-top:12px;font-size:15px">客服服务时间：周一至周五 上午9:00 - 12:00 下午 13:30 - 18:00</p></div>`,
  payUrl:
    'https://www.sobot.com/chat/h5/index.html?sysNum=ba53512829e343058872e7c2ab942a7e&color=0f92ed&lan=cn&invite=0&unreadcount=0',
  GoodsCode: {
    home: 'FW_GOODS-1000917913',
    ERP: 'FW_GOODS-1000275160', // 氚云tERP
    D000001ToBCRM: 'FW_GOODS-1000274704', // 氚云CRM
    JZCRM: 'FW_GOODS-1000913612', // 决招CRM
    JZERP: 'FW_GOODS-1000912927', // 决招进销存q
    School: 'FW_GOODS-1000904131', // 氚云校园版
  },
};

export const SolutionTypes = {
  APass: 1,
  Sass: 2,
  Template: 3,
};

export const SolutionState = {
  Normal: 0,
  Expire: 1,
  WillExpire: 2,
  FileSizeWillExceed: 3,
  FileSizeExceed: 4,
};

export const formatNewDate = (val) => {
  const total = val.split(' ');
  let ymd = total[0];
  let hms = total[1] || '';
  const y = ymd.split('/')[0];
  let m = ymd.split('/')[1] || 1;
  m = parseInt(m) - 1;
  const d = ymd.split('/')[2] || 1;
  const h = hms.split(':')[0] || 0;
  const mm = hms.split(':')[1] || 0;
  const s = hms.split(':')[2] || 0;
  return new Date(y, m, d, h, mm, s);
}

export const getFileExt = (filename) => {
  return filename.substring(filename.lastIndexOf(".") + 1,filename.length);
}


/**
 * 格式化外链描述图片中src，兼容外链老数据
 * @param desc
 * @returns {string}
 */
export const fmtExternalDescription = (desc) => {
  return (desc || '').replace(/<img[\s\S]+?src=['"][^'"]+['"]/i, function(m) {
    return m.replace('https://www.h3yun.com', '')
  });
}

/**
 * 判断是否是Promise类型 兼容
 * @param 目标对象 promise
 */
export const isPromise = (promise) => {
  return !!promise && typeof promise.then === 'function'
};

/**
 * 地址格式数据转换为字符串
 * @param {*} val
 */
export const addressConvert = (val) => {
  if (val.indexOf('adname') > -1) {
    try {
      const address = JSON.parse(val);
      return `${address.adname} ${address.Detail}`;
    } catch (e) {
      return val;
    }
  }
  return val;
};
