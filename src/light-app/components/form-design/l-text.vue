<template>
  <div :class="autoDefClass">
    <div
      class="input-box no-user-select"
      :style="{height: height, paddingLeft: paddingLeft, color: options.color}"
    >
      {{options.placeholder}}
      <div class="icon-box icon-left-box">
        <span :class="['icon','h3yun_All',options.icon]"></span>
      </div>
      <div
        class="icon-box icon-right-box"
        v-if="options.rightIcon"
      >
        <span :class="['icon','h3yun_All',options.rightIcon]"></span>
      </div>
      <div
        v-if="options.type === 'textarea'"
        class="textarea-tips no-user-select"
      >
        0/2000
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
import LInput from '../l-input.vue';
import { FormControlType } from '@/light-app/config/form-control-type';
@Component({
  name: 'LText',
  components: {
    LLabel,
    LInput
  }
})
export default class LText extends Vue {
  @Prop()
  data!: any;  // 用户保存提示等内容
  @Prop()
  attrs!: any; // 用户保存控件样式，icon等默认信息
  @Prop()
  className?: string;

  options: any = {
    type: '',
    placeholder: '请输入',
    icon: '',
    rightIcon: '',
    color: ''
  };
  mode = {
    Email: 'mail-o',
    Card: 'id-card-o',
    Telephone: 'mobile'
  };

  formControlType = FormControlType;
  inputClassName: string = '';

  @Watch('attrs')
  attrsChange(newData) {
    this.init(this.data);
  }
  @Watch('data')
  dataChange(newData) {
    this.init(newData);
  }

  created() {
    this.init(this.data);
  }
  init(data) {
    this.options = Object.assign({}, this.options, data);
    if (this.attrs && this.attrs.Mode && this.mode[this.attrs.Mode]) {
      this.options.icon = this.mode[this.attrs.Mode];
    }
  }

  get autoDefClass() {
    return cx('app-text-container', this.className);
  }
  get height() {
    if (this.options.type === 'textarea') {
      return `${162 / 75}rem`;
    } else {
      return `${88 / 75}rem`;
    }
  }
  get paddingLeft() {
    if (this.options.icon) {
      return `${58 / 75}rem`;
    }
    return `${15 / 75}rem`;
  }
}
</script>

<style lang='less' scoped>
@import '~@/light-app/styles/light-app.less';
.app-text-container {
  user-select: none;
  position: relative;
  .px2rem(padding-bottom, 24);
  .input-box {
    position: relative;
    .px2rem(height, 88);
    .px2rem(padding, 22);
    .px2rem(padding-left, 15);
    .px2rem(font-size, 30);
    .px2rem(border-radius, 4);
    color: #ccc;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
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
  .textarea-tips {
    position: absolute;
    .px2rem(right, 15);
    .px2rem(bottom, 15);
  }
}
</style>
