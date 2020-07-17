<template>
  <div class="h3-actionsheet">
    <transition name="h3-actionsheet-mask">
      <div class="h3ui-mask h3ui-mask_transparent" ref="mask" @click="onClickingMask" v-show="show"></div>
    </transition>
    <transition name="h3-actionsheet-android">
      <div class="h3ui-skin_android" ref="panel" v-show="theme === 'android' && show">
        <div class="h3ui-actionsheet">
          <div class="h3ui-actionsheet__header" v-if="showTitle">
            <div class="h3ui-actionsheet__message" v-if="message" v-html="message"></div>
          </div>
          <div class="h3ui-actionsheet__menu">
            <div class="h3-actionsheet__cell" v-for="(text, key) in menus" @click="
              onMenuClick(text, key)" v-html="(text.label || text)">
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="h3-actionsheet-ios">
      <div class="h3ui-actionsheet" ref="panel" v-show="theme === 'ios' && show">
        <div class="h3ui-actionsheet__header" v-if="showTitle">
          <div class="h3ui-actionsheet__message" v-if="message" v-html="message"></div>
        </div>
        <div class="h3ui-actionsheet__menu">
          <div class="h3ui-actionsheet__cell" v-for="(text, key) in menus" @click="onMenuClick(text, key)" v-html="(text.label || text)" :class="`h3-actionsheet-menu-${text.type || 'default'}`">
          </div>
        </div>
        <div class="h3ui-actionsheet__action" @click="emitEvent('on-click-menu', 'cancel')" v-if="showCancel">
          <div class="h3ui-actionsheet__cell">{{cancelText || '取消'}}</div>
          <span class="h3ui-actionsheet-cancel-button-mask"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'h3-actionsheet',
  props: {
    value: Boolean,
    showCancel: {
      type: Boolean,
      default: true,
    },
    cancelText: String,
    // title: String,
    message: String,
    theme: {
      type: String,
      default: 'ios',
    },
    menus: {
      type: [Object, Array],
      default: () => ({}),
    },
    closeOnClickingMask: {
      type: Boolean,
      default: true,
    },
    closeOnClickingMenu: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.mask.addEventListener('touchmove', this.onTouchMove, false);
      this.$refs.panel.addEventListener('touchmove', this.onTouchMove, false);
      this.$tabbar = document.querySelector('.h3-tabbar');
    });
  },
  methods: {
    onMenuClick(text, key) {
      if (this.closeOnClickingMenu) {
        this.show = false;
      }
      if (typeof text === 'string') {
        this.emitEvent('on-click-menu', key, text);
      } else if (text.type !== 'disabled' && text.type !== 'info') {
        if (text.value || text.value === 0) {
          this.emitEvent('on-click-menu', text.value, text);
        } else {
          this.emitEvent('on-click-menu', '', text);
        }
      }
    },
    onClickingMask() {
      this.$emit('on-click-mask');
      if (this.closeOnClickingMask) {
        this.show = false;
      }
    },
    emitEvent(event, menu, item) {
      if (event === 'on-click-menu' && !/.noop/.test(menu)) {
        let tmp = item;
        if (typeof tmp === 'object') {
          tmp = JSON.parse(JSON.stringify(tmp));
        }
        this.$emit(event, menu, tmp);
        this.$emit(`${event}-${menu}`);
        if (menu === 'cancel') {
          this.show = false;
        }
        if (this.closeOnClickingMask) {
          this.show = false;
        }
      }
    },
    fixIos(zIndex) {
      if (this.$el.parentNode && this.$el.parentNode.className.indexOf('v-transfer-dom') !== -1) {
        return;
      }
      if (this.$tabbar && /iphone/i.test(navigator.userAgent)) {
        this.$tabbar.style.zIndex = zIndex;
      }
    },
    onTouchMove(e) {
      e.preventDefault();
    },
  },
  computed: {
    showTitle() {
      return !!this.message;
    },
  },
  watch: {
    show(val) {
      this.$emit('input', val);
      if (val) {
        this.fixIos(-1);
      } else {
        setTimeout(() => {
          this.fixIos(100);
        }, 200);
      }
    },
    value(val) {
      if (val) {
        this.show = true;
      } else {
        this.show = false;
      }
    },
  },
  beforeDestroy() {
    this.fixIos(100);
    this.$refs.mask.removeEventListener('touchmove', this.onTouchMove, false);
    this.$refs.panel.removeEventListener('touchmove', this.onTouchMove, false);
  },
};
</script>

<style lang="less">
@import '../../styles/h3-ui/h3-mask.less';
@import '../../styles/h3-ui/h3-actionsheet.less';

.h3-actionsheet-menu-primary {
  color: @brand-primary;
}
.h3-actionsheet-menu-warn {
  color: @brand-warning;
}
.h3-actionsheet-menu-error {
  color: @brand-error;
}
.h3-actionsheet-menu-success {
  color: @brand-success;
}
.h3-actionsheet-menu-default {
  color: @color-text-base;
}
.h3-actionsheet-menu-disabled {
  color: @color-text-disabled;
}
.h3-actionsheet-mask-enter,
.h3-actionsheet-mask-leave-active {
  opacity: 0;
}
.h3-actionsheet-mask-leave-active,
.h3-actionsheet-mask-enter-active {
  transition: opacity 300ms!important;
}

.h3-actionsheet-ios-enter,
.h3-actionsheet-android-enter,
.h3-actionsheet-ios-leave-to,
.h3-actionsheet-android-leave-to {
  transform: translateY(100%);
}

.h3-actionsheet-ios-leave-active,
.h3-actionsheet-android-leave-active {
  transform: translateY(100%);
  transition: all 300ms !important;
}

.h3-actionsheet-ios-enter-to,
.h3-actionsheet-android-enter-to
.h3-actionsheet-ios-enter-active,
.h3-actionsheet-android-enter-active {
  transform: translateY(0);
  transition: all 300ms !important;
}
</style>