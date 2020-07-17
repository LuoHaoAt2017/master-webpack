<template>
  <div :class="wrapCls" >
        <Field
          :required="required"
          :label="label"
          :tip="tip"
          :layout="layout"
          :readOnly="readOnly"
          :showIcon="isIconShow"
          @iconClick="onIconClick"
          :hasFieldLine="hasFieldLine"
        >
          <div class="h3-omit h3-select-field-placeholder" ref="uploadPlaceHolder" :class="{'h3-hide': readOnly}">
            <i v-if="placeholderIcon" :class="placeholderIcon"></i>
            <span>{{curHolder}}</span>
          </div>
          <div slot="icon"  ref="uploadIcon" class="h3-svg h3-field-icon-wrapper" :style="uploadIconStyle">
            <icon type="paperclip" class="h3-file-field-upload-icon" ></icon>
          </div>
        </Field>
        
        <div  class="h3-file-list" :class="wrapListCls"   ref="list" >
          
          <FileFieldItem v-for="(item,index) in fileList" :key="index" v-if="fileList && fileList.length>0"
            :index="index" :url="item.url || getResponseData(item.response).url "
            :name="item.name" 
            :size="item.size"
            :readOnly="readOnly"
            :onFileDelete="deleteFile"
            :onFilePreview="previewFile"
            :onFileDownload="downloadFile"
            @onPreviewImage="previewImage"
          ></FileFieldItem>

          <FileFieldUploadItem v-for="(file,index) in files" :key="index+999"
          v-if="files && files.length>0" 
          :file="file" 
          ></FileFieldUploadItem>
          <div class="h3-file-list-add-pane" ref="lstUploadIcon" v-show="!readOnly && this.fileList.length>0">
            <i class="aufont icon-base-plus"></i>
            <span>添加附件</span>
          </div>
        </div>
      </div>
</template>

<script>
import cx from 'classnames';
import { H3Field } from 'h3-mobile-vue';
import FileFieldUploadItem from './file-field-upload-item';
import FileFieldItem from './file-field-item';
import Icon from '../h3-icon';
import { getData } from '../../utils/utility';

const noop = () => {};

export default {
  name: 'h3-file-pane',
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
    fileList: {
      type: Array,
    },
    files: {
      type: Array,
    },
    onPickerClick: {
      type: Function,
      default: noop,
    },
    onFileDelete: {
      type: Function,
      default: noop,
    },
    onFilePreview: {
      type: Function,
      default: noop,
    },
    onFileDownload: {
      type: Function,
      default: noop,
    },
    placeholder: {
      type: String,
    },
    placeholderIcon: {
      type: String,
    },
    hasFieldLine: {
      type: Boolean,
    },
    onImagePreview: {
      type: Function,
      default: noop,
    },
  },
  components: {
    Field: H3Field,
    FileFieldUploadItem,
    FileFieldItem,
    Icon,
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
    deleteFile(index) {
      this.onFileDelete(index);
    },
    previewFile(index) {
      this.onFilePreview(index);
    },
    downloadFile(index) {
      this.onFileDownload(index);
    },
    getUploadIcon() {
      return this.$refs.uploadIcon;
    },
    getListUploadIcon() {
      return this.$refs.lstUploadIcon;
    },
    getUploadPlaceHolder() {
      return this.$refs.uploadPlaceHolder;
    },
    previewImage(index) {
      this.onImagePreview(index);
    },
  },
  computed: {
    isUploadDisabled() {
      return this.hide || this.readOnly || this.fileList.length > 0;
    },
    isIconShow() {
      return this.showIcon;
    },
    uploadIconStyle() {
      if (this.isUploadDisabled) {
        return {
          display: 'none',
        };
      }
      return {};
    },
    wrapCls() {
      return cx('h3-file-field', {
        'h3-hide': this.hide,
        readOnly: this.readOnly,
      });
    },
    wrapListCls() {
      if (this.fileList.length === 0 && this.files.length === 0) {
        return 'h3-hide';
      }
      return '';
    },
    curHolder() {
      if (this.fileList.length === 0) {
        return this.placeholder;
      }
      return `已选择${this.fileList.length}个附件`;
    },
  },
};
</script>

