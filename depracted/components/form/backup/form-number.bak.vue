<template>
    <!--  :class='{"animated pulse":errorBol}' -->
    <div id="form-number" v-show="isVisible">
        <div class="content" :class="{'bd-bot':!isInGrid&&!isQuestionShowBol}">
            <div class="left">
                <p class=" dp-font30">{{formVal.DisplayName}}
                    <span class="require" v-if="formVal.Required&&formVal.Editable">*</span>
                    <i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
                </p>
            </div>
            <div class="right">
                <input class="dp-font30 textarea" type="text" :class="[errorBol?'error':'']" @input='getInputVal' :placeholder="placeholder"
                    v-model="value" v-on:focus="Focus" v-on:blur="Blur" v-if="formVal.Editable" @click="inputFocus" ref="outText">
                <div class="text dp-font30" v-if="!formVal.Editable">{{value}}</div>
            </div>
            <div class="icon icon-search2" v-if="hasBindClick" @click="executeCustomFun"></div>
        </div>
        <div class="question-wrap dp-font24" v-show='isQuestionShowBol'>{{formVal.description}}</div>
        <div class="error-wrap animated" @click="hideErrorWrap" v-if='errorBol'></div>
        <!-- <input type="text" class="cover" readonly v-if="!formVal.Editable"> -->
    </div>
</template>

<script>
import { IToKbit } from '../../../config/common';
import mixin from '../../../mixins/base-controler';

export default {
  name: 'FormNumber',
  props: ['formVal', 'keyName', 'ObjectId'],
  data() {
    return {
      Expression: /^(-){0,1}[0-9]+\.{0,1}[0-9]*$/,
      thousandExpression: /^(-)?\d{0,3}(,\d{3})*(.\d+)?$/,
      ErrorAlert: '',
      isFocus: false,
      // 整数最大长度，超过21位的话，就会变成科学计数法
      IntegerMaxLength: 15,
      // 小数最大长度，超过5位的话，就会变成科学计数法
      DecimalMaxLength: 5,
      isInGrid: false,
      gridDataField: '',
      decimalplaces: '',
      errorBol: false,
      isQuestionShowBol: false,
      placeholder: '',
      isSetValueBol: false,
      value: '',
      isVisible: true,
      hasBindClick: false, // 是否绑定click事件
    };
  },
  mixins: [mixin],
  created() {
    // 判断控件是否在子表内
    if (this.keyName && this.keyName.indexOf('.') > 1) {
      this.isInGrid = true;
      this.gridDataField = this.keyName.split('.')[0];
    }
    this.formVal.DisplayName = this.formVal.DisplayName.trim();
    this.initPlaceholder();
    this.decimalplaces = Number(this.formVal.decimalplaces);
  },
  mounted() {
    this.$nextTick(function a() {
      this.InitValue(this.formVal.Value);
    });
  },
  methods: {
    inputFocus() {
      this.isFocus = true;
      this.$refs.outText.focus();
      // this.$el.querySelector('textarea').focus();
      this.$emit('input');
    },
    getInputVal() {
      this.isFocus = true;
      this.$store.state.isHtmlChangedBol = true;
      const val = this.value;
      let tmpValue = '';
      tmpValue = (`${val}`).replace(/,/g, '');
      if ($.isNumeric(tmpValue)) {
        tmpValue = this.setDecimalMode(val, this.decimalplaces);
        this.formVal.Value = tmpValue;
      } else {
        this.formVal.Value = 0;
      }
      this.OnChange();
    },
    // 初始化placeholder
    initPlaceholder() {
      // 设置placeholder 优化成三元式
      if (this.formVal.Editable) {
        if (!this.formVal.placeholder) {
          if (this.formVal.Required) {
            this.placeholder = `请输入${this.formVal.DisplayName}(必填)`;
          } else {
            this.placeholder = `请输入${this.formVal.DisplayName}`;
          }
        } else if (this.formVal.Required) {
          this.placeholder = `${this.formVal.placeholder}(必填)`;
        }
      } else {
        this.placeholder = '';
      }
    },
    setThousandMode(val) {
      // 设置千分位
      return IToKbit(val);
    },
    setDecimalMode(val, decimalplaces) {
      // 设置小数位数
      return Number(val).toFixed(decimalplaces);
    },
    GetValue() {
      const tempValue = this.value ? Number((`${this.value}`).replace(/,/g, '')) : '';
      return tempValue;
    },
    GetNum() {
      let v = this.GetValue();
      if (!v) {
        return 0.0;
      }
      v = (`${v}`).replace(/,/g, '');
      if ($.isNumeric(v)) {
        return parseFloat(v);
      }
      return 0.0;
    },
    SetValue(val) {
      this.isSetValueBol = true;
      if (!val && val !== 0 && !this.formVal.ComputationRule) {
        this.value = '';
        this.formVal.Value = '';
        return;
      }
      let tmpValue = '';
      tmpValue = (`${val}`).replace(/,/g, '');
      if ($.isNumeric(tmpValue)) {
        tmpValue = this.formatNumberLength(tmpValue);
        if (this.formVal.decimalplaces) {
          tmpValue = this.setDecimalMode(tmpValue, this.decimalplaces);
        } else if (this.formVal.decimalplaces === '') {
          tmpValue = this.setDecimalMode(tmpValue, 0);
        }
        if (this.value !== '' && `${this.value}` === tmpValue) return;
        this.formVal.Value = tmpValue;
        if (this.formVal.showmode === '1') {
          tmpValue = this.setThousandMode(tmpValue);
        }
        this.value = tmpValue;
      } else {
        if (this.value !== '' && `${this.value}` === val) return;
        this.value = '';
        this.formVal.Value = '';
      }
      this.OnChange();
    },
    // 超出数字位数截断成最多15位
    formatNumberLength(value) {
      let tmpValue = value;
      if (tmpValue.indexOf('.') > -1) {
        if (tmpValue.split('.')[0].length > this.IntegerMaxLength) {
          tmpValue = `${tmpValue.split('.')[0].substring(0, this.IntegerMaxLength)}.${tmpValue.split('.')[1]}`;
        }
      } else if (tmpValue.length > this.IntegerMaxLength) {
        tmpValue = tmpValue.substring(0, this.IntegerMaxLength);
      }
      return tmpValue;
    },
    InitValue(val) {
      this.isSetValueBol = true;
      if (!val && val !== 0 && !this.formVal.ComputationRule) {
        this.value = '';
        this.formVal.Value = '';
        return;
      }
      let tmpValue = '';
      tmpValue = (`${val}`).replace(/,/g, '');
      if ($.isNumeric(tmpValue)) {
        if (this.formVal.decimalplaces) {
          tmpValue = this.setDecimalMode(tmpValue, this.formVal.decimalplaces);
        }
        this.formVal.Value = tmpValue;
        if (this.formVal.showmode === '1') {
          tmpValue = this.setThousandMode(tmpValue);
        }
        // tmpValue = tmpValue?tmpValue:val;
        this.value = tmpValue;
      } else {
        this.value = val;
        // this.formVal.Value=0;
        this.formVal.Value = val;
      }
    },
    // 数据验证
    Validate() {
      // 不可编辑
      if (!this.formVal.Editable) return true;
      // add by xc  解决小数点输入不方便问题
      const vStr = this.GetValue();
      if (vStr === 0) {
        return true;
      }
      if (this.formVal.Required && (!vStr || vStr === '')) {
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
      // this.isSetValueBol = true;
      // $('.textarea').scrollIntoView();
      $(this.$el)
        .find('input')
        .select();
    },
    Blur(e) {
      let val;
      this.isFocus = false;
      val = e.target.value;
      val = val.replace(/\,/g, '');
      if (val === '-' || !$.isNumeric(Number(val))) {
        e.target.value = '';
      } else if (this.decimalplaces === 0 && val !== '' && $.isNumeric(Number(val))) {
        e.target.value = Number(val).toFixed(0);
        e.target.value = this.formatNumberLength(val);
      }

      if (this.formVal.Required) {
        if (!this.GetValue()) {
          this.errorBol = true;
          const self = this;
          setTimeout(() => {
            self.errorBol = false;
          }, 1000);
        }
      }
      this.SetValue(e.target.value);
    },

    // 返回数据值
    SaveDataField() {
      const result = {};
      let val = this.GetValue();
      if (val === '-') {
        val = '';
      }
      result[this.formVal.dataField] = val == null ? '' : val.toString().trim();
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
    // 数值控件点击事件
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
  watch: {
    value() {
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
#form-number {
  background-color: white;
  .controlLayout;
  .content {
    .icon-search2 {
      .px2rem(font-size,50);
      .px2rem(top,28);
      position: absolute;
      .px2rem(right,24);
      color: #108ee9;
      z-index: 2;
    }
  }
}
</style>
