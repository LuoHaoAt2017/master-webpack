import fetch from './fetch';

const baseActionName = 'DoAction';

export const postForm = (actionName, postValue, isAsync = true) => {
  const paramData = Object.assign({
    // Command: actionName,
    ActionName: baseActionName,
  }, postValue);
  const params = {
    PostData: JSON.stringify(paramData),
  };
  return fetch('/Form/OnAction', params, 'POST', isAsync);
};

// 关联多选通过objectid获取关联多选表单数据
export const getFormatBizObject = (schemaCode, ObjectId) => {
  const paramData = {
    ActionName: 'GetFormatBizObject',
    SchemaCode: schemaCode,
    ObjectId,
  };
  return fetch('/Form/OnAction/', {
    PostData: JSON.stringify(paramData),
  }, 'get', false);
};

// 人员选择通过unitID获取数据
export const getMultiFormUser = (UnitID) => {
  const paramData = {
    ActionName: 'SheetUserAction',
    Command: 'GetUserProperty',
    UnitID,
  };
  return fetch('/Form/OnAction/', {
    PostData: JSON.stringify(paramData),
  }, 'post');
};

// 关联表单关联附件控件时请求数据
export const GetMappingFilesData = (SchemaCode, BizObjectId, PropertyName) => {
  const paramData = {
    ActionName: 'GetMappingFiles',
    SchemaCode,
    BizObjectId,
    PropertyName,
    _TimeStamp: Date.now()
  };
  return fetch('/Form/OnAction/', {
    PostData: JSON.stringify(paramData),
  });
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
  return fetch('/Form/OnAction/', {
    PostData: JSON.stringify(paramData),
  }, 'post');
};

// 获取数据联动表单数据
export const getDataLinkData = (SchemaCode, Filters) => {
  const paramData = {
    ActionName: 'LoadDataLinkData',
    SchemaCode,
    Filters
  };
  return fetch('/Form/OnAction/', {
    PostData: JSON.stringify(paramData),
  }, 'post');
};

// 单人部门选项展开的数据
export const getFormUserDetail = (UnitID, UserVisible) => {
  const paramData = {
    UnitID,
    UserVisible,
    ActionName: 'LoadUnit',
  };
  return fetch('/Mobile/MobileService/OnAction', {
    PostData: JSON.stringify(paramData),
  }, 'post');
};


// 判断选项是否在下拉框的关联数据源里面
export const ContainSchemaPropertyValues = (
  SchemaCode, PropertyName, AssociationFilter, scopeType,
  SheetCode, SheetData, PropertyValue,
) => {
  const params = {
    PostData: JSON.stringify({
      ActionName: 'ContainSchemaPropertyValue',
      SchemaCode,
      PropertyName,
      AssociationFilter: !AssociationFilter ? '' : AssociationFilter,
      scopeType,
      SheetCode,
      SheetData,
      PropertyValue,
    }),
  };
  return fetch('/App/OnAction/', params, 'post');
};

export const f = () => {};
