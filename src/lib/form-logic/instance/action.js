import { postForm } from '../utils/http';
import { jsonParse } from '../utils';
import H3PluginDeveloper from '../../h3-plugins-developer';

const $saveSheetData = (formInstance) => {
  const SheetData = {};
  formInstance.$batchAllRendered((dataField, control) => {
    if (control.controlKey !== 'FormFormula' && control.controlKey !== 'FormButton' && !control.options.sourcetype) {
      try {
        Object.assign(SheetData, control.$saveDataField(control.value));
      } catch (error) {
        if (formInstance.$$debugMode) {
          const errorMsg = `控件${control.options.DisplayName}-${control.dataField}保存数据失败`;
          formInstance.$errorHandler(errorMsg, error);
          throw error; // 抛出异常到外层catch
        }
      }
    }
  });
  return SheetData;
};

const $postForm = (formInstance, postValue, actionName) => {
  const data = postValue;
  const responseContext = { ...formInstance.$responseContext };
  let requestParameters = responseContext.RequestParameters;
  if (!requestParameters && (responseContext.IsExternalForm || responseContext.IsExternalShare)) {
    // 修复后台返回requestParameters为null的异常现象
    requestParameters = responseContext.requestParameters = {
      BizObjectId: responseContext.BizObjectId,
      IsExternalForm: responseContext.IsExternalForm ? 'True' : 'False',
      IsExternalShare: responseContext.IsExternalShare ? 'True' : 'False',
      Mode: responseContext.IsCreateMode ? 'Create' : 'Edit',
      SchemaCode: responseContext.SchemaCode,
      WorkflowVersion: responseContext.WorkflowVersion,
    };
    formInstance.$responseContext = responseContext;
  }
  if (data.PostValue) {
    const PostValue = jsonParse(data.PostValue);
    const beforSubmitResult = formInstance.$customApi.BeforeSubmit(actionName, PostValue);
    if (typeof (beforSubmitResult) !== 'undefined' && !beforSubmitResult) {
      return Promise.resolve(false);
    }
    data.PostValue = JSON.stringify(PostValue);
  }
  formInstance.$stateMachine.state = 'none';
  const paramData = Object.assign({
    Command: actionName,
  }, postValue, requestParameters);
  return postForm(actionName, paramData);
};
/**
 *
 * @param {*}  reqParams 表单保存的时候需要增加额外的数据到后台
 */
const $submit = (formInstance, actionControl, text, attachments, url, currentCommentId, reqParams = {}) => {
  H3PluginDeveloper.IShowPreLoader('提交中');
  const sheetPostValue = formInstance.$getPostValue(actionControl);
  const result = {
    CommentId: H3PluginDeveloper.IGuid(),
    Text: text || '同意',
    IsNewComment: true,
  };

  if (currentCommentId) {
    result.IsNewComment = false;
    result.CommentId = currentCommentId;
  }

  if ((formInstance.$responseContext.InstanceId ||
      formInstance.$responseContext.WorkItemId) &&
    !formInstance.$responseContext.IsCreateMode &&
    formInstance.$responseContext.WorkflowState !== 4 &&
    formInstance.$responseContext.WorkItemType === 2) {
    result.AttachmentIds = attachments;
    result.Signature = url;
  }
  sheetPostValue.Comment = result;
  return $postForm(formInstance, {
    PostValue: JSON.stringify({
      ...sheetPostValue,
      ...reqParams,

    }),
  }, actionControl.Action);
};
/**
 *
 * @param {*}  reqParams 表单保存的时候需要增加额外的数据到后台
 */
const $save = (formInstance, actionControl, reqParams = {}) => {
  H3PluginDeveloper.IShowPreLoader('暂存中');
  const sheetPostValue = formInstance.$getPostValue(actionControl);
  return $postForm(formInstance, {
    PostValue: JSON.stringify({
      ...sheetPostValue,
      ...reqParams,
    }),
  }, actionControl.Action);
};

const $remove = (formInstance, actionControl) => {
  H3PluginDeveloper.IShowPreLoader('删除中');
  const sheetPostValue = formInstance.$getPostValue(actionControl);
  return $postForm(formInstance, {
    PostValue: JSON.stringify(sheetPostValue),
  }, actionControl.Action);
};

const $finishInstance = (formInstance, actionControl) => {
  const sheetPostValue = formInstance.$getPostValue(actionControl);
  return $postForm(formInstance, {
    PostValue: JSON.stringify(sheetPostValue),
  }, actionControl.Action);
};

const $retrieveInstance = (formInstance, actionControl) => $postForm(
  formInstance, {},
  actionControl.Action,
);

const $reject = (formInstance, actionControl, text, attachments, url, currentCommentId) => {
  const sheetPostValue = formInstance.$getPostValue(actionControl);
  const result = {
    CommentId: H3PluginDeveloper.IGuid(),
    Text: text,
    IsNewComment: true,
    AttachmentIds: attachments,
    Signature: url,
  };

  if (currentCommentId) {
    result.IsNewComment = false;
    result.CommentId = currentCommentId;
  }

  sheetPostValue.Comment = result;
  return $postForm(formInstance, {
    PostValue: JSON.stringify(sheetPostValue),
  }, actionControl.Action);
};

const $forward = (formInstance, actionControl, text, attachments) => {
  const sheetPostValue = {
    Command: actionControl.Action,
    Data: {},
    DestActivityCode: '',
    InstanseName: '',
    ForwardTo: attachments, // 指要转发的人员
  };
  const comment = {
    CommentId: H3PluginDeveloper.IGuid(),
    Text: text,
    IsNewComment: true,
  };
  sheetPostValue.Comment = comment;
  return $postForm(formInstance, {
    PostValue: JSON.stringify(sheetPostValue),
  }, actionControl.Action);
};

const $onAction = (formInstance, actionControl) => {
  const datas = actionControl.Datas;
  // 构造数据项的值
  // 构造数据项的值
  const commandParams = {
    Command: actionControl.Action,
  };
  let params = [];
  // 可能是自定义代码里面有Datas,如果是，再把注释打开
  if (typeof (actionControl.LoadControlValue) === 'undefined' || actionControl.LoadControlValue) {
    if (datas) {
      for (let i = 0; i < datas.length; i += 1) {
        if (datas[i].toString().indexOf('{') === 0) {
          const key = datas[i].replace('{', '').replace('}', '');
          params.push(H3PluginDeveloper.ControlManager.GetControlValue(key));
        } else if (datas[i].toString().indexOf('#') === 0) {
          params.push(H3PluginDeveloper.ControlManager.GetControlValue(datas[i]));
        } else {
          params.push(datas[i]);
        }
      }
    }
  } else {
    params = datas;
  }
  commandParams.Param = JSON.stringify(params);
  commandParams.PostValue = JSON.stringify(formInstance.$getPostValue(actionControl));
  return $postForm(formInstance, commandParams, actionControl.Action);
};

function validateFileUploaded () {
  let pass = true;
  this.$batchAllRendered((dataField, control) => {
    if (control.$validateUploaded && !control.$validateUploaded()) {
      pass = false;
    }
  });
  return pass;
}

export default {
  $validate (actionName) {
    let pass = true;
    let invalidControl = null;
    this.$batchAllRendered((dataField, control) => {
      if (control.visible) {
        const value = control.value;
        if (!control.$validate(value, actionName)) {
          pass = false;
          if (!invalidControl) {
            invalidControl = dataField;
          }
        }
      }
    });
    return { pass, invalidControl };
  },
  /**
   *
   * @param {*}  reqParams 表单保存的时候需要增加额外的数据到后台
   */
  $doAction (actionControl, text, attachments, url, currentCommentId, reqParams = {}) {
    try {
      const formInstance = this;
      let actionResult = null;
      // 不允许重复提交
      if (this.$stateMachine.state === 'onaction') {
        return false;
      }
      this.$triggerEvent('doAction');
      if (actionControl.Action === 'Submit') {
        // 自定义action校验
        // 自定义按钮由开发者自己校验
        if (actionControl.Action !== 'Remove' && !formInstance.$customApi.OnValidate(actionControl)) {
          return false;
        }
        actionResult = $submit(formInstance, actionControl, text, attachments, url, currentCommentId, reqParams);
      } else if (actionControl.Action === 'Save') {
        const valid = validateFileUploaded.call(this);
        if (!valid) {
          return false;
        }
        actionResult = $save(formInstance, actionControl, reqParams);
      } else if (actionControl.Action === 'Remove') {
        actionResult = $remove(formInstance, actionControl);
      } else if (actionControl.Action === 'Reject') {
        if (!formInstance.$customApi.OnValidate(actionControl)) {
          return false;
        }
        actionResult = $reject(formInstance, actionControl, text, attachments, url, currentCommentId);
      } else if (actionControl.Action === 'FinishInstance') {
        actionResult = $finishInstance(formInstance, actionControl);
      } else if (actionControl.Action === 'RetrieveInstance') {
        actionResult = $retrieveInstance(formInstance, actionControl);
      } else if (actionControl.Action === 'Forward') {
        actionResult = $forward(formInstance, actionControl, text, attachments);
      } else {
        // 自定义按钮由开发者自己校验
        if (!formInstance.$customApi.OnValidate(actionControl)) {
          return false;
        }
        actionResult = $onAction(formInstance, actionControl, text, attachments);
      }
      const asyncId = this.$hangupAsync();
      return actionResult.then((response) => {
        this.$resolveAsync(asyncId);
        return response;
      });
    } catch (error) {
      if (this.$$debugMode) {
        this.$errorHandler(`Action:${actionControl.Action}失败`, error);
      }
      this.$rejectAsync();
      return false;
    } finally {
      this.$triggerEvent('actionDone');
    }
  },

  $getPostValue (actionControl) {
    const actionName = actionControl.Action;
    const sheetPostValue = {
      Command: actionName,
      DestActivityCode: '',
      InstanceName: '',
      Data: {}, // 当前表单的数据项集合值
      Comment: {},
    };
    if (actionName === 'Remove' || actionName === 'Forward') {
      return sheetPostValue;
    }
    sheetPostValue.Data = $saveSheetData(this);
    return sheetPostValue;
  },
};
