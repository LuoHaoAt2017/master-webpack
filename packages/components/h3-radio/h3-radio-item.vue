<template>
  <list-item :className="wrapCls" :hasExtra="true" :disabled="disabled" :brief="listBrief">
    <h3-radio slot="extra"
      @onFocus="onInnerFocus"
      @onBlur="onInnerBlur"
      @onChange="onInnerChange"
      @onClick="onInnerClick"
      :readOnly="readOnly"
      :disabled="disabled"
      :tabIndex="tabIndex"
      :value="value"
      :wrapLabel="wrapLabel"
      :listBrief="listBrief"
      :returnValue="returnValue"
    ></h3-radio>
    <template slot="brief" v-if="listBrief">
        <slot name="list-item-brief"></slot>
    </template>
    <slot></slot>
  </list-item>
</template>

<script>
import cx from 'classnames';
import h3Radio from './h3-radio';
import ListItem from '../../components/h3-list/h3-list-item';

const prefixCls = 'h3-radio';
export default {
  name: 'h3-radio-item',
  props: {
    className: String,
    defaultChecked: {
      type: [Number, Boolean],
      default: false,
    },
    checked: {
      type: [Number, Boolean],
    },
    disabled: Boolean,
    tabIndex: String,
    readOnly: {
      type: Boolean,
      default: false,
    },
    value: String,
    wrapLabel: {
      type: Boolean,
      default: true,
    },
    returnValue: String,
    listBrief: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    h3Radio,
    ListItem,
  },
  watch: {
    innerValue(curVal) {
      this.innerValue = curVal;
    },
  },
  data() {
    return {
      innerValue: this.returnValue,
    };
  },
  methods: {
    onInnerClick() {
      this.$emit('onClick', this.innerValue);
    },
    onInnerFocus() {
      this.$emit('onFocus', this.innerValue);
    },
    onInnerBlur() {
      this.$emit('onBlur', this.innerValue);
    },
    onInnerChange(val) {
      this.innerValue = val;
      this.$emit('onChange', this.innerValue);
    },
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}-item`, this.className, {
        [`${prefixCls}-item-disabled`]: this.disabled === true,
      });
    },
    innerCheck() {
      return this.value === this.returnValue;
    },
  },
};
</script>
<style>

.h3-list-item.h3-radio-item .h3-list-line .h3-list-content {
    text-overflow:unset !important;
    white-space: normal !important;
    padding-right: 17px;
    font-size: 17px;
    line-height: 25px;
    padding-top: 10px;
    padding-bottom: 10px;
}
.h3-list-item.h3-radio-item {
  min-height: 45px;
}
</style>

