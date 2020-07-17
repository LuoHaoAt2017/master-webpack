<template>
  <div :class="wrapCls" :style="h3Style">
    <div :class="contentCls">
      <span v-if="iconType">
          <!-- :onClick="iconAction"
          :h3Style="iconStyle" -->
        <h3-icon
          :size="iconSize" 
          :color="iconColor"
          :type="iconType"
          :className="iconClass">
        </h3-icon>
      </span>
      <span id='title' v-html="title" :class="`title-size title-size-${size}`"></span>
    </div>
    <div :class="extraCls" v-if="hasExtra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>
<script>
import cx from 'classnames';
// import H3Icon from '../h3-icon';
import { H3Icon } from '@h3/thinking-ui';

const prefixCls = 'h3-title';
export default {
  name: 'h3-title',
  components: {
    H3Icon,
  },
  props: {
    className: String,
    h3Style: Object,
    title: String,
    size: {
      type: [String, Number],
      default: 'md',
    },
    iconDirection: {
      type: String,
      default: 'left',
      validator: val => ['left', 'right', 'top', 'bottom'].indexOf(val) > -1,
    },
    iconStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    iconClass: {
      type: String,
    },
    iconType: {
      type: String,
    },
    iconSize: {
      type: [String, Number],
    },
    iconColor: String,
    iconAction: Function,

  },
  data() {
    return {
    };
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`, this.className);
    },
    contentCls() {
      return cx('icon-float', `icon-float-${this.iconDirection}`);
    },
    extraCls() {
      return `${prefixCls} extra`;
    },
    hasExtra() {
      return this.$slots.extra;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
.overflow-ellipsis(){
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.h3-title{ 
  position: relative;
  display: flex;
  // align-items: flex-end;
  align-items: center;
  .px2rem(margin-left,30);
  .px2rem(margin-right,30);
  // .px2rem(margin-top,32);
  // .px2rem(margin-bottom,16);
}
.home{
  .px2rem(margin-top,48);
  .px2rem(margin-bottom,20);
}
.home-swiper{
  .px2rem(margin-top,48);
  .px2rem(margin-bottom,10);
}
.home-swiper-without-dot{
  .px2rem(margin-top,32);
  .px2rem(margin-bottom,10);
}
.icon-float {
  display: flex;
  align-items: center;
  &-top{
    flex-direction: column
  }
  &-left{
    flex-direction: row
  }
  &-right{
    flex-direction: row-reverse
  }
  &-bottom{
    flex-direction: column-reverse
  }
}
.title-size {
  .overflow-ellipsis();
  .px2rem(margin-left,16);
  &-xxs {
    .px2rem(font-size,24);
  }
  &-xs {
    .px2rem(font-size,26);
  }
  &-sm {
    .px2rem(font-size,28);
  }
  &-md {
    .px2rem(font-size,30);
  }
  &-lg {
    .px2rem(font-size, 32);
  }
  &-xl {
    .px2rem(font-size, 34);
  }
}
.extra {
  flex-direction: row-reverse;
  align-self: flex-end;
  flex: 1;
  color: #1890ff;
  margin-top: 0;
  .px2rem(font-size, 30);
  .px2rem(margin-right, 0);
  .px2rem(margin-bottom, 0) !important;
  span{
    .px2rem(font-size, 30);
  }
}
</style>