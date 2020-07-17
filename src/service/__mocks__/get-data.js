import queryAppsDatas from '../../../test/__mocks__/mockData/queryAppDatas';
import FilterMyWorkItem from '../../../test/__mocks__/mockData/FilterMyWorkItem.js';
import GetBoEnableSheetHome from '../../../test/__mocks__/mockData/FilterMyWorkItem.js';

export const getHomeDatas = () => {};

export const getAppDatas = function getAppDatas(...args) {
  return new Promise((resolve) => {
    // process.nextTick(() => {
    const appDatas = queryAppsDatas(...args);
    resolve({
      Successful: true,
      ReturnData: appDatas,
      Logined: true,
    });
    // });
  });
};

export const getWorkItemsAndTasks = function getWorkItemsAndTasks() {
  return new Promise((resolve) => {
    resolve(FilterMyWorkItem);
  });
};

