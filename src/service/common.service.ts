import fetch from '@/config/fetch';
import Response = H3.Http.Response;
import Common = H3.Common;
/**
 * 获取钉钉signature
 */
export const getDingtalkSignature = ({
  corpId,
  appId,
  suiteKey,
  solutionCode,
  dingAppId,
  agentId,
  sourceUrl,
  isIsv,
  messageType
}) =>
  fetch<Common.LoginResponse>(
    '/Mobile/Mobile/AjaxInterface/',
    {
      CorpId: corpId,
      AppId: appId,
      AgentId: agentId,
      IsIsv: isIsv,
      SuiteKey: suiteKey,
      SolutionCode: solutionCode,
      IsvAgentId: dingAppId,
      SourceUrl: sourceUrl,
      AppCode: appId,
      MessageType: messageType
    },
    'post',
  );

/**
 * 根据免登授权码登录
 */
export const ddLogin = (
  code,
  corpId,
  appId,
  suiteKey,
  solutionCode,
  dingAppId,
  agentId,
  signature,
  isIsv,
) =>
  fetch<any>(
    '/Mobile/Mobile/SyncLogin/',
    {
      code,
      corpid: corpId,
      appid: appId,
      suitekey: suiteKey,
      solutionCode,
      dingAppId,
      agentid: agentId,
      signature,
      isIsv,
      appCode: appId,
    },
    'post',
  );

export const login = ({
  mobile, engineCode, token, dingId, dingtalkAccount, appCode, solutionCode,
}) => {
  const paramData = {
    mobile,
    engineCode,
    clusterTokenId: token,
    dingid: dingId,
    dingtalkaccount: dingtalkAccount,
    appCode,
    solutionCode,
  };
  return fetch<Common.LoginResponse>('/login/LoginByMobile', paramData, 'post');
};

export const getPreviewFileUrl = fileId =>
  fetch(`/Form/MobilePreView?attachmentId=${fileId}`, {}, 'post');

// 下载图片预览的uuid
// export const GetDownloadFileUUIDs = attachmentIds =>
//   fetch(`Form/GetDownloadFileUUIDs/?AttachmentIdStr=${attachmentIds}`, {}, 'post');
export const GetDownloadFileUUIDs = attachmentIds =>
  fetch('Form/GetDownloadingFileUUIDs', {
    PostData: JSON.stringify({
      AttachmentIdStr: attachmentIds,
    }),
  }, 'post');

// 到期提醒接口
export const getSolutionGoodsInfo = () => {
  return fetch(
    '/Mobile/MobileService/GetSolutionGoodsInfo',
    {},
    'GET',
  );
};

// export const loginByDingtalkAccount = (dingtalkAccount, engineCode, clusterTokenId) => {
//   const paramData = {
//     dingtalkAccount,
//     engineCode,
//     clusterTokenId,
//   };
//   return fetch('/login', paramData, 'post');
// };

/**
 * 价格调整通知
 */
export const PriceAdjust = () => {
  const params = {
    ActionName: 'UpdateRaisePriceReminder',
  };
  return fetch<Response<any>>('/Home/OnAction', {
    PostData: JSON.stringify(params),
  }, 'POST');
};
