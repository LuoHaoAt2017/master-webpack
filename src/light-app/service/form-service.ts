import lightAppFetch from './fetch';
import Response = H3.Http.LightAppResponse;
import LightApp = H3.LightApp;

/**
 * 获取明细表编码
 */
export const getGridViewCode = () =>
  lightAppFetch<Response<LightApp.CreateLightAppData>>(
    'lightapi/sheets/subsheetcode',
    {},
    'GET'
  );

/**
 * 创建一个表单
 */
export const createForm = ({
  displayName,
  appCode,
  formControls,
  visibility
}) =>
  lightAppFetch<Response<LightApp.CreateLightAppData>>(
    'lightapi/sheets',
    {
      displayName,
      appCode,
      formControls,
      visibility
    },
    'POST'
  );

/**
 * 获取表单控件
 */
export const getFormControls = ({ sheetCode }) =>
  lightAppFetch<Response<LightApp.FormControlsData>>(
    `lightapi/sheets/${sheetCode}/controls`,
    {},
    'GET'
  );

/**
 * 更新应用表单
 */
export const updateForm = ({
  code,
  appCode,
  displayName,
  formControls,
  visibility
}) =>
  lightAppFetch<Response<null>>(
    `/lightapi/sheets`,
    { code, appCode, displayName, formControls, visibility },
    'PUT'
  );

/**
 * 更新应用表单名称
 */
export const updateFormName = ({ code, displayName }) =>
  lightAppFetch<Response<null>>(
    `/lightapi/sheets`,
    { code, displayName },
    'PATCH'
  );

/**
 * 表单列表页重命名选中表单
 */
export const renameLightSheet = ({ displayName, code, appCode }) =>
  lightAppFetch<Response<null>>(
    `/lightapi/sheets`,
    {
      displayName,
      code,
      appCode
    },
    'PATCH'
  );

/**
 * 创建轻应用
 */
export const createLightApp = ({ displayName, icon }) =>
  lightAppFetch<Response<LightApp.CreateLightAppData>>(
    'lightapi/apps',
    {
      displayName,
      icon
    },
    'POST'
  );

/**
 * 删除应用
 */
export const deleteLightAPP = (appCode: string) =>
  lightAppFetch<Response<null>>(`/lightapi/apps/${appCode}`, {}, 'DELETE');

/**
 * 获取应用表单数据
 */
export const getAppForm = (appCode: string) =>
  lightAppFetch<Response<LightApp.GetAppFormData>>(
    `/lightapi/apps/${appCode}/sheets`,
    {},
    'GET'
  );
/**
 * 表单列表页删除选中表单
 */
export const deleteLightSheet = (SheetCode: string) =>
  lightAppFetch<Response<LightApp.AppContentReturnData>>(
    `/lightapi/sheets/${SheetCode}`,
    {},
    'DELETE'
  );

/**
 * 表单分享
 */
export const shareLightSheet = (SheetCode: string) =>
  lightAppFetch<Response<null>>(
    `/lightapi/sheets/share/${SheetCode}`,
    {},
    'GET'
  );
/**
 * 关联表单
 */
export const getAssociatedApps = (params?: any) => {
  params = Object.assign(
    {
      AppPackage: null,
      AppGroup: null,
      AppMenu: null,
      ParentCode: null,
      SchemaCode: null,
      BOSchemaCode: null
    },
    params
  );
  let {
    AppPackage,
    AppGroup,
    AppMenu,
    ParentCode,
    SchemaCode,
    BOSchemaCode
  } = params;
  AppPackage = AppPackage || null;
  AppGroup = AppGroup || null;
  AppMenu = AppMenu || null;
  ParentCode = ParentCode || null;
  SchemaCode = SchemaCode || null;
  BOSchemaCode = BOSchemaCode || null;
  return lightAppFetch<Response<null>>(
    `lightapi/apps/association/${AppPackage}/${AppGroup}/${AppMenu}/${ParentCode}/${BOSchemaCode}`,
    {},
    'GET'
  );
};
/**
 * 关联表单搜索
 */
export const searchAssociation = (searchKey: string = '') =>
  lightAppFetch<Response<null>>(
    `lightapi/apps/association/${searchKey || "''"}`,
    {},
    'GET'
  );
