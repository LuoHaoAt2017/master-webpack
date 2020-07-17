<template>
  <layout
    title="新建空白应用"
  >
    <div class="new-blank">
      <h1 class="new-blank__title">您可以前往氚云电脑端，自定义搭建符合您业务的应用</h1>
      <p class="new-blank__tips">氚云电脑进入步骤：</p>
      <p class="new-blank__step">1.登录钉钉电脑端</p>
      <p class="new-blank__step">2.进入工作台</p>
      <div class="new-blank__img">
        <img
          class="new-blank__img--bg"
          src="../../assets/img/guide-step1.jpg"
        >
        <img
          class="new-blank__img--layer animate-step1"
          style="top: 25%; left: 0;"
          src="../../assets/img/guide-step1.svg"
        >
      </div>
      <p class="new-blank__step">3.进入氚云电脑端</p>
      <div class="new-blank__img">
        <img
          class="new-blank__img--bg"
          src="../../assets/img/guide-step2.jpg"
        >
        <img
          class="new-blank__img--layer animate-step2"
          style="top: 10%; left: 0;"
          src="../../assets/img/guide-step2.svg"
        >
      </div>
      <p class="new-blank__step">4.进入氚云应用工场</p>
      <div class="new-blank__img">
        <img
          class="new-blank__img--bg"
          src="../../assets/img/guide-step3.jpg"
        >
        <img
          class="new-blank__img--layer animate-step3"
          style="right: 0; top: -5%"
          src="../../assets/img/guide-step3.svg"
        >
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { setTitle, closeApp, openLink } from '@/config/dingtalk-interface';

@Component({
  name: 'NewBlank',
})
export default class NewBlank extends Vue {

}
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #107fff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.new-blank {
  position: absolute;
  .px2rem(top, 0);
  .px2rem(bottom, 0);
  .px2rem(left, 0);
  .px2rem(right, 0);
  .px2rem(padding-top, 40);
  .px2rem(padding-bottom, 40);
  .px2rem(padding-left, 48);
  .px2rem(padding-right, 48);
  overflow: auto;
  background: #fff;
  -webkit-overflow-scrolling: touch;
  &__title {
    color: #333;
    font-weight: 500;
    font-size: 21px;
    .px2rem(line-height, 52);
    .px2rem(padding-bottom, 34);
  }
  &__tips {
    .px2rem(padding-bottom, 34);
    font-size: 13px;
    color: #999;
  }
  &__step {
    .px2rem(padding-bottom, 34);
    font-weight: 500;
    font-size: 15px;
  }
  &__img {
    display: block;
    position: relative;
    width: 100%;
    .px2rem(min-height, 300);
    .px2rem(padding-bottom, 34);
    &--bg {
      width: 100%;
    }
    &--layer {
      position: absolute;
      .px2rem(width, 260);
      opacity: 0;
    }
  }
}
.animate-step1 {
  animation-name: scale;
  animation-iteration-count: 1;
  animation-delay: 0s;
  animation-fill-mode: forwards;
  animation-duration: 1s;
}
.animate-step2 {
  animation-name: scale;
  animation-iteration-count: 1;
  animation-delay: 0.8s;
  animation-fill-mode: forwards;
  animation-duration: 1s;
}
.animate-step3 {
  animation-name: scale;
  animation-iteration-count: 1;
  animation-delay: 1.6s;
  animation-fill-mode: forwards;
  animation-duration: 1s;
}

@keyframes scale {
  from {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
    transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }

  60% {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
    opacity: 1;
  }

  80% {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
    transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
  }

  to {
    -webkit-transform: perspective(400px);
    transform: perspective(400px);
    opacity: 1;
  }
}
</style>
