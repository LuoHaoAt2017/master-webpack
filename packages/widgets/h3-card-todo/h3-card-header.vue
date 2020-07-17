<template>
  <div :class="wrapCls" >
    <div :class="contentCls">
      <slot :style="thumbStyle" name="title"></slot>
      <sup class="h3-badge-hot" v-show="showBadge"></sup>
      <!-- <div v-html="title" ></div> -->
    </div>
    <div :class="extraCls"  >
      <slot name="extra"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-card';
export default {
  name: 'h3-card-header',
  props: {
    className: String,
    h3Style: String,
    thumbStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    showBadge: {
      type: Boolean,
      default: false,
    },
    hasExtra: Boolean,
  },
  data() {
    return {
    };
  },
  methods: {},
  computed: {
    wrapCls() {
      return cx(`${prefixCls}-header`, this.className);
    },
    contentCls() {
      return `${prefixCls}-header-content`;
    },
    extraCls() {
      return `${prefixCls}-header-extra`;
    },
  },
};
</script>

<style lang="less">
@import '../../styles/mixins';

.h3-badge-hot{
  transform: translate(0,-100%);
  .px2rem(height, 12);
  .px2rem(width, 12);
  border-radius: 100%;
  background: @brand-important;
  z-index: 10; 
}
</style>

