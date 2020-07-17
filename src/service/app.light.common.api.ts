import axios from '@/config/fetch-board';
import fetch from '@/config/fetch';
import Reponse = H3.Http.Response;

export const checkGuide = () => {
  return axios.get<any>('/lightapi/guide/check/13');
};

export const getAppTemplates = (pageIndex:number, pageSize: number) => {
  return axios.get<any>(`/lightapi/appstore/templates/${pageIndex}/${pageSize}`);
};

/**
 * 获取分类模板
 */
export const getTemplateCategories = () => {
  return axios.get<any>('/lightapi/appstore/templateCategories');
};

/**
 * 模板分类搜索
*/
export const getSearchTemplates = (searchKey, pageIndex, pageSize) => {
  return axios.get<any>(`/lightapi/appstore/searchTemplates/${searchKey}/${pageIndex}/${pageSize}`);
};

/**
 * 获取模板详情
 * @param templateCode
 */
export const getTemplateDetail = (templateCode: string) => {
  return axios.get<any>(`/lightapi/appstore/templateDetail/${templateCode}/false`);
};


export const installTemplate = (AppCode: string, IsTrial: boolean, BusinessScene?: string) => {
  const params = {
    ActionName: 'InstallTemplate',
    AppCode,
    IsTrial,
  };
  return fetch<Reponse<any>>('/Guide/OnAction', {
    PostData: JSON.stringify(params),
  }, 'POST');
};
