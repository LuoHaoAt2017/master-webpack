
// 全局默认参数(主要是枚举),不能修改，只能克隆修改 （lbb修改代码规范）
export const DefaultOptions = {
  WidgetType: {
    // 折线图
    Line: 0,
    // 柱状图
    Bar: 1,
    // 饼图
    Pie: 2,
    // 雷达图
    Radar: 4,
    // 漏斗图
    Funnel: 6,
    // 明细表
    Detail: 7,
    // 汇总表
    Combined: 8,
    // 简易看板
    SimpleBoard: 9,
  },
  // 字段类型
  ColumnType: {
    // <summary>
    // 数值
    // </summary>
    Numeric: 0,
    // <summary>
    // 日期
    // </summary>
    DateTime: 1,
    // <summary>
    // 字符
    // </summary>
    String: 2,
    // <summary>
    // 参与者（单人）
    // </summary>
    SingleParticipant: 3,
    // <summary>
    // 参与者（多人）
    // </summary>
    MultiParticipant: 4,
    // <summary>
    // 逻辑型
    // </summary>
    Boolean: 5,
    // <summary>
    // 逻辑型
    // </summary>
    Association: 6,
  },
  // 过滤类型
  FilterType: {
    // 字符型
    String: 0,
    // 数值型
    Numeric: 1,
    // 时间型
    DateTime: 2,
    // 机构型
    Organization: 3,
    // 固定值
    FixedValue: 4,
    // 数字字典
    MasterData: 5,
    // 关联查询
    Association: 6,
    // 布尔类型
    Boolean: 7,
    // 地址类型
    Address: 9,
    // 关联字段
    AssociationField: 10,
  },
  OrganizationType: {
    // 人员
    User: 0,
    // 部门
    Dept: 1,
    // 全部
    All: 2,
  },
  // 统计字段的汇总方式
  Function: {
    // 统计
    Count: 0,
    // 汇总
    Sum: 1,
    // 平均
    Avg: 2,
    // 最小值
    Min: 3,
    // 最大值
    Max: 4,
  },
  ReportLayout: {
    // 一行一列
    OneColumn: 0,
    // <summary>
    // 一行两列
    // </summary>
    TwoColumns: 1,
    // <summary>
    // 一行三列
    // </summary>
    ThreeColumns: 2,
  },
  AssociationMode: {
    Inner: 0,
    // <summary>
    // 左连接
    // </summary>
    Left: 1,
    // <summary>
    // 右连接
    // </summary>
    Right: 2,
  },
  ResourceType: {
    // 列表
    List: 0,
    // SQL
    SQL: 1,
    // 适配器
    Adapter: 2,
  },
  ReportFrozenHeaderType: {
    // 不冻结表头
    FrozenNone: 0,
    // 仅冻结行表头
    FrozenRowHeader: 1,
    // 仅冻结列表头
    FrozenColumnHeader: 2,
    // 行冻结表头和列表头
    FrozenRowAndColumnHeader: 3,
  },
};
export const DefaultColumn = {
  ColumnCode: 'DefaultCountCode',
  DisplayName: '计数',
  ColumnType: DefaultOptions.ColumnType.Numeric,
  FunctionType: DefaultOptions.Function.Count,
};
// 行表头数
// export const DefaultSimpleHeaderNode = function a(config) {
//   const Value = config.Value || '';
//   const RowSpan = config.RowSpan || 0;
//   const ColSpan = config.ColSpan || 0;
//   const ChildNode = config.ChildNode || [];
// };
// export const DefaultTd = function a(config) {
//   const Value = config.Value || '';
//   const ColSpan = config.ColSpan || 0;
//   const RowSpan = config.RowSpan || 0;
// };
export const DefaultColumnCode = '';
export const DefaultColumnDisplayName = '';
export const ReportTemplates = {
  Detail: {
    Text: '明细表',
    Icon: '',
    Type: DefaultOptions.WidgetType.Detail,
    DesignProperties: [
      { Name: 'DisplayName', Text: '标题', DefaultValue: '' },
      {
        Name: 'ReportSource', Text: '数据源', DefaultValue: '', ReportSource: {},
      },
    ],
  },
  Combined: {
    Text: '汇总表',
    Icon: '',
    Type: DefaultOptions.WidgetType.Combined,
    DesignProperties: [
      { Name: 'DisplayName', Text: '标题', DefaultValue: '' },
      {
        Name: 'ReportSource', Text: '数据源', DefaultValue: '', ReportSource: {},
      },
    ],
  },
  Line: {
    Text: '折线图',
    Icon: '',
    Type: DefaultOptions.WidgetType.Line,
    DesignProperties: {},
  },
  Bar: {
    Text: '柱状图',
    Icon: '',
    Type: DefaultOptions.WidgetType.Bar,
    DesignProperties: {},
  },
  Pie: {
    Text: '饼图',
    Icon: '',
    Type: DefaultOptions.WidgetType.Pie,
    DesignProperties: {},
  },
  Area: {
    Text: '面积图',
    Icon: '',
    Type: DefaultOptions.WidgetType.Area,
    DesignProperties: {},
  },
  Radar: {
    Text: '雷达图',
    Icon: '',
    Type: DefaultOptions.WidgetType.Radar,
    DesignProperties: {},
  },
  Gauge: {
    Text: '仪表盘',
    Icon: '',
    Type: DefaultOptions.WidgetType.Gauge,
    DesignProperties: {},
  },
  Funnel: {
    Text: '漏斗图',
    Icon: '',
    Type: DefaultOptions.WidgetType.Funnel,
    DesignProperties: {},
  },
  SimpleBoard: {
    Text: '简易看板',
    Icon: '',
    Type: DefaultOptions.WidgetType.SimpleBoard,
    DesignProperties: {},
  },
};
// 报表页
export const ReportPage = function a(config) {
  this.Code = config.Code || '';
  this.DisplayName = '';
  this.ReportWidgets = config.ReportWidgets || [];
  this.Layout = config.Layout || DefaultOptions.ReportLayout.OneColumn;
  this.Filters = config.Filters || [];
};
// 过滤条件
export const ReportFilter = function a(config) {
  this.ColumnCode = config.ColumnCode || '';
  this.ColumnName = config.ColumnName || '';
  this.DisplayName = config.DisplayName || '';
  this.FilterType = config.FilterType;
  this.FilterValue = config.FilterValue || null;
  this.DefaultValue = config.DefaultValue || null;
  this.AllowNull = config.AllowNull || true;
  this.Visible = config.Visible || true;
  this.ColumnType = config.ColumnType;
  this.OrganizationType = config.OrganizationType || DefaultOptions.OrganizationType.All;
  this.AssociationType = config.AssociationType || DefaultOptions.AssociationMode.Left;
  this.AssociationSchemaCode = config.AssociationSchemaCode || '';
};
// 报表部件
export const ReportWidget = function a(config) {
  this.ObjectId = config.ObjectId || '';
  this.Code = config.Code || '';
  this.DisplayName = config.DisplayName || '';
  this.WidgetType = config.WidgetType;
  this.ColumnTitle = config.ColumnTitle || '';
  this.RowTitles = config.RowTitles || [];
  this.Columns = config.Columns || [];
  this.SortColumns = config.SortColumns || [];
  this.Categories = config.Categories || [];
  this.Series = config.Series || [];
  this.AxisDimension = config.AxisDimension || '';
  this.XAxisUnit = config.XAxisUnit || '';
  this.YAxisUnit = config.YAxisUnit || '';
  this.IsUseSql = config.IsUseSql || false;
  this.CommandText = config.CommandText || '';
  this.SchemaCode = config.SchemaCode || '';
  this.ReportSourceAssociations = config.ReportSourceAssociations || [];
  this.IsSubSheet = config.IsSubSheet || false;
  this.Exportable = config.Exportable || false;
  this.Layout = config.Layout || DefaultOptions.ReportLayout.OneColumn;
  this.LinkageReports = config.LinkageReports || ['7b125659-d4bd-4bfa-8fbd-d17043b9903f'];// [];
  this.SourceFilters = config.SourceFilters || [];
  this.ReportWidgetSimpleBoard = config.ReportWidgetSimpleBoard || [];
  this.FrozenHeaderType = config.FrozenHeaderType ||
                          DefaultOptions.ReportFrozenHeaderType.FrozenNone;
  this.SimpleBoardRowNumber = config.SimpleBoardRowNumber || 0;
  this.SimpleBoardColumnNumber = config.SimpleBoardColumnNumber || 0;
  // 临时存储sql的列
  this.SqlColumns = [];
};
// 报表部件,简易看板
export const ReportWidgetSimpleBoard = function a(config) {
  this.ObjectId = config.ObjectId || '';
  this.Code = config.Code || '';
  this.DisplayName = config.DisplayName || '';
  this.WidgetType = config.WidgetType;
  this.ColumnTitle = config.ColumnTitle || '';
  this.RowTitles = config.RowTitles || [];
  this.Columns = config.Columns || [];
  this.SortColumns = config.SortColumns || [];
  this.Categories = config.Categories || [];
  this.Series = config.Series || [];
  this.AxisDimension = config.AxisDimension || '';
  this.XAxisUnit = config.XAxisUnit || '';
  this.YAxisUnit = config.YAxisUnit || '';
  this.IsUseSql = config.IsUseSql || false;
  this.CommandText = config.CommandText || '';
  this.SchemaCode = config.SchemaCode || '';
  this.ReportSourceAssociations = config.ReportSourceAssociations || [];
  this.IsSubSheet = config.IsSubSheet || false;
  this.Exportable = config.Exportable || false;
  this.Layout = config.Layout || DefaultOptions.ReportLayout.OneColumn;
  this.LinkageReports = config.LinkageReports || [];
  this.SourceFilters = config.SourceFilters || [];
  // 临时存储sql的列
  this.SqlColumns = [];
};
export const ReportWidgetColumn = function a(config) {
  this.ObjectId = config.ObjectId || '';
  this.ColumnCode = config.ColumnCode || '';
  this.ColumnName = config.ColumnName || '';
  this.DisplayName = config.DisplayName || '';
  this.ColumnType = config.ColumnType;
  this.Sortable = config.Sortable || false;
  this.Ascending = config.Ascending || false;
  this.FunctionType = config.FunctionType || DefaultOptions.Function.Sum;
  this.Format = config.Format || '';
  // this.AssociationMappings = config.AssociationMappings,
  this.AssociationType = config.AssociationType;
  this.AssociationSchemaCode = config.AssociationSchemaCode;
};
export const Format = {
  yyyyMMdd: 'yyyy-MM-dd',
  yyMMdd: 'yy-MM-dd',
  yyMM: 'yy-MM',
  yy: 'yy',
};
export const ReportSourceAssociation = function a() {
  this.RootSchemaCode = '';
  this.MasterField = '';
  this.SchemaCode = '';
  this.SubField = '';
  this.Mode = null;
  this.IsSubSheet = false;
};
