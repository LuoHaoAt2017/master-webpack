<template>
  <div class="h3-file-field-item">
    <div class="h3-file-field-item-icon" @click="clickFile">
      <div v-if="fileType === 'img'"
        class="h3-photo-item-img"
      >
        <img :src="url" /> 
      </div>
      <div v-else :style="iconStyle">
        <i class="aufont" :class="fileIconCls" ></i>
      </div>
    </div>
    <div class="h3-file-field-item-content" @click.stop="handlePreview" style="width: calc(100% - 60px);">
      <div class="h3-file-field-item-content-wrapper">
        <div class="h3-file-field-item-name">
          {{name}}
        </div>
        <div class="h3-file-field-item-size">
          {{fileSize}}
        </div>
      </div>
      <div class="h3-file-field-item-action" v-if="!readOnly" @click.stop="handleDelete">
        <div style="padding-left: 12px;" >
          <icon type="delete"></icon>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import Icon from '../h3-icon';

export default {
  name: 'h3-file-field-item',
  props: {
    index: {
      type: Number,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
    },
    onFilePreview: Function,
    onFileDelete: Function,
    onFileDownload: Function,
  },
  components: {
    Icon,
  },
  data() {
    return {
      iconStyle: {
      },
    };
  },
  methods: {
    handlePreview() {
      if (this.onFilePreview) {
        this.onFilePreview(this.index);
      }
    },
    handleDownload() {
      if (this.onFileDownload) {
        this.onFileDownload(this.index);
      } else {
        // 直接下载
        this.download();
      }
    },
    handleDelete() {
      if (this.onFileDelete) {
        this.onFileDelete(this.index);
      }
    },
    download() {
      const eleLink = document.createElement('a');
      eleLink.download = this.name;
      eleLink.style.display = 'none';
      // 字符内容转变成blob地址
      eleLink.href = this.url;
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
    },
    clickFile() {
      if (this.fileType === 'img') {
        this.$emit('onPreviewImage', this.index);
      }
    },
  },
  computed: {
    imgStyle() {
      return {
        backgroundImage: `url(${this.url})`,
      };
    },
    fileSize() {
      if (this.size > 1024 * 1024) {
        return `${Math.round(this.size * 100 / (1024 * 1024)) / 100}MB`;
      }
      return `${Math.round(this.size * 100 / 1024) / 100}KB`;
    },
    fileType() {
      const fileInfo = this.name.split('.');
      if (fileInfo.length < 2) {
        return 'extra';
      }
      let fileType = fileInfo[fileInfo.length - 1];
      fileType = fileType.toLowerCase();
      if (fileType === 'txt' || fileType === 'doc' || fileType === 'docx') {
        return 'word';
      } else if (fileType === 'xls' || fileType === 'xlsx') {
        return 'excel';
      } else if (fileType === 'jpg' || fileType === 'jpeg' ||
       fileType === 'png' || fileType === 'bmp' || fileType === 'gif') {
        return 'img';
      } else if (fileType === 'pdf') {
        return 'pdf';
      } else if (fileType === 'ppt' || fileType === 'pptx') {
        return 'ppt';
      }
      return 'extra';
    },
    fileIconCls() {
      const prefix = 'icon-base-';
      if (this.fileType === 'word') {
        this.iconStyle.backgroundColor = '#1890FF';
        return `${prefix}wordfile`;
      } else if (this.fileType === 'excel') {
        this.iconStyle.backgroundColor = '#52C41A';
        return `${prefix}exclefile`;
      } else if (this.fileType === 'pdf') {
        this.iconStyle.backgroundColor = '#F5222D';
        return `${prefix}pdffile`;
      } else if (this.fileType === 'ppt') {
        this.iconStyle.backgroundColor = '#FA6C14';
        return `${prefix}pptfile`;
      }
      this.iconStyle.backgroundColor = '#ccc';
      return `${prefix}unknowfile`;
    },
  },
};
</script>

