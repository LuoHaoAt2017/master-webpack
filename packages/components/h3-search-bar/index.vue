<template>
  <form
    @submit="submit($event)"
    :class="wrapCls"
    ref="inputContainerRef"
    action="#">
    <div :class="`${prefixCls}-input`">
      <div
        :class="`${prefixCls}-synthetic-ph`"
        ref="syntheticPhRef"
        >
        <span
          :class="`${prefixCls}-synthetic-ph-container`"
          ref="syntheticPhContainerRef">
          <i :class="`${prefixCls}-synthetic-ph-icon`" />
          <span
            :class="`${prefixCls}-synthetic-ph-placeholder`"
            v-text="placeholder"
            ref="placeholder">
          </span>
        </span>
      </div>
      <input
        type="search"
        :class="`${prefixCls}-value`"
        v-model="formatValue"
        :disabled="disabled"
        :placeholder="placeholder"
        @focus="focusIn"
        @input="change($event)"
        @blur.stop="blur($event)"
        @touchstart="focusIn"
        ref="inputRef"
        :maxLength="maxLength"
      />
      <span @click.prevent.stop="clear" :class="clearCls" v-touch="`${prefixCls}-clear`" ref="clearSpan" >
        <i style="position: absolute;" class="icon aufont icon-base-close-circle"></i>
      </span>
    </div>
    <div
      :class="cancelCls"
      @click.prevent.stop="cancel"
      ref="rightBtnRef"
      v-show="showCancel" v-text="cancelText">
    </div>
  </form>
</template>


<script>
import classnames from 'classnames';
import touch from '../../directives/touch';
// import dom from '../../utils/dom';

function noop() {}
export default {
  name: 'h3-search-bar',
  props: {
    defaultValue: {
      type: String,
    },
    value: {
      type: String,
    },
    placeholder: {
      type: String,
      default: '搜索',
    },
    onSubmit: {
      type: Function,
      default: noop,
    },
    onChange: {
      type: Function,
      default: noop,
    },
    onFocus: {
      type: Function,
      default: noop,
    },
    onBlur: {
      type: Function,
      default: noop,
    },
    onCancel: {
      type: Function,
      default: noop,
    },
    showCancelButton: {
      type: Boolean,
      default: false,
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    prefixCls: {
      type: String,
      default: 'h3-search',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
    },
  },
  data() {
    return {
      formatValue: '',
      isFocus: false,
      firstFocus: false,
      onBlurTimeout: null,
      blurFromOnClear: true,
      rightBtnInitMarginleft: null,
      touchactive: true,
      tempFirstBlur: false,
      showPlaceholder: true,
    };
  },
  created() {
    if (this.value) {
      this.formatValue = this.value;
    } else if (this.defaultValue) {
      this.formatValue = this.defaultValue;
    }
  },
  directives: {
    touch,
  },
  updated() {
  },
  mounted() {
    this.$refs.clearSpan.style.display = 'none';
  },
  beforeDestroy() {
  },
  deactivated() {
  },
  methods: {
    submit(e) {
      e.preventDefault();
      if (this.onSubmit) {
        this.onSubmit(this.formatValue);
      }
      this.$refs.inputRef.blur();
    },
    componentWillUnmount() {
      if (this.onBlurTimeout) {
        clearTimeout(this.onBlurTimeout);
        this.onBlurTimeout = null;
      }
    },
    change(e) {
      console.log('change.................', e && e.target.value);
      if (!this.isFocus) {
        this.isFocus = true;
      }
      if (this.formatValue || (e && e.target.value)) {
        this.$refs.placeholder.style.display = 'none';
      } else {
        this.$refs.placeholder.style.display = '';
      }

      if (this.formatValue && this.formatValue.length > 0) {
        this.$refs.clearSpan.style.display = '';
      } else {
        this.$refs.clearSpan.style.display = 'none';
      }
      // const value = e.target.value;
      // this.formatValue = value;
      this.$emit('input', this.formatValue);
      const self = this;
      if (this.changeTimeout) {
        clearTimeout(this.changeTimeout);
        this.changeTimeout = null;
      }
      this.changeTimeout = setTimeout(() => {
        if (self.onChange) {
          self.onChange(self.formatValue);
        }
      }, 10);
    },
    focusIn() {
      this.$refs.inputRef.focus();
      if (this.isFocus) {
        return;
      }
      const self = this;
      this.isFocus = true;
      this.firstFocus = true;

      if (this.formatValue && this.formatValue.length > 0) {
        this.$refs.clearSpan.style.display = '';
      } else {
        this.$refs.clearSpan.style.display = 'none';
      }

      if (this.onFocus) {
        this.onFocus();
      }
      this.$nextTick(() => {
        self.focus();
      });
    },
    blur(e) {
      e.preventDefault();
      const self = this;
      if (!this.tempFirstBlur) {
        this.isFocus = false;
        this.tempFirstBlur = true;
      }
      // if (!self.blurFromOnClear) {
      //   if (document.activeElement !== self.$refs.inputRef) {
      //     this.isFocus = false;
      //   }
      // }

      if (document.activeElement !== self.$refs.inputRef) {
        this.isFocus = false;
      }

      self.blurFromOnClear = false;
      if (this.onBlur) {
        this.onBlur();
      }
    },
    clear() {
      // e.preventDefault();
      this.$refs.placeholder.style.display = '';
      this.$refs.clearSpan.style.display = 'none';
      this.doClear(true);
    },
    doClear(blurFromOnClear) {
      this.blurFromOnClear = blurFromOnClear;
      this.formatValue = '';
      this.$refs.inputRef.value = '';
      this.$emit('input', this.formatValue);
      if (this.onClear) {
        this.onClear('');
      }
      if (this.onChange) {
        this.onChange('');
      }
      if (blurFromOnClear) {
        this.focus();
      }
    },
    cancel() {
      this.isFocus = false;
      this.$refs.placeholder.style.display = '';
      this.$refs.clearSpan.style.display = 'none';
      if (this.onCancel && this.onCancel !== noop) {
        this.onCancel(this.formatValue);
        this.formatValue = '';
        this.$refs.inputRef.value = '';
        this.$emit('input', this.formatValue);
      } else {
        this.doClear(false);
      }
    },
    focus() {
      // const self = this;
      // if (this.focusTimeOut) {
      //   clearTimeout(this.focusTimeOut);
      //   this.focusTimeOut = null;
      // }
      // this.focusTimeOut = setTimeout(() => {
      //   self.$refs.inputRef.focus();
      // }, 1);
      // ERROR 为什么为空
      if (this.$refs.inputRef) {
        this.$refs.inputRef.focus();
      } else {
        this.$el.querySelector('input').focus();
      }
    },
  },
  computed: {
    cancelCls() {
      return classnames(`${this.prefixCls}-cancel`, {
        [`${this.prefixCls}-cancel-show`]: this.showCancelButton || this.isFocus || (this.formatValue && this.formatValue.length > 0),
        [`${this.prefixCls}-cancel-anim`]: this.firstFocus,
      });
    },
    wrapCls() {
      return classnames(this.prefixCls, {
        [`${this.prefixCls}-start`]: !!(this.isFocus || (this.formatValue && this.formatValue.length > 0)),
      });
    },
    clearCls() {
      return classnames(`${this.prefixCls}-clear`, {
        [`${this.prefixCls}-clear-show`]: false,
      });
    },
    showCancel() {
      console.log('isFocus,formatValue:', this.isFocus, this.formatValue);
      return this.isFocus || this.formatValue !== '';
    },
    calPlaceHolder() {
      if (this.showPlaceholder) {
        return this.placeholder;
      }
      return '';
    },
  },
  watch: {
    value(val) {
      this.showPlaceholder = this.placeholder && !val;
      this.formatValue = val;
      if (this.formatValue) {
        this.$refs.placeholder.style.display = 'none';
      } else {
        this.$refs.placeholder.style.display = '';
      }
    },
    isFocus(val) {
      console.log('isFocus:', val);
      // const self = this;
      // this.$nextTick(() => {
      //   if (val) {
      //     if (self.formatValue && self.formatValue.length > 0) {
      //       self.$refs.clearSpan.style.display = '';
      //     } else {
      //       self.$refs.clearSpan.style.display = 'none';
      //     }
      //   } else {
      //     self.$refs.clearSpan.style.display = 'none';
      //   }
      // });
    },
    formatValue(val) {
      console.log('formatValue:', val);
      // const self = this;
      // this.$nextTick(() => {
      //   if (self.isFocus) {
      //     if (val && val.length > 0) {
      //       self.$refs.clearSpan.style.display = '';
      //     } else {
      //       self.$refs.clearSpan.style.display = 'none';
      //     }
      //   } else {
      //     self.$refs.clearSpan.style.display = 'none';
      //   }
      // });
    },
  },
};
</script>

<style lang="less" >
@import '../../styles/mixins';
@import '../../styles/themes/default';

/* 默认搜索bar */
@searchPrefixCls: h3-search;
@searchOppositePrefixCls: h3-search-opposite;

/* 默认搜索bar */
form {
  &.@{searchPrefixCls} {
    padding: 0 @h-spacing-lg;
  }
}
form {
  &.@{searchOppositePrefixCls} {
    padding: 0 @h-spacing-md;
  }
}
.@{searchPrefixCls} {
  position: relative;
  display: flex;
  align-items: center;
  height: @search-bar-height;
  padding: 0 @h-spacing-lg;
  overflow: hidden;
  background-color:@fill-base;

  &-input {
    flex: 1;
    position: relative;
    width: 100%;
    height: @search-bar-input-height;
    overflow: hidden;
    background-color: @fill-input;
    background-clip: padding-box;
    border-radius: @radius-sm;
    // border-radius: 6px;

    .@{searchPrefixCls}-synthetic-ph,
    input[type="search"] {
      position: absolute;
      top: 0;
      left: 0;
    }
     input[type="search"] {
      padding: 0 @search-bar-input-height 0 @h-spacing-lg + @icon-size-xxs + @h-spacing-sm;
    }

    .@{searchPrefixCls}-synthetic-ph {
      z-index: 1;
      height: @search-bar-input-height;
      // line-height: @search-bar-input-height;
      width: 100%;
      transition: width .3s;
      display: block;
      text-align: center;
      box-sizing: content-box;

      &-icon {
        display: inline-block;
        margin-right: @h-spacing-sm;
        width: @icon-size-xxs;
        height: @icon-size-xxs;
        overflow: hidden;
        vertical-align: -3 * @hd;
        background-repeat: no-repeat;
        background-size: @icon-size-xxs auto;
        .encoded-svg-background('search_bar_search');
      }

      &-placeholder {
        color: @color-text-placeholder;
        font-size: @search-bar-font-size;
        height: @search-bar-font-size;
        // line-height: @search-bar-font-size + 1;
      }

      &-container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    input[type="search"] {
      z-index: 2;
      opacity: 0;
      width: 100%;
      text-align: left;
      display: block;
      color: @color-text-base;
      height: @search-bar-input-height;
      font-size: @search-bar-font-size;
      background-color: transparent;
      border: 0;

      &::placeholder {
        background: none;
        text-align: left;
        // color: @color-text-placeholder;
        color: transparent;
        // font-size: @input-font-size;
      }

      &::-webkit-search-cancel-button {
        -webkit-appearance: none;
      }
    }

    .@{searchPrefixCls}-clear {
      position: absolute;
      // display: none;
      z-index: 3;
      width: 16px;
      height: 16px;
      padding: (@search-bar-input-height - 16) / 2;
      padding-right: @search-bar-input-height - 16;
      border-radius: @radius-circle;
      top: 0;
      right: 0;
      // background-color: transparent;
      // background-position: center;
      // background-repeat: no-repeat;
      // background-size: @icon-size-xxs @icon-size-xxs;
      transition: all .3s;
      box-sizing: content-box;
      color:#ddd;
      // .encoded-svg-background('search_bar_clear');

      &-active {
        // .encoded-svg-background('search_bar_clear_active');
        color:#1890FF;
        width: @icon-size-xxs;
        height: @icon-size-xxs;
      }

      &-show {
        display: block;
      }
      // 偏移是因为字体图标库生成的图表高会多1px的倍数 后期解决后取消
      .icon {
        transform: translateY(-1px);
      }
    }
  }

  &-cancel {
    flex: none;
    opacity: 0;
    padding-left: @h-spacing-lg;
    height: @search-bar-height;
    line-height: @search-bar-height;
    font-size: 16px;
    color: #1890ff;
    text-align: right;

    &-anim {
      transition: margin-right .3s, opacity .3s;
      transition-delay: .1s;
    }

    &-show {
      opacity: 1;
    }
  }

  &.@{searchPrefixCls}-start {
    .@{searchPrefixCls}-input {
      input[type="search"] {
        opacity: 1;
        padding: 0 @search-bar-input-height 0 @h-spacing-lg + @icon-size-xxs + @h-spacing-sm;

        &::placeholder {
          // display: none;
          color: transparent;
        }
      }

      .@{searchPrefixCls}-synthetic-ph {
        // padding-left: @h-spacing-lg;
        padding-left: 12px;
        width: auto;
      }
    }
  }
}

.@{searchOppositePrefixCls} {
  position: relative;
  display: flex;
  align-items: center;
  height: @search-bar-height;
  padding: 0 @h-spacing-md;
  overflow: hidden;
  background-color: #ffffff;

  &-input {
    flex: 1;
    position: relative;
    width: 100%;
    height: @search-bar-input-height;
    overflow: hidden;
    background-color: #f4f4f4;
    background-clip: padding-box;
    border-radius: @radius-sm;

    .@{searchOppositePrefixCls}-synthetic-ph,
    input[type="search"] {
      position: absolute;
      top: 0;
      left: 0;
    }
    input[type="search"] {
      padding: 0 @search-bar-input-height 0 @h-spacing-lg + @icon-size-xxs + @h-spacing-sm;
    }

    .@{searchOppositePrefixCls}-synthetic-ph {
      z-index: 1;
      height: @search-bar-input-height;
      line-height: @search-bar-input-height;
      width: 100%;
      transition: width .3s;
      display: block;
      text-align: center;
      box-sizing: content-box;

      &-icon {
        display: inline-block;
        margin-right: 6px;
        width: @icon-size-xxs;
        height: @icon-size-xxs;
        overflow: hidden;
        vertical-align: -2.5 * @hd;
        background-repeat: no-repeat;
        background-size: @icon-size-xxs auto;
        .encoded-svg-background('search_bar_search');
      }

      &-placeholder {
        color: #999999;
        font-size: @search-bar-font-size;
      }
    }

    input[type="search"] {
      z-index: 2;
      opacity: 0;
      width: 100%;
      text-align: left;
      display: block;
      color: @color-text-base;
      height: @search-bar-input-height;
      font-size: @search-bar-font-size;
      background-color: transparent;
      border: 0;

      &::placeholder {
        background: none;
        text-align: left;
        // color: @color-text-placeholder;
        color: transparent;
        // font-size: @input-font-size;
      }

      &::-webkit-search-cancel-button {
        -webkit-appearance: none;
      }
    }

    .@{searchOppositePrefixCls}-clear {
      position: absolute;
      // display: none;
      z-index: 3;
      width: @icon-size-xxs;
      height: @icon-size-xxs;
      padding: (@search-bar-input-height - @icon-size-xxs) / 2;
      .px2rem(padding-right, 24);
      border-radius: @radius-circle;
      color: #ddd;
      top: 0;
      right: 0;
      // background-color: transparent;
      // background-position: center;
      // background-repeat: no-repeat;
      // background-size: @icon-size-xxs @icon-size-xxs;
      transition: all .3s;
      box-sizing: content-box;
      //.encoded-svg-background('search_bar_clear');

      &-active {
        color:#1890FF;
        //.encoded-svg-background('search_bar_clear_active');
        width: @icon-size-xxs;
        height: @icon-size-xxs;
      }

      &-show {
        display: block;
      }
    }
  }

  &-cancel {
    flex: none;
    opacity: 0;
    // padding-left: @h-spacing-md;
    .px2rem(padding-left, 30);
    height: @search-bar-height;
    line-height: @search-bar-height;
    font-size: 16px;
    color: #1890FF;
    text-align: right;

    &-anim {
      transition: margin-right .3s, opacity .3s;
      transition-delay: .1s;
    }

    &-show {
      opacity: 1;
    }
  }

  &.@{searchOppositePrefixCls}-start {
    .@{searchOppositePrefixCls}-input {
      input[type="search"] {
        opacity: 1;
        padding: 0 @search-bar-input-height 0 @h-spacing-lg + @icon-size-xxs + @h-spacing-sm;
        transition: opacity .3s;
        transition-delay: .1s;
        &::placeholder {
          // display: none;
          color: transparent;
        }
      }

      .@{searchOppositePrefixCls}-synthetic-ph {
        padding-left: @h-spacing-lg;
        width: auto;
      }
    }
  }
}
</style>
