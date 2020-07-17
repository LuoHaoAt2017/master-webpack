<template>
  <div @click="click($event)"
  :class="wrapClasses"
  :style="wrapStyle" v-touch="{disabled: !hasTouchEffect, activeClass: activeClassName}">
    <h3-icon :type="icon" v-if="icon"></h3-icon>
    <span  aria-label="loading" class="h3-loading-spinner"  v-if="loading"></span>
    <slot></slot>
  </div>
</template>

<script>
import cx from 'classnames';
import touch from '../../directives/touch';
import H3Icon from '../h3-icon/index.vue';

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
    touchFeedback: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    H3Icon,
  },
  directives: {
    touch,
  },
  data() {
    return {
      isActive: false,
    };
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
    onTouchStart() {
      if (this.disabled || !this.touchFeedback) {
        return;
      }
      this.isActive = true;
      // this.toggleActive(true);
    },
    onTouchEnd() {
      this.isActive = false;
    },
  },
  computed: {
    wrapClasses() {
      return cx(prefixCls, {
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
    hasTouchEffect() {
      return this.touchFeedback && !this.disabled;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';
@buttonPrefixCls: h3-button;

.@{buttonPrefixCls} {
  // do not use width:100%, can not set margin
  display: block;
  outline: 0 none;
  -webkit-appearance: none;
  box-sizing: border-box;
  padding: 0;
  text-align: center;
  font-size: @button-font-size;
  height: @button-height;
  line-height: @button-height;

  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: nowrap;

  // default
  color: @color-text-base;
  background-color: @fill-base;

  .hairline('all', @border-color-base, @radius-md);

  // Multiple buttons inline arranged, the last one border-right may not display
  &-borderfix {
    &:before {
      transform: scale(0.49)!important;
    }
  }

  &&-active {
    background-color: #e4e4e4;
  }
  &&-disabled {
    // color: fade(@color-text-base, 30%);
    // opacity: 0.6;
    color: #d9d9d9;
  }

  &-primary {
    color: @color-text-base-inverse;
    background-color: #1890ff;
    .hairline('all', @primary-button-fill, @radius-md);
    // &.h3-common-active {
    //   background: #0c6cd9 !important;
    // }
    &.@{buttonPrefixCls}-active {
      color: fade(@color-text-base-inverse, 30%);
      background: #0c6cd9 ;
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
      // color: @ghost-button-fill-tap;
      // background-color: transparent;
      color: #1890ff;
      background: rgba(56, 173, 255, 0.1);
      .hairline('all', @ghost-button-fill-tap, @radius-md);
    }
    &.@{buttonPrefixCls}-disabled {
      // color: fade(@color-text-base, 10%);
      color: #d9d9d9;
      .hairline('all', #d9d9d9, @radius-md);
      opacity: 1; // override default opacity: 0.6
    }
  }

  &-warning {
    color: @color-text-base-inverse;
    background-color: @warning-button-fill;

    &.@{buttonPrefixCls}-active {
      // color: fade(@color-text-base-inverse, 30%);
      color: #fff;
      background-color: #cf1d23;
    }
    &.@{buttonPrefixCls}-disabled {
      color: fade(@color-text-base-inverse, 60%);
      opacity: 0.4;
    }
  }

  &-inline {
    display: inline-block;
    padding: 0 @h-spacing-lg;
    &.h3-common-active {
      background: #0c6cd9 !important;
    }
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

