<template>
  <div :class="autoDefClass">
    <span class="icon-box">
      <i class="icon h3yun_All plus-o"></i>
    </span>
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
  name: 'LButton'
})
export default class LButton extends Vue {
  @Prop()
  data!: any;
  @Prop()
  className?: string;

  options: any = {
    text: ''
  };
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
  .px2rem(padding-bottom, 24);
  box-sizing: border-box;
  color: #333;
  background: #fff;
  .icon-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .px2rem(width, 72);
    .px2rem(height, 72);
    .px2rem(margin-right, 20);
    border-radius: 50%;
    background: #ECEFF2;
    .icon {
      .px2rem(font-size, 32);
      color: #B4B7BC;
    }
  }
}
</style>
