<template>
  <div class="h3-confirm">
    <h3-dialog
      v-model="showValue"
      :dialog-class="theme === 'android' ? 'h3-dialog h3-skin_android' : 'h3-dialog'"
      :mask-transition="maskTransition"
      :dialog-transition="theme === 'android' ? 'h3-fade' : dialogTransition"
      :hide-on-blur="hideOnBlur"
      :mask-z-index="maskZIndex"
      @on-hide="$emit('on-hide')">
      <div class="h3-dialog__hd" v-if="!!title" :class="{'with-no-content': !showContent}">
        <strong class="h3-dialog__title">{{ title }}</strong>
      </div>
      <template v-if="showContent">
        <div class="h3-dialog__bd" v-if="!showInput">
          <slot><div v-html="content"></div></slot>
        </div>
        <div v-else class="h3-prompt" @touchstart.prevent="setInputFocus">
          <input class="h3-prompt-msgbox" v-bind="inputAttrs" v-model="msg" :placeholder="placeholder" ref="input"/>
        </div>
      </template>
      <div class="h3-dialog__ft">
        <a href="javascript:;" class="h3-dialog__btn h3-dialog__btn_default" v-if="showCancel" @click="onCancel">{{cancelText}}</a>
        <a href="javascript:;" class="h3-dialog__btn" :class="`h3-dialog__btn_${confirmType}`" @click="onConfirm">{{confirmText}}</a>
      </div>
    </h3-dialog>
  </div>
</template>

<script>
import H3Dialog from '../h3-dialog';

export default {
  name: 'h3-confirm',
  components: {
    H3Dialog,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    showInput: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'ios',
    },
    hideOnBlur: {
      type: Boolean,
      default: false,
    },
    title: String,
    confirmText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    maskTransition: {
      type: String,
      default: 'h3-fade',
    },
    maskZIndex: [Number, String],
    dialogTransition: {
      type: String,
      default: 'h3-dialog',
    },
    content: String,
    closeOnConfirm: {
      type: Boolean,
      default: true,
    },
    inputAttrs: Object,
    showContent: {
      type: Boolean,
      default: true,
    },
    confirmType: {
      type: String,
      default: 'primary',
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.showValue = this.show;
    if (this.value) {
      this.showValue = this.value;
    }
  },
  watch: {
    value(val) {
      this.showValue = val;
    },
    showValue(val) {
      this.$emit('input', val);
      if (val) {
        if (this.showInput) {
          this.msg = '';
          setTimeout(() => {
            if (this.$refs.input) {
              this.setInputFocus();
            }
          }, 300);
        }
        this.$emit('on-show'); // emit just after msg is cleared
      }
    },
  },
  data() {
    return {
      msg: '',
      showValue: false,
    };
  },
  methods: {
    setInputValue(val) {
      this.msg = val;
    },
    setInputFocus() {
      this.$refs.input.focus();
    },
    onConfirm() {
      if (!this.showValue) {
        return;
      }
      if (this.closeOnConfirm) {
        this.showValue = false;
      }
      this.$emit('on-confirm', this.msg);
    },
    onCancel() {
      if (!this.showValue) {
        return;
      }
      this.showValue = false;
      this.$emit('on-cancel');
    },
  },
};
</script>

<style lang="less">
@import '../../styles/transition.less';
@import '../../styles/h3-ui/h3-mask';
@import '../../styles/h3-ui/h3-dialog';

.h3-prompt {
  padding-bottom: 1.6em;
}

.h3-prompt-msgbox {
  width: 80%;
  border: 1px solid #dedede;
  border-radius: 5px;
  padding: 4px 5px;
  appearance: none;
  outline: none;
  font-size: 16px;
}
</style>
