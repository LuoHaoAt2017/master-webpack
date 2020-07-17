<template>
    <div id="form-formula" v-show="isVisible">
        <div class="content bd-bot">
            <div class="left">
                <p class="dp-font30">{{formVal.DisplayName}}<i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
                    <span class="require" v-if="formVal.Required&&formVal.Editable">*</span>
                </p>
            </div>
            <div class="right">
                <!-- <input class="dp-font30" :placeholder="placeholder" type="text" readonly v-if="!value" v-model="value"> -->
                <pre class="text dp-font30" @click="openUrl($event)" v-html="showValue"></pre>
            </div>
        </div>
        <!-- <input type="text" class="cover" readonly v-if="!formVal.Editable"> -->
    </div>
</template>
<script>
import mixin from '../../../mixins/base-controler';
import { IToKbit, testUrlReg } from '../../../config/common';
import { openLink } from '../../../config/dingtalk-interface';

export default {
  name: 'FormFormula',
  props: ['formVal', 'keyName', 'ObjectId'],
  data() {
    return {
      isQuestionShowBol: false,
      placeholder: '系统自动生成',
      isSetValueBol: false,
      value: '',
      // 邦定的类型
      BindControlType: {
        Text: 'text',
        DateTime: 'datetime',
        Number: 'number',
        Bool: 'boolean',
      },
      // 绑定类型为数值时需要使用
      NumberMode: {
        Normal: '0',
        Kbit: '1',
      },
      isVisible: true,
      showValue: '',
    };
  },
  // baseControler的方法混入
  mixins: [mixin],
  created() {
    // 如果文本只读，需要识别出链接并替换成可点击状态
    this.markUrl();
  },
  mounted() {
    this.$nextTick(() => {
      this.InitValue(this.formVal.Value);
    });
  },
  methods: {
    markUrl() {
      if (this.formVal.Value && this.formVal.bindtype === this.BindControlType.Text) {
        this.showValue = `${this.formVal.Value}`.replace(testUrlReg, str => `<span class="dp-font30">${str}</span>`);
      } else {
        this.showValue = this.formVal.Value;
      }
    },
    openUrl(e) {
      if (e.target.tagName === 'SPAN') {
        let url = e.target.innerText;
        url = /^www./.test(url) ? `http://${url}` : url;
        openLink(url, '无效的网址或URL链接');
      }
    },
    GetValue() {
      let val = this.value ? this.value : '';
      if (this.formVal.showmode === this.NumberMode.Kbit) {
        val = val.replace(/,/gi, '');
      }
      return val;
    },
    SetValue(v) {
      let val = v;
      if (!this.formVal.Editable) {
        if (
          this.formVal.bindtype === this.BindControlType.Number &&
          $.isNumeric(this.formVal.decimalplaces) &&
          val !== '' &&
          val !== null
        ) {
          val = parseFloat(val).toFixed(this.formVal.decimalplaces);
        }
        if (this.formVal.bindtype === this.BindControlType.Number && this.formVal.showmode === this.NumberMode.Kbit) {
          val = IToKbit(val);
        }
      } else if (
        this.formVal.bindtype === this.BindControlType.Number &&
        this.formVal.showmode === this.NumberMode.Kbit
      ) {
        val = IToKbit(val);
      }
      this.isSetValueBol = true;
      this.value = val;
      this.formVal.Value = val;
      this.markUrl();
      this.OnChange();
    },
    InitValue(val) {
      this.isSetValueBol = true;
      this.value = val;
      this.formVal.Value = val;
    },
    GetNum() {
      const v = this.GetValue();
      if ($.isNumeric(v)) {
        return parseFloat(v);
      }
      return 0.0;
    },
    // hideQuestion() {
    //   this.isQuestionShowBol = !this.isQuestionShowBol;
    // },
    // 返回数据值
    SaveDataField() {
      const result = {};
      if (!this.formVal.Visible && !this.formVal.Editable) return result;
      result[this.formVal.dataField] = this.GetValue();

      return result;
    },
    getMatrixValue() {
      const val = {};
      val.showVal = this.GetValue();
      val.submitVal = this.GetValue();
      return val;
    },
  },
  computed: {},
};
</script>
<style lang="less">
@import '../../../assets/css/form-base.less';
#form-formula {
  background-color: white;
  .controlLayout;
  .content {
    .right {
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
}
</style>
