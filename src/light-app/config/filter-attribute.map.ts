
import { TableCellTypes } from './const';
import { FilterAttributeType } from './list-const';

/**
 * string type  控件类型
 * string field 控件字段
 * FilterAttributeOptions 过滤属性
 *
 */
export const filterAttributeMap: { [controlKey in TableCellTypes]: H3.LightApp.FilterDefinition[] } = {
  // 单行文本
  'FormTextBox': [
    {
      value: '',
      type: FilterAttributeType.String
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  // 多行文本
  'FormTextArea': [
    {
      value: '',
      type: FilterAttributeType.String
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  // 日期
  'FormDateTime': [
    // 格式
    {
      value: [],
      type: FilterAttributeType.RangeDate
    },
    {
      value: '',
      options: {
        list: [
          {
            id: 'today',
            name: '今天'
          },
          {
            id: 'yesterday',
            name: '昨天'
          },
          {
            id: 'thisWeek',
            name: '本周'
          },
          {
            id: 'lastWeek',
            name: '上周'
          },
          {
            id: 'thisMonth',
            name: '本月'
          },
          {
            id: 'lastMonth',
            name: '上月'
          },
          {
            id: 'year',
            name: '本年'
          },
          {
            id: 'lastYear',
            name: '去年'
          }
        ]
      },
      type: FilterAttributeType.SingleSelect
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  // 数值
  'FormNumber': [
    {
      value: {
        max: null,
        min: null
      },
      type: FilterAttributeType.RangeNumber
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  // 复选框
  'FormCheckboxList': [
    {
      value: [],
      options: {
        hookData: true
      },
      type: FilterAttributeType.MultiSelect
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  // 下拉框
  'FormDropDownList': [
    {
      value: [],
      options: {
        hookData: true
      },
      type: FilterAttributeType.MultiSelect
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  // 人员单选
  'FormUser': [
    {
      value: [],
      options: {
        hookData: true
      },
      type: FilterAttributeType.MultiSelect
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  'FormMultiUser': [
    {
      value: [],
      options: {
        hookData: true
      },
      type: FilterAttributeType.MultiSelect
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  // 部门单选
  'FormDepartment': [
    {
      value: [],
      options: {
        hookData: true
      },
      type: FilterAttributeType.MultiSelect
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  // 附件
  'FormAttachment': [
    // {
    //   value: [],
    //   options: {
    //     hookData: true
    //   },
    //   type: FilterAttributeType.SingleSelect
    // }
  ],
  // 图片
  'FormPhoto': [
    // {
    //   value: [],
    //   options: {
    //     hookData: true
    //   },
    //   type: FilterAttributeType.SingleSelect
    // }
  ],
  // 创建人
  'FormCreater': [
    {
      value: [],
      options: {
        hookData: true
      },
      type: FilterAttributeType.MultiSelect
    }
  ],
  // 拥有者
  'FormOwner': [
    {
      value: [],
      options: {
        hookData: true
      },
      type: FilterAttributeType.MultiSelect
    }
  ],
  // 创建时间
  'FormCreatedTime': [
    // 格式
    {
      value: [],
      type: FilterAttributeType.RangeDate
    },
    {
      value: '',
      options: {
        list: [
          {
            id: 'today',
            name: '今天'
          },
          {
            id: 'yesterday',
            name: '昨天'
          },
          {
            id: 'thisWeek',
            name: '本周'
          },
          {
            id: 'lastWeek',
            name: '上周'
          },
          {
            id: 'thisMonth',
            name: '本月'
          },
          {
            id: 'lastMonth',
            name: '上月'
          },
          {
            id: 'year',
            name: '本年'
          },
          {
            id: 'lastYear',
            name: '去年'
          }
        ]
      },
      type: FilterAttributeType.SingleSelect
    },
  ],
  // 修改时间
  'FormModifiedTime': [
    // 格式
    {
      value: [],
      type: FilterAttributeType.RangeDate
    },
    {
      value: '',
      options: {
        list: [
          {
            id: 'today',
            name: '今天'
          },
          {
            id: 'yesterday',
            name: '昨天'
          },
          {
            id: 'thisWeek',
            name: '本周'
          },
          {
            id: 'lastWeek',
            name: '上周'
          },
          {
            id: 'thisMonth',
            name: '本月'
          },
          {
            id: 'lastMonth',
            name: '上月'
          },
          {
            id: 'year',
            name: '本年'
          },
          {
            id: 'lastYear',
            name: '去年'
          }
        ]
      },
      type: FilterAttributeType.SingleSelect
    },
  ],
  'FormMap': [
    {
      value: '',
      type: FilterAttributeType.String
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  // 部门多选
  'FormMultiDepartment': [
    {
      value: [],
      options: {
        hookData: true
      },
      type: FilterAttributeType.MultiSelect
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  'FormGridView': [],
  'FormAreaSelect': [
    {
      value: '',
      type: FilterAttributeType.String
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  'FormQuery': [
    {
      value: [],
      options: {
        hookData: true
      },
      type: FilterAttributeType.MultiSelect
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  'FormOwnerDepartment': [
    {
      value: [],
      options: {
        hookData: true
      },
      type: FilterAttributeType.MultiSelect
    }
  ],
  'FormSeqNo': [
    {
      value: '',
      type: FilterAttributeType.String
    },
    {
      value: '',
      type: FilterAttributeType.IsFilled
    }
  ],
  'WorkFlow': [
    {
      value: [],
      options: {
        list: [
          {
            id: '0',
            name: '草稿'
          },
          {
            id: '1',
            name: '已生效'
          },
          {
            id: '2',
            name: '进行中'
          },
          {
            id: '3',
            name: '已取消'
          },
        ]
      },
      type: FilterAttributeType.MultiSelect
    },
  ],
  'ActivityName': [
    {
      value: [],
      options: {
        hookData: true
      },
      type: FilterAttributeType.MultiSelect
    },
  ],
  'Participant': [
    {
      value: [],
      options: {
        hookData: true
      },
      type: FilterAttributeType.MultiSelect
    },
  ]
};
