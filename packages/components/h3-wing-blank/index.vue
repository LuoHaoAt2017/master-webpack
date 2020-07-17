<template>
  <div :class="wrapCls" :style="h3style">
    <slot></slot>
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-wingblank';
export default {
  name: 'h3-wingblank',
  props: {
    h3style: {
      type: Object,
      default() {
        return {};
      },
    },
    size: {
      type: String,
      validator(val) {
        const options = ['sm', 'md', 'lg'];
        if (options.indexOf(val) > -1) {
          return true;
        }
        return false;
      },
      default: 'lg',
    },
    className: String,
  },
  data() {
    return {
    };
  },
  methods: {},
  computed: {
    wrapCls() {
      return cx(prefixCls, `${prefixCls}-${this.size}`, this.className);
    },
  },
};
</script>
<style lang="less">
@import '../../styles/themes/default';

@wingblankPrefixCls: h3-wingblank;

.@{wingblankPrefixCls} {
  margin-left: @h-spacing-md;
  margin-right: @h-spacing-md;

  &&-sm {
    margin-left: @h-spacing-sm;
    margin-right: @h-spacing-sm;
  }

  &&-md {
    margin-left: @h-spacing-md;
    margin-right: @h-spacing-md;
  }

  &&-lg {
    margin-left: @h-spacing-lg;
    margin-right: @h-spacing-lg;
  }
}
</style>


