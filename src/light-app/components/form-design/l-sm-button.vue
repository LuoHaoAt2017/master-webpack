<template>
  <div :class="autoDefClass">
    <div class="button-control-box__sm">
      <span class="icon-box">
        <i class="icon h3yun_All plus-circle"></i>
      </span>
      <span>{{options.text}}</span>
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
  name: 'LSmButton'
})
export default class LSmButton extends Vue {
  @Prop()
  data!: any;
  @Prop()
  className?: string;

  options: any = {
    text: ''
  }
  created() {
    this.options = Object.assign({}, this.options, this.data);
  }

  get autoDefClass() {
    return cx('app-button-container', this.className);
  }
}
</script>

<style lang='less' scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.app-button-container {
  display: flex;
  .button-control-box {
    &__sm {
      display: flex;
      justify-content: center;
      align-items: center;
      .px2rem(width, 226);
      .px2rem(height, 68);
      .px2rem(font-size, 30);
      .px2rem(border-radius, 4);
      .px2rem(margin-bottom, 24);
      border: 1px dashed #e0e0e0;
      box-sizing: border-box;
      color: #333;
      background: #fff;
      .icon-box {
        display: flex;
        align-items: center;
        .px2rem(margin-right, 20);
        color: #b4b7bc;
        .icon {
          .px2rem(font-size, 72)
        }
      }
    }
  }
}
</style>
