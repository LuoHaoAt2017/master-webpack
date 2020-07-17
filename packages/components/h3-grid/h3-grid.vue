<template>
  <div :class="wrapCls">
    <H3Flexbox justify="start" wrap="wrap" align="stretch">
      <slot></slot>
    </H3Flexbox>
  </div>
</template>

<script>
import classnames from 'classnames';
import { H3Flexbox } from '../h3-flexbox';
import { H3Swiper, H3SwiperItem } from '../h3-swiper/';
import touch from '../../directives/touch';

export default {
  name: 'h3-grid',
  props: {
    hasLine: {
      type: Boolean,
      default: true,
    },
    isCarousel: {
      type: Boolean,
      default: false,
    },
    rowNums: {
      type: Number,
      default: 2,
    },
    colNums: {
      type: Number,
      default: 4,
    },
    carouselMaxRow: {
      type: Number,
      default: 2,
    },
    prefixCls: {
      type: String,
      default: 'h3-grid',
    },
    square: {
      type: Boolean,
      default: true,
    },
    hasChanged: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    };
  },
  directives: {
    touch,
  },
  mounted() {
    // this.renderFlexBox();
  },
  components: {
    H3Flexbox,
    H3Swiper,
    H3SwiperItem,
  },
  computed: {
    wrapCls() {
      return classnames(this.prefixCls, {
        [`${this.prefixCls}-square`]: this.square,
        [`${this.prefixCls}-line`]: this.hasLine,
        [`${this.prefixCls}-carousel`]: this.isCarousel,
      });
    },
  },
};
</script>

<style lang="less" >
@import '../../styles/index';
@import '../../styles/mixins';
@import '../../styles/themes/default';
@import './style/index.less';

</style>
