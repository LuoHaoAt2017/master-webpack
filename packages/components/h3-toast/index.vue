<template>
  <div>
    <div :class="maskCls" v-show="innerShow">
      <span>
        <div :class="noticeCls">
          <div :class="contentWrapCls">
              <div :class="textWrapCls" role="alert" aria-live="assertive">
                <icon v-if="iconType && iconType!=='loading'" :type="iconType" size="lg"  />
                <span  aria-label="loading" class="h3-loading-spinner"  v-if="iconType && iconType==='loading'"></span>
                <div :class="contentCls" v-if="text" v-html="text"></div>
                <div :class="contentCls" v-if="slotText">
                  <slot></slot>
                </div>
              </div>
          </div>
        </div>
      </span>
    </div>
  </div>
</template>
<script>
import cx from 'classnames';
import icon from '../h3-icon';

const prefixCls = 'h3-toast';
export default {
  name: 'h3-toast',
  components: {
    icon,
  },
  props: {
    iconType: {
      type: String,
      default: '',
    },
    transitionName: {
      type: String,
      default: 'h3-fade',
    },
    duration: {
      type: Number,
      default: 3000,
    },
    mask: {
      type: Boolean,
      default: true,
    },
    text: String,
    show: {
      type: Boolean,
      default: false,
    },
    slotText: {
      type: Boolean,
      default: false,
    },
    autoHide: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    show(val) {
      this.innerShow = val;
    },
    innerShow(val) {
      if (val) {
        clearTimeout(this.timeout);
        const that = this;
        if (this.autoHide) {
          this.timeout = setTimeout(() => {
            that.innerShow = false;
            that.$emit('onHide', false);
          }, this.duration);
        }
      }
    },
  },
  data() {
    return {
      innerShow: this.show,
    };
  },
  computed: {
    textWrapCls() {
      return cx(`${prefixCls}-text`, {
        [`${prefixCls}-text-icon`]: this.iconType,
      });
    },
    noticeCls() {
      return `${prefixCls}-notice ${prefixCls}-notice-closable`;
    },
    contentWrapCls() {
      return `${prefixCls}-notice-content`;
    },
    contentCls() {
      return `${prefixCls}-text-info`;
    },
    maskCls() {
      return cx(prefixCls, {
        [`${prefixCls}-mask`]: this.mask,
        [`${prefixCls}-nomask`]: !this.mask,
      });
    },
    textCls() {
      return `${prefixCls}-text-info`;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';

@toastPrefixCls: h3-toast;

.@{toastPrefixCls} {
  position: fixed;
  width: 100%;
  z-index: @toast-zindex;
  font-size: @font-size-base;
  text-align: center;

  > span {
    max-width: 50%;
  }

  &&-mask {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 0;
  }

  &&-nomask {
    position: fixed;
    max-width: 50%;
    width: auto;
    left: 50%;
    top: 50%;

    .@{toastPrefixCls}-notice {
      transform: translateX(-50%) translateY(-50%);
    }
  }

  &-notice-content {
    .@{toastPrefixCls}-text {
      min-width: 60 * @hd;
      border-radius: @radius-sm;
      color: @color-text-base-inverse;
      background-color: @toast-fill;
      line-height: @line-height-paragraph;
      padding: @v-spacing-md @h-spacing-lg;

      &.@{toastPrefixCls}-text-icon {
        border-radius: @radius-md;
        padding: @v-spacing-lg @h-spacing-lg;

        .@{toastPrefixCls}-text-info {
          margin-top: @v-spacing-sm;
        }
      }
    }
  }
}

.h3-loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  .encoded-svg-background('loading');

  background-position: 50%;
  background-size: 100%;
  background-repeat: no-repeat;
  animation: spinner-anime 1s linear infinite;
}
@keyframes spinner-anime {
  100% {
    transform: rotate(360deg);
  }
}
</style>


