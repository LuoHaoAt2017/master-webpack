<template>
  <div>
    <textarea :maxlength="maxLength" rows="1" v-model="innerValue" 
    @blur="onInputBlur($event)" 
    @focus="onInputFocus($event)"
    @input="reAlignHeight($event)"
    :type="type"
    :maxLength="maxLength" 
    :placeholder="placeholder"
    :pattern="pattern"
    :defaultValue="defaultValue"
    ref="textarea"
    />
    <div class="mock-text-area" :style="{opacity:'0',position:'absolute',width:`${textAreaWidth}px`,height:'auto',fontSize:'17px',lineHeight:'25px',wordBreak:'break-all',wordWrap:'break-word'}" v-text="innerValue" ref="preMock"></div>
    <div class="mock-placeholder" :style="{opacity:'0',position:'absolute',width:`${textAreaWidth}px`,height:'auto',fontSize:'17px',lineHeight:'25px',wordBreak:'break-all',wordWrap:'break-word'}" v-text="placeholder" ref="placeholderMock"></div>
  </div>
</template>
<script>
export default {
  props: {
    onBlur: {
      type: Function,
    },
    onFocus: {
      type: Function,
    },
    onChange: {
      type: Function,
    },
    h3style: {
      type: Object,
    },
    value: {
      default: '',
    },
    maxLength: {
      type: Number,
      default: 200,
    },
    // autoHeight: {
    //   type: Boolean,
    //   default: true,
    // },
    type: {
      type: String,
    },
    defaultValue: {
      type: String,
    },
    pattern: {
      type: String,
    },
    placeholder: {
      type: String,
    },
  },
  data() {
    return {
      innerValue: this.value || '',
      innerFocus: false,
      textAreaWidth: 0,
      textAreaHeight: 0,
      autoHeight: true,
      textAreaMountedHeight: 25, // 初始高度
      defaultHeight: 25,
      lineHeight: 25, // 行高
    };
  },
  mounted() {
    const textAreaWidth = this.$refs.textarea.offsetWidth;
    const textAreaHeight = this.$refs.textarea.offsetHeight;
    this.textAreaWidth = textAreaWidth;
    this.textAreaHeight = textAreaHeight;
    const fontFamily = window.getComputedStyle(this.$refs.textarea).fontFamily;
    this.$refs.placeholderMock.style.fontFamily = fontFamily;
    this.$nextTick(() => {
      const placeholderMockHeight = this.$refs.placeholderMock.offsetHeight;
      this.textAreaMountedHeight = placeholderMockHeight;
      this.defaultHeight = this.textAreaMountedHeight > 0 ? this.textAreaMountedHeight : 25;
      this.$refs.textarea.style.height = `${this.defaultHeight}px`;
    });
  },
  methods: {
    onInputBlur(e) {
      this.innerFocus = false;
      this.$emit('onBlur', e);
    },
    onInputFocus(e) {
      this.innerFocus = true;
      this.$emit('onFocus', e, this.innerValue);
    },
    onInputChange(val) {
      this.$emit('onChange', val);
    },
    focus() {
      this.$refs.textarea.focus();
    },
    reAlignHeight(e) {
      console.log('reAlignHeight..input');
      const element = e.target;
      this.reSetHeight(element);
    },
    reSetHeight(el) {
      const realWordHeight = this.$refs.preMock.offsetHeight;
      if (realWordHeight >= 4 * this.lineHeight) {
        this.autoHeight = false;
      } else {
        this.autoHeight = true;
      }

      if (this.autoHeight) {
        const element = el;
        if (this.innerValue === '') {
          element.style.height = '';
          element.style.height = `${this.defaultHeight}px`;
          return;
        }
        element.style.height = '';
        element.style.height = `${element.scrollHeight}px`;
      }
    },
  },
  computed: {},
  watch: {
    value(curVal) {
      this.innerValue = curVal || '';
    },
    innerValue(curVal) {
      this.onInputChange(curVal);
      if (curVal === '') {
        this.reSetHeight(this.$refs.textarea);
      }
      // this.$refs.textarea.style.paddingBottom = '0px';
    },
  },
};
</script>

