/**
 * @description 公用请求方法 powered by axios
 * @author xulingzhi
 * @todo 整个文件需要重构，去除多余的套件许可的权限判断
 */

import Axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { baseUrl, isProductionMode } from './env';
import { licenseHandler } from './license';
import H3PluginDeveloper from '@/lib/h3-plugins-developer';
import { withScope, captureException } from '@sentry/browser';

const DATA_PARAM_PREFIX = 'PostData'; // 请求统一前缀管理

const instance = Axios.create();
let origin = window.location.origin;
if (!window.location.origin) {
  origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}
instance.defaults.baseURL = `${origin}${baseUrl}`;
instance.defaults.headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
// 请求格式转换
instance.defaults.transformRequest = [
  function transform (data, headers) {
    let ret = '';
    // 正常携带PostData的webForm请求处理
    if (typeof data[DATA_PARAM_PREFIX] !== 'undefined') {
      if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        let requestData = data[DATA_PARAM_PREFIX];
        if (typeof requestData === 'object') {
          requestData = JSON.stringify(Object.assign(requestData, { IsMobile: true }));
        } else {
          requestData = JSON.parse(requestData);
          requestData = JSON.stringify(Object.assign(requestData, { IsMobile: true }));
        }
        const requestParams:any = {
          [DATA_PARAM_PREFIX]: requestData,
        };
        ret = qs.stringify(requestParams);
        if (isProductionMode) { // 生产环境特殊字符转义
          ret = ret.replace(/\+/g, '%2B').replace(/\&/g, '%26');
        }
      } else {
        const dataObj = JSON.parse(data[DATA_PARAM_PREFIX]);
        data[DATA_PARAM_PREFIX] = JSON.stringify(
          Object.assign(dataObj, { IsMobile: true }),
        );
        ret = `${DATA_PARAM_PREFIX}=${data[DATA_PARAM_PREFIX]}`;
      }
    } else {
      // 处理登录的特殊情况
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if (data[key]) {
            ret += `${encodeURIComponent(key)}=${encodeURIComponent(
              data[key],
            )}&`;
          }
        }
      }
    }
    return ret;
  },
] as any;

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const data = config.data;
    // 处理get请求querystring的特殊情况
    if (config.method === 'get') {
      if (data[DATA_PARAM_PREFIX] === undefined) {
        config.url = `${config.url}`;
      } else {
        config.url = `${config.url}?${DATA_PARAM_PREFIX}=${
          data[DATA_PARAM_PREFIX]
          }`;
      }
    }
    return config;
  },
  err => {
    withScope(scope => {
      scope.setTags({ errorType: 'axios 拦截器' });
      captureException(err);
    });
    Promise.reject(err);
  },
);
// 返回拦截器
instance.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    withScope(scope => {
      scope.setTags({ errorType: 'axios 拦截器' });
      captureException(err);
    });
    Promise.reject(err);
  },
);

function _fetch<T> (...args) {
  const errorData: any = {
    Successful: false,
    ReturnData: null,
    ErrorMessage: '',
    Logined: true,
  };
  // 重载参数
  let requestConfig: AxiosRequestConfig & { mock?: boolean };
  let isMock;
  if (args.length === 0) {
    return Promise.resolve(errorData);
  } else if (typeof args[0] === 'object') {
    requestConfig = args[0];
    isMock = requestConfig.mock;
  } else {
    const [url, data, method = 'POST', mock] = args;
    isMock = mock;
    requestConfig = {
      url,
      data,
      method: method.toUpperCase(),
    };
  }
  if (!isProductionMode && isMock) {
    requestConfig.baseURL = '/mockApi';
  }
  // 返回一个Promise
  return new Promise<T>((resolve, reject) => {
    instance
      .request(requestConfig)
      .then(response => {
        let obj = response.data;
        let isPassLicense: boolean = true; // 是否通过许可
        try {
          if (typeof obj !== 'object') {
            obj = JSON.parse(obj);
          }
          if (obj.ReturnData) {
            isPassLicense = licenseHandler(obj.ReturnData);
          }
        } catch (error) {
          console.error(error); // eslint-disable-line
        }
        if (isPassLicense) {
          resolve(obj);
        } else {
          // TODO  临时解决方案，待删
          window.$h3.toast.hide();
          H3PluginDeveloper.IHidePreLoader();
          reject(false); // eslint-disable-line
        }
      })
      .catch(err => {
        console.error(err); // eslint-disable-line
        errorData.ErrorMessage = '请求错误';
        if (err.status === 0) {
          window.$h3.toast.hide();
          H3PluginDeveloper.IHidePreLoader();
          H3PluginDeveloper.IShowWarn('提示', '网络不给力，请稍后再试');
        }
        resolve(errorData);
      });
  });
}
/* eslint-disable import/export */
export default function fetch<T>(
  config: AxiosRequestConfig & { mock?: boolean }
): Promise<T>;
export default function fetch<T>(
  url: string,
  data: any,
  method?: string,
  mock?: boolean
): Promise<T>;
// 处理
export default function fetch(...args){
  for (let i = 0; i < args.length; i++){
    let argu = args[i];
    if(argu === null || typeof argu !== 'object'){
      continue;
    }
    let postData;
    try{
      postData = JSON.parse(argu.PostData);
      if (postData && postData.BizObjectId){
        postData.BizObjectId = decodeURIComponent(postData.BizObjectId);
        argu.PostData = JSON.stringify(postData);
      }
    }catch(e){
      // 
      console.log(e, argu);
    }
  }
  console.log('override fetch', args);
  return _fetch(...args);
}