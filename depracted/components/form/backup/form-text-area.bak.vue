<template>
<!--  :class='{"animated pulse":errorBol}' -->
    <div id="form-text-area" v-show="isVisible">
        <div class="content" :class="{'bd-bot':!isInGrid&&!isQuestionShowBol}">
            <div class="left">
                <p class="dp-font30">{{formVal.DisplayName}}<span class="require" v-if="formVal.Required&&formVal.Editable">*</span><i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
                </p>
            </div>
            <div class="right" :class="{'count-padding-bottom':value&&formVal.Editable}">
                <textarea v-if="formVal.Editable" class="dp-font30 textarea" type="text" :class="[errorBol?'error':'']" @input='getInputVal' :rows="rows" maxlength="2000" ref="outText" :placeholder="placeholder" v-model="value" @click="inputFocus" v-on:focus="Focus" v-on:blur="Blur"></textarea>
                <pre class="text dp-font30" @click="openUrl($event)" v-if="!formVal.Editable" v-html="showValue"></pre>
                <span class="num-count dp-font24" v-if="value&&formVal.Editable">({{letterLength}}/2000)</span>
            </div>
        </div>
        <div class="question-wrap dp-font24" v-show='isQuestionShowBol'>{{formVal.description}}</div>
        <!-- <div class="fix-content dp-font30" :class="[$store.state.corpId?'ding-top':'']" v-if='fixHeadBol'>{{formVal.DisplayName}}</div> -->
        <div class="error-wrap" @click="hideErrorWrap" v-if='errorBol'></div>
        <!-- <input type="text" class="cover" readonly v-if="!formVal.Editable"> -->
    </div>
</template>

<script>
import mixin from '../../../mixins/base-controler';
import { openLink } from '../../../config/dingtalk-interface';
import { testUrlReg } from '../../../config/common';

export default {
  name: 'FormTextArea',
  props: ['formVal', 'keyName', 'ObjectId'],
  data() {
    return {
      isFocus: false, // 判断是否聚焦
      isInGrid: false,
      gridDataField: '',
      commonRemark: '(不超过2000个字)',
      letterLength: '',
      errorBol: false,
      fixHeadBol: false,
      initialHeight: 0,
      isQuestionShowBol: false,
      placeholder: '',
      value: '',
      isVisible: true,
      rows: '',
      showValue: '',
    };
  },
  // baseControler的方法混入
  mixins: [mixin],
  created() {
    // 判断控件是否在子表内
    if (this.keyName.indexOf('.') > 1) {
      this.isInGrid = true;
      this.gridDataField = this.keyName.split('.')[0];
    }
    this.formVal.DisplayName = this.formVal.DisplayName.trim();
    this.initPlaceholder();
    // 判断rows行数
    if (this.formVal.Editable) {
      this.rows = Number(this.formVal.rows);
    } else {
      this.rows = 1;
    }
    // 如果文本只读，需要识别出链接并替换成可点击状态
    this.markUrl();
  },
  mounted() {
    // this.ControlFixHead();
    // this.value = this.formVal.Value;
    this.$nextTick(function a() {
      this.InitValue(this.formVal.Value);
      this.computeValLen();
      this.setAutoHeight();
    });
  },
  activated() {
    this.setAutoHeight();
  },
  methods: {
    markUrl() {
      let value = this.formVal.Value || '';
      if (this.formVal.Value === false) {
        value = false;
      }
      if (!this.formVal.Editable) {
        this.showValue = `${value}`.replace(testUrlReg, str => `<span class="dp-font30">${str}</span>`);
        return;
      }
      this.showValue = value;
    },
    openUrl(e) {
      if (e.target.tagName === 'SPAN') {
        let url = e.target.innerText;
        url = /^www./.test(url) ? `http://${url}` : url;
        openLink(url, '无效的网址或URL链接');
      }
    },
    computeValLen() {
      // 记录字数
      const ret = this.value ? this.value.toString() : this.value;
      if (ret) {
        this.letterLength = ret.length;
      }
    },
    inputFocus() {
      this.isFocus = true;
      this.$refs.outText.focus();
      this.$emit('input');
    },
    getInputVal(e) {
      this.isFocus = true;
      this.$store.state.isHtmlChangedBol = true;
      this.letterLength = e.target.value.length;
      this.value = e.target.value;
      this.formVal.Value = this.value;
      this.OnChange();
    },
    initPlaceholder() {
      if (this.formVal.Editable) {
        if (!this.formVal.placeholder) {
          if (this.formVal.Required) {
            this.placeholder = `请输入${this.formVal.DisplayName}(必填)`;
          } else {
            this.placeholder = `请输入${this.formVal.DisplayName}`;
          }
        } else if (this.formVal.Required) {
          this.placeholder = `${this.formVal.placeholder}(必填)`;
        } else if (!this.formVal.Required) {
          this.placeholder = `${this.formVal.placeholder}`;
        }
      } else {
        this.placeholder = '';
      }
    },
    GetValue() {
      if (this.value == null) {
        return '';
      }
      return typeof this.value === 'string' ? this.value : String(this.value);
    },
    SetValue(val) {
      this.value = val;
      this.formVal.Value = val;
      // if (!this.formVal.Editable) {
      this.markUrl();
      // }
      this.computeValLen();
      this.setAutoHeight();
      this.OnChange();
    },
    InitValue(val) {
      this.value = val;
      this.formVal.Value = val;
      this.setAutoHeight();
      this.OnChange();
    },
    setAutoHeight() {
      // if (this.value) {
      this.$nextTick(() => {
        const textarea = this.$el.querySelector('textarea');
        if (textarea) {
          textarea.style.height = 'auto';
          const height = textarea.scrollHeight;
          textarea.style.height = `${height}px`;
        }
      });
      // }
    },
    // 数据验证
    Validate() {
      const val = this.GetValue();
      // 不可编辑
      if (!this.formVal.Editable) return true;

      if (this.formVal.Required && (val == null || val.trim() === '')) {
        this.errorBol = true;
        const self = this;
        setTimeout(() => {
          self.errorBol = false;
        }, 1000);
        return false;
      }
      return true;
    },
    clearVal() {
      // this.value = ''
      this.SetValue('');
    },
    Focus() {
      this.isFocus = true;
      $(this.$el)
        .find('input')
        .select();
      // console.log($('.textarea'))
      // $(this.$el).find('.textarea').scrollIntoView();
    },
    Blur() {
      if (this.formVal.Required) {
        if (!this.formVal.Value) {
          this.errorBol = true;
          const self = this;
          setTimeout(() => {
            self.errorBol = false;
          }, 1000);
        }
      }
    },
    // 返回数据值
    SaveDataField() {
      const result = {};
      if (this.GetValue()) {
        result[this.formVal.dataField] = this.GetValue().replace(/\s+$/g, '');
      } else {
        result[this.formVal.dataField] = this.GetValue() == null ? '' : this.GetValue();
      }
      return result;
    },
    getMatrixValue() {
      const val = {};
      val.showVal = this.GetValue();
      val.submitVal = this.GetValue();
      return val;
    },
    // hideQuestion() {
    //   this.isQuestionShowBol = !this.isQuestionShowBol;
    // },
  },
  watch: {
    value() {
      this.setAutoHeight();
      // this.$store.state.isHtmlChangedBol = true;
      if (this.isInGrid) {
        this.$store.state.isGridOnChange += 1;
        this.$store.state.gridChoosedDom = this;
      }
    },
  },
};
</script>

<style lang="less">
@import '../../../assets/css/form-base.less';
#form-text-area {
  background-color: white;
  .controlLayout;
  .content {
    .count-padding-bottom {
      // padding-bottom: .47rem;
      .px2rem(padding-bottom,24);
    }
  }
  .right {
    position: relative;
    .px2rem(margin-top,3);
    .px2rem(margin-bottom,-3);
    .num-count {
      position: absolute;
      // bottom: 0.28rem;
      .px2rem(bottom,8);
      right: 0;
      color: @font-color9;
    }
    .text {
      .px2rem(margin-top,15);
      .px2rem(margin-bottom,15);
      word-break: break-all;
      overflow: hidden;
      white-space: pre-wrap;
      span {
        color: #1890FF;
      }
    }
  }
}
</style>
