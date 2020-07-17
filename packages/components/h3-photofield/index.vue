<template>
  <div>
    <photo-field-pane 
      ref="pane"
      :tip="tip"
      :columns="columns"
      :placeholder="placeholder"
      :label="name"
      :hasFieldLine="hasFieldLine"
      :photoList="photoList"
      :maxUpload="maxUploadSize"
      :readOnly="readOnly"
      :filesLengthInCore="filesLengthInCore"
      :required="required"
      :files="files"
      :hGutter="hGutter"
      :vGutter="vGutter"
      :icon="icon"
      :delIcon="delIcon"
      :placeholderIcon="placeholderIcon"
      :onImageDelete="handleDeleteImage"
      :onImagePreview="handlePreviewImage"
      :onPickerClick="handlePicker"
    ></photo-field-pane>
  </div>
</template>


<script>
import UploadCore from '../../libs/uploadcore';
import { getData, guid } from '../../utils/utility';
// import ImageViewer from '../h3-imageviewer/';
import PhotoFieldPane from './photopane';

window.UploadCore = UploadCore;

const autoFixUrl = (url) => {
  let newUrl = url;
  if (newUrl) {
    // auto fix cdn url
    if (newUrl.indexOf('//') === 0) {
      newUrl = `${window.location.protocol}${newUrl}`;
    }
  }
  return newUrl;
};

export default {
  name: 'h3-photofild',
  props: {
    tip: {
      type: String,
    },
    columns: {
      type: Number,
      defalult: 4,
    },
    multiple: { // 是否同时上传多张照片
      type: Boolean,
      defalult: true,
    },
    layout: {
      type: String,
      default: 'h',
      validator: val => ['v', 'h'].indexOf(val) > -1,
    },
    placeholder: {
      type: String,
      default: '请选择图片',
    },
    max: { // 钉钉组件一次性最多选择上传3张照片
      type: Number,
      default: 1,
    },
    maxUpload: { // 总共上传图片总数
      type: Number,
      default: 12,
    },
    photoList: {
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
    onImagePreview: Function,
    onPicker: Function,
    icon: {
      type: String,
    },
    placeholderIcon: {
      type: String,
    },
    delIcon: {
      type: String,
    },
    hGutter: {
      type: Number,
      default: 12,
    },
    vGutter: {
      type: Number,
      default: 14,
    },
    isUpdated: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    PhotoFieldPane,
  },
  data() {
    return {
      core: null,
      width: `${100 / this.columns}%`,
      current: 0,
      previewShow: false,
      iconPicker: null,
      picker: null,
      placeHolderArea: null,
      uploadPlaceHolder: null,
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
        multiple: this.multiple,
        accept: {
          title: '图片',
          extensions: 'jpg,jpeg,png,gif,webp,bmp',
          mimeTypes: 'image/*' // or 'image/jpeg,image/png'
        },
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
      this.fileuploaderror = () => {
        this.$emit('uploadError');
      };
      this.filecancel = () => {
      };
      this.fileuploadpreparing = (request) => {
        request.setParam('FileID', guid());
      };
      this.fileQueueError = (error) => {
        // this.$emit('maxUploadError');
        if (error.name === 'FileSizeError') {
          this.$emit('maxUploadError');
        } else if (error.name === 'FileExtensionError') {
          this.$emit('fileExtensionError');
        } else {
          this.$emit('fileQueueError');
        }
      };
      this.fileQueueEnd = () => {
      };
      core.on(window.UploadCore.Events.QUEUE_ERROR, this.fileQueueError)
      core.on(window.UploadCore.Events.FILE_UPLOAD_PREPARING, this.fileuploadpreparing);
      core.on(window.UploadCore.Events.FILE_UPLOAD_START, this.fileuploadstart);
      core.on(window.UploadCore.Events.FILE_UPLOAD_PROGRESS, this.fileuploadprogress);
      core.on(window.UploadCore.Events.FILE_UPLOAD_SUCCESS, this.fileuploadsuccess);
      core.on(window.UploadCore.Events.FILE_UPLOAD_ERROR, this.fileuploaderror);
      core.on(window.UploadCore.Events.FILE_CANCEL, this.filecancel);
      core.on(window.UploadCore.Events.QUEUE_UPLOAD_END, this.fileQueueEnd);
    return core;
  },
  getMax() {
  let realMax = this.maxUpload;
  if (this.maxUpload && (this.max > this.maxUpload - this.photoList.length)) {
        realMax -= this.photoList.length;
      }
      if (this.core) {
        realMax -= this.core.getTotal();
      }
      return realMax;
    },
    getFiles() {
      if (this.core) {
        const files = this.core.getFiles().filter(file =>
          // [window.UploadCore.Status.CANCELLED, window.UploadCore.Status.SUCCESS, window.UploadCore.Status.QUEUED].indexOf(file.status) === -1);
          [window.UploadCore.Status.CANCELLED, window.UploadCore.Status.ERROR, window.UploadCore.Status.SUCCESS, window.UploadCore.Status.QUEUED].indexOf(file.status) === -1);
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
        url: data.url || data.ThumbnailUrl,
        status: file.status,
        response,
        file,
      };
      const photos = [result];
      const newPhotoList = this.photoList.concat(photos);
      file.cancel(true);
      this.core.getStat().remove(file);
      this.onChange({
        value: photos,
      }, newPhotoList);
    },
    stopListen() {
      this.core.off(window.UploadCore.Events.FILE_UPLOAD_START, this.fileuploadstart);
      this.core.off(window.UploadCore.Events.FILE_UPLOAD_PROGRESS, this.fileuploadprogress);
      this.core.off(window.UploadCore.Events.FILE_UPLOAD_SUCCESS, this.fileuploadsuccess);
      this.core.off(window.UploadCore.Events.FILE_UPLOAD_ERROR, this.fileuploaderror);
    },
    handleDeleteImage(index) {
      this.onDelete(index);
    },
    handlePreviewImage(index) {
      if (this.onImagePreview) {
        this.onImagePreview(index);
      }
    },
    handlePicker() {
      if(this.onPicker) {
        this.onPicker();
      }
    },
  },
  computed: {
    filesLengthInCore() {
      return this.core ? this.core.getTotal() : 0;
    },
    files() {
      return this.getFiles();
    },
    photos() {
      const photos = this.photoList.map(item => (
        { src: autoFixUrl(item.url || (item.response && item.response.url) || '') }
      ));
      return photos;
    },
    maxUploadSize() {
      if (!this.multiple) {
        return 1;
      }
      return this.maxUpload;
    },
    hasFieldLine() {
      if (this.photoList.length > 0) {
        return false;
      }
      return true;
    },
  },
  watch: {
    photoList(val) {
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
  },
  beforeDestroy() {
    this.stopListen();
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';

@prefix: h3;
.@{prefix}-photo-field {
  position: relative;
  background: #fff;
  // .hairline('bottom', #eee);
  .h3-field-icon{
    right: 0px;
  }
  .@{prefix}-progress-circle {
    &-trail {
      stroke: rgba(31,56,88,0.1);
    }
    &-path {
      stroke: #45a8e6;
    }
  }

  .@{prefix}-select-field-placeholder {
    // margin-left: 4px;
  }
}

.@{prefix}-photo-item {
  position: relative;
  box-sizing: border-box;
  // padding: 8px 12px 0 0;
  &-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  &-img {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 4px;
    display: block;
  }
}

.@{prefix}-photo-upload-icon {
    position: relative;
    width: 45px;
    height: 45px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    i{
      line-height: 45px;
      font-size: 23px;
      color: #999;
    }
    
  svg {
      fill: rgba(31,56,88,0.4);
  }

  &__disabled {
    display: inline-block;

    svg {
      fill: rgba(31,56,88,0.2);
    }
  }
}

.@{prefix}-photo-upload-item,
.@{prefix}-photo-upload-icon-item {
  position: absolute;
  // padding: 8px 12px 8px 0;
  // margin: 16px 12px 0 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.@{prefix}-photo-list-upload-icon-wrapper{
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes circleRotation {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}

.@{prefix}-photo-upload-item-box {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(31,56,88,.2);
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  border-radius: 4px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  background: #ccc;

  .@{prefix}-photo-progress-icon {
    display: inline-block;
    width: 22px;
    height: 22px;
    vertical-align: middle;
    .encoded-svg-background('loading');

    background-position: 50%;
    background-size: 100%;
    background-repeat: no-repeat;
    animation: spinner-anime 1s linear infinite;
  }

  &__progress {
    .@{prefix}-progress-circle {
        width: 20px;
        height: 20px;
        animation: circleRotation linear 2s;
        animation-iteration-count: infinite;
    }

  }

  &__error {
    border: 1px solid #f04631;
    background: rgba(240,70,49,.06);
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    flex-direction: column;

    svg {
      width: 20px;
      height: 20px;
      fill: #F04631;
    }
  }
}

.@{prefix}-photo-upload-error-msg {
  font-size: 12px;
  color: #F04631;
  margin-top: 8px;
}

.@{prefix}-photo-list-upload-icon {
  display: flex;
  border: 1px dashed rgba(31,56,88,0.2);
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  svg {
    fill: rgba(31,56,88,0.4);
  }
}

.@{prefix}-photo-list {
  // .hairline('top', rgba(31,56,88,0.1));
  padding: 14px 12px 0px 0px;
  margin-left: 15px;
  width: calc(~'100%-15px');
  // overflow: hidden;
  box-sizing: border-box;
  position: relative;
  // .hairline('bottom', #eee);
  .bd-bot(#e4e4e4);

  .@{prefix}-photo-field .@{prefix}-foldable-pane & {
    padding-bottom: 0;
  }
  &:after {
    content: '';
    display:  block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}

.@{prefix}-photo-delete-icon {
  top: -8px;
  right: -8px;
  z-index: 2;
  position: absolute;

  svg {
    fill: rgba(0, 0, 0, 0.6);
    width: 18px;
    height: 18px;
    color: #999;
  }
}
@keyframes spinner-anime {
  100% {
    transform: rotate(360deg);
  }
}
</style>

