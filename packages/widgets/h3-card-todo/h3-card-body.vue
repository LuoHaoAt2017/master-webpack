<template>
  <div :class="wrapCls" :style="h3Style">
    <slot></slot>
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-card';
export default {
  props: {
    className: String,
    h3Style: Object,
    hasContent: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
    };
  },
  methods: {},
  computed: {
    wrapCls() {
      return this.hasContent
        ? cx(`${prefixCls}-body`, this.className)
        : cx(`${prefixCls}-body`, `${prefixCls}-body-null`, this.className);
    },
  },
};
</script>


