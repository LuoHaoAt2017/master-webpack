<template>
  <div :class="autoDefClass">
    <div v-if="title" class="app-label-box">
      <label :class="{required: required}" class="app-label__title">{{
        title
      }}</label>
      <div class="app-label__extra">
        {{ extraMessage }}
      </div>
    </div>
    <div class="app-label__content" style="user-select:none;">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import cx from 'classnames';
@Component({
  name: 'UserLabel',
})
export default class LLabel extends Vue {
  @Prop()
  title!: string;

  @Prop({ default: true })
  required?: boolean;

  @Prop()
  className?: string;

  @Prop()
  extraMessage!: string;

  get autoDefClass () {
    return cx('app-label-container', this.className);
  }
}
</script>

<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.app-label-container {
  .app-label-box {
    display: flex;
    // justify-content: space-between;
    .px2rem(padding-bottom, 10);
    .px2rem(line-height, 46);
    .app-label__title {
      .px2rem(font-size, 30);
      color: #333;
      font-family: PingFangSC-Medium;
      line-height: 25px;
      padding: 10px 15px 0 0;
      margin-left: 15px;
      font-size: 15px;
      font-weight: 700 !important;
      width: 106px;
      box-sizing: border-box;
      &.required::before {
        display: inline-block;
        .px2rem(margin-right, 8);
        .px2rem(font-size, 28);
        color: #d94838;
        line-height: 1;
        content: "*";
        vertical-align: middle;
      }
    }
    .app-label__extra {
      font-size: 12px;
      line-height: 20px;
      padding: 10px 15px 0 0;
      color: #333;
    }
    .icon {
      .px2rem(font-size, 32);
      color: #93979d;
      vertical-align: sub;
    }
  }
  .app-label__content {
    .px2rem(padding-left, 47);
    .px2rem(padding-top, 10);
    .px2rem(padding-bottom, 10);
  }
}
</style>
