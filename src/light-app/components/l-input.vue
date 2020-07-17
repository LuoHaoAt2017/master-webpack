<template>
  <div :class="autoDefClass">
    <div
      class="input-control-box"
      @click="focus"
    >
      <div
        class="icon-box"
        v-if="icon"
      >
        <span :class="['icon','h3yun_All',icon]"></span>
      </div>
      <input
        ref="input"
        :type="type"
        :disabled="disabled"
        :placeholder="placeholder"
        v-model.trim="inputValue"
        :readonly="readonly"
        :maxlength="maxLength"
        :class="{'error': errorMsg}"
        @input="input"
        @blur="handleBlur($event)"
        @focus="handleFocus($event)"
      />
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
import { filterEmojiExp } from '@/light-app/config/const';
@Component({
  name: 'LInput'
})
export default class LInput extends Vue {
  @Prop({ default: '' })
  value!: any;
  @Prop({ default: 88 })
  height!: number;
  @Prop({ default: '请输入' })
  placeholder!: string;
  @Prop({ default: 'text' })
  type!: string;
  @Prop({ default: false })
  disabled!: boolean;
  @Prop({ default: false })
  readonly!: boolean;
  @Prop({ default: 32 })
  maxLength?: number;
  @Prop({ default: true })
  required?: boolean;
  @Prop()
  errorMsg?: string;
  @Prop()
  icon?: string;
  @Prop()
  className?: string;
  @Prop()
  otherOptions?: any;
  
  $refs: {
    input: HTMLElement
  };
  inputValue: any = '';
  valid?: boolean = true;

  created() {
    this.inputValue = this.value;
  }

  @Watch('value')
  valueChange(newValue) {
    this.inputValue = newValue;
  }

  get curHeight() {
    return `${(this.height / 75) * 1}rem`;
  }

  get paddingLeft() {
    return this.icon ? '0.7733rem' : '0.32rem';
  }
  get autoDefClass() {
    return cx('app-input-container', this.className);
  }
  handleBlur(e) {
    this.$emit('input', e.target.value);
    this.$emit('blur', e);
  }
  handleFocus(e) {
    this.$emit('focus', e);
  }
  focus() {
    this.$refs.input.focus();
  }
  input(e) {
    const checkInput = /^[\s]{0,}$/.test(e.target.value);
    if (checkInput) {
      e.target.value = '';
    }
    const value = e.target.value;
    this.inputValue = value.toString().replace(filterEmojiExp, '');
    this.$emit('input', this.inputValue);
    this.$nextTick(() => {
      this.inputValue = this.value;
    })
  }
}
</script>

<style lang='less' scoped>
@import '~@/styles/form-base.less';
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.app-input-container {
  .input-control-box {
    position: relative;
    width: 100%;
    .px2rem(margin-bottom, 8);
    .icon-box {
      position: absolute;
      .px2rem(top, 28);
      .px2rem(left, 12);
      .px2rem(width, 32);
      .px2rem(height, 32);
      color: #b4b7bc;
    }
    .icon-right-box {
      position: absolute;
      .px2rem(top, 28);
      .px2rem(right, 12);
      .px2rem(width, 32);
      .px2rem(height, 32);
      color: #b4b7bc;
    }
    input {
      width: 100%;
      .px2rem(height, 88);
      .px2rem(font-size, 30);
      caret-color: #107ff0;
      padding: 0 0.2133rem;
      outline-style: none;
      .px2rem(border-radius, 4);
      background: #fff;
      box-sizing: border-box;
      border: 1px solid #e0e0e0;
      outline: none;
      -webkit-appearance: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      &.error {
        border: 1px solid #EF503E;
        // &::-webkit-input-placeholder {
        //   color: #d94838;
        // }
        // &:-moz-placeholder {
        //   color: #d94838;
        // }
        // &::-moz-placeholder {
        //   color: #d94838;
        // }
        // &::-ms-input-placeholder {
        //   color: #d94838;
        // }
      }
    }
  }
}
</style>
