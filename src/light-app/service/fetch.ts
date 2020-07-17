import Axios, { AxiosRequestConfig } from 'axios';
import { baseUrl, isProductionMode } from '@/config/env';
import { licenseHandler } from '@/config/license';
import H3PluginDeveloper from '@/lib/h3-plugins-developer';
import { withScope, captureException } from '@sentry/browser';

const instance = Axios.create();

instance.defaults.baseURL = `${window.location.origin}${baseUrl}`;
instance.defaults.headers = {
  'Content-Type': 'application/json; charset=utf-8',
};
// 请求拦截器
instance.interceptors.request.use(
  config => {
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

export default function fetch<T> (...args) {
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
