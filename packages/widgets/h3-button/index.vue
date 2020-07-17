<template>
  <div @click="click($event)"
  :class="wrapClasses" 
  :style="wrapStyle" v-touch="activeClassName">
    <h3-icon :type="icon" v-if="icon"></h3-icon>
    <span  aria-label="loading" class="h3-loading-spinner"  v-if="loading"></span>
    <slot></slot>
  </div>
</template>

<script>
import cx from 'classnames';
import dom from '../../utils/dom';
import touch from '../../directives/touch';

const prefixCls = 'h3-button';

export default {
  name: 'h3-button',
  props: {
    type: {
      type: String,
    },
    size: {
      type: String,
      default: 'large',
    },
    activeStyle: {
      type: [Object, Boolean],
      default: () => {},
    },
    activeClassName: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onClick: Function,
    inline: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    icon: String,
    className: String,
  },
  directives: {
    touch,
  },
  data() {
    return {
      isActive: false,
    };
  },
  mounted() {
    const events = this.disabled ? undefined : {
      touchstart: this.onTouchStart,
      touchmove: this.onTouchMove,
      touchend: this.onTouchEnd,
      touchcancel: this.onTouchCancel,
      mousedown: this.onMouseDown,
      mouseup: this.onMouseUp,
      mouseleave: this.onMouseLeave,
    };
    const el = this.$el;
    if (el && events) {
      for (const key of Object.keys(events)) {
        dom.addEvent(el, key, events[key], false);
      }
    }
  },
  methods: {
    click(e) {
      if (this.disabled) {
        return;
      }
      if (this.onClick) {
        this.onClick(e);
      } else {
        this.$emit('click', e);
      }
    },
  },
  computed: {
    wrapClasses() {
      return cx(prefixCls, this.className, {
        [`${prefixCls}-primary`]: this.type === 'primary',
        [`${prefixCls}-ghost`]: this.type === 'ghost',
        [`${prefixCls}-warning`]: this.type === 'warning',
        [`${prefixCls}-small`]: this.size === 'small',
        [`${prefixCls}-inline`]: this.inline,
        [`${prefixCls}-disabled`]: this.disabled,
        [`${prefixCls}-loading`]: this.loading,
        [`${prefixCls}-active`]: this.isActive && !this.disabled,
        [`${this.activeClassName}`]: this.isActive && !this.disabled && this.activeClassName,
        // [`${prefixCls}-icon`]: !!this.iconType,
      });
    },
    wrapStyle() {
      if (!this.disabled && this.isActive) {
        if (this.activeStyle !== false) {
          if (this.activeStyle) {
            return this.activeStyle;
          }
        }
      }
      return '';
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
// @import '../../styles/themes/default';
@buttonPrefixCls: h3-button;

.@{buttonPrefixCls} {
  // do not use width:100%, can not set margin
  flex: 1;
  display: block;
  outline: 0 none;
  -webkit-appearance: none;
  box-sizing: border-box;
  padding: 0;
  text-align: center;
  // font-size: @font-size-heading;
  // height: @button-height;
  // line-height: @button-height;
  position: relative;
  // .hairline('top');
  border-top: 1PX solid @border-color-base;
  .px2rem(font-size, 28);
  .px2rem(height, 88);
  .px2rem(line-height,88);

  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: nowrap;

  // default
  color: @color-text-base;
  background-color: @fill-base;

  // Multiple buttons inline arranged, the last one border-right may not display
  &-borderfix {
    &:before {
      transform: scale(0.49)!important;
    }
  }
  &-right {
    // border-right: 1PX solid @border-color-base;
    .hairline('right');
    border-radius: 0 !important;
  }

  &&-active {
    background-color: @fill-tap;
  }
  &&-disabled {
    color: fade(@color-text-base, 30%);
    opacity: 0.6;
  }

  &-primary {
    color: @color-text-base-inverse;
    background-color: @primary-button-fill;
    .hairline('all', @primary-button-fill, @radius-md);

    &.@{buttonPrefixCls}-active {
      color: fade(@color-text-base-inverse, 30%);
      background-color: @primary-button-fill-tap;
    }
    &.@{buttonPrefixCls}-disabled {
      color: fade(@color-text-base-inverse, 60%);
      opacity: 0.4;
    }
  }

  &-ghost {
    color: @ghost-button-color;
    background-color: transparent;
    .hairline('all', @ghost-button-color, @radius-md);

    &.@{buttonPrefixCls}-active {
      color: @ghost-button-fill-tap;
      background-color: transparent;
      .hairline('all', @ghost-button-fill-tap, @radius-md);
    }
    &.@{buttonPrefixCls}-disabled {
      color: fade(@color-text-base, 10%);
      .hairline('all', fade(@color-text-base, 10%), @radius-md);
      opacity: 1; // override default opacity: 0.6
    }
  }

  &-warning {
    color: @color-text-base-inverse;
    background-color: @warning-button-fill;

    &.@{buttonPrefixCls}-active {
      color: fade(@color-text-base-inverse, 30%);
      background-color: @warning-button-fill-tap;
    }
    &.@{buttonPrefixCls}-disabled {
      color: fade(@color-text-base-inverse, 60%);
      opacity: 0.4;
    }
  }

  &-inline {
    display: inline-block;
    padding: 0 @h-spacing-lg;
  }

  &-small {
    font-size: @button-font-size-sm;
    height: @button-height-sm;
    line-height: @button-height-sm;
    padding: 0 @h-spacing-lg;
  }

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  > .@{buttonPrefixCls}-icon {
    margin-right: 0.5em;
  }
}
</style>

