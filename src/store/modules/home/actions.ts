import { ActionTree } from 'vuex';
import { HomeModuleState } from '.';
import { GlobalState } from '../../index';
import { HomeActionType, HomeMutationType } from './types';
import { checkGuide } from '@/service/app.light.common.api';
import {
  getHomeDatas,
  getMyWorkflow,
} from "@/service/home.service";
import { jsonParse, getCookie } from "@/utils";

const actions: ActionTree<HomeModuleState, GlobalState> = {
  async [HomeActionType.GetHomeDatas]({ commit, state, rootState }, isInit:boolean) {
    const AppCode = rootState.appCode || '';
    const SolutionCode = rootState.solutionCode || '';
    const customCardsSettingKey = window.btoa(`customCardSetting-${rootState.UserInfo.userId}-${rootState.engineCode}-${rootState.solutionCode}`);
    const recentDataKey = window.btoa(`recentData-${rootState.UserInfo.userId}-${rootState.engineCode}-${rootState.solutionCode}`);
    commit(HomeMutationType.SetLocalKey, {
      customCardsSettingKey,
      recentDataKey,
    });
    // 进入首页时，获取快速新增和待办信息
    const recentDataJSON = window.localStorage.getItem(recentDataKey);
    let TimeStamp: number = 0;
    let RecentCodes = '';
    // 从本地localStorage中取表单编码和时间戳
    if (recentDataJSON) {
      const recentData = jsonParse(recentDataJSON);
      if (recentData) {
        RecentCodes = recentData.Codes;
        TimeStamp = recentData.TimeStamp;
      } else {
        // 兼容旧版数据格式
        RecentCodes = recentDataJSON;
      }
    }
    try {
      const res = await getHomeDatas({
        AppCode,
        SolutionCode,
        PageSize: 3,
        PageIndex: 0,
        IsInit: isInit,
        RecentCodes,
        TimeStamp,
      });
      if (res.Successful) {
        const config = {
          token: getCookie("h3_Session"),
          extra: {
          },
          userId: rootState.UserInfo.userId
        };
        if (res.ReturnData.ReportList) {
          res.ReturnData.ReportList = res.ReturnData.ReportList.map(
            item => {
              item.corpId =
                rootState.engineCode;
              item.config = config;
              return item;
            }
          );
        }
        // 初始化首页数据
        commit(HomeMutationType.HandleHomeDatas, {
          data: res.ReturnData,
          includeReports: isInit,
        });
        // 处理最近使用（快速新建）表单
        if (isInit) {
          commit(HomeMutationType.GetLocalCardSetting);
        }
      } else {
        console.error(res); // eslint-disable-line
      }
    } catch (error) {
      console.error(error); // eslint-disable-line
    }
  },
  [HomeActionType.RecordForm]({ commit, state, rootState }, schemaCode) {
    if (!state.recentDataKey) {
      const customCardsSettingKey = window.btoa(`customCardSetting-${rootState.UserInfo.userId}-${rootState.engineCode}-${rootState.solutionCode}`);
      const recentDataKey = window.btoa(`recentData-${rootState.UserInfo.userId}-${rootState.engineCode}-${rootState.solutionCode}`);
      commit(HomeMutationType.SetLocalKey, {
        customCardsSettingKey,
        recentDataKey,
      });
    }
    commit(HomeMutationType.PushRecentFormCode, schemaCode);
  },
  async [HomeActionType.GetMyWorkflow]({ commit }, appCode: string) {
    try {
      const res = await getMyWorkflow(appCode);
      if (res.Successful) {
        const myWorkflow = res.ReturnData.MyWorkflow
        // 设置代办数据
        commit(HomeMutationType.SetMyWorkflow, {
          myWorkflow
        });
      } else {
        console.error(res); // eslint-disable-line
      }
    } catch (error) {
      console.error(error); // eslint-disable-line
    }
  },
};

export default actions;
