<template>
  <div :class="wrapCls" :style="heightStyle">
    <slot></slot>
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-back-drop';
export default {
  name: 'h3-back-drop',
  components: {
  },
  props: {
    className: String,
    // h3Style: Object,
    height: {
      type: String,
      default: '50%',
    },
  },
  data() {
    return {
      heightStyle: {
        height: this.height,
      },
    };
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`, this.className);
    },
  },
  methods: {
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
.h3-back-drop {
  position: absolute;
  z-index: 6666;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #fff;
  opacity: 0.8;
}

</style>