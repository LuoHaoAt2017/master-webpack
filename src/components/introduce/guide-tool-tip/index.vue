<template>
  <div
    :class="wrapCls"
    v-if="showSelf"
    @click="hideSelf"
  >
    <div :class="arrowCls"></div>
    <div id="content">{{content}}</div>
    <div class="tip-extra">
      <!-- <template
        v-for="(item,index) in extraBtn"
        v-if="extraBtn.length"
      >
        <span
          class="cut-off-line"
          v-if="item.cutline"
        >|</span>
        <span @click.stop="item.action">{{item.name}}</span>
      </template> -->
      <!-- <span v-if="hasClose">|</span> -->
      <!-- <img
        src="../../../assets/img/icon-write.svg"
        alt=""
      > -->
      <span
        class="h3yun_All close"
        @touchstart="hideSelf"
        v-if="hasClose"
      ></span>
    </div>
  </div>
</template>
<script>
// import cx from 'classnames';

export default {
  name: 'guide-tool-tip',
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
      return `guide-tool-tip ${this.className}`;
    },
    arrowCls() {
      return `arrow arrow-${this.direction}`;
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
@baseFontSize: 75;
@baseThemeColor: rgba(0, 0, 0, 0.7);
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}

.guide-tool-tip {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .px2rem(height, 96);
  .px2rem(line-height, 40);
  letter-spacing: 0;
  // .px2rem(min-width, 630);
  .px2rem(padding-left, 30) !important;
  .px2rem(padding-right, 30) !important;
  .px2rem(border-radius, 6);
  color: #ffffff;
  background: @baseThemeColor;
  .arrow {
    position: absolute;
    width: 0;
    height: 0;
    font-size: 0;
    border: 7px;
    border-style: solid;
    &-left {
      .px2rem(top, 36);
      left: -14px;
      border-color: rgba(255, 255, 255, 0) @baseThemeColor
        rgba(255, 255, 255, 0) rgba(255, 255, 255, 0);
    }
    &-left-top {
      top: -14px;
      .px2rem(left, 50);
      border-color: rgba(255, 255, 255, 0) rgba(255, 255, 255, 0)
        @baseThemeColor rgba(255, 255, 255, 0);
    }
    &-left-bottom {
      bottom: -14px;
      .px2rem(left, 50);
      border-color: @baseThemeColor rgba(255, 255, 255, 0)
        rgba(255, 255, 255, 0) rgba(255, 255, 255, 0);
    }
    &-right {
      right: -14px;
      .px2rem(top, 36);
      border-color: rgba(255, 255, 255, 0) rgba(255, 255, 255, 0)
        rgba(255, 255, 255, 0) @baseThemeColor;
    }
    &-right-top {
      top: -14px;
      .px2rem(right, 25);
      border-color: rgba(255, 255, 255, 0) rgba(255, 255, 255, 0)
        @baseThemeColor rgba(255, 255, 255, 0);
    }
    &-right-bottom {
      bottom: -14px;
      .px2rem(right, 50);
      border-color: @baseThemeColor rgba(255, 255, 255, 0)
        rgba(255, 255, 255, 0) rgba(255, 255, 255, 0);
    }
    &-center-top {
      top: -14px;
      left: 50%;
      margin-left: -7px;
      border-color: rgba(255, 255, 255, 0) rgba(255, 255, 255, 0)
        @baseThemeColor rgba(255, 255, 255, 0);
    }
    &-center-bottom {
      bottom: -14px;
      left: 50%;
      margin-left: -7px;
      border-color: @baseThemeColor rgba(255, 255, 255, 0)
        rgba(255, 255, 255, 0) rgba(255, 255, 255, 0);
    }
  }
  div {
    font-size: 15px;
  }
  .tip-extra {
    display: flex;
    align-items: center;
    .px2rem(width, 31);
    .px2rem(width, 37);
    .px2rem(margin-left, 20);
    img {
      width: 100%;
    }
  }
}
</style>


