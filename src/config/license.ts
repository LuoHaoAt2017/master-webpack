import { isDingtalk } from './common'
import { openLink, closeApp } from './dingtalk-interface';
import backStack from './back-stack';
import store from '@/store';

export enum SolutionTypes{
  APass = 1,
  Sass = 2,
  Template = 3
}

export enum SolutionState{
  Normal = 0,
  Expire = 1,
  WillExpire = 2,
  FileSizeWillExceed = 3,
  FileSizeExceed = 4
}

interface TipsMessage {
  ExpireTitle:string;
  WillExpireTitle:string;
  ExpireMessage:string;
  WillExpireMessage:string;
  FileSizeExceedMessage:string;
  FileSizeWillExceedMessage:string;
  payUrl:string;
  GoodsCode:any;
}

interface License {
  GoodsCode:string;  //
  LicenseExpiredDate:string;  //过期日期
  LicenseIsAdministrator:boolean;  //是否管理员
  LicenseResidueFileSize:number;  //剩余附件量
  LicenseSolutionCode:string;
  LicenseSolutionName:string;
  LicenseSolutionStates:SolutionState[];
  LicenseSolutionType: SolutionTypes;  //
}

export const TipsMessage:TipsMessage = {
  ExpireTitle: '超期提醒',
  WillExpireTitle: '温馨提醒',
  ExpireMessage: `<div style="text-align:left;font-size:15px;padding: 8px 6px 31px 6px;">尊敬的用户，您的氚云服务<span style="color:#F5222D;font-size:15px">已到期</span>，如需继续使用请及时续费或来电咨询
    <p style="color:rgba(0,0,0,0.65);margin-top:12px;font-size:15px">客服电话：4000-899-893（周一至周五 9:00 - 12:00  13:30 - 18:00）</p></div>`,
  WillExpireMessage: `<div style="text-align:left;font-size:15px;padding: 8px 6px 31px 6px;">尊敬的用户，您的氚云服务将于<span style="color:#F5222D;font-size:15px">{ExpireDate}</span>到期，为了不影响正常使用，请及时续费或来电咨询
    <p style="color:rgba(0,0,0,0.65);margin-top:12px;font-size:15px">客服电话: 4000-899-893（周一至周五 9:00 - 12:00  13:30 - 18:00）</p></div>`,
  FileSizeExceedMessage: `<div style="text-align:left;font-size:15px;padding: 8px 6px 31px 6px;">尊敬的用户，您的附件量<span style="color:#F5222D;font-size:15px">已达上限</span>，无法上传新附件，请及时购买服务包升级附件套餐
    <p style="color:rgba(0,0,0,0.65);margin-top:12px;font-size:15px">客服电话: 4000-899-893（周一至周五 9:00 - 12:00  13:30 - 18:00）</p></div>`,
  FileSizeWillExceedMessage: `<div style="text-align:left;font-size:15px;padding: 8px 6px 31px 6px;">尊敬的用户，您的附件量剩余<span style="color:#F5222D;font-size:15px">{ResidueFileSize}</span>，为了不影响正常使用，请及时购买服务包升级附件套餐
    <p style="color:rgba(0,0,0,0.65);margin-top:12px;font-size:15px">客服电话: 4000-899-893（周一至周五 9:00 - 12:00  13:30 - 18:00）</p></div>`,
  payUrl: 'https://www.sobot.com/chat/h5/index.html?sysNum=ba53512829e343058872e7c2ab942a7e&color=0f92ed&lan=cn&invite=0&unreadcount=0',
  GoodsCode: {},
};

/**
 * 许可到期提醒处理
 * @param license
 */
export function licenseHandler(license: License):boolean {

  let showExpireInfo:boolean = true;
  let expireInfoTime: string = window.localStorage.getItem('expireInfoTime');
  if (expireInfoTime !== null) {
    const expireTime = new Date(expireInfoTime);
    const today = new Date();
    if (
      today.getFullYear() === expireTime.getFullYear() &&
      today.getMonth() === expireTime.getMonth() &&
      today.getDate() === expireTime.getDate()
    ) {
      showExpireInfo = false;
    }
  }
  const globalConfig = window.GlobalConfig;

  globalConfig.solutionStates = license.LicenseSolutionStates;
  globalConfig.solutionCode = license.LicenseSolutionCode;
  globalConfig.LicenseSolutionName = license.LicenseSolutionName;
  globalConfig.GoodsCode = license.LicenseSolutionCode ? TipsMessage.GoodsCode[license.LicenseSolutionCode] : undefined;
  globalConfig.solutionType = license.LicenseSolutionType;
  const solutionStates = license.LicenseSolutionStates;
  const solutionType = license.LicenseSolutionType;
  const residueFileSize = license.LicenseResidueFileSize;
  const licenseSolutionName = license.LicenseSolutionName;
  const licenseSolutionNames = ['决招进销存', '决招CRM', '决招HRM']
  const smartERP = ['merp', 'dev001', 'szxy', 'mastersaas'];
  let tipsMessage = '';
  if (!solutionStates) { return true}

  //使用许可到期
  if (solutionStates.indexOf(SolutionState.Expire) > -1) {
    tipsMessage = TipsMessage.ExpireMessage;
    if (solutionType !== SolutionTypes.APass) {
      tipsMessage = tipsMessage.replace('氚云', licenseSolutionName);
    }
    if ( solutionType === SolutionTypes.Sass
      && licenseSolutionNames.indexOf(licenseSolutionName) > -1) {
      tipsMessage = tipsMessage
        .replace('氚云', licenseSolutionName);
    }
    if (solutionType === SolutionTypes.Sass) {
      if (smartERP.indexOf(license.LicenseSolutionCode) > -1) {
        tipsMessage.replace('4000-899-893', '15396264712');
      } else {
        tipsMessage.replace('4000-899-893', '400-1399-566');
      }  
    }
    // 使用时间到期

    //非管理员服务已到期处理
    if (!globalConfig.isAdmin) {
      window.$h3.modal.show({
        title: TipsMessage.ExpireTitle,
        maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
        content: `<div style='text-align:left;font-size:15px;padding: 8px 6px 31px 6px;'>尊敬的用户，您的${
          solutionType === SolutionTypes.APass ? '氚云' : licenseSolutionName
          }服务<span style='color:#F5222D;font-size:15px'>已到期</span>，请联系贵公司管理员续费</div>`,
        type: 'alert',
      });
    }
    else if (globalConfig.GoodsCode) {
      const corpId = globalConfig.corpId || '$CORPID$';
      window.$h3.modal.show({
        title: TipsMessage.ExpireTitle,
        maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
        content: tipsMessage,
        type: 'alert',
        actions: [
          {
            text: '立即续费',
            onPress: () => {
              const payUrl =
                'https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&' +
                `goodsCode=${globalConfig.GoodsCode}&corpId=${corpId}`;
              if (isDingtalk) {
                openLink(payUrl);
                globalConfig.backAction = true;
              } else {
                window.location.href = payUrl;
                globalConfig.backAction = true;
              }
              return Promise.reject();
            },
          },
        ],
      });
    }
    else {
      window.$h3.modal.show({
        title: TipsMessage.ExpireTitle,
        maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
        content: tipsMessage,
        type: 'alert',
        actions: [
          {
            text: '立即咨询',
            onPress: () => {
              if (isDingtalk) {
                openLink(TipsMessage.payUrl);
                globalConfig.backAction = true;
              } else {
                window.location.href = TipsMessage.payUrl;
                globalConfig.backAction = true;
              }
              return Promise.reject();
            },
          },
        ],
      });
    }

    backStack.push(() => {
      window.$h3.modal.hide();
      window.$h3.toast.hide();
      if(window.history.length === 1){
        closeApp()
      }else{
        window.history.go(-1)
      }
    })

    return false;
    // 使用时间即将到期
  } else if (
    globalConfig.isAdmin &&
    solutionStates.indexOf(SolutionState.WillExpire) > -1 &&
    showExpireInfo
  ) {
    if (!globalConfig.isAdmin){ return false; }
    tipsMessage = TipsMessage.WillExpireMessage;
    if (solutionType === SolutionTypes.Sass) {
      tipsMessage = tipsMessage.replace('氚云', licenseSolutionName);
      if (licenseSolutionNames.indexOf(licenseSolutionName) > -1) {
        tipsMessage =tipsMessage.replace(
          '氚云',
          licenseSolutionName,
        );
      }
      if (smartERP.indexOf(license.LicenseSolutionCode) > -1) {
        tipsMessage.replace('4000-899-893', '15396264712');
      } else {
        tipsMessage.replace('4000-899-893', '400-1399-566');
      }
    }
    const expireDate = license.LicenseExpiredDate;
    if (globalConfig.GoodsCode) {
      const corpId = globalConfig.corpId || '$CORPID$';
      window.$h3.modal.show({
        title: TipsMessage.WillExpireTitle,
        maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
        content: tipsMessage.replace(
          '{ExpireDate}',
          expireDate,
        ),
        type: 'alert',
        actions: [
          { text: '取消', onPress: () => {} },
          {
            text: '立即续费',
            onPress: () => {
              const payUrl =
                'https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&' +
                `goodsCode=${globalConfig.GoodsCode}&corpId=${corpId}`;
              if (isDingtalk) {
                openLink(payUrl);
              } else {
                window.location.href = payUrl;
              }
              return Promise.reject();
            },
          },
        ],
      });
    } else {
      window.$h3.modal.show({
        title: TipsMessage.WillExpireTitle,
        maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
        content: tipsMessage.replace(
          '{ExpireDate}',
          expireDate,
        ),
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
          },
        ],
      });
    }
    window.localStorage.setItem('expireInfoTime', new Date().toString());
  } else if (
    globalConfig.isAdmin &&
    solutionStates.indexOf(SolutionState.FileSizeExceed) > -1 &&
    showExpireInfo
  ) {
    if (solutionType === SolutionTypes.Sass) {
      tipsMessage = TipsMessage.FileSizeExceedMessage.replace('氚云', licenseSolutionName);
      if (licenseSolutionNames.indexOf(licenseSolutionName) > -1) {
        tipsMessage = tipsMessage.replace(
          '氚云',
          licenseSolutionName,
        );
        
      }
      if (smartERP.indexOf(license.LicenseSolutionCode) > -1) {
        tipsMessage.replace('4000-899-893', '15396264712');
      } else {
        tipsMessage.replace('4000-899-893', '400-1399-566');
      }
    }
    // 附件量到期
    window.$h3.modal.show({
      title: '限制提醒',
      maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
      content: tipsMessage || TipsMessage.FileSizeExceedMessage,
      type: 'alert',
      actions: [
        {
          text: '知道了',
          onPress: () => {},
        },
      ],
    });
    window.localStorage.setItem('expireInfoTime', new Date().toString());
  } else if (
    globalConfig.isAdmin &&
    solutionStates.indexOf(SolutionState.FileSizeWillExceed) > -1 &&
    showExpireInfo
  ) {
    tipsMessage = TipsMessage.FileSizeExceedMessage;
    if (solutionType === SolutionTypes.Sass) {
      if (licenseSolutionNames.indexOf(licenseSolutionName) > -1) {
        tipsMessage = tipsMessage.replace(
          '氚云',
          licenseSolutionName,
        );
        
      }
      if (smartERP.indexOf(license.LicenseSolutionCode) > -1) {
        tipsMessage.replace('4000-899-893', '15396264712');
      } else {
        tipsMessage.replace('4000-899-893', '400-1399-566');
      }
    }
    tipsMessage = tipsMessage.replace(
      '{ResidueFileSize}',
      `${residueFileSize}M`,
    );
    window.$h3.modal.show({
      title: TipsMessage.WillExpireTitle,
      maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
      content: tipsMessage,
      type: 'alert',
      actions: [{ text: '知道了', onPress: () => {} }],
    });
    window.localStorage.setItem('expireInfoTime', new Date().toString());
  }
  return true
}
