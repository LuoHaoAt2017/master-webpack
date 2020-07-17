import { equals } from '@/board/utils/rule'

/**
 * 统计状态
 */
export enum SummaryType {
  none = 0, // 未统计
  filled = 1, // 已填写
  empty = 2, // 未填写
  sum = 3, // 求和
  average = 4, // 平均值
  max = 5, // 最大值
  min = 6 // 最小值
}

export const SummaryTitleMap = {
  0: '不统计', // 未统计
  1: '已填写', // 已填写
  2: '未填写', // 未填写
  3: '求和', // 求和
  4: '平均值', // 平均值
  5: '最大值', // 最大值
  6: '最小值', // 最小值
}


/**
 * 过滤属性值类型
 */
export enum FilterAttributeType {
  String = 'filterString',
  IsFilled = 'filterIsFilled',
  MultiSelect = 'filterMutilSelect',
  SingleSelect = 'filterSingleSelect',
  RangeDate = 'filterRangeDate',
  RangeNumber = 'filterRangeNumber'
}

/**
 * 表单筛选状态
 */
export enum TableFilterType {
  contains = 0, // 包含、模糊匹配
  filetype = 1, // 文件
  empty = 2, // 未填写
  filled = 3, // 已填写
  range = 4, // 数据区间
  rangedate = 5, // 日期区间
  equal = 6, // 精确匹配
}

/**
 * 排序label值
 */
export enum SortLabel{
  up = '升序',
  down = '降序'
}

/**
 * 表单排序状态
 */
export enum TableSortType {
  Ascending = 0, // 升序
  Descending = 1, // 降序
  Unspecified = -1 // 未指定
}

/**
 * 数据列表流程数据状态
 */
export const workflowData = {
  '0': {
    name: '草稿',
    tag: 'status_0'
  },
  '1': {
    name: '已生效',
    tag: 'status_1'
  },
  '2': {
    name: '进行中',
    tag: 'status_2'
  },
  '3': {
    name: '已取消',
    tag: 'status_3'
  }
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
