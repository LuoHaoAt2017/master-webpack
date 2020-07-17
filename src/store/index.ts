/**
 * @author YJH
 */
import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';
import modules from './modules';
import getters from './getters';

Vue.use(Vuex);

export class GlobalState {
  tabbarShow: boolean = true;
  // initialSelectedIndex: 0, // 底部tab初始选中索引
  corpId: string = ''; // 企业corpid
  appId: string = 'home'; // appId 就是appCode
  appCode: string = 'home'; // 当前打开应用的appCode
  appName: string = ''; // 当前打开应用的显示名称
  solutionCode: string = 'home'; // 当前打开应用所属解决方案
  solutionName: string = '';
  isShowGuide: boolean = false;
  homeType: string = '';
  suiteKey: string = '';
  todos: number = 0; // 当前所属解决方案待办任务数量
  // 当前登录用户信息
  UserInfo: any = {
    userName: '',
    userId: '',
    userParent: '',
    companyId: '',
    companyName: '',
    profilePhotoUrl: '',
    isAdministrator: false,
    // isSubAdministrator: false
  };
  separatedAppCodeList: string[] = [];
  // 用于记录首页数据
  homeData: any = {
    Apps: [],
    ReportWidgets: [],
    RecentModule: [],
    TotalWorkflows: 0,
  };
  isAPaas: boolean = false; // 是否为apaas
  isSingleApp: boolean = false;
  expired: boolean = false; // 解决方案是否已到期
  willExpired: boolean = false; // 解决方案是否即将到期
  monthlyBoCount: number = 0;
  totalBoCount: number = 0;
  monthlyFileSizeCount: number = 0;
  totalFileSize: number = 0;
  hasVirtualHeader: boolean = false;
  backFromScanForm: boolean = false; // 解决通过扫码进入的表单，返回时单页面判断问题
  // 表单页面数据
  /**@deprecated */
  formData: any = {
    data: '',
    pageId: '',
    responseContext: '',
  };
  // 表单页面进入表单页面测试
  // formData: [],
  // schemaCodeArr: [],

  // 判断表单是否渲染完成
  /**@deprecated */
  formRenderBol: boolean = false;
  // Error:大小写
  // 选人控件数据,单个页面所有数据库共用
  /**@deprecated */
  FormMultiUserData: any = {
    // 部门
    OrgUnitItems: [],
    // 标签
    OrgTagItems: [],
    // 部门用户:{部门ID:[]}
    DepUserItems: {},
    // 用户
    UserItems: [],
  };
  /**@deprecated */
  queryData: string = '';
  /**@deprecated */
  querySelectedItems: string[] = []; // 关联查询选中值,简化处理只存储选中行objectid
  /**@deprecated */
  reportFilters: any = {}; // 报表过滤参数
  /**@deprecated */
  childRenderedLen: number = 0; // 整个form页面的控件数量
  /**@deprecated */
  gridChildRenderedLen: any = {}; // 子表控件对象
  /**@deprecated */
  gridChildLen: number = 0;
  excludeComp: string[] = []; // 不需要缓存的页面
  IsExternalForm: boolean = false; // 是否是表单外链
  IsExternalShare: boolean = false; // 外链分享
  suitekey: string = ''; // formcomment控件需要
  hostAddress: string = ''; // 同上
  agentId: string = '';
  /**@deprecated */
  gridChoosedDom: string = ''; // 子表里面点击的某个控件
  /**@deprecated */
  isGridOnChange: number = 0;
  /**@deprecated */
  rowId: string = ''; // 子表objectId
  /**@deprecated */
  isFormInitFinish: boolean = false; // 判断表单页面控件是否都已加载完毕
  /**@deprecated */
  isGridFormInitFinish: boolean = false; // 判断表单页面子表控件是否都已加载完毕
  // Error:大小写不一致
  /**@deprecated */
  AreaCotrolPopObj: any = {
    bol: false,
    keyName: '',
    ObjectId: '',
  }; // 判断地址控件弹窗状态
  /**@deprecated */
  DateCotrolPopObj: any = {
    bol: false,
    keyName: '',
    ObjectId: '',
  }; // 判断日期控件弹窗状态
  /**@deprecated */
  CotrolPopBol: boolean = false; // 判断单选多选控件弹窗状态
  /**@deprecated */
  favoriteFunctions: any[] = []; // 用户常用表单
  /**@deprecated */
  isHtmlChangedBol: boolean = false; // 半段表单 页面是否被编辑
  /**@deprecated */
  isGridPopupBol: boolean = false; // 判断子表是否有弹窗
  engineCode?: string = null;
  /**@deprecated */
  lastFilterBoxPosition: number = 0; // 记录过滤框最后的位置
  /**@deprecated */
  isClickCustomButtom: boolean = false; // 是否点击自定义按钮
  /**@deprecated */
  attachmentPreviewShow: boolean = false; // 附件是否在预览
  /**@deprecated */
  photoPreviewShow: boolean = false; // 图片是否预览
  /**@deprecated */
  isClickCommentButton: boolean = false;
  assoStashedTab: string = '';
  solutionGoodsInfo: any = {};
}

/**
 * @deprecated 迭代16改版之后，废弃
 */
// const mutations = {
//   updateDotStatus(state, payload) {
//     state.showDot = payload.status;
//   },
// };

export default new Vuex.Store<GlobalState>({
  state: new GlobalState(),
  modules,
  mutations,
  actions,
  getters,
});
