<template>
  <div :class="wrapperCls" v-show="showKeyboard">
      <table>
        <tbody>
          <tr>
            <td :class="keybordItemCls" @click="onKeyboardClick($event,1)">1</td>
            <td :class="keybordItemCls" @click="onKeyboardClick($event,2)">2</td>
            <td :class="keybordItemCls" @click="onKeyboardClick($event,3)">3</td>
            <td :class="keyboardDeleteCls" @click="onKeyboardClick($event,'delete')" rowspan="2"></td>
          </tr>
          <tr>
            <td :class="keybordItemCls" @click="onKeyboardClick($event,4)">4</td>
            <td :class="keybordItemCls" @click="onKeyboardClick($event,5)">5</td>
            <td :class="keybordItemCls" @click="onKeyboardClick($event,6)">6</td>
          </tr>
          <tr>
            <td :class="keybordItemCls" @click="onKeyboardClick($event,7)">7</td>
            <td :class="keybordItemCls" @click="onKeyboardClick($event,8)">8</td>
            <td :class="keybordItemCls" @click="onKeyboardClick($event,9)">9</td>
            <td :class="keyboardConfirmCls" @click="onKeyboardClick($event,'confirm')" rowspan="2">{{confirmLabel}}</td>
          </tr>
          <tr>
            <td :class="keybordItemCls" @click="onKeyboardClick($event,0)">0 </td>
            <td :class="keybordItemCls" @click="onKeyboardClick($event,'.')">.</td>
            <td :class="keyboardHideCls" @click="onKeyboardClick($event,'hide')" ></td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
import cx from 'classnames';

const prefixCls = 'h3-number-keyboard';
export default {
  name: 'h3-number-keyboard',
  props: {
    showKeyboard: {
      type: Boolean,
      default: false,
    },
    confirmLabel: {
      type: String,
      default: '确定',
    },
    confirmDisabled: false,
    confirmkeybordItem: null,
    disabled: false,
  },
  data() {
    return {};
  },
  methods: {
    onKeyboardClick(e, value) {
      if (value === 'confirm' && this.confirmDisabled) {
        return;
      }
      this.$emit('update:value', value);
    },
    renderKeyboard() {
      let keyboardContainer = document.getElementById('h3-custom-keyboard-container');
      if (this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
      if (keyboardContainer) {
        const childNodes = keyboardContainer.childNodes;
        for (let i = 0; i < childNodes.length; i += 1) {
          keyboardContainer.removeChild(childNodes[i]);
        }
        keyboardContainer.appendChild(this.$el);
      } else {
        keyboardContainer = document.createElement('div');
        keyboardContainer.id = 'h3-custom-keyboard-container';
        document.body.insertAdjacentElement('beforeend', keyboardContainer);
        keyboardContainer.appendChild(this.$el);
      }
    },
  },
  computed: {
    keybordItemCls() {
      return `${prefixCls}-item`;
    },
    wrapperCls() {
      return cx(`${prefixCls}-wrapper`, {
        [`${prefixCls}-wrapper-hide`]: !this.showKeyboard,
      });
    },
    keyboardDeleteCls() {
      return `${prefixCls}-item keyboard-delete`;
    },
    keyboardConfirmCls() {
      return `${prefixCls}-item keyboard-confirm`;
    },
    keyboardHideCls() {
      return `${prefixCls}-item keyboard-hide`;
    },
  },
  watch: {
    showKeyboard(curVal) {
      if (curVal) {
        // this.renderKeyboard();
      }
    },
  },
};
</script>

<style lang="less">
@import "../../styles/mixins";
@import "../../styles/themes/default";
</style>