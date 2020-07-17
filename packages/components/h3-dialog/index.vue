<template>
  <div
    class="dialog"
    :class="{'h3-dialog-absolute': layout === 'VIEW_BOX'}">
    <transition :name="maskTransition">
      <div class="h3ui-mask" @click="hide" v-show="show" :style="maskStyle"></div>
    </transition>
    <transition :name="dialogTransition">
      <div :class="dialogClass" v-show="show" :style="dialogStyle">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import preventBodyScrollMixin from '../../mixins/prevent-body-scroll';

export default {
  name: 'h3-dialog',
  mixins: [preventBodyScrollMixin],
  model: {
    prop: 'show',
    event: 'change',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    maskTransition: {
      type: String,
      default: 'h3-mask',
    },
    maskZIndex: [String, Number],
    dialogTransition: {
      type: String,
      default: 'h3-dialog',
    },
    dialogClass: {
      type: String,
      default: 'h3-dialog',
    },
    hideOnBlur: Boolean,
    dialogStyle: Object,
    scroll: {
      type: Boolean,
      default: true,
      validator(val) {
        /* istanbul ignore if */
        if (process.env.NODE_ENV === 'development' && val === false) {
          console.warn('[h3 warn] h3-dialog:scroll 已经废弃。如果你是 100% 布局，请参照文档配置 $layout 以实现阻止滚动');
        }
        return true;
      },
    },
  },
  computed: {
    maskStyle() {
      if (typeof this.maskZIndex !== 'undefined') {
        return {
          zIndex: this.maskZIndex,
        };
      }
      return {};
    },
  },
  mounted() {
    if (typeof window !== 'undefined') {
      if (window.h3_CONFIG && window.h3_CONFIG.$layout === 'VIEW_BOX') {
        this.layout = 'VIEW_BOX';
      }
    }
  },
  watch: {
    show(val) {
      this.$emit('update:show', val);
      this.$emit(val ? 'on-show' : 'on-hide');
      if (val) {
        this.addModalClassName();
      } else {
        this.removeModalClassName();
      }
    },
  },
  methods: {
    shouldPreventScroll() {
      // hard to get focus on iOS device with fixed position, so just ignore it
      const iOS = /iPad|iPhone|iPod/i.test(window.navigator.userAgent);
      const hasInput = this.$el.querySelector('input') || this.$el.querySelector('textarea');
      if (iOS && hasInput) {
        return true;
      }
      return false;
    },
    hide() {
      if (this.hideOnBlur) {
        this.$emit('update:show', false);
        this.$emit('change', false);
        this.$emit('on-click-mask');
      }
    },
  },
  data() {
    return {
      layout: '',
    };
  },
};
</script>

<style lang="less">
@import '../../styles/transition.less';
@import '../../styles/h3-ui/h3-mask';
@import '../../styles/h3-ui/h3-dialog';
@import '../../styles/h3-ui/h3-modal.css';

.h3-dialog-absolute .h3ui-dialog {
  position: absolute
}
</style>
