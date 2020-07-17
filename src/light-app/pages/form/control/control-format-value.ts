import { FormControlType } from '@/light-app/config/form-control-type';

/*
* 控件在表单设计器中渲染的默认样式或属性
*/
export const ControlFormatValue = {
  [FormControlType.FormTextBox]: {
    type: 'text',
    showModal: false,
    placeholder: '请输入',
    color: '#ccc',
    component: 'l-text',
    expand: false
  },
  [FormControlType.FormTextArea]: {
    type: 'textarea',
    showModal: false,
    placeholder: '请输入',
    color: '#ccc',
    component: 'l-text',
    expand: false
  },
  [FormControlType.FormDateTime]: {
    type: 'text',
    rightIcon: 'calendar-o',
    showModal: true,
    placeholder: '请选择',
    color: '#ccc',
    component: 'l-text',
    expand: false
  },
  [FormControlType.FormNumber]: {
    type: 'text',
    showModal: false,
    placeholder: '请输入',
    color: '#ccc',
    component: 'l-text',
    expand: false
  },

  [FormControlType.FormDropDownList]: {
    type: 'text',
    placeholder: '请选择',
    color: '#999',
    rightIcon: 'right-o',
    component: 'l-text',
    expand: false
  },

  [FormControlType.FormCheckboxList]: {
    name: '复选框',
    component: 'l-checkbox',
    expand: true,
    expandStatus: false
  },
  [FormControlType.FormPhoto]: {
    type: 'photo',
    component: 'l-photo',
    expand: false
  },
  // 附件
  [FormControlType.FormAttachment]: {
    type: 'text',
    rightIcon: 'paperclip-o',
    placeholder: '点击上传附件',
    component: 'l-text',
    expand: false
  },
  [FormControlType.FormUser]: {
    type: 'button',
    text: '点击选择人员',
    component: 'l-button',
    expand: false
  },
  [FormControlType.FormMultiUser]: {
    type: 'button',
    text: '点击选择人员',
    component: 'l-button',
    expand: false
  },
  [FormControlType.FormDepartment]: {
    type: 'button',
    text: '点击选择部门',
    component: 'l-button',
    expand: false
  },
  [FormControlType.FormMultiDepartment]: {
    type: 'button',
    text: '点击选择部门',
    component: 'l-button',
    expand: false
  },
  // 地址
  [FormControlType.FormAreaSelect]: {
    type: 'address',
    component: 'l-address',
    expand: false
  },
  // 位置
  [FormControlType.FormMap]: {
    type: 'button',
    placeholder: '点击获取位置',
    rightIcon: 'position-o',
    component: 'l-text',
    expand: false
  },
  [FormControlType.FormQuery]: {
    type: 'button',
    placeholder: '选择关联列表',
    rightIcon: 'form-related-o',
    component: 'l-text',
    expand: false
  },
  [FormControlType.FormGridView]: {
    type: 'gridView',
    component: 'l-grid-view',
    expand: true,
    expandStatus: false
  },

  [FormControlType.FormCreater]: {
    type: 'text',
    placeholder: '系统自动生成',
    component: 'l-text',
    expand: false
  },
  [FormControlType.FormOwner]: {
    showModal: true,
    placeholder: '请选择',
    color: '#999',
    component: 'l-button',
    expand: false
  },

  [FormControlType.FormCreatedTime]: {
    type: 'text',
    placeholder: '系统自动生成',
    component: 'l-text',
    expand: false
  },
  [FormControlType.FormModifiedTime]: {
    type: 'text',
    placeholder: '系统自动生成',
    component: 'l-text',
    expand: false
  },
  [FormControlType.FormOwnerDepartment]: {
    type: 'text',
    showModal: true,
    placeholder: '请选择',
    color: '#999',
    component: 'l-button',
    expand: false
  }
};
