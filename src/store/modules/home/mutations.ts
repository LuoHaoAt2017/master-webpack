import { MutationTree } from 'vuex';
import { HomeModuleState } from '.';
import { HomeMutationType } from './types';
import { jsonParse } from '@/utils';

import Home = H3.Home;

const mutations: MutationTree<HomeModuleState> = {
  [HomeMutationType.SetLocalKey](state, payload: { customCardsSettingKey: string, recentDataKey: string }) {
    state.recentDataKey = payload.recentDataKey;
    state.customCardsSettingKey = payload.customCardsSettingKey;
  },
  // 首页页面数据赋值
  [HomeMutationType.HandleHomeDatas](state, payload: { data: Home.PageData, includeReports: boolean } ) {
    const { data, includeReports } = payload;
    state.MyWorkflow = data.MyWorkflow;
    state.BannerList = data.BannerList;
    state.RecentAppList = (data.RecentAppList || []).filter(item => item.AppCode !== 'Sys_Workflow');
    state.isApp = data.IsApp;
    const recentCodes = state.RecentAppList.map(item => item.Code).join(',');
    const recentData = {
      Codes: recentCodes,
      TimeStamp: data.TimeStamp,
    };
    window.localStorage.setItem(state.recentDataKey, JSON.stringify(recentData));
    if (includeReports) {
      state.ReportList = data.ReportList;
    }
  },
  // 从localStorage中取本地缓存的报表
  [HomeMutationType.GetLocalCardSetting](state) {
    const allReports = state.ReportList || [];
    const customSettingStr = window.localStorage.getItem(state.customCardsSettingKey);
    let customSetting;
    if (customSettingStr) {
      customSetting = jsonParse(customSettingStr);
      if (customSetting && customSetting.reports) {
      // 兼容旧配置
        customSetting = customSetting.reports;
        // customSetting.RecentCreated = 0;
      }
      state.customCardsSetting = customSetting || {};
    }
    let customCards: H3.Home.ReportItem[];
    // 如果有本地配置，取在本地配置中的报表；如果快速新建（最近新建）在配置中，先加到末尾，一会儿整体进行排序；
    // 之所以从allReports开始遍历，是为了防止报表新增或被删除
    if (customSetting) {
      customCards = allReports.filter(item => customSetting[item.ReportWidgetId]);
      // if (customSetting.RecentCreated) {
      //   customCards.push({ WidgetId: 'RecentCreated' });
      // }
      customCards = customCards.sort((a, b) => {
        const aIndex = customSetting[a.ReportWidgetId];
        const bIndex = customSetting[b.ReportWidgetId];
        return aIndex - bIndex;
      });
    } else {
      customCards = allReports.slice(0, 5);
      const defaultSetting = {};
      customCards.forEach((card, index) => {
        defaultSetting[card.ReportWidgetId] = index + 1;
      });
      state.customCardsSetting = defaultSetting;
      // customCards.push({ WidgetId: 'RecentCreated' });
    }

    state.customCards = customCards;
  },
  [HomeMutationType.PushRecentFormCode](state, schemaCode) {
    let TimeStamp = 0;
    let recentCodes = '';
    const recentDataJSON = window.localStorage.getItem(state.recentDataKey);
    if (recentDataJSON) {
      const recenetData = jsonParse(recentDataJSON);
      if (recenetData) {
        recentCodes = recenetData.Codes;
        TimeStamp= recenetData.TimeStamp;
      } else {
        recentCodes = recentDataJSON;
      }
    }
    let recentCodeList = recentCodes.split(',');
    recentCodeList.unshift(schemaCode);
    recentCodeList = Array.from(new Set(recentCodeList));
    recentCodes = recentCodeList.slice(0, 10).join(',');
    window.localStorage.setItem(state.recentDataKey, JSON.stringify({
      Codes: recentCodes,
      TimeStamp,
    }));
  },
  [HomeMutationType.SetMyWorkflow](state, payload: { myWorkflow: Home.MyWorkflowItem[] }) {
    state.MyWorkflow = payload.myWorkflow;
  },
};

export default mutations;
