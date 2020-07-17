import { Module } from "vuex";
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import Home = H3.Home;

export class HomeModuleState {
  MyWorkflow: Home.MyWorkflowItem[] = [];
  RecentAppList: Home.RecentAppItem[] = [];
  BannerList: Home.Banner[] = [];
  ReportList: Home.ReportItem[] = [];
  customCards: any[] = [];
  customCardsSetting?: { [id: string]: boolean | string }; 
  customCardsSettingKey: string;
  recentDataKey: string;
  isApp: boolean = false;
}

const appModule: Module<HomeModuleState, any> = {
  namespaced: true,
  state: new HomeModuleState(),
  mutations,
  getters,
  actions,
}

export default appModule;