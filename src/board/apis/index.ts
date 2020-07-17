import axios from '@/config/fetch-board';
import { IBoardColumnInfo, IBoardSingleDataRequest } from '../typings';
import { FormControlType } from '../typings/const';

/**
 * 初始化视图
 * @param schemaCode
 */
export const initData = (schemaCode: string) => {
  return axios.get<any>(`/lightapi/Board/InitData/${schemaCode}`);
};

/**
 * 获取下拉框或复选框已选数据源，筛选用
 */
export const getFilterSource = (schemaCode: string, fieldCode: string) => {
  return axios.get<any>(`/lightapi/Board/InitData/${schemaCode}/${fieldCode}`);
};

/**
 * 拖动卡片更新表单对应字段值
 */
export const updateFormValue = (data: {BoardId: string; ColumnCode: string; SchemaCode: string;
   BizObjectId: string; TargetColumnValue: string; TargetPrevBizObjectId: string; TargetNextBizObjectId: string;}) => {
  return axios.post<any>('/lightapi/BoardColumns/SetValue', data);
};

/**
 * 获取看板列数据
 */
export const getBoardData = (data: { SchemaCode: string; ColumnCode: string;
  ColumnValue: string[];}) => {
  return axios.post<any>('/lightapi/Board/Datas', data);
};

/**
 * 获取新创建表单数据
 * @param req
 */
export const getNewForm = (req: IBoardSingleDataRequest) => {
  return axios.post<any>('/lightapi/Board/SingleData', req);
};

/**
 * 分类列排序
 * @param data
 */
export const boardColumnSort = (boardId: string, data: IBoardColumnInfo[]) => {
  return axios.put<any>(`/lightapi/BoardColumns/${boardId}`, data);
};

/**
 * 删除一列看板列
 * @param id
 */
export const deleteColumn = (id: string) => {
  return axios.delete<any>(`/lightapi/BoardColumns/${id}`);
};

/**
 * 添加看板列
 * @param id
 * @param data
 */
export const addColumn = (id: string, data: IBoardColumnInfo) => {
  return axios.post<any>(`/lightapi/BoardColumns/${id}`, data);
};

/**
 * 获取下拉框或复选框已选数据源，筛选用,100/0表示返回100条，第一页
 */
export const getSelectOrUserSource = (schemaCode: string, fieldCode: string, pageIndex:number = 0) => {
  return axios.get<any>(`/lightapi/sheets/${schemaCode}/column/${fieldCode}/100/${pageIndex}`);
};

/**
 * 筛选信息保存，这里直接用了表格的接口
 * @param data
 */
// export const setFilters = (data, schemaCode) => {
//   return axios.put<any>(`/lightapi/userconfigs/${schemaCode}`, data);
// };
export const setFilters = (filter, BoardGroup, SortConfig, schemaCode) => {
  const data = {
    filter: filter,
    BoardGroup: BoardGroup,
    BoardSort: SortConfig,
  };
  return axios.put<any>(`/lightapi/userconfigs/${schemaCode}`, data);
};

/**
 * 获取分组字段的值
*/
export const getGroupColumn = (data) => {
  return axios.post<any>('/lightapi/BoardColumns/GroupColumn', data);
};

/**
 * 选择分类字段后初始化看板设置
 * @param data
 */
export const updateBoard = (data) => {
  return axios.put<any>('/lightapi/Board', data);
};

// 切换视图更改主视图
export const changeDisplayMode = (params: {sheetCode: any; defaultDisplayMode: number }) => {
  const { sheetCode, defaultDisplayMode } = params;
  return axios.post<any>(`/lightapi/sheets/view/${sheetCode}/${defaultDisplayMode}`, {});
};
