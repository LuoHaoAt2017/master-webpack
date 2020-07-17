<template>
  <div class="h3-file-field-upload-item" >
    <div class="h3-file-field-upload-item-progress" :style="wrapStyle">
      {{status}}
    </div>
    <div class="h3-file-field-item-icon" >
      <div :style="iconStyle">
        <i class="aufont" :class="fileIconCls" ></i>
      </div>
    </div>
    <div class="h3-file-field-item-content" style="width: calc(100% - 60px);">
      <div class="h3-file-field-item-content-wrapper">
        <div class="h3-file-field-item-name">
          {{file.name}}
        </div>
        <div class="h3-file-field-item-size">
          {{fileSize}}
        </div>
      </div>
      <div class="h3-file-field-item-action">
        <div style="padding-left: 12px;" @click="handleDelete">
          <icon type="delete" ></icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../h3-icon';
import { setTimeout } from 'timers';

export default {
  name: 'h3-photo-upload-item',
  props: {
    file: {
      type: Object,
      default: undefined,
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
      iconStyle: {},
      progress: 10,
    };
  },
  methods: {
    handleDelete() {
      if (this.onFileDelete) {
        this.onFileDelete(this.index);
      }
      this.file.cancel();
    },
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
  },
  computed: {
    status() {
      return this.file.status;
    },
    fileSize() {
      if (this.file.size > 1024 * 1024) {
        return `${Math.round(this.file.size * 100 / (1024 * 1024)) / 100}MB`;
      }
      return `${Math.round(this.file.size * 100 / 1024) / 100}KB`;
    },
    fileType() {
      const fileInfo = this.file.name.split('.');
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
      } else if (this.fileType === 'img') {
        this.iconStyle.backgroundColor = '#FA6C14';
        return `${prefix}picture`;
      }
      this.iconStyle.backgroundColor = '#ccc';
      return `${prefix}unknowfile`;
    },
    wrapStyle() {
      // ios 捕获不到progress
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        if (this.file.status !== window.UploadCore.Status.SUCCESS) {
          const simulator = () => {
            setTimeout(() => {
              if (this.file.status !== window.UploadCore.Status.SUCCESS) {
                if (this.progress < 90) {
                  this.progress += 10;
                  simulator();
                } else {
                  this.progress = 99;
                }
              }
            }, 300);
          };
          simulator();
          return {
            textAlign: 'right',
            right: `${(100 - this.progress)}%`,
          };
        }
        return {
          textAlign: 'right',
          right: 0,
        };
      }
      return {
        right: `${(100 - this.file.progress.percentage)}%`,
      };
    },
  },
};
</script>
