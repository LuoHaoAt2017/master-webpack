<template>
  <div :class="wrapCls" :style="h3Style" >
    <div style="width: 100%; display:flex;">
      <div :class="asideCls" :style="asideStyle" v-if="hasAside">
        <slot name="aside"></slot>
      </div>
      <div :class="mainCls" :style="mainStyle">
        <slot></slot>
      </div>
      <div :class="extraCls" :style="extraStyle" v-if="hasExtra">
        <slot name="extra"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-card-form';
export default {
  name: 'h3-card-form',
  components: {
  },
  props: {
    className: String,
    h3Style: Object,
    asideClass: String,
    asideStyle: {
      type: String,
      default: () => {},
    },
    mainClass: String,
    mainStyle: {
      type: String,
      default: () => {},
    },
    extraClass: String,
    extraStyle: {
      type: String,
      default: () => {},
    },
    hasLine: {
      type: Boolean,
      default: true,
    },
    hasExtraContent: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`, this.className, {
        [`${prefixCls}-line`]: this.hasLine,
      });
    },
    asideCls() {
      return cx(`${prefixCls}-aside`, this.asideClass);
    },
    mainCls() {
      return cx(`${prefixCls}-main`, this.mainClass, {
        'without-extra': !this.hasExtra,
      });
    },
    extraCls() {
      return cx(`${prefixCls}-extra`, this.extraClass);
    },
    hasAside() {
      return this.$slots.aside;
    },
    hasExtra() {
      if (!this.hasExtraContent ) {
        return false;
      }
      return this.$slots.extra || this.hasExtraContent;
    },
  },
  methods: {
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@PrefixName: h3-card-form;
.@{PrefixName} {
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: nowrap;
  .px2rem(padding-top,20);
  .px2rem(padding-bottom,20);
  .px2rem(padding-left,30);
  .px2rem(padding-right,30);
  background-color: #FFFFFF;
  
  &-line{
    .hairline('bottom', #EEE);
  }
  &-aside{
    .px2rem(width,80);
    .px2rem(height,80);
    .px2rem(margin-right,30);
    img{
      .px2rem(width,80);
      .px2rem(height,80);
      .px2rem(border-radius,5);
    }
  }
  &-main{
    // flex: 1;
    // .px2rem(margin-right,30);
    // display: flex;
    // align-items: center;
    // width: 100%;

    flex: 1;
    max-width: 100%;
    .px2rem(min-width, 268);
  }
  &-extra{
    display: flex;
    align-items: center;
    justify-content: center;
    .px2rem(width,44);
  }
  .without-extra{
    // .px2rem(margin-right,0) !important;
  }
}

</style>
