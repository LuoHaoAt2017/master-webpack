<template>
<h3-field :tip="tip" 
  class="h3-radio-item"
  :errMsg="errMsg" 
  :label="title" 
  :showIcon="false"
  :required="required"
  :readOnly="!editable || readonly">
  <div class="h3-radio-item-content">
    <div class="h3-radio-item-label" v-text="displayName"></div>
    <div class="h3-radio-item-control" v-if="editable && !readonly">
      <h3-switch v-if="editable" 
        :disabled="disabled" 
        :platform="platform"
        :color="color" 
        :name="name"
        v-model="innerChecked"
        @onClick="switchClick" 
        @onChange="switchChange">
      </h3-switch>
    </div>
  </div>
</h3-field>
</template>

<script>
// import cx from 'classnames';
import { H3Field } from 'h3-mobile-vue';
import h3Switch from './index';
import h3ListItem from '../h3-list/h3-list-item';

// const prefixCls = 'h3-switch';
export default {
  name: 'h3-switch-item',
  components: {
    H3Field,
    h3Switch,
    h3ListItem,
  },
  props: {
    h3style: {
      type: Object,
    },
    color: {
      type: String,
      default: '',
    },
    name: {
      default: '',
    },
    checked: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    required: Boolean,
    readonly: Boolean,
    onChange: Function,
    platform: {
      type: String,
      default: 'ios',
    },
    onClick: {
      type: Function,
    },
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: [Array, String],
      validator(val) {
        let labelArr = val;
        if (val === '' || val === undefined) {
          return true;
        }
        if (Object.prototype.toString.call(val) === '[object String]') {
          try {
            labelArr = val.split(';');
          } catch (err) {
            console.warn(err);
            return false;
          }
        }
        if (Object.prototype.toString.call(labelArr) !== '[object Array]') {
          return false;
        }
        return labelArr && labelArr.length === 2;
      },
      default() {
        return ['是', '否'];
      },
    },
    tip: String,
    title: String,
    errMsg: String,
  },
  watch: {
    value(curVal) {
      console.log('value changed..............');
      this.innerChecked = curVal;
    },
    innerChecked(val) {
      this.$emit('input', val);
      this.switchChange(val);
    },
  },
  data() {
    return {
      innerChecked: this.checked,
    };
  },
  methods: {
    switchClick(val) {
      this.$emit('onClick', val);
    },
    switchChange(val) {
      this.$emit('onChange', val);
    },
  },
  computed: {
    displayName() {
      let labelArr = this.label;
      if (Object.prototype.toString.call(this.label) === '[object String]') {
        labelArr = this.label.split(';');
      }
      return this.innerChecked ? labelArr[0] : labelArr[1];
    },
  },
};
</script>

<style lang="less">
.h3-radio-item {
  .h3-radio-item-content {
    width: 100%;
    padding-left:0;
    position: relative;
    .h3-radio-item-label {
      display: inline-block;
    }
    .h3-radio-item-control {
      display:inline-block;
      position: absolute;
      right:0.32rem;
      top: -25%;
    }
  }
  .h3-list-item .h3-list-line {
    padding-right:0;
  }
}
</style>
