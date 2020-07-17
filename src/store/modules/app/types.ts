export enum AppActionType {
  GetAppList = 'getAppList',
  GetAppSchemas = 'getAppSchemas',
  // 轻应用
  DelSheet = 'delSheet',
  GetFormFreeFlow = 'getFormFreeFlow'
}

export enum AppMutationType {
  HandleAppList = 'handleAppList',
  HandleSchemaList = 'handleSchemaList',
  HandleAppTitle = 'handleAppTitle',
  // 轻应用
  HandleIsLightApp = 'handleIsLightApp',
  HandleDelSheet = 'handleDelSheet',
  DelSheetIndex = 'delSheetIndex',
  HandleRenameSheetsIndex = 'handleRenameSheetsIndex',
  HandleUpdataSheets = 'handleUpdataSheets'
}
