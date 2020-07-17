import { GetMappingFilesData } from '../../utils/http';
import H3PluginDeveloper from '../../../h3-plugins-developer';
import { isEmptyObject, isObject } from '../../utils';

function FormAttachment () {
  this.delFiles = '';
}

FormAttachment.prototype.$valueType = Array;

// FormAttachment.prototype.$clearValue = () => [];
FormAttachment.prototype.$clearValue = function clearValue (value) {
  if (value && value.Attachments &&
    JSON.parse(value.Attachments) instanceof Array &&
    JSON.parse(value.Attachments).length > 0
  ) {
    let ids = '';
    JSON.parse(value.Attachments).forEach((it) => {
      ids += `${it.AttachmentId};`;
    });
    this.delFiles = ids;
  }
  return [];
};

FormAttachment.prototype.$initValue = function initValue (value) {
  let result = [];
  if (value) {
    if (isObject(value)) {
      value = [];
    }
    value.forEach((tempItem) => {
      const item = tempItem;
      if (!item.response) {
        item.name = item.Name;
        item.url = item.ThumbnailUrl || item.Url;
        item.size = item.Size;
        item.AttachmentId = item.Code;
      }
    });
    result = value;
  }
  return result;
};
// 暂时没用到的方法
const getComputeRuleValue = val => (!val.AttachmentIds ? '' : val);

const getHideRuleValue = (value) => {
  let attachmentIds = '';
  if (value.length) {
    value.forEach((item) => {
      if (item.response) {
        attachmentIds += `${item.response.AttachmentId};`;
      } else {
        attachmentIds += `${item.AttachmentId};`;
      }
    });
    return attachmentIds;
  }
  return '';
};

FormAttachment.prototype.$getRuleValue = function getRuleValue (value, bol) {
  if (bol) {
    return getComputeRuleValue(this.viewData);
  }
  return getHideRuleValue(this.viewData);
};

FormAttachment.prototype.$validate = function $validate () {
  let empty = false;
  let isUploaded = true;
  // 暂存的时候不需要校验必填
  if (this.options.Required) {
    empty = !this.viewData.length;
    if (empty) {
      this.valid = { empty };
    }
  }
  if (this.isUploading) {
    isUploaded = false;
    // H3PluginDeveloper.IShowWarn(`抱歉，[${this.options.DisplayName}]选项未上传完`);
    const errorMsg = `抱歉，[${this.options.DisplayName}]选项未上传完`;
    const validToast = typeof (H3PluginDeveloper.showValidMsg) === 'function'
      ? H3PluginDeveloper.showValidMsg
      : H3PluginDeveloper.IShowWarn;
    validToast(errorMsg);
  }
  return !empty && isUploaded;
};
// 暂存的的时候也要校验是否上传完成，附件和图片控件独有的方法
FormAttachment.prototype.$validateUploaded = function validateUploaded () {
  let isUploaded = true;
  if (this.isUploading) {
    isUploaded = false;
    // H3PluginDeveloper.IShowWarn(`抱歉，[${this.options.DisplayName}]选项未上传完`);
    const errorMsg = `抱歉，[${this.options.DisplayName}]选项未上传完`;
    const validToast = typeof (H3PluginDeveloper.showValidMsg) === 'function'
      ? H3PluginDeveloper.showValidMsg
      : H3PluginDeveloper.IShowWarn;
    validToast(errorMsg);
  }
  return isUploaded;
};

FormAttachment.prototype.$getValue = function $getValue (value) {
  const Attachments = [];
  let AttachmentIds = '';
  value.forEach((item) => {
    const Desc = item.desc;
    const AttachmentId = item.response ? item.response.AttachmentId : item.AttachmentId;
    if (item.response) {
      AttachmentIds += `${item.response.AttachmentId};`;
    } else if (item.isNew) {
      AttachmentIds += `${item.AttachmentId};`;
    }
    Attachments.push({
      AttachmentId: AttachmentId,
      Desc: Desc,
    });
  });
  return {
    AttachmentIds,
    Attachments: JSON.stringify(Attachments),
    DelAttachmentIds: this.delFiles,
  };
};

FormAttachment.prototype.$queryAssign =
function queryAssign (assignVal, { queryResult, sourceField, boschemacode }) {
  let ObjectId = 'ObjectId';
  if (sourceField.indexOf('.') > -1) {
    ObjectId = `${sourceField.split('.')[0]}.ObjectId`;
  }
  if (isEmptyObject(queryResult)) {
    this.viewData.forEach((item) => {
      this.delFiles += `${item.AttachmentId};`;
    });
    return [];
  }
  if (!queryResult[ObjectId]) {
    return;
  }
  const resultPromise = GetMappingFilesData(
    boschemacode,
    queryResult[ObjectId],
    sourceField,
  ).then((response) => {
    if (response && response.Successful) {
      // self.value = [];
      this.viewData && this.viewData.forEach((item) => {
        this.delFiles += `${item.AttachmentId};`;
      });
      const tempVal = [];
      const returnData = response.ReturnData.HandlerResult;
      if (returnData && returnData.length > 0) {
        returnData.forEach((result) => {
          tempVal.push({
            AttachmentId: result.FileId,
            code: result.FileId,
            name: result.FileName,
            size: result.Size,
            fileId: result.FileId,
            file: result.Thumb,
            ThumbnailUrl: result.Thumb,
            url: result.Thumb,
            isNew: true,
          });
        });
        return tempVal;
      }
    }
    return [];
  });
  return resultPromise;
};

FormAttachment.prototype.$isEmpty = function isEmpty () {
  return this.viewData.length === 0;
};

export default FormAttachment;
