// zyq;
import fetch from '@/config/fetch';
import Reponse = H3.Http.Response;
import App = H3.App;

// 请求后台首页app应用数据
export const getAppList = (AppCode: string = '', SolutionCode: string = '') =>
  fetch<Reponse<App.AppListReturnData>>(
    'Mobile/MobileService/OnAction',
    {
      PostData: JSON.stringify({
        ActionName: 'GetApps',
        SolutionCode,
        AppCode,
      }),
    },
    'POST',
  );


// 发送链接到PC端
export const sendQickEntryLink = () =>
  fetch<any>(
    'Mobile/MobileService/OnAction',
    {
      PostData: JSON.stringify({
        ActionName: 'SendQickEntryLink'
      }),
    },
    'POST',
  );

  // 引导完成
export const checkShowGuidance = () => {
  return fetch<any>(
    '/Guide/OnAction',
    {
      PostData: JSON.stringify({
        ActionName: 'CheckShowGuide',
        GuideType: 16
      }),
    },
    'POST',
  );
}


  // 引导完成
export const finishGuidance = () => {
  console.log('finishGuidance xxxxx');
  return fetch<any>(
    '/Guide/OnAction',
    {
      PostData: JSON.stringify({
        ActionName: 'FinishGuide',
        GuideType: 16
      }),
    },
    'POST',
  );
}


// 请求后台应用分组信息
export const getSchemaList = (AppCode: string) =>
  fetch<Reponse<App.AppContentReturnData>>(
    'Mobile/MobileService/OnAction',
    {
      PostData: JSON.stringify({
        ActionName: 'GetSchemas',
        AppCode,
      }),
    },
    'POST',
  );
// 获取表单列表id
export const getLastBizObjectIdBySchema = (SchemaCode: string) =>
  fetch<Reponse<H3.Guide.RecommendReturnData>>(
    '/Mobile/MobileService/OnAction/',
    {
      PostData: JSON.stringify({
        ActionName: 'GetLastBizObjectIdBySchema',
        SchemaCode,
      }),
    },
    'POST',
  );
// 获取推荐模板列表
export const getRecommendTemplates = () =>
  fetch<Reponse<H3.Guide.RecommendReturnData>>(
    '/Guide/OnAction',
    {
      PostData: JSON.stringify({
        ActionName: 'GetRecommendationList',
        PageSize: 4,
        PageIndex: 0,
      }),
    },
    'POST',
  );
// 获取推荐模板详情
export const getTemplateDetail = (TemplateCode: string) =>
  fetch<Reponse<H3.Guide.RecommendDetailReturnData>>(
    '/Guide/OnAction',
    {
      PostData: JSON.stringify({
        ActionName: 'GetTemplateDetail',
        TemplateCode,
      }),
    },
    'POST',
  );
// 获取推荐模板详情
export const installTemplate = (AppCode: string, IsTrial: boolean) =>
  fetch<any>(
    '/Guide/OnAction',
    {
      PostData: JSON.stringify({
        ActionName: 'InstallTemplate',
        AppCode,
        IsTrial,
      }),
    },
    'POST',
  );
// export const getStoreUrl = () =>
//   fetch<H3.App.GetStoreUrlReturnData>(
//     '/Mobile/MobileService/OnAction',
//     {
//       PostData: JSON.stringify({
//         ActionName: 'GetStoreUrl'
//       })
//     },
//     'POST'
//   );
export const searchSchema = (KeyWord: string, PageIndex: number, PageSize: number, SolutionCode: string, AppCode: string) =>
  fetch<H3.App.GetStoreUrlReturnData>(
    '/Mobile/MobileService/OnAction',
    {
      PostData: JSON.stringify({
        ActionName: 'SearchSchema',
        KeyWord,
        PageIndex,
        PageSize,
        SolutionCode: SolutionCode || '',
        AppCode: AppCode || '',
      }),
    },
    'POST',
  );
/**
 * 新增应用埋点
 */
export const addAppRequestLog = (InvocationActionName: string) =>
  fetch<any>(
    '/RequestLog/OnAction',
    {
      PostData: JSON.stringify({
        IsMobile: true,
        InvocationControllerName: 'MobileService/OnAction',
        InvocationActionName,
        ActionName: 'InvocationLog',
      }),
    },
    'POST',
  );

/**
 * 获取公告
 */
export const getGuide = (ActionName: string) =>
  fetch<any>(
    '/Guide/OnAction',
    {
      PostData: JSON.stringify({
        ActionName: ActionName,
      }),
    },
    'POST',
  );

/**
 * 移动端开启流程
 * @param { workflowCode} 表单编码
 */
export const startWorkFlow = (workflowCode: string) =>
  fetch<any>(
    `/lightapi/workflow/mobile/start/${workflowCode}`,
    {
      PostData: JSON.stringify({}),
    },
    'POST'
);
/**
 *  表单外链信息
 * @param { workflowCode} 表单编码
 */
export const getExternalform = (schemaCode: string) =>
  fetch<any>(
    `/lightapi/externalform/setting/${schemaCode}`,
    {
      PostData: JSON.stringify({})
    },
    'GET'
);

/**
 * 移动端关闭流程
 * @param { workflowCode} 表单编码
 */
export const closeWorkFlow = (workflowCode: string) =>
  fetch<any>(
    `/lightapi/workflow/mobile/close/${workflowCode}`,
    {
      PostData: JSON.stringify({}),
    },
    'PUT'
);

/**
 * 移动端 人数许可信息
*/
export const getAuthorizationInfo = () => {
  const params = {
    ActionName: 'GetLicenseInfo',
  };
  return fetch<any>('/Navigation/OnAction', {
    PostData: JSON.stringify(params),
  }, 'POST');
};


/**
 * 是否为自由流，开启外链分享
*/
export const getFormFreeFlow = (workflowCode: string = '') => {
  return fetch<any>(`/lightapi/workflow/isfreeflow/${workflowCode}`, {}, 'POST');
};