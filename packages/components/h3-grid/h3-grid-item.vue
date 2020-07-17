<template>
  <H3FlexboxItem @click.native="click" :class="`${prefixCls}-item`" :style="wrapStyle"  
  >
    <slot></slot>
  </H3FlexboxItem>
</template>

<script>
import { H3FlexboxItem } from '../h3-flexbox';
import touch from '../../directives/touch';

export default {
  name: 'h3-grid-item',
  props: {
    rowNum: {
      type: Number,
      // required: true,
    },
    colNum: {
      type: Number,
      // required: true,
    },
    activeCls: {
      type: String,
    },
    prefixCls: {
      type: String,
      default: 'h3-grid',
    },
    onClick: {
      type: Function,
    },
    gutter: {
      type: Number,
      default: 0,
    },
    itemHeight: Number,
  },
  components: {
    H3FlexboxItem,
  },
  directives: {
    touch,
  },
  data() {
    return {
      itemWidth: '25%',
      orient: 'horizontal',
    };
  },
  mounted() {
    this.itemWidth = `${100 / this.$parent.$parent.$props.colNums}%`;
  },
  methods: {
    click(event) {
      if (this.onClick) {
        this.onClick(event, this.rowNum, this.colNum);
      }
    },
  },
  computed: {
    wrapStyle() {
      return {
        flexBasis: this.itemWidth,
        width: this.itemWidth,
      };
    },
  },
};
</script>

