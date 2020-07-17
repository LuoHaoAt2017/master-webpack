<template>
<h3-list name="h3-textarea-list">
  <div class="h3-field-tip" v-if="showTip">
    <div class="h3-field-tip-wrapper">
      <div v-html="tip"></div>
    </div>
    <div class="h3-field-tip-arrow" ></div>
  </div>
  <h3-list-item :class="wrapCls" :touchFeedback="false" :hasExtra="true" v-if="layout === 'v'">
    <h3-label
    :label="title"
    :required="required"
    :layout="layout"
    :tip="tip"
    @onToggleTip="toggleTip"
    />
  </h3-list-item>
  <div :class="wrapCls">
    <div v-if="title && layout === 'h'" :class="labelCls" :style="labelStyle">
        <h3-label v-if="layout === 'h'"
        :label="title"
        :required="required"
        :layout="layout"
        :tip="tip"
        @onToggleTip="toggleTip"
        />
    </div>
    <div :class="controlCls">
      <textarea ref='textarea'
        v-if="editable"
        v-model="innerValue"
        @blur="onInnerBlur($event)"
        @focus="onInnerFocus($event)"
        @input="onInnerChannge($event)"
        :rows="rows"
        :maxlength="maxLength"
        :readonly="readonly"
        :placeholder="placeholder"
        :style="h3style"
        :disabled="disabled"
      />
      <div class="h3-textarea-view-wraper" v-else :class="viewWrapperCls"  ref="readonlytextarea">
        <div v-text="innerValue" :class="viewTextCls" class="h3-textarea-view-text" ref="inputTextareaText">
        </div>
        <div v-if="showViewOpreation" class="h3-textarea-view-operate-warpper" @click="toogleViewText">
          <div class="h3-textarea-view-operate" v-if="!isMore && showViewOpreation">收起<i class="icon aufont icon-base-up"></i></div>
          <div class="h3-textarea-view-operate" v-if="isMore && showViewOpreation">查看<i class="icon aufont icon-base-down"></i></div>
        </div>
      </div>
    </div>
    <h3-touch
      :onTouchStart="touchStart"
      :onTouchMove="touchMove"
      :onTouchEnd="touchEnd"
      :onTouchCancel="touchCancel">
      <div v-show="showClear" :class="clearCls"/>
    </h3-touch>
    <div v-show="error || errMsg" :class="errorCls" @click="onInnerErrorClick($event)" />
    <span v-show="hasCount" :class="countCls"><span>{{characterLength}}</span>/{{maxLength}}</span>
  </div>
</h3-list>
</template>

<script>
import cx from 'classnames';
import h3Touch from '../h3-touch/';
import touch2 from '../../mixins/touch2';
import { H3Field } from 'h3-mobile-vue';
import { h3List, h3ListItem } from '../h3-list/';

const prefixCls = 'h3-textarea';
const prefixListCls = 'h3-list';
const regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\n/g;

export default {
  name: 'h3-textarea-item',
  mixins: [touch2],
  components: {
    h3Touch,
    H3Label: H3Field.Label,
    h3List,
    h3ListItem,
  },
  props: {
    h3style: {
      type: Object,
      default() {
        return {};
      },
    },
    className: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    maxLength: {
      type: Number,
      validator(val) {
        return val <= 2000;
      },
      default: 2000,
    },
    name: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    defaultValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    autoHeight: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: Boolean,
    readonly: Boolean,
    count: {
      type: Number,
      default: 0,
    },
    rows: {
      type: Number,
      default: 4,
    },
    clear: {
      type: Boolean,
      default: false,
    },
    labelNumber: {
      type: Number,
      default: 5,
    },
    labelWidth: String,
    slotTitle: {
      type: Boolean,
      default: false,
    },
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
      focus: false,
      error: false,
      innerValue: this.value || this.defaultValue || '',
      debounceTimeout: null,
      isActive: false,
      showTip: false,
      showViewOpreation: false,
      isMore: false,
      viewWrapperCls: '',
    };
  },
  beforeDestroy() {
  },
  mounted() {
    if (this.$refs.readonlytextarea) {
      const parentHeight = this.$refs.readonlytextarea.offsetHeight;
      const height = this.$refs.inputTextareaText.offsetHeight;
      if (height > parentHeight) {
        this.showViewOpreation = true;
        this.isMore = true;
        this.viewWrapperCls = 'h3-textarea-view-wraper-showViewOpe';
      }
    }
  },
  methods: {
    reAlignHeight(e) {
      if (!this.autoHeight) {
        return;
      }
      const element = e.target;
      this.reSetHeight(element);
    },
    reSetHeight(el) {
      const element = el;
      element.style.height = '';
      element.style.height = `${element.scrollHeight}px`;
    },
    onInnerChannge(e) {
      this.$emit('input', this.innerValue);
      this.$emit('onChange', this.innerValue);
      if (this.autoHeight && this.focus) {
        this.reAlignHeight(e);
      }
    },
    onInnerBlur() {
      this.focus = false;
      this.$emit('onBlur', this.innerValue);
    },
    onInnerFocus() {
      this.focus = true;
      this.$emit('onFocus', this.innerValue);
    },
    onInnerErrorClick() {
      if (this.errMsg) {
        window.toast.show({
          text: this.errMsg,
        });
      }
      this.$emit('onErrorClick', this.innerValue);
      this.$refs.textarea.focus();
    },
    innerClearInput() {
      console.log('inner claer input...........');
      this.innerValue = '';
      this.$emit('onChange', this.innerValue);
      this.$refs.textarea.style.height = '';
      this.$refs.textarea.focus();
    },
    countSymbols(text) {
      if (text == null || text === undefined) {
        return 0;
      }
      return text.replace(regexAstralSymbols, '_').length;
    },
    touchStart() {
      this.toggleActive(true);
    },
    touchEnd() {
      this.innerClearInput();
      this.toggleActive(false);
    },
    toggleTip() {
      this.showTip = !this.showTip;
    },
    toogleViewText() {
      this.isMore = !this.isMore;
      this.viewWrapperCls = 'h3-textarea-view-wraper-showViewOpe h3-input-view-wrapper-operating';
    },
  },
  computed: {
    hasCount() {
      if (this.maxLength && this.rows) {
        return this.maxLength > 0 && this.rows > 1;
      }
      return false;
    },
    characterLength() {
      return this.countSymbols(this.innerValue);
    },
    wrapCls() {
      return cx(this.className, `${prefixListCls}-item`, `${prefixCls}-item`, {
        [`${prefixCls}-disabled`]: this.disabled,
        [`${prefixCls}-item-single-line`]: this.rows === 1 && !this.autoHeight,
        [`${prefixCls}-error`]: this.error || this.errMsg,
        [`${prefixCls}-focus`]: this.focus,
        [`${prefixCls}-has-count`]: this.hasCount,
        [`${prefixCls}-view`]: !this.editable || this.readonly,
      });
    },
    labelCls() {
      return `${prefixCls}-label`;
    },
    controlCls: {
      get() {
        return `${prefixCls}-control`;
      },
      set(val) {
        return val;
      },
    },
    clearCls() {
      return cx(`${prefixCls}-clear`, {
        [`${prefixCls}-clear-active`]: this.isActive,
      });
    },
    countCls() {
      return cx(`${prefixCls}-count`, {
        [`${prefixCls}-count-alert`]: this.characterLength >= this.maxLength,
      });
    },
    errorCls() {
      return `${prefixCls}-error-extra`;
    },
    showClear() {
      return this.clear && this.editable
        && this.characterLength > 0 && this.focus;
    },
    viewWrapCls() {
      return `${prefixCls}-view-wraper`;
    },
    labelStyle() {
      const lStyle = {};
      if (this.labelWidth) {
        lStyle.width = this.labelWidth;
      }
      return lStyle;
    },
    viewTextCls() {
      if (this.isMore) {
        return 'h3-textarea-view-text-overflow';
      }
      return '';
    },
  },
  watch: {
    value(curVal) {
      this.innerValue = curVal;
    },
  },
};
</script>

<style lang="less">
@import "../../styles/mixins";
@import "../../styles/h3-ui/h3-list";

@listPrefixCls: h3-list;
@textareaPrefixCls: h3-textarea;
@field-label-color: #333333;
@field-text-color: #333333;
@field-label-color-view: #999999;
.@{textareaPrefixCls}-view {
  .@{textareaPrefixCls}-label {
    color: @field-label-color-view !important;
    .h3-field-layout-h-label,.h3-field-layout-h-label {
      color: @field-label-color-view !important;
    }
  }
}
.@{listPrefixCls}-item{
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding-left: 15px;
  min-height: 44px;
  background-color: #fff;
  vertical-align: middle;
  overflow: hidden;
  -webkit-transition: background-color 200ms;
  transition: background-color 200ms;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}

.@{listPrefixCls} .@{listPrefixCls}-item {
  &.@{textareaPrefixCls}-item {
    display: flex;
    align-items: flex-start;
    box-sizing: border-box;
    min-height: @list-item-height;
    padding-left: @h-spacing-lg;
    padding-right: @h-spacing-lg;
    .hairline('bottom');
    // .h3-field-layout-label-required {
    //   position: relative;
    //   top: -5px;
    // }
    .@{textareaPrefixCls}-view-wraper {
       line-height: 24px;
      //  padding-top: 11px;
       font-size: @font-size-heading;
       letter-spacing: normal;
    }
    &.@{textareaPrefixCls}-item-single-line {
      align-items: center;
      .@{textareaPrefixCls}-label {
        align-self: center;
      }
      &.@{textareaPrefixCls}-view {
        align-items: flex-start;
        .@{textareaPrefixCls}-label {
          align-self: auto;
        }
        .@{textareaPrefixCls}-control {
          color: #333;
        }
      }
      &.@{textareaPrefixCls}-disabled {
        align-items: flex-start;
        .@{textareaPrefixCls}-control {
          padding-top: 10px;
        }
      }

      .@{textareaPrefixCls}-control {
        padding-top: 0;
        padding-bottom: 0;
        textarea {
          line-height: @line-height-paragraph * @font-size-heading;
        }
      }
      .@{textareaPrefixCls}-clear {
        margin-top: 0;
      }

      &.@{textareaPrefixCls}-error {
        .@{textareaPrefixCls}-error-extra {
          margin-top: 0;
        }
      }
    }
  }
}
.h3-textarea-view-wraper {
  font-size: 17px;
  line-height: 25px;
  margin-top: 10px;
  height: auto;
  .h3-textarea-view-text-overflow {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }
  .h3-textarea-view-operate-warpper {
    position: absolute;
    right: 15px;
    bottom: 10px;
    font-size: 17px;
    line-height: 25px;
    color: #1890ff;
  }
  .h3-textarea-view-operate {
    float:right;
    margin-right:4px;
    i{
      font-size: 16px;
    }
  }
}
.h3-textarea-view-wraper-showViewOpe{
  margin-bottom: 41px;
}
.h3-input-view-wrapper-operating{
  max-height: none;
}

.@{textareaPrefixCls}-label {
  align-self: flex-start;
  color: @color-text-base;
  text-align: left;
  min-height: @list-item-height;
  font-size: @font-size-heading;
  line-height: @list-item-height;
  margin-left: 0;
  margin-right: @h-spacing-sm;
  // white-space: nowrap;
  overflow: hidden;
  position: relative;

  // .h3-field-layout-h-label {
  //   position: relative;
  //   padding: 11px 0;
  //   padding-right: 20px;
  //   width: 118px;
  //   line-height: 24px;
  // }
  &.@{textareaPrefixCls}-label-2 {
    width: 2 * @input-label-width;
    margin-top: 2px;
  }

  &.@{textareaPrefixCls}-label-3 {
    width: 3 * @input-label-width;
    margin-top: 2px;
  }

  &.@{textareaPrefixCls}-label-4 {
    width: 4 * @input-label-width;
  }

  &.@{textareaPrefixCls}-label-5 {
    width: 5 * @input-label-width;
    margin-top: 2px;
  }

  &.@{textareaPrefixCls}-label-6 {
    width: 6 * @input-label-width;
    margin-top: 2px;
  }

  &.@{textareaPrefixCls}-label-7 {
    width: 7 * @input-label-width;
    margin-top: 2px;
  }
}

.@{textareaPrefixCls}-control {
  flex: 1;
  padding-top: 10 * @hd;
  padding-bottom: 9 * @hd;

  textarea {
    color: @color-text-base;
    font-size: @font-size-heading;
    line-height: @line-height-paragraph * @font-size-heading;
    -webkit-appearance:none;
    appearance: none;
    width: 100%;
    padding: 0;
    border: 0;
    background-color: transparent;
    overflow: visible;
    display: block;
    resize: none;
    word-break: break-all;
    word-wrap: break-word;

    &::placeholder {
      color: @color-text-placeholder;
    }

    &:disabled {
      color: @color-text-disabled;
      background-color: #fff;
    }
  }
}

.@{textareaPrefixCls}-clear {
  display: none;
  width: @icon-size-sm;
  height: @icon-size-sm;
  margin-top: 12 * @hd;
  border-radius: @radius-circle;
  overflow: hidden;
  font-style: normal;
  color: #fff;
  background-color: @input-color-icon;
  background-repeat: no-repeat;
  background-size: @icon-size-sm auto;
  .encoded-svg-background('textarea_item_delete');

  &-active {
    background-color: @input-color-icon-tap;
  }
}

&.@{textareaPrefixCls}-focus {
  .@{textareaPrefixCls}-clear {
    display: block;
  }
}

.@{textareaPrefixCls}-has-count {
  padding-bottom: 14px;
}

.@{textareaPrefixCls}-count {
  position: absolute;
  bottom: @v-spacing-sm;
  right: @h-spacing-sm;
  color: @color-text-placeholder;
  font-size: @font-size-base;

  span {
    color: @color-text-base;
  }
}
.@{textareaPrefixCls}-count-alert {
  color: #f5222d;
  span {
    color: #f5222d;
  }
}

&.@{textareaPrefixCls}-error {
  .@{textareaPrefixCls}-control {
    textarea {
      color: #f5222d;
    }
  }

  .@{textareaPrefixCls}-error-extra {
    margin-top: 12 * @hd;
    width: @icon-size-sm;
    height: @icon-size-sm;
    margin-left: @h-spacing-md;
    background-size: @icon-size-sm @icon-size-sm;
    .encoded-svg-background('error');
  }
}

&.@{textareaPrefixCls}-disabled {
  .@{textareaPrefixCls}-label {
    color: @color-text-disabled;
  }
}

.@{listPrefixCls} {
  &-body {
    .@{listPrefixCls}-item {
      &:last-child {
        .hairline-remove('bottom');
      }
    }
  }
}

.@{textareaPrefixCls}-item .required {
  color:red;
  line-height: 44px;
}
</style>
