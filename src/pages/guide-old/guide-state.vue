<template>
  <div class="after-install">
    <!-- <x-header
      v-if="!$store.state.corpId"
      :left-options="{preventGoBack:true}"
      @on-click-back="goBack()"
    >
      氚云
    </x-header> -->
    <layout
    title="氚云"
    :left-options="{preventGoBack:true}"
    @on-click-back="goBack"
    >
    <div class="install-card">
      <div class="install-card__header">
        <template v-if="guideState === 'installed'">
          <!-- <div class="install__icon">
            <img
              class="install__icon-img"
              src="../../assets/img/system-complete.svg"
            >
          </div> -->
          <div class="install__info">
            {{template}}安装成功
          </div>
        </template>
        <template v-if="guideState === 'uninstall'">
          <!-- <div class="install__icon">
            <img
              class="install__icon-img"
              src="../../assets/img/system-warning.svg"
            >
          </div> -->
          <div class="install__info">
            您还没有安装模板
          </div>
        </template>
        <template v-if="guideState === 'finished'">
          <div class="install__icon">
            <img
              class="install__icon-img"
              src="../../assets/img/system-complete.svg"
            >
          </div>
          <div class="install__info">
            您已成功录入一条数据，如表单内容不符合您的使用场景，您可以：
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
            v-if="guideState === 'installed'"
          >
            如模板不符合您的业务场景，请前往氚云电脑端进行修改
          </p>
          <p
            class="content-tips-word"
            v-if="guideState === 'uninstall'"
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
      <div class="install-card__footer">
        <div class="next">
          <span
            @click="goToApp"
            class="next--word"
          >进入首页</span>
          <i class="h3yun_All right-o"></i>
        </div>
        <!-- <h3-button
          class="card__footer-btn"
          type="primary"
          @click.native="goToApp"
          size="large"
          inline
          style="font-size: 17px;background: #1890FF;"
        >
          开始使用
        </h3-button> -->
      </div>
    </div>
    </layout>
  </div>
</template>
<script>
// import H3Button from '../../../packages/components/h3-button';
import guideModal from '../../components/guide/guide-modal';
import { closeApp, hideRightMenu } from '../../config/dingtalk-interface';

export default {
  name: 'guide-state',
  data() {
    return {
      guideState: 'uninstall',
      template: '',
      params: '',
      testShow: true,
    };
  },
  created() {
    const params = this.$route.params;
    if (params.guideState) {
      this.params = params;
      this.guideState = params.guideState;
      this.template = params.name;
    }
  },
  activated() {
  },
  components: {
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'apps',
      });
    },
    goToApp() {
      this.$router.push({
        name: this.guideState === 'uninstall' ? 'home' : 'apps',
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
.after-install {
  width: 100%;
  height: 100%;
  .install-card {
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: auto;
  }
  .install-card__header {
    display: flex;
    align-items: center;
    .px2rem(padding-left, 48);
    .px2rem(padding-right, 48);
    .px2rem(padding-top, 13);
    .px2rem(padding-bottom, 13);
    background: #f0f8ff;
  }
  .install__icon {
    .px2rem(width, 40);
    .px2rem(height, 40);
    .px2rem(margin-right, 15);
    &-img {
      width: 100%;
      animation: scale 0.3s cubic-bezier(0.51, 1.36, 0.44, 1.1) 1;
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
    .px2rem(padding-left, 48);
    .px2rem(padding-right, 48);
  }
  .content-icon {
    .px2rem(width, 337);
    .px2rem(padding-top, 17);
    .px2rem(padding-bottom, 53);
  }
  .content-tips {
    .px2rem(padding-top, 65);
    .px2rem(padding-bottom, 30);
    &-word {
      font-size: 21px;
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
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    .px2rem(bottom, 56);
    .px2rem(height, 82);
    .px2rem(padding-left, 32);
    .px2rem(padding-right, 32);
    color: @baseThemeColor;
  }
  .next--word {
    font-size: 15px;
  }
  .card__footer-btn {
    .px2rem(width, 562);
  }
}
.a-layer-enter-active {
  transition: all 0.1s ease-in;
}
.a-layer-leave-active {
  transition: all 0.2s ease-in;
}
.a-layer-enter {
  opacity: 0;
}
.a-layer-leave-active {
  opacity: 0;
}

.a-card-enter-active,
.a-card-leave-active {
  transition: scale 0.2s ease-in;
}
.a-card-enter {
  transform: scale(0.8);
  opacity: 0;
}
.a-card-leave-active {
  opacity: 0;
  transform: scale(0.8);
}
@keyframes scale {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
