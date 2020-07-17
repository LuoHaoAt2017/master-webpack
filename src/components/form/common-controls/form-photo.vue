<template>
  <ControlWrapper
    class="form-photo"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <h3-upload
      v-if="!cameraonly"
      listType="photo-list"
      :baseUrl="tmpBaseUrl"
      :action="SheetAttachmentHandler"
      :title="options.DisplayName"
      :placehloder="editable ? placeholder : ''"
      :multiple="options.uploadmultiple"
      :maxLength="maxLength"
      :editabled="editable"
      :maxSize="maxUpload"
      :required="options.Required"
      :onChange="onChange"
      :data="value"
      :autoPreview="false"
      :layout="controlLayout"
      :class="{'photo-list': true, 'readOnly': !editable, 'haslist': value.length > 0, 'editabled': editable}"
      :actionRandomKey="actionRandomKey"
      :beforeUpload="beforeUpload"
      @preview="preview"
      @removed="onDelete"
      @uploadError="uploadError"
    />
    <photo
      v-if="cameraonly"
      ref="formPhoto"
      :class="{'photo-list': true, 'readOnly': !editable, 'haslist': value.length > 0, 'editabled': editable}"
      :multiple="options.uploadmultiple"
      :url="SheetAttachmentHandler"
      :readOnly="!editable"
      :photoList="value"
      :max="max"
      :maxUpload="maxUpload"
      :placeholder="editable ? placeholder : ''"
      :layout="controlLayout"
      :required="options.Required"
      :name="options.DisplayName"
      :autoPending="false"
      :hasWaterMark="options.hasWaterMark"
      :compression="options.compression"
      :banUploadText="banUploadText"
      :onDelete="onDelete"
      :onChange="onChange"
      :onImagePreview="preview"
    />
  </ControlWrapper>
</template>
<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import { H3Upload } from 'h3-mobile-vue';
// import imagepreview from 'h3-mobile-vue/src/plugins/imagepreview';
import debounce from 'lodash/debounce';

import { namespace } from 'vuex-class';
import mixin from '../mixins/base-controler';
import { baseUrl } from '../../../config/env';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import { FormPhotoOptions } from '@/lib/form-logic/types/control-options-map';
import ControlWrapper from '../shared/control-wrapper.vue';
import photo from '../../photo/index.vue';
import { GetDownloadFileUUIDs } from '../../../service/get-data';

const FormVM = namespace('Form/ViewModel');

// 需要补全的特殊格式
// const specialTypesNeedCompletion = [
//   { reg:/^mmexport\d+$/, complement(fillname) { return fillname + '.jpg' } }
// ];

@Component({
  components: {
    H3Upload,
    photo,
    ControlWrapper,
  },
})

export default class FormPhoto extends Mixins(mixin) {
  SheetAttachmentHandler: string = '';

  imgPreviewUrlHandler: string = '';

  placeholder: string = '请选择图片';

  maxUpload: number = 10;

  max: number = 1;

  maxLength: number = 1;

  AttachmentIds: string = '';

  DelAttachmentIds: string = '';

  options!: FormPhotoOptions;

  tmpBaseUrl: string = baseUrl;

  // 预览用的数据
  photos: string[]= [];

  current: number = 0;

  previewObject: any = {};

  acceptTypes: string[] = ['jpg', 'pjpeg', 'jpeg', 'jfif', 'pjp', 'png', 'gif'];

  // 判断是否只能拍照上传
  get cameraonly () {
    return this.options.cameraonly;
  }

  // 只能拍照上传状态下，外链填单是否上传提示限制
  get banUploadText (): string {
    const responseContext = this.$parent.form.$responseContext;
    return (this.cameraonly && responseContext.IsExternalForm) ? '暂不支持拍照上传' : '';
  }

  created () {
    const paramStr = this.$store.state.corpId ? `corpid=${this.$store.state.corpId}&uid=` : 'uid=';
    const responseContext = this.$parent.form.$responseContext;
    const schemaCode = responseContext.SchemaCode;
    const bizObjectId = responseContext.BizObjectId;
    this.SheetAttachmentHandler = `${baseUrl}/Form/SheetAttachmentAction/?SchemaCode=${schemaCode}&MaxSize=50&BizObjectId=${bizObjectId}`;
    this.imgPreviewUrlHandler = `${baseUrl}/Form/DownloadFileByUUID?${paramStr}`;
    this.maxLength = this.options.uploadmultiple ? 10000 : 1;
    this.max = this.options.uploadmultiple ? 9 : 1;
  }

  mounted () {
    this.onChange = debounce(this.onChange, 100);
  }

  @FormVM.Action(ViewModelAction.DELFILES) deleteFile;

  @FormVM.Action(ViewModelAction.ADDUPLOADINGFILE) addUploadingFile;

  @FormVM.Action(ViewModelAction.POPUPLOADEDFILE) popUploadedFile;

  @FormVM.Action(ViewModelAction.CHANGISUPLOADINGSTATUS) changIsUploadingStatus;

  initPlaceholder () {
    this.placeholder = `请选择${this.options.DisplayName.trim()}`;
    if (this.options.Required) {
      this.placeholder = `请选择${this.options.DisplayName.trim()}(必填)`;
    }
  }

  actionRandomKey (action) {
    return `${action}&updateUrlKey=${Math.random()}`;
  }

  onDelete (index) {
    this.value.forEach((item, idx) => {
      if (idx === index) {
        if (!item.response) {
          this.DelAttachmentIds += `${item.AttachmentId};`;
        }
        this.value.splice(index, 1);
        this.$updateValue();
      }
    });
    this.updateDelFiles();
    this.updateUploadStatus(this.value);
  }

  updateDelFiles () {
    this.deleteFile({
      namespace: this.namespace,
      delFiles: this.DelAttachmentIds,
    });
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

  // 组件引起 change 触发两次, 因此做个 bounce;
  bounceForPhotoUploading:any;

  activeEventLocked: boolean = false; // 防止onChange执行两次

  onChange (fieldData, newPhotoList) {
    if (!this.cameraonly) {
      if (fieldData) {
        const { value } = fieldData;
        const formData = value && value.formData;
        // 针对从手机微信上保存的图片
        if (
          formData &&
          (
            /^mmexport\d+$/.test(value.name) ||
            /^wx_camera_\d+$/.test(value.name)
          )
        ) {
          // type 的格式大概可能会是 image/png
          const valueType = value.type && value.type.split('/')[1];
          //  如果 type 不存在, 或者
          if (!valueType) {
            formData.set('fileName', value.name+'.jpg');
          }
        }
      }
    }
    this.clearValid();
    this.updateUploadStatus(newPhotoList);
    H3PluginDeveloper.IShowPreLoader();
    if (window.GlobalConfig.solutionStates &&
     window.GlobalConfig.solutionStates.includes(4)) {
      this.showLimitedTips();
      this.value = [];
      H3PluginDeveloper.IHidePreLoader();
      return;
    }
    H3PluginDeveloper.IHidePreLoader();
    this.value = newPhotoList;
    // clearTimeout(this.bounceForPhotoUploading);
    // this.bounceForPhotoUploading = setTimeout((function (fieldData, newPhotoList) {
    //   // 原上传逻辑 -- start
    //   // 触发执行前端事件-start
    //   if (fieldData.value.base64 && !this.activeEventLocked) {
    //     const base64 = fieldData.value.base64.replace(/^data:(.+?)base64,/g, '');
    //     this.getFrontEventsValue({
    //       value: base64,
    //       namespace: this.namespace,
    //     });
    //   }
    //   this.activeEventLocked = true;
    //   setTimeout(() => {
    //     this.activeEventLocked = false;
    //   }, 2000);
    //   // 触发执行前端事件-end
    //   this.clearValid();
    //   this.updateUploadStatus(newPhotoList);
    //   H3PluginDeveloper.IShowPreLoader();
    //   if (window.GlobalConfig.solutionStates && window.GlobalConfig.solutionStates.includes(4)) {
    //     this.showLimitedTips();
    //     this.value = [];
    //     H3PluginDeveloper.IHidePreLoader();
    //     return;
    //   }
    //   H3PluginDeveloper.IHidePreLoader();
    //   this.value = newPhotoList;
    //   // 原上传逻辑 -- end
    // }).bind(this, ...args), 0);
  }

  preview (file) {
    const attachmentIds = this.value.map((file) => {
      return file.response ? file.response.AttachmentId : file.AttachmentId;
    });
    // 非拍照上传传的file，拍照上传传的index
    this.current = file;
    if (typeof file !== 'number') {
      this.current = attachmentIds.findIndex(i => i === (file.response ? file.response.AttachmentId : file.AttachmentId));
    }
    if (!attachmentIds[this.current]) {
      return;
    }
    H3PluginDeveloper.IShowPreLoader('正在生成预览图片...');
    this.getUUid(attachmentIds);
  }

  async getUUid (attachmentIds) {
    const that = this;
    const res = await GetDownloadFileUUIDs(attachmentIds.join(';'));
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

  beforeUpload (fileList) {
    let isUpload = true;
    // if(!isThanIos9()){
    //   this.$h3.toast.show({text:'您手机版本过低，请升级后使用',iconType: 'close'});
    //   return false
    // }
    var error = '';
    for (var i = 0; i < fileList.length; i++) {
      // 1. 检查大小
      // var size = fileList[i].size;
      // if (size===0) {
      //   isUpload = false;
      //   error = `图片错误 (大小为: 0kb)`;
      //   break;
      // }
      // else if (size/1024/1024 > this.maxUpload) {
      //   isUpload = false;
      //   error = `图片最大可上传${this.maxUpload}MB`;
      //   break;
      // }


      // 2. 检查格式
      let fileExt = this.getFileExt(fileList[i].name).toLowerCase();
      // 某些情景下, 比如从微信聊天框中保存的图片, 再从相册里选择上传, 会报后缀错误, 因为它的文件名/后缀可能是 "mmexport1585816177952";
      // 客户反馈很汹涌, 暂且对种情况做些特别处理; 微信里保存的是jpg图片
      if (
        fileExt===fileList[i].name &&
        (
          /^mmexport\d+$/.test(fileExt) ||
          /^wx_camera_\d+$/.test(fileExt)
        )
      ) {
        fileExt = 'jpg';
      }
      if (this.acceptTypes.indexOf(fileExt) === -1) {
        // 在面临乱七八糟的后缀名时, 整个提示框会显得很不友好, 比如 abc.suffixIsVeryLongStringBlablabla 这种情况, 看起来就像出了 bug
        // 短的时候可以标一下, 长了就没必要说那么清楚, 问就是你格式不对, 请按标准来;
        // this.$h3.toast.show({ text: `不支持${fileExt}文件格式上传`, iconType: 'close' });
        error = fileExt.length<6? `不支持.${fileExt}格式的图片上传！`: `仅支持标准格式的图片上传！`;
        isUpload = false;
        break;
      }
    }

    if ( error ) {
      this.$h3.toast.show({ text:error, iconType: 'close' });
    }


    return isUpload;
  }

  uploadError (error) {
    // @uploadError（paramer）paramer: {uploadError: 上传失败/断网；overQuantity：一次性上传超过数量；overSize： 单张超过大小，后面的照片会继续上传}
    let errorMsg: string = '上传失败';
    switch (error) {
      case 'overQuantity':
        errorMsg = '只能上传单张图片';
        break;
      case 'overSize':
        errorMsg = '图片最大可上传10MB';
        break;
      default:
        break;
    }
    this.$h3.toast.show({ text: errorMsg, iconType: 'close' });
  }

  getFileExt (filename) {
    // substr, substring, slice 这几个方法有相同又有差异的地方, 容易混淆, 传参情况也复杂, 可读性远不如 split;
    // 在某些老旧的浏览器上甚至还存在兼容问题, 一但出问题也容易把人引入一个参数两个参数正数负数之类弯弯绕绕的猜测;
    // 国内安卓厂商喜欢对浏览器做点定制, 谁也说不准这些难以捉摸的地方是不是会实现完整, 在这方面 split 的标准从来都简单明确, 也永远更值得信赖;
    // 为此哪怕 split 性能稍差我也愿意忍受;
    // return filename.substring(filename.lastIndexOf('.') + 1, filename.length);
    var chunks = filename.split('.');
    return chunks[chunks.length-1];
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
}
</script>
<style lang="less">
.px2rem(@name,@px) {
    @{name}: @px/75 * 1rem;
}
@mistakeColor: rgba(245,34,45,0.05);
.form-photo {
  .photo-list.readOnly.haslist .h3-FBH,
  .photo-list.editabled .h3-FBH{
    min-height: 0px !important;
  }
  .h3-FL {
    float: none;
    padding-top: 0!important;
    .px2rem(margin, 15)!important;
    height: auto!important;
    display: inline-block;
  }
  .h3-photo-item-img {
    .px2rem(height, 156);
    .px2rem(border-radius, 4);
  }
  .h3-photo-list {
    background-color: white;
    .px2rem(padding-left, 15);
    .px2rem(padding-right, 15);
    .px2rem(padding-bottom, 8);
  }
}
</style>
