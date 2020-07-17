<template>
  <div :class="wrapCls" :style="h3style">
    <div v-if="hasHeader" :class="headerCls">
      <slot name="header"></slot>
    </div>
    <!-- <div :class="[bodyCls:!has BottomLine,bottomLine]">  -->
    <div :class="[hasBottomLine?bodyCls:bottomLine]"> 
      
      <slot></slot>
    </div>
    <div v-if="hasFooter" :class="footerCls">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-list';
export default {
  name: 'h3-list',
  props: {
    className: {
      type: String,
      default: '',
    },
    h3style: {
      type: Object,
      default() {
        return {};
      },
    },
    hasHeader: {
      type: Boolean,
      default: false,
    },
    hasFooter: {
      type: Boolean,
      default: false,
    },
    hasBottomLine: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    wrapCls() {
      return cx(prefixCls, this.className);
    },
    headerCls() {
      return `${prefixCls}-header`;
    },
    bodyCls() {
      return `${prefixCls}-body`;
    },
    footerCls() {
      return `${prefixCls}-footer`;
    },
    bottomLine() {
      if (this.hasBottomLine) {
        return 'h3-list-body-bottom-line';
      }
      return 'h3-list-body-bottom-line-not';
    },
  },
};
</script>
<style lang="less">
@import "../../styles/mixins";
// @import "../../styles/themes/default";
@import '../../styles/h3-ui/h3-list';
@listPrefixCls: h3-list;

@{listPrefixCls}{
  &-body-bottom-line{
    position: relative;
    background-color: @fill-base;
    // .hairline('top');
    .hairline('bottom');

    div:not(:last-child) {
      .@{listPrefixCls}-line {
        .hairline('bottom');
      }
    }
  }

  &-body-bottom-line-not{
    position: relative;
    background-color: @fill-base;
    // .hairline('top');
    // .hairline('bottom');

    // div:not(:last-child) {
    //   .@{listPrefixCls}-line {
    //     .hairline('bottom');
    //   }
    // }

    // &::after {
    // }
  }
}

</style>


