// import { FormControlType as formControlType} from './form-control-type';

/**
 * 表单筛选状态
 */
export enum TableFilterType {
  contains = 0, // 包含
  filetype = 1, // 文件
  empty = 2, // 未填写
  filled = 3, // 已填写
  range = 4, // 数据区间
  rangedate = 5, // 日期区间
  equal = 6 // 等于
}

export const FormulaType = {
  Equal: 'Equal', // 等于
  NotEqual: 'NotEqual', // 不等于
  StartWith: 'StartWith', // 开头为
  In: 'In', // 包含
  NotIn: 'NotIn', // 不包含
  None: 'None', // 为空
  NotNone: 'NotNone', // 不为空
  Match: 'Match', // 模糊匹配

  Range: 'Range', // 范围
  Above: 'Above', // 大于
  NotBelow: 'NotBelow', // 大于等于
  Below: 'Below', // 小于
  NotAbove: 'NotAbove', // 小于等于
}

// export enum ValueType {
//   String = 'string',
//   Number = 'number',
//   Date = 'date',
//   Image = 'image',
//   File = 'file',
//   GUId = 'guid',
//   USER = 'user',
//   DEPART = 'depart'
// }

// export enum ColType {
//   FormTextBox,
//   FormTextArea
// }

// export const valueTypeMap = {
//   FormTextBox: 'string',
//   FormTextArea: 'string',
//   FormUser: 'user',
//   FormPhoto: 'photo',
//   FormDepartment: 'department',
//   FormGridView: 'subtable',
//   FormNumber: 'number',
//   FormDropDownList: 'dropdown',
//   FormCheckboxList: 'checkbox',
//   FormRadioButtonList: 'radio',
//   FormAttachment: 'attachment',
//   FormAreaSelect: 'area',
//   FormCreatedTime: 'date',
//   FormModifiedTime: 'date',
//   FormDateTime: 'date'
// };

export enum TableCellTypes {
  FormTextBox = 'FormTextBox',
  FormTextArea = 'FormTextArea',
  FormUser = 'FormUser',
  FormMap = 'FormMap',
  FormPhoto = 'FormPhoto',
  FormDepartment = 'FormDepartment',
  FormGridView = 'FormGridView',
  FormNumber = 'FormNumber',
  FormDropDownList = 'FormDropDownList',
  FormCheckboxList = 'FormCheckboxList',
  // FormRadioButtonList = 'FormRadioButtonList',
  FormMultiDepartment = 'FormMultiDepartment',
  FormCreater = 'FormCreater',
  FormOwner = 'FormOwner',
  FormAttachment = 'FormAttachment',
  FormAreaSelect = 'FormAreaSelect',
  FormCreatedTime = 'FormCreatedTime',
  FormModifiedTime = 'FormModifiedTime',
  FormDateTime = 'FormDateTime',
  FormQuery = 'FormQuery',
  FormMultiUser = 'FormMultiUser',
  FormOwnerDepartment = 'FormOwnerDepartment',
  FormSeqNo = 'FormSeqNo',
  WorkFlow = 'WorkFlow',
  ActivityName = 'ActivityName',
  Participant = 'Participant',
}

// 默认选择框id
export const DEFAULT_CHECKBOX_ID = 'tableCheckBox';

// 默认添加列id
export const DEFAULT_COLUMN_CREATE_ID = 'createColumn';

export const CHECKBOX_COL = {
  id: DEFAULT_CHECKBOX_ID,
  left: 0,
  width: 40,
  visibility: true,
  summary: null,
  sheetCode: '',
  leftHide: false,
  name: '',
  colType: ''
};
/**
 * 控件属性值类型
 */
export enum AttributeType {
  Boolean, // 开关
  String, // 输入框
  Select, // 下拉选项框
  Number, //Number
  Date, // 日期
  CheckboxOption, // 多选
  RadioOption, // 单选
  Modal, // 弹窗
  UserOrg, // 人员部门
  Mode, // 单行文本格式
  Tree,
  CheckboxGroup // 验证
}
/**
 * 弹窗属性枚举
 *  */
export enum ModalAttributeType {
  // 填充规则
  FillRule = 'fillRule'
}

export enum UserOrgAttributeType {
  // 人员
  User = 'User',
  Org = 'Org',
  MultiOrg = 'MultiOrg',
  MultiUser = 'MultiUser'
}

/**
 * 关联表单类型
 */
export enum AssociationNodeType {
  AppPackage = 190, // 应用程序
  FormModule = 200, // 列表模块
  WorkflowModule = 210, // 流程列表模块
  ReportModule = 220, // 报表模块
  GroupModule = 230, // 节点分组
  SingletonModule = 240 // 表单模块（无列表，单独一行）
}

export enum FormStatus {
  Create = 'create',
  Edit = 'edit'
}
export enum ControlStatus {
  Create = 'create',
  Edit = 'edit',
  DownAdd = 'downAdd'
}

export const DefaultFormControls = {
  Key: '',
  ParentKey: '',
  Options: {
    InputByScan: false,
    Mode: 'Normal',
    NoRepeat: false,
    ScanUpdateEnable: false,
    DisplayName: '单行文本',
    DataField: '',
    Permission: 1
  },
  Type: 1,
  ChildControls: []
};

export const filterEmojiExp = /[^\u4e00-\u9fa5a-zA-Z\d,~·`!！@#￥$%^……&*()-=_+——（）【】[\]{}\\、|；;:：’'"“”,，《<.。》>/、？? ]/g;
