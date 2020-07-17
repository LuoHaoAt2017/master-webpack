<template>
  <div :class="wrapCls" :style="h3Style" @click="onClickBody">
    <slot></slot>
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-card-body';
export default {
  name: 'h3-card-body',
  props: {
    className: String,
    h3Style: Object,
  },
  data() {
    return {
    };
  },
  methods: {
    onClickBody() {
      this.$emit('onClickBody');
    },
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`, this.className);
    },
  },
};
</script>


