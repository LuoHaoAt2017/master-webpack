<template>
  <h3-field 
    :class="wrapCls"
    :tip="tip"
    :errMsg="geterrMsg" 
    :label="title" 
    :showIcon="false"
    :required="required"
    :readOnly="!editable || readonly">
      <div :class="prefixCls+'-content-wraper'" v-text="innerValue" v-if="innerValue"/>
      <div :class="prefixCls+'-placeholder'" v-text="placeholder" v-else/>
  </h3-field>
</template>
<script>
import cx from 'classnames';
import { H3Field } from 'h3-mobile-vue';

// 流水号，关联属性，公式型控件等显示型的控件
export default {
  name: 'h3-property',
  components: {
    H3Field,
  },
  props: {
    prefixCls: {
      type: String,
      default: 'h3-property',
    },
    title: String,
    defaultValue: String,
    value: String,
    disabled: Boolean,
    required: Boolean,
    editable: {
      type: Boolean,
      default: true,
    },
    readonly: Boolean,
    placeholder: {
      type: String,
      default: '系统自动生成',
    },
    onChange: Function,
    layout: {
      type: String,
      default: 'h',
      validator: val => ['h', 'v'].indexOf(val) > -1,
    },
    tip: {
      type: String,
      default: '',
    },
    errMsg: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      innerValue: this.value || this.defaultValue,
    };
  },
  created() {

  },
  mounted() {

  },
  updated() {

  },
  methods: {

  },
  computed: {
    geterrMsg() {
      if (this.editable && !this.readonly) {
        return this.errMsg;
      }
      return '';
    },
    wrapCls() {
      return cx(this.prefixCls, {
        [`${this.prefixCls}-view`]: this.readonly || !this.editable,
      });
    },
  },
  watch: {
    innerValue(val) {
      this.$emit('input', val);
      this.$emit('onChange', val);
      if (this.onChange) {
        this.onChange(val);
      }
    },
    value(val) {
      this.innerValue = val;
    },
  },
};
</script>
<style lang="less">
@prefixCls: h3-property;
@field-label-color: #666666;
@field-text-color: #333333;
@field-label-color-view: #666;
@field-placeholder-color: #999999;

.@{prefixCls} {
  .@{prefixCls}-content-wraper {
     line-height: 24px;
  }
  .@{prefixCls}-placeholder {
    color: @field-placeholder-color;
    font-size: 15px;
  }
  .h3-field {
    background-color: #fff;
  }
}
.@{prefixCls}-view {
  .@{prefixCls}-placeholder {
    color: @field-placeholder-color;
  }
  .h3-field-layout-h-label {
    color: @field-label-color-view;
  }
}
</style>

