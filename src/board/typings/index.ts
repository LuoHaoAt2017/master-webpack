import { FormControlType } from './const';

/**
 * 数据对象状态
 */
export const enum BizObjectStatus {
  Draft = 0,
  Effective = 1,
  Running = 2,
  Canceled = 3
}

/**
 * 看板列字段的编辑权限
 */
export const enum FieldPermission {
  None = -1,
  Visible = 0, // 可见
  Editable = 1, // 可编辑
  Required =2, // 必填
}

/**
 * 数据显示模式
 */
export const enum DisplayMode {
  List = 0, // 表格
  Calendar = 1, // 日历
  Timeline = 2, // 时间轴
  Board = 3, // 看板
}

/**
 * 筛选条件类型
 *
 * @export
 * @enum {number}
 */
export enum FilterType {
  contains = 0, // 包含
  filetype = 1, // 文件
  empty = 2, // 未填写
  filled = 3, // 已填写
  range = 4, // 数据区间
  rangedate = 5, // 日期区间
  equal = 6 // 等于
}

/**
 * 未分类设置常量值
 */
export const UnclassifiedField = '__Default_Uncategory';

/**
 * 排序字段
 */
export declare interface IBoardSortColumn {
  FieldCode: string;
  Asc: boolean;
}

/**
 * 值范围
 */
interface IRange{
  min:any;
  max:any;
}

/**
 * 过滤字段,全部和表格统一数据结构
 */
export interface IBoardFilterColumn {
  columnId: string;
  operator: FilterType;
  value?: any;
  name?:any;
  range?:IRange;
}

/**
 * 看板显示字段列
 */
export interface IBoardDisplayColumn {
  Checked: boolean;
  FieldCode: string;
}

/**
 * 看板卡片图片结构
 */
export interface IBoardCardImage {
  name: string; // 图片名称
  thumbnail: string; // 缩略图地址
  url?: string; // 下载url
  size?: number;
  code?: string; // objectid
}

export interface IBoardCardUser {
  Name: string; // 用户名称
  ThumbnailUrl: string; // 用户缩略图
  ObjectId: string; // 唯一id
}

/**
 * 表单控件数据
 */
export interface IBoardControl {
  Type: FormControlType;
  DisplayName: string;
  FieldCode: string;
  Icon?: string;
  Options?: {[key: string]: any};
}
/**
 * 控件结构
 * 和表单视图保持筛选结构一致所需的控件结构
 * @export
 * @interface FormControl
 */
export interface FormControl {
  type: FormControlType;
  name: string;
  code: string;
  [key: string]: any;
}

/**
 * 看板视图数据模型
 */
export interface IBoardSettingDataModel {
  ObjectId?: string; // 看板视图唯一id
  SchemaCode?: string; // 表单编码
  // GroupCode?: string; // 分组字段编码
  BoardColumn?: string; // 分类字段
  BoardColumnType?: FormControlType; // 分类字段类型

  // Controls: IBoardControl[]; // 表单控件集合
  SortColumns?: IBoardSortColumn[]; // 排序字段
  DisplayColumns?: IBoardDisplayColumn[]; // 显示字段
  IsColumnExceed?: boolean; // 超过列数
  FilterColumns?: IBoardFilterColumn[]; // 显示字段
  CoverColumn?: string; // 卡片封面列
  IsShowTitle: boolean; // 是否显示标题
  BoardColumnInfos?: any[]; // 看班列数据
  Required?: boolean; // 分类字段是否是必填，必填时不能删除列
  IsCollapsed?: boolean; // 是否全局折叠
  IsFixedSide?: boolean;// 是否固定侧栏
  GroupColumn?: string; // 分组字段
  // GroupDefaultValue?:string;// 分组下选择的数据
  GroupConfig?: any;
  Colors?: IBoardColorSetting[];
  [key: string]: any;
};

/**
 * 看板视图设置
 */
export interface IBoardSettingModel {
  HasBoardSetting: boolean; // 是否启用看板视图
  Data: IBoardSettingDataModel;
  Controls:IBoardControl[];
  Permission: FieldPermission;
  SheetAction: {[key: string]: boolean};
  IsWorkflow: boolean;
  Filter:IBoardFilterColumn[];
};

/**
 * 看板显示字段设置
 */
export interface IBoardDisplaySetting {
  Columns: IBoardDisplayColumn[]; // 排序列
}

/**
 * 看板显示字段设置
 */
export interface IBoardFilterSetting {
  Columns: IBoardFilterColumn[]; // 筛选字段
}

/**
 * 看板显示字段设置
 */
export interface IBoardSortSetting {
  Columns: IBoardSortColumn[]; // 排序列
}

export interface IFormData {
  Code: string;
  cellValues: any;
}

/**
 * 单列表单数据
 */
export interface IBoardColumnRecord {
  Count: number; // 当前列记录总数

  Datas: IFormData[]; // 表单记录

  PageIndex: number;
}

/**
 * 看板视图表单记录数据模型
 */
export interface IBoardRecordModal {
  [key: string]: IBoardColumnRecord;
}

export interface IBoardColumnSetting {
  FieldCode: string; // 字段编码

  DisplayName?: string; // 显示名称

  IsSelected?: boolean; // 显示字段是否显示

  Asc?: boolean; // 排序字段升序还是降序

  FilterValue?: any; // 筛选值
}

export interface IBoardSetting {
  ObjectId:string;// ObjectId
  // BoardColumn: string; // 看班列分类字段
  // BoardColumnType: FormControlType; // 分类字段控件类型
  GroupColumn: string; // 分组字段
  // GroupDefaultValue: string;// 分组下选择的数据
  DisplayColumns: IBoardColumnSetting[]; // 显示字段
  // SortColumns: IBoardColumnSetting[]; // 排序字段
  FilterColumns: IBoardColumnSetting[]; // 筛选字段
  // SchemaCode: string; // 表单编码
  CoverColumn?: string; // 卡片封面列
  IsShowTitle?: boolean; // 是否显示标题
  IsCollapsed?:boolean; // 全部折叠与展开
  IsFixedSide?: boolean;// 分组是否固定左侧栏
  Colors: IBoardColorSetting[]; // 颜色设置
}

/**
 * 看板列信息
 */
export interface IBoardColumnInfo {
  ObjectId: string; // 唯一id
  SchemaCode: string; // 表单编码
  BoardColumn: string; // 分类字段
  ColumnValue: string; // 看板列值
  SortKey: number; // 排序码
  DisplayName: string; // 显示名称
  ImgUrl?: string; // 用户缩略图
  IsCollapsed?: boolean; // 列是否折叠
  IsNewColumn?: boolean; // 是否新增列
  [key: string]: any;
}

/**
 * 指定人员和部门返回给后台数据数据
*/
export interface ReassignBoard {
  ColumnValue: string;
  DisplayName: string;
  ImgUrl: string;
  [key: string]: any;
}

/**
 * 已经指定人员和部门的数据格式
 *
*/
export interface AssignBoardSelected{
  ObjectId: string;
  Name: string;
  PhotoUrl: string;
  Type: string;
  [key: string]: any;
}

/**
 * 人员和部门控件选中的数据格式
*/

export interface UnitSelected{
  department: string;
  label: string;
  photoUrl: string;
  type: string;
  value:string;
  [key: string]: any;
}

/**
 * 看板分组配置
*/
export interface IGroupConfig {
  DefaultValue: string;
  DateTimeFormat: number; // 是否需要定义枚举
}

/**
 * 分组字段下的每一项数据的格式
*/
export interface GroupColumnItem{
  value: string;
  name: string;
  [key: string]: any;
}

type FilterValue = string | number | string[] | null;

/**
 * 看板颜色设置规则
 *
 * @export
 * @interface IBoardColorSettingRule
 */
export interface IBoardColorSettingRule {
  id?: string; // 行唯一id
  columnId: string;
  operator: FilterType;
  range: {min: FilterValue ; max: FilterValue} | null;
  value: FilterValue;
  name: string;
}

/**
 * 看板颜色设置
 *
 * @export
 * @interface IBoardColorSetting
 */
export interface IBoardColorSetting {
  id?: string; // 行唯一id
  Value: string; // 颜色值
  Message: string; // 颜色说明
  Items: IBoardColorSettingRule[]; // 生效规则， 目前只支持并集
}

/**
 * 单独获取一条新增数据请求参数
 *
 * @export
 * @interface IBoardSingleDataRequest
 */
export interface IBoardSingleDataRequest {
  SchemaCode: string;
  BizObjectId: string;
  GroupColumn: string;
  GroupConfig: any;
  FilterItems: IBoardFilterColumn[];
}
