<template>
  <transition :name="mode">
    <div
      class="step"
      v-show="isCurrent"
    >
      <div class="step__header" v-if="title">
        <!-- <div class="step__number">
          <span class="number__now">{{ stepNumber }}</span>
          <span class="number__cut">/</span>
          <span class="number__total">{{ total }}</span>
        </div> -->
        <div class="step__main">
          <h1 class="main__title">{{ title }}</h1>
          <p class="main__desc">{{ desc }}</p>
        </div>
      </div>
      <div
        class="step__content"
      >
        <slot></slot>
      </div>
    </div>
  </transition>

</template>
<script>
export default {
  name: 'guide-step',
  props: {
    title: {
      type: String,
      default: '标题',
    },
    desc: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      stepNumber: 0,
      total: 1,
      isCurrent: false,
      isReverse: false,
    };
  },
  computed: {
    mode() {
      if (this.isReverse) {
        return 'h3-slide-out';
      }
      return 'h3-slide-in';
    },
  },
  methods: {

  },
};
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #1890ff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.step {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.step__header {
  display: flex;
  align-items: flex-start;
  .px2rem(padding-top, 46);
  .px2rem(padding-bottom, 46);
  .px2rem(padding-left, 40);
  .px2rem(padding-right, 40);
  .step__number {
    display: flex;
    align-items: baseline;
    .px2rem(padding-right, 5);
    .px2rem(width, 90);
    .number__now {
      font-size: 24px;
      color: @baseThemeColor;
    }
    .number__cut {
      font-size: 20px;
      color: #666;
    }
    .number__total {
      font-size: 18px;
      color: #666;
    }
  }
  .step__main {
    flex: 1;
    .main__title {
      font-size: 24px;
      color: #333;
    }
    .main__desc {
      font-size: 14px;
      color: #666;
    }
  }
}
.step__content {
  flex: 1;
  overflow: auto;
}
.step__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  .px2rem(height, 82);
  .px2rem(padding-left, 32);
  .px2rem(padding-right, 32);
}
.step__btn {
  display: flex;
  align-items: center;
  .icon-next3 {
    color: @baseThemeColor;
    &.disabled {
      color: #999;
    }
  }
  &--prev {
    .icon-next3 {
      transform: rotate(180deg);
    }
  }
  &-word {
    color: @baseThemeColor;
    font-size: 15px;
  }
  &-word--disabled {
    color: #999;
  }
}
.h3-slide-out-enter-active,
.h3-slide-out-leave-active,
.h3-slide-in-enter-active,
.h3-slide-in-leave-active {
  will-change: transform;
  transition: all 0.15s ease-in;
}
.h3-slide-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.h3-slide-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.h3-slide-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.h3-slide-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
