<template>
  <div>
    <file-field-pane 
      ref="pane"
      :placeholder="placeholder"
      :label="name"
      :hasFieldLine="hasFieldLine"
      :fileList="fileList"
      :readOnly="readOnly"
      :required="required"
      :files="files"
      :placeholderIcon="placeholderIcon"
      :onFileDelete="handleDeleteFile"
      :onFilePreview="handlePreviewFile"
      :onFileDownload="onFileDownload"
    ></file-field-pane>
    <image-viewer v-if="photos.length>0"
      :show.sync="previewShow" 
      :photos="photos" 
      :current="current">
    </image-viewer>
  </div>
</template>


<script>
import UploadCore from '../../libs/uploadcore';
import { getData } from '../../utils/utility';
import ImageViewer from '../h3-imageviewer';
import FileFieldPane from './file-pane';

window.UploadCore = UploadCore;
// const autoFixUrl = (url) => {
//   let newUrl = url;
//   if (newUrl) {
//     // auto fix cdn url
//     if (newUrl.indexOf('//') === 0) {
//       newUrl = `${window.location.protocol}${newUrl}`;
//     }
//   }
//   return newUrl;
// };

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
    onChange: Function,
    onDelete: Function,
    onFilePreview: Function,
    onFileDownload: Function,
    placeholderIcon: {
      type: String,
    },
  },
  components: {
    ImageViewer,
    FileFieldPane,
  },
  data() {
    return {
      core: null,
      current: 0,
      previewShow: false,
      photos: [],
    };
  },
  mounted() {
    this.core = this.getCore();
    if (this.core) {
      this.core.setOptions({
        queueCapcity: this.getMax() + this.core.getTotal(),
      });
      const picker = this.core.getPickerCollector();
      const uploadIcon = this.$refs.pane.getUploadIcon();
      if (uploadIcon && this.getMax() > 0) {
        this.picker = picker.addArea(uploadIcon);
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
        console.info('fileuploadstart', file);
        if (file.status === window.UploadCore.Status.PROGRESS) {
          console.log(file.status);
        }
      };
      this.fileuploadprogress = (file) => {
        console.log(file.progress.percentage);
      };
      this.fileuploadsuccess = (file) => {
        console.log('success');
        this.handleSuccess(file);
      };
      this.fileuploaderror = () => {
        console.log('error');
      };
      this.filecancel = () => {
        console.log('cancel');
      };
      this.fileuploadprepared = (file) => {
        console.log(file);
      };
      this.fileuploadpreparing = (request) => {
        console.log(request);
      };
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
      const result = {
        ext: file.ext,
        name: file.name,
        size: file.size,
        fileType: file.type,
        type: 'upload',
        url: data.url,
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
      this.photos = [];
      for (let i = 0, len = this.fileList.length; i < len; i += 1) {
        const file = this.fileList[i];
        if (this.isImgType(file)) {
          this.photos.push(file);
          if (current === i) {
            this.current = this.photos.length-1;
          }
        }
      }
      this.previewShow = true;
    },
    isImgType(file) {
      const type = this.file.name.split('.')[1];
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
      if (this.files.length > 0) {
        return false;
      }
      return true;
    },
  },
  beforeDestroy() {
    this.stopListen();
  },
};
</script>
<style lang="less">
@import '../../styles/mixins.less';

@prefix: h3;
.@{prefix}-file-field {
  background: #fff;
  .@{prefix}-file-list {
    overflow: hidden;
    .@{prefix}-file-field-item {
      padding:  8px 15px;
      .@{prefix}-file-field-item-icon {
        float: left;
        width: 40px;
        height: 40px;
        margin-right: 8px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .@{prefix}-file-field-item-content {
        float: left;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        width: 180px;
        height: 40px;
        .@{prefix}-file-field-item-name {
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
        float: right;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 102px;
        height: 40px;
        div {
          // padding: 8px;
          border: 1px solid #d8d8d8;
          background: #d8d8d8;
          color: #999;
          font-size: 10px;
          // :not(:last-child) {
          //   margin-right: 8px;
          // }
        }
      }
    }
  }
}
</style>

