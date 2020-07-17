<template>
  <div id="form-photo" v-show="isVisible">
    <photo-field v-if="!cameraonly"
      ref="photoPane"
      :multiple="formVal.uploadmultiple=='true'"
      :url="SheetAttachmentHandler"
      :readOnly="!formVal.Editable"
      :photoList="photoList"
      :max="max"
      :maxUpload="maxUpload"
      :placeholder="placeholder"
      layout="h"
      :required="formVal.Required && formVal.Editable"
      :name="formVal.DisplayName"
      :autoPending="false"
      :onDelete="onDelete"
      :onChange="onChange"
      :onImagePreview="imagePreview"
      :isUpdated.sync="isUpdated"
      @maxUploadError="maxUploadError"
      @fileExtensionError="fileExtensionError"
      @uploadError="uploadError"
    ></photo-field>
    <photo v-if="cameraonly"
      ref="photoPane"
      :multiple="formVal.uploadmultiple=='true'"
      :url="SheetAttachmentHandler"
      :readOnly="!formVal.Editable"
      :photoList="photoList"
      :max="max"
      :maxUpload="maxUpload"
      :placeholder="placeholder"
      layout="h"
      :required="formVal.Required && formVal.Editable"
      :name="formVal.DisplayName"
      :autoPending="false"
      :hasWaterMark="formVal.hasWaterMark"
      :compression="formVal.compression"
      :onDelete="onDelete"
      :onChange="onChange"
      :onImagePreview="imagePreview"
    ></photo>
    <div v-transfer-dom>
    <image-viewer v-if="photos.length>0"
      :show="previewShow"
      :photos="photos"
      :current="current"
      @update:show="updataShow"
      >
    </image-viewer>
    </div>
      <div class="error-wrap" @click="hideErrorWrap" v-if='errorBol'></div>
    </div>
</template>
<script>
import { TransferDom } from 'vux';

import PhotoField from '../../../../packages/components/h3-photofield/index';
import ImageViewer from '../../../../packages/components/h3-imageviewer/';

import photo from '../../photo/index';
import mixin from '../../../mixins/base-controler';
import { baseUrl } from '../../../config/env';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { setLeft } from '../../../config/dingtalk-interface';
import { SolutionState } from '../../../config/license';

export default {
  name: 'FormPhoto',
  props: ['formVal', 'keyName', 'ObjectId'],
  components: {
    PhotoField,
    ImageViewer,
    photo,
  },
  directives: {
    TransferDom,
  },
  // baseControler的方法混入
  mixins: [mixin],
  data() {
    return {
      placeholder: '请选择图片',
      cameraonly: false,
      isVisible: true,
      SheetAttachmentHandler: `${baseUrl}/Form/SheetAttachmentAction/?SchemaCode=${
        this.$store.state.formData.responseContext.SchemaCode
      }&MaxSize=50&BizObjectId=${this.$store.state.formData.responseContext.BizObjectId}`,
      imgPreviewUrlHandler: `${baseUrl}/Form/DownloadFileByUUID?corpid=${this.$store.state.corpId}&uid=`,
      getUUidUrl: `${baseUrl}/Form/GetDownloadFileUUIDs/?AttachmentIdStr=`,
      photoList: [],
      maxUpload: this.formVal.uploadmultiple === 'true' ? 1000 : 1,
      max: this.formVal.uploadmultiple === 'true' ? 9 : 1,
      errorBol: false,
      photos: [],
      previewShow: false,
      AttachmentIds: '',
      DelAttachmentIds: '',
      current: 0,
      isUpdated: false,
    };
  },
  created() {
    if (window.GlobalConfig.isExternalForm) {
      this.imgPreviewUrlHandler = `${baseUrl}/Form/DownloadFileByUUID?corpid=${this.$store.state.corpId}&engineCode=${window.GlobalConfig.engineCode}&uid=`;
    }
    this.initPlaceholder();
    // 判断是否只能拍照上传
    if (this.formVal.cameraonly === 'true') {
      this.cameraonly = true;
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.formVal.Value && this.formVal.Value.length > 0) {
        this.InitValue(this.formVal.Value);
      }
    });
  },
  methods: {
    maxUploadError() {
      H3PluginDeveloper.IShowWarn('提示', '最大上传10M大小图片');
    },
    uploadError() {
      H3PluginDeveloper.IShowWarn('提示', '上传失败');
    },
    fileExtensionError() {
      H3PluginDeveloper.IShowWarn('提示', '只能上传图片');
    },
    initPlaceholder() {
      if (this.formVal.Editable) {
        if (this.formVal.Required) {
          this.placeholder = `请选择${this.formVal.DisplayName.trim()}(必填)`;
          this.requiredVal = '*';
        } else {
          this.placeholder = `请选择${this.formVal.DisplayName.trim()}`;
        }
      } else {
        this.placeholder = '';
      }
    },
    onDelete(index) {
      this.photoList.forEach((item, idx) => {
        if (idx === index) {
          if (!item.response) {
            this.DelAttachmentIds += `${item.AttachmentId};`;
          }
          this.photoList.splice(index, 1);
        }
      });
      this.OnChange();
    },
    onChange(fieldData, newPhotoList) {
      if (window.GlobalConfig.solutionStates && window.GlobalConfig.solutionStates.indexOf(SolutionState.FileSizeExceed) > -1) {
        this.showLimitedTips();
        return;
      }
      this.$store.state.isHtmlChangedBol = true;
      this.photoList = newPhotoList;
      this.OnChange(fieldData);
    },
    showLimitedTips() {
      let tipsMessage = '附件量已达上限，请通知公司管理员购买升级附件量套餐。';
      if (window.GlobalConfig.isAdministrator) {
        tipsMessage = '附件量已达上限，请联系客服购买升级附件量套餐。';
      }
      this.$h3.modal.show({
        title: '限制提醒',
        content: tipsMessage,
        type: 'alert',
        actions: [{ text: '知道了', onPress: () => {} }],
      });
    },
    // 数据验证
    Validate(actionName) {
      const photoLength = this.$refs.photoPane.files.length;
      if (!this.formVal.Editable) return true;
      if (actionName !== 'Save' && this.formVal.Required && !this.photoList.length) {
        this.errorBol = true;
        const self = this;
        setTimeout(() => {
          self.errorBol = false;
        }, 1000);
        return false;
      }
      // 如果是支持Html5的话，得判断是否已经上传完整，需要等待
      if (photoLength) {
        this.AddInvalidText(this.$el, '未上传完!');
        return false;
      }
      return true;
    },
    GetValue() {
      let AttachmentIds = '';
      this.photoList.forEach((item) => {
        if (item.response) {
          AttachmentIds += `${item.response.AttachmentId};`;
        }
      });
      return {
        AttachmentIds,
        DelAttachmentIds: this.DelAttachmentIds,
      };
    },
    SetValue(val) {
      if (val) {
        this.photoList = val;
        this.OnChange();
      }
    },
    InitValue(val) {
      val.forEach((tempItem) => {
        const item = tempItem;
        item.name = item.Name;
        item.url = item.ThumbnailUrl || item.Url;
        item.size = item.Size;
        item.AttachmentId = item.Code;
      });
      this.photoList = val;
    },
    // 删除图片
    delImgs(index) {
      this.photoList.forEach((item, idx) => {
        if (idx === index) {
          if (item.response) {
            this.DelAttachmentIds += `${item.response.AttachmentId};`;
          } else {
            this.DelAttachmentIds += `${item.AttachmentId};`;
          }
          this.photoList.splice(index, 1);
        }
      });
      this.OnChange();
    },
    updataShow(val) {
      this.photos = [];
      this.previewShow = val;
      if (this.setLeftCallback) {
        setLeft(this.setLeftCallback);
      }
    },
    imagePreview(current) {
      const photos = [];
      this.photoList.forEach((file, i) => {
        let uuid = file.AttachmentId;
        if (file.response) {
          uuid = file.response.AttachmentId;
        }
        photos.push(uuid);
        this.photos.push({});
      });
      this.current = current;
      this.previewShow = true;
      this.getUUid(photos.join(';'));
      this.setLeftCallback = setLeft.callback;
      setLeft(() => {
        this.previewShow = false;
        setLeft(this.setLeftCallback);
      });
    },
    getUUid(uuids) {
      const url = `${this.getUUidUrl}${uuids}`;
      const that = this;
      $.ajax({
        type: 'POST',
        url,
        success(data) {
          if (data) {
            uuids.split(';').forEach((attachmentId, i) => {
              const item = {};
              item.src = `${window.location.origin}${that.imgPreviewUrlHandler}${data[attachmentId]}`;
              that.$set(that.photos, i, item);
            });
          }
        },
      });
    },
    SaveDataField() {
      const result = {};
      result[this.formVal.dataField] = this.GetValue();
      return result;
    },
  },
  watch: {
    isUpdated(val) {
      if (val) {
        this.$store.state.isHtmlChangedBol = true;
      }
    },
  },
};
</script>
<style lang="less">
#form-photo {
  position: relative;
  .error-wrap {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 0, 0, 0.06);
    // -webkit-animation: twinkling .3s 2;
    animation: twinkling 0.5s linear infinite;
  }
  @-webkit-keyframes twinkling {
    0% {
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes twinkling {
    0% {
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
