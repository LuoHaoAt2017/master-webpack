<template>
  <div :class="autoDefClass">
    <div class="picture-control-box">
      <div class="icon-box">
        <span class="icon h3yun_All plus-o"></span>
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
  name: 'LPhoto'
})
export default class LPhoto extends Vue {
  @Prop()
  className?: string;
  @Prop()
  content!: string;
  @Prop()
  icon!: string;

  get autoDefClass() {
    return cx('app-picture-container', this.className);
  }
}
</script>

<style lang='less' scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.app-picture-container {
  .px2rem(padding-bottom, 32);
  .picture-control-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .px2rem(width, 144);
    .px2rem(height, 144);
    .px2rem(border-radius, 4);
    background: #eceff2;
    box-sizing: border-box;
    .icon-box {
      .icon {
        .px2rem(font-size, 42);
        color: #b4b7bc;
      }
    }
  }
}
</style>
