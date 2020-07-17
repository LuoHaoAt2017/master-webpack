// 公共属性
export const commonProp = [
  {
    name: 'dataField',
    desc: '控件编码',
    attr: 'data-datafield',
  },
  {
    name: 'controlkey',
    desc: '控件key值',
    attr: 'data-controlkey',
  },
  {
    name: 'displayname',
    desc: '控件名称',
    attr: 'data-displayname',
  },
  {
    name: 'description',
    desc: '控件描述',
    attr: 'data-description',
  },
  {
    name: 'sourcetype',
    desc: '来源类型',
    attr: 'data-sourcetype',
  },
];
// 控件属性映射
export const controlMap = {
  FormSeqNo: {
    name: 'FormSeqNo',
    desc: '流水号',
    properties: [
      {
        name: 'datetimemode',
        desc: '日期格式',
        attr: 'data-datetimemode',
      },
      {
        name: 'incrementnum',
        desc: '自增序号位数',
        attr: 'data-incrementnum',
      },
      {
        name: 'prefix',
        desc: '前置字符（做多4位字母或数字）',
        attr: 'data-prefix',
      },
    ],
  },
  FormUser: {
    name: 'FormUser',
    desc: '人员单选',
    properties: [
      {
        name: 'ismultiple',
        desc: '日期格式',
        attr: 'data-ismultiple',
      },
      {
        name: 'unitselectionrange',
        desc: '自增序号位数',
        attr: 'data-unitselectionrange',
      },
      {
        name: 'orgunitvisible',
        desc: '前置字符（做多4位字母或数字）',
        attr: 'data-orgunitvisible',
      },
      {
        name: 'uservisible',
        desc: '用户可见',
        attr: 'data-uservisible',
      },
      {
        name: 'isrelatedmember',
        desc: '启动表单相关权限控制',
        attr: 'data-isrelatedmember',
      },
      {
        name: 'mappingcontrols',
        desc: '关联配置',
        attr: 'data-mappingcontrols',
      },
      {
        name: 'showunactive',
        desc: '显示离职人员',
        attr: 'data-showunactive',
      },
      {
        name: 'usedatacache',
        desc: '是否缓存',
        attr: 'data-usedatacache',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormMultiUser: {
    name: 'FormMultiUser',
    desc: '人员单选',
    properties: [
      {
        name: 'ismultiple',
        desc: '日期格式',
        attr: 'data-ismultiple',
      },
      {
        name: 'unitselectionrange',
        desc: '自增序号位数',
        attr: 'data-unitselectionrange',
      },
      {
        name: 'orgunitvisible',
        desc: '前置字符（做多4位字母或数字）',
        attr: 'data-orgunitvisible',
      },
      {
        name: 'uservisible',
        desc: '用户可见',
        attr: 'data-uservisible',
      },
      {
        name: 'isrelatedmember',
        desc: '启动表单相关权限控制',
        attr: 'data-isrelatedmember',
      },
      {
        name: 'mappingcontrols',
        desc: '关联配置',
        attr: 'data-mappingcontrols',
      },
      {
        name: 'showunactive',
        desc: '显示离职人员',
        attr: 'data-showunactive',
      },
      {
        name: 'usedatacache',
        desc: '是否缓存',
        attr: 'data-usedatacache',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormTextArea: {
    name: 'FormTextArea',
    desc: '多行文本',
    properties: [
      {
        name: 'rows',
        desc: '可见行数',
        attr: 'data-rows',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
      {
        name: 'placeholder',
        desc: '提示语',
        attr: 'data-placeholder',
      },
    ],
  },
  FormTextBox: {
    name: 'FormTextBox',
    desc: '单行文本',
    properties: [
      {
        name: 'repeat',
        desc: '是否允许重复录入',
        attr: 'data-repeat',
      },
      {
        name: 'mode',
        desc: '格式',
        attr: 'data-mode',
      },
      {
        name: 'inputbyscan',
        desc: '是否允许扫码输入',
        attr: 'data-inputbyscan',
      },
      {
        name: 'scanupdateenable',
        desc: '是否可修改扫码结果',
        attr: 'data-scanupdateenable',
      },
      {
        name: 'defaultitems',
        desc: '选项',
        attr: 'data-defaultitems',
      },
      {
        name: 'ismappingproperty',
        desc: '是否映射属性',
        attr: 'data-ismappingproperty',
      },
      {
        name: 'asfilter',
        desc: '作为关联表单搜索项',
        attr: 'data-asfilter',
      },
      {
        name: 'placeholder',
        desc: '提示语',
        attr: 'data-placeholder',
      },
    ],
  },
  FormDateTime: {
    name: 'FormDateTime',
    desc: '日期',
    properties: [
      {
        name: 'datetimemode',
        desc: '日期格式',
        attr: 'data-datetimemode',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormNumber: {
    name: 'FormNumber',
    desc: '数字',
    properties: [
      {
        name: 'decimalplaces',
        desc: '小数位数',
        attr: 'data-decimalplaces',
      },
      {
        name: 'showmode',
        desc: '显示模式',
        attr: 'data-showmode',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormRadioButtonList: {
    name: 'FormRadioButtonList',
    desc: '单选框',
    properties: [
      {
        name: 'selectshowmode',
        desc: '移动端显示模式',
        attr: 'data-selectshowmode',
      },
      {
        name: 'datadictitemname',
        desc: '绑定数据字典',
        attr: 'data-datadictitemname',
      },
      {
        name: 'defaultitems',
        desc: '选项',
        attr: 'data-defaultitems',
      },
      {
        name: 'defaultvalue',
        desc: '默认值',
        attr: 'data-defaultvalue',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormCheckboxList: {
    name: 'FormCheckboxList',
    desc: '复选框',
    properties: [
      {
        name: 'selectshowmode',
        desc: '移动端显示模式',
        attr: 'data-selectshowmode',
      },
      {
        name: 'datadictitemname',
        desc: '绑定数据字典',
        attr: 'data-datadictitemname',
      },
      {
        name: 'defaultitems',
        desc: '选项',
        attr: 'data-defaultitems',
      },
      {
        name: 'defaultvalue',
        desc: '默认值',
        attr: 'data-defaultvalue',
      },
      {
        name: 'ischeckbox',
        desc: '模式',
        attr: 'data-ischeckbox',
      },
      {
        name: 'boschemacode',
        desc: '关联表单',
        attr: 'data-boschemacode',
      },
      {
        name: 'mappingfield',
        desc: '关联字段',
        attr: 'data-mappingfield',
      },
      {
        name: 'associationfilter',
        desc: '表单过滤条件',
        attr: 'data-associationfilter',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormCheckbox: {
    name: 'FormCheckbox',
    desc: '是/否',
    properties: [
      {
        name: 'defaultitems',
        desc: '选项',
        attr: 'data-defaultitems',
      },
      {
        name: 'defaultvalue',
        desc: '默认值',
        attr: 'data-defaultvalue',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormDropDownList: {
    name: 'FormDropDownList',
    desc: '下拉框',
    properties: [
      {
        name: 'selectshowmode',
        desc: '移动端显示模式',
        attr: 'data-selectshowmode',
      },
      {
        name: 'datasource',
        desc: '数据来源',
        attr: 'data-datasource',
      },
      {
        name: 'datadictitemname',
        desc: '绑定数据字典',
        attr: 'data-datadictitemname',
      },
      {
        name: 'defaultitems',
        desc: '选项',
        attr: 'data-defaultitems',
      },
      {
        name: 'defaultvalue',
        desc: '默认值',
        attr: 'data-defaultvalue',
      },
      {
        name: 'boschemacode',
        desc: '关联表单',
        attr: 'data-boschemacode',
      },
      {
        name: 'mappingfield',
        desc: '关联字段',
        attr: 'data-mappingfield',
      },
      {
        name: 'associationfilter',
        desc: '数据范围限定',
        attr: 'data-associationfilter',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormAreaSelect: {
    name: 'FormAreaSelect',
    desc: '地址',
    properties: [
      {
        name: 'areamode',
        desc: '格式',
        attr: 'data-areamode',
      },
      {
        name: 'showdetailaddr',
        desc: '显示详细地址',
        attr: 'data-showdetailaddr',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormAttachment: {
    name: 'FormAttachment',
    desc: '附件',
    properties: [
      {
        name: 'maxuploadsize',
        desc: '文件限制大小',
        attr: 'data-maxuploadsize',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormPhoto: {
    name: 'FormPhoto',
    desc: '图片',
    properties: [
      {
        name: 'uploadmultiple',
        desc: '允许上传多张图片',
        attr: 'data-uploadmultiple',
      },
      {
        name: 'cameraonly',
        desc: '仅允许拍照上传',
        attr: 'data-cameraonly',
      },
      {
        name: 'hasWaterMark',
        desc: '是否有水印',
        attr: 'data-hasWaterMark',
      },
      {
        name: 'compression',
        desc: '是否压缩',
        attr: 'data-compression',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormQuery: {
    name: 'FormQuery',
    desc: '关联表单',
    properties: [
      {
        name: 'boschemacode',
        desc: '关联表单',
        attr: 'data-boschemacode',
      },
      {
        name: 'associationfilter',
        desc: '数据范围限定',
        attr: 'data-associationfilter',
      },
      {
        name: 'inputbyscan',
        desc: '允许扫码输入',
        attr: 'data-inputbyscan',
      },
      {
        name: 'scanupdateenable',
        desc: '允许手动修改扫码结果',
        attr: 'data-scanupdateenable',
      },
      {
        name: 'boschemaname',
        desc: '关联表单名称',
        attr: 'data-boschemaname',
      },
      {
        name: 'inputbyscan',
        desc: '允许扫码输入',
        attr: 'data-inputbyscan',
      },
      {
        name: 'scanupdateenable',
        desc: '允许手动修改扫码结果',
        attr: 'data-scanupdateenable',
      },
      {
        name: 'boschemaname',
        desc: '关联表单名称',
        attr: 'data-boschemaname',
      },
      {
        name: 'islistview',
        desc: '是否列表视图',
        attr: 'data-islistview',
      },
      {
        name: 'mappingcontrols',
        desc: '关联配置',
        attr: 'data-mappingcontrols',
      },
      {
        name: 'mappingproperties',
        desc: '关联属性',
        attr: 'data-mappingproperties',
      },
      {
        name: 'ismultiple',
        desc: '是否多选',
        attr: 'data-ismultiple',
      },
      {
        name: 'boschemainfo',
        desc: '关联表单信息',
        attr: 'data-boschemainfo',
      },
      {
        name: 'bofilter',
        desc: '关联表单过滤',
        attr: 'data-bofilter',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormMultiQuery: {
    name: 'FormMultiQuery',
    desc: '关联多选',
    properties: [
      {
        name: 'boschemacode',
        desc: '关联表单',
        attr: 'data-boschemacode',
      },
      {
        name: 'associationfilter',
        desc: '数据范围限定',
        attr: 'data-associationfilter',
      },
      {
        name: 'inputbyscan',
        desc: '允许扫码输入',
        attr: 'data-inputbyscan',
      },
      {
        name: 'scanupdateenable',
        desc: '允许手动修改扫码结果',
        attr: 'data-scanupdateenable',
      },
      {
        name: 'boschemaname',
        desc: '关联表单名称',
        attr: 'data-boschemaname',
      },
      {
        name: 'inputbyscan',
        desc: '允许扫码输入',
        attr: 'data-inputbyscan',
      },
      {
        name: 'scanupdateenable',
        desc: '允许手动修改扫码结果',
        attr: 'data-scanupdateenable',
      },
      {
        name: 'boschemaname',
        desc: '关联表单名称',
        attr: 'data-boschemaname',
      },
      {
        name: 'islistview',
        desc: '是否列表视图',
        attr: 'data-islistview',
      },
      {
        name: 'mappingcontrols',
        desc: '关联配置',
        attr: 'data-mappingcontrols',
      },
      {
        name: 'mappingproperties',
        desc: '关联属性',
        attr: 'data-mappingproperties',
      },
      {
        name: 'ismultiple',
        desc: '是否多选',
        attr: 'data-ismultiple',
      },
      {
        name: 'boschemainfo',
        desc: '关联表单信息',
        attr: 'data-boschemainfo',
      },
      {
        name: 'bofilter',
        desc: '关联表单过滤',
        attr: 'data-bofilter',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormMap: {
    name: 'FormMap',
    desc: '位置',
    properties: [
      {
        name: 'range',
        desc: '位置范围',
        attr: 'data-range',
      },
      {
        name: 'sourcetype',
        desc: '来源类型',
        attr: 'data-sourcetype',
      },
    ],
  },
  FormFormula: {
    name: 'FormFormula',
    desc: '公式型控件',
    properties: [
      {
        name: 'bindtype',
        desc: '绑定类型',
        attr: 'data-bindtype',
      },
      {
        name: 'decimalplaces',
        desc: '格式',
        attr: 'data-decimalplaces',
      },
      {
        name: 'showmode',
        desc: '显示模式',
        attr: 'data-showmode',
      },
    ],
  },
  FormGridView: {
    name: 'FormGridView',
    desc: '明细表',
    properties: [
      {
        name: 'nameitems',
        desc: '数据标题',
        attr: 'data-nameitems',
      },
      {
        name: 'children',
        desc: '子',
        attr: 'data-children',
      },
      {
        name: 'displayMode',
        desc: '显示模式',
        attr: 'data-displayMode',
      },
      {
        name: 'displayFields',
        desc: '移动端显示字段',
        attr: 'data-displayFields',
      },
    ],
  },
};

/* eslint-disable */
// for (const controlKey in controlMap) {
// 	console.group(controlKey);
// 	let cls = '';
// 	const options = controlMap[controlKey];
// 	cls += `/** ${options.desc}*/\n`;
// 	cls += `export default class ${controlKey}Options extends BaseOptions {\n`;
// 	for (const prop of options.properties) {
// 		cls +=`	/** ${prop.desc}*/\n`;
// 		cls +=`	${prop.name}: string = '';\n`;
// 	}
// 	cls +='}\n';
// 	console.log(cls);
// 	console.groupEnd(controlKey);
// }
/* eslint-enable */
