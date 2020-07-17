<template>
  <div :class="autoDefClass">
    <div class="gird-control-box">
      <div
        class="gird-control-box__content"
        v-show="isExpand"
      >
        <slot></slot>
      </div>
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
  name: 'LGridView'
})
export default class LGridView extends Vue {
  @Prop()
  className?: string;
  @Prop()
  content!: string;
  @Prop()
  icon!: string;

  isExpand: boolean = true;
  get autoDefClass() {
    return cx('app-gird-container', this.className);
  }

  expand() {
    this.isExpand = !this.isExpand;
  }
}
</script>

<style lang='less' scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.app-gird-container {
  .gird-control-box {
    width: 100%;
    .px2rem(padding-bottom, 30);
    .px2rem(border-radius, 8);
    box-sizing: border-box;
    &__title {
      .px2rem(font-size, 30);
      .px2rem(height, 68);
      .px2rem(line-height, 68);
      color: #222;
    }
    &__icon {
      .px2rem(width, 32);
      .px2rem(height, 32);
      .px2rem(margin-top, 18);
      color: #93979d;
      .close {
        transform: rotateX(45deg);
      }
    }
    &__content {
      .px2rem(border-radius, 8);
      .px2rem(padding, 20);
      padding-bottom: 0;
      box-shadow: 0 0 6px #ebebeb;
    }
  }
}
</style>
