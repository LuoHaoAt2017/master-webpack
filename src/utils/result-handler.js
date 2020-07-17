import H3PluginDeveloper from '../lib/h3-plugins-developer';
import { isDingtalk } from '../config/common';
import { closeApp } from '../config/dingtalk-interface';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';

// 回调函数处理
export default function resultHandler(
  actionControl, data, $vue, bizObjectId, isExternalFormBol,
  schemaCode, ReviewQrCodeUrl, DisplayName, EnableReviewExternalForm,
) {
  const self = $vue;
  if (actionControl.OnActionDone) {
    if (!actionControl.OnActionDone.apply(actionControl, [data])) {
      return;
    }
  }
  if (data.Successful) {
    // 单页模式为240，目前移动端做不到操作后重新刷新页面，只能先把页面关闭，与PC端不一致
    if (
      data.ClosePage || data.NodeType === 240 || (!data.ClosePage && isExternalFormBol)
    ) {
      let successTips;
      const responseContext = self.$store.state.Form.ViewModel[bizObjectId].$responseContext;
      if (actionControl.Action === 'Reject' ||
      (actionControl.Action === 'Submit' &&
      (responseContext.InstanceId || responseContext.WorkItemId) &&
      !responseContext.IsCreateMode && responseContext.WorkflowState !== 4 &&
      responseContext.WorkItemType === 2)) {
        successTips = '审批完成';
      } else {
        successTips = `${actionControl.Text}成功`;
      }
      if (data.Message) {
        H3PluginDeveloper.IShowTip(data.Message);
      }
      if (successTips) {
        H3PluginDeveloper.IShowSuccess('提示', successTips, () => {
          self.$store.state.actionName = actionControl.Action;
          const historyRoutes = self.$router.options.routes;
          if (((!window.GlobalConfig.schemaCode || self.$store.state.hasVirtualHeader) &&
            !window.GlobalConfig.menuCode && !window.GlobalConfig.isExternalForm)
          || window.GlobalConfig.isList) {
            if (actionControl.Action === 'Remove') {
              self.$root.eventHub.$emit('form-remove');
              if (self.fromBoard) {
                self.$root.eventHub.$emit('form-card-remove', bizObjectId);
              }
            }
            if (successTips === '审批完成') {
              self.$router.go(-2);
              if (self.fromBoard) {
                self.$root.eventHub.$emit('form-card-edit', bizObjectId);
              }
            } else if (self.fromHome && data.NodeType !== 240) {
              const appCode = self.appCode;
              const schemaCode = self.schemaCode;
              const appName = self.DisplayName;
              self.$root.eventHub.$emit('query-lists');
              self.$router.replace({
                name: 'list',
                params: { appCode, schemaCode, appName },
              });
            } else if (self.fromFormQuery) {
              if (self.fromBoard) {
                self.$root.eventHub.$emit('form-card-edit', bizObjectId);
              }
              self.$router.go(-1);
            } else if (self.$route.params.fromFormDesign ||
              self.$route.query.fromFormDesign
            ) {
              // 移动端设计器路由跳转
              const appCode = self.appCode;
              const schemaCode = self.schemaCode;
              const appName = self.DisplayName;
              self.$router.replace({
                name: 'lightListPage',
                query: {
                  appCode,
                  sheetCode: schemaCode,
                  sheetName: appName
                },
                params: {
                  addData: true
                }
              });
            } else if (self.fromBoard && actionControl.Action !== 'Remove') {
              self.$root.eventHub.$emit('form-card-edit', bizObjectId);
              self.$router.go(-1);
            } else {
              self.$router.go(-1);
            }
          } else if (EnableReviewExternalForm) {
            if (responseContext.IsCreateMode) {
              if (!self.islightapp) {
                self.$router.push({
                  name: 'externalForm',
                  params: {
                    ReviewQrCodeUrl,
                    schemaCode: schemaCode || window.GlobalConfig.schemaCode,
                    bizObjectId: bizObjectId || responseContext.BizObjectId,
                    displayName: DisplayName,
                    isExternalForm: '1',
                  },
                });
              } else {
                // 3.0分享填单填写后关闭
                if (isDingtalk) {
                  closeApp();
                } else if (typeof (WeixinJSBridge) !== 'undefined') {
                  WeixinJSBridge.call('closeWindow');
                  return;
                } else {
                  const browserName = navigator.appName;
                  if (browserName === 'Netscape') {
                    window.open('', '_self', '');
                    window.close();
                  }
                  if (browserName === 'Microsoft Internet Explorer') {
                    window.parent.opener = 'whocares';
                    window.parent.close();
                  }
                }
              }
            } else if (isDingtalk) {
              setTimeout(() => {
                closeApp();
              }, 300);
            } else if (typeof (WeixinJSBridge) !== 'undefined') {
              WeixinJSBridge.call('closeWindow');
              return;
            } else {
              const browserName = navigator.appName;
              if (browserName === 'Netscape') {
                window.open('', '_self', '');
                window.close();
              }
              if (browserName === 'Microsoft Internet Explorer') {
                window.parent.opener = 'whocares';
                window.parent.close();
              }
            }
          } else if (isDingtalk) {
            closeApp();
          } else if (typeof (WeixinJSBridge) !== 'undefined') {
            WeixinJSBridge.call('closeWindow');
            return;
          } else {
            const browserName = navigator.appName;
            if (browserName === 'Netscape') {
              window.open('', '_self', '');
              window.close();
            }
            if (browserName === 'Microsoft Internet Explorer') {
              window.parent.opener = 'whocares';
              window.parent.close();
            }
          }
          self.$root.eventHub.$emit('form-updated');
          if (!self.fromFormQuery && $vue.$route.query.refleshRoute !== '2') {
            self.$store.state.excludeComp = ['formPage'];
          }
          // 判断ISHowForm是否有回调函数，如果就就先执行，再赋空值；
          if (window.GlobalConfig.callbackCache.length && actionControl.Action !== 'Close') {
            $vue.$store.dispatch(`Form/ViewModel/${ViewModelAction.ISHOWFORMCB}`, {
              callback: window.GlobalConfig.callbackCache[0], actionName: actionControl.Action,
            });
            // window.GlobalConfig.callbackCache[0](that.GetPostValue(actionControl.Action));
            window.GlobalConfig.callbackCache = [];
          }
        }, 500);
      } else {
        self.$router.go(-1);
        self.$root.eventHub.$emit('form-updated');
        self.$store.state.excludeComp = ['formPage'];
        // 判断ISHowForm是否有回调函数，如果就就先执行，再赋空值；
        if (window.GlobalConfig.callbackCache.length && actionControl.Action !== 'Close') {
          // window.GlobalConfig.callbackCache[0](that.GetPostValue());
          $vue.$store.dispatch(`Form/ViewModel/${ViewModelAction.ISHOWFORMCB}`, {
            callback: window.GlobalConfig.callbackCache[0], actionName: actionControl.Action,
          });
          window.GlobalConfig.callbackCache = [];
        }
      }
    } else if (data.Message) {
      H3PluginDeveloper.IShowTip('提示', data.Message);
    }
  } else {
    // Error:错误提示方式需要修改
    if (data.Errors.length) {
      for (let i = 0; i < data.Errors.length; i += 1) {
        const errorMessage = data.Errors[i];
        H3PluginDeveloper.IErrorConfirm('系统出错了，请联系相关人员处理', (result) => {
          if (result === 1) {
            self.$router.push({
              name: 'errorShow',
              params: {
                errorInfo: errorMessage,
              },
            });
          }
        });
      }
    }
    if (data.Infos && data.Infos.length) {
      for (let i = 0; i < data.Infos.length; i += 1) {
        let info = data.Infos[i].replace(/</g,'&lt;');
        H3PluginDeveloper.IShowWarn('提示', info, () => false);
      }
    }
    if (data.Message) {
      H3PluginDeveloper.IShowTip('提示', data.Message);
    }
  }
}
