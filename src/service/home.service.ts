import fetch from '@/config/fetch';
import Response = H3.Http.Response;
import Home = H3.Home;

/**
 * 请求后台首页app应用数据
 */
export const getHomeDatas = ({ SolutionCode, AppCode, PageSize, PageIndex, IsInit, TimeStamp, RecentCodes }:{
  SolutionCode?: string, AppCode?: string, PageSize?: number, PageIndex?: number, IsInit?: boolean, TimeStamp?: number, RecentCodes?: string,
}) => fetch<Response<Home.PageData>>('Mobile/MobileService/OnAction', {
  PostData: JSON.stringify({
    ActionName: 'GetHomeDatas',
    SolutionCode,
    AppCode,
    PageSize,
    PageIndex,
    IsInit,
    TimeStamp,
    RecentCodes,
  }),
}, 'POST');

/**
 *  请求单页应用首页代办数目
 */
export const getMyWorkflow = (AppCode: string) => fetch<Response<Home.WorkflowData>>('Mobile/MobileService/OnAction', {
  PostData: JSON.stringify({
    ActionName: 'GetMyWorkflow',
    AppCode,
  }),
}, 'POST');

/**
 *  保存最近使用的表单，同步快速新增数据
 */
export const saveRecentApps = (RecentCodes) => fetch<Response<null>>('Mobile/MobileService/OnAction', {
  PostData: JSON.stringify({
    ActionName: 'SaveRecentActivity',
    RecentCodes,
  }),
}, 'POST');

// export const getImgUrl = (data) => fetch<Response<null>>('Mobile/MobileService/OnAction', {
//   PostData: data,
// }, 'POST');
