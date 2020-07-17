import jquery from 'jquery';
import { noop, isEmptyObject, jsonParse } from '../../utils';
import { closeApp } from '@/config/dingtalk-interface';
// import fetch from '@/config/fetch';
import { baseUrl } from '@/config/env';
import { debugCode } from '../../utils/debug';
import ControlApiProxy from './control-api-proxy';
import h3PluginDeveloper from '../../../h3-plugins-developer';
import { CustomApiOverride } from './custom-api-overrides';

const actionSubmit = 'Submit';
const ajaxUrl = '/Form/OnAction';
const baseActionName = 'DoAction';

function formatJavascript (javascript) {
  javascript = javascript.replace(/(\$.extend)|(\$\.I)/g, (match) => {
    switch (match) {
      case '$.extend':
        return 'Object.assign';
      // case '$.JForm':
      //   return '{}';
      // case '$.SmartForm':
      //   return 'this';
      case '$.I':
        return 'H3PluginDeveloper.I';
      default:
        break;
    }
    return false;
  });
  javascript = `try{var $ = function(a,b) { return jquery(a,b); };$.SmartForm = this; $.JForm = {};${debugCode};${javascript}; \r }catch(err){console.error('自定义代码执行错误');console.error(err);}finally{return $.JForm;}`;
  return javascript;
}

function initCustomApi (formInstance, javascript) {
  if (javascript) {
    Object.defineProperty(this, 'ResponseContext', {
      get: function getter () {
        return formInstance.$responseContext;
      },
    });
    const formatedJavascript = formatJavascript.call(this, javascript);
    const H3PluginDeveloper = CustomApiOverride(this, h3PluginDeveloper);
    const customApiFunc = new Function('H3PluginDeveloper', 'jquery', formatedJavascript);
    const customApi = customApiFunc.call(this, H3PluginDeveloper, jquery);
    if (customApi.OnLoad) {
      this.OnLoad = customApi.OnLoad.bind(this);
    }
    if (customApi.OnLoadActions) {
      this.OnLoadActions = customApi.OnLoadActions.bind(this);
    }
    if (customApi.OnValidate) {
      this.OnValidate = customApi.OnValidate.bind(this);
    }
    if (customApi.BeforeSubmit) {
      this.BeforeSubmit = customApi.BeforeSubmit.bind(this);
    }
    if (customApi.AfterSubmit) {
      this.AfterSubmit = customApi.AfterSubmit.bind(this);
    }
    formInstance.$batchAllRendered((dataField, control) => {
      this[dataField] = new ControlApiProxy(control);
    });
  }
}

function addDefaultActions (formInstance) {
  if (!formInstance.$responseContext ||
    isEmptyObject(formInstance.$responseContext.Actions)) return;

  for (const key in this.Actions) {
    if (Object.prototype.hasOwnProperty.call(this.Actions, key)) {
      // 新建流程不应该有查看流程按钮
      if (formInstance.$responseContext.IsCreateMode &&
          formInstance.$responseContext.Actions[actionSubmit]) {
        if (formInstance.$responseContext.Actions[key].Action === 'ViewInstance') {
          continue;
        }
      }
      this.Actions.push(formInstance.$responseContext.Actions[key]);
      if (key === actionSubmit &&
          formInstance.$responseContext.IsCreateMode &&
          !formInstance.$responseContext.IsMobile &&
          H3PluginDeveloper.isEmptyObject(formInstance.$responseContext.WorkflowCode)) {
        this.Actions.push(this.SubmitAndAddAction);
      }
    }
  }
}

function initCustomActions (formInstance) {
  if (formInstance.$responseContext != null &&
    formInstance.$responseContext.Actions !== undefined) {
    // 初始化Action集合
    for (const action in formInstance.$responseContext.Actions) {
      if (Object.prototype.hasOwnProperty.call(formInstance.$responseContext.Actions, action)) {
        this.Actions.push(formInstance.$responseContext.Actions[action]);
      }
    }
  }
  if (this.Actions && this.Actions.length === 0) {
    addDefaultActions(formInstance);
  }
}

export default function CustomApi (formInstance, javascript) {
  // 表单状态
  this.SmartFormMode = {
    // 未指定
    Unspecified: -1,
    // 编辑模式
    Edit: 0,
    // 查看模式
    Readonly: 1,
    // 发起流程
    Create: 2,
    // 打印模式
    Print: 3,
  };
  this.BizObjectStatus = {
    // / 草稿，对于表单来说，用户点保存，表示是草稿状态；对于流程来说，审批完成前，都是草稿状态
    Draft: 0,
    // / 审批通过
    Effective: 1,
    // / 被取消
    Canceled: 3,
    // 进行中
    Running: 2,
  };
  this.Actions = [];
  // 提交
  this.RequestParameters = formInstance.$responseContext.RequestParameters;
  initCustomApi.call(this, formInstance, javascript);
  initCustomActions.call(this, formInstance);
  // this.OnLoad();
}

CustomApi.prototype.OnLoad = noop;

CustomApi.prototype.OnLoadActions = noop;

CustomApi.prototype.OnValidate = function OnValidate () {
  return true;
};

CustomApi.prototype.BeforeSubmit = noop;

CustomApi.prototype.AfterSubmit = noop;

CustomApi.prototype.ClosePage = function ClosePage () {
  // 关闭页面
  // 判断是否是移动端
  if (this.ResponseContext.IsMobile) {
    // 判断是否通过消息传过来的
    if (window.GlobalConfig.messageType) {
      closeApp();
    } else {
      window.history.go(-1);
    }
  }
};

CustomApi.prototype.PostForm = function PostForm (
  action,
  data, callback, errorhandler, isAsync = true,
) {
  const that = this;
  if (data.PostValue) {
    let PostValue = '';
    if (typeof data.PostValue === 'string') {
      PostValue = jsonParse(data.PostValue);
    } else {
      PostValue = data.PostValue;
    }
    const beforSubmitResult = that.BeforeSubmit(action, PostValue);
    if (typeof (beforSubmitResult) !== 'undefined' && !beforSubmitResult) {
      return;
    }
  }
  const paramData = Object.assign({
    Command: action,
  }, data, that.RequestParameters);
  paramData.ActionName = baseActionName;
  const params = {
    PostData: JSON.stringify(paramData),
  };
  $.ajax({
    url: baseUrl + ajaxUrl,
    method: 'post',
    data: params,
    dataType: 'json',
    async: isAsync,
    success (response) {
      if (response.Successful) {
        that.AfterSubmit(
          action.Action ? action.Action : action,
          response.ReturnData.StartFormResponse,
        );
        if (typeof callback === 'function') {
          callback(response.ReturnData.StartFormResponse);
        }
      } else {
        errorhandler(response);
      }
    },
    error (err) {
      errorhandler(err);
      // reject(err);
    },
  });
  // postForm(action, params, isAsync)
  //   .then((response) => {
  //     if (response.Successful) {
  //       that.AfterSubmit(
  //         action.Action ? action.Action : action,
  //         response.ReturnData.StartFormResponse,
  //       );
  //       if (typeof callback === 'function') {
  //         callback(response.ReturnData.StartFormResponse);
  //       }
  //     }
  //   });
};
