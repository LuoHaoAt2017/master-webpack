import { ViewModelAction } from './types';
// import { formLogicService } from '@/lib/form-logic';
import formLogicService from 'h3yun-formlogic/src/instance/service';

const actions = {
  // 表单Action发送请求 提交、暂存....
  [ViewModelAction.DOACTION] (context, {
    bizObjectId, actionControl, inputCommnets, attachments, url, currentCommentId, reqParams = {},
  }) {
    const form = formLogicService.getInstance(bizObjectId);
    if (form) {
      return form.$doAction(
        actionControl,
        inputCommnets,
        attachments,
        url,
        currentCommentId,
        reqParams,
      );
    }
    return '';
  },
  // 提交数据之后执行自定义代码的aftersubmit
  [ViewModelAction.DOAFTERSUBMIT] (context, { action, responseValue, bizObjectId }) {
    const form = formLogicService.getInstance(bizObjectId);
    if (form) {
      return form.$customApi.AfterSubmit(
        action,
        responseValue,
      );
    }
    return '';
  },
  // 表单校验
  [ViewModelAction.DOVALIDATE] (context, { bizObjectId, actionName }) {
    const logicValid = formLogicService.getInstance(bizObjectId).$validate(actionName);
    return logicValid;
  },
  // 表单控件层级
  // 控件渲染层 控件输入
  [ViewModelAction.INPUT] (context, { namespace, value }) {
    const control = formLogicService.getControl(namespace);
    control.value = value;
  },
  // 表单控件层级
  // 控件渲染层 控件输入
  [ViewModelAction.INPUTQUERY] (context, payload) {
    setTimeout(() => {
      context.dispatch(ViewModelAction.INPUT, payload);
    }, 0);
  },
  // 控件渲染层 校验
  [ViewModelAction.CLEARVALID] (context, { namespace }) {
    const control = formLogicService.getControl(namespace);
    control.valid = {};
  },
  // 表单当前状态
  [ViewModelAction.GETFORMSTATE] (context, { bizObjectId }) {
    const form = formLogicService.getInstance(bizObjectId);
    return form && form.$stateMachine ? form.$stateMachine.state : '';
  },
  // 渲染层图片 附件 附加值，删除的文件
  [ViewModelAction.DELFILES] (context, { namespace, delFiles }) {
    const control = formLogicService.getControl(namespace);
    control.delFiles = delFiles;
  },
  // 正在上传中的附件添加到标记数组
  [ViewModelAction.ADDUPLOADINGFILE] (context, { namespace, fileId }) {
    const control = formLogicService.getControl(namespace);
    if (!control.uploadingFiles) {
      control.uploadingFiles = [];
    }
    control.uploadingFiles.push(fileId);
  },
  // 从标记数组中删除上传完成的附件
  [ViewModelAction.POPUPLOADEDFILE] (context, { namespace, fileId }) {
    const control = formLogicService.getControl(namespace);
    const index = control.uploadingFiles.indexOf(fileId);
    control.uploadingFiles.splice(index, 1);
  },
  // 标记控件是否有正在上传中的图片附件
  [ViewModelAction.CHANGISUPLOADINGSTATUS] (context, { namespace, status }) {
    const control = formLogicService.getControl(namespace);
    control.isUploading = status;
  },
  // 渲染层 子表添加行
  [ViewModelAction.ADDROW] (context, { namespace }) {
    const control = formLogicService.getControl(namespace);
    control.$addRow();
  },
  // 渲染层 子表复制行
  [ViewModelAction.COPYROW] (context, { namespace, objectId, index }) {
    const control = formLogicService.getControl(namespace);
    control.$copyRow(objectId, index);
  },
  // 渲染层 子表删除行
  [ViewModelAction.DELETEROW] (context, { namespace, rowId }) {
    const control = formLogicService.getControl(namespace);
    control.$deleteRow(rowId);
  },
  // 关联表单数据过滤
  [ViewModelAction.QUERYFILTER] (context, { bizObjectId, dataField, rowId }) {
    const control = formLogicService.getControl(bizObjectId, dataField);
    return control.$queryFilterData(rowId);
  },
  // 视图层触发click事件，触发自定义代码BindClickEvt的回调
  [ViewModelAction.TRIGGERCLICK] (context, { namespace }) {
    const control = formLogicService.getControl(namespace);
    if (control.$customClickEvt) {
      control.$customClickEvt();
    }
  },
  // 设置下拉框的默认选项
  [ViewModelAction.SETDEFAULTITEMS] (context, { namespace }) {
    const control = formLogicService.getControl(namespace);
    return control.$getSheetData();
  },
  // IShowForm 自定义接口的callback，将来在迭代中需要更改执行方式
  // to do: 这里只是临时解决方案，以后一定要改
  [ViewModelAction.ISHOWFORMCB] (context, { callback, actionName }) {
    const currentForm = formLogicService.getCurrentForm();
    if (currentForm && typeof callback === 'function') {
      const customCodeApi = currentForm.$customApi;
      const paramsData = currentForm.$getPostValue({ Action: actionName });
      callback.call(customCodeApi, paramsData);
    }
  },

};

export default actions;
