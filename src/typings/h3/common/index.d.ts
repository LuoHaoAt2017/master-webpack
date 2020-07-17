declare namespace H3 {
  namespace Common {
    interface UserInfo {
      userName: string;
      userId: string;
      departmentName: string;
      userParent: string;
      companyId: string;
      companyName: string;
      dingtalkAccount: string;
      profilePhotoUrl: string;
      isAdministrator: boolean;
      separatedAppCodeList: string[];
    }

    interface LoginResponse {
      /*
       *  代理ID
       */
      AgentId: string;
      /*
       *  应用编码（经统一入口校准后）
       */
      AppCode: string;
      /*
       *  企业ID
       */
      CompanyId: string;

      /*
       *  企业名称
       */
      CompanyName: string;
      /*
       *  钉钉企业ID
       */
      CorpId: string;
      /*
       *  钉钉ID
       */
      DingId: string;
      /*
       *  企业编码
       */
      EngineCode: string;
      /*
       * 当前应用是否过期
       */
      IsExpired: boolean;
      /*
       *  是否已经安装完成的企业
       */
      IsInstalled: boolean;
      /*
       *  是否平台
       */
      IsAPaaS: boolean;
      /*
       *  是否管理员
       */
      IsAdmin: boolean;
      /*
       *  是否子管理员
       */
      // IsSubAdministrator: boolean;
      /*
       * 应用管理字段
      */
      AdminAppCodes: string[];
       /*
       *  是否创建应用管理员
       */
      IsAppCreator: boolean;
      /*
       *  是否轻应用
       */
      IsLightApp: boolean;
      /*
       *  是否ISV套件
       */
      IsIsv: boolean;
      /*
       *  是否显示引导页
       */
      IsShowGuide: boolean;
      /*
       *  是否显示落地页
       */
      IsShowLandingGuide: boolean;
      /*
       *  是否发布到钉钉工作平台的单一应用
       */
      IsSingleApp: boolean;
      /*
      *  返回提示消息
      */
      Message: string;
      /*
       *  临时码
       */
      Nonce: string;
      /*
       *  结果
      */
      Result: boolean;
      /*
       *  应用appCode数组
       */
      SeparatedAppCodeList: string[];
      /*
       *  钉钉签名
       */
      Signature: string;
      /*
       *  源地址
       */
      SourceUrl: string;
      /*
      *  解决方案编码（经统一入口校准后）
      */
      SolutionCode: string;
      /*
       *  套件名称
       */
      SuiteName: string;
      /*
       *  时间戳
       */
      TimeStamp: string;
      /*
       *  用户ID
       */
      UserId: string;
      /*
       *  用户头像
       */
      UserPhotoUrl: string;
      /*
       *  用户父级
       */
      UserParent: string;
      /*
       *  用户名称
       */
      UserName: string;
      /*
       *  用户父级名称
       */
      UserParentName: string;
      /*
       *  模板中心地址
       */
      StoreUrl: string;
      /*
       *  视图类型
       */
      DisplayMode: number;
    }
  }
}
