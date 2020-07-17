<template>
  <div :class="wrapCls" :style="h3Style">
    <div :class="contentCls">
      <slot :style="thumbStyle" name="thumb"></slot>
      <!-- <div v-html="title" v-if="!$slots.thumb"></div> -->
      <div><span v-html="title" v-if="!$slots.thumb"></span> <span v-html="subTitle" v-if="!$slots.thumb" class="h3-card-header-content-subtitle"></span></div>
    </div>
    <div :class="extraCls" v-if="hasExtra" >
      <slot name="extra"></slot>
    </div>
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-card';
export default {
  name: 'h3-card-header',
  props: {
    className: String,
    h3Style: Object,
    thumbStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    title: String,
    subTitle: String,
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

.h3-card-header-content-subtitle{
  color: #999;
  .px2rem(font-size, 28);
}
</style>

