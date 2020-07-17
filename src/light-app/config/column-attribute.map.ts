import {
  AttributeType,
  ModalAttributeType,
  TableCellTypes,
  UserOrgAttributeType
} from './const';
/**
 * string type  控件类型
 * string field 控件字段
 * ControlAttributeOptions 字段属性
 *
 */

export const controlAttributeMap: {
  [controlKey in TableCellTypes]: H3.LightApp.AttributeDefinition[];
} = {
  // 单行文本
  FormTextBox: [
    {
      name: 'Mode',
      value: 'Normal',
      type: AttributeType.Mode,
      options: {
        list: [
          {
            value: 'Normal',
            icon: 'single-line-text',
            label: '普通文本'
          },
          {
            value: 'Email',
            icon: 'mail-o',
            label: '邮箱'
          },
          {
            value: 'Card',
            icon: 'id-card-o',
            label: '身份证'
          },
          {
            value: 'Telephone',
            icon: 'mobile',
            label: '固话／手机'
          }
        ]
      },
      label: '格式'
    },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    },
    // 校验
    {
      name: 'NoRepeat',
      value: false,
      type: AttributeType.Boolean,
      content: '不允许重复录入'
    }
  ],
  // 多行文本
  FormTextArea: [
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    }
  ],
  // 日期
  FormDateTime: [
    {
      name: 'DateTimeMode',
      value: 'yyyy-mm-dd',
      type: AttributeType.RadioOption,
      options: {
        list: [
          {
            value: 'yyyy-mm-dd',
            label: '年-月-日'
          },
          {
            value: 'yyyy-mm',
            label: '年-月'
          },
          {
            value: 'yyyy-mm-dd hh:mm',
            label: '年-月-日 时:分'
          },
          {
            value: 'hh:mm',
            label: '时:分'
          }
        ]
      },
      label: '格式设置'
    },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    }
  ],
  // 数值
  FormNumber: [
    // 格式
    {
      name: 'NumberFormat',
      value: 0,
      type: AttributeType.RadioOption,
      options: {
        list: [
          {
            value: 0,
            label: '整数'
          },
          {
            value: 1,
            label: '小数'
          }
        ]
      },
      label: '格式设置'
    },
    {
      name: 'DecimalPlaces',
      value: 0,
      type: AttributeType.String,
      label: '小数位数',
      placeholder: '请输入0到6以内的整数',
      inVisible: true,
      options: {
        regexps: {
          numberOnly: true,
          numberValid: {
            min: 0,
            max: 6,
            int: true
          }
        }
      }
    },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    },
    // 千分位
    {
      name: 'ShowMode',
      value: false,
      type: AttributeType.Boolean,
      content: '显示千分位'
    }
  ],
  // 复选框
  FormCheckboxList: [
    // 选项
    {
      name: 'DefaultItems',
      value: '选项1,选项2,选项3',
      type: AttributeType.Select,
      label: '选项'
    },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    }
  ],
  // 下拉框
  FormDropDownList: [
    // 选项
    {
      name: 'DefaultItems',
      value: '选项1,选项2,选项3',
      type: AttributeType.Select,
      label: '选项'
    },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    }
  ],
  // 人员单选
  FormUser: [
    // 选人范围
    {
      name: 'SelectionRanges',
      value: '',
      type: AttributeType.UserOrg,
      attrType: UserOrgAttributeType.MultiOrg,
      label: '仅以下人员可被选择',
      options: {
        formatter: (val: any) => {
          return val.names || '';
        }
      }
    },
    {
      name: 'UnitSelectionRange',
      value: '',
      type: AttributeType.String,
      label: '',
      inVisible: true
    },
    {
      name: 'ShowCurUser',
      value: false,
      type: AttributeType.Boolean,
      content: '默认当前用户',
    },
    // 默认值
    // {
    //   name: 'DefaultValue',
    //   value: '',
    //   type: AttributeType.UserOrg,
    //   attrType: UserOrgAttributeType.User,
    //   label: '默认值',
    //   options: {
    //     formatter: (val: any) => {
    //       return val.names || '';
    //     }
    //   },
    //   inVisible: true
    // },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    }
  ],
  // 部门单选
  FormDepartment: [
    {
      name: 'SelectionRanges',
      value: '',
      type: AttributeType.UserOrg,
      attrType: UserOrgAttributeType.MultiOrg,
      label: '仅以下部门可被选择',
      options: {
        formatter: (val: any) => {
          return val.names || '';
        }
      }
    },
    {
      name: 'UnitSelectionRange',
      value: '',
      type: AttributeType.String,
      label: '',
      inVisible: true
    },
    // 默认值
    {
      name: 'DefaultValue',
      value: '',
      type: AttributeType.UserOrg,
      attrType: UserOrgAttributeType.MultiOrg,
      label: '默认值',
      options: {
        formatter: (val: any) => {
          return val.names || '';
        }
      },
      inVisible: true
    },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    }
  ],
  // 人员多选
  FormMultiUser: [
    // 选人范围
    {
      name: 'SelectionRanges',
      value: '',
      type: AttributeType.UserOrg,
      attrType: UserOrgAttributeType.MultiOrg,
      label: '仅以下人员可被选择',
      options: {
        formatter: (val: any) => {
          return val.names || '';
        }
      }
    },
    {
      name: 'UnitSelectionRange',
      value: '',
      type: AttributeType.String,
      label: '',
      inVisible: true
    },
    // 默认值
    {
      name: 'DefaultValue',
      value: '',
      type: AttributeType.UserOrg,
      attrType: UserOrgAttributeType.MultiUser,
      label: '默认值',
      options: {
        formatter: (val: any) => {
          return val.names || '';
        }
      },
      inVisible: true
    },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    }
  ],
  // 部门多选
  FormMultiDepartment: [
    {
      name: 'SelectionRanges',
      value: '',
      type: AttributeType.UserOrg,
      attrType: UserOrgAttributeType.MultiOrg,
      label: '仅以下部门可被选择',
      options: {
        formatter: (val: any) => {
          return val.names || '';
        }
      }
    },
    {
      name: 'UnitSelectionRange',
      value: '',
      type: AttributeType.String,
      label: '',
      inVisible: true
    },
    // 默认值
    {
      name: 'DefaultValue',
      value: '',
      type: AttributeType.UserOrg,
      attrType: UserOrgAttributeType.MultiOrg,
      label: '默认值',
      options: {
        formatter: (val: any) => {
          return val.names || '';
        }
      },
      inVisible: true
    },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    }
  ],
  // 附件
  FormAttachment: [
    // 文件大小限制
    {
      name: 'MaxUploadSize',
      value: 10,
      type: AttributeType.RadioOption,
      options: {
        list: [
          {
            value: 1,
            label: '1MB'
          },
          {
            value: 5,
            label: '5MB'
          },
          {
            value: 10,
            label: '10MB'
          },
          {
            value: 50,
            label: '50MB'
          }
        ]
      },
      label: '文件大小限制'
    },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    }
  ],
  // 图片
  FormPhoto: [
    // 精确范围
    {
      name: 'UploadMultiple',
      value: false,
      type: AttributeType.RadioOption,
      options: {
        list: [
          {
            value: false,
            label: '仅允许上传一张图片'
          },
          {
            value: true,
            label: '允许上传多张图片'
          }
        ]
      },
      label: '格式设置'
    },
    // 拍照时增加水印
    {
      name: 'CameraOnly',
      value: false,
      type: AttributeType.Boolean,
      content: '仅允许拍照上传',
    },
    // // 水印
    {
      name: 'HasWatermark',
      value: false,
      type: AttributeType.Boolean,
      content: '拍照时不自动添加水印',
      inVisible: true
    },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    }
  ],
  // 创建人
  FormCreater: [],
  // 拥有者
  FormOwner: [
    // 选人范围
    {
      name: 'SelectionRanges',
      value: '',
      type: AttributeType.UserOrg,
      attrType: UserOrgAttributeType.MultiOrg,
      label: '仅以下人员可被选择',
      options: {
        formatter: (val: any) => {
          return val.names || '';
        }
      }
    },
    {
      name: 'UnitSelectionRange',
      value: '',
      type: AttributeType.String,
      label: '',
      inVisible: true
    },
    // 默认值
    {
      name: 'DefaultValue',
      value: '当前用户',
      type: AttributeType.Modal,
      label: '默认值',
      options: {
        formatter: (val: any) => {
          return val.names || '';
        }
      },
      inVisible: true
    }
  ],
  // 创建时间
  FormCreatedTime: [],
  // 修改时间
  FormModifiedTime: [],
  // 位置
  FormMap: [
    // 精确范围
    {
      name: 'Range',
      value: 1,
      type: AttributeType.RadioOption,
      options: {
        list: [
          {
            value: 0,
            label: '限定附近位置'
          },
          {
            value: 1,
            label: '允许任意位置'
          }
        ]
      },
      label: '格式设置'
    },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    }
  ],
  FormQuery: [
    // 将根据以下表单字段生成选项
    {
      name: 'BOSchemaInfo',
      value: '',
      type: AttributeType.Tree,
      label: '关联表单'
    },
    {
      name: 'BOSchemaName',
      value: '',
      type: AttributeType.String,
      label: '',
      inVisible: true
    },
    {
      name: 'BOSchemaCode',
      value: '',
      type: AttributeType.String,
      label: '',
      inVisible: true
    },
    // // 关联填充
    // {
    //   name: 'MappingControls',
    //   value: '',
    //   type: AttributeType.Modal,
    //   attrType: ModalAttributeType.FillRule,
    //   label: '关联填充',
    //   options: {
    //     formatter: (val: any) => {
    //       return val.names || '';
    //     }
    //   }
    // },
    // 格式
    // {
    //   name: 'FormQueryFormat',
    //   value: '0',
    //   type: AttributeType.Dropdown,
    //   options: {
    //     list: [
    //       {
    //         value: '0',
    //         label: '单选'
    //       },
    //       {
    //         value: '1',
    //         label: '多选'
    //       }
    //     ],
    //   },
    //   label: '格式'
    // },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    }
  ],
  // 明细表
  FormGridView: [],
  // 地址控件
  FormAreaSelect: [
    // 格式
    {
      name: 'AreaMode',
      value: '',
      type: AttributeType.RadioOption,
      label: '格式',
      options: {
        list: [
          {
            value: 'P-C-T',
            label: '省-市-区/县'
          },
          {
            value: 'P-C',
            label: '省-市'
          },
          {
            value: 'P',
            label: '省'
          }
        ]
      }
    },
    // 必填
    {
      name: 'Permission',
      value: 1,
      inVisible: false,
      type: AttributeType.CheckboxGroup,
      label: '验证',
      options: {
        list: [
          {
            value: 0,
            label: '查看'
          },
          {
            value: 1,
            label: '填写'
          },
          {
            value: 2,
            label: '必填'
          },
        ]
      },
    },
    // 是否显示详细地址
    {
      name: 'ShowDetailAddr',
      value: false,
      type: AttributeType.Boolean,
      content: '详细地址'
    }
  ],
  FormOwnerDepartment: [
    {
      name: 'SelectionRanges',
      value: '',
      type: AttributeType.UserOrg,
      attrType: UserOrgAttributeType.MultiOrg,
      label: '仅以下部门可被选择',
      options: {
        formatter: (val: any) => {
          return val.names || '';
        }
      }
    },
    {
      name: 'UnitSelectionRange',
      value: '',
      type: AttributeType.String,
      label: '',
      inVisible: true
    }
    // 必填
    // {
    //   name: 'Permission',
    //   value: false,
    //   type: AttributeType.Boolean,
    //   label: '验证',
    //   content: '必填'
    // },
  ],
  // 流水号
  FormSeqNo: [
    {
      name: 'Prefix',
      value: '',
      type: AttributeType.String,
      label: '前置字符(最多4位字母或数字)',
      options: {
        regexps: {
          maxLength: {
            len: 4,
            message: '长度不能超过4字节'
          },
          onlyNumAndLetter: true
        }
      }
    },
    {
      name: 'DateTimeMode',
      value: '',
      type: AttributeType.Select,
      label: '日期格式',
      options: {
        list: [
          {
            value: 'None',
            label: '无'
          },
          {
            value: 'YYYY',
            label: '年'
          },
          {
            value: 'YYYYMM',
            label: '年月'
          },
          {
            value: 'YYYYMMDD',
            label: '年月日'
          }
        ]
      }
    },
    {
      name: 'IncrementNum',
      value: '',
      type: AttributeType.String,
      label: '自增序号位数',
      options: {
        regexps: {
          numberOnly: true,
          maxNumber: {
            max: 8,
            min: 1,
            message: '自增位数最大为8'
          }
        }
      }
    },
    {
      name: 'GenarateHistorySeqNo',
      value: 0,
      type: AttributeType.Boolean,
      label: '生成流水号',
      content: '生成流水号',
      options: {
      }
    }
  ],
  WorkFlow: [],
  ActivityName: [],
  Participant: []
};
