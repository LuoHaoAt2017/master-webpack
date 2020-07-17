import { parseUrlParams } from '@/utils/url';
// 获取首页地址，单个应用，表单，平台
export default function getAppEntry (globalConfig: GlobalConfig) {
  const {
    isAdmin,
    messageType,
    bizObjectId,
    enableAssociation,
    schemaCode,
    reportCode,
    appRankType,
    displayMode,
    menuCode,
    isList,
    isLightApp,
    appCode,
    isSingleApp,
    solutionCode,
    isIsv,
    engineCode,
    isShowGuide,
    isInstalled,
    isExpired,
    isPcSignature,
    taskOpenType,
    isOpenQuery,
    isShowLandingGuide,
  } = globalConfig;
  let homeAddress = '/home';
  let isDashBoard = false;
  if (appRankType === 'DashBoard') {
    isDashBoard = true;
  }
  const homeAddressRules = [
    // ==============================================================
    // 用户是系统管理员而且明确要求显示引导页，进入新手引导
    {
      match () {
        return isShowGuide && isAdmin;
      },
      action () {
        homeAddress = '/guidance';
      },
    },
    {
      match () {
        return isShowLandingGuide && isAdmin;
      },
      action () {
        homeAddress = '/guide';
      },
    },
    // ==============================================================
    // 钉钉单应用，进入单应用首页
    {
      match () {
        return appRankType === 'App' && appCode;
      },
      action () {
        if (isLightApp) {
          homeAddress = '/schemas';
        } else {
          homeAddress = '/singleApp';
        }
      },
    },
    // 公开查询
    {
      match () {
        return isOpenQuery;
      },
      action () {
        homeAddress = `/openquery/${schemaCode}`;
      },
    },
    // ==============================================================
    // 钉钉单应用，进入单应用首页
    {
      match () {
        return appRankType === 'App' && appCode;
      },
      action () {
        if (isLightApp) {
          homeAddress = '/schemas';
        } else {
          homeAddress = '/singleApp';
        }
      },
    },
    // ==============================================================
    // 消息提醒 进入详情 新增 和 列表
    {
      match () {
        console.log(globalConfig);
        if (taskOpenType === 'Create' || taskOpenType === 'ListView') {
          return true;
        } else {
          return false;
        }
      },
      action () {
        // if (taskOpenType === 'Detail') {
        //   homeAddress = `/sheet-home/${bizObjectId}/${schemaCode}`;
        // } else
        const params = parseUrlParams(globalConfig.sourceUrl);
        for (const paramName of Object.keys(params)) {
          params[paramName.toLowerCase()] = params[paramName];
        }

        if (taskOpenType === 'Create') {
          globalConfig.bizObjectId = '';
          globalConfig.schemaCode = params.schemacode;
          globalConfig.isFromNotice = true;
          homeAddress = '/formPage';
        } else { // 'ListView'
          globalConfig.appCode = params.appcode;
          globalConfig.menuCode = params.schemacode;
          globalConfig.isList = true;
          globalConfig.solutionName = '';// 名字暂时不行
          if (displayMode === 0) {
            homeAddress = '/lists';
          } else if (displayMode === 3) {
            homeAddress = '/board';
          } else {
            homeAddress = '/lists';
          }
        }
      },
    },
    // ==============================================================
    // isDashBoard为true进入仪表盘
    {
      match () {
        return isDashBoard;
      },
      action () {
        homeAddress = '/dashboard';
      },
    },
    // ==============================================================
    // 轻应用，进入表单列表
    // 这个匹配不知道有其他什么作用，导致从钉钉平台进来的应用进入到了列表
    // isSingleApp不起作用，一直为true
    {
      match () {
        return appCode && !isList && appRankType === 'App';
      },
      action () {
        homeAddress = '/schemas';
      },
    },
    // ==============================================================
    // 从消息进入，有messageType
    {
      match () {
        return messageType;
      },
      action () {
        if (messageType === 'AppInstall') {
          homeAddress = '/home';
        } else if (messageType === 'QickEntry') {
          homeAddress = '/newBlank';
        } else if (bizObjectId && enableAssociation) {
          homeAddress = `/sheet-home/${bizObjectId}/${schemaCode}`;
        }else {
          globalConfig.isFromNotice = true;
          homeAddress = '/formPage';
        }
      },
    },
    // pc端手写签名，扫码进入
    {
      match () {
        return isPcSignature;
      },
      action () {
        homeAddress = '/signatureImg';
      },
    },
    // ==============================================================
    // 报表，发现报表编码
    {
      match () {
        return reportCode;
      },
      action () {
        homeAddress = '/report';
      },
    },
    // ==============================================================
    // 进入表单页面，可能是表单外链
    {
      match () {
        return menuCode && !isList && (appRankType === 'Sheet' || bizObjectId);
      },
      action () {
        homeAddress = '/formPage';
      },
    },
    // ==============================================================
    // 有appCode 并且isList为true，表示要进入列表页
    {
      match () {
        return appCode && isList && !isLightApp;
      },
      action () {
        homeAddress = '/list';
      },
    },
    // ==============================================================
    // 有appCode 并且isList为true，isLightApp为true表示要进入3.0列表页
    {
      match () {
        return appCode && isList && isLightApp;
      },
      action () {
        if (displayMode === 0) {
          homeAddress = '/lists';
        } else if (displayMode === 3) {
          homeAddress = '/board';
        } else {
          homeAddress = '/lists';
        }
      },
    },
    // ==============================================================
    // 进入流程中心
    {
      match () {
        return appCode === 'Sys_Workflow';
      },
      action () {
        globalConfig.appCode = 'home';
        globalConfig.solutionCode = 'home';
        homeAddress = '/home';
      },
    },
    // ==============================================================
    // 有appCode
    {
      match () {
        return appCode;
      },
      action () {
        if (isIsv && solutionCode) {
          if (!isInstalled && solutionCode.toLowerCase() !== 'home') {
            homeAddress = 'guidance';
          } else if (
            !isExpired &&
            (solutionCode.toLowerCase().indexOf('jz') > -1 ||
              solutionCode.toLowerCase().indexOf('standard') > -1 ||
              solutionCode.toLowerCase().indexOf('school') > -1 ||
              solutionCode.toLowerCase().indexOf('pro') > -1)
          ) {
            // 用户是否已经引导过，没有引导过，进入引导页。已经引导过，进入工作台。
            const guide = window.localStorage.getItem(`isShowGuidance-${engineCode}-${solutionCode}`) === 'true';
            if (!guide) {
              homeAddress = '/guidance';
            } else if (isShowGuide) {
              homeAddress = '/guide';
            } else {
              homeAddress = '/home';
            }
          } else if (isShowGuide) {
            homeAddress = '/guide';
          } else {
            homeAddress = '/home';
          }
        } else if (isShowGuide) {
          homeAddress = '/guide';
        } else {
          homeAddress = '/home';
        }
      },
    },
    // ==============================================================
    // ISV套件
    {
      match () {
        return isIsv && solutionCode;
      },
      action () {
        if (!isInstalled && solutionCode.toLowerCase() !== 'home') {
          homeAddress = '/guidance';
        } else if (
          !isExpired &&
          (solutionCode.toLowerCase().indexOf('jz') > -1 ||
            solutionCode.toLowerCase().indexOf('ehr') > -1 ||
            solutionCode.toLowerCase().indexOf('standard') > -1 ||
            solutionCode.toLowerCase().indexOf('school') > -1 ||
            solutionCode.toLowerCase().indexOf('pro') > -1)
        ) {
          const guide = window.localStorage.getItem(`isShowGuidance-${engineCode}-${solutionCode}`) === 'true';
          if (!guide) {
            homeAddress = '/guidance';
          } else {
            homeAddress = '/home';
          }
        } else if (isShowGuide) {
          homeAddress = '/guide';
        } else {
          homeAddress = '/home';
        }
      },
    },
    // ==============================================================
    // 默认进入首页
    {
      match () {
        return true;
      },
      action () {
        homeAddress = '/home';
      },
    },
  ];
  for (const rule of homeAddressRules) {
    if (rule.match()) {
      rule.action();
      break;
    }
  }
  return homeAddress;
}

// 改版前原代码
// // 获取首页地址，单个应用，表单，平台
// const getHomeAddress = () => {
//   if (window.GlobalConfig.messageType) {
//     if (window.GlobalConfig.messageType === 'AppInstall') {
//       window.GlobalConfig.homeAddress = '/home';
//     } else if (window.GlobalConfig.bizObjectId && window.GlobalConfig.enableAssociation) {
//       window.GlobalConfig.homeAddress = `/sheet-home/${window.GlobalConfig.bizObjectId}/${window.GlobalConfig.schemaCode}`;
//     } else {
//       window.GlobalConfig.homeAddress = '/formPage';
//     }
//   } else if (window.GlobalConfig.reportCode) {
//     window.GlobalConfig.homeAddress = '/report';
//   } else if (window.GlobalConfig.menuCode && !window.GlobalConfig.isList) {
//     window.GlobalConfig.homeAddress = '/formPage';
//   } else if (window.GlobalConfig.appCode) {
//     if (window.GlobalConfig.appCode && window.GlobalConfig.isList) {
//       window.GlobalConfig.homeAddress = '/list';
//     } else if (window.GlobalConfig.appCode === 'Sys_Workflow') {
//       window.GlobalConfig.appCode = 'home';
//       window.GlobalConfig.solutionCode = 'home';
//       window.GlobalConfig.homeAddress = '/myWork';
//     } else if (window.GlobalConfig.isIsv && window.GlobalConfig.isIsv !== '0' && window.GlobalConfig.solutionCode) {
//       if (!window.GlobalConfig.hasInstalled && window.GlobalConfig.solutionCode.toLowerCase() !== 'home') {
//         window.GlobalConfig.homeAddress = 'guidance';
//       } else if (!window.GlobalConfig.expired && (
//         window.GlobalConfig.solutionCode.toLowerCase().indexOf('jz') > -1 ||

//         window.GlobalConfig.solutionCode.toLowerCase().indexOf('standard') > -1 ||
//         window.GlobalConfig.solutionCode.toLowerCase().indexOf('school') > -1 ||
//         window.GlobalConfig.solutionCode.toLowerCase().indexOf('pro') > -1)) {
//         const guide = eval(localStorage.getItem(`isShowGuidance-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionCode}`));
//         if (!guide) {
//           window.GlobalConfig.homeAddress = '/guidance';
//         } else if (window.GlobalConfig.isShowGuide) {
//           window.GlobalConfig.homeAddress = '/guide';
//         } else {
//           window.GlobalConfig.homeAddress = '/home';
//         }
//       } else if (window.GlobalConfig.isShowGuide) {
//         window.GlobalConfig.homeAddress = '/guide';
//       } else {
//         window.GlobalConfig.homeAddress = '/home';
//       }
//     } else if (process.env.NODE_ENV === 'development') {
//       window.GlobalConfig.homeAddress = '/login';
//     } else if (window.GlobalConfig.isShowGuide) {
//       window.GlobalConfig.homeAddress = '/guide';
//     } else {
//       window.GlobalConfig.homeAddress = '/home';
//     }
//   } else if (process.env.NODE_ENV === 'development') {
//     window.GlobalConfig.homeAddress = '/login';
//   } else if (window.GlobalConfig.isIsv && window.GlobalConfig.isIsv !== '0' && window.GlobalConfig.solutionCode) {
//     if (!window.GlobalConfig.hasInstalled && window.GlobalConfig.solutionCode.toLowerCase() !== 'home') {
//       window.GlobalConfig.homeAddress = 'guidance';
//     } else if (!window.GlobalConfig.expired && (
//       window.GlobalConfig.solutionCode.toLowerCase().indexOf('jz') > -1 ||
//       window.GlobalConfig.solutionCode.toLowerCase().indexOf('ehr') > -1 ||
//       window.GlobalConfig.solutionCode.toLowerCase().indexOf('standard') > -1 ||
//       window.GlobalConfig.solutionCode.toLowerCase().indexOf('school') > -1 ||
//       window.GlobalConfig.solutionCode.toLowerCase().indexOf('pro') > -1)) {
//       const guide = eval(localStorage.getItem(`isShowGuidance-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionCode}`));
//       if (!guide) {
//         window.GlobalConfig.homeAddress = '/guidance';
//       } else {
//         window.GlobalConfig.homeAddress = '/home';
//       }
//     } else if (window.GlobalConfig.isShowGuide) {
//       window.GlobalConfig.homeAddress = '/guide';
//     } else {
//       window.GlobalConfig.homeAddress = '/home';
//     }
//   } else if (window.GlobalConfig.isShowGuide) {
//     window.GlobalConfig.homeAddress = '/guide';
//   } else {
//     window.GlobalConfig.homeAddress = '/home';
//   }
// };
