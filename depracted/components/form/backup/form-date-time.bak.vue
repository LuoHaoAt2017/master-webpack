<template>
    <div id="form-date-time" v-show="isVisible">
          <div class="data-wrapper bd-bot">
            <div class="left">
                <p class="dp-font30">{{formVal.DisplayName}}<span class="require" v-if="formVal.Required&&formVal.Editable">*</span><i v-if='formVal.description' @click='hideQuestion' class="icon-tip"></i>
                </p>
            </div>
            <div class="right" @click="pickDate">
                <span v-if="!value" style="color:#999;">{{placeholder}}</span>
                <span v-if="value">{{value}}</span>
                <span class="icon-next2" style="color:#999;" v-if="formVal.Editable"></span>
            </div>
          </div>
          <div class="question-wrap dp-font24" v-show='isQuestionShowBol'>{{formVal.description}}</div>
          <div class="error-wrap" @click="hideErrorWrap" v-if='errorBol'></div>
        <!-- <input type="text" class="cover" readonly v-if="!formVal.Editable"> -->
    </div>
</template>
<script>
import { Group, Datetime } from 'vux';
import mixin from '../../../mixins/base-controler';
import { isiOS } from '../../../config/common';

export default {
  name: 'FormDateTime',
  components: {
    Group,
    Datetime,
  },
  props: ['formVal', 'keyName', 'ObjectId'],
  data() {
    return {
      placeholder: '',
      isInGrid: false,
      gridDataField: '',
      dateType: '',
      errorBol: false,
      requiredVal: '',
      isQuestionShowBol: false,
      reg1: /^[1-9]\d{3}-(0[1-9]|1[0-2]$)/, // 年月
      reg2: /^[0-5]\d:[0-5]\d$/, // 时分
      reg3: /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/, // 年月日
      displayName: '',
      isSetValueBol: false,
      value: '',
      isVisible: true,
    };
  },
  mixins: [mixin],
  created() {
    this.initDatetimeMode();
    this.initPlaceholder();

    // 给日期-年月日后面添加占位符，确保样式一致
    if (this.formVal.DisplayName === '日期-年月日') {
      this.displayName = `${this.formVal.DisplayName}占位`;
    } else {
      this.displayName = this.formVal.DisplayName;
    }
    // 判断控件是否在子表内
    if (this.keyName.indexOf('.') > 1) {
      this.isInGrid = true;
      this.gridDataField = this.keyName.split('.')[0];
    }
  },
  mounted() {
    this.$nextTick(function a() {
      this.InitValue(this.formVal.Value);
    });
  },
  methods: {
    initPlaceholder() {
      if (this.formVal.Editable) {
        if (this.formVal.Required) {
          if (this.formVal.datetimemode === 'YYYY-MM-DD') {
            this.placeholder = '年-月-日(必填)';
          } else if (this.formVal.datetimemode === 'YYYY-MM') {
            this.placeholder = '年-月(必填)';
          } else if (this.formVal.datetimemode === 'HH:mm') {
            this.placeholder = '时:分(必填)';
          } else {
            this.placeholder = '年-月-日 时:分(必填)';
          }
          this.requiredVal = '*';
        } else if (this.formVal.datetimemode === 'YYYY-MM-DD') {
          this.placeholder = '年-月-日';
        } else if (this.formVal.datetimemode === 'YYYY-MM') {
          this.placeholder = '年-月';
        } else if (this.formVal.datetimemode === 'HH:mm') {
          this.placeholder = '时:分';
        } else {
          this.placeholder = '年-月-日 时:分';
        }
      } else {
        this.placeholder = '';
      }
    },
    initDatetimeMode() {
      if (this.formVal.datetimemode) {
        this.formVal.datetimemode = this.formVal.datetimemode.replace(/(yyyy-mm)|(dd)|(hh:ii)/g, (match) => {
          switch (match) {
            case 'yyyy-mm':
              return 'YYYY-MM';
            case 'dd':
              return 'DD';
            case 'hh:ii':
              return 'HH:mm';
            default:
              break;
          }
          return false;
        });
      }
    },
    resetDataTimeMode(val) {
      if (this.reg3.test(val)) {
        this.formVal.datetimemode = 'YYYY-MM-DD';
      } else if (this.reg2.test(val)) {
        this.formVal.datetimemode = 'HH:mm';
      } else if (this.reg1.test(val)) {
        this.formVal.datetimemode = 'YYYY-MM';
      } else {
        this.formVal.datetimemode = 'YYYY-MM-DD HH:mm';
      }
    },
    getFormatDateTime(val) {
      let v = val;
      this.initDatetimeMode();
      if (!v || v === -1) {
        return '';
      }
      v = `${v}`;
      let formatDateTime = '';
      // 兼容ios手机
      if (isiOS) {
        if (v.length === 7) {
          v += '/01';
        } else if (v.length === 4) {
          v = `${v}/01/01`;
        } else if (v.length === 1 || v.length === 2) {
          v = `2001/${v}/01`;
        }
      }
      // 先判断传进来的值是否合法
      if (!(v instanceof Date) && v.indexOf('Date') < 0 && this.formVal.datetimemode !== 'HH:mm') {
        if (Number.isNaN(new Date(v.replace(/-/g, '/')).getTime())) {
          return '';
        }
      }
      if (this.formVal.datetimemode === 'YYYY-MM-DD') {
        if (v instanceof Date) {
          formatDateTime = new Date(v).Format('yyyy/MM/dd');
        } else if (v.indexOf('Date') > -1) {
          formatDateTime = new Date(parseInt(v.replace('/Date(', '').replace(')/', ''), 10)).Format('yyyy/MM/dd');
        } else {
          formatDateTime = new Date(v.replace(/-/g, '/').replace(/T/g, ' ')).Format('yyyy/MM/dd');
        }
        // 验证是否是合法的日期
        if (Number.isNaN(new Date(formatDateTime).getTime())) {
          return '';
        }
      } else if (this.formVal.datetimemode === 'HH:mm') {
        if (v.length > 5) {
          const reg = /\d{4}(-|\/|.)\d{1,2}\1\d{1,2}/;
          if (reg.test(v)) {
            if (v.length === 10) {
              formatDateTime = '00:00';
            } else {
              if (v.indexOf('Date') > -1) {
                v = new Date(parseInt(v.replace('/Date(', '').replace(')/', ''), 10)).Format('yyyy-MM-dd hh:mm');
              }
              formatDateTime = v.slice(11, 16);
            }
          }
        } else {
          formatDateTime = v.substr(0, 5);
        }
      } else if (this.formVal.datetimemode === 'YYYY-MM') {
        if (v instanceof Date) {
          formatDateTime = new Date(v).Format('yyyy/MM');
        } else if (v.indexOf('Date') > -1) {
          formatDateTime = new Date(parseInt(v.replace('/Date(', '').replace(')/', ''), 10)).Format('yyyy/MM');
        } else {
          formatDateTime = new Date(v.replace(/-/g, '/')).Format('yyyy/MM');
        }
        // formatDateTime = formatDateTime + "/01"; //yyyy-mm,value：2017/01/01格式
      } else if (v instanceof Date) {
        formatDateTime = new Date(v).Format('yyyy/MM/dd hh:mm');
      } else if (v.indexOf('Date') > -1) {
        formatDateTime = new Date(parseInt(v.replace('/Date(', '').replace(')/', ''), 10)).Format('yyyy/MM/dd hh:mm');
      } else {
        formatDateTime = new Date(v.replace(/-/g, '/').replace(/T/g, ' ')).Format('yyyy/MM/dd hh:mm');
      }
      return formatDateTime;
    },
    setFormatDateTime(val) {
      let v = val;
      let formatDateTime = '';
      if (v) {
        formatDateTime = v.replace(new RegExp('/', 'gm'), '-');
      } else {
        return '';
      }

      // 防止计算规则的年份超出范围。现在只支持四位数字的年份
      if (this.formVal.datetimemode !== 'HH:mm') {
        if (isiOS) {
          formatDateTime = formatDateTime.replace(/\s{1}/g, 'T');
        }
        const value = new Date(formatDateTime);
        if (value.getFullYear() !== formatDateTime.substring(0, 4)) {
          return '';
        }
      }

      v = formatDateTime.replace(new RegExp('/', 'gm'), '-');

      if (this.formVal.datetimemode === 'YYYY-MM') {
        // yyyy-mm格式时去掉最后的-01日期，只显示到月，value格式为 2017-01-01，适用计算规则
        // return v.replace(/-01*$/, "")
        return v.substr(0, 7);
      }
      return v;
    },
    GetValue() {
      return this.value ? this.value : '';
    },
    SetValue(v) {
      let val = v;
      this.isSetValueBol = true;
      if (typeof val === 'boolean' || (val && val.toString() === 'Invalid Date')) {
        return;
      }
      if (val) {
        val = this.getFormatDateTime(val);
        val = val.replace(/\//g, '-');
      }
      if (val) {
        this.formVal.Value = val.replace(/-/g, '/');
      } else {
        this.formVal.Value = val;
      }
      this.value = val;
      this.OnChange();
    },
    InitValue(v) {
      let val = v;
      this.isSetValueBol = true;
      if (val) {
        val = this.getFormatDateTime(val);
        val = val.replace(/\//g, '-');
      }
      if (val) {
        this.formVal.Value = val.replace(/-/g, '/');
      } else {
        this.formVal.Value = val;
      }
      this.value = val;
    },
    clear() {
      // this.value = ''
      this.SetValue('');
    },
    pickDate() {
      if (!this.formVal.Editable) return;
      const that = this;
      this.$store.state.DateTimePluginShow = true;
      this.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        clearText: '清除',
        format: this.formVal.datetimemode,
        value: this.value,
        minYear: 1753,
        maxYear: 2200,
        onConfirm(val) {
          that.SetValue(val);
          that.$store.state.DateTimePluginShow = false;
          that.$store.state.isHtmlChangedBol = true;
        },
        onClear() {
          that.SetValue('');
        },
        onHide() {
          that.$store.state.DateTimePluginShow = false;
        },
      });
    },
    popDateHide() {
      this.$store.state.DateCotrolPopObj.bol = false;
      this.$store.state.DateCotrolPopObj.keyName = this.keyName;
      this.$store.state.DateCotrolPopObj.ObjectId = this.ObjectId;
    },
    popDateShow() {
      this.$store.state.DateCotrolPopObj.bol = true;
      this.$store.state.DateCotrolPopObj.keyName = this.keyName;
      this.$store.state.DateCotrolPopObj.ObjectId = this.ObjectId;
    },
    // 数据验证
    Validate() {
      // 不可编辑
      if (!this.formVal.Editable) return true;
      const $placeholder = $(this.$el)
        .find('.right')
        .children()
        .eq(0);
      const val = this.GetValue();
      if (this.formVal.Required && (val === undefined || val.trim() === '')) {
        $placeholder.css('color', '#E64340');
        this.errorBol = true;
        const self = this;
        setTimeout(() => {
          self.errorBol = false;
          $placeholder.css('color', '#999999');
        }, 1000);
        return false;
      }
      return true;
    },
    // 保存数据
    SaveDataField() {
      const result = {};
      if (this.formVal.dataField) {
        const value = this.GetValue();
        result[this.formVal.dataField] = value;
      }
      return result;
    },
    getMatrixValue() {
      const val = {};
      if (this.GetValue()) {
        val.showVal = this.GetValue()
          .replace(/-/g, '/')
          .replace(/T/g, ' ');
        val.submitVal = this.GetValue();
      }
      return val;
    },
    // hideQuestion() {
    //   this.isQuestionShowBol = !this.isQuestionShowBol;
    // },
  },
  computed: {},
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
#form-date-time {
  background-color: white;
  position: relative;
  animation-iteration-count: 3;
  animation-duration: 1s;
  .weui-cells {
    // margin-left: .24rem;
    .px2rem(margin-left,24);
    // .px2rem(padding-bottom,30);
    &:before {
      height: 0;
      border-top: 0;
    }
    &:after {
      border-bottom: none;
      height: 0;
    }
    .weui-cell {
      padding: 0;
      width: 100%;
      div:first-child {
        .perWidth(width, 238);
      }
      div {
        font-size: inherit;
        display: inline-block;
        p {
          // padding: .28rem 0;
          .px2rem(max-width,196);
          .px2rem(padding-top,28);
          .px2rem(padding-bottom,29);
          color: @font-color6;
          font-size: inherit;
          display: inline-block;
          color: white;
          // &:after{
          //     content: '占位';
          //     display: block;
          //     width: 2px;
          //     height: 2px;

          // }
        }
      }
    }
    .weui-cell__ft {
      .perWidth(width, 488);
      .px2rem(padding-left,2);
      // .px2rem(margin-left,-8);
      padding-right: 0;
      text-align: left;
      position: absolute;
      top: 14px;
      &:after {
        content: '';
        height: 0;
        width: 0;
        border-style: hidden;
      }
      .vux-cell-value {
        font-size: inherit;
        color: @font-color0;
      }
      .vux-cell-placeholder {
        font-size: inherit;
        color: @font-color9;
      }
    }
    .icon-next2 {
      position: absolute;
      .px2rem(right,24);
      .px2rem(line-height,98);
      top: 0;
      color: @font-color9;
    }
  }
  // .left {
  //     position:absolute;
  //     top: 0;
  //     left: 0;
  //     .perWidth(width, 238);
  //     color: @font-color6;
  //     .px2rem(margin-left,24);
  //     p {
  //         .px2rem(max-width,196);
  //         .px2rem(padding-top,28);
  //         .px2rem(padding-bottom,28);
  //         // .px2rem(padding-left,24);
  //     }
  //     .icon-tip{
  //         .px2rem(padding-left, 20);
  //         .px2rem(padding-right, 20);
  //     }
  // }

  div.data-wrapper {
    .px2rem(margin-left,24);
    // .px2rem(padding-top,29);
    // .px2rem(padding-bottom,29);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      .px2rem(flex-basis,238);
      color: @font-color6;
      text-align: left;
      p {
        .px2rem(max-width,196);
        .px2rem(padding-top,28);
        .px2rem(padding-bottom,28);
      }
      .icon-tip {
        .px2rem(padding-left, 20);
        .px2rem(padding-right, 20);
      }
    }
    .right {
      .px2rem(flex-basis,488);
      .px2rem(padding-right,24);
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        .px2rem(font-size,30);
      }

      // text-align: left;
    }
  }

  .error-wrap {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 0, 0, 0.06);
    // -webkit-animation: twinkling .2s 2;
    animation: twinkling 0.5s linear infinite;
  }
  @-webkit-keyframes twinkling {
    0% {
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes twinkling {
    0% {
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  .question-wrap {
    color: @font-color6;
    background-color: #f5f5f5;
    padding: 2px 12px 4px;
    position: relative;
    word-wrap: break-word;
    &:before {
      content: ' ';
      border-bottom: 7px solid #f5f5f5;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      position: absolute;
      left: 28px;
      top: -7px;
    }
    &:after {
      content: ' ';
      border-bottom: 5px solid #f5f5f5;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      position: absolute;
      left: 30px;
      top: -5px;
    }
  }
}
</style>
