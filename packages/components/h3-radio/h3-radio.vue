<template>
<label v-if="wrapLabel" :class="wrapCls">
   <span :class="classString" :style="h3style">
      <input
        :name="name"
        :id="id"
        type="radio"
        :readOnly="readOnly"
        :disabled="disabled"
        :tabIndex="tabIndex"
        :class="inputCls"
        @click="onInnerClick($event)"
        @focus="onInnerFocus($event)"
        @blur="onInnerBlur($event)"
        :autoFocus="autoFocus"
        :value="value"
        v-model="innerValue"
      />
      <span :class="innerSpanCls" />
    </span>
    <span style="display:inline-block;vertical-align:middle;margin-left:-5px;">
      <slot></slot>
    </span>
</label>
<span v-else :class="classString" :style="h3style">
  <input
    :name="name"
    :id="id"
    type="radio"
    :readOnly="readOnly"
    :disabled="disabled"
    :tabIndex="tabIndex"
    :class="inputCls"
    @click="onInnerClick($event)"
    @focus="onInnerFocus($event)"
    @blur="onInnerBlur($event)"
    :autoFocus="autoFocus"
    :value="value"
    v-model="innerValue"
  />
  <span :class="innerSpanCls" />
</span>
</template>

<script>
import cx from 'classnames';

const prefixCls = 'h3-radio';
export default {
  name: 'h3-radio',
  props: {
    className: String,
    h3style: Object,
    name: String,
    id: String,
    defaultChecked: {
      type: Boolean,
      default: false,
    },
    checked: Boolean,
    disabled: Boolean,
    tabIndex: String,
    readOnly: {
      type: Boolean,
      default: false,
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    value: String,
    wrapLabel: {
      type: Boolean,
      default: true,
    },
    returnValue: String,
    isCircle: {
      type: Boolean,
      default: false,
    },
    listBrief: Boolean,
  },
  watch: {
    innerValue(curVal) {
      if (curVal !== this.returnValue) {
        this.$emit('input', this.innerValue);
        this.$emit('onChange', this.innerValue);
      }
    },
    returnValue(val) {
      this.innerValue = val;
    },
  },
  data() {
    return {
      innerValue: this.returnValue,
    };
  },
  methods: {
    onInnerClick() {
      console.log('h3-radio clicked...');
      this.$emit('onClick', this.innerValue);
    },
    onInnerFocus() {
      this.$emit('onFocus', this.innerValue);
    },
    onInnerBlur() {
      this.$emit('onBlur', this.innerValue);
    },
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}-wrapper`, this.className);
    },
    classString() {
      return cx(prefixCls, this.className, {
        [`${prefixCls}-checked`]: this.innerChecked,
        [`${prefixCls}-disabled`]: this.disabled,
        [`${prefixCls}-circle`]: this.isCircle,
      });
    },
    inputCls() {
      return `${prefixCls}-input`;
    },
    innerSpanCls() {
      return cx(`${prefixCls}-inner`, {
        [`${prefixCls}-inner-circle`]: this.isCircle,
        [`${prefixCls}-inner-brief`]: this.listBrief,
      });
    },
    innerChecked() {
      return this.value === this.returnValue;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';

@listPrefixCls: h3-list;
@radioWarpPrefixCls: h3-radio;
@radioInnerPrefixCls: ~"@{radioWarpPrefixCls}-inner";

.@{radioWarpPrefixCls} {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: @icon-size-xxs;
  height: @icon-size-xxs;
  display: flex;
  align-items: center;

  &-inner {
    position: absolute;
    right: 0;
    width: @icon-size-xxs;
    height: @icon-size-xxs;
    box-sizing: border-box;
    transform: rotate(0deg);

    &:after {
      position: absolute;
      display: none;
      top: -2.5 * @hd;
      right: 5 * @hd;
      z-index: 999;
      width: 7 * @hd;
      height: 14 * @hd;
      border-style: solid;
      border-width: 0 1.5 * @hd 1.5 * @hd 0;
      content: '\0020';
      transform: rotate(45deg);
    }

    &-circle {
      &:after {
        position: absolute;
        display: none;
        top: 2px;
        right: 5px;
        z-index: 909;
        border-style: solid;
        border-width: 5px;
        border-radius: 10px;
        content: ' ';
        width: 0px;
        height: 0px;
      }
    }
    &-brief {
      &:after {
      }
    }
  }

  &-input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    border: 0 none;
    appearance: none;
  }

  &.@{radioWarpPrefixCls}-checked {
    .@{radioInnerPrefixCls} {
      border-width: 0;

      &:after {
        display: block;
        border-color: @brand-primary;
      }
    }
    &.@{radioWarpPrefixCls}-circle {
      border: 1px solid #108ee9;
    }
  }
  
  &.@{radioWarpPrefixCls}-disabled {
    &.@{radioWarpPrefixCls}-checked {
      .@{radioInnerPrefixCls} {
        &:after {
          display: block;
          border-color: @color-text-disabled;
        }
      }
    }
  }
}

.@{listPrefixCls} {
  & &-item {
    &.@{radioWarpPrefixCls}-item {
      .@{listPrefixCls}-line {
        .@{listPrefixCls}-extra {
          flex: 0;

          .@{radioWarpPrefixCls} {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            // height: @list-item-height;
            height: 100% !important;
            overflow: visible;

            &-inner {
              right: @v-spacing-lg;
              // top: @h-spacing-lg;
              &-brief {
                top: 13px;
              }
            }
          }
        }
      }

      &.@{radioWarpPrefixCls}-item-disabled {
        .@{listPrefixCls}-content {
          color: @color-text-disabled;
        }
      }
    }
  }
}


</style>

