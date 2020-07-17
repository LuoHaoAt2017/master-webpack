<template>
  <layout title="氚云">
  <div class="intro-home-wrapper">
    <div class="intro-home-title">Hello，欢迎来到氚云</div>
    <div class="intro-home-desc">
      <p>氚云是企业数字化云管理平台</p>
      <p>能够帮你轻松实现业务在线、协同办公、数据分析</p>
    </div>
    <div class="intro-home-img">
      <img src="../../assets/img/intro/intro-home.svg" alt="" />
    </div>
    <h3-button type="primary">开启您的氚云之旅</h3-button>
  </div>
  </layout>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Emit, Watch, Mixins } from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { H3Button } from '@h3/thinking-ui';
/**
 * 新用户欢迎首页
 * 2020-04-21
 * @author guosha
 */
@Component({
  name: 'IntroHome',
  components: {
    H3Button,
  }
})

export default class IntroHome extends Vue {
}
</script>

<style lang='less' scoped>
@import '../../styles/light-app.less';
.intro-home {
  &-wrapper {
    width: 100vw;
    height: 100vh;
    text-align: center;
    background: #fff;
    .px2rem(padding, 30);
    .px2rem(padding-top, 96);
    box-sizing: border-box;
  }
  &-title {
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    .px2rem(margin-bottom, 30);
    .px2rem(font-size, 44);
    color: @lightAppPrimaryColor;
  }
  &-desc {
    color: #666;
    .px2rem(margin-bottom, 80);
    .px2rem(font-size, 24);
  }
  &-img {
    .px2rem(margin-bottom, 96);
    img {
      .px2rem(width, 624);
      .px2rem(height, 624);
    }
  }
}
</style>
