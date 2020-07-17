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
      :icon="icon"
      :layout="layout"
      :delIcon="delIcon"
      :placeholderIcon="placeholderIcon"
      :onImageDelete="handleDeleteImage"
      :onImagePreview="handlePreviewImage"
      :onPickerClick="handlePicker"
    ></photo-field-pane>
  </div>
</template>

<script>
import PhotoFieldPane from './photopane';
import { getLocation, uploadImageFromCamera } from '../../config/dingtalk-interface';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { getServerTimeStamp } from '../../service/get-data';

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
  name: 'h3-photofild-dd',
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
      default: '请选择图片',
    },
    max: { // 钉钉组件一次性最多选择上传3张照片
      type: Number,
      default: 3,
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
    // onPicker: Function,
    icon: {
      type: String,
    },
    placeholderIcon: {
      type: String,
    },
    delIcon: {
      type: String,
    },
    hasWaterMark: {
      type: Boolean,
      default: false,
    },
    compression: {
      type: Boolean,
      default: false,
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
    banUploadText: {
      type: String,
      default: '',
    },
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
      AddAttachments: {},
      uploadQueue: [...this.photoList], // 上传列表
    };
  },
  mounted() {
  },
  methods: {
    getMax() {
      let realMax = this.maxUpload;
      if (this.maxUpload && (this.max > this.maxUpload - this.uploadQueue.length)) {
        realMax -= this.uploadQueue.length;
      }
      if (this.core) {
        realMax -= this.core.getTotal();
      }
      return realMax;
    },
    getFiles() {
      const arr = [];
      for (const key in this.AddAttachments) {
        if (Object.prototype.hasOwnProperty.call(this.AddAttachments, key)) {
          const file = this.AddAttachments[key];
          if (file.status !== 32) {
            arr.push(file);
          }
        }
      }
      return arr;
    },
    handleDeleteImage(index) {
      this.onDelete(index);
    },
    handlePreviewImage(index) {
      if (this.onImagePreview) {
        this.onImagePreview(index);
      }
    },
    addPhotos(mediaIds) {
      H3PluginDeveloper.IShowPreLoader('上传中');
      this.$emit('update:isUpdated', true);
      this.uploadBol = true;
      for (let i = 0; i < mediaIds.length; i += 1) {
        let mediaId = mediaIds[i];
        mediaId = mediaId.match(/([^/]+)$/)[1];
        const fileid = H3PluginDeveloper.IGuid();
        // 需要添加的图片
        this.AddAttachments[fileid] = {
          fileid,
          file: null,
          xhr: new XMLHttpRequest(),
          state: 0, // 0:未上传完，1:已上传完,100:失败
        };
        this.UploadFile(fileid, mediaId);
      }
    },
    getStickers(callback) {
      const getTimeAsync = getServerTimeStamp();
      H3PluginDeveloper.IShowPreLoader('定位中');
      const timezoneOffset = new Date().getTimezoneOffset(); // 手机所在地与UTC的时差
      const offset = (timezoneOffset * 60000) + (8 * 3600000);
      // 当前本地时区与东八区的时差
      getLocation(async (result) => {
        try {
          const response = await getTimeAsync;
          H3PluginDeveloper.IHidePreLoader();
          if (response.Successful) {
            const serverTimestamp = response.ReturnData.TimeStamp;
            // 先抵消本地时区与UTC的时差获取UTC时间，然后再加上北京东八区的时差
            const timeStamp = serverTimestamp + offset;
            const now = new Date(timeStamp);
            const time = now.Format('hh:mm');
            const weekDay = now.getDay();
            const weekDayArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            const dateWeather = `北京时间 ${now.Format('yyyy.MM.dd')} ${weekDayArr[weekDay]}`;
            const username = this.$store.state.UserInfo.userName;
            const stickers = { time, dateWeather, username };
            const address = (result.location || result).address;
            stickers.address = address || '未获取到定位信息';
            callback(stickers);
          }
        } catch (err) {
          H3PluginDeveloper.IHidePreLoader();
        }
      }, true, (err) => {
        H3PluginDeveloper.IHidePreLoader();
        if (err) {
          const stickers = { address: '未获取到定位信息' };
          callback(stickers);
        }
      });
    },
    UploadFile(fileid, mediaId) {
      if (this.AddAttachments[fileid] == null && this.AddAttachments[fileid].state !== 0) return;
      const fd = new FormData();
      fd.append('fileToUpload', this.AddAttachments[fileid].file);
      const xhr = this.AddAttachments[fileid].xhr;
      xhr.context = this;
      xhr.upload.fileid = fileid;
      xhr.abort.fileid = fileid;
      // 需要判断浏览器是否支持onprogress事件
      xhr.upload.onprogress = function c() {};
      xhr.fileid = fileid;
      xhr.addEventListener('load', this.UploadComplete, false);
      xhr.addEventListener('error', this.UploadFailed, false);
      xhr.addEventListener('abort', this.UploadCanceled, false);
      // lADPBbCc1gqUusfNAyrNAhw_540_810.jpg
      // &SuiteKey=${this.$store.state.suitekey} 暂时不用
      const uploadHandler = `${this.url}&FileID=${fileid}&MediaID=${mediaId}`;
      xhr.open('POST', uploadHandler);
      xhr.send(fd);
    },

    UploadComplete(evt) {
      H3PluginDeveloper.IHidePreLoader();
      if (evt.target.status === 200) {
        const resultObj = eval(`(${evt.target.responseText})`);
        if (resultObj.State === 4 || resultObj.State === 5) {
          H3PluginDeveloper.IShowWarn('温馨提醒', resultObj.ResultStr);
          return;
        }
        const fileid = resultObj.FileId;
        this.AddAttachments[fileid].response = resultObj;
        this.AddAttachments[fileid].url = resultObj.ThumbnailUrl;
        this.AddAttachments[fileid].status = 32;
        this.uploadQueue.push(this.AddAttachments[fileid]);
        this.onChange({
          value: this.AddAttachments[fileid],
        }, this.uploadQueue);
      } else {
        this.UploadFailed(evt);
      }
    },

    UploadFailed(evt) {
      this.AddAttachments[evt.currentTarget.fileid].state = 100;
    },

    handlePicker () {
      if (this.banUploadText) {
        H3PluginDeveloper.IShowWarn('温馨提醒', this.banUploadText);
        return;
      }
      const hasWaterMark = this.hasWaterMark;
      const compression = this.compression;
      if (hasWaterMark) {
        // 钉钉v2.11.0之后支持拍照水印
        this.getStickers((stickers) => {
          uploadImageFromCamera(this.addPhotos, compression, stickers);
        });
      } else {
        uploadImageFromCamera(this.addPhotos, compression);
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
      const photos = this.uploadQueue.map(item => (
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
      if (this.uploadQueue.length > 0) {
        return false;
      }
      return true;
    },
  },
  watch: {
    photoList(val) {
      this.uploadQueue = [...val];
    },
  },
};
</script>

