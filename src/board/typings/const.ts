/**
 * 表单控件类型
 */
export enum FormControlType {
  // 基础控件
  /**
   * 单文本
   */
  FormTextBox = 1,

  /**
   * 长文本
   */
  FormTextArea = 2,

  /**
   * 日期
   */
  FormDateTime = 3,

  /**
   * 数值
   */
  FormNumber = 4,

  /**
   * 单选
   */
  FormRadioButtonList = 5,

  /**
   * 复选
   */
  FormCheckboxList = 6,

  /**
   * 下拉
   */
  FormDropDownList = 7,

  /**
   * 是否控件
   */
  FormCheckbox = 8,

  /**
   * 地址
   */
  FormAreaSelect = 9,

  /**
   * 位置
   */
  FormMap = 10,

  /**
   * 人员多选
   */
  FormMultiUser = 11,

  /**
   * 人员单选
   */
  FormUser = 12,

  /**
   * 部门单选
   */
  FormDepartment = 13,

  /**
   * 部门多选
   */
  FormMultiDepartment = 14,

  /**
   * 附件
   */
  FormAttachment = 15,

  /**
   * 图片
   */
  FormPhoto = 16,

  // 布局控件
  /**
   * 分组标题
   */
  FormGroupTitle = 101,

  /**
   * 布局控件（一行两列）
   */
  FormLayout = 102,

  /**
   * 描述说明控件
   */
  FormDescription = 103,

  /**
   * 子表
   */
  FormGridView = 104,

  // 系统控件
  /**
   * 系统-流水号
   */
  FormSeqNo = 201,

  /**
   * 创建人
   */
  FormCreater = 202,

  /**
   * 拥有者
   */
  FormOwner = 203,

  /**
   * 所属部门
   */
  FormOwnerDepartment = 204,

  /**
   * 创建时间
   */
  FormCreatedTime = 205,

  /**
   * 修改时间
   */
  FormModifiedTime = 206,

  /**
   * 系统字段-创建人、创建时间、修改时间
   */
  FormLabel = 207,

  /**
   * 流程字段
   */
  WorkFlow = 208,

   /**
   * 当前节点
   */
  ActivityName = 209,

   /**
   * 当前处理人
   */
  Participant = 210,

  // 高级控件
  /**
   * 关联表单
   */
  FormQuery = 301,

  /**
   * 关联多选
   */
  FormMultiQuery = 302,

  /**
   * 关联属性
   */
  FormAssociateProperty = 303,

  /**
   * 公式型控件
   */
  FormFormula = 304,

  /**
   * 按钮
   */
  FormButton = 305,
  // 手写签名
  FormHandSign = 306
}

export const filterEmojiExp = /[^\u4e00-\u9fa5a-zA-Z\d,~·`!！@#￥$%^……&*()-=_+——（）【】[\]{}\\、|；;:：’'"“”,，《<.。》>/、？? ]/g;

/**
 * 表单筛选状态
 */
export enum TableFilterType {
  contains = 0, // 包含
  filetype = 1, // 文件
  empty = 2, // 未填写
  filled = 3, // 已填写
  range = 4, // 数据区间
  rangedate = 5 // 日期区间
}

export const FormulaType = {
  Equal: 'Equal', // 等于
  NotEqual: 'NotEqual', // 不等于
  StartWith: 'StartWith', // 开头为
  In: 'In', // 包含
  NotIn: 'NotIn', // 不包含
  None: 'None', // 为空
  NotNone: 'NotNone', // 不为空

  Range: 'Range', // 范围
  Above: 'Above', // 大于
  NotBelow: 'NotBelow', // 大于等于
  Below: 'Below', // 小于
  NotAbove: 'NotAbove', // 小于等于
};

/**
 * 业务数据类型
 */
export enum BizDataType {
  /// 空值
  Unspecified= -1,
  /// 逻辑数组型
  BoolArray= 0,
  /// 逻辑型
  Bool= 1,
  /// 时间数组型
  DateTimeArray= 4,
  /// 日期型
  DateTime= 5,
  /// 双精度数组型
  DoubleArray= 6,
  /// 双精度数值型
  Double= 7,
  /// 整数数组型
  IntArray= 8,
  /// 整数
  Int= 9,
  /// 长整型数组型
  LongArray= 10,
  /// 长整数
  Long= 11,
  /// 字符串数组型
  StringArray= 12,
  /// 长文本
  String= 13,
  /// 短文本
  ShortString= 14,
  /// 签名
  // Sign = 15,
  /// 链接
  HyperLink= 16,
  /// 审批
  Comment= 17,
  /// 二进制流
  ByteArray= 20,
  /// 图片类型
  Image= 23,
  /// 未指定类型的附件
  Attachment= 24,
  /// 时间段型
  TimeSpan= 25,
  /// 参与者（单人）
  SingleParticipant= 26,
  /// 参与者（多人）
  MultiParticipant= 27,
  /// Html
  Html= 30,
  /// 对象类型
  Object= 31,
  /// Xml
  Xml= 32,
  /// Guid
  Guid= 33,
  /// Guid数组
  GuidArray= 34,
  /// Decimal
  Decimal= 35,
  /// Decimal数组
  DecimalArray= 36,
  /// 业务对象
  BizObject= 40,
  /// 业务对象数组
  BizObjectArray= 41,
  /// 业务结构
  BizStructure= 42,
  /// 业务结构数组
  BizStructureArray= 43,
  /// 关联查询
  Association= 50,
  // 关联查询多表单
  AssociationArray= 51,
  /// 地图
  Map= 55,
  // 地址
  Address= 56,
  // 公式型控件
  Formula=57
};

/**
 * 新氚云控件icon对应关系
 */
export const IconMap = {
  FormTextBox: 'single-line-text-3',
  FormTextArea: 'text-multiline-3',
  FormDateTime: 'calendar-o-3',
  FormNumber: 'number-3',
  FormDropDownList: 'drop-down-o-3',
  FormCheckboxList: 'check-square-o-3',
  FormAreaSelect: 'address-o-3',
  FormMap: 'position-o',
  FormUser: 'user-o-3',
  FormMultiUser: 'team-o-3',
  FormDepartment: 'department-single-se-3',
  FormMultiDepartment: 'department-multiple-o-3',
  FormAttachment: 'attachment-3',
  FormPhoto: 'picture-o-3',
  FormQuery: 'form-related-manycho-3',
  FormCreater: 'founder-o-3',
  FormOwner: 'owner-o-3',
  FormOwnerDepartment: 'process-o-3',
  FormCreatedTime: 'time-o-3',
  FormModifiedTime: 'field-time-3',
  FormSeqNo: 'barcode-3',
  FormGridView: 'child-table-o-3',
}; // 控件图标

/**
 *看板列新增字段默认 options
 *必填 Permission：2
*/
export const AddFieldControlOptions = {
  FormDropDownList: { DefaultItems: [], DefaultValue: [], Permission: 1 }, // '选项1', '选项2', '选项3'
  FormUser: { UnitSelectionRange: '', SelectionRanges: null, DefaultValue: '', Permission: 1 },
  FormCreater: {},
  FormOwner: { UnitSelectionRange: '', DefaultValue: '' },
  FormDepartment: { UnitSelectionRange: '', SelectionRanges: null, DefaultValue: '', Permission: 1 },
  FormOwnerDepartment: { UnitSelectionRange: '', SelectionRanges: null, DefaultValue: '', Permission: 1 },
};

/**
 * 看板列新增和选择的控件类型转化
 * 下拉框 0 其他（人员和部门）为 1
*/
export const ColumnTypeTransform = {
  FormDropDownList: 0, //
  FormUser: 1,
  FormCreater: 1,
  FormOwner: 1,
  FormDepartment: 1,
  FormOwnerDepartment: 1,
};

/**
 * 看板列的组件
 * Select 选择字段
 * Create 新增字段
*/
export const BoardColumnComponent = {
  Select: 'select-board-col',
  Create: 'create-field-col',
};

export enum ViewType {
  List, // 列表
  Calendar, // 日历

  Timeline, // 时间戳

   Board, // 看板
};

export const allViewType = [ViewType.List, ViewType.Calendar, ViewType.Timeline, ViewType.Board];

export const viewRouter = {
  [ViewType.List]: 'sheet',
  [ViewType.Board]: 'board',
};

/**
 * 看板事件
 */
export const boardEvent = {
  BOARD_REMOVE: 'removeBoard',
  SHOW_BOARD_COL: 'showBoardCol',
  SELECT_COLUMN_NAME: 'selecColumnName',
  SHOW_SORT_FIELD: 'showSortField',
  SORT_CHANGE: 'sortChange',
  FIXED_SIDE_CHANGE: 'fixedSideChange',
  SHOW_GROUP_MODAL: 'showGroupModal',
  BOARD_COLUMN_REMOVE: 'Board_Column_Remove', // 删除列
  BOARD_COLUMN_REFRESH: 'Board_Column_Refresh', // 列数据刷新
  BOARD_COLUMN_RESET: 'Board_Column_Reset', // 列重置
  SHOW_DISPLAY: 'showDisplay',
  SHOW_FILTER: 'showFilter',
  FILTER_CHANGE: 'filterChange',
  VIEW_TOGGLE: 'view_toggle',
  SHOW_COLOR: 'showColor',
  BOARD_COLOR_SETTING: 'boardColorSetting',
  Enable_Board: 'enableBoard', // 启用看板视图
  Scroll_Card_Up: 'scrollCardUp', // 向上滚动选中列卡片
  Scroll_Card_Down: 'scrollCardDown', // 向下滚动选中列卡片
  Scroll_Card_Top: 'scrollCardTop', // 向上滚动选中列到顶部
  Stack_Sort: 'stackSort', // 排序字段变化，看板列排序
};

export const CtrlIcons = {
  1: 'iconsingle-line-text',
  2: 'icontext-multiline',
  3: 'iconcalendar-o',
  4: 'iconnumber',
  5: '',
  6: 'iconcheck-square-o',
  7: 'icondrop-down-o',
  8: 'iconcheck-square-o',
  9: 'iconaddress-o',
  10: 'iconget-address-o',
  11: 'iconteam-o',
  12: 'iconuser-o',
  13: 'icondepartment-single-se',
  14: 'icondepartment-multiple-o',
  15: 'iconattachment',
  16: 'iconpicture-o',
  201: 'iconbarcode-o',
  202: 'iconfounder-o',
  203: 'iconowner-o',
  204: 'iconprocess-o',
  205: 'icontime-o',
  206: 'iconfield-time',
  301: 'iconform-related-manycho',
};
export enum ExpType {// 看板-筛选-表达式类型，与表格视图保持一致
  包含= 0,
  文件类型= 1,
  为空= 2,
  不为空= 3,
  范围= 4,
  日期范围 = 5,
  等于 = 6,
  Unspecified= -1
};

// 看板-筛选用到的
// 单行文本、多行文本
const TextTypeBoard = [ExpType.包含, ExpType.为空, ExpType.不为空];

// 数字ExpType.等于,
const NumberTypeBoard = [ExpType.范围, ExpType.为空, ExpType.不为空];

// 日期
const DateTypeBoard = [ExpType.等于, ExpType.日期范围, ExpType.为空, ExpType.不为空];

// 单选、下拉、复选
const SelectTypeBoard = [ExpType.包含, ExpType.为空, ExpType.不为空];

// 人员单选、部门单选
const UnitSelectTypeBoard = [ExpType.包含, ExpType.为空, ExpType.不为空];

// 人员多选、部门多选
const MultipleUnitSelectTypeBoard = [ExpType.包含, ExpType.为空, ExpType.不为空];

// 拥有者，创建人，流水号
const SysBoard = [ExpType.包含];

// 创建时间，修改时间
const SysTimeBoard = [ExpType.等于, ExpType.日期范围];

// 地址
const AddressTypeBoard = [ExpType.包含, ExpType.为空, ExpType.不为空];

// 关联表单
const FormBoard = [ExpType.包含, ExpType.为空, ExpType.不为空];

export const ExpTypeSource = { // 看板-筛选设置所用的表达式对应表
  [FormControlType.FormTextBox]: TextTypeBoard,
  [FormControlType.FormTextArea]: TextTypeBoard,
  [FormControlType.FormNumber]: NumberTypeBoard,
  [FormControlType.FormDateTime]: DateTypeBoard,
  [FormControlType.FormRadioButtonList]: SelectTypeBoard,
  [FormControlType.FormDropDownList]: SelectTypeBoard,
  [FormControlType.FormUser]: UnitSelectTypeBoard,
  [FormControlType.FormDepartment]: UnitSelectTypeBoard,
  [FormControlType.FormCheckboxList]: SelectTypeBoard,
  [FormControlType.FormMultiUser]: MultipleUnitSelectTypeBoard,
  [FormControlType.FormMultiDepartment]: MultipleUnitSelectTypeBoard,
  [FormControlType.FormAreaSelect]: AddressTypeBoard,
  [FormControlType.FormOwner]: SysBoard,
  [FormControlType.FormCreater]: SysBoard,
  [FormControlType.FormSeqNo]: SysBoard,
  [FormControlType.FormOwnerDepartment]: SysBoard,
  [FormControlType.FormCreatedTime]: SysTimeBoard,
  [FormControlType.FormModifiedTime]: SysTimeBoard,
  [FormControlType.FormQuery]: FormBoard,
  [FormControlType.FormMap]: AddressTypeBoard,
};

export const DateEqualSource = [{
  value: '0',
  label: '今天',
}, {
  value: '1',
  label: '昨天',
}, {
  value: '2',
  label: '本周',
}, {
  value: '3',
  label: '上周',
}, {
  value: '4',
  label: '本月',
}, {
  value: '5',
  label: '上月',
}, {
  value: '6',
  label: '今年',
}, {
  value: '7',
  label: '去年',
}];

/**
 * 分组的日期字段的格式
 * Unspecified 未指定
 * Year 年格式 yyyy
 * Month 月格式 yyyy-mm
 * Day 日格式 yyyy-mm-dd
*/
export const BoardGroupDateFormat = {
  Unspecified: 0,
  Year: 1,
  Month: 2,
  Day: 3,
};

/**
 * 分组选择了 所有记录
*/
export const BoardGroupAllValue = '__All__';
