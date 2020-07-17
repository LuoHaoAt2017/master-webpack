export enum LightListActionType {
  GetFormDataLists = 'getFormDataLists'
}
export enum LightListMutationType {
  HandleFormDataLists = 'handleFormDataLists',
  HandleResetListData = 'handleResetListData',
  HandleRealSearchRows = 'handleRealSearchRows', //实时搜索词处理
  HandleSortSelectedCode = 'HandleSortSelectedCode', //处理排序控件code
  HandleSortSelectedType = 'handleSortSelectedType', //处理排序控件类型升序降序
  HandleIsSortReset = 'handleIsSortReset', //处理是否重置
}
