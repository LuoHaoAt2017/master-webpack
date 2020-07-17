<template>
  <div class="h3-PR h3-FL h3-photo-item" :style="wrapStyle" >
    <div class="h3-photo-upload-item">
      <div  v-if="status === 0" class="h3-photo-upload-item-box h3-photo-upload-item-box__progress">
        <span  aria-label="loading" class="h3-photo-progress-icon" ></span>
        <i :class="delIcon" v-if="delIcon" @onClick="handleDelete"></i>
        <DelIcon class="h3-photo-delete-icon" @onClick="handleDelete"  v-if="!delIcon"/>
      </div>
    </div>
  </div>
</template>

<script>
// import H3ProgressCircle from './circle';
import UploadCore from '../../libs/uploadcore';
import DelIcon from './delicon1';
import UploadIcon from './uploadicon';
import H3Toast from '../h3-toast/index';

window.UploadCore = UploadCore;
const Status = window.UploadCore.Status;

export default {
  name: 'h3-photo-upload-item',
  props: {
    file: {
      type: Object,
      default: undefined,
    },
    // locale: {
    //   type: String,
    //   default: undefined,
    // },
    disabled: {
      type: Boolean,
      default: false,
    },
    width: {
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
  },
  components: {
    // H3ProgressCircle,
    DelIcon,
    UploadIcon,
    H3Toast,
  },
  data() {
    return {
      // status: -1,
      // toastShow: false,
    };
  },
  methods: {
    handleDelete() {
      this.file.cancel();
    },
  },
  computed: {
    status() {
      if (this.file.status === Status.PROGRESS) {
        return 0;
      } else if (this.file.status === Status.ERROR) {
        return 1;
      }
      return -1;
    },
    wrapStyle() {
      return {
        width: this.width,
        paddingTop: this.width,
        height: 0,
        marginBottom: `${this.vGutter}px`,
        marginRight: `${this.hGutter}px`,
      };
    },
    toastShow() {
      if (this.status === 1) {
        return true;
      }
      return false;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';

.h3-photo-upload-toast{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .h3-toast-mask{
    .px2rem(width, 240);
    .px2rem(height, 240);
    opacity: 0.8;
    background: #323334;
    .px2rem(border-radius, 20);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .h3-toast-notice{
      // .px2rem(width, 240);
      // .px2rem(height, 240);
    }
    .h3-toast-notice-content .h3-toast-text{
      background: transparent;
    }
    .h3-toast-notice-content .h3-toast-text.h3-toast-text-icon{
      padding: 0;
    }
    .h3-toast-notice-content{
      padding: 0;
      .h3-icon{
        .px2rem(font-size, 89);
        // position: absolute;
        // .px2rem(top, 31.5);
        // .px2rem(right, 76.5);
      }
      .h3-toast-text-info{
        .px2rem(font-size, 30);
        .px2rem(line-height, 42);
        color: #fff;
        .px2rem(margin-top, 34);
      }
    }
  }
}
</style>

