<template>
<div>
  <div class="h3-field-tip" v-if="showTip">
    <div class="h3-field-tip-wrapper">
      <div v-html="tip"></div>
    </div>
    <div class="h3-field-tip-arrow" ></div>
  </div>
  <div :class="wrapCls" v-touch="{'activeClass':activeClass}">
    <div :class="lineCls">
      <div v-if="title" :class="labelCls" :style="labelStyle">
        <h3-label v-if="layout === 'h'"
        :label="title"
        :required="required"
        :layout="layout"
        :tip="tip"
          @onToggleTip="toggleTip"
        />
      </div>
      <div :class="controlCls" :style="{paddingBottom:inputControlPaddingBottom+'px'}" ref="inputcontrol">
        <div class="h3-input-control-icon-wrapper" v-if="icon"><i :class="icon"></i></div>
        <h3-money-input
          v-if="type=='money' && editable && !readonly"
          :value="fixControlledValue(innerValue)"
          :defaultValue="defaultValue"
          :type="type"
          :maxLength="maxLength"
          :placeholder="placeholder"
          @onChange="onInputChange"
          @onFocus="onInputFocus"
          @onBlur="onInputBlur"
          :disabled="disabled"
          :editable="editable"
          :readonly="!editable || readonly"
          :h3style="h3style"
          :confirmLabel="confirmLabel"
          :moneyKeyboardAlign="moneyKeyboardAlign"
          :isToKBit="isToKBit"
          ref="moneyinput"
        />
        <h3-text-input
          v-else-if="type!='money' && editable && !readonly"
          :value="fixControlledValue(innerValue)"
          :defaultValue="defaultValue"
          :pattern="pattern"
          :h3style="h3style"
          :type="inputType"
          :maxLength="maxLength"
          :placeholder="placeholder"
          @onChange="onInputChange"
          @onFocus="onInputFocus"
          @onBlur="onInputBlur"
          :readonly="!editable || readonly"
          :disabled="disabled"
          :focus="focus"
          ref="textinput"
        />
        <div class="h3-input-view-wraper" v-if="!editable || readonly" :class="viewWrapperCls"  ref="readonlyinput">
          <div v-text="fixControlledValue(innerValue)" :class="viewTextCls" class="h3-input-view-text" ref="inputViewText">
          </div>
          <div v-if="showViewOpreation" class="h3-input-view-operate-warpper" @click="toogleViewText">
            <div class="h3-input-view-operate" v-if="!isMore && showViewOpreation">收起<i class="icon aufont icon-base-up"></i></div>
            <div class="h3-input-view-operate" v-if="isMore && showViewOpreation">查看<i class="icon aufont icon-base-down"></i></div>
          </div>
        </div>
      </div>
      <slot></slot>
      <h3-touch
        :onTouchStart="touchStart"
        :onTouchMove="touchMove"
        :onTouchEnd="touchEnd"
        :onTouchCancel="touchCancel">
        <div v-show="showClear && editable" :class="clearCls" @click="clearInput" />
      </h3-touch>
      <div v-show="error || errMsg" :class="errorCls" @click="onInnerErrorClick" />
      <div v-show="hasExtra || showScan" :class="extraCls" @click="onInnerExtraClick">
        <template v-html="extra" ></template>
        <slot name="extra"></slot>
        <h3-icon type="scan" v-if="showScan" @onClick="scanClick"/>
        <h3-icon type="search" v-if="showEventClick" @onClick="eventClick"/>
      </div>
      <span v-show="hasCount" :class="countCls"><span>{{characterLength}}</span>/{{maxLength}}</span>
    </div>
  </div>
</div>
</template>
<script>
import cx from 'classnames';
import h3TextInput from './h3-text-input';
import h3MoneyInput from './h3-money-input';
import h3Touch from '../h3-touch/';
import touch2 from '../../mixins/touch2';
import h3control from '../../mixins/h3-control';
import { H3Field } from 'h3-mobile-vue';
import h3Icon from '../h3-icon/index';
import touch from '../../directives/touch';
import h3Textarea from '../h3-textarea/';

const prefixListCls = 'h3-list';
const prefixCls = 'h3-input';
const regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\n/g;
const lineHeight = 25;
export default {
  name: 'h3-input',
  mixins: [touch2, h3control],
  components: {

    h3TextInput,
    h3MoneyInput,
    h3Touch,
    H3Label: H3Field.Label,
    h3Icon,
    h3Textarea,
  },
  directives: {
    touch,
  },
  props: {
    h3style: {
      type: Object,
      default() {
        return {};
      },
    },
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: String,
      default: '',
    },
    defaultValue: {
      type: String,
      default: '',
    },
    maxLength: {
      type: Number,
      validator(val) {
        return val <= 200;
      },
      default: 200,
    },
    placeholder: {
      type: String,
      default: '',
    },
    // editable: {
    //   type: Boolean,
    //   default: true,
    // },
    disabled: Boolean,
    readonly: Boolean,
    labelNumber: {
      type: Number,
      default: 5,
    },
    className: {
      type: String,
      default: '',
    },
    updatePlaceholer: {
      type: Boolean,
      default: false,
    },
    moneyKeyboardAlign: {
      type: String,
      default: 'right',
    },
    labelWidth: String,
    confirmLabel: {
      type: String,
      default: '确定',
    },
    clear: {
      type: Boolean,
      default: false,
    },
    hasExtra: {
      type: Boolean,
      default: false,
    },
    extra: {
      type: String,
      default: '',
    },
    error: {
      type: Boolean,
    },
    onChange: {
      type: Function,
    },
    onBlur: {
      type: Function,
    },
    onFocus: {
      type: Function,
    },
    onErrorClick: {
      type: Function,
    },
    focus: {
      type: Boolean,
      default: false,
    },
    slotTitle: {
      type: Boolean,
      default: false,
    },
    required: Boolean,
    layout: {
      type: String,
      default: 'h',
      validator: val => ['h', 'v'].indexOf(val) > -1,
    },
    contentLayout: {
      type: String,
      default: 'top',
      validator: val => ['top', 'center'].indexOf(val) > -1,
    },
    tip: {
      type: String,
      default: '',
    },
    errMsg: {
      type: String,
      default: '',
    },
    showScan: Boolean, // 是否显示扫码图标，前提需要hasExtra=true才能显示
    showEventClick: Boolean, // 是否显示绑定事件图标，前提需要hasExtra=true才能显示
    icon: {
      type: String,
      default: '',
    },
    isToKBit: {
      type: Boolean,
    },
    activeClass: {
      type: String,
      default: 'h3-input-item-touch',
    },
  },
  data() {
    return {
      innerFocus: this.focus || false,
      innerValue: this.value || this.defaultValue || '',
      isActive: false,
      showTip: false,
      inputRows: 1,
      autoHeight: true,
      showViewOpreation: false,
      isMore: false,
      viewWrapperCls: '',
      textAreaWidth: 0,
      textAreaHeight: 0,
      inputControlPaddingBottom: 10,
    };
  },
  mounted() {
    if (this.$refs.readonlyinput) {
      const parentHeight = this.$refs.readonlyinput.offsetHeight;
      const height = this.$refs.inputViewText.offsetHeight;
      if (height > parentHeight) {
        this.showViewOpreation = true;
        this.isMore = true;
        this.lineCls = `${prefixListCls}-line ${prefixListCls}-line-operation`;
      }
    }

    // if (this.$refs.textinput) {
    //   const textAreaWidth = this.$refs.textinput.$refs.textarea.offsetWidth;
    //   const textAreaHeight = this.$refs.textinput.$refs.textarea.offsetHeight;
    //   this.textAreaWidth = textAreaWidth;
    //   this.textAreaHeight = textAreaHeight;
    // }
  },
  methods: {
    onInputChange(val) {
      this.innerValue = val;
      let tempValue = val;
      const valueLen = tempValue.length;
      switch (this.type) {
        case 'text':
          break;
        case 'bankCard':
          tempValue = tempValue.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ');
          break;
        case 'tel':
        case 'phone':
          tempValue = tempValue.replace(/\D/g, '').substring(0, 11);
          if (valueLen > 3 && valueLen < 8) {
            tempValue = `${tempValue.substr(0, 3)} ${tempValue.substr(3)}`;
          } else if (valueLen >= 8) {
            tempValue = `${tempValue.substr(0, 3)} ${tempValue.substr(3, 4)} ${tempValue.substr(7)}`;
          }
          break;
        case 'number':
          tempValue = tempValue.replace(/\D/g, '');
          break;
        case 'password':
          break;
        default:
          break;
      }
      this.innerValue = tempValue;
      // 计算行数
      let controlHeight = 25;
      if (this.$refs.textinput && this.type === 'text') {
        // controlHeight = this.$refs.textinput.$refs.textarea.scrollHeight;
        controlHeight = this.$refs.textinput.$refs.textarea.scrollHeight;
      }
      this.inputRows = Math.ceil(controlHeight / lineHeight);
      // if (this.inputRows >= 3 && this.innerValue.length > 0) {
      //   this.autoHeight = false;
      // } else if (this.inputRows < 4) {
      //   this.autoHeight = true;
      // }
      // if (controlHeight >= 4 * lineHeight && this.innerValue.length > 0) {
      //   this.autoHeight = false;
      // } else {
      //   this.autoHeight = true;
      // }
      if (this.inputRows >= 2) {
        // this.$refs.inputcontrol.style.paddingBottom = '20px';
        this.inputControlPaddingBottom = 20;
      } else {
        // this.$refs.inputcontrol.style.paddingBottom = '10px';
        this.inputControlPaddingBottom = 10;
      }

      console.log('input rows:', this.inputRows);
      this.$emit('onChange', this.innerValue);
    },
    onInputFocus() {
      this.innerFocus = true;
      this.$emit('onFocus', this.innerValue);
    },
    onInputBlur() {
      this.innerFocus = false;
      this.isActive = false;
      console.log('h3-input---blur');
      this.$emit('onBlur', this.innerValue);
    },
    onInnerExtraClick(e) {
      this.$emit('onExtraClick', e, this.innerValue);
    },
    onInnerErrorClick(e) {
      if (this.errMsg) {
        window.toast.show({
          text: this.errMsg,
        });
      }
      this.$emit('onErrorClick', e, this.innerValue);
      this.selfFocus();
    },
    clearInput() {
      if (this.type !== 'password' && this.updatePlaceholer) {
        this.placeholder = this.innerValue;
      }
      this.innerValue = '';
      this.$emit('onChange', this.innerValue);
      if (this.$refs.moneyinput) {
        this.$refs.moneyinput.clearInput();
      }
      if (this.$refs.textinput) {
        this.$refs.textinput.$refs.textarea.style.height = `${this.$refs.textinput.textAreaMountedHeight}px`;
        this.$refs.inputcontrol.style.paddingBottom = '10px';
      }
      const that = this;
      setTimeout(() => {
        that.selfFocus();
      }, 1);
    },
    fixControlledValue(value) {
      if (typeof value === 'undefined' || value === null) {
        return '';
      }
      return value;
    },
    selfFocus() {
      if (this.$refs.textinput) {
        this.$refs.textinput.focus();
      }
      if (this.$refs.moneyinput) {
        this.$refs.moneyinput.inputFocus();
      }
    },
    // 扫码事件
    scanClick() {
      this.$emit('scanClick', this);
    },
    // 单行文本bind事件后的单击事件
    eventClick() {
      this.$emit('eventClick', this);
    },
    toggleTip() {
      this.showTip = !this.showTip;
    },
    countSymbols(txt) {
      if (txt == null || txt === undefined) {
        return 0;
      }
      return txt.replace(regexAstralSymbols, '_').length;
    },
    toogleViewText() {
      this.isMore = !this.isMore;
      this.viewWrapperCls = 'h3-input-view-wrapper-operating';
    },
  },
  computed: {
    wrapCls() {
      return cx(
        `${prefixListCls}-item`,
        `${prefixCls}-item`,
        `${prefixListCls}-item-middle`,
        this.className,
        {
          [`${prefixCls}-disabled`]: this.disabled,
          // [`${prefixCls}-error`]: this.error || this.errMsg || !this.innerValue,
          [`${prefixCls}-error`]: this.error || this.errMsg,
          [`${prefixCls}-focus`]: this.innerFocus,
          [`${prefixCls}-android`]: this.innerFocus,
          [`${prefixCls}-view`]: this.readonly || !this.editable,
          [`${prefixCls}-has-count`]: this.hasCount,
          [`${prefixCls}-has-icon`]: this.icon,
        },
      );
    },
    lineCls: {
      get() {
        if (this.showViewOpreation) {
          return `${prefixListCls}-line ${prefixListCls}-line-operation`;
        }
        return `${prefixListCls}-line`;
      },
      set(val) {
        return val;
      },
    },
    labelCls() {
      return `${prefixCls}-label`;
    },
    controlCls() {
      return cx(`${prefixCls}-control`, {
        [`${prefixCls}-control-center`]: this.contentLayout === 'center',
        [`${prefixCls}-control-icon`]: this.icon,
      });
    },
    clearCls() {
      return cx(`${prefixCls}-clear`, {
        [`${prefixCls}-clear-active`]: this.isActive,
      });
    },
    errorCls() {
      return `${prefixCls}-error-extra`;
    },
    extraCls() {
      return `${prefixCls}-extra`;
    },
    inputType() {
      let iType = 'text';
      if (this.type === 'bankCard' || this.type === 'phone') {
        iType = 'tel';
      } else if (this.type === 'password') {
        iType = 'password';
      } else if (this.type === 'digit' || this.type === 'number') {
        iType = 'number';
      } else if (this.type !== 'text' && this.type !== 'number') {
        iType = this.type;
      }
      return iType;
    },
    showClear() {
      return this.clear && this.editable && !this.disabled
        && this.innerValue && this.innerValue.length > 0 && this.innerFocus;
    },
    pattern() {
      if (this.type === 'number') {
        return '[0-9]*';
      }
      return '';
    },
    labelStyle() {
      const lStyle = {};
      if (this.labelWidth) {
        lStyle.width = this.labelWidth;
      }
      return lStyle;
    },
    countCls() {
      // return `${prefixCls}-count`;
      return cx(`${prefixCls}-count`, {
        [`${prefixCls}-count-alert`]: this.characterLength >= this.maxLength,
      });
    },
    hasCount() {
      if (!this.editable || this.readonly) {
        return false;
      }
      if (this.type !== 'text') {
        return false;
      }
      if (this.maxLength && this.type === 'text') {
        return this.maxLength > 0 && this.characterLength > 0 && this.inputRows > 1;
      }
      return this.characterLength > 0;
    },
    characterLength() {
      return this.countSymbols(this.innerValue);
    },
    viewTextCls() {
      if (this.isMore) {
        return 'h3-input-view-text-overflow';
      }
      return '';
    },
    editable() {
      if (this.disabled || this.readonly) {
        return false;
      }
      return true;
    },
  },
  watch: {
    value(val) {
      this.innerValue = val;
    },
    innerValue(val) {
      console.log('changed..................');
      this.onInputChange(val);
      this.$emit('input', val);
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/h3-ui/h3-list';

@field-label-color: #333333;
@field-text-color: #333333;
@field-label-color-view: #999;

@listPrefixCls: h3-list;
@inputPrefixCls: h3-input;
.@{inputPrefixCls}-view {
  .h3-input-label {
    color: @field-label-color-view !important;
    .h3-field-layout-h-label,.h3-field-layout-h-label {
      color: @field-label-color-view !important;
    }
  }
}
.@{listPrefixCls}-item {
  .h3-input-view-wraper {
    font-size: 17px;
    line-height: 25px;
    height: auto;
    max-height: 100px;
    .h3-input-view-text-overflow {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;
    }
    .h3-input-view-operate-warpper {
      position: absolute;
      right: 15px;
      bottom: 10px;
      font-size: 17px;
      line-height: 25px;
      color: #1890ff;
    }
    .h3-input-view-operate {
      float:right;
      margin-right:4px;
      i{
        font-size: 16px;
      }
    }
  }
  .h3-input-view-wrapper-operating{
    max-height: none;
  }
  &.@{inputPrefixCls}-item {
    min-height: 45px;
    padding-left: @h-spacing-lg;
  }
  .@{listPrefixCls}-line-operation {
    padding-bottom: 41px;
  }
  &:not(:last-child) {
    .@{listPrefixCls}-line {
      .hairline('bottom', #eee);
    }
  }

  .@{inputPrefixCls}-label {
    color: @color-text-base;
    font-size: @font-size-heading;
    margin-left: 0;
    margin-right: 8px; // @h-spacing-sm;
    text-align: left;
    // white-space: nowrap;
    overflow: hidden;
    // padding: 2 * @hd 0;
    // margin-top: 2px;
    position: relative;

    &.@{inputPrefixCls}-label-2 {
      width: 2 * @input-label-width;
    }

    &.@{inputPrefixCls}-label-3 {
      width: 3 * @input-label-width;
    }

    &.@{inputPrefixCls}-label-4 {
      width: 4 * @input-label-width;
    }

    &.@{inputPrefixCls}-label-5 {
      width: 5 * @input-label-width;
    }

    &.@{inputPrefixCls}-label-6 {
      width: 6 * @input-label-width;
    }

    &.@{inputPrefixCls}-label-7 {
      width: 7 * @input-label-width;
    }
  }

  .@{inputPrefixCls}-control {
    font-size: @input-font-size;
    flex: 1;
    // height: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    input {
      color: @color-text-base;
      font-size: @font-size-heading;
      appearance: none;
      width: 100%;
      padding: 2 * @hd 0;
      border: 0;
      background-color: transparent;
      line-height: @line-height-base;
      box-sizing: border-box;

      &::placeholder {
        color: @color-text-placeholder;
        line-height: 1.2;
      }

      &:disabled {
        color: @color-text-disabled;
        background-color: #fff;
      }
    }
    textarea {
      color: @color-text-base;
      font-size: @font-size-heading;
      line-height: 25px;
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
        line-height: 1.2;
      }

      &:disabled {
        color: @color-text-disabled;
        background-color: #fff;
      }
    }
  }
  .@{inputPrefixCls}-control-center {
    padding-top:0;
    height: 100%;
    display:flex;
    align-items: center;
  }



  .@{inputPrefixCls}-clear {
    display: none;
    width: @icon-size-sm;
    height: @icon-size-sm;
    border-radius: @radius-circle;
    overflow: hidden;
    font-style: normal;
    color: @fill-base;
    background-color: @input-color-icon;
    background-repeat: no-repeat;
    margin-top: 15px;
    .encoded-svg-background('input_item_delete');

    background-size: @icon-size-sm auto;
    background-position: 2 * @hd 2 * @hd;

    &-active {
      background-color: @input-color-icon-tap;
    }
  }

  &.@{inputPrefixCls}-focus {
    .@{inputPrefixCls}-clear {
      display: block;
    }
  }
  .@{inputPrefixCls}-has-count {
    .@{inputPrefixCls}-control {
      padding-bottom: 9px;
      padding-top: 10px;
    }
  }

  .@{inputPrefixCls}-count {
    position: absolute;
    bottom: 0;
    // bottom: @v-spacing-sm;
    right: @h-spacing-sm;
    color: @color-text-placeholder;
    font-size: @font-size-base;

    span {
      color: @color-text-base;
    }
  }
  .@{inputPrefixCls}-count-alert {
    color: #f5222d;
    span {
      color: #f5222d;
    }
  }

  .@{inputPrefixCls}-extra {
    flex: initial;
    min-width: 0;
    max-height: @icon-size-sm;
    overflow: hidden;
    padding-right: 0;
    line-height: @line-height-base;
    color: @color-text-caption;
    font-size: @font-size-subhead;
    margin-left: @h-spacing-sm;
    margin-top: 16px;
  }

  &.@{inputPrefixCls}-error {
    .@{inputPrefixCls}-control {
      textarea {
        color: #f5222d;
        &::placehost {
          color:#f5222d;
        }
      }
      input {
        color: #f5222d;
        &::placehost {
          color:#f5222d;
        }
      }
    }

    .@{inputPrefixCls}-error-extra {
      height: @icon-size-sm;
      width: @icon-size-sm;
      margin-left: @v-spacing-sm;
      .encoded-svg-background('error');

      background-size: @icon-size-sm auto;
    }
  }

  &.@{inputPrefixCls}-disabled {
    .@{inputPrefixCls}-label {
      color: @color-text-disabled;
    }
  }

  .required {
    color:red;
  }
}
.@{inputPrefixCls}-has-icon {
  .px2rem(min-height, 90) !important;
  background: #f8f8f8 !important;

  .@{inputPrefixCls}-control-icon {
    height: 100%;
    .px2rem(padding-top, 19);
    .px2rem(padding-bottom, 19);
    display: flex;
    .@{inputPrefixCls}-control-icon-wrapper{
      display: flex;
      .px2rem(max-height, 52);
      .px2rem(margin-right, 16);
      display: flex;
      align-items: center;
      .icon{
        .px2rem(font-size, 22);
        color: #333;
      }
    }
    // i{
    //   .px2rem(margin-right, 16);
    //   .px2rem(font-size, 22);
    //   color: #333;
    //   .px2rem(margin-top, 22);
    // }
  }
}

.h3-list-item .h3-input-control textarea:-moz-placeholder {
  height: 25px;
  line-height: 25px;
}
.h3-list-item .h3-input-control textarea::-moz-placeholder {
  height: 25px;
  line-height: 25px;
}
.h3-list-item .h3-input-control textarea::-webkit-input-placeholder {
  height: 25px;
  line-height: 25px;
}
.h3-list-item .h3-input-control textarea:-ms-input-placeholder{
  height: 25px;
  line-height: 25px;
}


.h3-input-item.h3-list-item.h3-list-item-middle .h3-list-line{
  align-items: start;
  .hairline('bottom', #eee);
}
</style>


