import Vue from 'vue';
// import toastPlugin from '../../packages/plugins/toast';
import { toast, modal } from 'h3-mobile-vue';
import {
  isFunc,
  isDingtalk,
} from '@/config/common';
import {
  scanQrCode,
  scanBarCode,
  scanCard,
  geoGet,
  mapSearch,
  mapLocate,
  openProfile,
  ddCall,
  imageDing,
  linkDing,
  previewImage,
  // saveFile,
  // preViewFile,
  openLink,
  closeApp,
} from '../config/dingtalk-interface';

Vue.use(modal);
Vue.use(toast);
// Vue.use(toastPlugin);

export default {
  /**
   * 生成一个guid类型数据
   */
  IGuid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      /* eslint-disable no-bitwise */
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  },

  /**
   * 对象克隆,只对对象有效,用法:$.IClone(Obj)
   */
  IClone (obj) {
    if (obj == null) return null;
    let objClone = null;
    if (obj.constructor === Object ||
      obj.constructor === Array) {
      objClone = new obj.constructor();
    } else {
      objClone = new obj.constructor(obj.valueOf());
    }
    jQuery.extend(true, objClone, obj);
    return objClone;
  },

  IQuery (name) {
    const regStr = `(^|&)${name}=([^&]*)(&|$)`;
    const reg = new RegExp(regStr, 'i');
    const r = decodeURI(window.location.search.substr(1)).match(reg);
    if (r != null) return decodeURI(r[2]);
    return '';
  },

  /**
   * 打开表单的接口
   * 参数顺序:schemaCode, objectid, args, checkIsChange, showList,{otherParam}
   * otherParam其他参数，json格式:{showInModal:是否显示在弹出框中,title:'',height:500,
   * widht:500,OnShowCallback:function,OnHiddenCallback:function}
   * 1.schemaCode SchemaCode表单编码参数
   *  2.objectId ,BizObjectID不传时打开新增时的表单
   *   3.params ,传递到表单的参数
   *   4.checkIsChange,是否检查修改
   *   5.showlist,兼容移动端是否显示列表
   *   6.showInModal：是否弹出框中显示，如果为false，title height width OnShowCallback OnHiddenCallback 等属性不起作用
   *   7.title: 对话框标题
   *   8.height:对话框高度，格式 500 数值类型
   *   9.width: 对话框宽度，格式 500
   *   10.OnHiddenCallback 隐藏时显示
   */
  IShowForm (...args) {
    if (args.length < 1) {
      return;
    }
    let options = {
      schemaCode: '',
      objectid: '',
      args: '',
      checkIsChange: false,
      showList: false,
      onHiddenCallback: null,
    };
    for (let i = 0; i < args.length; i += 1) {
      const data = args[i];
      if (data == null) {
        continue;
      }
      if (typeof (data) === 'string' || data.constructor === String ||
        typeof (data) === 'boolean' || data.constructor === Boolean ||
        typeof (data) === 'function' || data.constructor === Function
      ) {
        if (i === 0) {
          options.schemaCode = data;
        } else if (i === 1) {
          options.objectid = data;
        } else if (i === 2) {
          options.args = JSON.parse(data);
        } else if (i === 3) {
          options.checkIsChange = data;
        } else if (i === 4) {
          options.showList = data;
        }
      } else if (typeof (data) === 'object' || data.constructor === Object) {
        if (i === 2 && !data.params && data.showInModal === undefined) {
          options.args = data;
        } else {
          options = $.extend({}, options, data);
        }
      }
    }

    if (window.GlobalConfig) {
      let containsDevParams = 0;
      if (options.args && !$.isEmptyObject(options.args)) {
        window.GlobalConfig.globalCache.push(options.args);
        containsDevParams = 1;
      }
      // 回调函数
      if (options.onHiddenCallback && typeof options.onHiddenCallback === 'function') {
        // 调用showForm时给H3Config.ShowFomrCallback赋值,执行后清空
        window.GlobalConfig.callbackCache.push(options.onHiddenCallback);
      }

      if (typeof (options.showList) === 'undefined' || !options.showList) {
        window.GlobalConfig.VueInstance.$router.push({
          name: 'formPage',
          params: {
            containsDevParams,
            schemaCode: options.schemaCode,
            bizObjectId: options.objectid,
            showList: false,
            iShowTitle: options.title,
            // containsDevParams: containsDevParams,
          },
          query: {
            containsDevParams,
            schemaCode: options.schemaCode,
            bizObjectId: options.objectid,
            showList: false,
            // containsDevParams: containsDevParams,
          },
        });
      } else {
        window.GlobalConfig.VueInstance.$router.push({
          name: 'formPage',
          params: {
            containsDevParams,
            schemaCode: options.schemaCode,
            bizObjectId: options.objectid,
            showList: false,
            // containsDevParams: containsDevParams
          },
        });
      }
    }
  },

  /**
   * 获取参数值
   * @param {*} name
   */
  IGetParams (name) {
    if (window.GlobalConfig.globalCache.length > 0) {
      const params = window.GlobalConfig.globalCache[window.GlobalConfig.globalCache.length - 1];
      return params[name];
    }
    return '';
  },

  /**
   * 地图定位
   */
  ILocation (onlyLatlong, callback, failCallback) {
    if (isDingtalk) {
      geoGet((result) => {
        if (typeof (onlyLatlong) !== 'undefined' && onlyLatlong) {
          if (typeof (callback) !== 'undefined' && isFunc(callback)) {
            const point = {
              lat: result.latitude,
              lng: result.longitude,
              address: result.address,
            };
            callback(point);
          }
        } else {
          mapSearch(result);
        }
      }, (err) => {
        !!failCallback && failCallback(err);
      });
    }
    return null;
  },

  /**
   * 显示地图
   */
  IShowGraph (callback) {
    if (isDingtalk) {
      geoGet((result) => {
        mapLocate(result, callback);
      });
    }
  },

  /**
   * 成功提示
   */
  IShowSuccess (title, msg, callback, time = '1000') {
    let newMsg = msg;
    if (arguments.length === 1) {
      newMsg = title;
    }
    if (newMsg && newMsg.length > 50) {
      const tmp = newMsg.substr(0, 47);
      newMsg = `${tmp}...`;
    }
    window.$h3.toast.show({
      text: newMsg,
      duration: time,
      onShow () {},
      onHide () {
        if (isFunc(callback)) {
          callback.call(this);
        }
      },
    });
  },
  /**
   * 错误提示
   */
  IShowError (title, msg, callback, time = '1000') {
    let newMsg = msg;
    if (arguments.length === 1) {
      newMsg = title;
    }
    if (newMsg && newMsg.length > 50) {
      const tmp = newMsg.substr(0, 47);
      newMsg = `${tmp}...`;
    }
    window.$h3.toast.show({
      text: newMsg,
      duration: time,
      onShow () {},
      onHide () {
        setTimeout(() => {
          if (isFunc(callback)) {
            callback.call(this);
          }
        }, 200);
      },
    });
  },

  /**
   * 校验规则长文本提示
   */
  IShowChecking (title, msg, callback, time = '1000') {
    let newMsg = msg;
    if (arguments.length === 1) {
      newMsg = title;
    }
    window.$h3.toast.show({
      text: newMsg,
      duration: time,
      onShow () {},
      onHide () {
        setTimeout(() => {
          if (isFunc(callback)) {
            callback.call(this);
          }
        }, 200);
      },
    });
  },

  /**
   * 警告提示
   */
  IShowWarn (title, msg, callback, time = '1000') {
    let newMsg = msg;
    if (arguments.length === 1) {
      newMsg = title;
    }
    if (newMsg && newMsg.length > 50) {
      const tmp = newMsg.substr(0, 47);
      newMsg = `${tmp}...`;
    }
    Vue.$h3.toast.show({
      text: newMsg,
      duration: time,
      onShow () {},
      onHide () {
        setTimeout(() => {
          if (isFunc(callback)) {
            callback.call(this);
          }
        }, 200);
      },
    });
  },

  /**
   * 显示提示框
   */
  IShowTip (title, msg, callback, time = '1000') {
    let newMsg = msg;
    if (arguments.length === 1) {
      newMsg = title;
    }
    if (newMsg && newMsg.length > 50) {
      const tmp = newMsg.substr(0, 47);
      newMsg = `${tmp}...`;
    }
    Vue.$h3.toast.show({
      text: newMsg,
      duration: time,
      onShow () {},
      onHide () {
        setTimeout(() => {
          if (isFunc(callback)) {
            callback.call(this);
          }
        }, 200);
      },
    });
  },
  // 显示隐藏引导
  IShowLoading (flag, time = 1000) {
    if (flag) {
      window.$h3.toast.show({
        text: 'loading...',
        icon: 'loading',
        duration: time,
        onShow () {},
        onHide () {
        },
      });
    } else {
      window.$h3.toast.hide();
    }
  },

  // 隐藏弹窗
  IHideModal () {
    Vue.$h3.modal.hide();
  },

  /**
   * 确认confirm
   * title:对话框标题，可以为空
   * text:对话框弹出消息
   * callBack:回调函数，传回true/false
   */
  IConfirm (title, text, callBack) {
    window.GlobalConfig.confirmPanelShow = true;
    Vue.$h3.modal.show({
      content: text,
      type: 'alert',
      actions: [
        {
          text: '取消',
          onPress: () => {
            window.GlobalConfig.confirmPanelShow = false;
            if (isFunc(callBack)) {
              callBack.apply(this, [0]);
            }
          },
        },
        {
          text: '确定',
          onPress () {
            window.GlobalConfig.confirmPanelShow = false;
            if (isFunc(callBack)) {
              callBack.apply(this, [1]);
            }
          },
        },
      ],
    });
  },
  // 自定义删除弹窗
  IShowConfirm (text, leftText, rightText, callBack) {
    window.GlobalConfig.confirmPanelShow = true;
    Vue.$h3.modal.show({
      content: text,
      type: 'alert',
      actions: [
        {
          text: leftText,
          onPress: () => {
            window.GlobalConfig.confirmPanelShow = false;
            if (isFunc(callBack)) {
              callBack.apply(this, [0]);
            }
          },
        },
        {
          text: rightText,
          onPress () {
            window.GlobalConfig.confirmPanelShow = false;
            if (isFunc(callBack)) {
              callBack.apply(this, [1]);
            }
          },
        },
      ],
    });
  },

  // 查看错误详情的提示框
  IErrorConfirm (text, callBack) {
    window.GlobalConfig.confirmPanelShow = true;
    Vue.$h3.modal.show({
      content: text,
      type: 'alert',
      actions: [
        {
          text: '取消',
          onPress: () => {
            window.GlobalConfig.confirmPanelShow = false;
            if (isFunc(callBack)) {
              callBack.apply(this, [0]);
            }
          },
        },
        {
          text: '查看详情',
          onPress () {
            window.GlobalConfig.confirmPanelShow = false;
            if (isFunc(callBack)) {
              callBack.apply(this, [1]);
            }
          },
        },
      ],
    });
  },

  /**
   * 附件下载，移动端不支持下载附件
   */
  IDownloadAttachments () {
    this.IShowWarn('提醒', '移动端不支持批量下载!');
  },

  /**
   * 显示引导图
   */
  IShowPreLoader (title, opt) {
    Vue.$h3.toast.show({
      text: title || '加载中...',
      iconType: 'loading',
      ...opt,
    });
  },

  /**
   * 隐藏引导图
   */
  IHidePreLoader () {
    Vue.$h3.toast.hide();
  },

  /**
   * 扫描条形码
   */
  IScanBarCode (callback) {
    if (isDingtalk) {
      scanBarCode(callback);
    }
  },

  /**
   * 扫描二维码
   */
  IScanQrCode (callback) {
    if (isDingtalk) {
      scanQrCode(callback);
    }
  },

  /**
   * 扫描名片
   */
  IScanCard (callback) {
    if (isDingtalk) {
      scanCard(callback);
    }
  },
  /**
   * 显示钉钉个人资料页
   */
  IShowUserInfo (userId, corpId) {
    if (isDingtalk) {
      openProfile(userId, corpId);
    }
  },

  /**
   * 拨打免费电话
   */
  IShowFreeCall (phoneNumber) {
    if (isDingtalk) {
      ddCall(phoneNumber);
    }
  },
  /**
   * 图片类型钉消息
   */
  IPostImageDing (users, corpId, text, success, fail) {
    if (isDingtalk) {
      imageDing(users, corpId, text, success, fail);
    }
  },
  /**
   * Link类型钉消息
   */
  IPostLinkDing (users, corpId, text, title, url, imageUrl, subText, success, fail) {
    if (isDingtalk) {
      linkDing(users, corpId, text, title, url, imageUrl, subText, success, fail);
    }
    return false;
  },
  /**
   * 数字转成千分位(对小数位没有做限制)
   */
  IToKbit (num) {
    // let numStr = (num || 0).toString();
    const newNumber = Number(num);
    let result = '';
    if (Number.isNaN(newNumber)) {
      return 0;
    }
    const numStr = `${num}`;
    const potIndex = numStr.indexOf('.');
    let decimal = '';
    let numRes = '';
    if (potIndex > -1) {
      numRes = numStr.slice(0, potIndex);
      decimal = numStr.slice(potIndex);
    }
    numRes = parseInt(numRes, 10);
    let negative = false; // 负数
    if (numRes < 0) {
      negative = true;
      numRes = `${Math.abs(numRes)}`;
    }
    numRes += '';
    while (numRes.length > 3) {
      const tmp = numRes.slice(-3) + result;
      result = `,${tmp}`;
      numRes = numRes.slice(0, num.length - 3);
    }
    if (numRes) {
      result = numRes + result;
    }
    if (potIndex > -1) {
      result += decimal;
    }
    if (negative) {
      result = `-${result}`;
    }
    return result;
  },
  /**
   * 转存文件到钉盘
   * autoview 保存成功后自动展示
   */
  // ISaveFile(corpId, url, name, autoview) {
  //   saveFile(corpId, url, name, autoview);
  // },

  /**
   * 预览附件
   */
  // IPreView(corpId, fileData) {
  //   preViewFile(corpId, fileData);
  // },

  /**
   * 预览图片
   */
  IPreViewImage (urls, currentUrl, corpId) {
    if (urls && urls.length > 0) {
      const tmps = urls.map(a => `${a}&corpid=${corpId}`);
      const curUrl = `${currentUrl}&corpid=${corpId}` || tmps[0];
      previewImage(tmps, curUrl);
    }
  },
  /**
   * 函数节流
   * TODO： 命名错误，此处是防抖函数，保证只执行一次（梳理代码）
   */
  IThrottle (fn, context, delay, ...args) {
    const func = fn;
    return function a () {
      clearTimeout(func.timerId);
      func.timerId = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    };
  },
  /**
   * 打开一个链接
   * @param {*} url
   */
  IOpenLink (url) {
    openLink(url);
  },

  IClosePage () {
    closeApp();
  },
};
