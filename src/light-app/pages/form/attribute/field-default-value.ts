import { FormControlType } from '@/light-app/config/form-control-type';
/*
* 控件属性的默认值
*/
export const ControlDefaultValue = {
  [FormControlType.FormTextBox]: {
    controlOptions: {
      InputByScan: false,
      Mode: 'Normal',
      NoRepeat: false,
      Permission: 1,
      // Required: false,
      ScanUpdateEnable: false,
      DisplayName: '单行文本',
      DataField: ''
    }
  },
  [FormControlType.FormTextArea]: {
    controlOptions: {
      Permission: 1,
      // Required: false,
      DisplayName: '多行文本',
      DataField: ''
    }
  },
  [FormControlType.FormDateTime]: {
    controlOptions: {
      DateTimeMode: 'yyyy-mm-dd',
      Permission: 1,
      // Required: false,
      DisplayName: '日期',
      DataField: ''
    }
  },
  [FormControlType.FormNumber]: {
    controlOptions: {
      NumberFormat: 0,
      DecimalPlaces: -1,
      ShowMode: 0,
      Permission: 1,
      // Required: false,
      DisplayName: '数字',
      DataField: ''
    }
  },
  [FormControlType.FormCheckboxList]: {
    controlOptions: {
      DefaultItems: ['选项1', '选项2', '选项3'],
      DefaultValue: [],
      Permission: 1,
      // Required: false,
      DataField: '',
      DisplayName: '复选框'
    }
  },
  [FormControlType.FormDropDownList]: {
    controlOptions: {
      DefaultItems: ['选项1', '选项2', '选项3'],
      DefaultValue: [],
      Permission: 1,
      // Required: false,
      DataField: '',
      DisplayName: '下拉框',
    }
  },
  [FormControlType.FormAreaSelect]: {
    controlOptions: {
      AreaMode: 'P-C-T',
      Permission: 1,
      // Required: false,
      ShowDetailAddr: false,
      DataField: '',
      DisplayName: '地址',
    }
  },
  [FormControlType.FormMap]: {
    controlOptions: {
      Range: 1,
      Permission: 1,
      // Required: false,
      DataField: '',
      DisplayName: '位置',
    }
  },
  [FormControlType.FormUser]: {
    controlOptions: {
      UnitSelectionRange: '',
      SelectionRanges: null,
      DefaultValue: '',
      Permission: 1,
      // Required: false,
      DataField: '',
      DisplayName: '人员单选'
    }
  },
  [FormControlType.FormMultiUser]: {
    controlOptions: {
      UnitSelectionRange: '',
      SelectionRanges: null,
      Permission: 1,
      // Required: false,
      DataField: '',
      DisplayName: '人员多选'
    }
  },
  [FormControlType.FormDepartment]: {
    controlOptions: {
      UnitSelectionRange: '',
      SelectionRanges: null,
      DefaultValue: '',
      Permission: 1,
      // Required: false,
      DataField: '',
      DisplayName: '部门单选',
    }
  },
  [FormControlType.FormMultiDepartment]: {
    controlOptions: {
      UnitSelectionRange: '',
      SelectionRanges: null,
      Permission: 1,
      // Required: false,
      DataField: '',
      DisplayName: '部门多选',
    }
  },
  [FormControlType.FormAttachment]: {
    controlOptions: {
      MaxUploadSize: 10,
      Permission: 1,
      // Required: false,
      DataField: '',
      DisplayName: '附件',
    }
  },
  [FormControlType.FormPhoto]: {
    controlOptions: {
      UploadMultiple: false,
      CameraOnly: false,
      HasWatermark: false,
      Compression: false,
      Permission: 1,
      // Required: false,
      DataField: '',
      DisplayName: '图片',
    }
  },
  [FormControlType.FormGridView]: {
    controlOptions: {
      DisplayName: '明细表'
    }
  },
  [FormControlType.FormCreater]: {
    controlOptions: {
      DataField: '',
      DisplayName: '创建人'
    }
  },
  [FormControlType.FormOwner]: {
    controlOptions: {
      UnitSelectionRange: '',
      DefaultValue: '',
      DataField: '',
      DisplayName: '拥有者',
    }
  },
  [FormControlType.FormOwnerDepartment]: {
    controlOptions: {
      DataField: '',
      DisplayName: '所属部门',
    }
  },
  [FormControlType.FormCreatedTime]: {
    controlOptions: {
      DataField: '',
      DisplayName: '创建时间'
    }
  },
  [FormControlType.FormModifiedTime]: {
    controlOptions: {
      DataField: '',
      DisplayName: '修改时间'
    }
  },
  [FormControlType.FormQuery]: {
    controlOptions: {
      BOSchemaInfo: '',
      BOSchemaCode: '',
      BOSchemaName: '',
      MappingControls: {},
      Permission: 1,
      // Required: false,
      DataField: '',
      DisplayName: '关联表单'
    }
  }
};
