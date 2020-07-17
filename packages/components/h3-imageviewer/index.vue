<template>
  <div class="h3-image-viewer" v-show="show">
    <div >
      <PopupView
        :visible="show"
        :prefixCls="`${prefixCls}-popup`"
        :onClick="close"
        :photos="photos"
        :current="current"
      />
    </div>
  </div>
</template>

<script>
import PopupView from './popupview';

export default {
  name: 'h3-image-viewer',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    photos: {
      type: Array,
      default: () => [],
    },
    current: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      prefixCls: 'h3-image-viewer',
      showValue: false,
    };
  },
  components: {
    PopupView,
  },
  methods: {
    close() {
      this.$emit('update:show', false);
    },
    stopBodyScrolling(flag) {
      const preventDefault = (e) => {
        e.preventDefault();
      };
      if (flag) {
        document.body.addEventListener('touchmove', preventDefault, false);
      } else {
        document.body.removeEventListener('touchmove', preventDefault, false);
      }
    },
  },
  watch: {
    show(val) {
      if (val) {
        this.stopBodyScrolling(true);
      } else {
        this.stopBodyScrolling(false);
      }
    },
  },
};
</script>

