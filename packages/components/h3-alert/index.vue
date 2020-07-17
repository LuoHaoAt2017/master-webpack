<template>
  <div class="vux-alert">
    <h3-dialog
    v-model="showValue"
    :mask-transition="maskTransition"
    :dialog-transition="dialogTransition"
    :hide-on-blur="hideOnBlur"
    :mask-z-index="maskZIndex"
    @on-hide="$emit('on-hide')"
    @on-show="$emit('on-show')">
      <div class="h3-dialog__hd">
        <strong class="h3-dialog__title">{{title}}</strong>
      </div>
      <div class="h3-dialog__bd">
        <slot>
          <div v-html="content"></div>
        </slot>
      </div>
      <div class="h3-dialog__ft">
        <a href="javascript:;"
        class="h3-dialog__btn h3-dialog__btn_primary"
        @click="onHide">{{buttonText}}</a>
      </div>
    </h3-dialog>
  </div>
</template>

<script>
import H3Dialog from '../h3-dialog';

export default {
  name: 'h3-alert',
  components: {
    H3Dialog,
  },
  created() {
    if (typeof this.value !== 'undefined') {
      this.showValue = this.value;
    }
  },
  props: {
    value: Boolean,
    title: String,
    content: String,
    buttonText: {
      type: String,
      default: '确定',
    },
    hideOnBlur: {
      type: Boolean,
      default: false,
    },
    maskTransition: {
      type: String,
      default: 'h3-mask',
    },
    dialogTransition: {
      type: String,
      default: 'h3-dialog',
    },
    maskZIndex: [Number, String],
  },
  data() {
    return {
      showValue: false,
    };
  },
  methods: {
    onHide() {
      this.showValue = false;
    },
  },
  watch: {
    value(val) {
      this.showValue = val;
    },
    showValue(val) {
      this.$emit('input', val);
    },
  },
};
</script>

<style lang="less">
@import '../../styles/transition.less';
@import '../../styles/h3-ui/h3-mask';
@import '../../styles/h3-ui/h3-dialog';
</style>
