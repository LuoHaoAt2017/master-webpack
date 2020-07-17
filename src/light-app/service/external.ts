import lightAppFetch from './fetch';
import Response = H3.Http.LightAppResponse;
const externalform = 'lightapi/externalform';

/**
 * @description 请求数据分享短链
 * @param schemaCode 表单code
 * @param bizObjectId 表单id
 */
export const getShareUrl = (
    schemaCode: string = '',
    bizObjectId: string = '',
  ) => {
    return lightAppFetch<Response<any>>(`lightapi/externalform/shareshorturl/${schemaCode}/${bizObjectId}`,
    {},
    'get'
    );
  };

// 获取外链是否开启状态
export const getExternalStatus = (schemaCode: string = '') => {
  return lightAppFetch<Response<any>>(`${externalform}/setting/${schemaCode}`, {}, 'get');
};

// 获取外链短链地址
export const getExternalShortUrl = (schemaCode: string = '') => {
  return lightAppFetch<Response<any>>(`${externalform}/fillformshorturl/${schemaCode}`, {}, 'get');
};

// 开启关闭外链
export const switchfillform = (params) => {
  const { schemaCode, status } = params;
  return lightAppFetch<Response<any>>(`${externalform}/switchfillform/${schemaCode}/${status}`, {}, 'put');
};


// 获取公开查询配置
export const getOpenQuerySetting = (schemaCode) => {
  const url = `/lightapi/openquery/setting/${schemaCode}`;
  return lightAppFetch<Response<any>>(url, {}, 'get');
};

/**
 * 获取公开查询对外开放配置
 * @param schemaCode
 */
export const getPublicOpenQuerySetting = (schemaCode) => {
  const url = `/lightapi/openquery/setting/public/${schemaCode}`;
  return lightAppFetch<Response<any>>(url, {}, 'get');
};

/**
 * 验证查询密码
 * @param params
 */
export const validQueryPassword = (schemaCode: string, password: string) => {
  const url = `/lightapi/openquery/valid/${schemaCode}/${password}`;
  return lightAppFetch<Response<any>>(url, {}, 'post');
};

// 获取公开查询查询列
export const getQueryColumns = (sheetCode) => {
  const url = `/lightapi/sheets/getcolumns/${sheetCode}`;
  return lightAppFetch<Response<any>>(url, {}, 'get');
};

// 根据查询条件获取数据
export const getQueryData = (schemaCode: string, pageIndex: number, pageSize: number, searchParams : any) => {
  const url = '/lightapi/openquery/data';
  const params = {
    schemaCode,
    pageIndex,
    pageSize,
    searchParams,
  };
  return lightAppFetch<Response<any>>(url, params, 'post');
};
