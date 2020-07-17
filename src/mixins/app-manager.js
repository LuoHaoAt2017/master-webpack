const recentAppCode = 'SYS_RecentModule';

const iconColorsMap = ['#FF4384', '#7457FF', '#FF7527', '#05DB9B', '#FFCA00']; // 其实只取长度
const iconColorsLimit = 3;

export default {
  data() {
    const localKey = window.btoa(
      `appOrder-${window.GlobalConfig.userId}-${
        window.GlobalConfig.engineCode
      }-${window.GlobalConfig.solutionCode}`
    );
    return {
      localKey
    };
  },
  methods: {
    getAppIconClass(item) {
      let classStr = `font-icon ${item.IconCss}`;
      let left;
      if (item.ObjectId) {
        const substr = item.ObjectId.substr(-iconColorsLimit);
        let long = 0;
        for (let i = 0; i < substr.length; i++) {
          const s = substr[i];
          const l = s.charCodeAt(0);
          long += l;
        }
        left = long % iconColorsMap.length;
      } else {
        left = Math.floor(Math.random() * iconColorsMap.length);
      }
      classStr = `${classStr} app-icon-color-${left + 1}`;
      return classStr;
    },
    getCustomAppOrder(appsParam, appGroupsParam) {
      const customAppOrderStr = window.localStorage.getItem(this.localKey);
      if (customAppOrderStr) {
        const customAppOrder = JSON.parse(customAppOrderStr);
        customAppOrder[recentAppCode] = -1;
        const appOriginOrderMap = {};
        appsParam.forEach((item, order) => {
          appOriginOrderMap[item.SchemaCode] = order;
        });
        const apps = appsParam.sort((a, b) => {
          let orderA = customAppOrder[a.SchemaCode];
          let orderB = customAppOrder[b.SchemaCode];
          if (orderA === orderB) {
            return (
              appOriginOrderMap[a.SchemaCode] - appOriginOrderMap[b.SchemaCode]
            );
          }
          orderA = orderA === undefined ? Infinity : orderA;
          orderB = orderB === undefined ? Infinity : orderB;
          return orderA - orderB;
        });
        const appGroups = appGroupsParam.sort((a, b) => {
          let orderA = customAppOrder[a.AppCode];
          let orderB = customAppOrder[b.AppCode];
          if (orderA === orderB) {
            return a.groupOrder - b.groupOrder;
          }
          orderA = orderA === undefined ? Infinity : orderA;
          orderB = orderB === undefined ? Infinity : orderB;
          return orderA - orderB;
        });
        return { apps, appGroups };
      }
      return null;
    }
  }
};
