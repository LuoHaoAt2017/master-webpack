import { ddConfig, requestAuthCode, ddAlert } from '@/config/dingtalk-interface';
import { getDingtalkSignature, ddLogin } from '@/service/common.service';
import { isDingtalk } from '@/config/common';
import { captureExceptionWithTag } from '@/config/sentry';
import { mergeLoginResponse } from './global-config';

const AuthorizeErroCodes = [231, 232];

// 登录H3系统
async function loginH3 (code, signature, config: GlobalConfig) {
  const res: any = await ddLogin(
    code,
    config.corpId,
    config.appCode,
    config.suiteKey,
    config.solutionCode,
    config.dingAppId,
    config.agentId,
    signature,
    config.isIsv,
  );
  // 临时这么处理
  if (res.Message && res.Message.indexOf('uid is not employee for orgid') > -1) {
    res.Message = '你不在当前组织机构中，无权限查看！';
  }
  if (res.Result) {
    return mergeLoginResponse(config, res);
  } else if (isDingtalk) {
    ddAlert('提示', res.Message);
  } else {
    alert(res.Message);
  }
  if (res.ErrorCode && AuthorizeErroCodes.indexOf(res.ErrorCode) > -1) {
    // 返回是为了避免弹两次
    config.LoginFailed = true;
    return config;
  }
  captureExceptionWithTag(res, {
    errorType: 'loginError',
  });
  return null;
}

function ddAuth (params: { timeStamp:string; nonce:string; signature: string}, config: GlobalConfig) {
  return new Promise<GlobalConfig>((resolve, reject) => {
    ddConfig(
      config.agentId,
      config.corpId,
      params.timeStamp,
      params.nonce,
      params.signature,
      () => {
        if (config.userId) {
          // getHomeAddress();
          // if (window.GlobalConfig.homeAddress.toLowerCase().indexOf('guid') < 0) {
          //   goToActivity(window.GlobalConfig.dingId);
          // }
          // addDynamicRoutes(router)
          resolve(config);
        } else {
          requestAuthCode(config.corpId, async (code) => {
            const globalConfig = await loginH3(code, params.signature, config);
            if (globalConfig) {
              resolve(globalConfig);
            } else {
              reject(new Error('登录失败'));
            }
          });
        }
      },
    );
  });
}

export default async function queryDingTalkSignature (config: GlobalConfig) {
  let sourceUrl = window.location.href;
  const index = sourceUrl.indexOf('#');
  if (index > -1) {
    sourceUrl = sourceUrl.substr(0, index);
  }
  const res = await getDingtalkSignature({
    corpId: config.corpId,
    appId: config.appCode, // appId 就是appCode
    suiteKey: config.suiteKey,
    solutionCode: config.solutionCode,
    dingAppId: config.dingAppId,
    agentId: config.agentId,
    sourceUrl,
    isIsv: config.isIsv,
    messageType: config.messageType
  });
  if (!res.Result) {
    alert(res.Message);
    return;
  }
  const nonce = res.Nonce;
  const timeStamp = res.TimeStamp;
  const signature = res.Signature;
  const mergedConfig: GlobalConfig = mergeLoginResponse(config, res);
  const globalConfig = await ddAuth({ nonce, timeStamp, signature }, mergedConfig);
  return globalConfig;
}
