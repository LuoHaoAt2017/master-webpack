<template>
  <span :class="badgeCls">
    <slot></slot>
    <sup :class="scrollNumberCls" :style="h3Style" v-if="textStr || dot">
      {{textStr}}
    </sup>
  </span>
</template>

<script>
import cx from 'classnames';

const prefixCls = 'h3-badge';

export default {
  name: 'h3-badge',
  props: {
    size: {
      type: String,
      default: 'small',
    },
    overflowCount: {
      type: Number,
      default: 99,
    },
    dot: {
      type: Boolean,
      default: false,
    },
    corner: {
      type: Boolean,
      default: false,
    },
    text: [String, Number],
    h3Style: Object,
    hot: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    textStr() {
      if (this.dot) {
        return '';
      }
      if (typeof this.text === 'number') {
        if (this.text > this.overflowCount) {
          return `${this.overflowCount}+`;
        }
      }
      return this.text;
    },
    scrollNumberCls() {
      return cx({
        [`${prefixCls}-dot`]: this.dot,
        [`${prefixCls}-dot-large`]: this.dot && (this.size === 'large'),
        [`${prefixCls}-text`]: !this.dot && !this.corner,
        [`${prefixCls}-corner`]: this.corner,
        [`${prefixCls}-corner-large`]: this.corner && (this.size === 'large'),
      });
    },
    badgeCls() {
      return cx(prefixCls, {
        [`${prefixCls}-not-a-wrapper`]: !this.$slots.default,
        [`${prefixCls}-corner-wrapper`]: this.corner,
        [`${prefixCls}-hot`]: !!this.hot,
        [`${prefixCls}-corner-wrapper-large`]: this.corner && (this.size === 'large'),
      });
    },
  },
};
</script>

<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';

.h3-badge {
  position: relative;
  display: inline-block;
  line-height: @line-height-base;
  vertical-align: middle;

  &-text {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    top: -1 * @v-spacing-sm;
    height: @icon-size-xs;
    line-height: @icon-size-xs;
    min-width: @icon-size-xs / 2;
    border-radius: 2 * @v-spacing-sm;
    padding: 0 @h-spacing-sm;
    text-align: center;
    font-size: @font-size-caption-sm;
    color: @color-text-base-inverse;
    background-color: @brand-important;
    white-space: nowrap;
    transform: translateX(-45%);
    transform-origin: -10% center;
    z-index: 10;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", SimSun, sans-serif;

    a {
      color: @color-text-base-inverse;
    }

    p {
      margin: 0;
      padding: 0;
    }
  }

  &-hot &-text {
    background-color: #f96268;
  }

  &-dot {
    position: absolute;
    transform: translateX(-50%);
    transform-origin: 0 center;
    top: -2 * @border-width-lg;
    height: 0.5 * @link-button-font-size;
    width: 0.5 * @link-button-font-size;
    border-radius: 100%;
    background: @brand-important;
    z-index: 10;

    &-large {
      height: @link-button-font-size;
      width: @link-button-font-size;
    }
  }

  &-not-a-wrapper &-text,
  &-not-a-wrapper &-dot {
    top: auto;
    display: block;
    position: relative;
    transform: translateX(0);
  }

  &-corner {
    width: 5 * @link-button-font-size;
    padding: 0.5 * @link-button-font-size;
    position: absolute;
    right: -2 * @link-button-font-size;
    top: 0.5 * @link-button-font-size;
    background-color: @brand-important;
    color: @color-text-base-inverse;
    white-space: nowrap;
    transform: rotate(45deg);
    text-align: center;
    font-size: @font-size-subhead;

    &-wrapper {
      overflow: hidden;
    }
  }
}
</style>

