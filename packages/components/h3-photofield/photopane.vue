<template>
  <div :class="wrapCls" >
        <Field
          :required="required"
          :label="label"
          :tip="tip"
          :layout="layout"
          :readOnly="readOnly"
          :showIcon="true"
          @iconClick="onIconClick"
          :hasFieldLine="hasFieldLine"
        >
          <div v-if="maxUpload" ref="uploadPlaceHolder" class="h3-omit h3-select-field-placeholder" :class="{'h3-hide': readOnly}">
            <i v-if="placeholderIcon" :class="placeholderIcon"></i>
            <span>{{curHolder}}</span>
          </div>
          <div slot="icon" v-if="icon" ref="uploadIcon" :class="{'h3-hide': readOnly}" :style="uploadIconStyle" class="h3-svg h3-photo-upload-icon">
            <i :class="icon"></i>
          </div>
          <div slot="icon" v-if="!icon" ref="uploadIcon" style="display:inline-block;line-height:0;" :class="{'h3-hide': readOnly}" :style="uploadIconStyle" class="h3-svg h3-photo-upload-icon">
            <div style="position: absolute; right: 12px;">
              <i class="upload-icon aufont icon-base-picture" ></i>
              <div style="position:absolute;top:0;left:0;width:100%;height:100%;" class="h3-icon-mask" >
              </div>
            </div>
          </div>
        </Field>
        
        <div  class="h3-photo-list" :class="wrapListCls"   ref="list" >
          <PhotoFieldUploadItem v-for="(file,index) in files" :key="index"
          v-if="files && files.length>0"  :hGutter="hGutter" :vGutter="vGutter"
          :file="file" :disabled="isItemDisabled" :width="itemWidth"
          :delIcon="delIcon" ref="uploadItem"
          ></PhotoFieldUploadItem>
          <PhotoFieldItem v-for="(item,index) in photoList" :key="index+999" v-if="photoList && photoList.length>0"
            :index="index" :url="item.url || getResponseData(item.response).url "
            :name="item.name" :width="itemWidth" :columns="columns" :hGutter="hGutter" :vGutter="vGutter"
            :readOnly="readOnly" 
            @onDeleteImage="deleteImage"
            @onPreviewImage="previewImage"
          ></PhotoFieldItem>
          
          <!-- <div class="h3-PR h3-FL h3-photo-item" ref="lstUploadIcon"  -->
          <div class="h3-PR h3-FL h3-photo-item" 
            :style="uploadStyle"
            @click="onPickerClick"
          >
            <div class="h3-photo-upload-icon-item">
              <div class="h3-photo-list-upload-icon" >
                <div class="h3-photo-list-upload-icon-wrapper" ref="lstUploadIcon" >
                  <div style="display:inline-block;line-height:0;" class="h3-svg" >
                    <div style="position:relative;">
                      <svg name="" width="32px" height="32px" fill="#000" viewBox="0 0 32 32" >
                        <path d="M17 15V2h-2v13H2v2h13v13h2V17h13v-2H17z" >
                        </path>
                      </svg>
                      <div style="position:absolute;top:0;left:0;width:100%;height:100%;" class="t-icon-mask">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
  import cx from 'classnames';
  import { H3Field } from 'h3-mobile-vue';
  import PhotoFieldUploadItem from './photouploaditem';
  import PhotoFieldItem from './photoitem';
  import { getData } from '../../utils/utility';

  const noop = () => {};

  export default {
  name: 'h3-photo-pane',
  props: {
  hide: {
  type: Boolean,
  default: false,
  },
  readOnly: {
  type: Boolean,
  default: false,
  },
  required: {
  type: Boolean,
  default: false,
  },
  label: {
  type: String,
  },
  tip: {
  type: String,
  },
  layout: {
  type: String,
  default: 'h',
  validator: val => ['h', 'v'].indexOf(val) > -1,
  },
  showIcon: {
  type: Boolean,
  default: true,
  },
  photoList: {
  type: Array,
  },
  files: {
  type: Array,
  },
  onPickerClick: {
  type: Function,
  default: noop,
  },
  onImageDelete: {
  type: Function,
  default: noop,
  },
  onImagePreview: {
  type: Function,
  default: noop,
  },
  columns: {
  type: Number,
  default: 4,
  },
  placeholder: {
  type: String,
  },
  maxUpload: {
  type: Number,
  },
  filesLengthInCore: {
  type: Number,
  },
  icon: {
  type: String,
  },
  placeholderIcon: {
  type: String,
  },
  delIcon: {
  type: String,
  },
  hasFieldLine: {
  type: Boolean,
  },
  hGutter: {
  type: Number,
  default: 12,
  },
  vGutter: {
  type: Number,
  default: 14,
  },
  },
  components: {
  Field: H3Field,
  PhotoFieldUploadItem,
  PhotoFieldItem,
  },
  data() {
  return {
  itemWidth: `calc((100% - ${this.columns * this.hGutter}px) / ${this.columns})`,
  };
  },
  methods: {
  onIconClick() {
  if (!this.isUploadDisabled()) {
  this.onPickerClick();
  }
  },
  getResponseData(response) {
  return getData(response);
  },
  deleteImage(index) {
  // this.onDeleteImage(index);
  this.onImageDelete(index);
  },
  previewImage(index) {
  this.onImagePreview(index);
  },
  getListUploadIcon() {
  return this.$refs.lstUploadIcon;
  },
  getUploadIcon() {
  return this.$refs.uploadIcon;
  },
  getUploadPlaceHolder() {
  return this.$refs.uploadPlaceHolder;
  },
  },
  computed: {
    formatPhotoList() {
      const res = [];
      for (let i = this.photoList.length - 1; i >= 0; i -= 1) {
        res.push(this.photoList[i]);
      }
      return res;
    },
    wrapCls() {
      return cx('h3-photo-field', {
        'h3-hide': this.hide,
        readOnly: this.readOnly,
      });
    },
    wrapListCls() {
      if (this.photoList.length === 0 && this.files.length === 0) {
        return 'h3-hide';
      }
      return '';
    },
    isItemDisabled() {
      if (!this.maxUpload) {
        return true;
      }
      return parseInt(this.photoList.length, 10) >= parseInt(this.maxUpload, 10);
    },
    isUploadDisabled() {
      return this.maxUpload
        // && (this.photoList.length + this.filesLengthInCore) >= this.maxUpload;
        && (this.photoList.length + this.files.length) >= this.maxUpload;
    },
    isUploadIconDisabled() {
      return this.photoList.length > 0;
    },
    uploadIconStyle() {
      if (this.isUploadIconDisabled) {
        return {
          display: 'none',
        };
      }
      return {};
    },
    uploadStyle() {
      const style = {
        width: this.itemWidth,
        paddingTop: this.itemWidth,
        // paddingBottom: '4px',
        height: 0,
      };
      if (this.isUploadDisabled || this.readOnly) {
        style.display = 'none';
      }
      return style;
    },
    curHolder() {
      if (this.photoList.length === 0) {
        return this.placeholder;
      }
      return `已选${this.photoList.length}张图片`;
    },
  },
};
</script>


