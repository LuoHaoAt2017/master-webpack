<template>
  <ControlWrapper
    class="form-attachment"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <h3-upload
      listType="file"
      :baseUrl="tmpBaseUrl"
      :action="JAttachmentHandler"
      :title="options.DisplayName"
      :placehloder="editable ? placeholder : ''"
      :editabled="editable"
      :maxSize="Number(options.maxuploadsize)"
      :required="options.Required"
      :onChange="onChange"
      :data="value"
      :layout="controlLayout"
      :class="wrapCls"
      :autoPreview="false"
      :actionRandomKey="actionRandomKey"
      :beforeUpload="beforeUpload"
      @uploadError="uploadError"
      @removed="onDelete"
      @preview="previewAttach"
    />
    <div v-if="isPreviewBol" class="validate-error-wrap dp-font28" :class="{'validate-ding-top': $store.state.corpId}">
      该文件格式不支持预览
    </div>
  </ControlWrapper>
</template>
<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import { H3Upload } from 'h3-mobile-vue';
import imagepreview from 'h3-mobile-vue/src/plugins/imagepreview';
import { namespace } from 'vuex-class';
import mixin from '../mixins/base-controler';
import { isiOS } from '@/config/common';
import { baseUrl } from '../../../config/env';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import { FormAttachmentOptions } from '@/lib/form-logic/types/control-options-map';
import { previewAttachment, previewVideo } from '../../../config/dingtalk-interface';
import ControlWrapper from '../shared/control-wrapper.vue';
import { GetDownloadFileUUIDs } from '../../../service/get-data';
const FormVM = namespace('Form/ViewModel');

@Component({
  components: {
    H3Upload,
    ControlWrapper,
  },
})
export default class FormAttachment extends Mixins(mixin) {
  tmpBaseUrl: string = baseUrl;

  imageFileExtension: string = '.png.bmp.jpg.jpeg.gif.PNG.BMP.JPG.JPEG.GIF';

  DocFileExtension: string[] = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf', 'txt'];

  videoFileExtension = ['mpeg', 'avi', 'navi', 'asf', 'mov', 'wmv', 'rmvb', 'rm', 'flv', 'f4v', 'mp4', '3gp'];

  iosFileExtension = ['f4v', 'mp4'];

  previewUrlHandler: string = `${baseUrl}/Form/MobilePreView?attachmentId=`;

  imgPreviewUrlHandler: string = '';

  JAttachmentHandler: string = '';

  placeholder: string = '请选择附件';

  isPreviewBol: boolean = false;

  maxUpload: number = 1000;

  AttachmentIds: string = '';

  DelAttachmentIds: string = '';

  files: object[] = [];

  options!: FormAttachmentOptions;

  // 预览图片用的数据
  photos: object[] = [];

  current: number = 0;

  previewObject: Object = {};

  previewOpening: boolean = false;

  created () {
    const paramStr = this.$store.state.corpId ? `corpid=${this.$store.state.corpId}&uid=` : 'uid=';
    const schemaCode = this.$parent.form.$responseContext.SchemaCode;
    this.JAttachmentHandler = `${baseUrl}/Form/SheetAttachmentAction/?SchemaCode=${schemaCode}&MaxSize=${this.options.maxuploadsize}`;
    this.imgPreviewUrlHandler = `${baseUrl}/Form/DownloadFileByUUID?${paramStr}`;
  }

  @FormVM.Action(ViewModelAction.DELFILES) deleteFile;

  @FormVM.Action(ViewModelAction.ADDUPLOADINGFILE) addUploadingFile;

  @FormVM.Action(ViewModelAction.POPUPLOADEDFILE) popUploadedFile;

  @FormVM.Action(ViewModelAction.CHANGISUPLOADINGSTATUS) changIsUploadingStatus;

  actionRandomKey (action) {
    return `${action}&updateUrlKey=${Math.random()}`;
  }

  onDelete (index) {
    // filter是为了value变化的时候，触发视图更新，用formeach和splice无法触发
    const tempValue = this.value.filter((item, idx) => {
      if (idx === index) {
        if (!item.response) {
          this.DelAttachmentIds += `${item.AttachmentId};`;
        }
      }
      return idx !== index;
    });
    this.value = tempValue;
    this.updateDelFiles();
  }

  updateDelFiles () {
    this.deleteFile({
      namespace: this.namespace,
      delFiles: this.DelAttachmentIds,
    });
    this.updateUploadStatus(this.value);
  }

  onChange (fieldData: any, newPhotoList: object[]) {
    if (fieldData) {
      const { value } = fieldData;
      const formData = value && value.formData;
      // 针对从手机微信上保存|拍照保存的图片
      if (formData &&
        (
          /^mmexport\d+$/.test(value.name) ||
          /^wx_camera_\d+$/.test(value.name)
        )
      ) {
        // type 的格式大概可能会是 image/png
        const valueType = value.type && value.type.split('/')[1];
        //  如果 type 不存在, 或者
        if (!valueType) {
          formData.set('fileName', value.name + '.jpg');
        }
      }
    }
    console.log('fieldData: ', fieldData);

    this.clearValid();
    this.updateUploadStatus(newPhotoList);

    H3PluginDeveloper.IShowPreLoader();
    if (window.GlobalConfig.solutionStates && window.GlobalConfig.solutionStates.includes(4)) {
      this.showLimitedTips();
      this.value = [];
      H3PluginDeveloper.IHidePreLoader();
      return;
    }
    H3PluginDeveloper.IHidePreLoader();
    this.value = newPhotoList;
  }

  previewAttach (item) {
    if (this.previewOpening) {
      return;
    }
    // 由于点击预览组件库触发两次预览，骚操作处理下先，后续组件库需要优化
    this.previewOpening = true;
    setTimeout(() => {
      this.previewOpening = false;
    });
    const fileNameType = item.name.substring(item.name.lastIndexOf('.') + 1, item.name.length);
    if (this.isImage(item)) {
      this.previewImage(item);
      return;
    }

    if (!item.Url) {
      H3PluginDeveloper.IShowWarn('提示', '该状态暂不支持预览');
      return;
    }
    H3PluginDeveloper.IShowPreLoader('正在生成预览文件...', { autoHide: false });
    const ext = fileNameType.toLowerCase();
    let fileId = '';
    if (item.response) {
      fileId = item.response.AttachmentId;
    } else {
      fileId = item.AttachmentId;
    }
    if (this.DocFileExtension.indexOf(ext) > -1) {
      const url = this.previewUrlHandler + fileId;
      $.ajax({
        type: 'POST',
        url,
        success (data) {
          if (data) {
            const htmlUrl = data.htmlUrl;
            if (htmlUrl !== '') {
              previewAttachment(htmlUrl);
            }
          }
        },
        complete () {
          H3PluginDeveloper.IHidePreLoader();
        },
      });
    } else if ((!isiOS && this.videoFileExtension.indexOf(ext) > -1) || (isiOS && this.iosFileExtension.indexOf(ext) > -1)) {
      // previewVideo(this.previewVideoUrlHandler + fileId);
      this.$router.push({
        name: 'preview',
        params: {
          attachmentId: fileId,
          ext: ext,
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
  }

  previewImage (file) {
    H3PluginDeveloper.IShowPreLoader('正在生成预览图片...');
    const attachmentIds = this.value.filter(file => this.isImage(file)).map((file) => {
      return file.response ? file.response.AttachmentId : file.AttachmentId;
    });
    this.current = attachmentIds.findIndex(i => i === (file.response ? file.response.AttachmentId : file.AttachmentId));
    this.getUUid(attachmentIds);
  }

  async getUUid (attachmentIds) {
    const attachmentId = attachmentIds.join(';');
    const that = this;
    const res = await GetDownloadFileUUIDs(attachmentId);
    if (res) {
      H3PluginDeveloper.IHidePreLoader();
      // that.photos = attachmentIds.map((attachmentId) => {
      //   return `${window.location.origin}${that.imgPreviewUrlHandler}${res[attachmentId]}`
      // });
      // that.previewObject = imagepreview({
      //   images: that.photos,
      //   index: that.current,
      //   onClose: that.onClose,
      // })
      // that.backStack.push(() => {
      //   (that.previewObject as any).$destroy();
      // })
      const photos = attachmentIds.map(attachmentId => ({
        title: '',
        url: `${this.imgPreviewUrlHandler}${res[attachmentId]}`,
      }));
      const options = {
        images: photos,
        index: that.current,
      };
      this.$imageviewer.show(options);
      that.backStack.push(() => {
        // that.previewObject.$destroy();
        this.$imageviewer.hide();
      });
    }
  }

  onClose () {
    this.backStack.pop();
  }

  uploadError (error) {
    // @uploadError（paramer）paramer: {uploadError: 上传失败/断网；overQuantity：一次性上传超过数量；overSize： 单张超过大小，后面的照片会继续上传}
    let errorMsg: string = '上传失败';
    if (error === 'overSize') {
      errorMsg = `文件最大可上传${this.options.maxuploadsize}M`;
    }
    this.$h3.toast.show({ text: errorMsg, iconType: 'close' });
  }

  beforeUpload (fileList) {
    // if(!isThanIos9()){
    //   this.$h3.toast.show({text:'您手机版本过低，请升级后使用',iconType: 'close'});
    //   return false
    // }
    return true;
  }

  ClearFiles () {
    this.value.forEach((item) => {
      if (!item.response) {
        this.DelAttachmentIds += `${item.AttachmentId}`;
      }
    });
    this.value = [];
  }

  showLimitedTips () {
    let tipsMessage = '附件量已达上限，请通知公司管理员购买升级附件量套餐。';
    if (window.GlobalConfig.isAdmin) {
      tipsMessage = '附件量已达上限，请联系客服购买升级附件量套餐。';
    }
    this.$h3.modal.show({
      title: '限制提醒',
      content: tipsMessage,
      type: 'alert',
      actions: [{ text: '知道了', onPress: () => {} }],
    });
  }

  updateUploadStatus (value) {
    this.changIsUploadingStatus({
      namespace: this.namespace,
      status: false,
    });
    for (const item of value) {
      if ((item as any).status !== 2 && !(item as any).AttachmentId) {
        this.changIsUploadingStatus({
          namespace: this.namespace,
          status: true,
        });
      }
    }
  }

  isImage (file) {
    const fileNameType = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
    if (this.imageFileExtension.indexOf(fileNameType.toLowerCase()) > -1) {
      return true;
    }
    return false;
  }

  get wrapCls () {
    return {
      error: this.valid.empty,
      readonly: !this.editable,
      haslist: this.value.length > 0,
    };
  }
}
</script>
<style lang="less">
@mistakeColor: rgba(245,34,45,0.05);
@baseFontSize: 75;
.px2rem(@name,@px) {
    @{name}: @px/@baseFontSize * 1rem;
}

.form-attachment{
  position: relative;
  .error .h3-upload-title-placeholder{
      color: #E64340 !important;
    }
  .error-wrap {
    position: absolute;
    pointer-events: none;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 0, 0, 0.06);
    // -webkit-animation: twinkling .3s 2;
    animation: twinkling 0.5s linear 2;
  }
  .readonly.haslist {
    .h3-FBH{
      min-height: 0px !important;
    }
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
    z-index: 99;
    transition: all 0.5s;
  }
  .validate-ding-top {
    top: 0;
  }
}
</style>
