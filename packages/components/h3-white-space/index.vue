<template>
  <div :class="wrapCls" :style="h3style" @click="onClick" >
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-whitespace';
export default {
  name: 'h3-whitespace',
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
        const options = ['xs', 'sm', 'md', 'lg', 'xl'];
        if (options.indexOf(val) > -1) {
          return true;
        }
        return false;
      },
      default: 'md',
    },
    className: String,
  },
  data() {
    return {
    };
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    },
  },
  computed: {
    wrapCls() {
      return cx(prefixCls, `${prefixCls}-${this.size}`, this.className);
    },
  },
};
</script>
<style lang="less">
@import '../../styles/themes/default';

@whitespacePrefixCls: h3-whitespace;

.@{whitespacePrefixCls} {
  &&-xs {
    height: @v-spacing-xs;
  }

  &&-sm {
    height: @v-spacing-sm;
  }

  &&-md {
    height: @v-spacing-md;
  }

  &&-lg {
    height: @v-spacing-lg;
  }

  &&-xl {
    height: @v-spacing-xl;
  }
}
</style>


