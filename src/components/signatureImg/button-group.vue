<template>
  <div :class="wrapClasses" v-if="buttonGroup.length">
    <div v-for="(item,index) in buttonGroup" 
    @touchstart="touchstart(item, $event)"
    @touchend="touchend($event)"
    @touchcancel="touchcancel($event)"
    :key="index" @click="click(item,$event)"
       class="h-button" >
      <span :class="buttonCls(item.type,item.size)">
        {{item.title}}
      </span>
    </div>
  </div>
</template>

<script>
import cx from 'classnames';
import { addClass, removeClass } from '../../../packages/utils/class';

const prefixCls = 'h3-button-group';

export default {
  name: 'h3-button-group',
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
    touchstart(item, event) {
      if (item.type === 'disabled') {
        return;
      }
      if (event.target.tagName === 'SPAN') {
        addClass(event.target.parentNode, 'active');
      } else {
        addClass(event.target, 'active');
      }
    },
    touchend(event) {
      this.removeActiveCls(event);
    },
    touchcancel(event) {
      this.removeActiveCls(event);
    },
    removeActiveCls(event) {
      if (event.target.tagName === 'SPAN') {
        removeClass(event.target.parentNode, 'active');
      } else {
        removeClass(event.target, 'active');
      }
    },
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
    buttonCls(type) {
      return cx(this.contentClassName, this.borderType, {
        default: type === 'default' || type === '',
        highLight: type === 'highLight',
        primary: type === 'primary',
        disabled: type === 'disabled',
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
  .h-button{
    flex-basis: 50%;
    height: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    &.active {
      background: #f2f3f5;
    }
    &:last-child {
      span{
        border-left: 1px solid #e4e4e4 !important;
      }
    }
    span{
      width: 100%;
      font-size: 16px;
    }
    .default{
      color: #333333;
    }
    .primary{
      background: #1890FF;
    }
    .highLight{
      // .px2rem(font-size,34);
      color: #1890FF;
    }
    .disabled{
      color: #ccc;
    }
  }
}

</style>

