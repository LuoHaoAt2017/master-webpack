<template>
  <h3-touch 
  :onTouchStart="touchStart" 
  :onTouchMove="touchMove" 
  :onTouchEnd="touchEnd" 
  :onTouchCancel="touchCancel"
  >
  <div @onClick="click"
  :class="wrapClasses" 
  :style="wrapStyle">
    <h3-icon :type="icon" v-if="icon" :color="iconColor"></h3-icon>
    <span  aria-label="loading" class="h3-loading-spinner"  v-if="loading"></span>
    <slot></slot>
  </div>
  </h3-touch>
</template>
<script>
import cx from 'classnames';
import H3Touch from '../../components/h3-touch/index.vue';
import touch2 from '../../mixins/touch2';
import H3Icon from '../h3-icon/index.vue';

const prefixCls = 'h3-button';

export default {
  name: 'h3-button2',
  mixins: [touch2],
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
    iconColor: String,
  },
  components: {
    H3Touch,
    H3Icon,
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
        e.stopPropagation();
      }
    },
  },
  computed: {
    wrapClasses() {
      return cx(prefixCls, {
        [`${prefixCls}-primary`]: this.type === 'primary',
        [`${prefixCls}-ghost`]: this.type === 'ghost',
        [`${prefixCls}-warning`]: this.type === 'warning',
        [`${prefixCls}-small`]: this.size === 'small',
        [`${prefixCls}-add`]: this.type === 'add',
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
@import '../../styles/themes/default';
@buttonPrefixCls: h3-button;

.@{buttonPrefixCls} {
  // do not use width:100%, can not set margin
  // display: block;
  display: flex;
  align-items: center;
  justify-content: center;
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
      transform: scale(0.49) !important;
    }
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
  &-add {
    color: #1890FF;
    // background-color: @primary-button-fill;
    .hairline('all', #1890FF, @radius-md);
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
.h3-loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: middle;
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
