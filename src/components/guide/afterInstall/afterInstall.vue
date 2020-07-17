<template>
  <div class="after-install">
    <div class="install-card">
      <div class="install-card__header">
        <template v-if="isSuccess">
          <div class="install__icon">
            <img
              class="install__icon-img"
              src="../../../assets/img/system-complete.svg"
            >
          </div>
          <div class="install__info">
            {{template}}安装成功，您可以：
          </div>
        </template>
        <template v-else>
          <div class="install__icon">
            <img
              class="install__icon-img"
              src="../../../assets/img/system-complete.svg"
            >
          </div>
          <div class="install__info">
            还没有安装模板，您可以：
          </div>
        </template>
      </div>
      <div class="install-card__content">
        <img
          class="content-icon"
          src="../../../assets/img/icon-com.svg"
        >
        <div class="content-tips">
          {{isSuccess ? '去应用工厂修改模板或搭建专属应用' : '去应用工厂搭建专属应用'}}
          <p class="content-tips--nav">
            钉钉电脑端 > 工作台 > 氚云 > 应用工厂
          </p>
        </div>
        <div class="content-nav">
          <div class="content-nav__btn">
            <img
              class="content-nav__btn-icon"
              src="../../../assets/img/icon-moban.svg"
            >
            <p class="content-nav__btn-word">
              模板中心查看更多模板
            </p>
            <img
              class="content-nav__btn-arrow"
              src="../../../assets/img/arrow-right.svg"
            >
          </div>
          <div class="content-nav__btn">
            <img
              class="content-nav__btn-icon"
              src="../../../assets/img/icon-kefu.svg"
            >
            <p class="content-nav__btn-word">
              咨询智能客服
            </p>
            <img
              class="content-nav__btn-arrow"
              src="../../../assets/img/arrow-right.svg"
            >
          </div>
        </div>
      </div>
      <div class="install-card__footer">
        <h3-button
          class="card__footer-btn"
          type="primary"
          @click.native="ok"
          size="large"
          inline
        >
          <span class="tips">我知道了</span>
        </h3-button>
      </div>
    </div>
  </div>
</template>
<script>
import { H3Button } from 'h3-mobile-vue';
export default {
  name: 'after-install',
  props: {
    isSuccess: {
      type: Boolean,
      default: true,
    },
    template: {
      type: String,
      required: true,
      default: '',
    }
  },
  data () {
    return {

    }
  },
  components: {
    H3Button
  },
  methods: {
    ok () {
      this.$emit('ok');
    }
  }
}
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #1890ff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.after-install {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  .px2rem(bottom, 90);
  left: 0;
  z-index: 999;
  width: 100%;
  background: rgba(0, 0, 0, .5);
  .install-card {
    .px2rem(width, 670);
    .px2rem(border-radius, 10);
    background: #fff;
  }
  .install-card__header {
    display: flex;
    align-items: center;
    .px2rem(padding-top, 28);
    .px2rem(padding-bottom, 28);
    .px2rem(padding-left, 33);
    .px2rem(padding-right, 33);
  }
  .install__icon {
    .px2rem(width, 40);
    .px2rem(height, 40);
    .px2rem(margin-right, 15);
    &-img {
      width: 100%;
    }
  }
  .install__info {
    flex: 1;
    font-size: 18px;
    color: #333;
  }
  .install-card__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .content-icon {
    .px2rem(width, 337);
    .px2rem(padding-top, 17);
    .px2rem(padding-bottom, 53);
  }
  .content-tips {
    color: #333;
    font-size: 15px;
    line-height: 1.8;
    text-align: center;
    .px2rem(padding-bottom, 44);
    &--nav {
      color: #999;
      font-size: 12px;
    }
  }
  .content-nav {
    .px2rem(margin-left, 54);
    .px2rem(margin-right, 54);
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
</style>
