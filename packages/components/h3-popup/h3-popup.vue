<template>
  <transition :name="`h3-popup-animate-${position}`">
    <div v-show="show && !initialShow" :style="styles" class="h3-popup-dialog" 
    :class="[`h3-popup-${position}`, show ? 'h3-popup-show' : '']">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
import Popup from './popup';
import dom from '../../utils/dom';

export default {
  name: 'popup',
  props: {
    value: Boolean,
    height: {
      type: String,
      default: 'auto',
    },
    width: {
      type: String,
      default: 'auto',
    },
    showMask: {
      type: Boolean,
      default: true,
    },
    isTransparent: Boolean,
    hideOnBlur: {
      type: Boolean,
      default: true,
    },
    position: {
      type: String,
      default: 'bottom',
    },
    maxHeight: String,
    popupStyle: Object,
    hideOnDeactivated: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    // get global layout config
    if (this.$h3 && this.$h3.config && this.$h3.config.$layout === 'VIEW_BOX') {
      this.layout = 'VIEW_BOX';
    }
  },
  mounted() {
    this.$overflowScrollingList = document.querySelectorAll('.h3-fix-safari-overflow-scrolling');
    this.$nextTick(() => {
      const self = this;
      this.popup = new Popup({
        showMask: self.showMask,
        container: self.$el,
        hideOnBlur: self.hideOnBlur,
        onOpen() {
          self.fixSafariOverflowScrolling('auto');
          self.show = true;
        },
        onClose() {
          self.show = false;
          if (window.$h3Popups && Object.keys(window.$h3Popups).length > 1) return;
          if (document.querySelector('.h3-popup-dialog.h3-popup-mask-disabled')) return;
          setTimeout(() => {
            self.fixSafariOverflowScrolling('touch');
          }, 300);
        },
      });
      if (this.value) {
        this.popup.show();
      }
      this.initialShow = false;
    });
  },
  deactivated() {
    if (this.hideOnDeactivated) {
      this.show = false;
    }
    this.removeModalClassName();
  },
  methods: {
    fixSafariOverflowScrolling(type) {
      if (!this.$overflowScrollingList.length) return;
      // if (!/iphone/i.test(navigator.userAgent)) return
      for (let i = 0; i < this.$overflowScrollingList.length; i += 1) {
        this.$overflowScrollingList[i].style.webkitOverflowScrolling = type;
      }
    },
    removeModalClassName() {
      if (this.layout === 'VIEW_BOX') {
        dom.removeClass(document.body, 'h3-modal-open');
      }
    },
  },
  data() {
    return {
      layout: '',
      initialShow: true,
      hasFirstShow: false,
      show: this.value,
    };
  },
  computed: {
    styles() {
      const styles = {};
      if (!this.position || this.position === 'bottom' || this.position === 'top') {
        styles.height = this.height;
      } else {
        styles.width = this.width;
      }

      if (this.maxHeight) {
        styles['max-height'] = this.maxHeight;
      }

      if (this.isTransparent) {
        styles.background = 'transparent';
      }
      if (this.popupStyle) {
        for (const i of Object.keys(this.popupStyle)) {
          styles[i] = this.popupStyle[i];
        }
      }
      return styles;
    },
  },
  watch: {
    value(val) {
      this.show = val;
    },
    show(val) {
      this.$emit('input', val);
      if (val) {
        if (this.popup) {
          this.popup.show();
        }
        this.$emit('on-show');
        this.fixSafariOverflowScrolling('auto');
        if (this.layout === 'VIEW_BOX') {
          dom.addClass(document.body, 'h3-modal-open');
        }
        if (!this.hasFirstShow) {
          this.$emit('on-first-show');
          this.hasFirstShow = true;
        }
      } else {
        this.$emit('on-hide');
        this.show = false;
        this.popup.hide(false);
        setTimeout(() => {
          if (!document.querySelector('.h3-popup-dialog.h3-popup-show')) {
            this.fixSafariOverflowScrolling('touch');
          }
          this.removeModalClassName();
        }, 200);
      }
    },
  },
  beforeDestroy() {
    if (this.popup) {
      this.popup.destroy();
    }
    this.fixSafariOverflowScrolling('touch');
    this.removeModalClassName();
  },
};
</script>

<style lang="less">
@import '../../styles/themes/default.less';
@import '../../styles/h3-ui/h3-modal.css';

.h3-popup-dialog {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  z-index: 501;
  transition-property: transform;
  transition-duration: 300ms;
  max-height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.h3-popup-dialog.h3-popup-left {
  width: auto;
  height: 100%;
  top: 0;
  right: auto;
  bottom: auto;
  left: 0;
}
.h3-popup-dialog.h3-popup-right {
  width: auto;
  height: 100%;
  top: 0;
  right: 0;
  bottom: auto;
  left: auto;
}
.h3-popup-dialog.h3-popup-top {
  width: 100%;
  top: 0;
  right: auto;
  bottom: auto;
  left: 0;
}
.h3-popup-mask {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  tap-highlight-color: rgba(0,0,0,0);
  z-index: -1;
  transition: opacity 400ms;
}
.h3-popup-mask.h3-popup-show {
  opacity: 1;
}

.h3-popup-animate-bottom-enter, .h3-popup-animate-bottom-leave-active {
  transform: translate3d(0, 100%, 0);
}

.h3-popup-animate-left-enter, .h3-popup-animate-left-leave-active {
  transform: translate3d(-100%, 0, 0);
}

.h3-popup-animate-right-enter, .h3-popup-animate-right-leave-active {
  transform: translate3d(100%, 0, 0);
}

.h3-popup-animate-top-enter, .h3-popup-animate-top-leave-active {
  transform: translate3d(0, -100%, 0);
}
</style>
