<template>
  <ControlWrapper class="form-number" :visible="visible" :error="valid.empty" :disabled="disabled">
        <h3-input
            :title="options.DisplayName"
            :value="displayValue.toString()"
            type="money"
            :placeholder="placeholder"
            :editable="options.Editable"
            :required="options.Required"
            :moneyKeyboardAlign="'left'"
            :tip="options.description"
            :clear="true"
            @onFocus="onFocus"
            @onBlur="onBlur"
            :readonly="!options.Editable"
            :isToKBit="options.showmode === '1'"
            :floater="options.decimalplaces"
            :hasExtra="hasBindClick"
            :showkeyBoard="showkeyBoard"
            @exception="handleError"
            @onChange="onChange"
        >
          <i slot="extra" class="icon icon-search2" v-if="hasBindClick" @click="triggerClickFunc"></i>
        </h3-input>
  </ControlWrapper>
</template>

<script lang='ts'>
import {H3List, H3Input} from 'h3-mobile-vue'
import { namespace } from 'vuex-class';
import {Component, Mixins, Watch} from 'vue-property-decorator'
import mixin from '../mixins/base-controler';
import ControlWrapper from '../shared/control-wrapper.vue';
import { FormNumberOptions } from '../../../lib/form-logic/types/control-options-map';
import { FormActionType, FormMutationType } from '../../../store/modules/form/types';

const FormModule = namespace('Form');
const prefix = 'Form/ViewModel/';

@Component({
  components: {
    H3Input,
    H3List,
    ControlWrapper,
  }
})
export default class FormNumber extends Mixins(mixin) {
  placeholder: string = '请填写'
  //错误提示相关
  errorMsg: string = '输入不合法'
  showErr: boolean = false
  isFocus: boolean = false
  showkeyBoard: boolean = false
  errTimer: any = null
  displayValue: any = ''
  options!: FormNumberOptions;

  @FormModule.Action(FormActionType.SHOWVALIDMSG)
  showValidMsg;

  @FormModule.Mutation(FormMutationType.TOGGLEKEYBOARDSHOW)
  toggleKeyboardShow;

  created() {
    this.displayValue = this.value;
  }
  onChange(val) {
    this.value = val
    this.valid.empty = false
  }
  handleError(type) {
    if (type == 2) {
      this.showValidMsg('小数点超过默认位数')
    } else if (type == 3) {
      this.showValidMsg('输入格式有误')
    }
  }
  validateMsg(text) {
    this.errorMsg = text
    this.showErr = true
    clearTimeout(this.errTimer)
    this.errTimer = setTimeout(() => {
      this.showErr = false
    }, 3000)
  }
  onBlur() {
    this.isFocus = false;
    this.showkeyBoard = false;
    this.displayValue = this.value;
    this.toggleKeyboardShow(false);
    this.backStack.pop()
  }
  onFocus() {
    this.isFocus = true;
    this.showkeyBoard = true;
    setTimeout(() => {
      this.toggleKeyboardShow(true);
    }, 0);
    this.backStack.push(() => {
      this.showkeyBoard = false
    })
  }
  triggerClickFunc() {
    this.triggerClick({ namespace: this.namespace });
  }
  get hasBindClick() {
    return this.$parent.context[this.dataField].hasBindClick;
  }
  @Watch('value')
  valueChange(val) {
    if (!this.isFocus) {
      this.displayValue = val;
    }
  }
}
</script>

