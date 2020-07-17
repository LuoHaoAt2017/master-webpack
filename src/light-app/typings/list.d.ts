import { SummaryType } from '@/light-app/config/list-const';

// 表单数据列表和搜索返回数据接口
export interface SheetDataListReturnData {
  appCode: string;
  displayName: string;
  rows: object[];
  cols: Column[];
  scopeTypes: number;
  isWorkflow: boolean;
  viewData: ViewData;
  startTimePropertyName: string;
  axis: string;
  axisSortDirection: number;
  total: number;
}

export interface Base {
}

export interface ViewData {
  /** 筛选视图 */
  filter: FilterItem[];
  /** 排序视图 */
  sortBy: SortView;
  meta: {
    /** 行高 */
    rowHeight: RowHeightType;
    /** 固定列 */
    fixedColumns?: string[];
  };
  /** 分页视图 */
  pagination: Pagination;
}

/** 分页数据 */
export interface Pagination {
  /** 总行数 */
  total: number;
  /** 当前页数 */
  currentPage: number;
  /** 总页数 */
  pageCount: number;
  /** 每页行数 */
  pageSize: number;
}

/** 筛选数据 */
export interface FilterView {
  /** 筛选条件关系 */
  // conjunction: 'and' | 'or';
  /** 筛选项 */
  filterItem: FilterItem[];
}

/** 排序类型 */
type SortType = 'asc' | 'desc';
/** 筛选类型 */
type OperatorType = 'contains' | 'filetype' | 'empty' | 'filled' | 'range' | 'rangedate';
/** 行高类型 */
type RowHeightType = 'short' | 'medium' | 'tall' | 'extratall';

interface FilterItem {
  id: string;
  /** 筛选列Id */
  columnId: string;
  /** 筛选操作符 */
  operator: OperatorType;
  /** 筛选名称 */
  name?: any;
  /** 筛选值 */
  value?: any;
  /** 筛选范围 */
  range?: { max: number, min: number }
}

interface SortView {
  /** 排序列Id */
  columnId: string;
  /** 排序类型 */
  type: SortType;
  /** 排序参考值 */
  byValue?: any[];
}

export interface ViewSearchParams {
  sheetCode: string;
  filter?: FilterItem[];
  sortBy?: SortView | null;
}

// 列数据类型
export interface Column<T extends Base = Base> {
  // 列/字段ID，对应原氚云dataField
  code: string;
  // 名称，对应原氚云displayName
  displayName: string;
  // 列类型，对应原氚云controlKey
  colType: number;
  // 列属性/控件属性
  controlOptions?: ControlOptions;
  // 列显示/隐藏
  visibility: boolean;
  // 列宽
  width: number;
  // 表单id
  sheetCode: string;
  // 统计分析数据
  summary?: Summary | Summary[];
  // 排序
  sortRank: number;
}
// 统计缝隙
export interface Summary {
  type: SummaryType;
  text?: string;
  value: number | string;
}

export interface ControlOptions {
  DataField: any;
  DecimalPlaces: number;
  Required: boolean;
  ShowMode: number;
}

// 统计结果查询接口
