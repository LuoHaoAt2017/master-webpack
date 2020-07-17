import axios, { AxiosRequestConfig } from 'axios';
import { baseUrl } from './env';
import { jsonParse } from '../utils';

const instance = axios.create();

instance.defaults.baseURL = baseUrl;
// instance.defaults.headers['Content-Type'] = 'application/json';

// 请求拦截器
instance.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => error,
);
// 响应拦截器
instance.interceptors.response.use(
  response => {
    let responseData = response.data;
    if (typeof responseData !== 'object') {
      responseData = jsonParse(responseData);
      response.data = responseData;
    }
    return responseData;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log(401);
          break;
        default:
          break;
      }
      return error.response;
    }
    return error;
  }
);


export default instance as {
  request<T = any>(config: AxiosRequestConfig): Promise<T>;
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  head(url: string, config?: AxiosRequestConfig): Promise<any>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
};
