<template>
  <div :class="wrapClasses" v-if="buttonGroup.length">
    <span
    v-for="(item,index) in buttonGroup" :key="index"
    @click="click(item,$event)"
    :class="buttonCls(item.type,item.size)"
    >
    {{item.title}}
    </span>
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
      type: Array,
      default: [],
    },
    className: String,
    contentClassName: String,
    h3Style: String,
    borderType: {
      type: String,
      default: 'all-border',
    },
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    click(item, e) {
      if (item.type === 'disabled') {
        return;
      }
      if (item.onClick) {
        item.onClick(e);
      } else {
        this.$emit('click', item);
      }
    },
    checkBoolean() {
    },
    checkString(str) {
      return str === undefined ? '' : str;
    },
    checkAction() {
    },
    buttonCls(type, size) {
      return cx(this.contentClassName, this.borderType, {
        [`${prefixCls}-md`]: size === 'md',
        [`${prefixCls}-lg`]: size === 'lg',
        [`${prefixCls}-lger`]: size === 'lger',
        [`${prefixCls}-default`]: type === '',
        [`${prefixCls}-default`]: type === 'default',
        [`${prefixCls}-share`]: type === 'share',
        [`${prefixCls}-primary`]: type === 'primary',
        [`${prefixCls}-disabled`]: type === 'disabled',
      });
    },
  },
  computed: {
    wrapClasses() {
      return cx(prefixCls, this.className);
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@buttonGroupPrefixCls: h3-button-group;

.@{buttonGroupPrefixCls} {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  .hairline('top', #E4E4E4);
  .px2rem(height, 88);
  overflow: hidden;
  background: #FFFFFF;
  span{
    display: inline-block;
    text-align: center;
    flex: auto;
    .px2rem(border-left,1);
    border-left-style: solid;
  }
  .all-border{
    .px2rem(height,88);
    .px2rem(line-height,88);
  }
  .center-border{
    .px2rem(height,42);
    .px2rem(line-height,42);
  }
  span:first-child{
    border: none !important;
  }
  &-md{
    .px2rem(font-size,28);
  }
  &-lg{
    .px2rem(font-size,30);
  }
  &-lger{
    .px2rem(font-size,34);
  }
  &-default{
    background: #FFFFFF;
    color: #333333;
    border-left-color: #E4E4E4 !important;
  }
  &-primary{
    background: #1890FF;
    color: #FFFFFF;
    border-left-color: #1890FF !important;
  }
  &-share{
    .px2rem(font-size,34);
    background: #FFFFFF;
    color: #1890FF;
    border-left-color: #E4E4E4 !important;
  }
  &-disabled{
    color: #ccc;
    border-left-color: #E4E4E4 !important;
  }
}
</style>

