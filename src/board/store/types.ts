/**
 * 看板action类型
 */
export const enum BoardActionType {
  InitData = 'InitData',
  GetBoardColumnDatas = 'GetBoardColumnDatas',
  InitBoard = 'InitBoard',
  RemoveColumn = 'RemoveColumn',
  AddColumn = 'AddColumn',
  SortStack = 'SortStack',
  SortCard = 'SortCard',
  GetNewForm = 'GetNewForm', // 单独请求新加的记录
  UpdateCard = 'UpdateCard',
  ReplaceForm = 'ReplaceForm',
  EditCard = 'EditCard', // 表单编辑（新增、编辑）
  ChangeDisplayMode = 'ChangeDisplayMode', // 设置主视图
};

/**
 * 看板操作mutation类型
 */
export const enum BoardMutationType {
  InitData = 'InitData',

  SetBoardDataSetting = 'SetBoardDataSetting',

  SetBoardColumnDatas = 'SetBoardColumnDatas',

  InitColumnDatas = 'InitColumnDatas',
  FixedSideChange='FixedSideChange',
  CoverChange='CoverChange',
  ShowTitleChange='ShowTitleChange',

  BoardColumnFieldChange='BoardColumnFieldChange',

  GroupColumnChange='GroupColumnChange',

  BoardGroupConfigChange= 'BoardGroupConfigChange',

  GroupDefaultValueChange='GroupDefaultValueChange',
  AddField = 'AddField',

  AddColumn = 'AddColumn',

  SetCardTargetValue = 'SetCardTargetValue',

  RemoveForm = 'RemoveForm',

  InitDisplayColumn = 'InitDisplayColumn',

  DisplayOrder = 'DisplayOrder',

  // ToggleCollapseAll = 'ToggleCollapseAll',
  UpdateCard = 'UpdateCard',

  SortColumnsChange ='SortColumnsChange',

  ResetColorSetting = 'ResetColorSetting',
  IsFixedDefaultChange ='IsFixedDefaultChange',
  ResetFilterSetting = 'ResetFilterSetting',
  ResetBoard = 'ResetBoard',
  CorrectFilterColumns = 'CorrectFilterColumns', // 修正过滤规则
  RemoveStackData = 'RemoveStackData',
  AddStackData = 'AddStackData',
  SetFormEditingInfo = 'SetFormEditingInfo'
};
