<template>
  <div :class="wrapClasses" v-if="buttonGroup.length">
    <h3-button
    v-for="(item,index) in buttonGroup" :key="index"
    :type="item.type"
    :size="item.size"
    :disabled="item.disabled"
    :inline="item.inline"
    :loading="item.loading"
    :icon="item.icon"
    :onClick="item.onClick"
    :activeStyle="item.activeStyle"
    :activeClassName="checkString(item.activeClassName)"
    :className="hasBorderRight(index,buttonGroup.length)"
    >
    {{item.title}}
    </h3-button>
  </div>
</template>

<script>
import cx from 'classnames';
import H3Button from './index.vue';

const prefixCls = 'h3-button-group';

export default {
  name: 'h3-button-group',
  components: {
    H3Button,
  },
  props: {
    buttonGroup: {
      typr: Array,
      defalut: [],
    },
    className: String,
    h3Style: String,
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    click(e) {
      if (this.disabled) {
        return;
      }
      if (this.onClick) {
        this.onClick(e);
      } else {
        this.$emit('click', e);
      }
    },
    hasBorderRight(index, len) {
      return index === len - 1
        ? ''
        : 'h3-button-right';
    },
    checkBoolean() {
    },
    checkString(str) {
      return str === undefined ? '' : str;
    },
    checkAction() {
    },
  },
  computed: {
    wrapClasses() {
      return cx(prefixCls, this.className);
    },
    wrapStyle() {
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@buttonGroupPrefixCls: h3-button-group;

.@{buttonGroupPrefixCls} {
  display: flex;
  flex: 1;
  .h3-button {
    border-radius: 0 !important;
    // .px2rem(border-top, 1);
    border-style: solid;
    border-color: #E4E4E4;
    &::before {
      width: 0 !important;
      height: 0 !important;
    }
  }
}
</style>

