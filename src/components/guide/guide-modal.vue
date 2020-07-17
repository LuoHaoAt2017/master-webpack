<template>
  <div class="guide-modal">
    <transition name="fade">
      <div
        class="guide-layer"
        v-if="show"
      ></div>
    </transition>
    <div
      class="install-wrapper"
      v-show="showWrapper"
    >
      <transition name="slide">
        <div
          class="install-card"
          v-if="show"
        >
          <div class="install-card__header">
            <template v-if="type === 'installed'">
              <div class="install__info">
                {{template}}安装成功！
              </div>
              <div class="install__icon">
                <img
                  class="install__icon-img"
                  src="../../assets/img/modal-close.svg"
                  @click="ok"
                >
              </div>
            </template>
            <template v-if="type === 'uninstall'">
              <!-- <div class="install__icon">
                <img
                  class="install__icon-img"
                  src="../../assets/img/system-close.svg"
                >
              </div> -->
              <div class="install__info">
                还没有安装模板
              </div>
            </template>
          </div>
          <div class="install-card__content">
            <!-- <img
          class="content-icon"
          src="../../assets/img/icon-com.svg"
        > -->
            <div class="content-tips">
              <p
                class="content-tips-word"
                v-if="type === 'installed'"
              >
                手机端仅支持数据录入、审批、查看，自定义表单流程请前往氚云电脑端
              </p>
              <p
                class="content-tips-word"
                v-if="type === 'uninstall'"
              >
                您可以前往氚云电脑端，自助搭建符合您的业务应用
              </p>
            </div>
            <div class="content-nav">
              <span class="content-nav-tips">氚云电脑端进入步骤</span>
              <div class="content-nav__steps">
                <div class="item">
                  <img
                    class="item--icon"
                    src="../../assets/img/step1.svg"
                  >
                  <div class="item--word">1.登录钉钉电脑端</div>
                </div>
                <div class="item">
                  <img
                    class="item--icon"
                    src="../../assets/img/step2.svg"
                  >
                  <div class="item--word">2.进入工作台</div>
                </div>
                <div class="item">
                  <img
                    class="item--icon"
                    src="../../assets/img/step3.svg"
                  >
                  <div class="item--word">3.进入氚云电脑端</div>
                </div>
                <div class="item">
                  <img
                    class="item--icon"
                    src="../../assets/img/step4.svg"
                  >
                  <div class="item--word">4.进入应用工场</div>
                </div>

              </div>
            </div>
          </div>
          <!-- <div class="install-card__footer">
            <h3-button
              class="card__footer-btn"
              type="primary"
              @click="ok"
              size="large"
              inline
              style="font-size: 17px;background: #1890FF;"
            >
              我知道了
            </h3-button>
          </div> -->
        </div>
      </transition>
    </div>
  </div>
</template>
<script>

export default {
  name: 'guide-modal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'installed',
    },
    template: {
      type: String,
      default: '',
    },
  },
  watch: {
    show(newVal) {
      if (newVal === true) {
        this.showWrapper = true;
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
    ok() {
      this.$emit('ok');
      const timer = setTimeout(() => {
        this.showWrapper = false;
      }, 250);
      this.$once('hook:deactivated', () => {
        clearTimeout(timer);
      });
    },
  },
};
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #1890ff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.guide-modal {
  .guide-layer {
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
  .install-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    outline: 0;
    z-index: 10000;
  }
  .install-card {
    .px2rem(width, 670);
    .px2rem(border-radius, 10);
    background: #fff;
  }
  .install-card__header {
    display: flex;
    align-items: center;
    .px2rem(padding-top, 35);
    .px2rem(padding-bottom, 35);
    .px2rem(padding-left, 40);
    .px2rem(padding-right, 40);
  }
  .install__icon {
    .px2rem(width, 32);
    .px2rem(height, 32);
    .px2rem(margin-left, 15);
    &-img {
      width: 100%;
    }
  }
  .install__info {
    flex: 1;
    font-size: 15px;
    color: #333;
  }
  .install-card__content {
    display: flex;
    flex-direction: column;
    .px2rem(padding-left, 40);
    .px2rem(padding-right, 40);
  }
  .content-icon {
    .px2rem(width, 337);
    .px2rem(padding-top, 17);
    .px2rem(padding-bottom, 53);
  }
  .content-tips {
    .px2rem(padding-top, 10);
    .px2rem(padding-bottom, 30);
    &-word {
      font-size: 18px;
      color: #333;
      line-height: 1.7;
      font-weight: bold;
    }
  }
  .content-nav {
    &-tips {
      color: #999;
      font-size: 14px;
    }
    &__steps {
      display: flex;
      flex-direction: column;
      align-items: center;
      .px2rem(margin-top, 48);
      .px2rem(margin-left, 56);
      .px2rem(margin-bottom, 20);
      .item {
        position: relative;
        &--icon {
          position: absolute;
          .px2rem(left, -65);
          .px2rem(top, -20);
          .px2rem(width, 100);
          .px2rem(height, 100);
        }
        &--word {
          display: flex;
          align-items: center;
          .px2rem(width, 343);
          .px2rem(height, 62);
          .px2rem(margin-bottom, 72);
          .px2rem(text-indent, 80);
          .px2rem(border-radius, 10);
          background: #f0f8ff;
        }
        &:not(:last-child)::before {
          content: " ";
          position: absolute;
          .px2rem(width, 40);
          .px2rem(height, 112);
          .px2rem(left, -100);
          .px2rem(top, 18);
          background: url("../../assets/img/step-line.svg") no-repeat;
          background-size: contain;
        }
      }
    }
    &__btn {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      background: #f0f8ff;
      .px2rem(width, 562);
      .px2rem(border-radius, 10);
      .px2rem(height, 88);
      .px2rem(margin-bottom, 36);
    }
    &__btn-icon {
      .px2rem(width, 56);
    }
    &__btn-word {
      .px2rem(width, 360);
      font-size: 15px;
      color: @baseThemeColor;
    }
    &__btn-arrow {
      .px2rem(width, 10);
    }
  }
  .install-card__footer {
    display: flex;
    justify-content: center;
    .px2rem(padding-bottom, 58);
    .px2rem(padding-left, 54);
    .px2rem(padding-right, 54);
  }
  .card__footer-btn {
    .px2rem(width, 562);
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
