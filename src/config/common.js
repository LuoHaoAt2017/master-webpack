const GetListScopeType = {
  // / <summary>
  // / 我自己的对象
  // / </summary>
  Own: 0,
  // / <summary>
  // / 我拥有部门权限的对象
  // / </summary>
  OwnDept: 1,
  // / <summary>
  // / 与我相关的对象
  // / </summary>
  Related: 2,
  // / <summary>
  // / 上述所有的对象
  // / </summary>
  AllReadable: 3,
  // / <summary>
  // / 整个系统中所有的对象
  // / </summary>
  GlobalAll: 4,
  // / <summary>
  // / 我自己和我拥有部门权限的对象
  // / </summary>
  OwnAndOwnDept: 5,
};
const SortDirection = {
  // / <summary>
  // / 升序
  // / </summary>
  Ascending: 0,
  // / <summary>
  // / 降序
  // / </summary>
  Descending: 1,
  // / <summary>
  // / 未指定
  // / </summary>
  Unspecified: 2,
};
// 组织机构类型
const OrganiztionType = {
  User: 0,
  Dept: 1,
  All: 2,
};

const FilterType = {
  String: 0,
  Numeric: 1,
  DateTime: 2,
  Organization: 3,
  FixedValue: 4,
  MasterData: 5,
  Association: 6,
  Boolean: 7,
  Address: 9,
  AssociationField: 10,
};

const ListViewDisplayMode = {
  List: 0,
  Calendar: 1,
  Timeline: 2,
};

const UserSelectEntryType = {
  Forward: 0, // 转发
  Share: 1, // 分享
  Other: 2, // 其他
};

const IntroType = { // 引导页类型
  ShowHR: 1,
  ShowSCM: 2,
  ShowIns: 3,
  ShowREV: 4,
  ShowCost: 5,
  ShowPur: 6,
};

const FunctionState = {
  Todo: 0,
  Finished: 1,
  MyInstances: 2,
  All: 3,
};
export const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // 判断是否ios终端
// 是否大于IOS9版本
export const isThanIos9 = () => {
  if (!isiOS) {
    return true;
  }
  const agent = navigator.userAgent.toLowerCase();
  let version;
  if (agent.indexOf('like mac os x') > 0) {
    // ios
    const regStr_saf = /os [\d._]*/gi;
    const verinfo = agent.match(regStr_saf);
    version = (verinfo + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.');
  }

  const version_str = version + '';
  if (version_str != 'undefined' && version_str.length > 0) {
    version = parseInt(version);
    if (version > 9) {
      return true;
    }
    return false;
  }
};
export const isDingtalk = /DingTalk/.test(navigator.userAgent);
export const isWeixinBrowser = /micromessenger/.test(navigator.userAgent.toLowerCase());
export const isWechat = navigator.userAgent.match(/MicroMessenger/i) === 'micromessenger';
export const isQQ = navigator.userAgent.indexOf('MQQBrowser') > -1 ||
 navigator.userAgent.toLowerCase().match(/\sQQ/i) === ' qq';
export const isFunc = fn => !!fn && typeof fn !== 'string' && !fn.nodeName &&
 fn.constructor !== Array && /^[\s[]?function/.test(`${fn}`);
/* eslint-disable no-bitwise */
export const guid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : ((r & 0x3) | 0x8);
  return v.toString(16);
});

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

export const getBlob = (buffer, format) => {
  try {
    return new Blob(buffer, {
      type: format,
    });
  } catch (e) {
    const bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder)();
    buffer.forEach((buf) => {
      bb.append(buf);
    });
    return bb.getBlob(format);
  }
};

export const FormDataShim = () => {
  const o = this;
  const parts = [];
  const boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36);
  const oldSend = XMLHttpRequest.prototype.send;
  this.append = function aa (name, value, filename) {
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"`);
    if (value instanceof Blob) {
      parts.push(`; filename="${filename || 'blob'}"\r\nContent-Type: ${value.type}\r\n\r\n`);
      parts.push(value);
    } else {
      parts.push(`\r\n\r\n${value}`);
    }
    parts.push('\r\n');
  };
  // Override XHR send()
  XMLHttpRequest.prototype.send = function send (val) {
    let fr;
    let data;
    const oXHR = this;
    if (val === o) {
      // Append the final boundary string
      parts.push(`--${boundary}--\r\n`);
      // Create the blob
      data = getBlob(parts);
      // Set up and read the blob into an array to be sent
      fr = new FileReader();
      fr.onload = function onload () {
        oldSend.call(oXHR, fr.result);
      };
      fr.onerror = function onerror (err) {
        throw err;
      };
      fr.readAsArrayBuffer(data);
      // Set the multipart content type and boudary
      this.setRequestHeader('Content-Type', `multipart/form-data; boundary=${boundary}`);
      XMLHttpRequest.prototype.send = oldSend;
    } else {
      oldSend.call(this, val);
    }
  };
};

export const h3AutoHide = (opt) => {
  this.Options = opt || {
    icon: '',
    text: '',
  };
  this.$win = $(`${'<div class="tip-mask">' +
    '<div class="tip-box">' +
    '<div class="tip-icon"><i class="'}${this.Options.icon}"></i></div>` +
    `<div class="tip-title">${this.Options.text}</div>` +
    '</div>' +
    '</div>');

  this.$win.appendTo('body');
  let that = this;
  that.$win.addClass('autohide');
  window.setTimeout(() => {
    that.$win.hide();
    that.$win.remove();
    that = null;
  }, 1000);
};

export const isEmptyObject = (obj) => {
  let name;
  for (name in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, name)) {
      return false;
    }
  }
  return true;
};

export const parseUrlParam = (urls, param) => {
  let url = urls;
  const searchIndex = url.indexOf('?');
  const jhIndex = url.indexOf('#');
  if (jhIndex > -1) {
    url = url.substr(0, jhIndex);
  }
  const searchParams = url.slice(searchIndex + 1).split('&');
  for (let i = 0; i < searchParams.length; i += 1) {
    const items = searchParams[i].split('=');
    if (items[0].trim().toLowerCase() === param.toLowerCase()) {
      return items[1].trim();
    }
  }
  return null;
};

export const includeLanscape = !!parseUrlParam(window.location.href, 'dd_orientation');

export const parseUrl = (url) => {
  const a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      const ret = {};
      const search = a.search;
      let seg;
      let s;
      if (!search) { // 修复存在hash时search失效的问题
        const tmpArr = a.href.split('?');
        if (tmpArr.length === 1) {
          return {};
        }
        seg = tmpArr[tmpArr.length - 1].split('&');
      } else {
        seg = search.replace(/^\?/, '').split('&');
      }
      for (let i = 0, len = seg.length; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || ['', ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || ['', ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/'),
  };
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
})();

export const pad = (num, n) => {
  const stringNum = `${num}`;
  let length = stringNum.length;
  let zero = '';
  if (length >= n) {
    return stringNum;
  }

  for (; length < n; length += 1) {
    zero += '0';
  }

  return zero + stringNum;
};
export const getFirstAndLastMonthDay = (year, month) => {
  const day = new Date(year, month, 0);
  const lastdate = `${pad(year, 4)}-${pad(month, 2)}-${pad(day.getDate(), 2)}`;
  return lastdate;
};

// 获取本周的第一天和最后一天
export const getFirstAndLastdayweek = () => {
  const time = new Date();
  if (time.getDay() !== 0) {
    time.setDate((time.getDate() - time.getDay()) + 1);
  } else {
    time.setDate(time.getDate() - 6);
  }
  const weekfirstday = `${pad(time.getFullYear(), 4)}-${pad(((time.getMonth() - 0) + 1), 2)}-${pad(time.getDate(), 2)}`;
  time.setDate(time.getDate() + 6);
  const weekdayLast = `${pad(time.getFullYear(), 4)}-${pad(((time.getMonth() - 0) + 1), 2)}-${pad(time.getDate(), 2)}`;
  return [weekfirstday, weekdayLast];
};
// 获取本季第一天，最后一天
export const GetFirstAndLastDayQuarter = () => {
  const mydate = new Date();
  const month = (mydate.getMonth() - 0) + 1;
  const year = mydate.getFullYear();
  if (month >= 1 && month <= 3) {
    const firstdate = `${pad(year, 4)}-01-01`;
    const day = new Date(year, 3, 0);
    const lastdate = `${pad(year, 2)}-03-${pad(day.getDate(), 2)}`; // 获取第一季度最后一天日期
    return [firstdate, lastdate];
  } else if (month >= 4 && month <= 6) {
    const firstdate = `${pad(year, 4)}-04-01`;
    const day = new Date(year, 6, 0);
    const lastdate = `${pad(year, 4)}-06-${pad(day.getDate(), 2)}`; // 获取第二季度最后一天日期
    return [firstdate, lastdate];
  } else if (month >= 7 && month <= 9) {
    const firstdate = `${pad(year, 4)}-07-01`;
    const day = new Date(year, 9, 0);
    const lastdate = `${pad(year, 4)}-09-${pad(day.getDate(), 2)}`; // 获取第三季度最后一天日期
    return [firstdate, lastdate];
  } else if (month >= 10 && month <= 12) {
    const firstdate = `${pad(year, 4)}-10-01`;
    const day = new Date(year, 12, 0);
    const lastdate = `${pad(year, 4)}-12-${pad(day.getDate(), 2)}`; // 获取第四季度最后一天日期
    return [firstdate, lastdate];
  }
  return null;
};

export const NumberTransport = (value) => {
  if (!value) {
    return null;
  }
  if (value.indexOf(';') > 0) {
    const begin = value.split(';')[0];
    const end = value.split(';')[1];
    return [begin, end];
  }
  return [value];
};

export const TimeTransport = (value) => {
  if (!value) {
    return null;
  }
  let beginvalue;
  let endvalue;
  let myDate = new Date();
  const lastSecond = ' 23:59:59';
  switch (value) { // 1=当天；2=本周；3=本月;4=本季度；5=本年度;
    case '1':
      beginvalue = `${pad(myDate.getFullYear(), 4)}-${pad((myDate.getMonth() + 1), 2)}-${pad(myDate.getDate(), 2)}`;
      endvalue = `${pad(myDate.getFullYear(), 4)}-${pad((myDate.getMonth() + 1), 2)}-${pad(myDate.getDate(), 2)}${lastSecond}`;
      break;
    case '2':
      beginvalue = getFirstAndLastdayweek()[0];
      endvalue = getFirstAndLastdayweek()[1] + lastSecond;
      break;
    case '3':
      beginvalue = `${pad(myDate.getFullYear(), 4)}-${pad((myDate.getMonth() + 1), 2)}-01`;
      endvalue = getFirstAndLastMonthDay(myDate.getFullYear(), (myDate.getMonth() + 1)) + lastSecond;
      break;
    case '4':
      beginvalue = GetFirstAndLastDayQuarter()[0];
      endvalue = GetFirstAndLastDayQuarter()[1] + lastSecond;
      break;

    case '5':
      beginvalue = `${pad(myDate.getFullYear(), 4)}-01-01`;
      endvalue = `${pad(myDate.getFullYear(), 4)}-12-31${lastSecond}`;
      break;
    case '6':
      myDate = myDate.AddDays(-1);
      beginvalue = `${pad(myDate.getFullYear(), 4)}-${pad((myDate.getMonth() + 1), 2)}-${pad(myDate.getDate(), 2)}`;
      endvalue = `${pad(myDate.getFullYear(), 4)}-${pad((myDate.getMonth() + 1), 2)}-${pad(myDate.getDate(), 2)}${lastSecond}`;
      break;
    case '7':
      myDate = myDate.AddMonths(-1);
      beginvalue = `${pad(myDate.getFullYear(), 4)}-${pad((myDate.getMonth() + 1), 2)}-01`;
      endvalue = getFirstAndLastMonthDay(myDate.getFullYear(), (myDate.getMonth() + 1)) + lastSecond;
      break;
    default:
      break;
  }
  if (!beginvalue) {
    beginvalue = null;
  }
  if (!endvalue) {
    endvalue = null;
  }
  return [beginvalue, endvalue];
};

export const sliderbuild = function sliderbuild (jsdom, LoadMoreCallback, agument) {
  let startPos = null;
  let endPos = null;
  let isScrolling = 0;
  const slider = {
    // 判断设备是否支持touch事件
    // touch: (('ontouchstart' in window) || window.DocumentTouch) &&
    //  document instanceof DocumentTouch,
    touch: (('ontouchstart' in window) || window.DocumentTouch),
    slider: jsdom,
    agument,
    oldscrollTop: 0,
    LoadMoreCallback,
    scrolltop: 0,
    scrollleft: 0,
    // 事件
    events: {
      slider: jsdom, // this为slider对象
      LoadMoreCallback,
      agument,
      oldscrollTop: 0,
      handleEvent (event) {
        const self = this; // this指events对象
        if (event.type === 'touchstart') {
          self.start(event);
        } else if (event.type === 'touchmove') {
          self.move(event);
        } else if (event.type === 'touchend') {
          self.end(event);
        }
      },
      // 滑动开始
      start (event) {
        const touch = event.targetTouches[0]; // touches数组对象获得屏幕上所有的touch，取第一个touch
        startPos = {
          x: touch.pageX,
          y: touch.pageY,
          time: +new Date(),
        }; // 取第一个touch的坐标值
        isScrolling = 0; // 这个参数判断是垂直滚动还是水平滚动
        this.slider.addEventListener('touchmove', this, false);
        this.slider.addEventListener('touchend', this, false);
      },
      // 移动
      move (event) {
        // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
        if ((event.targetTouches.length > 1 || event.scale) && event.scale !== 1) return;
        const touch = event.targetTouches[0];
        this.scrolltop = 0;
        this.scrollleft = 0;
        endPos = {
          x: touch.pageX - startPos.x,
          y: touch.pageY - startPos.y,
        };
        isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0;
        // isScrolling为1时，表示纵向滑动，0为横向滑动
        this.scrollleft = this.slider.scrollLeft - endPos.x;
        this.scrolltop = this.slider.scrollTop - endPos.y;
        this.oldscrollTop = this.slider.scrollTop;
        if (isScrolling === 0) {
          this.slider.scrollLeft = this.scrollleft;
        } else {
          this.slider.scrollTop = this.scrolltop;
        }
        startPos = {
          x: touch.pageX,
          y: touch.pageY,
          time: +new Date(),
        };
        event.preventDefault(); // 阻止触摸事件的默认行为，即阻止滚屏
      },
      // 滑动释放
      end () {
        const duration = +new Date() - startPos.time; // 滑动的持续时间
        // if (duration < 7) {
        //   return;
        // }
        // 当滑动到底部时回调加载更多
        if (this.oldscrollTop === this.slider.scrollTop && this.scrolltop > 0 &&
          $.isFunction(this.LoadMoreCallback)) {
          const that = this;
          setTimeout(() => {
            that.LoadMoreCallback(that.agument);
          }, 100);
        }
        // 解绑事件
        this.slider.removeEventListener('touchmove', this, false);
        this.slider.removeEventListener('touchend', this, false);
      },
    },
    // 初始化
    init () {
      const self = this; // this指slider对象
      if (self.touch) self.slider.addEventListener('touchstart', self.events, false); // addEventListener第二个参数可以传一个对象，会调用该对象的handleEvent属性
    },
  };
  slider.init();
  return slider;
};

export const getDeviceRatio = function getDeviceRatio () {
  const isIPhone = window.navigator.appVersion.match(/iphone/gi);
  const devicePixelRatio = window.devicePixelRatio;
  let dpr;
  if (isIPhone) {
    // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
    if (devicePixelRatio >= 3) {
      dpr = 3;
    } else if (devicePixelRatio >= 2) {
      dpr = 2;
    } else {
      dpr = 1;
    }
  } else {
    // 其他设备下，仍旧使用1倍的方案
    dpr = 1;
  }
  return dpr;
};

// img转base64
export const imgToBase64 = (url, ext, callback) => {
  let canvas = document.createElement('canvas'); // 创建canvas DOM元素
  const ctx = canvas.getContexxt('2d');
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;
  img.onload = () => {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL((`image/${ext}`) || 'image/png');
    callback.call(this, dataURL);
    canvas = null;
  };
};

// 任务类型
const WorkItemTypes = {
  Fill: 0, // 经办
  Approve: 2, // 审批
  Circulate: 3, // 传阅
};

// 任务状态
const WorkItemStates = {
  Waiting: 0, // 进行中（未打开过）
  Working: 1, // 进行中
  Finished: 2, // 结束
  Canceled: 3, // 取消(作废)
  Unfinished: 4, // 除2以外的状态，只用于查询
  Unspecified: -1, // 未指定的状态,
};

// 流程状态
const WorkflowInstanceStates = {
  Running: 2,
  Finished: 4,
  Canceled: 5,
};

// bizobject status
const BizObjectStatus = {
  Draft: 0, // 草稿
  Effective: 1, // 审批通过或表单提交后
  Running: 2, // 流程运行中
  Canceled: 3, // 被取消
};

const FormMode = {
  // 未指定
  Unspecified: -1,
  // 编辑模式
  Edit: 0,
  // 查看模式
  Readonly: 1,
  // 发起流程
  Create: 2,
  // 打印模式
  Print: 3,
};

// const testUrlReg = /((http|ftp|https|file):[^'"\s]+)|www.[^'"\s]+/ig;
// const testUrlReg = /(https?:\/\/|www.)[-A-Za-z0-9+&@$#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
// 支持 http://www.example.com  www.example.com http://example.com
const testUrlReg = /(((http|ftp|https):\/\/)|(www\.))[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/ig;

/**
 * 返回操作堆栈相关方法
 * @type {{goBack, push}}
 */

const setCookie = (key, value, iDay) => {
  const oDate = new Date();
  oDate.setDate(oDate.getDate() + iDay);
  document.cookie = `${key}=${value};expires=${oDate}`;
};

const removeCookie = (key) => {
  setCookie(key, '', -1);
};

const getCookie = (key) => {
  const cookieArr = document.cookie.split('; ');
  for (let i = 0; i < cookieArr.length; i += 1) {
    const arr = cookieArr[i].split('=');
    if (arr[0] === key) {
      return arr[1];
    }
  }
  return false;
};

const goTargetSmooth = (target, scrollDom) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      return setTimeout(callback, 17);
    };
  }
  // 要滚动的位置
  let scrollTop = parseInt(scrollDom.scrollTop);
  // 当前滚动高度
  const position = target.offsetTop;
  // 滚动step方法
  const step = function () {
    // 距离目标滚动距离
    const distance = position - scrollTop;
    // 目标滚动位置
    scrollTop = scrollTop + distance / 5;
    if (Math.abs(distance) < 1) {
      scrollDom.scrollTo(0, position);
    } else {
      scrollDom.scrollTo(0, scrollTop);
      requestAnimationFrame(step);
    }
  };
  step();
};

/**
 * 身份证校验
 * @param code
 */
const identityCodeValid = (code) => {
  // const city = {
  //   11: "北京",
  //   12: "天津",
  //   13: "河北",
  //   14: "山西",
  //   15: "内蒙古",
  //   21: "辽宁",
  //   22: "吉林",
  //   23: "黑龙江 ",
  //   31: "上海",
  //   32: "江苏",
  //   33: "浙江",
  //   34: "安徽",
  //   35: "福建",
  //   36: "江西",
  //   37: "山东",
  //   41: "河南",
  //   42: "湖北 ",
  //   43: "湖南",
  //   44: "广东",
  //   45: "广西",
  //   46: "海南",
  //   50: "重庆",
  //   51: "四川",
  //   52: "贵州",
  //   53: "云南",
  //   54: "西藏 ",
  //   61: "陕西",
  //   62: "甘肃",
  //   63: "青海",
  //   64: "宁夏",
  //   65: "新疆",
  //   71: "台湾",
  //   81: "香港",
  //   82: "澳门",
  //   91: "国外 "
  // };
  // let pass = true;
  // if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
  //   pass = false;
  // } else if (!city[code.substr(0, 2)]) {
  //   pass = false;
  // } else {
  //   //18位身份证需要验证最后一位校验位
  //   if (code.length == 18) {
  //     code = code.split('');
  //     //∑(ai×Wi)(mod 11)
  //     //加权因子
  //     const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  //     //校验位
  //     const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  //     let sum = 0;
  //     let ai = 0;
  //     let wi = 0;
  //     for (var i = 0; i < 17; i++) {
  //       ai = code[i];
  //       wi = factor[i];
  //       sum += ai * wi;
  //     }
  //     const last = parity[sum % 11];
  //     if (last != code[17]) {
  //       pass = false;
  //     }
  //   }
  // }

  const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
  return reg.test(code);
};

export {
  GetListScopeType,
  FunctionState,
  SortDirection,
  IntroType,
  FilterType,
  ListViewDisplayMode,
  UserSelectEntryType,
  OrganiztionType,
  WorkItemTypes,
  WorkItemStates,
  WorkflowInstanceStates,
  BizObjectStatus,
  FormMode,
  testUrlReg,
  removeCookie,
  getCookie,
  goTargetSmooth,
  identityCodeValid,
  setCookie,
};
