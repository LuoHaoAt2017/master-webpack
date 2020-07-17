<template>
  <div :class="wrapCls" :style="h3Style">
      <div :class="contentCls">
        <slot name="content"></slot>
      </div>
      <div :class="extraCls">
        <slot name="extra"></slot>
      </div>
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-card';
export default {
  name: 'h3-card-footer',
  props: {
    className: String,
    h3Style: Object,
  },
  data() {
    return {
    };
  },
  methods: {},
  computed: {
    wrapCls() {
      return cx(`${prefixCls}-footer`, this.className);
    },
    contentCls() {
      return `${prefixCls}-footer-content`;
    },
    extraCls() {
      return `${prefixCls}-footer-extra`;
    },
  },
};
</script>

