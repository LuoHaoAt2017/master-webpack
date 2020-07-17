<template>
  <div :class="wrapCls" :style="h3Style">
      <slot name="content"></slot>
      <slot></slot> 
  </div>
</template>
<script>
import cx from 'classnames';
import backDrop from '../../../../packages/widgets/h3-button-icon/h3-back-drop.vue';

const prefixCls = 'h3-card';
export default {
  name: 'h3-card-footer',
  components: {
    backDrop,
  },
  props: {
    className: String,
    h3Style: Object,
    showBackDrop: {
      type: Boolean,
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

