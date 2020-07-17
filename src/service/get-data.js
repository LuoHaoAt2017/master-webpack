// zyq;
import fetch from '../config/fetch';

/**
 * 获取应用是否安装完成
 */
export const isInstalledOK = (solutionCode) => {
  const paramData = {
    ActionName: 'IsInstalledOK',
    SolutionCode: solutionCode,
  };
  return fetch(
    '/Mobile/MobileService/OnAction', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};
/**
 * 获取首页默认地址
 */

/**
 * 获取新版移动端首页数据
 * @param {*} appCode
 * @param {*} solutionCode
 * @param {*} appType
 */
export const getApproveItems = (appCode, solutionCode, appType) => {
  const paramData = {
    ActionName: 'GetApproveItems',
    SolutionCode: solutionCode,
    AppCode: appCode,
    AppType: appType,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

/**
 * 获取应用数据
 * @param {*} appCode
 * @param {*} solutionCode
 * @param {*} appType
 */
export const getAppDatas = (
  appCode,
  solutionCode,
  appType,
  includeReport = true,
  workflowOnly = false,
) => {
  const paramData = {
    ActionName: 'QueryAppsDatas',
    SolutionCode: solutionCode,
    AppCode: appCode,
    AppType: appType,
    IncludeReport: includeReport,
    WorkflowOnly: workflowOnly,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

/**
 * 获取分组菜单
 * @param {*} appCode
 * @param {*} solutionCode
 * @param {*} appType
 * @param {*} includeReport
 */
export const getMobileAppGroups = (appCode, solutionCode, appType, includeReport, isSetting) => {
  const paramData = {
    ActionName: 'GetMobileAppGroups',
    SolutionCode: solutionCode,
    AppCode: appCode,
    AppType: appType,
    HasReport: includeReport,
    Setting: isSetting,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

/**
 * 设置用户的常用表单
 * @param {*} solutionCode
 * @param {*} functionNodes
 */
export const setUserFavoriteFunctions = (solutionCode, functionNodes) => {
  const paramData = {
    ActionName: 'SetUserFavoriteFunctions',
    SolutionCode: solutionCode,
    FunctionNodes: functionNodes,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

/**
 * 获取流程追踪数据
 * @param {*} solutionCode
 * @param {*} appCode
 * @param {*} appType
 */
export const getWorkflowTrace = (appCode, solutionCode, appType) => {
  const paramData = {
    ActionName: 'GetWorkflowTrace',
    SolutionCode: solutionCode,
    AppCode: appCode,
    AppType: appType,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};
/**
 * 更改流程实例提醒状态
 * @param {*} instanceId
 */
export const changeInstanceRemindState = (instanceId) => {
  const paramData = {
    ActionName: 'ChangeInstanceRemindState',
    InstanceId: instanceId,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

/**
 * 催办
 * @param {*} instanceId
 */
export const urge = (instanceId, content) => {
  const paramData = {
    ActionName: 'Urge',
    InstanceId: instanceId,
    Content: content,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

// 获取表单列表id
export const getLastBizObjectIdBySchema = (schemaCode) => {
  const paramData = {
    SchemaCode: schemaCode,
    ActionName: 'GetLastBizObjectIdBySchema',
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

// 从表单首页跳转到表单页面
export const initSheetHomeFormData = (
  isMobile,
  sheetCode,
  schemaCode,
  mappingDataField,
  ObjectId,
  name,
) => {
  const paramData = {
    isMobile,
    SheetCode: sheetCode,
    SchemaCode: schemaCode,
    MappingDataField: mappingDataField,
    ObjectId,
    ActionName: 'MobileLoadSheet',
    BOName: name,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

export const getFormUser = (params) => {
  const param = {
    PostData: JSON.stringify(params),
  };
  return fetch('/Mobile/MobileService/OnAction/', param, 'post');
};
// 单人部门选项展开数据
export const getFormUserDetail = (UnitID, UserVisible, UnitSelectionRange = '') => {
  const paramData = {
    UnitID,
    UserVisible,
    ActionName: 'LoadUnit',
    UnitSelectionRange,
  };
  return fetch(
    '/Mobile/MobileService/OnAction', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

// 获取多人部门返回数据
export const getMultiFormUser = (UnitID) => {
  const paramData = {
    ActionName: 'SheetUserAction',
    Command: 'GetUserProperty',
    UnitID,
  };
  return fetch(
    '/Form/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

// 提交表单数据
export const postFormData = (url, data, async) => fetch(url, data, 'post', 'fetch', async);

// 列表自定义按钮提交数据
export const doActionData = data => fetch('/App/OnAction/', data, 'post');

// 获取列表数据
export const getAppMenuData = (
  listScene,
  code,
  pageIndex,
  scopeType,
  from,
  to,
  status,
  FirstLoad,
  sheetQuery,
  sortfield,
  desc,
  schemaCode = '',
  boSchemaCode = '',
  dataField = '',
  sheetData = '',
  limit = 15,
  isExternal = false,
) => {
  const offset = pageIndex * limit;
  const params = {
    limit,
    offset,
    scopeType,
    from,
    to,
    SheetCode: schemaCode,
    BoSchemaCode: boSchemaCode,
    DataField: dataField,
    SheetData: sheetData,
    FirstLoad,
    ActionName: 'GetAppDatas',
    SchemaCode: code,
    ListScene: listScene,
    IsExternal: isExternal,
  };

  if (status) {
    params.Status = status;
  }
  if (sheetQuery) {
    params.SheetQuery = 1;
  }
  if (sortfield) {
    params.sort = sortfield;
  }
  if (desc != null) {
    if (desc) {
      params.order = 'desc';
    } else {
      params.order = 'asc';
    }
  }
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(params),
    },
    'post',
  );
};

// 根据参数过滤获取列表数据
export const getAppMenuDataByParams = params =>
  fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(params),
    },
    'post',
  );

// 获取流程和任务
export const getWorkItemsAndTasks = (
  pageIndex,
  pageSize,
  state,
  startTime,
  endTime,
  appCode,
  solutionCode,
  filterType,
  isMyStart,
  originator,
  workItemType,
  ActionName,
  SchemaCode,
  WorkCriticalLevel,
  OrderBy,
  WorkItemState,
  SearchKey,
  WorkflowInstanceState,
) => {
  const params = {
    PageIndex: pageIndex,
    PageSize: pageSize,
    State: state,
    From: startTime,
    To: endTime,
    IsMyStart: isMyStart,
    FilterType: filterType,
    Originator: originator,
    AppCode: appCode,
    SolutionCode: solutionCode,
    // WorkflowState: WorkflowState,
    WorkItemType: workItemType,
    ActionName,
    SchemaCode,
    WorkCriticalLevel,
    OrderBy,
    WorkItemState,
    SearchKey,
    WorkflowInstanceState,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(params),
    },
    'post',
  );
};

// 获取我发起的
// export const getOriginatorWorkflowsAndTasks = (
//   pageIndex, pageSize, startTime, endTime,
//   appCode, solutionCode, filterType, originator,
// ) => {
//   const params = {
//     PageIndex: pageIndex,
//     PageSize: pageSize,
//     From: startTime,
//     To: endTime,
//     FilterType: filterType,
//     Originator: originator,
//     AppCode: appCode,
//     SolutionCode: solutionCode,
//     ActionName: 'QueryOriginatorWorkflowAndTasks',
//   };
//   return fetch('/Mobile/MobileService/OnAction/', {
//     PostData: JSON.stringify(params),
//   }, 'post');
// };

// 同意流程
export const getApproveWorkflow = (id, workflowcode, workflowversion, instanceid, bizObjectId) => {
  const paramData = {
    ActionName: 'Approve',
    WorkItemId: id,
    WorkflowCode: workflowcode,
    SchemaCode: workflowcode,
    WorkflowVersion: workflowversion,
    InstanceId: instanceid,
    BizObjectId: bizObjectId,
  };
  return fetch(
    '/Mobile/MobileService/OnAction', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

// 不同意流程
export const getRejectWorkflow = (
  id,
  workflowcode,
  workflowversion,
  instanceid,
  bizObjectId,
  comment,
) => {
  const paramData = {
    ActionName: 'Retrieve',
    WorkItemId: id,
    WorkflowCode: workflowcode,
    SchemaCode: workflowcode,
    WorkflowVersion: workflowversion,
    InstanceId: instanceid,
    BizObjectId: bizObjectId,
    Comment: comment,
  };
  return fetch(
    '/Mobile/MobileService/OnAction', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

// 打开流程
export const GetBoEnableSheetHome = (SchemaCode, BizObjectId) => {
  const paramData = {
    ActionName: 'GetBoEnableSheetHome',
    SchemaCode,
    BizObjectId,
  };
  return fetch(
    '/Mobile/MobileService/OnAction', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};
// 执行
// export const SetTaskTipFinish = (ObjectId) => {
//   const paramData = {
//     ActionName: 'SetTaskTipFinish',
//     ObjectId,
//   };
//   return fetch('/Mobile/MobileService/OnAction/', {
//     PostData: JSON.stringify(paramData),
//   }, 'post');
// };

// 获取表单首页收据
export const loadHomeData = (schemaCode, bizObjectId) => {
  const params = {
    ActionName: 'LoadSheetHomeData',
    SheetCode: schemaCode,
    BizObjectId: bizObjectId,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(params),
    },
    'post',
  );
};
/**
 * 统计评论数量
 * @param {*} bizObjectId
 */
export const countSNSPostByBizObjectId = (bizObjectId) => {
  const params = {
    ActionName: 'CountSNSPostByBizObjectId',
    BizObjectId: bizObjectId,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(params),
    },
    'post',
  );
};
// 获取表单首页SNS
export const loadSnsData = (bizObjectId) => {
  const jsonStr = JSON.stringify({
    ActionName: 'GetSNSPost',
    bizObjectId,
  });
  // console.log(jsonStr);
  const params = {
    PostData: jsonStr,
  };
  return fetch('/Form/OnAction/', params, 'post');
};

// 获取评论艾特的时候人员
export const getCommentMentionUser = (SchemaCode, OwnerId) => {
  return fetch('/Form/OnAction', {
    PostData: JSON.stringify({
      ActionName: 'SheetUserAction',
      SchemaCode,
      Command: 'LoadOwnSchemaPermitUnits',
      OwnerId,
    }),
  }, 'POST');
};

/**
 * 分页获取表单评论数据
 * @param {*} bizObjectId
 * @param {*} pageIndex
 */
export const loadPageSNSDataByBizObjectId = (schemaCode, bizObjectId, pageIndex) => {
  const params = JSON.stringify({
    ActionName: 'LoadPageSNSDataByBizObjectId',
    SchemaCode: schemaCode,
    BizObjectId: bizObjectId,
    PageIndex: pageIndex,
  });
  return fetch('/Mobile/MobileService/OnAction/', {
    PostData: params,
  }, 'post');
};
/**
 * 获取表单首页关联列表
 * @param {*} schemaCode
 * @param {*} bizObjectId
 * @param {*} fieldName
 * @param {*} pageIndex
 */
export const loadAssoBos = (schemaCode, bizObjectId, fieldName, pageIndex) => {
  const params = {
    ActionName: 'GetAssociationBoList',
    SchemaCode: schemaCode,
    BizObjectId: bizObjectId,
    AssociationField: fieldName,
    PageIndex: pageIndex,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(params),
    },
    'post',
  );
};
// 获取表单首页任务数据
export const loadTaskData = (bizObjectId) => {
  const paramData = {
    ActionName: 'GetTaskTipByCode',
    code: bizObjectId,
  };
  return fetch(
    '/FormTaskTips/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};
// 首页报表
export const loadHomeReportWidget = (reportId, widgetId) => {
  const paramData = {
    ReportId: reportId,
    ReportWidgetId: widgetId,
    ActionName: 'GetReportWidgetAndOtherInf',
  };
  return fetch('/Mobile/MobileService/OnAction', {
    PostData: JSON.stringify(paramData),
  }, 'post');
};
// 添加动态
export const addSnsPost = (text, fileIds, sheetCode, bizObjectId, ownerId, notificationContent, userIds = '') => {
  const paramData = {
    ActionName: 'NewAddSNSPost',
    text,
    fileIds,
    schemaCode: sheetCode,
    bizObjectId,
    userIds: userIds,
    ownerId,
    notificationContent,
  };
  return fetch(
    '/Form/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

// 添加评论
export const addComment = (
  replyTo,
  text,
) => {
  const paramData = {
    ActionName: 'AddSNSComment',
    targetId: replyTo,
    text,
  };
  return fetch('/Form/OnAction/', {
    PostData: JSON.stringify(paramData),
  });
};

export const addPostLike = (schemaCode, bizObjectId, postId) => {
  const paramData = {
    ActionName: 'LikePost',
    schemaCode,
    bizObjectId,
    postId,
  };
  return fetch('/Form/OnAction/', {
    PostData: JSON.stringify(paramData),
  });
};
// 关联表单通过objectid获取关联表单数据
export const getFormatBizObject = (schemaCode, ObjectId) => {
  const paramData = {
    ActionName: 'GetFormatBizObject',
    SchemaCode: schemaCode,
    ObjectId,
  };
  return fetch(
    '/Form/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'get',
    false,
  );
};
// export const getFormatBizObject = (schemaCode, ObjectId) => {
//     let paramData = {
//         ActionName: 'GetFormatBizObject',
//         SchemaCode: schemaCode,
//         ObjectId: ObjectId
//     };
//     return fetch('/Form/OnAction/', {
//         PostData: JSON.stringify(paramData)
//     }, 'get');
// };
// 关联属性获取数据判断是否是子表
export const confirmQueryFormData = (SchemaCode) => {
  const paramData = {
    ActionName: 'CheckChildSchema',
    SchemaCode,
  };
  return fetch(
    '/Form/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};
// 关联表单时获取关联子表数据
export const getChildSheetData = (TargetChild, SchemaCode, BizObjectId, PropertyName) => {
  const paramData = {
    ActionName: 'GetChildSchemaDataByObjectId',
    TargetChild,
    SchemaCode,
    BizObjectId,
    PropertyName,
  };
  return fetch(
    '/Form/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};
// 关联表单关联附件控件时请求数据
export const GetMappingFilesData = (SchemaCode, BizObjectId, PropertyName) => {
  const paramData = {
    ActionName: 'GetMappingFiles',
    SchemaCode,
    BizObjectId,
    PropertyName,
    _TimeStamp: Date.now(),
  };
  return fetch('/Form/OnAction/', {
    PostData: JSON.stringify(paramData),
  });
};

/**
 * 迭代二十六新功能 关联表单是否可新增权限
 */
export const LoadSchemaAcls = (SchemaCodes) => {
  return fetch('/Form/OnAction/', {
    PostData: JSON.stringify({
      ActionName: 'LoadSchemaAcls',
      SchemaCodes: [SchemaCodes],
      SharingKey: '',
      EngineCode: '',
    }),
  }, 'Post');
};

// 获取筛选组件页面渲染数据
export const getFilterData = (code) => {
  const paramData = {
    ActionName: 'GetPropertyQueryColumnAndItem',
    SchemaCode: code,
  };
  return fetch('/Form/OnAction/', {
    PostData: JSON.stringify(paramData),
  });
};

export const getInstanceState = (workflowCode, instanceId, bizObjectId, workflowversion) => {
  const paramData = {
    PostData: JSON.stringify({
      ActionName: 'GetInstanceState',
      WorkflowCode: workflowCode,
      BizObjectId: bizObjectId,
      InstanceId: instanceId,
      WorkflowVersion: workflowversion,
    }),
  };

  return fetch('/Mobile/MobileService/OnAction', paramData);
};
// 获取任务详情数据
export const getTaskByTaskId = (taskId) => {
  const paramData = {
    ActionName: 'GetTaskByTaskId',
    TaskId: taskId,
  };
  return fetch(
    '/FormTaskTips/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};
// 获取上一次签名url
export const getUserRecentSignature = () => {
  const paramData = {
    ActionName: 'GetUserRecentSignature',
    IsMobile: true,
  };
  return fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify(paramData),
    },
    'get',
  );
};
// 转发时获取单人部门数据
export const getForwardFormUser = () => {
  const paramData = {
    UserVisible: true,
    ActionName: 'LoadUnit',
  };
  return fetch('/Mobile/MobileService/OnAction', {
    PostData: JSON.stringify(paramData),
  });
};
// 分享报表
export const shareReport = (reportCode, widgetId, reportId, title, text, cid, img) => {
  const params = {
    PostData: JSON.stringify({
      ActionName: 'ShareReport',
      ReportCode: reportCode,
      WidgetId: widgetId,
      ReportId: reportId,
      title,
      text,
      cid,
      image: img,
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params, 'POST');
};
// 获取排序列表数据
export const getSortItems = (SchemaCode, IsWorkflow) => {
  const params = {
    PostData: JSON.stringify({
      ActionName: 'GetSortItems',
      SchemaCode,
      IsWorkflow,
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params, 'post');
};

// 添加任务
export const addTask = (
  schemaCode,
  targetId,
  userId,
  title,
  content,
  remindType,
  remindTime,
  startTime,
) => {
  const params = {
    PostData: JSON.stringify({
      ActionName: 'PostTask',
      SchemaCode: schemaCode,
      TargetId: targetId,
      UserId: userId,
      Title: title,
      Content: content,
      RemindType: remindType,
      RemindTime: remindTime,
      StartTime: startTime,
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params);
};

// 获x下拉框关联表单数据
export const GetSchemaPropertyValues = (
  SchemaCode,
  SearchKey,
  PropertyName,
  FromRowNum,
  ToRowNum,
  AssociationFilter,
  scopeType,
  SheetCode,
  SheetData,
) => {
  const params = {
    PostData: JSON.stringify({
      ActionName: 'LoadSchemaPropertyValues',
      SchemaCode,
      SearchKey,
      PropertyName,
      FromRowNum,
      ToRowNum,
      AssociationFilter: !AssociationFilter ? '' : AssociationFilter,
      scopeType,
      SheetCode,
      SheetData,
    }),
  };
  return fetch('/App/OnAction/', params, 'post');
};

// 关联表单扫码获取数据
export const GetQueryDataByScan = (scanParams) => {
  const params = {
    PostData: JSON.stringify(scanParams),
  };
  return fetch('/Mobile/MobileService/OnAction/', params, 'post');
};

/**
 * 获取应用待办任务数量
 * @param {*} appCode
 * @param {*} solutinCode
 */
export const GetHomeWorkflows = (appCode, solutinCode, onlyShowTaskCount) => {
  const params = {
    PostData: JSON.stringify({
      ActionName: 'GetMyUnfinishedQuantity',
      AppCode: appCode,
      SolutionCode: solutinCode,
      OnlyShowTaskCount: onlyShowTaskCount,
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params, 'post');
};

/**
 *
 * @param {*} appCode
 * @param {*} solutinCode
 */
export const CountHomeWorkflows = (appCode, solutinCode) => {
  const params = {
    PostData: JSON.stringify({
      ActionName: 'GetHomeWorkflows',
      AppCode: appCode,
      SolutionCode: solutinCode,
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params, 'post');
};

// 搜索接口
export const searchUser = (Keyword, FilterType, ShowUnActive, UnitSelectionRange) => {
  const params = {
    PostData: JSON.stringify({
      ActionName: 'FilterUnit',
      Keyword,
      FilterType,
      ShowUnActive,
      UnitSelectionRange,
      FromRow: 0,
      EndRow: 1000,
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params, 'post');
};

/**
 * 获取流程状态图信息
 * @param {*} workflowCode
 * @param {*} instanceId
 */
export const getInstanceGraph = (workflowCode, instanceId) => {
  const params = {
    PostData: JSON.stringify({
      ActionName: 'GetInstanceGraph',
      SchemaCode: workflowCode,
      InstanceId: instanceId,
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params);
};

/**
 * 获取分享
 * @param {*} schemaCode
 * @param {*} bizObjectId
 * @param {*} appCode
 */
export const getQrCodeUrl = (schemaCode, bizObjectId, appCode) => {
  const params = {
    PostData: JSON.stringify({
      ActionName: 'GetQrCode',
      SchemaCode: schemaCode,
      BizObjectId: bizObjectId,
      AppCode: appCode,
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params);
};

/**
 * 获取应用或者平台的流程表单
 * @param {*} appCode
 * @param {*} solutionCode
 */
// export const QueryWorkflowSheets = (appCode, solutionCode) => {
//   const params = {
//     PostData: JSON.stringify({
//       ActionName: 'QueryWorkflowSheets',
//       AppCode: appCode,
//       SolutionCode: solutionCode,
//     }),
//   };
//   return fetch('/Mobile/MobileService/OnAction/', params, 'post');
// };

/**
 * 分享链接
 * @param {*} schemaCode
 * @param {*} bizObjectId
 * @param {*} targetId
 * @param {*} title
 * @param {*} text
 * @param {*} cid
 */
export const shareSheet = (schemaCode, bizObjectId, targetId, title, text, cid) => {
  const params = {
    PostData: JSON.stringify({
      ActionName: 'ShareSheet',
      SchemaCode: schemaCode,
      BizObjectId: bizObjectId,
      TargetId: targetId,
      Title: title,
      Text: text,
      Cid: cid,
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params, 'post');
};
// 获取单据类型
export const getItemSheets = (ActionName, WorkItemType, WorkItemState, solutionCode, appCode) => {
  const params = {
    PostData: JSON.stringify({
      ActionName,
      WorkItemType,
      WorkItemState,
      SolutionCode: solutionCode,
      AppCode: appCode,
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params, 'post');
};
/**
 * 获取文件预览url
 * @param {*} fileId
 */
export const getPreviewFileUrl = fileId =>
  fetch(`/Form/MobilePreView?attachmentId=${fileId}`, {}, 'post');

export const getSnsPreviewFileUrl = fileId =>
  fetch(`/Form/MobileSnsPreview?attachmentId=${fileId}`, {}, 'post');

export const getInstanceStateInfos = (instanceId, schemaCode) => {
  const params = {
    PostData: JSON.stringify({
      InstanceId: instanceId,
      SchemaCode: schemaCode,
      ActionName: 'GetInstanceStateInfos',
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params, 'post');
};

export const getPersonalCenterData = (solutionCode, suiteKey) => {
  const params = {
    PostData: JSON.stringify({
      SolutionCode: solutionCode,
      SuiteKey: suiteKey,
      ActionName: 'GetPersonalCenterData',
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params);
};

export const getSolutionServicePackages = () => {
  const params = {
    PostData: JSON.stringify({
      ActionName: 'GetSolutionServicePackages',
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params);
};

// 单个已阅
export const Circulate = (id, workflowcode, workflowversion, instanceid, bizObjectId) => {
  const paramData = {
    ActionName: 'Circulate',
    WorkItemId: id,
    WorkflowCode: workflowcode,
    SchemaCode: workflowcode,
    WorkflowVersion: workflowversion,
    InstanceId: instanceid,
    BizObjectId: bizObjectId,
  };
  return fetch(
    '/Mobile/MobileService/OnAction', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

// 部分已阅
export const CirculateMultiItem = (items) => {
  const paramData = {
    ActionName: 'FinishCirculateByIds',
    WorkItemIds: items,
  };
  return fetch(
    '/Mobile/MobileService/OnAction', {
      PostData: JSON.stringify(paramData),
    },
    'post',
  );
};

// 抄送我的全部已阅接口
export const finishAllCirculate = (solutionCode, appCode) => {
  const params = {
    PostData: JSON.stringify({
      SolutionCode: solutionCode,
      AppCode: appCode,
      ActionName: 'FinishAllCirculate',
    }),
  };
  return fetch('/Mobile/MobileService/OnAction/', params);
};

/**
 * 获取业务场景
 */
export const getBusinessSceneList = () =>
  fetch('/Guide/OnAction', {
    PostData: JSON.stringify({
      ActionName: 'GetBusinessSceneList',
    }),
  });

/**
 * 根据业务场景获取推荐列表
 */
export const getRecommendListByBusinessScene = Code =>
  fetch('/Guide/OnAction', {
    PostData: JSON.stringify({
      ActionName: 'GetRecommendListByBusinessScene',
      Code,
    }),
  });

/**
 * 获取行业/业务选择列表
 * type 1 行业 2 业务
 */
export const getIndustryList = type =>
  fetch('/Guide/OnAction', {
    PostData: JSON.stringify({
      ActionName: 'GetCategoryList',
      Type: type,
    }),
  });

/**
 * 获取推荐列表
 */
export const getRecommendList = (industry, businesses, PageIndex, PageSize) => {
  const business = businesses.join(';');
  return fetch('/Guide/OnAction', {
    PostData: JSON.stringify({
      ActionName: 'GetRecommendList',
      Industry: industry,
      Business: business,
      PageIndex,
      PageSize,
    }),
  });
};

/**
 * 安装推荐应用
 * appcode 模板应用编码
 * isTrial 是否试用
 * industry 行业
 * business 业务
 */
export const install = (appCode, isTrial, businessScene) => {
  return fetch('/Guide/OnAction', {
    PostData: JSON.stringify({
      ActionName: 'InstallApp',
      AppCode: appCode,
      IsTrial: isTrial,
      BusinessScene: businessScene,
    }),
  });
};

/**
 * 保存引导选择的业务场景
 */
export const saveGuideSelectionBusinessScene = BusinessScene =>
  fetch('/Guide/OnAction', {
    PostData: JSON.stringify({
      ActionName: 'SaveGuideSelectionBusinessScene',
      BusinessScene,
    }),
  });

/**
 * 更新引导加载状态
 */
export const updateGuideState = () =>
  fetch('/Guide/OnAction', {
    PostData: JSON.stringify({
      ActionName: 'UpdateGuideState',
    }),
  });

/**
 * 更新引导状态
 * industry 行业
 * business 业务
 */
export const saveGuideSelectionInfo = (industry, business) => {
  const bus = business.join(';');
  return fetch('/Guide/OnAction', {
    PostData: JSON.stringify({
      ActionName: 'SaveGuideSelectionInfo',
      Industry: industry,
      Business: bus,
    }),
  });
};

// 获取短链地址
export const getShortUrl = originalUrl => {
  // bo 有可能出现中文
  const encodeUrl = originalUrl.replace(/(&|\?)bo=([^&]*)?/, (sub, $1, $2) => {
    return $1 + 'bo=' + encodeURIComponent($2 || '');
  });
  return fetch(
    '/Form/OnAction', {
      PostData: JSON.stringify({
        ActionName: 'GetShortUrl',
        OriginalUrl: encodeUrl,
      }),
    },
    'POST',
  );
};

// 获取原始链接地址
export const getOriginalUrl = shortUrl => {
  return fetch(
    '/Form/OnAction', {
      PostData: JSON.stringify({
        ActionName: 'GetOriginalUrl',
        ShortUrl: shortUrl,
      }),
    },
    'POST',
  );
};

export const getServerTimeStamp = () =>
  fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify({
        ActionName: 'GetServerTimeStamp',
      }),
    },
    'POST',
  );

export const checkInvitationCode = param => fetch('/WebApi/api/InvitedLog', param, 'POST');
// 流程审批页面获取过期，数量限制等信息
export const getLicenseFilter = schemaCode =>
  fetch(
    '/Mobile/MobileService/OnAction/', {
      PostData: JSON.stringify({
        ActionName: 'GetLicenseFilter',
        SchemaCode: schemaCode,
      }),
    },
    'POST',
  );

export const getShareUrl = (schemaCode, bizObjectId) => fetch('/FormExternal/OnAction', {
  PostData: JSON.stringify({
    ActionName: 'GetShareUrl',
    SchemaCode: schemaCode,
    BizObjectId: encodeURIComponent(bizObjectId),
  }),
}, 'POST');
// 下载图片预览的uuid
// export const GetDownloadFileUUIDs = attachmentIds =>
//   fetch(`Form/GetDownloadFileUUIDs/?AttachmentIdStr=${attachmentIds}`, {}, 'post');
export const GetDownloadFileUUIDs = attachmentIds =>
  fetch('Form/GetDownloadingFileUUIDs', {
    PostData: JSON.stringify({
      AttachmentIdStr: attachmentIds,
    }),
  }, 'post');
