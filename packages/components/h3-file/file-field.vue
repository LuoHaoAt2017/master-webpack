<template>
  <div>
    <file-field-pane
      ref="pane"
      :placeholder="placeholder"
      :label="name"
      :fileList="fileList"
      :readOnly="readOnly"
      :required="required"
      :files="files"
      :onFileDelete="handleDeleteFile"
      :onFilePreview="handlePreviewFile"
      :onFileDownload="onFileDownload"
      :hasFieldLine="hasFieldLine"
      :onImagePreview="handlePreview"
    ></file-field-pane>
  </div>
</template>


<script>
  import UploadCore from '../../libs/uploadcore/';
  import { getData, guid } from '../../utils/utility';
  import FileFieldPane from './file-pane';

  window.UploadCore = UploadCore;

  export default {
  name: 'h3-file-fild',
  props: {
  multiple: { // 是否同时上传多个附件
  type: Boolean,
  defalult: true,
  },
  corpId: {
  type: String,
  },
  layout: {
  type: String,
  default: 'h',
  validator: val => ['v', 'h'].indexOf(val) > -1,
  },
  placeholder: {
  type: String,
  default: '请选择附件',
  },
  max: { // 钉钉组件一次性最多选择上传附件个数
  type: Number,
  default: 3,
  },
  maxUpload: { // 总共上传附件总数
  type: Number,
  default: 100,
  },
  fileList: {
  type: Array,
  default: () => [],
  },
  readOnly: {
  type: Boolean,
  default: false,
  },
  url: {
  type: String,
  },
  required: {
  type: Boolean,
  },
  params: {
  type: Object,
  default: () => {},
  },
  name: {
  type: String,
  default: 'file',
  },
  sizeLimit: {
  type: String,
  default: '10m',
  },
  isUpdated: {
    type: Boolean,
    default: false,
  },
  onChange: Function,
  onDelete: Function,
  onFilePreview: Function,
  onFileDownload: Function,
  onImagePreview: Function,
  },
  components: {
  // ImageViewer,
  FileFieldPane,
  },
  data() {
    return {
      core: null,
      current: 0,
      previewShow: false,
      photos: [],
      placeHolderArea: null,
      uploadPlaceHolder: null,
      iconPicker: null,
      picker: null,
      isAttachmentWillLimited: false,
      isAttachmentLimited: false,
      leaveAttachment: 0,
    };
  },
  mounted() {
    this.core = this.getCore();
    if (this.core) {
      this.core.setOptions({
        queueCapcity: this.getMax() + this.core.getTotal(),
      });
      this.picker = this.core.getPickerCollector();
      const uploadIcon = this.$refs.pane.getUploadIcon();
      const listUploadIcon = this.$refs.pane.getListUploadIcon();
      this.uploadPlaceHolder = this.$refs.pane.getUploadPlaceHolder();
      if (uploadIcon && this.getMax() > 0) {
        this.iconPicker = this.picker.addArea(uploadIcon);
      }
      if (this.uploadPlaceHolder && this.getMax() > 0) {
        this.placeHolderArea = this.picker.addArea(this.uploadPlaceHolder);
      }
      if (listUploadIcon) {
        this.picker.addArea(listUploadIcon);
      }
    }
  },
  methods: {
  getCore() {
  /* eslint-disable */
  // 上传完成
  const core = new UploadCore({  // eslint-disable-line
  request: {
  name: this.name,
  url: this.url,
  params: this.params,
  headers: null,
  withCredentials: false,
  timeout: 0,
  chunkEnable: false,
  },
  processThreads: 3,
  autoPending: true,
  queueCapcity: 0,
  multiple: this.multiple,
  accept: null,
  sizeLimit: this.sizeLimit,
  preventDuplicate: false,
  });

  this.fileuploadstart = (file) => {
    this.$emit("update:isUpdated", true);
  };
  this.fileuploadprogress = (file) => {
  };
  this.fileuploadsuccess = (file) => {
  this.handleSuccess(file);
  };
  this.fileuploaderror = (file, error) => {
  this.$emit('uploadError');
  };
  this.filecancel = () => {
  };
  this.fileuploadprepared = (file) => {
  }
  this.fileuploadpreparing = (request) => {
  const file = request.file;
  request.setParam('FileID', guid());
  request.setParam('FileName', file.name);
  request.setParam('FileType', file.type);
  };
  this.fileQueueError = (error) => {
  if (error.name === 'FileSizeError') {
  this.$emit('fileSizeError');
  }
  };
  core.on(window.UploadCore.Events.QUEUE_ERROR, this.fileQueueError)
  core.on(window.UploadCore.Events.FILE_UPLOAD_PREPARING, this.fileuploadpreparing);
  core.on(window.UploadCore.Events.FILE_UPLOAD_START, this.fileuploadstart);
  core.on(window.UploadCore.Events.FILE_UPLOAD_PREPARED, this.fileuploadprepared);
  core.on(window.UploadCore.Events.FILE_UPLOAD_PROGRESS, this.fileuploadprogress);
  core.on(window.UploadCore.Events.FILE_UPLOAD_SUCCESS, this.fileuploadsuccess);
  core.on(window.UploadCore.Events.FILE_UPLOAD_ERROR, this.fileuploaderror);
  core.on(window.UploadCore.Events.FILE_CANCEL, this.filecancel);

      return core;
    },
    getMax() {
      let realMax = this.maxUpload;
      if (this.maxUpload && (this.max > this.maxUpload - this.fileList.length)) {
        realMax -= this.fileList.length;
      }
      if (this.core) {
        realMax -= this.core.getTotal();
      }
      return realMax;
    },
    getFiles() {
      if (this.core) {
        const files = this.core.getFiles().filter(file =>
          [window.UploadCore.Status.CANCELLED, window.UploadCore.Status.SUCCESS, window.UploadCore.Status.QUEUED].indexOf(file.status) === -1);
        return files;
      }
      return [];
    },
    handleSuccess(file) {
      const response = file.response ? file.response.getJson() : null;
      const data = getData(response);
      if (data.FileExceed) {
        let tipsMessage = '附件量已达上限，请通知公司管理员购买升级附件量套餐。';
        if (window.GlobalConfig.isAdministrator) {
          tipsMessage = '附件量已达上限，请联系客服购买升级附件量套餐。';
        }
        this.$h3.modal.show({
          title: '限制提醒',
          content: tipsMessage,
          type: 'alert',
          actions: [{ text: '知道了', onPress: () => {
          } }],
        });
        return false;
      }
      const result = {
        ext: file.ext,
        name: file.name,
        size: file.size,
        fileType: file.type,
        type: 'upload',
        url: data.url || data.ThumbnailUrl,
        status: file.status,
        response,
      };
      const files = [result];
      const newFileList = this.fileList.concat(files);
      file.cancel(true);
      this.core.getStat().remove(file);
      this.onChange({
        value: files,
      }, newFileList);
    },
    stopListen() {
      this.core.off(window.UploadCore.Events.FILE_UPLOAD_START, this.fileuploadstart);
      this.core.off(window.UploadCore.Events.FILE_UPLOAD_PROGRESS, this.fileuploadprogress);
      this.core.off(window.UploadCore.Events.FILE_UPLOAD_SUCCESS, this.fileuploadsuccess);
      this.core.off(window.UploadCore.Events.FILE_UPLOAD_ERROR, this.fileuploaderror);
    },
    handleDeleteFile(index) {
      this.onDelete(index);
    },
    handlePreviewFile(index) {
      if (this.onFilePreview) {
        this.onFilePreview(index);
      } else {
        this.handlePreview(index);
      }
    },
    // 点击预览
    handlePreview(current) {
      if (this.onImagePreview) {
        this.onImagePreview(current);
      }
    },
    isImgType(file) {
      const fileInfo = file.name.split('.');
      if (fileInfo.length < 2) {
        return false;
      }
      const type = fileInfo[1];
      if (['jpg', 'jpeg', 'png', 'bmp', 'gif'].indexOf(type) > -1) {
        return true;
      }
      return false;
    },
  },
  computed: {
    filesLengthInCore() {
      return this.core ? this.core.getTotal() : 0;
    },
    files() {
      return this.getFiles();
    },
    maxUploadSize() {
      if (!this.multiple) {
        return 1;
      }
      return this.maxUpload;
    },
    hasFieldLine() {
      if (this.fileList.length > 0) {
        return false;
      }
      return true;
    },
  },
  beforeDestroy() {
    this.stopListen();
  },
  watch: {
    fileList(val) {
      if (val.length > 0 ){
        if (this.placeHolderArea) {
          this.placeHolderArea.destroy();
          this.placeHolderArea = null;
        }
      } else {
        if (!this.readOnly && this.picker && !this.placeHolderArea) {
          this.placeHolderArea = this.picker.addArea(this.uploadPlaceHolder);
        }
      }
    },
  }
};
</script>
<style lang="less">
  @import '../../styles/mixins.less';

  @prefix: h3;
  .@{prefix}-file-field {
  background: #fff;
  .@{prefix}-file-list {
    overflow: hidden;
    .@{prefix}-file-field-item,
    .@{prefix}-file-field-upload-item {
      position: relative;
      padding:  8px 0px 8px 15px;
      overflow: hidden;
      display: flex;
      .@{prefix}-file-field-item-icon {
        float: left;
        width: 40px;
        height: 40px;
        margin-right: 8px;
        img {
          width: 100%;
          height: 100%;
        }
        div {
          width: 40px;
          height: 40px;
          line-height: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-radius: 3px;
          text-align: center;
          i {
            font-size: 29px;
            color: #fff;
          }
        }

      }
      .@{prefix}-file-field-item-content {
        position: relative;
        float: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: calc(100% - 60px);
        padding-right: 15px;
        .hairline('bottom',#eee);
        &::after {
          bottom: -8px !important;
        }
        // width: 180px;
        // height: 40px;
        .@{prefix}-file-field-item-content-wrapper {
          display: flex;
          flex-shrink: 2;
          overflow: hidden;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          .@{prefix}-file-field-item-name {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 20px;
            font-size: 14px;
            color: #333;
          }
          .@{prefix}-file-field-item-size {
            line-height: 16px;
            font-size: 12px;
            color: #999;
          }
        }
        .@{prefix}-file-field-item-action{
          flex-shrink: 0;
          display: flex;
          height: 40px;
          line-height: 40px;
          text-align: right;
          i {
            font-size: 20px;
            color: #999;
            &:not(:last-child) {
              margin-right: 8px;
            }
          }
        }
      }
      .@{prefix}-file-field-upload-item-progress {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        opacity: 0.1;
        background: #1890ff;
      }

    }
    .@{prefix}-file-list-add-pane {
      position: relative;
      height: 45px;
      margin-left: 15px;
      .bd-bot(#e4e4e4);
      display: flex;
      justify-content: center;
      align-items: center;
      i{
        color: #38adff;
        font-size: 22px;
      }
      span {
        margin-left: 4px;
        color: #38adff;
        font-size: 17px;
        line-height: 25px;
      }
      i::after {
        margin-right: 4px;
      }
    }

  }
  .@{prefix}-file-field-upload-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-size: 23px;
  }
  }
.attachment-limit-wrapper {
  .h3-modal-popup {
    left: 11%;
    width: 78%;
    .px2rem(top, 140);
    box-sizing: border-box;

    .h3-modal-content {
      .px2rem(border-radius, 14);
    }
  }
}
</style>
