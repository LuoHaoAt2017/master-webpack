<template>
  <div :class="wrapCls" :style="h3Style">
    <div class="demo-flag" v-if="isDemo">
        <div class="flag-text">示例</div>
    </div>
    <card-header 
      :className="headerClassName" :h3Style="headerStyle" 
      v-if="hasHeaderContent">
      <slot name="headerTitle" slot="title"></slot>
      <slot name="headerExtra" slot="extra"></slot>
    </card-header>

    <card-body 
     :className="bodyCls" @onClickBody="onClickBody" 
     :h3Style="bodyStyle">
      <slot></slot>
    </card-body>

    <card-footer 
      :className="footClassName" :h3Style="footStyle" 
      v-if="hasFooterContent">
      <slot name="footerContent" slot='content'></slot>
    </card-footer>

    <back-drop v-if="hasBackDrop" :height="backDropHeight">
      <slot name='backdrop'></slot>
    </back-drop>   

    <transition name="approve-result">
      <div class="approve-result" v-if="approveResult !==''">
         <img v-if="approveResult ==='agree'" src="../../../src/assets/img/approve.png" />
         <img v-if="approveResult ==='disagree' && instanceApproval !== -1" src="../../../src/assets/img/disApprove.png" />
      </div>
    </transition>
  </div>
</template>
<script>
import cx from 'classnames';
import cardHeader from './h3-card-header.vue';
import cardBody from './h3-card-body.vue';
import cardFooter from './h3-card-footer.vue';
import backDrop from '../h3-button-icon/h3-back-drop.vue';

const prefixCls = 'h3-card';
export default {
  name: 'h3-card',
  components: {
    cardBody,
    cardFooter,
    cardHeader,
    backDrop,
  },
  props: {
    // card本身
    approveResult: {
      type: String,
      default: '',
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
    full: Boolean,
    className: String,
    onClick: Function,
    h3Style: Object,
    // 头部 插槽有 title 和 extra 两个
    headerClassName: String,
    headerStyle: Object,
    headerBadge: {
      type: Boolean,
      default: false,
    },
    // body 插槽有 一个默认插槽
    bodyClassName: String,
    bodyStyle: Object,
    hasBodyContent: {
      type: Boolean,
      default: true,
    },
    // footer 插槽有 一个默认插槽
    footClassName: String,
    footStyle: Object,
    // 遮罩 插槽有 一个默认插槽
    backDropHeight: String,
    showBackDrop: {
      type: Boolean,
      default: false,
    },
    hasLine: {
      type: Boolean,
      default: false,
    },
    instanceApproval: Number,
  },
  data() {
    return {
    };
  },
  methods: {
    onClickBody() {
      this.$emit('onClickBody'); // 监听点击body区域的事件
    },
  },
  computed: {
    wrapCls() {
      return cx(prefixCls, this.className, {
        [`${prefixCls}-line`]: this.hasLine,
        [`${prefixCls}-full`]: this.full,
      });
    },
    bodyCls() {
      return cx(this.bodyClassName, {
        [`${prefixCls}-body-null`]: !this.hasBodyContent,
      });
    },
    hasHeaderContent() {
      return this.$slots.headerTitle;
    },
    hasFooterContent() {
      return this.$slots.footerContent;
    },
    hasBackDrop() {
      return this.$slots.backdrop && this.showBackDrop;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';
@import '../../styles/h3-ui/h3-card';

.demo-flag {
  position: absolute;
  top: 0;
  right: 0;
  .px2rem(height, 120);
  .px2rem(width, 120);
  z-index: 1000;
  overflow: hidden;
  .flag-text {
    color: #fff;
    background-color: #107fff;
    .px2rem(width, 170);
    .px2rem(height, 42.5);
    .px2rem(line-height, 42.5);
    .px2rem(margin-top, -42.5);
    text-align: center;
    // translateX : -25 -25/75 = .3333rem
    // translateY : (120 - 42.5)/2/75 = .516666rem
    // transform: rotate(0) translate(-.3333rem .516666rem);
    transform: rotate(45deg);
    transform-origin: 0% 100%;
  }
}

.approve-result{
  position: absolute;
  .px2rem(top, 24);
  .px2rem(right, 24);
  .px2rem(width, 113);
  .px2rem(height, 91);
  z-index: 12;
   img {
    width: 100%;
    height: 100%;
  }
}
.approve-result-enter-active{
  transition: result-bounce-in 1s;
}
.approve-result-leave-active{
  transition: result-bounce-in 1s reverse;
}
@keyframes result-bounce-in{
  0%{
    transform: scale(0)
  }
  50%{
    transform: scale(1.5)
  }
  100%{
    transform: scale(1)
  }
}
</style>


