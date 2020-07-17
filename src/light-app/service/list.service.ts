import lightAppFetch from './fetch';
import Response = H3.Http.LightAppResponse;
import { SheetDataListReturnData } from '../typings/list';

/**
 * @description 请求表单数据列表和数据搜索列表
 * @param sheetCode 表单code
 * @param pageSize 每页请求数量
 * @param pageIndex 从第几页开始（起始位为0）
 * @param keyValue 搜索关键字
 */
export const getDataList = (sheetCode: string, pageSize: number, pageIndex: number, keyValue: string) =>
lightAppFetch<Response<SheetDataListReturnData>>(
    `/lightapi/mobile/formlist/${sheetCode}/${pageSize}/${pageIndex}?keyword=${keyValue}`,
    {},
    'get'
  );

/**
 * @description 列表过滤、排序、统计
 * @param sheetCode 表单code
 * @params filter、summaries、summaries、meta
 */
// export const getDataListfilter = (data) => {
//   const { sheetCode, params } = data;
//   return lightAppFetch<Response<SheetDataListReturnData>>(
//     `/lightapi/sheets/${sheetCode}/filter`,
//     params,
//     'put'
//   );
// }
export const getDataListfilter = (data) => {
  const { sheetCode, params } = data;
  return lightAppFetch<Response<SheetDataListReturnData>>(
    `/lightapi/userconfigs/${sheetCode}/`,
    params,
    'put'
  );
}

/**
 * @description 统计结果查询接口
 * @param sheetCode 表单code
 */
export const getStatistics = (sheetCode: string) => {
  return lightAppFetch(
    `/lightapi/sheets/${sheetCode}/summary`,
    {},
    'get'
  );
}

/**
 * @description 获取过滤数据
 * @param sheetCode 表单id
 * @param colId 列id 
 */
export const getColFilterById = (sheetCode: string, colId: string, pageSize: number, pageIndex: number, keyword?: string) => {
  // 处理特殊字符如'+'等
  const encodeKeyWord = encodeURIComponent(keyword);
  return lightAppFetch(
    `/lightapi/sheets/${sheetCode}/column/${colId}/${pageSize}/${pageIndex}?keyword=${encodeKeyWord}`,
    {},
    'get'
  );
}

// 切换视图更改主视图
export const changeDisplayMode = (params: {sheetCode: any; defaultDisplayMode: number }) => {
  const { sheetCode, defaultDisplayMode } = params;
  return lightAppFetch<Response<any>>(
    `/lightapi/sheets/view/${sheetCode}/${defaultDisplayMode}`,
    {},
    'post',
  );
};
