<template>
  <label :class="wrapClasses">
    <input type="checkbox" 
      :class="inputClass" 
      v-model="innerChecked" 
      :disabled="disabled" 
      :platform="platform" 
      v-on:click="onSwitchClick($event)" 
      v-on:change="onSwitchChange($event)" />
    <div v-bind:style="computedstyle" :class="fackInputCls"></div>
  </label>
</template>

<script>
import cx from 'classnames';

const prefixCls = 'h3-switch';
export default {
  name: 'h3-switch',
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
  },
  watch: {
    value(curVal) {
      console.log('value changed..............');
      this.innerChecked = curVal;
    },
    innerChecked(val) {
      this.$emit('input', val);
      this.onSwitchChange(val);
    },
  },
  data() {
    return {
      innerChecked: this.value,
    };
  },
  methods: {
    onSwitchClick() {
      if (this.disabled) {
        return;
      }
      this.$emit('onClick', this.innerChecked);
    },
    onSwitchChange(val) {
      this.$emit('onChange', val);
    },
  },
  computed: {
    wrapClasses() {
      return cx(prefixCls, {
        [`${prefixCls}-android`]: this.platform === 'android',
      });
    },
    inputClass() {
      return `${prefixCls}-checkbox`;
    },
    fackInputCls() {
      return cx('checkbox', {
        'checkbox-disabled': this.disabled,
      });
    },
    computedstyle() {
      const cstyle = {};
      for (const key in this.h3style) {
        if (this.color && this.innerChecked && key === 'backgroundColor') {
          cstyle.backgroundColor = this.color;
          continue;
        } else {
          cstyle[key] = this.h3style[key];
        }
      }
      if (this.color && this.innerChecked) {
        cstyle.backgroundColor = this.color;
      }
      return cstyle;
    },
  },
};
</script>

<style lang="less">
@import "../../styles/mixins";
@import "../../styles/themes/default";

@switchPrefixCls: h3-switch;

.@{switchPrefixCls} {
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  align-self: center;

  .checkbox {
    width: 51 * @hd;
    height: 31 * @hd;
    border-radius: 31 * @hd;
    box-sizing: border-box;
    background: #e5e5e5;
    z-index: 0;
    margin: 0;
    padding: 0;
    // appearance: none;
    border: 0;
    cursor: pointer;
    position: relative;
    transition: all 300ms;

    &:before {
      content: " ";
      position: absolute;
      left: 1.5 * @hd;
      top: 1.5 * @hd;
      width: 48 * @hd;
      height: 28 * @hd;
      border-radius: 28 * @hd;
      box-sizing: border-box;
      background: @fill-base;
      z-index: 1;
      transition: all 200ms;
      transform: scale(1);
    }

    &:after {
      content: " ";
      height: 28 * @hd;
      width: 28 * @hd;
      border-radius: 28 * @hd;
      background: @fill-base;
      position: absolute;
      z-index: 2;
      left: 1.5 * @hd;
      top: 1.5 * @hd;
      transform: translateX(0);
      transition: all 200ms;
      box-shadow: 2 * @hd 2 * @hd 4 * @hd rgba(0, 0, 0, 0.21);
    }

    &.checkbox-disabled {
      z-index: 3;
    }
  }

  input[type="checkbox"] {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    border: 0 none;
    appearance: none;

    &:checked {
      & + .checkbox {
        background: @switch-fill;

        &:before {
          transform: scale(0);
        }

        &:after {
          transform: translateX(20 * @hd);
        }
      }
    }

    &:disabled {
      & + .checkbox {
        opacity: @opacity-disabled;
      }
    }
  }

  &&-android {
    .checkbox {
      width: 72 * @hd;
      height: 23 * @hd;
      border-radius: @radius-sm;
      background: #a7aaa6;

      &:before {
        display: none;
      }

      &:after {
        width: 35 * @hd;
        height: 21 * @hd;
        border-radius: @radius-xs;
        box-shadow: none;
        left: 1px;
        top: 1px;
      }
    }

    input[type="checkbox"] {
      &:checked {
        & + .checkbox {
          background: @switch-fill-android;

          &:before {
            transform: scale(0);
          }

          &:after {
            transform: translateX(35 * @hd);
          }
        }
      }
    }
  }
}
</style>
