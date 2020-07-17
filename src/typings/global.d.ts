interface SessionContext {
  /*
  *  代理ID
  */
  agentId: string;
  /*
  *  应用编码（经统一入口校准后）
  */
  appCode: string;
  /*
  *  企业ID
  */
  companyId: string;

  /*
  *  企业名称
  */
  companyName: string;
  /*
  *  钉钉企业ID
  */
  corpId: string;
  /*
  *  钉钉ID
  */
  dingId: string;
  /*
  *  企业编码
  */
  engineCode: string;

  /*
  *  是否平台
  */
  isAPaaS: boolean;
  /*
  *  是否管理员
  */
  isAdmin: boolean;
  /*
  *  是否子管理员
  */
  // isSubAdministrator: boolean;
  /*
    * 应用管理字段
  */
  AdminAppCodes: string[];
  /*
  *  是否为创建应用管理员
  */
 IsAppCreator: boolean;
  /*
  *  是否轻应用
  */
 isLightApp: boolean;
  /*
    * 当前应用是否过期
    */
  isExpired: boolean;
  /*
    *  是否已经安装完成的企业
    */
  isInstalled: boolean;
  /*
  *  是否ISV套件
  */
  isIsv: boolean;
  /*
  *  是否显示引导页
  */
  isShowGuide: boolean;
  /*
  *  是否发布到钉钉工作平台的单一应用
  */
  isSingleApp: boolean;
  /*
  *  应用appCode数组
  */
  separatedAppCodeList: string[];
  /*
  *  源地址
  */
  sourceUrl: string;
  /*
  *  解决方案编码（经统一入口校准后）
  */
  solutionCode: string;
  /*
  *  套件名称， 同solutionName
  */
  solutionName: string;
  /*
  *  套件名称， 同solutionName
  */
  suiteName: string;
  /*
  *  用户ID
  */
  userId: string;
  /*
  *  用户头像
  */
  userPhotoUrl: string;
  /*
  *  用户父级
  */
  userParent: string;
  /*
  *  用户名称
  */
  userName: string;
  /*
  *  用户父级名称
  */
  userParentName: string;
  /*
  *  模板中心地址
  */
  storeUrl: string;
  /*
  *  视图类型--看板和列表
  */
  displayMode: number;

  isShowLandingGuide?: boolean;
}

interface GlobalConfig extends SessionContext {
  suiteKey: string;
  confirmPanelShow: boolean;
  callbackCache: any[];
  globalCache: any[];
  dingAppId: string;
  isAuto: string;
  isList: boolean;
  isAssociation: boolean;
  menuCode: string;
  appRankType: string;
  reportCode: string;
  widgetId: string;
  messageType: string;
  isFromNotice: boolean;
  bizObjectId: string;
  schemaCode: string;
  workitemId: string;
  shareKey: string;
  enableAssociation: string;
  homeType: string;
  homeAddress: string;
  isInternalForm: boolean;
  isExternalForm: boolean;
  isExternalShare: boolean;
  isOpenQuery?: boolean;
  isPcSignature: boolean;
  enableReviewExternalForm: boolean;
  solutionStates: number[];
  solutionType: number;
  LicenseSolutionName: string;
  GoodsCode: string;
  backAction: boolean;
  urlHash: string;
  VueInstance: any;
  LoginFailed?: boolean;
  taskOpenType?:string;
  isShowLandingGuide: boolean;
}

interface Element{
  scrollIntoViewIfNeeded: any;
}
interface Document{
  readonly activeElement: Element | null;
}

interface Window{
  GlobalConfig: GlobalConfig;
  dd: any;
  /**
   * @deprecated 准备弃用
   */
  $aut: any;
  $h3: any;
  Environment: any;
  Hammer: any;
  Sentry: any;
}

declare var document: Document;
// declare var window: Window;
