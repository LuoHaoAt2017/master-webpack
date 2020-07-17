/* eslint-disable */
import { isFunc, isDingtalk, isiOS } from './common';
import H3PluginDeveloper from '../lib/h3-plugins-developer';

/**
 * 设置钉钉标题
 */
export const setTitle = (title) => {
  if (isDingtalk) {
    dd.biz.navigation.setTitle({
      title, // 控制标题文本，空字符串表示显示默认文本
      onSuccess() { },
      onFail() { },
    });
  }
};

/**
 * 设置钉钉左侧返回菜单
 * 同时兼容IOS与Android
 * cb 左侧按钮返回回调函数
 */
let backbuttonListener = () => {};
export const setLeft = function setLeftFunc(cb) {
  if (isDingtalk) {
    // if (isiOS) {
      setLeftFunc.callback = cb;
      dd.biz.navigation.setLeft({
        show: true, // 控制按钮显示， true 显示， false 隐藏， 默认true
        control: true, // 是否控制点击事件，true 控制，false 不控制， 默认false
        android: true, // 控制安卓机
        showIcon: true, // 是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
        text: '', // 控制显示文本，空字符串表示显示默认文本
        onSuccess() {
          cb.apply(this, []);
        },
        onFail() { },
      });
    // } else {
    //   document.removeEventListener('backbutton', backbuttonListener);
    //   backbuttonListener = function backbuttonListener(e) {
    //     cb();
    //     if (e) {
    //       e.preventDefault();
    //     }
    //   };
    //   document.addEventListener('backbutton', backbuttonListener);
    //   setLeftFunc.callback = backbuttonListener;
    // }
  }
};
setLeft.callback = () => {};
/**
 * 隐藏钉钉右侧菜单
 */
export const hideRightMenu = () => {
  if (isDingtalk) {
    dd.biz.navigation.setRight({
      show: false, // 控制按钮显示， true 显示， false 隐藏， 默认true
      control: false, // 是否控制点击事件，true 控制，false 不控制， 默认false
      text: '', // 控制显示文本，空字符串表示显示默认文本
    });
  }
};
/**
 * 隐藏钉钉右侧菜单
 */
export const showRightMenu = () => {
  if (isDingtalk) {
    dd.biz.navigation.setRight({
      show: true, // 控制按钮显示， true 显示， false 隐藏， 默认true
      control: false, // 是否控制点击事件，true 控制，false 不控制， 默认false
      text: '', // 控制显示文本，空字符串表示显示默认文本
    });
  }
};
/**
 * 设置钉钉右侧菜单
 */
export const setRightMenu = (text, fn) => {
  if (isDingtalk) {
    dd.biz.navigation.setRight({
      show: true, // 控制按钮显示， true 显示， false 隐藏， 默认true
      control: true, // 是否控制点击事件，true 控制，false 不控制， 默认false
      text, // 控制显示文本，空字符串表示显示默认文本
      onSuccess() {
        fn.apply(this, []);
      },
      onFail() { },
    });
  }
};

/**
 * 设置钉钉右侧菜单多个按钮
 */
export function setRightMultiMenu(DoAction, items, openForm, menuCode) {
  if (isDingtalk) {
    dd.biz.navigation.setMenu({
      items,
      onSuccess(data) {
        if (data.id === 'Create') {
          openForm.call(this, menuCode);
        } else {
          DoAction.call(this, data.id);
        }
      },
      onFail() {

      },
    });
  }
}
/**
 * 设置钉钉右侧图标
 */
export const showDingTalkIcon = (fn) => {
  if (isDingtalk) {
    dd.biz.navigation.setIcon({
      showIcon: true,
      iconIndex: 1,
      onSuccess() {
        fn.apply(this, []);
      },
      onFail() { },
    });
  }
};
export const hideDingTalkIcon = (fn) => {
  if (isDingtalk) {
    dd.biz.navigation.setIcon({
      showIcon: false,
      iconIndex: 1,
      onSuccess() {
        fn.apply(this, []);
      },
      onFail() { },
    });
  }
};

const closeCallbacks = [];
export const onAppClose = (callback, context = null) => {
  closeCallbacks.push({
    callback,
    context,
  });
};

/**
 * 关闭钉钉应用
 */
export const closeApp = () => {
  if (isDingtalk) {
    dd.ready(() => {
      dd.biz.navigation.close({
        onSuccess() {
          // 当app关闭时，执行回调函数
          closeCallbacks.forEach((item) => {
            if (item) {
              const { callback, context } = item;
              if (typeof callback === 'function') {
                  callback.call(context || null);
              }
            }
          });
        },
        onFail() { },
      });
    });
  }else{
    history.go(-1)
  }
};
/**
 * 钉钉扫描二维码
 */
export const scanQrCode = (callback) => {
  if (isDingtalk) {
    dd.biz.util.scan({
      type: 'qrCode',
      onSuccess(data) {
        if (typeof (callback) === 'function') {
          callback.call(this, data.text);
        }
      },
      onFail() { },
    });
  }
};

/**
 * 钉钉扫描条形码
 */
export const scanBarCode = (callback) => {
  if (isDingtalk) {
    dd.biz.util.scan({
      type: 'all',
      onSuccess(data) {
        if (typeof (callback) === 'function') {
          callback.call(this, data.text);
        }
      },
      onFail() { },
    });
  }
};

/**
 * 钉钉扫名片
 */
export const scanCard = (callback) => {
  if (isDingtalk) {
    dd.biz.util.scanCard({
      type: 'qrCode',
      onSuccess(data) {
        if (typeof (callback) === 'function') {
          callback.call(this, data);
        }
      },
      onFail() { },
    });
  }
};
/**
 * 钉钉定位获取经纬度
 */
export const geoGet = (callback, failCallback) => {
  if (isDingtalk) {
    dd.device.geolocation.get({
      targetAccurace: 200,
      coordinate: 1,
      withReGeocode: true,
      onSuccess(result) {
        callback.call(this, result);
      },
      onFail(err) {
        !!failCallback &&failCallback(err)
      },
    });
  }
};
/**
 * 钉钉定位地图查找
 */
export const mapSearch = (result) => {
  if (isDingtalk) {
    dd.biz.map.search({
      latitude: result.latitude,
      longitude: result.longitude,
      scope: 500,
      onSuccess(poi) {
        const street = poi.snippet == null ? '' : poi.snippet;
        const address = poi.city + poi.adName + street + poi.title;
        const poidata = {
          Address: address,
          Point: { lat: poi.location.latitude, lng: poi.location.longitude },
        };
        return poidata;
      },
      onFail() { },
    });
  }
};

/**
 * 钉钉定位地图查找
 */
export const mapLocate = (result, callback) => {
  if (isDingtalk) {
    dd.biz.map.locate({
      latitude: result.latitude,
      longitude: result.longitude,
      onSuccess(res) {
        if (typeof (callback) !== 'undefined') {
          callback.call(this, res);
        }
      },
      onFail() {

      },
    });
  }
};

export const ddAlert = (title, msg, callback) => {
  if (isDingtalk) {
    dd.device.notification.alert({
      message: msg,
      title,
      buttonName: '确认',
      onSuccess() {
        if (typeof (callback) !== 'undefined' && isFunc(callback)) {
          callback.call(this);
        }
      },
      onFail() { },

    });
  }
};

export const ddConfirm = (title, text, callBack) => {
  if (isDingtalk) {
    dd.device.notification.confirm({
      message: text,
      title,
      buttonLabels: ['取消', '确认'],
      onSuccess(result) {
        if (result.buttonIndex === 1) {
          if (isFunc(callBack)) {
            callBack(1);
          }
        } else if (isFunc(callBack)) {
          callBack(0);
        }
      },
      onFail() {

      },
    });
  }
};

export const showPreloader = (title) => {
  if (isDingtalk) {
    dd.device.notification.showPreloader({
      text: title,
      showIcon: true,
      onSuccess() { },
      onFail() { },
    });
  }
};

export const hidePreloader = () => {
  if (isDingtalk) {
    dd.device.notification.hidePreloader({
      onSuccess() { },
      onFail() { },
    });
  }
};
/**
 * 打开用户详情页面
 */
export const openProfile = (userId, corpId) => {
  if (isDingtalk) {
    dd.biz.util.open({
      name: 'profile',
      params: {
        id: userId,
        corpId,
      },
      corpId,
      onSuccess() { },
      onFail() { },
    });
  }
};

/**
 * 调用钉钉电话
 */
export const ddCall = () => {
  if (isDingtalk) {
    dd.biz.util.open({
      name: 'call',
      params: {

      },
      onSuccess() { },
      onFail() { },
    });
  }
};

/**
 * 拨打钉钉电话
 * @param {*} userIds
 * @param {*} corpId
 */
export const callDingTalk = (userIds, corpId) => {
  if (isDingtalk) {
    dd.biz.telephone.call({
      users: userIds, // 用户列表，工号
      corpId, // 企业id
      onSuccess() { },
      onFail() { },
    });
  }
};

/**
 * 拨打普通电话
 * @param {*} telephone
 */
export const callCommonTelephone = (telephone) => {
  dd.biz.telephone.showCallMenu({
    phoneNumber: telephone, // 期望拨打的电话号码
    code: '+86', // 国家代号，中国是+86
    showDingCall: true, // 是否显示钉钉电话
    onSuccess() { },
    onFail() { },
  });
};


/**
 * 图片钉消息
 */
export const imageDing = (users, corpId, text, success, fail) => {
  if (isDingtalk) {
    dd.biz.ding.post({
      users,
      corpId,
      type: 1,
      alertType: 2,
      alertDate: {},
      attachment: {
        images: [],
      },
      text,
      onSuccess: success,
      onFail: fail,
    });
  }
};

/**
 *链接钉钉消息
 */
export const linkDing = (users, corpId, text, title, url, imageUrl, subText, success, fail) => {
  if (isDingtalk) {
    const val = new Date().Format('yyyy-MM-dd hh:mm');
    dd.biz.ding.post({
      users,
      corpId,
      type: 2,
      alertType: 2,
      alertDate: { format: 'yyyy-MM-dd HH:mm', value: val },
      attachment: {
        title,
        url,
        image: imageUrl,
        text: subText,
      },
      text,
      onSuccess: success,
      onFail: fail,
    });
  }
};

/**
 *图片不上传直接预览
 */
export const previewImage = (urls, currentUrl) => {
  console.log(urls, currentUrl);
  if (isDingtalk) {
    dd.biz.util.previewImage({
      urls, // 图片地址列表
      current: currentUrl, // 当前显示的图片链接
      onSuccess() { },
      onFail() {
        console.log('预览失败', arguments);
      },
    });
  }
};


/**
 *转存文件到钉盘
 */
// export const saveFile = (corpId, url, name, autoview) => {
//   const self = this;
//   if (isDingtalk) {
//     dd.biz.cspace.saveFile({
//       corpId: H3Config.corpId,
//       url,
//       name,
//       onSuccess(data) {
//         if (autoview) {
//           self.preViewFile(corpId, data);
//         }
//       },
//       onFail() { },
//     });
//   }
// };

/**
 *钉盘附件预览
 */
// export const preViewFile = (corpId, fileData) => {
//   if (isDingtalk) {
//     if (fileData && typeof (fileData) === 'object' &&
// fileData.data && fileData.data.length > 0 && typeof (dd) !== 'undefined' &&
// dd.biz && dd.biz.cspace && H3Config.corpId !== '') {
//       const dt = fileData.data[0];
//       dd.biz.cspace.preview({
//         corpId,
//         spaceId: dt.spaceId,
//         fileId: dt.fileId,
//         fileName: dt.fileName,
//         fileSize: dt.fileSize,
//         fileType: dt.fileType,
//         onSuccess() {
//           // 无，直接在native显示文件详细信息
//         },
//         onFail() {
//           // 无，直接在native页面显示具体的错误
//         },
//       });
//     }
//   }
// };
/**
 *钉钉定位获取当前位置
 */
export const getLocation = (fn, withReGeocode, failFn) => {
  if (isDingtalk) {
    dd.device.geolocation.get({
      targetAccuracy: 200,
      coordinate: 1,
      withReGeocode,
      onSuccess(result) {
        fn.call(this, result);
      },
      onFail(err) {
        if (failFn) {
          failFn.call(this, err);
        }
      },
    });
  } else {
    failFn.call(this);
    // fn.call(this, { longitude: 113 }); // 测试经度定位
  }
};

/*
 *钉钉展示位置
 */
export const getMapView = (data, failFn) => {
  if (isDingtalk) {

    dd.biz.map.view({
      latitude: data.latitude, // 纬度
      longitude: data.longitude, // 经度
      title: data.title // 地址/POI名称
    });
  } else {
    failFn.call(this);
  }
};
/**
     *钉钉定位poi
     */
export const searchMapLocation = (fn, latitude, longitude) => {
  if (isDingtalk) {
    dd.biz.map.search({
      latitude,
      longitude,
      scope: 500,
      onSuccess(result) {
        fn.call(this, result);
      },
      onFail() { },
    });
  }
};
/**
 *钉钉定位
 */
export const locateMapLocation = (fn, latitude, longitude) => {
  if (isDingtalk) {
    dd.biz.map.locate({
      latitude,
      longitude,
      onSuccess(result) {
        fn.call(this, result);
      },
      onFail() { },
    });
  }
};

/**
 *钉钉config
 */
export const ddConfig = (agentId, corpId, timeStamp, nonce, signature, cb) => {
  dd.config({
    agentId,
    corpId,
    timeStamp,
    nonceStr: nonce,
    signature,
    jsApiList: ['runtime.info',
      'biz.contact.choose',
      'biz.contact.chooseMobileContacts',
      'device.notification.confirm',
      'device.notification.alert',
      'device.notification.prompt',
      'device.notification.showPreloader',
      'device.notification.hidePreloader',
      'biz.ding.post',
      'device.geolocation.get',
      'biz.map.view',
      'biz.map.locate',
      'biz.map.search',
      'biz.util.datepicker',
      'biz.util.timepicker',
      'biz.util.datetimepicker',
      'biz.util.scan',
      'biz.util.scanCard',
      'biz.util.uploadImageFromCamera',
      'biz.util.uploadAttachment',
      'biz.cspace.preview',
      'biz.cspace.chooseSpaceDir',
      'biz.util.uploadImage',
      'biz.util.uploadAttachment',
      'biz.user.get',
      'biz.cspace.preview',
      'biz.cspace.chooseSpaceDir',
      'biz.cspace.saveFile',
      'biz.contact.complexChoose',
      'biz.navigation.setTitle',
      'biz.navigation.setIcon',
      'biz.navigation.setLeft',
      'biz.navigation.setMenu',
      'biz.navigation.close',
      'biz.chat.pickConversation',
      'biz.telephone.showCallMenu',
      'biz.telephone.call',
      'biz.util.ut',
      'biz.util.openLink',
      'biz.util.open',
      'biz.util.share',
      'ui.nav.preload',
      'ui.nav.go',
      'biz.store.inquiry', // 询价
      'biz.store.createOrder', // 下单
      'biz.store.getPayUrl', // 获取下单URL
      'biz.alipay.pay', // 唤醒支付宝
    ],
  });
  dd.ready(() => {
    cb();
  });
  dd.error((err) => {
    let msg = '';
    for (const key in err) {
      if (Object.prototype.hasOwnProperty.call(err, key)) {
        msg += `${key}:${err[key]};`;
      }
    }
    if (msg.indexOf('uid is not employee for orgid') > -1) {
      msg = '你不在当前组织机构中，无权限查看！';
    }
    ddAlert('提示', msg);
  });
};

export const requestAuthCode = (corpId, cb) => {
  if (isDingtalk) {
    dd.runtime.permission.requestAuthCode({
      corpId,
      onSuccess: (result) => {
        cb(result.code);
      },
      onFail(err) {
        let msg = '';
        for (const key in err) {
          if (Object.prototype.hasOwnProperty.call(err, key)) {
            msg += `${key}:${err[key]};`;
          }
        }
        if (msg.indexOf('用户不在当前企业') > -1) {
          msg = '用户不在当前企业，无权访问数据！';
        }
        ddAlert('提示', msg);
      },
    });
  }
};
export const openLink = (url, errorMsg) => {
  if (isDingtalk) {
    dd.biz.util.openLink({
      url,
      onSuccess() {
        H3PluginDeveloper.IHidePreLoader();
      },
      onFail(err) {
        console.log(err);
        H3PluginDeveloper.IHidePreLoader();
        if (errorMsg) {
          H3PluginDeveloper.IShowTip('提示', errorMsg);
        }
      },
    });
  }
};

// 查看附件借口
export const previewAttachment = (htmlUrl) => {
  if (isDingtalk) {
    dd.biz.util.openLink({
      url: htmlUrl,
      onSuccess() {
        H3PluginDeveloper.IHidePreLoader();
      },
      onFail() {
        H3PluginDeveloper.IHidePreLoader();
      },
    });
  }else{
    window.location.href = htmlUrl;
  }
};
// 预览视频接口
export const previewVideo = (url) => {
  if (isDingtalk) {
    dd.biz.util.openLink({
      url: url,
      onSuccess() {
        H3PluginDeveloper.IHidePreLoader();
      },
      onFail() {
        H3PluginDeveloper.IHidePreLoader();
      },
    });
  }else{
    window.location.href = url;
  }
};

export const DatePicker = (value, handler) => {
  if (isDingtalk) {
    dd.biz.util.datepicker({
      format: 'yyyy-MM-dd',
      value,
      onSuccess(result) {
        handler(result.value);
      },
      onFail() {

      },
    });
  }
};

export const TimePicker = (value, handler) => {
  if (isDingtalk) {
    dd.biz.util.timepicker({
      format: 'HH:mm',
      value,
      onSuccess(result) {
        handler(result.value);
      },
      onFail() {

      },
    });
  }
};

export const DateTimePicker = (value, handler) => {
  if (isDingtalk) {
    dd.biz.util.datetimepicker({
      format: 'yyyy-MM-dd HH:mm:ss',
      value,
      onSuccess(result) {
        handler(result.value);
      },
      onFail() {

      },
    });
  }
};

/**
 * 获取钉钉回话
 * @param {*} corpId
 * @param {*} callback
 */
export const pickConversation = (corpId, callback) => {
  if (isDingtalk) {
    dd.biz.chat.pickConversation({
      corpId,
      isConfirm: 'false',
      onSuccess(data) {
        callback(data.cid);
      },
      onFail() {
      },
    });
  } else {
    // callback();
  }
};


/**
 * 钉钉催办类型弹窗页面
 */
export const IPostLinkDing = (
  users,
  corpId, text, title, url, imageUrl, subText, success, fail,
) => {
  if (typeof (dd) !== 'undefined' && dd.biz.ding) {
    const val = new Date().Format('yyyy-MM-dd hh:mm');
    dd.biz.ding.post({
      users,
      corpId,
      type: 2,
      alertType: 2,
      alertDate: { format: 'yyyy-MM-dd HH:mm', value: val },
      attachment: {
        title,
        url,
        image: imageUrl,
        text: subText,
      },
      text,
      onSuccess: success,
      onFail: fail,
    });
  }
};
export const getUserInfo = (corpId, fn) => {
  if (isDingtalk) {
    dd.biz.user.get({
      corpId,
      onSuccess(result) {
        fn.call(this, result);
      },
      onFail() { },
    });
  }
};

export const uploadImageFromCamera = (fn, compression, stickers) => {
  if (isDingtalk) {
    dd.biz.util.uploadImageFromCamera({
      compression, // (是否压缩，默认为true)
      quality: 50,
      resize: 50,
      stickers, // 钉钉v2.11.0之后支持拍照水印
      onSuccess(result) {
        fn.call(this, result);
      },
      onFail(err) {
        //这里特殊处理，当用户取消时，不提示用户
        if (err.errorMessage === 'Cancel' || err.errorMessage === 'cancel') { //安卓手机 是cancel
            return false;
        }
        alert(JSON.stringify(err))
      },
    });
  }
};
// 钉钉上传图片接口
export const uploadImageFromDing = (fn) => {
  if (isDingtalk) {
    dd.biz.util.uploadImage({
      // compression:true,//(是否压缩，默认为true)
      // multiple: false, //是否多选，默认false
      // max: 3, //最多可选个数
      // quality: 50, // 图片压缩质量,
      // resize: 50, // 图片缩放率
      onSuccess(result) {
        fn.call(this, result);
      },
      onFail() { },
    });
  }
};
// 存储文件到钉盘
export const saveImageToDing = (corpId, url, fileName, callback) => {
  dd.biz.cspace.saveFile({
    corpId,
    url, // 文件在第三方服务器地址， 也可为通过服务端接口上传文件得到的media_id，详见参数说明
    name: fileName,
    onSuccess() {
      if (callback) {
        callback();
      }
    },
    onFail() {
      if (callback) {
        callback();
      }
    },
  });
};

// 打开手机通讯录单选
export const selectTelephone = (onSuccess, onFail) => {
  dd.ready(() => {
    dd.biz.contact.chooseMobileContacts({
      multiple: false, // 是否多选： true多选 false单选； 默认true
      //maxUsers: 1, // 人数限制，当multiple为true才生效，可选范围1-1500
      //limitTips: 'xxx', // 超过人数限制的提示语可以用这个字段自定义
      //title: '选择电话', // 如果你需要修改选人页面的title，可以在这里赋值
      onSuccess(data) {
        // onSuccess将在选人结束，点击确定按钮的时候被回调
        /* data结构
          [{
            "name": "张三", //姓名
            "mobile": "110" //用户手机号
            "mediaId": 'RSDFS', //用户头像id
           }
          ]
        */
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onFail(err) {
        if (onFail) {
          let msg = '';
          for (const key in err) {
            if (Object.prototype.hasOwnProperty.call(err, key)) {
              msg += `${key}:${err[key]};`;
            }
          }
          onFail(msg);
        }
      },
    });
  });
};

export const dingShare = (options) => {
  if (isDingtalk && options) {
    options.type = options.type || 0;
    dd.biz.util.share(options);
  //   dd.biz.util.share({
  //     type: 0,//分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
  //     url: String,
  //     title: String,
  //     content: String,
  //     image: String,
  //     onSuccess : function() {
  //         //onSuccess将在调起分享组件成功之后回调
  //         /**/
  //     },
  //     onFail : function(err) {}
  // })
  }
};
