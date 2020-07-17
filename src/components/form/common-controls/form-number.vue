<template>
  <ControlWrapper
    class="form-number"
    :visible="visible"
    :error="valid.empty || valid.value"
    :disabled="disabled"
  >
    <h3-field
      :watchValue="watchValue"
      :label="options.DisplayName"
      :required="editable && options.Required"
      :tip="options.description"
      :layout="controlLayout"
      :showIcon="iconShow"
    >
      <div class="form-number-content" @click="inputClick()">
        <div v-if="editable">
          <input
            v-show="isFocus"
            ref="numberInput"
            v-model.trim="tempValue"
            type="number"
            :placeholder="placeholder"
            @focus="onFocus($event)"
            @blur="onBlur($event)"
          />
          <input
            v-show="!isFocus"
            v-model="displayValue"
            type="text"
            :placeholder="placeholder"
            :class="{'h3-field-placeholder': !displayValue}"
          />
        </div>
        <div v-if="!editable" class="h3-field-text">
          {{ displayValue }}
        </div>
      </div>
      <div slot="extra" class="icon-wapper">
        <h3-touch v-show="editable && isFocus && tempValue" :onTouchStart="onClear">
          <span class="extra-icon">
            <i class="icon-clear"></i>
          </span>
        </h3-touch>
        <h3-touch v-show="hasBindClick" :onTouchStart="onBindClick">
          <span class="extra-icon">
            <i class="icon h3yun_All search-o"></i>
          </span>
        </h3-touch>
      </div>
    </h3-field>
  </ControlWrapper>
</template>

<script lang='ts'>
import {
  H3List, H3Input, H3Field, H3Touch,
} from 'h3-mobile-vue';
import { namespace } from 'vuex-class';
import { Component, Mixins, Watch } from 'vue-property-decorator';
import baseControler from '../mixins/base-controler';
import ControlWrapper from '../shared/control-wrapper.vue';
import { FormNumberOptions } from '@/lib/form-logic/types/control-options-map';
import { FormActionType } from '../../../store/modules/form/types';
// import { isiOS } from '@/config/common';
const FormModule = namespace('Form');
const watch = arg => arg;
@Component({
  components: {
    H3Input,
    H3List,
    H3Field,
    ControlWrapper,
    H3Touch,
  },
})
export default class FormNumber extends Mixins(baseControler) {
  placeholder: string = '请填写';

  // 错误提示相关
  showErr: boolean = false;

  floater: number = 0;

  clearing: boolean = false;

  intMaxLength: number = 15;

  isFocus: boolean = false;

  tempValue: string = '';

  options!: FormNumberOptions;

  @FormModule.Action(FormActionType.SHOWVALIDMSG)
  showValidMsg;

  get unit () {
    return this.options.percentage ? '%' : '';
  }

  // get hasBindClick () {
  //   watch(this.notice);
  //   return this.$parent.context[this.dataField].hasBindClick;
  // }

  get iconShow () {
    if (this.hasBindClick) {
      return true;
    }
    // 禁用状态
    if (this.disabled) {
      return false;
    }
    if (!this.editable) {
      return false;
    }
    return true;
  }

  get displayValue () {
    if (!this.isFocus) {
      let value = this.tempValue;
      value = this.toFixed(value);
      value = this.formatValue(value);
      return value ? value + this.unit : value;
    }
    return '';
  }

  get watchValue () {
    const val = this.value;
    if (val) {
      this.tempValue = val;
    } else {
      this.tempValue = '';
    }
    return val;
  }

  @Watch('value')
  valueChanged (val, oldVal) {
    if (val !== oldVal && this.tempValue !== val) {
      this.tempValue = val;
    } else {
      this.tempValue = '';
    }
  }

  created () {
    this.options.percentage = false;
    this.tempValue = this.value;
    this.floater = this.options.decimalplaces;
  }

  inputClick () {
    if (!this.editable) {
      return;
    }
    if (this.isFocus) {
      return;
    }
    this.isFocus = true;
    this.clearValid();
    this.$nextTick(() => {
      (this.$refs.numberInput as any).focus();
    });
  }

  onClear () {
    this.clearValid();
    this.tempValue = '';
    this.clearing = true;
    this.$updateValue('');
  }

  onBindClick () {
    if (this.hasBindClick) {
      this.triggerClickFunc();
    }
  }

  onFocus (event) {
    // 软键盘挡住输入框，不为0光标会错位
    // if(isiOS){
    //   setTimeout(function(){
    //     event.target.scrollIntoView(true);
    //   },0);
    // }
    // 修复number类型输入框中非法输入导致值再次聚焦时被缓存问题
    event.target.value = this.tempValue || null;
  }

  onBlur (event) {
    if (this.clearing) {
      // (this.$refs.numberInput as any).focus()
      this.clearing = false;
    } else {
      let value = event.target.value;
      // 触发执行前端事件
      if (value) {
        this.getFrontEventsValue({
          value: value,
          namespace: this.namespace,
        });
      }
      value = this.toFixed(value);
      this.tempValue = this.formatNumberLength(value);
      this.isFocus = false;
      this.valueValidate();
    }
  }

  triggerClickFunc () {
    this.triggerClick({ namespace: this.namespace });
  }

  formatValue (value) {
    if (!this.isFocus && value && value !== '') {
      if (this.options.showmode == '1') {
        value = this.toThousands(value);
      }
    }
    return value;
  }

  /**
   * 千分位转换
   */
  toThousands (num) {
    const nums = num.toString().split('.');
    let tmpNum = nums[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    if (nums.length > 1) {
      tmpNum += `.${nums[1]}`;
    }
    return tmpNum;
  }

  /**
   * 位数补充
   */
  toFixed (val: any) {
    let value:string = val + '';
    if (value !== '') {
      const arr = value.split('.');
      const realFloat = (arr.length > 1 && arr[1]) ? arr[1].length : 0;
      if (realFloat > this.floater) {
        value = parseFloat(value || '0')
          .toFixed(this.floater)
          .toString();
      } else if (this.floater > 0) {
        // 自动补全小数点和后面的位数
        const dot = (value.toString()).indexOf('.') > -1 ? '' : '.';
        // 自动补全小数点前的0
        const zerro = dot === '' && value.toString()[0] === '.' ? '0' : '';
        value = `${zerro}${value}${dot}` +
          Array(this.floater - realFloat + 1).join('0');
      }
    }
    return value;
  }

  /**
   * 超出数字小数点前位数截断成最多15位
   */
  formatNumberLength (value) {
    let tmpValue = value;
    if (tmpValue.indexOf('.') > -1) {
      if (tmpValue.split('.')[0].length > this.intMaxLength) {
        tmpValue = `${tmpValue.split('.')[0].substring(0, this.intMaxLength)}.${tmpValue.split('.')[1]}`;
      }
    } else if (tmpValue.length > this.intMaxLength) {
      tmpValue = tmpValue.substring(0, this.intMaxLength);
    }
    return tmpValue;
  }

  /**
   * 校验格式是否非法
   */
  valueValidate () {
    const value = this.tempValue;
    if (/\d|\.|-/.test(value)) {
      if (this.floater > 0) {
        const decimal = value.match(/\./g);
        if (decimal && decimal.length > 1) {
          // 小数点输入超出位数限制
          this.tempValue = '';
        } else if (!new RegExp(`^-?(\\.|(0|\\d+))?(\\.?\\d{0,${this.floater}})?$`).test(value)) {
          // 数据格式错误
          this.tempValue = '';
        } else {
          this.valid.value = false;
        }
      }
    }
    this.$forceUpdate();
    // 校验通过才允许更新值
    if (!this.valid.empty && !this.valid.value) {
      this.$updateValue(this.tempValue);
    }
  }
}
</script>

<style lang="less">
  @import '~@/styles/form-base.less';
  .form-number{
    position: relative;
    .form-number-content{
      height: 100%;
      input{
        width:100%;
        height: 25px;
        line-height: 25px;
        vertical-align: middle;
        padding: 0;
        color: #333;
        background-color: transparent;
      }
    }
    .h3-field-text, input{
      font-size: 15px;
    }
    .h3-field-icon-wrapper{
      right: -8px;
      position: relative;
      .extra-icon{
        display: inline-block;
        height: 100%;
        padding: 0 20px;
      }
      .icon-wapper{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 45px;
        width: 40px;
        .icon-clear {
          position: absolute;
          margin-top: 15px;
          margin-bottom: 13px;
          display: inline-block;
          width: 16px;
          height: 16px;
          background: #999999;
          border-radius: 50%;
          transform: rotate(45deg);
          .mixin(@width, @height) {
            background: #fff;
            content: "";
            position: absolute;
            display: inline-block;
            width: @width;
            height: @height;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          &:before {
            .mixin(1px, 12px);
          }
          &:after {
            .mixin(12px, 1px);
          }
          &.hide {
            display: none;
          }
          &.offset {
            right: calc(22px + .32rem);
          }
        }
      }
    }
  }
</style>
