declare namespace H3 {
  namespace Http {
    /**
     * 氚云后台接口统一网络响应数据格式
     */
    interface Response<T> {
      Successful: boolean;
      Logined: boolean;
      ErrorMessage?: string | null;
      ReturnData: T;
    }

    interface LightAppResponse<T> {
      success: boolean;
      Logined: boolean;
      ErrorMessage?: string | null;
      returnData: T;
    }

    interface RequestParam<T = any> {
      PostData: T;
    }
  }
}
