<template>
<!--  :class='{"animated":errorBol}' -->
  <div id="form-text-box" v-show="isVisible">
    <div class="content" :class="{'bd-bot':!isInGrid&&!isQuestionShowBol}">
      <div class="left">
        <p class="dp-font30">{{formVal.DisplayName}}<span class="require" v-if="formVal.Required&&formVal.Editable">*</span><i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
        </p>
      </div>
      <div class="right">
        <textarea @keydown="checkEnter($event)" rows='1' v-if="formVal.Editable" :class="[textareaWidth?'scan-width':'normal-width',errorBol?'error':'']" class="dp-font30 textarea" maxlength="200" type="text" :readonly='inputByScan&&formVal.scanupdateenable=="false"' @input='getInputVal' ref="outText" :placeholder="placeholder" @click="inputFocus" v-model="value" v-on:focus="Focus" v-on:blur="Blur"></textarea>
        <div class="text dp-font30" @click="openUrl($event)" v-if="!formVal.Editable" v-html="showValue"></div>
      </div>
      <div class="icon icon-saoyisao" v-if='inputByScan' @click='scan'></div>
      <div class="icon icon-dianhua" v-if='telShow' @click='dialTelephone'></div>
      <h3-icon class="icon" type="contacts" v-if='selectTelShow && !inputByScan' @onClick='selectTelephone'></h3-icon>
      <div class="icon icon-search2" v-if="hasBindClick" @click="executeCustomFun"></div>
    </div>
    <div class="question-wrap dp-font24" v-show='isQuestionShowBol'>{{formVal.description}}</div>
    <div class="validate-error-wrap dp-font28" :class="{'validate-error-top':$store.state.corpId}" v-if='validateErrorBol'>{{invalidText}}</div>
    <div class="error-wrap" v-if='errorBol' @click="hideErrorWrap"></div>
    <!-- <input type="text" class="cover" readonly v-if="!formVal.Editable"> -->
  </div>
</template>

<script>
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import mixin from '../../../mixins/base-controler';
import { callCommonTelephone, selectTelephone, openLink } from '../../../config/dingtalk-interface';
import h3Icon from '../../../../packages/components/h3-icon/index';
import { testUrlReg } from '../../../config/common';

export default {
  name: 'FormTextBox',
  props: ['formVal', 'keyName', 'ObjectId'],
  components: {
    h3Icon,
  },
  data() {
    return {
      isFocus: false, // 判断是否聚焦
      inputByScan: false,
      isInGrid: false,
      gridDataField: '',
      commonRemark: '(不超过200个字)',
      invalidText: '', // 格式校验提示语
      validateErrorBol: false, // 格式校验bol
      errorBol: false,
      isQuestionShowBol: false,
      placeholder: '',
      isSetValueBol: false,
      value: '',
      textareaWidth: false,
      hasBindClick: false, // 是否绑定click事件
      customFun: null, // 自定义事件
      isVisible: true,
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
    // textarea的长度
    if (this.inputByScan || this.formVal.mode === 'Telephone') {
      this.textareaWidth = true;
    }
    // 如果文本只读，需要识别出链接并替换成可点击状态
    this.markUrl();
  },
  mounted() {
    this.$nextTick(() => {
      this.InitValue(this.formVal.Value);
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
    dialTelephone() {
      callCommonTelephone(this.value);
    },
    selectTelephone() {
      const me = this;
      selectTelephone((data) => {
        if (data.length > 0) {
          me.SetValue(data[0].mobile);
        }
      });
    },
    hideErrorWrap(event) {
      $(event.target).hide();
      this.errorBol = false;
      $(this.$el)
        .find('textarea')
        .focus();
    },
    inputFocus() {
      this.isFocus = true;
      this.$refs.outText.focus();
      // this.$el.querySelector('textarea').focus();
      this.$emit('input');
    },
    getInputVal(e) {
      this.isFocus = true;
      this.$store.state.isHtmlChangedBol = true;
      this.value = e.target.value;
      this.formVal.Value = this.value;
    },
    initPlaceholder() {
      if (this.formVal.Editable) {
        if (this.formVal.inputbyscan === 'true') {
          this.inputByScan = true;
          if (this.formVal.Required) {
            this.placeholder = '扫一扫添加(必填)';
          } else {
            this.placeholder = '扫一扫添加';
          }
        } else if (!this.formVal.placeholder) {
          if (this.formVal.Required) {
            this.placeholder = `请输入${this.formVal.DisplayName}(必填)`;
          } else {
            this.placeholder = `请输入${this.formVal.DisplayName}`;
          }
        } else if (this.formVal.Required) {
          this.placeholder = `${this.formVal.placeholder}(必填)`;
        } else {
          this.placeholder = this.formVal.placeholder;
        }
      } else {
        this.placeholder = '';
      }
      this.$forceUpdate();
    },
    GetValue() {
      return this.value == null || this.value === undefined ? '' : this.value.toString();
    },
    SetValue(val) {
      this.isSetValueBol = true;
      this.value = val;
      this.formVal.Value = val;
      // if (!this.formVal.Editable) {
      this.markUrl();
      // }
      this.setAutoHeight();
      this.OnChange();
    },
    InitValue(val) {
      this.isSetValueBol = true;
      this.value = val;
      this.formVal.Value = val;
      this.setAutoHeight();
    },
    setAutoHeight() {
      this.$nextTick(() => {
        const textarea = this.$el.querySelector('textarea');
        if (textarea) {
          const height = textarea.scrollHeight;
          textarea.style.height = `${height}px`;
        }
      });
    },
    // 数据验证
    Validate() {
      this.ValidateFormat();
      const val = this.GetValue();
      // 不可编辑
      if (!this.formVal.Editable) return true;
      if (this.formVal.Required) {
        if (val == null || val.trim() === '') {
          this.errorBol = true;
          const self = this;
          setTimeout(() => {
            self.errorBol = false;
          }, 1000);
          return false;
        }
      }
      return true;
    },
    ValidateFormat() {
      let val = this.GetValue();
      if (val && this.formVal.mode) {
        let exp = '';
        let err = '';
        switch (this.formVal.mode) {
          case 'Email':
            exp = /^\w+([-+.]\w+)*@\w+([-+.]\w+)*\.\w+([-.]\w+)*$/;
            err = '错误的邮箱格式！';
            break;
          case 'Mobile':
          case 'Telephone':
            exp = /([^\d\+\-\s])/gi; // 电话号码只能有数字 空格 + -不能出现其他字符
            err = '错误的电话或手机号码格式！'; // "错误的电话或手机号码格式!";
            break;
          case 'Card':
            exp = /^\d{15}(\d{2}[A-Za-z0-9])?$/;
            err = '错误的身份证格式！';
            break;
          default:
        }
        let isValid = true;
        if (exp) {
          isValid = exp.test(val);
        }
        // 电话要验证手机和固话，其他只需要验证一个
        if (this.formVal.mode === 'Mobile' || this.formVal.mode === 'Telephone') {
          const mstr = val.match(exp);
          if (mstr != null && mstr.constructor === Array) {
            val = val.replace(exp, '');
            this.formVal.Value = val;
            this.validateErrorRemind(err);
          }
        } else if (!isValid) {
          this.validateErrorRemind(err);
        }
      }
    },
    validateErrorRemind(err) {
      this.invalidText = err;
      this.validateErrorBol = true;
      this.value = '';
      const self = this;
      setTimeout(() => {
        self.validateErrorBol = false;
      }, 3000);
      return false;
    },
    clearVal() {
      // this.value = "";
      this.SetValue('');
    },
    Focus() {
      this.isFocus = true;
      // $(this.$el).find('textarea').scrollIntoView();
    },
    Blur() {
      this.ValidateFormat();
      this.OnChange();
      this.isFocus = false;
      const FormTextVal = this.$refs.outText.value;
      const FormTextObj = {};
      FormTextObj[this.formVal.PropertyName] = [];
      FormTextObj[this.formVal.PropertyName].push(FormTextVal);
      this.$root.eventHub.$emit('send-form-text', FormTextObj);
      if (this.formVal.Required) {
        if (!this.GetValue()) {
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
        result[this.formVal.dataField] = this.GetValue()
          .toString()
          .trim();
      } else {
        result[this.formVal.dataField] = this.GetValue() == null ? '' : this.GetValue();
      }
      return result;
    },
    scan() {
      H3PluginDeveloper.IScanBarCode(this.scanCallback);
    },
    scanCallback(text) {
      this.SetValue(text);
    },
    // 禁止回车键
    checkEnter(es) {
      let e = es;
      let code;
      if (!e) e = window.event;
      if (e.keyCode) code = e.keyCode;
      else if (e.which) code = e.which;
      if (code === 13 && window.event) {
        e.returnValue = false;
      } else if (code === 13) {
        e.preventDefault();
      }
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
    BindClickEvent(clickfun) {
      // if (this.ClickEvent) return;

      if (clickfun == null) {
        return;
      }
      this.hasBindClick = true;
      this.customFun = clickfun;
    },
    executeCustomFun() {
      if (this.customFun && this.customFun.constructor.name === 'Function') {
        this.customFun.apply(this, [this, this.formVal.ObjectId]);
      }
    },
  },
  computed: {
    telShow() {
      return this.formVal.mode === 'Telephone' && !this.formVal.Editable;
    },
    selectTelShow() {
      return !window.GlobalConfig.isExternalForm && this.formVal.mode === 'Telephone' && this.formVal.Editable;
    },
  },
  watch: {
    value() {
      this.setAutoHeight();
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
#form-text-box {
  background-color: white;
  .controlLayout;
  .content {
    .right {
      .px2rem(margin-top,3);
      .px2rem(margin-bottom,-3);
      .scan-width {
        width: 87%;
      }
      .normal-width {
        width: 100%;
      }
      .text {
        .px2rem(margin-top,15);
        .px2rem(margin-bottom,15);
        word-break: break-all;
        span {
          color: #1890FF;
        }
      }
      // textarea{
      //   line-height: normal !important;
      // }
    }
    .icon-saoyisao,
    .icon-dianhua, .icon-base-contacts {
      .px2rem(font-size,50);
      color: @font-color9;
      .px2rem(top,28);
      position: absolute;
      .px2rem(right,24);
    }
    .icon-dianhua, .icon-base-contacts {
      color: #108ee9;
      z-index: 2;
    }
    .icon-search2 {
      color: #38adff;
      position: absolute;
      right: 0.32rem;
      top: 0.45333333rem;
      z-index: 99;
    }
  }
  .validate-error-wrap {
    position: fixed;
    left: 0;
    .px2rem(top,98);
    width: 100%;
    .px2rem(height,70);
    background-color: rgba(230, 67, 64, 0.9);
    color: white;
    text-align: center;
    .px2rem(line-height,70);
    transition: all 0.5s;
  }
  .validate-error-top {
    top: 0;
  }
  .aufont[class*=" icon-"]{
    font-family: "aufont" !important;
  }
}
</style>
