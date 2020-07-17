<template>
    <div :class="wrapCls" v-if="showSelf">
      <div :class="arrowCls"></div>
      <div id="content">{{content}}</div>
      <div class="tip-extra">
        <template  v-for="(item,index) in extraBtn" v-if="extraBtn.length">
          <span @click="item.action" >{{item.name}}</span>
          <span class="cut-off-line" v-if="item.cutline">|</span>
        </template>
        <span class="aufont icon-base-close" @click="hideSelf" v-if="hasClose"></span>
      </div>
    </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-tool-tip';
export default {
  name: 'h3-tool-tip',
  components: {
  },
  props: {
    className: {
      type: String,
      default: '',
    },
    h3Style: Object,
    content: {
      type: String,
      default: '自动为你添加了管理员设置的图表报表',
    },
    showTip: {
      type: Boolean,
      default: true,
    },
    hasClose: {
      type: Boolean,
      default: true,
    },
    extraBtn: Array, // name action cutline
    direction: {
      type: String,
      default: 'left-top',
      validator: val => ['left', 'right', 'left-top', 'left-bottom', 'right-top', 'right-bottom', 'center-top', 'center-bottom'].indexOf(val) > -1,
    },
  },
  data() {
    return {
      showSelf: this.showTip,
    };
  },
  methods: {
    click(e) {
      if (this.onClick) {
        this.onClick(e);
      }
    },
    hideSelf() {
      this.$emit('hideTip');
      this.showSelf = !this.showSelf;
    },

  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`, this.className);
    },
    arrowCls() {
      return cx('arrow', `arrow-${this.direction}`);
    },
  },
  watch: {
    showTip(val) {
      this.showSelf = val;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/themes/default';
@import '../../styles/mixins';

.h3-tool-tip{
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .px2rem(height, 96);
  .px2rem(padding-left,30);
  .px2rem(padding-right,30);
  .px2rem(border-radius,6);
  color: #ffffff;
  background: rgba(0, 0, 0, 0.749);
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.259);
  .arrow{
    position: absolute;
    width: 0;
    height: 0;
    font-size: 0;
    border: 7px;
    border-style: solid;
    &-left{
      .px2rem(top, 36);
      left: -14px;
      border-color: rgba(255, 255, 255, 0) rgba(0, 0, 0, 0.749)  rgba(255, 255, 255, 0) rgba(255, 255, 255, 0);
    }
    &-left-top{
      top: -14px;
      .px2rem(left, 50);
      border-color: rgba(255, 255, 255, 0) rgba(255, 255, 255, 0)  rgba(0, 0, 0, 0.749)  rgba(255, 255, 255, 0);
    }
    &-left-bottom{
      bottom: -14px;
      .px2rem(left, 50);
      border-color: rgba(0, 0, 0, 0.749) rgba(255, 255, 255, 0) rgba(255, 255, 255, 0)  rgba(255, 255, 255, 0);
    }
    &-right{
      right: -14px;
      .px2rem(top, 36);
      border-color: rgba(255, 255, 255, 0) rgba(255, 255, 255, 0) rgba(255, 255, 255, 0) rgba(0, 0, 0, 0.749) ; 
    }
    &-right-top{
      top: -14px;
      .px2rem(right, 50);
      border-color: rgba(255, 255, 255, 0) rgba(255, 255, 255, 0)  rgba(0, 0, 0, 0.749)  rgba(255, 255, 255, 0);
    }
    &-right-bottom{
      bottom: -14px;
      .px2rem(right, 50);
      border-color: rgba(0, 0, 0, 0.749) rgba(255, 255, 255, 0) rgba(255, 255, 255, 0)  rgba(255, 255, 255, 0);
    }
    &-center-top{
      top: -14px;
      left: 50%;
      margin-left: -7px;
      border-color: rgba(255, 255, 255, 0) rgba(255, 255, 255, 0)  rgba(0, 0, 0, 0.749)  rgba(255, 255, 255, 0);
    }
    &-center-bottom{
      bottom: -14px;
      left: 50%;
      margin-left: -7px;
      border-color: rgba(0, 0, 0, 0.749) rgba(255, 255, 255, 0) rgba(255, 255, 255, 0)  rgba(255, 255, 255, 0);
    }
  }
  div{
    .px2rem(font-size,26); 
  }
  .tip-extra{
    display: flex;
    align-items: center;
    .px2rem(margin-left,30); 
    .cut-off-line{
      .px2rem(margin-left,30); 
      .px2rem(margin-right,30);
    }
    span{
      .px2rem(font-size,26); 
    }
    .icon-base-close{
      .px2rem(font-size,30); 
    }
  }
}

</style>


