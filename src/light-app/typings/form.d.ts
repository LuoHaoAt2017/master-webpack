declare namespace H3 {
  namespace LightApp {
    interface Base {
      // editable: boolean;
      // required: boolean;
      // printable: boolean;
    }
    interface TypeDefinition {
      name: string; // 控件名称
      icon: string; // 图标class
      designProperties: AttributeDefinition[]; // 控件设计属性
      filterProperties: FilterDefinition[]; // 控件筛选属性
      systemControl?: boolean; // 是否属于系统控件
      summaryItems?: IdAndNamePairs[]; // 统计分析项
    }

    /**
     *  属性配置项
     */
    interface AttributeDefinition {
      name: string; // 控件值
      value: any; // 控件默认值
      type: number; // 控件属性的类型
      label?: string; // 标签文本
      attrType?: any; // 弹窗类型
      content?: string; // boolean值的内容，用于Checkbox和RadioBox的
      inVisible?: boolean; // 属性是否可见
      stringType?: string; // 文本格式
      options?: AttibuteOptions; // 所有的类型配置函数
      placeholder? : string;
      only?: boolean;
      // span?: number // 控制属性栅格布局
    }

    interface AttibuteOptions {
      list?: DropdownListItem[]; // 下拉控件值
      formatter?: Function; // 格式化
      regexps?: any; // 文本正则匹配 regexp message,
    }

    interface FilterDefinition {
      value?: any; // 过滤值
      type: string; // 值类型
      options?: FilterAttributeOptions; // 所有的类型配置函数
    }

    interface FilterAttributeOptions {
      list?: IdAndNamePairs[]; // 默认选项
      hookData?: Boolean, // 获取列表数据
    }

    interface IdAndNamePairs {
      id: string;
      name: string;
    }

    interface DropdownListItem {
      value: any;
      label: string;
      icon?: string;
    }

    /**
     * 控件属性
     */
    interface FormControlsType {
      displayName: string;
      code: string;
      controls: ControlType[];
      isWorkflow?: boolean;
    }
    interface ControlType {
      Key: string;
      Options: ControlOptions;
      Type: number;
      ParentKey? :string ;
      ChildControls?: ControlType[];

    }
    interface LoadingType {
      loading: boolean;
    }
    interface ControlOptions {
      DataField: string;
      DisplayName?: string;
      Mode?: string;
      NoRepeat?: boolean;
      Required?: any;
      ScanUpdateEnable?: boolean;
      InputByScan?: boolean;
      DateTimeMode?: string;
      NumberFormat?: number;
      DecimalPlaces?: number;
      DefaultItems?: string[];
      DefaultValue?: string[];
      BOSchemaInfo?: string;
      AssociationFilter?: any;
      MappingControls?: any;
      BOSchemaCode?: string;
    }
  }
}
