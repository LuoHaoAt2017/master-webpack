<template>
  <div class="default-error-box">
    <img
      src="~@/assets/img/default-error.svg"
      alt="网络错误"
      class="default-error-box__img"
    >
    <span class="default-error-box__tips">出现错误，加载失败</span>
    <span
      class="default-error-box__btn"
      @click="refresh"
    >刷新</span>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Emit, Watch, Mixins } from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
@Component({
  name: 'DefaultError'
})

export default class DefaultError extends Vue {
  refresh() {
    this.$emit('refresh');
  }
}
</script>

<style lang='less' scoped>
@import '~@/light-app/styles/light-app.less';
.default-error-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__tips {
    color: #999;
    .px2rem(font-size, 28);
    .px2rem(margin-top, 23);
  }
  &__btn {
    .px2rem(margin-top, 48);
    .px2rem(width, 270);
    .px2rem(height, 72);
    .px2rem(line-height, 72);
    .px2rem(font-size, 30);
    .px2rem(border-radius, 6);
    color: #fff;
    background: @lightAppPrimaryColor;
  }
  &__img {
    .px2rem(width, 221);
    .px2rem(height, 200);
  }
}
</style>
