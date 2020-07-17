<template>
  <div class="h3-button-group-wrap" :class="borderCls">
    <slot>
      <h3-flexbox :gutter = "0">
        <h3-flexbox-item class="h3-button-group-item" v-for="(button,index) in buttons" :key="index">
          <div @click="onClick(button, index)">{{button.display}}</div>
        </h3-flexbox-item>
      </h3-flexbox>
    </slot>
  </div>
</template>
<script>
import { H3Flexbox, H3FlexboxItem } from '../../components/h3-flexbox';

export default {
  name: 'h3-button-group',
  components: {
    H3Flexbox,
    H3FlexboxItem,
  },
  props: {
    buttons: {
      type: Array,
      default: () => [], // {display, action, handler}
    },
    showTopLine: {
      type: Boolean,
      default: true,
    },
    showBottonLine: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onClick(btn, index) {
      if (btn.handler) {
        btn.handler(btn, index);
      } else {
        this.$emit('onClick', { Button: btn, index });
      }
    },
  },
  computed: {
    borderCls() {
      if (this.showTopLine) {
        if (this.showBottonLine) {
          return 'button-group-border-top button-group-border-bottom';
        }
        return 'button-group-border-top';
      } else if (this.showBottonLine) {
        return 'button-group-border-bottom';
      }
      return '';
    },
  },
};
</script>
<style lang="less" >
@import '../../styles/mixins';
@prefixCls: h3-button-group-wrap;
.@{prefixCls}{

  &.button-group-border-top {
    .hairline('top', @border-color-base);
  }
  &.button-group-border-bottom { 
    .hairline('bottom', @border-color-base);
  }
  .h3-button-group-item:not(first-child) {
    div {
      .hairline('left', @border-color-base);
    }
  }
}
</style>


