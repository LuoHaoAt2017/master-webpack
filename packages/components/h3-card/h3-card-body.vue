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
  },
  data() {
    return {
    };
  },
  methods: {},
  computed: {
    wrapCls() {
      return cx(`${prefixCls}-body`, this.className);
    },
  },
};
</script>

