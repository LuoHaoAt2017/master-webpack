<template>
  <div :class="autoDefClass">
    <div
      class="app-label-box"
      v-if="title"
    >
      <label
        class="app-label__title"
        :class="{'required': required }"
      >{{title}}</label>
      <div
        v-if="expand"
        @click.stop="toogle"
      >
        <span
          class="icon h3yun_All down-o"
          :class="{ 'right-o': !isExpand}"
        ></span>
      </div>
    </div>
    <div class="app-label__content" style="user-select:none;">
      <slot></slot>
    </div>
  </div>
</template>

<script lang='ts'>
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import cx from 'classnames';
@Component({
  name: 'LLabel'
})
export default class LLabel extends Vue {
  @Prop()
  title!: string;
  @Prop({ default: true })
  required?: boolean;
  @Prop({default: false})
  expand?: boolean;
  @Prop()
  className?: string;

  isExpand: boolean = false;

  get autoDefClass() {
    return cx('app-label-container', this.className);
  }
  toogle() {
    this.isExpand = !this.isExpand;
    this.$emit('handleExpand', this.isExpand);
  }
}
</script>

<style lang='less' scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.app-label-container {
  .app-label-box {
    display: flex;
    justify-content: space-between;
    .px2rem(padding-bottom, 10);
    .px2rem(line-height, 46);
    .app-label__title {
      .px2rem(font-size, 30);
      color: #333;
      font-family: PingFangSC-Medium;
      &.required::before {
        display: inline-block;
        .px2rem(margin-right, 8);
        .px2rem(font-size, 28);
        color: #d94838;
        line-height: 1;
        content: '*';
        vertical-align: middle;
      }
    }
    .icon {
      .px2rem(font-size, 32);
       color: #93979d;
       vertical-align: sub;
    }
  }
}
</style>
