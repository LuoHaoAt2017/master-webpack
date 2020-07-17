// zyq;
import Vue from 'vue';
import { isDingtalk } from '@/config/common';
import { TipsMessage, SolutionTypes, SolutionState } from '@/config/license';
import { baseUrl } from '@/config/env';
import { openLink } from '@/config/dingtalk-interface';
import store from '@/store';

export default async (urls = '', data = {}, types = 'GET', isAsync = true) => {
  let type = types;
  let url = urls;
  type = type.toUpperCase();
  url = baseUrl + url;
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      method: type,
      data,
      dataType: 'json',
      async: isAsync,
      success (response) {
        let obj = response;
        if (typeof obj !== 'object') {
          obj = JSON.parse(obj);
        }
        if (obj.ReturnData !== undefined) {
          TipsMessage.GoodsCode = store.state.solutionGoodsInfo;
          let showExpireInfo = true;
          let expireInfoTime = window.localStorage.getItem('expireInfoTime');
          if (expireInfoTime !== null) {
            expireInfoTime = new Date(expireInfoTime);
            const today = new Date();
            if (today.getFullYear() === expireInfoTime.getFullYear() &&
              today.getMonth() === expireInfoTime.getMonth() &&
              today.getDate() === expireInfoTime.getDate()) {
              showExpireInfo = false;
            }
          }

          const solutionState = obj.ReturnData.LicenseSolutionState;
          window.GlobalConfig.solutionState = obj.ReturnData.LicenseSolutionState;
          window.GlobalConfig.isAdministrator = obj.ReturnData.LicenseIsAdministrator;
          window.GlobalConfig.residueFileSize = obj.ReturnData.LicenseResidueFileSize;
          window.GlobalConfig.solutionCode = obj.ReturnData.LicenseSolutionCode;
          window.GlobalConfig.GoodsCode = obj.ReturnData.LicenseSolutionCode ?
            TipsMessage.GoodsCode[obj.ReturnData.LicenseSolutionCode] : undefined;
          window.GlobalConfig.solutionType = obj.ReturnData.LicenseSolutionType;
          const solutionType = obj.ReturnData.LicenseSolutionType;

          if (solutionState === SolutionState.Expire) {
            if (solutionType !== SolutionTypes.APass) {
              TipsMessage.ExpireMessage = TipsMessage.ExpireMessage.replace('氚云平台使用权', '您的应用使用权');
            }
            // 使用时间到期
            window.GlobalConfig.expired = true;
            if (window.GlobalConfig.GoodsCode) {
              const corpId = window.GlobalConfig.corpId || '$CORPID$';
              Vue.$h3.modal.show({
                title: TipsMessage.ExpireTitle,
                maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
                content: TipsMessage.ExpireMessage,
                type: 'alert',
                actions: [
                  {
                    text: '立即续费',
                    onPress: () => {
                      const payUrl = 'https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&' +
                        `goodsCode=${window.GlobalConfig.GoodsCode}&corpId=${corpId}`;
                      if (isDingtalk) {
                        openLink(payUrl);
                        window.GlobalConfig.backAction = true;
                      } else {
                        window.location.href = payUrl;
                        window.GlobalConfig.backAction = true;
                      }
                    },
                  }],
              });
            } else {
              Vue.$h3.modal.show({
                title: TipsMessage.ExpireTitle,
                maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
                content: TipsMessage.ExpireMessage,
                type: 'alert',
                actions: [{
                  text: '立即咨询',
                  onPress: () => {
                    if (isDingtalk) {
                      openLink(TipsMessage.payUrl);
                      window.GlobalConfig.backAction = true;
                    } else {
                      window.location.href = TipsMessage.payUrl;
                      window.GlobalConfig.backAction = true;
                    }
                  },
                }],
              });
            }
            return false;
            // 使用时间即将到期
          } else if (solutionState === SolutionState.WillExpire && showExpireInfo) {
            if (solutionType !== SolutionTypes.APass) {
              TipsMessage.ExpireMessage = TipsMessage.WillExpireMessage.replace('氚云平台使用权', '您的应用使用权');
            }
            window.GlobalConfig.willExpired = true;
            window.GlobalConfig.expireDate = obj.ReturnData.LicenseExpiredDate;
            if (window.GlobalConfig.GoodsCode) {
              const corpId = window.GlobalConfig.corpId || '$CORPID$';
              Vue.$h3.modal.show({
                title: TipsMessage.WillExpireTitle,
                maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
                content: TipsMessage.WillExpireMessage.replace('到期时间', window.GlobalConfig.expireDate),
                type: 'alert',
                actions: [
                  { text: '取消', onPress: () => {} },
                  {
                    text: '立即续费',
                    onPress: () => {
                      const payUrl = 'https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&' +
                        `goodsCode=${window.GlobalConfig.GoodsCode}&corpId=${corpId}`;
                      if (isDingtalk) {
                        openLink(payUrl);
                      } else {
                        window.location.href = payUrl;
                      }
                    },
                  }],
              });
            } else {
              Vue.$h3.modal.show({
                title: TipsMessage.WillExpireTitle,
                maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
                content: TipsMessage.WillExpireMessage.replace('到期时间', window.GlobalConfig.expireDate),
                type: 'alert',
                actions: [
                  { text: '取消', onPress: () => {} },
                  {
                    text: '立即咨询',
                    onPress: () => {
                      if (isDingtalk) {
                        openLink(TipsMessage.payUrl);
                      } else {
                        window.location.href = TipsMessage.payUrl;
                      }
                    },
                  }],
              });
            }
            window.localStorage.setItem('expireInfoTime', new Date());
          } else if (window.GlobalConfig.isAdministrator &&
            solutionState === SolutionState.FileSizeExceed && showExpireInfo) {
            // 附件量到期
            window.GlobalConfig.fileSizeExceed = true;
            Vue.$h3.modal.show({
              title: '限制提醒',
              maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
              content: TipsMessage.FileSizeExceedMessage,
              type: 'alert',
              actions: [{ text: '知道了', onPress: () => {} }],
            });
            window.localStorage.setItem('expireInfoTime', new Date());
          } else if (window.GlobalConfig.isAdministrator &&
            solutionState === SolutionState.FileSizeWillExceed && showExpireInfo) {
            window.GlobalConfig.fileSizeWillExceed = true;
            Vue.$h3.modal.show({
              title: TipsMessage.WillExpireTitle,
              maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
              content: TipsMessage.FileSizeWillExceedMessage.replace('剩余附件量', `${window.GlobalConfig.residueFileSize}M`),
              type: 'alert',
              actions: [{ text: '知道了', onPress: () => {} }],
            });
            window.localStorage.setItem('expireInfoTime', new Date());
          }
        }
        resolve(obj);
      },
      error(err) {
        reject(err);
      },
    });
  });
};
