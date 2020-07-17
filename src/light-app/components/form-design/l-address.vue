<template>
  <div :class="autoDefClass">
    <div class="address-box">
      <div
        class="input-box"
        style="user-select:none;"
      >
        请选择
        <div class="icon-box icon-right-box">
          <span class="icon h3yun_All right-o"></span>
        </div>
      </div>
      <div
        v-if="attrs.ShowDetailAddr"
        class="input-box bd-top"
        style="user-select:none;"
      >
        请输入详细地址
        <div class="icon-box icon-right-box">
          <span class="icon h3yun_All position-o"></span>
        </div>
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
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import LLabel from '../l-label.vue';
import { FormControlType } from '@/light-app/config/form-control-type';
@Component({
  name: 'LAddress',
  components: {
    LLabel
  }
})
export default class LAddress extends Vue {
  @Prop()
  data!: any;
  @Prop()
  className?: string;
  @Prop()
  attrs!: any;

  formControlType = FormControlType;

  get autoDefClass() {
    return cx('app-text-container', this.className);
  }
}
</script>

<style lang='less' scoped>
@import '~@/light-app/styles/light-app.less';
.app-text-container {
  .px2rem(padding-bottom, 24);
}
.address-box {
  .px2rem(border-radius, 4);
  color: #ccc;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  .input-box {
    position: relative;
    .px2rem(font-size, 30);
    .px2rem(height, 88);
    .px2rem(padding, 22);
    .px2rem(padding-left, 15);
    box-sizing: border-box;
  }
}
.icon-box {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #b4b7bc;
}
.icon-left-box {
  .px2rem(left, 15);
  .px2rem(font-size, 28);
}
.icon-right-box {
  .px2rem(right, 15);
  .px2rem(font-size, 32);
}
</style>
