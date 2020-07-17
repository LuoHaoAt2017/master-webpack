import { Store } from 'vuex';
import { GlobalState } from '@/store';

export default function storeStartup (store: Store<GlobalState>) {
  store.state.suiteKey = window.GlobalConfig.suiteKey;
  store.state.corpId = window.GlobalConfig.corpId;
  store.state.appId = window.GlobalConfig.appCode || 'home';
  store.state.appCode = window.GlobalConfig.appCode || 'home';
  store.state.homeType = window.GlobalConfig.homeType;
  store.state.engineCode = window.GlobalConfig.engineCode;
  store.state.solutionCode = window.GlobalConfig.solutionCode || 'home';
  store.state.IsExternalForm = window.GlobalConfig.isExternalForm;
  store.state.IsExternalShare = window.GlobalConfig.isExternalShare;
  store.state.agentId = window.GlobalConfig.agentId;
  store.state.UserInfo.userId = window.GlobalConfig.userId;
  store.state.UserInfo.userName = window.GlobalConfig.userName;
  store.state.UserInfo.userParent = window.GlobalConfig.userParent;
  store.state.UserInfo.companyId = window.GlobalConfig.companyId;
  store.state.UserInfo.profilePhotoUrl =
  window.GlobalConfig.userPhotoUrl;
  store.state.UserInfo.isAdministrator =
  window.GlobalConfig.isAdmin;
  // store.state.UserInfo.isSubAdministrator =
  // window.GlobalConfig.isSubAdministrator;
  store.state.UserInfo.adminAppCodes =
  window.GlobalConfig.AdminAppCodes;
  store.state.UserInfo.IsAppCreator =
  window.GlobalConfig.IsAppCreator;
  store.state.UserInfo.companyName = window.GlobalConfig.companyName;
  store.state.solutionName = window.GlobalConfig.solutionName;
  store.state.isShowGuide = window.GlobalConfig.isShowGuide;
  store.state.isAPaas = window.GlobalConfig.isAPaaS;
  store.state.isSingleApp = window.GlobalConfig.isSingleApp;
  return store;
}
