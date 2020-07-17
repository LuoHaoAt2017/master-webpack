export const State = {
  NONE: 'none',
  CREATE: 'create',
  INIT: 'init',
  READY: 'ready',
  UPDATE: 'update',
  IDLE: 'idle',
  ONACTION: 'onaction',
};

export const StateHook = {
  onCreate: 'onCreate',
  onInit: 'onInit',
  onReady: 'onReady',
  onUpdate: 'onUpdate',
};

export const Mark = {
  ALL: 'all',
  // 表示不执行子表内的规则，用于子表内触发子表外的规则（如聚合函数；
  // 当前没有使用，因为当前子表绑定了内部所有控件的规则
  NOGRID: 'nogrid',
};

export const ControlType = {
  // 基础控件
  /**
   * 单文本
   */
  1: 'FormTextBox',

  /**
   * 长文本
   */
  2: 'FormTextArea',

  /**
   * 日期
   */
  3: 'FormDateTime',

  /**
   * 数值
   */
  4: 'FormNumber',

  /**
   * 单选
   */
  5: 'FormRadioButtonList',

  /**
   * 复选
   */
  6: 'FormCheckboxList',

  /**
   * 下拉
   */
  7: 'FormDropDownList',

  /**
   * 是否控件
   */
  8: 'FormCheckbox',

  /**
   * 地址
   */
  9: 'FormAreaSelect',

  /**
   * 位置
   */
  10: 'FormMap',

  /**
   * 人员多选
   */
  11: 'FormMultiUser',

  /**
   * 人员单选
   */
  12: 'FormUser',

  /**
   * 部门单选
   */
  13: 'FormDepartment',

  /**
   * 部门多选
   */
  14: 'FormMultiDepartment',

  /**
   * 附件
   */
  15: 'FormAttachment',

  /**
   * 图片
   */
  16: 'FormPhoto',

  // 布局控件
  /**
   * 分组标题
   */
  101: 'FormGroupTitle',

  /**
   * 布局控件（一行两列）
   */
  102: 'FormLayout',

  /**
   * 描述说明控件
   */
  103: 'FormDescription',

  /**
   * 子表
   */
  104: 'FormGridView',

  // 系统控件
  /**
   * 系统-流水号
   */
  201: 'FormSeqNo',

  /**
   * 创建人
   */
  202: 'FormCreater',

  /**
   * 拥有者
   */
  203: 'FormOwner',

  /**
   * 所属部门
   */
  204: 'FormOwnerDepartment',

  /**
   * 创建时间
   */
  205: 'FormCreatedTime',

  /**
   * 修改时间
   */
  206: 'FormModifiedTime',

  /**
   * 系统字段-创建人、创建时间、修改时间
   */
  207: 'FormLabel',

  // 高级控件
  /**
   * 关联表单
   */
  301: 'FormQuery',

  /**
   * 关联多选
   */
  302: 'FormMultiQuery',

  /**
   * 关联属性
   */
  303: 'FormAssociateProperty',

  /**
   * 公式型控件
   */
  304: 'FormFormula',

  /**
   * 按钮
   */
  305: 'FormButton',
  // 手写签名
  306: 'FormHandSign'
}

