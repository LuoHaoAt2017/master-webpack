<template>
<div :class="fakeInputContainerCls">
  <div v-show="!innerValue" class="fake-input-placeholder">{{placeholder}}</div>
  <div
    :class="fakeInputCls"
    @click="onFakeInputClick($event)"
    ref="fakeInput">
    {{innerValue}}
  </div>
   <custom-keyboard
        @update:value="onKeyboardClick"
        :confirmLabel="confirmLabel"
        :showKeyboard="showKeyboard"
  />
</div>
</template>

<script>
import cx from 'classnames';
import customKeyboard from './h3-custom-keyboard';

const keyboardPrefixCls = 'h3-number-keyboard';
export default {
  name: 'h3-custominput',
  components: {
    customKeyboard,
  },
  props: {
    h3style: {
      type: Object,
      default() {
        return {};
      },
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    readonly: Boolean,
    value: {
      default: '',
    },
    confirmLabel: {
      type: String,
      default: '确定',
    },
    moneyKeyboardAlign: {
      type: String,
      default: 'right',
    },
    onChange: {
      type: Function,
    },
    onFocus: {
      type: Function,
    },
    onBlur: {
      type: Function,
    },
    isToKBit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputRef: null,
      innerFocus: false,
      showKeyboard: false,
      innerValue: this.value,
      KeyboardItemClass: '',
    };
  },
  methods: {
    onFakeInputClick(e) {
      if (this.disabled || !this.editable || this.readonly) {
        return;
      }
      // 计算高度
      const rect = e.target.getBoundingClientRect();
      let screenHeight = document.body.clientHeight;
      if (screenHeight > document.documentElement.clientHeight
          && document.documentElement.clientHeight > 0) {
        screenHeight = document.documentElement.clientHeight;
      }
      const elementToBottom = screenHeight - rect.bottom;
      if (elementToBottom < 200) {
        document.body.scrollTop += (208 - elementToBottom);
        document.documentElement.scrollTop += (208 - elementToBottom);
      }
      this.inputRef = e.target;
      this.inputFocus();
    },
    addBlurListener() {
      document.addEventListener('click', this.doBlur, false);
    },
    removeBlurListener() {
      document.removeEventListener('click', this.doBlur, false);
    },
    doBlur(ev) {
      if (!this.$el.contains(ev.target) && ev.target.className.indexOf('h3-number-keyboard-item') < 0) {
        this.onInputBlur(this.innerValue);
      }
    },
    inputFocus() {
      this.onInputFocus();
    },
    onInputFocus() {
      this.innerFocus = true;
      this.showKeyboard = true;
      const that = this;
      setTimeout(() => {
        that.addBlurListener();
      }, 1);
      this.$emit('onFocus', this.innerValue);
    },
    onInputBlur(value) {
      console.log('h3-money-input blur......2');
      this.innerFocus = false;
      this.showKeyboard = false;
      this.$emit('onBlur', value);
      const that = this;
      setTimeout(() => {
        that.removeBlurListener();
      }, 1);
    },
    onKeyboardClick(KeyboardItemValue) {
      this.showKeyboard = true;
      let valueAfterChange;
      const maxLength = 16;
      const tempValue = this.innerValue || '';
      const calValue = tempValue + KeyboardItemValue;
      // 删除键
      if (KeyboardItemValue === 'delete') {
        valueAfterChange = tempValue.substring(0, tempValue.length - 1);
        // 确认键
      } else if (KeyboardItemValue === 'confirm') {
        valueAfterChange = tempValue;
        if (this.isToKBit) {
          valueAfterChange = this.numToKbit(valueAfterChange);
        }
        this.onInputBlur(tempValue);
        // 收起键
      } else if (KeyboardItemValue === 'hide') {
        valueAfterChange = tempValue;
        this.onInputBlur(valueAfterChange);
      } else if (maxLength !== undefined && maxLength >= 0 && (calValue).length > maxLength) {
        valueAfterChange = (calValue).substr(0, maxLength);
      } else {
        valueAfterChange = calValue;
      }
      this.innerValue = valueAfterChange;
      this.$emit('onChange', this.innerValue);
    },
    clearInput() {
      this.innerValue = '';
    },
    // 转成千分位
    numToKbit(nums) {
      let num = nums;
      num = (num || 0).toString();
      let result = '';
      const temp = num;
      if (Number.isNaN(Number(num))) return 0;
      const numStr = `${num}`;
      const potIndex = numStr.indexOf('.');
      let decimal = '';
      if (potIndex > -1) {
        num = numStr.slice(0, potIndex);
        decimal = numStr.slice(potIndex);
      }
      num = parseInt(num, 10);
      let negative = false; // 负数
      if (parseFloat(temp) < 0) {
        negative = true;
        num = `${Math.abs(num)}`;
      }
      num += '';
      while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
      }
      if (num) {
        result = num + result;
      }
      if (potIndex > -1) {
        result += decimal;
      } else {
        // result += '.00';
      }
      if (negative) {
        result = `-${result}`;
      }
      return result;
    },
  },
  computed: {
    fakeInputContainerCls() {
      return cx('fake-input-container', {
        'fake-input-container-left': this.moneyKeyboardAlign === 'left',
      });
    },
    fakeInputCls() {
      return cx('fake-input', {
        focus: this.innerFocus,
        'fake-input-disabled': this.disabled,
        'fake-input-content': this.innerValue && this.innerValue.length > 0,
      });
    },
    keyboardWrapCls() {
      return this.innerFocus ? '' : `${keyboardPrefixCls}-wrapper-hide`;
    },
    KeyboardItemCls() {
      return this.innerValue === '' ? `${keyboardPrefixCls}-item-disabled` : '';
    },
  },
  watch: {
    value(curVal) {
      // alertalert('money-input');
      // alert(curVal);
      this.innerValue = curVal;
      this.$emit('onChange', curVal);
    },
  },
};
</script>

<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';
@import '../../styles/h3-ui/h3-custom-keyboard';
</style>

