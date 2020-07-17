<template>
  <div :class="autoDefClass">
    <div class="input-control-box">
      <div
        class="icon-box"
        v-if="icon"
      >
        <span :class="['icon','h3yun_All',icon]"></span>
      </div>
      <div
        class="icon-right-box"
        v-if="expand"
      >
        <span class="icon h3yun_All right-o"></span>
      </div>
      <div @click="focus">
        <textarea
          ref="textarea"
          :class="{'error': errorMsg}"
          :disabled="disabled"
          :placeholder="placeholder"
          v-model.trim="inputValue"
          :readonly="readonly"
          :maxlength="maxLength"
          :id="id"
          @input="change"
          @blur="handleblur($event)"
          @focus="handleFocus($event)"
          @click="handleClick($event)"
        />
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
import { filterEmojiExp } from '@/light-app/config/const';
@Component({
  name: 'LInput'
})
export default class LInput extends Vue {
  @Prop({ default: '' })
  value!: string;
  @Prop({ default: '请输入' })
  placeholder!: string;
  @Prop({ default: 'text' })
  type!: string;
  @Prop({ default: false })
  disabled!: boolean;
  @Prop({ default: false })
  readonly!: boolean;
  @Prop({ default: false })
  expand!: boolean;
  @Prop({ default: '' })
  errorMsg!: string;
  @Prop({ default: true })
  required?: boolean;
  @Prop({ default: 32 })
  maxLength?: number;
  @Prop()
  id?: string;
  @Prop()
  validate?: Function;
  @Prop()
  icon?: string;
  @Prop()
  className?: string;

  $refs: {
    textarea: HTMLElement;
  };

  inputValue: any = this.value;
  valid?: boolean = true;

  @Watch('value')
  valueChange(newValue) {
    this.inputValue = newValue;
  }
  @Watch('inputValue')
  async inputValueChange(newValue) {
    this.inputValue = await newValue.replace(filterEmojiExp, '');
    this.$emit('input', this.inputValue);
  }
  get autoDefClass() {
    return cx('app-input-container', this.className);
  }

  handleblur(e) {
    const value = e.target.value;
    this.$emit('blur', e);
  }
  change(e) {
    const value = e.target.value;
    const checkInput = /^[\s]{0,}$/.test(value);
    if (checkInput) {
      e.target.value = '';
    }
  }
  handleFocus(e) {
    this.$emit('focus', e);
  }
  handleClick(e) {
    this.$emit('click', e);
  }
  focus() {
    this.$refs.textarea.focus();
  }
}
</script>

<style lang='less' scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.app-input-container {
  .input-control-box {
    position: relative;
    width: 100%;
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
    textarea {
      width: 100%;
      .px2rem(height, 126);
      .px2rem(border-radius, 4);
      .px2rem(line-height, 42);
      .px2rem(font-size, 30);
      padding: 0.26667rem 0.21333rem;
      caret-color: #107ff0;
      color: #333;
      border: 0.02666rem solid #e0e0e0;
      outline-style: none;
      background: #fff;
      box-sizing: border-box;
      overflow: hidden;
      &.error {
        border: 1px solid #d94838;
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
