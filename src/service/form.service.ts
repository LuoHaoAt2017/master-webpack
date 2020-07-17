import fetch from '@/config/fetch';
import lightAppFetch from '@/light-app/service/fetch';
import Response = H3.Http.Response;
import Response2 = H3.Http.LightAppResponse; // 轻应用Response
import Form = H3.Form;

// 初始化获取表单页面数据
export const initFormData = (options) => {
  const params = {
    PostData: JSON.stringify(options),
  };
  return fetch<Response<Form.PageData>>('/Mobile/MobileService/OnAction/', params, 'post');
};

// 保存临时手写签名
export const SaveTemporarySignature = (params) => {
  const paramData = {
    ActionName: 'SaveTemporarySignature',
    SchemaCode: params.SchemaCode,
    Content: params.Content,
    BizObjectId: params.BizObjectId,
    ActivityCode: params.ActivityCode,
    ContentType: params.ContentType,
    SignatureFileKey: params.SignatureFileKey,
  };
  return fetch<Response<any>>('/Form/OnAction', { PostData: JSON.stringify(paramData) }, 'POST');
};

// 前端事件(获取一个表单下的所有事件, 注：轻应用接口使用lightAppFetch)
export const getFormEvents = (sheetCode) => {
  return lightAppFetch<Response2<Form.FrontEvent>>(
    `/lightapi/plugins/events/${sheetCode}`,
    {},
    'get',
  );
};

// 执行前端事件(注：轻应用接口使用lightAppFetch)
export const activeFromEvent = (params) => {
  return lightAppFetch<Response2<any>>(
    '/lightapi/plugins/frontendevent/execute',
    params,
    'post',
  );
};
