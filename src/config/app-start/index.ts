/**
 * 应用启动初始化
 */
import { isDingtalk } from '@/config/common';
import { parseUrlParams } from '@/utils/url';
import authLogin from './auth-login';
import getAppEntry from './app-entry';
import globalConfig from './global-config';
import dd from 'dingtalk-jsapi';
window.dd = dd;

const goToActivity = (dingId) => {
  // const hasShown = `${dingId}_hassend`;
  // const hasSend = window.localStorage.getItem(hasShown);

  // if (!hasSend && window.GlobalConfig.isAPaaS &&
  //   window.Environment && window.Environment.EnableActivity) {
  //   window.localStorage.setItem(hasShown, true);
  //   openLink(encodeURI(`${window.Environment.ApiHost}/Activity/Mobile/index.html?showmenu=false&enginecode=${window.GlobalConfig.engineCode}&userid=${window.GlobalConfig.userId}&dingid=${window.GlobalConfig.dingId}&accesstoken=${window.GlobalConfig.accessToken}`));
  // }
};

// 解析URL参数
function parseUrl (): GlobalConfig {
  const hash = window.location.hash;
  const params = parseUrlParams(window.location.href);
  for (const paramName of Object.keys(params)) {
    params[paramName.toLowerCase()] = params[paramName];
  }
  return Object.assign(globalConfig, {
    corpId: params.corpid,
    engineCode: params.enginecode,
    isExternalForm: params.isexternalform === '1',
    isInternalForm: params.isinternalsharing === '1', // 是否内部填单分享
    isExternalShare: params.isexternalshare === '1',
    isOpenQuery: params.isopenquery === '1',
    appCode: params.appid,
    solutionCode: params.solutioncode,
    appRankType: params.appranktype,
    displayMode: params.displaymode,
    agentId: params.agentid || params.ai,
    dingAppId: params.dingappid,
    suiteKey: params.suitekey || params.sk,
    isAuto: params.isauto,
    isIsv: params.type ? true : (!!params.isIsv),
    isList: params.islist,
    homeType: params.hometype,
    menuCode: params.menucode,
    reportCode: params.reportcode,
    widgetId: params.widgetid,
    messageType: params.messagetype || params.mt,
    bizObjectId: params.bizobjectid || params.bo,
    schemaCode: params.schemacode || params.sc,
    workitemId: params.workitemid,
    shareKey: params.sharekey,
    enableAssociation: params.ao,
    urlHash: hash,
    isPcSignature: params.IsPcSignature === 'true',
    ddIngPid: params.ddIngPid || '',
    ddIngTid: params.ddIngTid || '',
    taskOpenType: params.taskopentype || ''
  });
}

export default async function appStart () {
  if (dd.pc) {
    const url = window.location.href.replace('index.html?', 'DingTalkAttach/MessageDpc/?');
    window.location.replace(url);
    return;
  }
  let globalConfig = parseUrl();
  if (process.env.NODE_ENV === 'production') {
    if (globalConfig.corpId && (!globalConfig.isExternalForm)) {
      // 生产模式，并且非外链表单
      if (isDingtalk) {
        globalConfig = await authLogin(globalConfig);
        if (globalConfig) {
          globalConfig.homeAddress = getAppEntry(globalConfig);
          // alert(JSON.stringify(globalConfig));
        }
        return globalConfig;
      } else {
        alert('仅允许使用“钉钉”查看数据');
        return;
      }
    }
  } else {
    const globalConfigJSON = window.localStorage.getItem('H3_DEV_GlobalConfig');
    if (globalConfigJSON) {
      const mockGlobalConfig: GlobalConfig = JSON.parse(globalConfigJSON);
      Object.assign(globalConfig, mockGlobalConfig);
    }
  }
  if (globalConfig) {
    globalConfig.homeAddress = getAppEntry(globalConfig);
  }
  return globalConfig;
}
