<template>
  <!-- <h3-touch
    :onTouchStart="touchStart" 
    :onTouchMove="touchMove" 
    :onTouchEnd="touchEnd" 
    :onTouchCancel="touchCancel">
    <div @click="innerClick($event)" :class="wrapCls" v-touch>
      <div v-show="hasThumb" :class="thumbCls">
        <slot name="thumb"></slot>
      </div>
      <div :class="lineCls">
        <div :class="contentCls">
          <slot></slot>
          <div :class="briefCls" v-if="brief">
            <slot name="brief"></slot>
          </div>
        </div>
        <div v-show="hasExtra" :class="extraCls">
          <slot name="extra">
            <div v-html="extra"></div>
          </slot>
        </div>
        <div v-if="arrow" :class="arrowCls" aria-hidden="true" />
      </div>
    </div>
  </h3-touch> -->
  <div @click="innerClick($event)" :class="wrapCls" v-touch="{disabled: !hasTouchEffect, activeClass: activeClass}">
      <div :class="lineCls">
        <div v-if="hasThumb" :class="thumbCls">
          <slot name="thumb"></slot>
        </div>
        <div :class="contentCls">
          <slot></slot>
          <div :class="briefCls" v-if="brief">
            <slot name="brief"></slot>
          </div>
        </div>
        <div v-if="hasExtra" :class="extraCls">
          <slot name="extra">
            <div v-html="extra"></div>
          </slot>
        </div>
        <div v-if="arrow" :class="arrowCls" aria-hidden="true" />
      </div>
    </div>
</template>

<script>
import cx from 'classnames';
import touch from '../../directives/touch';
// import h3Touch from '../h3-touch/';
// import touch2 from '../../mixins/touch2';

const prefixCls = 'h3-list';
export default {
  name: 'h3-list-item',
  // mixins: [touch2],
  // components: {
  //   h3Touch,
  // },
  props: {
    className: String,
    h3style: {
      type: Object,
      default() {
        return {};
      },
    },
    contentClassName: Object,
    actionStyle: Object,
    disabled: Boolean,
    multipleLine: {
      type: Boolean,
      default: false,
    },
    hasContentLine: {
      type: Boolean,
      default: true,
    },
    hasThumb: {
      type: Boolean,
      default: false,
    },
    hasExtra: {
      type: Boolean,
      default: false,
    },
    brief: {
      type: Boolean,
      default: false,
    },
    extra: {
      type: String,
      default: '',
    },
    align: {
      validator(val) {
        if (val === 'top' || val === 'middle' || val === 'bottom') {
          return true;
        }
        return false;
      },
      default: 'middle',
    },
    arrow: {
      type: String,
      validator(val) {
        const arrayVal = ['horizontal', 'down', 'up', 'empty', ''];
        if (arrayVal.indexOf(val) > -1) {
          return true;
        }
        return false;
      },
    },
    wrap: {
      type: Boolean,
      default: false,
    },
    eventArgs: [Object, String, Number, Boolean, Array],
    error: Boolean,
    platform: {
      validator(val) {
        if (val === 'android' || val === 'ios') {
          return true;
        }
        return false;
      },
      default: 'ios',
    },
    touchFeedback: {
      type: Boolean,
      default: true,
    },
    activeClass: {
      type: String,
      default: '',
    },
  },
  directives: {
    touch,
  },
  // data() {
  //   return {
  //     // coverRippleStyle: {
  //     //   display: 'none',
  //     //   width: '0px',
  //     //   height: '0px',
  //     //   left: '0px',
  //     //   top: '0px',
  //     // },
  //     // RippleClicked: false,
  //     // isActive: false,
  //   };
  // },
  methods: {
    touchStart() {
      if (this.disabled || !this.touchFeedback) {
        return;
      }
      this.toggleActive(true);
    },
    touchMove() {
    },
    innerClick() {
      if (this.disabled) {
        this.isActive = false;
        return;
      }
      this.$emit('onClick', this.eventArgs);
    },
  },
  computed: {
    hasTouchEffect() {
      return this.touchFeedback && !this.disabled;
    },
    isAndroid() {
      return this.platform === 'android';
    },
    wrapCls() {
      return cx(`${prefixCls}-item`, this.className, {
        [`${prefixCls}-item-disabled`]: this.disabled,
        [`${prefixCls}-item-error`]: this.error,
        [`${prefixCls}-item-top`]: this.align === 'top',
        [`${prefixCls}-item-middle`]: this.align === 'middle',
        [`${prefixCls}-item-bottom`]: this.align === 'bottom',
        [`${prefixCls}-item-active`]: this.isActive,
      });
    },
    rippleCls() {
      return cx(`${prefixCls}-ripple`, {
        [`${prefixCls}-ripple-animate`]: this.RippleClicked,
      });
    },
    lineCls() {
      // console.log('this.multipleLine');
      // console.log(this.multipleLine);
      return cx({
        [`${prefixCls}-line`]: this.hasContentLine,
        [`${prefixCls}-line-multiple`]: this.multipleLine,
        [`${prefixCls}-line-wrap`]: this.wrap,
      });
    },
    briefCls() {
      return `${prefixCls}-brief`;
    },
    arrowCls() {
      return cx(`${prefixCls}-arrow`, {
        [`${prefixCls}-arrow-horizontal`]: this.arrow === 'horizontal',
        [`${prefixCls}-arrow-vertical`]: this.arrow === 'down' || this.arrow === 'up',
        [`${prefixCls}-arrow-vertical-up`]: this.arrow === 'up',
      });
    },
    thumbCls() {
      return `${prefixCls}-thumb`;
    },
    contentCls() {
      return cx(`${prefixCls}-content`, this.contentClassName, {
        [`${prefixCls}-content-brief`]: this.brief,
      });
    },
    extraCls() {
      return `${prefixCls}-extra`;
    },
  },
  watch: {
  },
};
</script>
<style lang="less">
@import "../../styles/mixins";
// @import "../../styles/themes/default";
@import '../../styles/h3-ui/h3-list';

</style>

