const globalConfig: GlobalConfig = {
  appCode: '',
  appRankType: '',
  displayMode: 0, // 3.0列表视图类型
  agentId: '', // 钉钉后台的应用Id
  backAction: false,
  bizObjectId: '',
  // 打开表单参数缓存
  // 关闭表单回调函数缓存
  callbackCache: [],
  companyId: '',
  companyName: '',
  corpId: '',
  confirmPanelShow: false, // 标识确认弹框显示状态
  dingAppId: '', // 钉钉套件下多个应用的Id
  dingId: '',
  enableAssociation: '',
  engineCode: '',
  GoodsCode: '',
  globalCache: [],
  homeAddress: '/home',
  homeType: '', // 首页类型
  isInstalled: false,
  isExpired: false,
  isAdmin: false,
  // isSubAdministrator: false,
  AdminAppCodes: null,
  IsAppCreator: false,
  isLightApp: false, // 是轻应用
  isAPaaS: false,
  isAuto: '',
  isExternalForm: false,
  isInternalForm: false, // 内部分享填单
  isExternalShare: false,
  isPcSignature: false,
  enableReviewExternalForm: false,
  isIsv: false,
  isSingleApp: false,
  isShowGuide: false,
  isShowLandingGuide: false,
  isList: false, // 直接打开列表
  isAssociation: false,
  LicenseSolutionName: '',
  menuCode: '', // 列表编码
  messageType: '',
  isFromNotice: false,
  reportCode: '', // 报表编码
  separatedAppCodeList: [],
  schemaCode: '',
  shareKey: '',
  solutionCode: '',
  solutionType: 0,
  solutionName: '', // 解决方案名称
  solutionStates: [],
  sourceUrl: '',
  suiteKey: '', // Error:这个是否存前端
  suiteName: '',
  widgetId: '', // 报表图例id
  // 消息
  workitemId: '',
  urlHash: '',
  userId: '',
  userParent: '',
  userName: '',
  userParentName: '',
  storeUrl: '',
  userPhotoUrl: '',
  VueInstance: null,
  taskOpenType: '',
};

export default globalConfig;

export function mergeLoginResponse (
  target: GlobalConfig,
  source: H3.Common.LoginResponse,
): GlobalConfig {
  return Object.assign<GlobalConfig, SessionContext>(target, {
    agentId: source.AgentId,
    appCode: source.AppCode ? source.AppCode : target.appCode, // 第一次登陆是返回的AppCode为空，会把请求url上的appId覆盖
    companyId: source.CompanyId,
    companyName: source.CompanyName,
    corpId: source.CorpId,
    dingId: source.DingId,
    engineCode: source.EngineCode,
    isAPaaS: source.IsAPaaS,
    isAdmin: source.IsAdmin,
    // isSubAdministrator: source.IsSubAdministrator,
    AdminAppCodes: source.AdminAppCodes,
    IsAppCreator: source.IsAppCreator,
    isLightApp: source.IsLightApp,
    displayMode: source.DisplayMode,
    isExpired: source.IsExpired,
    isInstalled: source.IsInstalled,
    isIsv: source.IsIsv,
    isShowGuide: source.IsShowGuide,
    isShowLandingGuide: source.IsShowLandingGuide,
    isSingleApp: source.IsSingleApp,
    separatedAppCodeList: source.SeparatedAppCodeList,
    sourceUrl: source.SourceUrl,
    solutionCode: source.SolutionCode,
    suiteName: source.SuiteName,
    solutionName: source.SuiteName,
    userId: source.UserId,
    userPhotoUrl: source.UserPhotoUrl,
    userParent: source.UserParent,
    userName: source.UserName,
    userParentName: source.UserParentName,
    storeUrl: source.StoreUrl,
  });
}
