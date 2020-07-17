<template>
  <div class="form-attachment" v-show="isVisible">
    <file-field
      ref="filePane"
      :multiple="true"
      :corpId="$store.state.corpId"
      :url="JAttachmentHandler"
      :readOnly="!formVal.Editable"
      :fileList="fileList"
      :max="max"
      :maxUpload="maxUpload"
      :sizeLimit="`${formVal.maxuploadsize}m`"
      :placeholder="placeholder"
      layout="h"
      :required="formVal.Required && formVal.Editable"
      :name="formVal.DisplayName"
      :autoPending="false"
      :onDelete="onDelete"
      :onChange="onChange"
      :isUpdated.sync="isUpdated"
      :onFilePreview="previewAttach"
      @fileSizeError="filesizeError"
      @uploadError="uploadError"
    ></file-field>
    <div v-transfer-dom>
    <image-viewer v-if="photos.length>0"
      :show="previewShow" 
      :photos="photos" 
      :current="current"
      @update:show="updataShow">
    </image-viewer>
    </div>
    <div class="validate-error-wrap dp-font28" v-if='isPreviewBol' :class="{'validate-ding-top':$store.state.corpId}">该文件格式不支持预览</div>
    <div class="error-wrap" @click="hideErrorWrap" v-if='errorBol'></div>
  </div>
</template>
<script>
import { TransferDom } from 'vux';
import FileField from '../../../../packages/components/h3-file';
import ImageViewer from '../../../../packages/components/h3-imageviewer/';
import { baseUrl } from '../../../config/env';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { previewAttachment, setLeft } from '../../../config/dingtalk-interface';
import mixin from '../../../mixins/base-controler';

export default {
  name: 'FormAttachment',
  components: {
    FileField,
    ImageViewer,
  },
  // baseControler的方法混入
  mixins: [mixin],
  directives: {
    TransferDom,
  },
  props: ['formVal', 'keyName', 'ObjectId', 'schemaCode'],
  data() {
    return {
      errorBol: false,
      placeholder: '请选择附件',
      JAttachmentHandler: `${baseUrl}/Form/SheetAttachmentAction/?SchemaCode=${this.schemaCode}&MaxSize=${
        this.formVal.maxuploadsize
      }`,
      previewUrlHandler: `${baseUrl}/Form/MobilePreView?attachmentId=`,
      imgPreviewUrlHandler: `${baseUrl}/Form/DownloadFileByUUID?corpid=${this.$store.state.corpId}&uid=`,
      getUUidUrl: `${baseUrl}/Form/GetDownloadFileUUIDs/?AttachmentIdStr=`,
      isVisible: true,
      maxUpload: 1000,
      max: 9,
      fileList: [],
      AttachmentIds: '',
      DelAttachmentIds: '',
      photos: [],
      imageFileExtension: '.png.bmp.jpg.jpeg.gif.PNG.BMP.JPG.JPEG.GIF',
      DocFileExtension: ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf', 'txt'],
      previewShow: false,
      current: 0,
      isPreviewBol: false,
      isUpdated: false,
    };
  },
  created() {
    if (window.GlobalConfig.isExternalForm) {
      this.imgPreviewUrlHandler = `${baseUrl}/Form/DownloadFileByUUID?corpid=${this.$store.state.corpId}&engineCode=${window.GlobalConfig.engineCode}&uid=`;
    }
    this.initPlaceholder();
  },
  mounted() {
    this.$nextTick(() => {
      this.InitValue(this.formVal.Value);
    });
  },
  methods: {
    filesizeError() {
      H3PluginDeveloper.IShowWarn('提示', `最大上传${this.formVal.maxuploadsize}M大小的文件!`);
    },
    uploadError() {
      H3PluginDeveloper.IShowWarn('提示', '上传失败');
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
      this.fileList.forEach((item, idx) => {
        if (idx === index) {
          if (!item.response) {
            this.DelAttachmentIds += `${item.AttachmentId};`;
          }
          this.fileList.splice(index, 1);
        }
      });
      this.OnChange();
    },
    onChange(fieldData, newfileList) {
      this.$store.state.isHtmlChangedBol = true;
      this.fileList = newfileList;
      this.OnChange();
    },
    previewAttach(index) {
      const item = this.fileList[index];
      const fileExtensions = item.name.split('.');
      if (fileExtensions.length < 2) {
        return;
      }
      const fileNameType = fileExtensions[fileExtensions.length - 1];
      if (this.imageFileExtension.indexOf(fileNameType.toLowerCase()) > -1) {
        this.imagePreview(index);
        return;
      }
      H3PluginDeveloper.IShowPreLoader('正在生成预览文件...');
      if (this.DocFileExtension.indexOf(fileNameType.toLowerCase()) > -1) {
        let fileId = '';
        if (item.response) {
          fileId = item.response.AttachmentId;
        } else {
          fileId = item.AttachmentId;
        }
        const url = this.previewUrlHandler + fileId;
        $.ajax({
          type: 'POST',
          url,
          success(data) {
            if (data) {
              const htmlUrl = data.htmlUrl;
              if (htmlUrl !== '') {
                previewAttachment(htmlUrl);
              }
            }
          },
          complete() {
            H3PluginDeveloper.IHidePreLoader();
          },
        });
      } else {
        H3PluginDeveloper.IHidePreLoader();
        this.isPreviewBol = true;
        const self = this;
        setTimeout(() => {
          self.isPreviewBol = false;
        }, 3000);
      }
    },
    imagePreview(current) {
      const photos = [];
      this.fileList.forEach((file, i) => {
        if (this.isImgType(file)) {
          let uuid = file.AttachmentId;
          if (file.response) {
            uuid = file.response.AttachmentId;
          }
          photos.push(uuid);
          if (current === i) {
            this.current = photos.length - 1;
          }
          this.photos.push({});
        }
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
    isImgType(file) {
      const fileNameArr = file.name.split('.');
      const type = fileNameArr[fileNameArr.length - 1];
      if (this.imageFileExtension.indexOf(type) > -1) {
        return true;
      }
      return false;
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
    updataShow(val) {
      this.photos = [];
      this.previewShow = val;
      if (this.setLeftCallback) {
        setLeft(this.setLeftCallback);
      }
    },
    SetValue() {},
    GetValue() {
      let valueObj = {
        AttachmentIds: '',
        DelAttachmentIds: '',
      };
      this.AttachmentIds = '';
      this.fileList.forEach((item) => {
        if (item.response) {
          this.AttachmentIds += `${item.response.AttachmentId};`;
        } else if (item.isNew) {
          this.AttachmentIds += `${item.AttachmentId};`;
        }
      });
      valueObj = {
        AttachmentIds: this.AttachmentIds,
        DelAttachmentIds: this.DelAttachmentIds,
      };
      return valueObj;
    },
    InitValue(val) {
      val.forEach((tempItem) => {
        const item = tempItem;
        item.name = item.Name;
        item.url = item.ThumbnailUrl || item.Url;
        item.size = item.Size;
        item.AttachmentId = item.Code;
      });
      this.fileList = val;
    },
    // 数据验证
    Validate(actionName) {
      const fileLength = this.$refs.filePane.files.length;
      if (!this.formVal.Editable) return true;
      if (actionName !== 'Save' && this.formVal.Required && !this.fileList.length) {
        this.errorBol = true;
        const self = this;
        setTimeout(() => {
          self.errorBol = false;
        }, 1000);
        return false;
      }
      // 如果是支持Html5的话，得判断是否已经上传完整，需要等待
      if (fileLength) {
        this.AddInvalidText(this.$el, '未上传完!');
        return false;
      }
      return true;
    },
    SaveDataField() {
      const result = {};
      result[this.formVal.dataField] = this.GetValue();
      return result;
    },
    ClearFiles() {
      this.fileList.forEach((item) => {
        if (!item.response) {
          this.DelAttachmentIds += `${item.AttachmentId}`;
        }
      });
      this.fileList = [];
    },
    // 关联查询附加附件
    AppendFile(fileId, attachmentId, fileName, fileSize, thumbnail) {
      this.fileList.push({
        AttachmentId: fileId,
        code: fileId,
        name: fileName,
        size: fileSize,
        fileId,
        file: thumbnail,
        ThumbnailUrl: thumbnail,
        url: thumbnail,
        isNew: true,
      });
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
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}

.form-attachment {
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
  .validate-error-wrap {
    position: fixed;
    left: 0;
    width: 100%;
    background-color: rgba(230, 67, 64, 0.9);
    color: white;
    text-align: center;
    .px2rem(height,70);
    .px2rem(top,98);
    .px2rem(line-height,70);
    transition: all 0.5s;
  }
  .validate-ding-top {
    top: 0;
  }
}
</style>

