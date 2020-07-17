import { AttributeType, UserOrgAttributeType } from './const';
import { controlAttributeMap } from './column-attribute.map';
import { filterAttributeMap } from './filter-attribute.map';

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
   * 流程控件
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

/**
 * 系统控件指定ControlKey
 */
export const SystemControlCodeType = {
  [FormControlType.FormCreater]: 'CreatedBy',

  [FormControlType.FormOwner]: 'OwnerId',

  [FormControlType.FormOwnerDepartment]: 'OwnerDeptId',

  [FormControlType.FormCreatedTime]: 'CreatedTime',

  [FormControlType.FormModifiedTime]: 'ModifiedTime'
};

/**
 * 只允许添加一次的控件
 */
export const UniqueControls: FormControlType[] = [
  FormControlType.FormMap,
  FormControlType.FormCreater,
  FormControlType.FormOwner,
  FormControlType.FormOwnerDepartment,
  FormControlType.FormCreatedTime,
  FormControlType.FormModifiedTime
];

/**
 * 表单控件属性
 */
export const ContorlTypeObject: {
  [controlKey: number]: H3.LightApp.TypeDefinition;
} = {
  [FormControlType.FormTextBox]: {
    name: '单行文本',
    icon: 'single-line-text',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormTextBox']],
    filterProperties: [...filterAttributeMap['FormTextBox']],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.FormTextArea]: {
    name: '多行文本',
    icon: 'text-multiline',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormTextArea']],
    filterProperties: [...filterAttributeMap['FormTextArea']],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.FormDateTime]: {
    name: '日期',
    icon: 'calendar-o',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormDateTime']],
    filterProperties: [...filterAttributeMap['FormDateTime']],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.FormNumber]: {
    name: '数字',
    icon: 'number',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormNumber']],
    filterProperties: [...filterAttributeMap['FormNumber']],
    summaryItems: [
      {
        id: 'sum',
        name: '求和'
      },
      {
        id: 'average',
        name: '平均值'
      },
      {
        id: 'max',
        name: '最大值'
      },
      {
        id: 'min',
        name: '最小值'
      },
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },

  [FormControlType.FormCheckboxList]: {
    name: '复选框',
    icon: 'check-square-o',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormCheckboxList']],
    filterProperties: [...filterAttributeMap['FormCheckboxList']],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.FormDropDownList]: {
    name: '下拉框',
    icon: 'drop-down-o',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormDropDownList']],
    filterProperties: [...filterAttributeMap['FormDropDownList']],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.FormGridView]: {
    name: '明细表',
    icon: 'table-o',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormGridView']],
    filterProperties: [...filterAttributeMap['FormGridView']]
  },
  [FormControlType.FormPhoto]: {
    name: '图片',
    icon: 'picture-o',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormPhoto']],
    filterProperties: [...filterAttributeMap['FormPhoto']],
    // summaryItems: [
    //   {
    //     id: 'filled',
    //     name: '已添加'
    //   },
    //   {
    //     id: 'empty',
    //     name: '未添加'
    //   },
    //   {
    //     id: 'none',
    //     name: '不统计'
    //   }
    // ]
  },
  [FormControlType.FormAttachment]: {
    name: '附件',
    icon: 'paperclip-o',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormAttachment']],
    filterProperties: [...filterAttributeMap['FormAttachment']],
     // summaryItems: [
    //   {
    //     id: 'filled',
    //     name: '已添加'
    //   },
    //   {
    //     id: 'empty',
    //     name: '未添加'
    //   },
    //   {
    //     id: 'none',
    //     name: '不统计'
    //   }
    // ]
  },
  [FormControlType.FormUser]: {
    name: '人员单选',
    icon: 'add-user-o',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormUser']],
    filterProperties: [...filterAttributeMap['FormUser']],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.FormMultiUser]: {
    name: '人员多选',
    icon: 'add-user-group-o',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormUser']],
    filterProperties: [...filterAttributeMap['FormUser']],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.FormDepartment]: {
    name: '部门单选',
    icon: 'team-singlechoice-o',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormDepartment']],
    filterProperties: [...filterAttributeMap['FormDepartment']],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.FormMultiDepartment]: {
    name: '部门多选',
    icon: 'team-manychoice-o',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormDepartment']],
    filterProperties: [...filterAttributeMap['FormDepartment']],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.FormAreaSelect]: {
    name: '地址',
    icon: 'get-address-o',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormAreaSelect']],
    filterProperties: [...filterAttributeMap['FormAreaSelect']],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.FormMap]: {
    name: '位置',
    icon: 'position-o',
    systemControl: false,
    designProperties: [...controlAttributeMap['FormMap']],
    filterProperties: [...filterAttributeMap['FormMap']],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.WorkFlow]: {
    name: '流程状态',
    // color: '#17abff',
    icon: 'iconsingle-line-text',
    designProperties: [],
    filterProperties: [
      ...filterAttributeMap['WorkFlow']
    ],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.ActivityName]: {
    name: '当前节点',
    // color: '#17abff',
    icon: 'iconsingle-line-text',
    designProperties: [],
    filterProperties: [
      ...filterAttributeMap['ActivityName']
    ],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.Participant]: {
    name: '当前处理人',
    // color: '#17abff',
    icon: 'iconsingle-line-text',
    designProperties: [],
    filterProperties: [
      ...filterAttributeMap['Participant']
    ],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.FormQuery]: {
    name: '关联表单',
    systemControl: false,
    icon: 'form-related-o',
    designProperties: [...controlAttributeMap['FormQuery']],
    filterProperties: [...filterAttributeMap['FormQuery']],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  [FormControlType.FormSeqNo]: {
    name: '流水号',
    // color: '#17abff',
    systemControl: true,
    icon: 'iconliushuihao',
    designProperties: [
      ...controlAttributeMap['FormSeqNo']
    ],
    filterProperties: [
      ...filterAttributeMap['FormSeqNo']
    ],
    summaryItems: [
      {
        id: 'filled',
        name: '已填写'
      },
      {
        id: 'empty',
        name: '未填写'
      },
      {
        id: 'none',
        name: '不统计'
      }
    ]
  },
  // [FormControlType.FormFormula]: {
  //   name: '计算公式',
  //   // color: '#17abff',
  //   icon: 'iconformula-control',
  //   systemControl: false,
  //   designProperties: [
  //     ...controlAttributeMap['FormFormula']
  //   ],
  //   filterProperties: [
  //     ...filterAttributeMap['FormFormula']
  //   ],
  //   summaryItems: [
  //     {
  //       id: 'filled',
  //       name: '已填写'
  //     },
  //     {
  //       id: 'empty',
  //       name: '未填写'
  //     },
  //     {
  //       id: 'none',
  //       name: '不统计'
  //     }
  //   ]
  // },
  [FormControlType.FormCreater]: {
    name: '创建人',
    icon: 'user-o',
    systemControl: true,
    designProperties: [...controlAttributeMap['FormCreater']],
    filterProperties: [...filterAttributeMap['FormCreater']]
  },
  [FormControlType.FormOwner]: {
    name: '拥有者',
    icon: 'user-list-o',
    systemControl: true,
    designProperties: [...controlAttributeMap['FormOwner']],
    filterProperties: [...filterAttributeMap['FormOwner']]
  },
  [FormControlType.FormCreatedTime]: {
    name: '创建时间',
    icon: 'clock-circle-o',
    systemControl: true,
    designProperties: [...controlAttributeMap['FormCreatedTime']],
    filterProperties: [...filterAttributeMap['FormCreatedTime']]
  },
  [FormControlType.FormModifiedTime]: {
    name: '修改时间',
    icon: 'clock-edit-o',
    systemControl: true,
    designProperties: [...controlAttributeMap['FormModifiedTime']],
    filterProperties: [...filterAttributeMap['FormModifiedTime']]
  },
  [FormControlType.FormOwnerDepartment]: {
    name: '所属部门',
    icon: 'department-o',
    systemControl: true,
    designProperties: [...controlAttributeMap['FormOwnerDepartment']],
    filterProperties: [...filterAttributeMap['FormOwnerDepartment']]
  }
};
