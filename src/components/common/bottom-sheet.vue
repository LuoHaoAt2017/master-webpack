<template>
  <div class="bottom-sheet">
    <transition name="fade">
      <div
        class="bottom-sheet__layer"
        v-if="show"
      ></div>
    </transition>
    <div
      class="bottom-sheet__wrapper"
      v-show="showWrapper"
      @click.self="close"
    >
      <transition name="slide">
        <div
          class="bottom-sheet__card"
          v-if="show"
        >
          <div class="card__title">
            <span class="card__title-name">{{ title }}</span>
            <img
              class="card__title-img"
              src="../../assets/img/modal-close.svg"
              @click="close"
            >
          </div>
          <div class="card__body">
            <slot></slot>
          </div>
          <div class="card__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  name: 'bottom-sheet',
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    title: {
      type: String,
      required: true,
      default: '弹窗标题',
    }
  },
  watch: {
    show(newVal) {

      if (newVal === true) {
        this.showWrapper = true;
      } else {
        // const timer = setTimeout(() => {
        this.showWrapper = false;
        // }, 250);
        // this.$once('hook:deactivated', () => {
        //   clearTimeout(timer);
        // });
      }
    },
  },
  data() {
    return {
      showWrapper: this.show ? true : false,
    };
  },
  created() {

  },
  methods: {
    close() {
      const timer = setTimeout(() => {
        this.showWrapper = false;
      }, 250);
      this.$once('hook:deactivated', () => {
        clearTimeout(timer);
      });
      this.$emit('close');
    },
    beforeRouteLeave(to, from, next) {
      // 发现在没有关闭弹窗跳转路由在返回后，会有一层透明的bottomsheet阻碍点击
      this.showWrapper = false;
      this.show = false;
    }
  },
};
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #1890ff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.bottom-sheet {
  &__layer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  }
  &__wrapper {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    outline: 0;
    z-index: 10000;
    -webkit-overflow-scrolling: touch;
  }
  &__card {
    width: 100%;
    border-radius: 14px 14px 0 0;
    .px2rem(padding-bottom, 36);
    background: #fff;
  }
  .card__title {
    position: relative;
    .px2rem(margin-left, 20);
    .px2rem(margin-right, 20);
    .px2rem(height, 100);
    .px2rem(line-height, 100);
    border-bottom: 1px solid #ebedf2;
    &-name {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      .px2rem(font-size, 34);
      font-family: PingFangSC-Medium;
      color: #000;
      max-width: 80%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &-img {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      .px2rem(right, 10);
      .px2rem(width, 36);
    }
  }
  .card__body {
    .px2rem(max-height, 770);
    .px2rem(padding-left, 20);
    .px2rem(padding-right, 20);
    .px2rem(padding-top, 18);
    .px2rem(padding-bottom, 18);
    overflow-y: auto;
  }
  .card__footer {
    .px2rem(padding-left, 20);
    .px2rem(padding-right, 20);
    // .px2rem(padding-top, 8);
    // .px2rem(padding-bottom, 48);
  }
}
.fade-enter-active {
  transition: all 0.25s ease-in;
}
.fade-leave-active {
  transition: all 0.25s ease-out 0.05s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: all 0.25s ease-in 0.05s;
}
.slide-leave-active {
  transition: all 0.25s ease-out;
}
.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translate3d(0, 100%, 0);
}
</style>
