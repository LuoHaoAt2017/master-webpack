<template>
  <ControlWrapper
    :visible="visible"
    :error="valid.empty || valid.value || valid.custom"
    :disabled="disabled"
    class="form-text-box"
  >
    <h3-input
      v-if="editable || !readonly"
      :class="{'form-input-blur': innerFocus}"
      :title="options.DisplayName"
      :type="mode"
      :placeholder="placeholder"
      :editable="editable"
      :required="options.Required"
      :clear="true"
      :tip="options.description"
      :readonly="readonly"
      :warnLength="warnLength"
      :value="tempValue"
      :showScan="inputByScan && editable && !selectTelShow"
      :hasExtra="hasBindClick || telShow || selectTelShow"
      :selectTelShow="selectTelShow"
      :watchValue="watchValue"
      :layout="controlLayout"
      @keydown.native="onKeydown($event)"
      @onChange="onChange"
      @onFocus="onFocus"
      @onBlur="onBlur"
      @mailAutofill="mailAutofill"
      @exception="handleError"
      @scanClick="scan"
      @onContentClick="openUrl($event)"
    >
      <h3-touch v-if="hasBindClick" slot="extra" :onTouchStart="triggerClickFunc">
        <i class="icon h3yun_All search-o"></i>
      </h3-touch>
      <h3-touch v-if="telShow" slot="extra" :onTouchStart="dialTelephone">
        <i class="icon h3yun_All phone-o"></i>
      </h3-touch>
      <h3-touch
        v-if="selectTelShow"
        slot="extra"
        :onTouchStart="selectTelephone"
        @click.stop
      >
        <i class="icon aufont icon-base-contacts"></i>
      </h3-touch>
    </h3-input>

    <h3-input
      v-else
      :class="{'form-input-blur': innerFocus}"
      :title="options.DisplayName"
      :type="mode"
      :placeholder="placeholder"
      :editable="editable"
      :required="options.Required"
      :clear="true"
      :tip="options.description"
      :readonly="readonly"
      :warnLength="warnLength"
      :value="showValue"
      :showScan="inputByScan && editable && !selectTelShow"
      :hasExtra="hasBindClick || telShow || selectTelShow"
      :selectTelShow="selectTelShow"
      :watchValue="watchValue"
      :layout="controlLayout"
      @keydown.native="onKeydown($event)"
      @onChange="onChange"
      @onFocus="onFocus"
      @onBlur="onBlur"
      @mailAutofill="mailAutofill"
      @exception="handleError"
      @scanClick="scan"
      @onContentClick="openUrl($event)"
    >
      <h3-touch v-if="hasBindClick" slot="extra" :onTouchStart="triggerClickFunc">
        <i class="icon h3yun_All search-o"></i>
      </h3-touch>
      <h3-touch v-if="telShow" slot="extra" :onTouchStart="dialTelephone">
        <i class="icon h3yun_All phone-o"></i>
      </h3-touch>
      <h3-touch
        v-if="selectTelShow"
        slot="extra"
        :onTouchStart="selectTelephone"
        @click.stop
      >
        <i class="icon aufont icon-base-contacts"></i>
      </h3-touch>
    </h3-input>
    <!-- E 错误提示 -->
  </ControlWrapper>
</template>

<script lang='ts'>
import { H3Input, H3Touch } from 'h3-mobile-vue';
import { namespace } from 'vuex-class';
import { Component, Mixins, Watch } from 'vue-property-decorator';
import ControlWrapper from '../shared/control-wrapper.vue';
import baseControler from '../mixins/base-controler';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { openLink, callCommonTelephone, selectTelephone } from '../../../config/dingtalk-interface';
import { FormTextBoxOptions } from '@/lib/form-logic/types/control-options-map';
import {
  testUrlReg, isDingtalk, identityCodeValid, isWeixinBrowser,
} from '@/config/common';

import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import { FormActionType } from '@/store/modules/form/types';
const FormModule = namespace('Form');

  @Component({
    components: {
      H3Input,
      H3Touch,
      ControlWrapper,
    },
  })
export default class FormTextBox extends Mixins(baseControler) {
    isQuestionShowBol: boolean = false;

    mode: string = 'text';

    warnLength: number = 200;

    // 错误提示
    errorMsg: string = '输入不合法';

    inputByScan: boolean = false;

    tempValue: string = '';

    /** @deprecated
     *  isFocus: boolean = false
     *  @author linxh@authine.com
     *  @copyright Auguest 24 2019
    */
    /** @todo
     *  jsdoc 通过子组件状态修改父组件innerfocus状态，动态切换清查与电话簿图标
     *  @author linxh@authine.com
     *  @copyright Auguest 24 2019
    */
    innerFocus: boolean = true;

    isSuccessScan: boolean = false; // 是否成功扫码

    isScaning: boolean = false; // 是否在扫码中

    options!: FormTextBoxOptions;

    @FormModule.Action(FormActionType.SHOWVALIDMSG)
    showValidMsg;

    mounted () {
      if (isWeixinBrowser) {
        const inputs = Array.from(document.getElementsByTagName('input'));
        const textareas = Array.from(document.getElementsByTagName('textarea'));
        const container = [...inputs, ...textareas];
        const body = document.body;
        container.forEach(item => {
          item.onblur = () => {
            // 解决微信浏览器的键盘回弹问题
            window.scroll(0, 0);
          };
        });
      }
    }

    get showValue () {
      const value = this.tempValue + '';
      if (value) {
        if (this.options.mode === 'Card') {
          return value.replace(/\s/g, '').replace(/^(.{6})(.{0,4})(.{0,4})(.{0,4})/, '$1 $2 $3 $4').trim();
        }
        if (!this.editable && value.indexOf('text-box-hyperlink') === -1) {
          return value.replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(testUrlReg, str => `<span class="text-box-hyperlink dp-font30">${str}</span>`);
        }
      }
      return value;
    }

    get selectTelShow () {
      // 逻辑判断
      if (window.GlobalConfig) {
        // return !window.GlobalConfig.isExternalForm && this.options.mode === 'Telephone' && this.editable && this.innerFocus;
        return !window.GlobalConfig.isExternalForm && this.options.mode === 'Telephone' && this.editable;
      }
      return false;
    }

    get telShow () {
      return this.options.mode === 'Telephone' && !this.editable;
    }

    // get hasBindClick () {
    //   return this.$parent.context[this.dataField].hasBindClick || false;
    // }

    get readonly () {
      return !this.editable || (this.inputByScan && this.isSuccessScan && !this.options.scanupdateenable);
    }

    get placeholder () {
      let placeholder = '请填写';
      if (this.options.inputbyscan) {
        this.inputByScan = true;
        placeholder = '扫一扫添加';
      } else if (this.options.placeholder) {
        placeholder = this.options.placeholder;
      }
      return placeholder;
    }

    get watchValue () {
      const val = this.value;
      if (val) {
        this.tempValue = val;
      }
      return val;
    }

    @Watch('value')
    valueChanged (val, oldVal) {
      if (val !== oldVal && this.tempValue !== val) {
        this.tempValue = val;
      }
    }

    //
    created () {
      // console.log( this.options.mode );

      if (this.options.mode == 'Telephone') {
        // console.log( this );

      }

      if (this.options.inputbyscan) {
        this.inputByScan = true;
      }
      this.tempValue = this.value || '';
      this.initMode();
    }

    initMode () {
      switch (this.options.mode) {
        case 'Email':
          this.mode = 'mail';
          break;
        case 'Card':
          this.mode = 'identityCard';
          this.warnLength = 21; // 身份证为18位，6444展示中间有3个空格
          break;
        default:
          this.mode = 'text';
          break;
      }
    }

    handleError (type) {
      if (type == 1) {
        if (this.mode == 'identityCard') {
          this.showValidMsg('请填写正确的身份证号码');
        }
      }
    }

    /**
     * onChange,onFocus,onBlur changed by @linxhauthor.com
     * @copyright Auguest 26 2019
     */
    onChange (val) {
      this.valid.empty = false; // 重新输入的时候错误提示消失
      this.valid.custom = false;
      this.tempValue = val;
      this.innerFocus = !this.innerFocus;
    }

    onFocus (val, innerFocus) {
      this.innerFocus = !innerFocus;
      if (val && !this.valid.custom) { // 并且不是子表的重复
        this.clearValid();
      }
    }

    onBlur (val, innerFocus) {
      this.innerFocus = !innerFocus;
      if (this.isScaning) {
        return;
      }
      let value = val;
      if (this.mode == 'identityCard') {
        value = value.replace(/\s/g, '');
      }
      this.value = this.tempValue;
      this.Validate(value);
      this.$updateValue(value);
      // 触发执行前端事件
      if (val) {
        this.getFrontEventsValue({
          value: val,
          namespace: this.namespace,
        });
      }
    }

    mailAutofill () {
    }

    Validate (value) {
      const val = value.trim();
      if (val && this.options.mode) {
        let exp = new RegExp('');
        let err = '';
        switch (this.options.mode) {
          case 'Email':
            exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            err = '请填写正确的邮箱格式';
            break;
          case 'Mobile':
          case 'Telephone':
            // 手机号：1、输入位数不满11个数时 2、开头3位非正确，校验格式： 1 {3丨4丨5丨6丨7丨8丨9] + 数字 3、开头可以是+86-
            // 固话：校验格式： 区号(0开头3-4位数字) + 电话号码(7-8位数字)， 可有可无分隔符号(-)
            // exp = /^(((0\d{2,3}-?)?\d{7,8})|(1[3456789]\d{9}))$/;
            exp = /^(((0\d{2,3}-?)?\d{7,8})|((\+?86-?)?1[3456789]\d{9}))$/;
            err = '请填写正确的电话号码'; // "错误的电话或手机号码格式!";
            break;
          case 'Card':
            err = '请填写正确的身份证号码';
            break;
          default:
        }
        let isValid = true;
        if (this.options.mode === 'Card') {
          isValid = identityCodeValid(val);
        } else if (exp) {
          isValid = exp.test(val);
        }
        if (!isValid) {
          this.showValidMsg(err);
          this.valid.value = !isValid;
          this.$forceUpdate();
          return false;
        }
      }
      return true;
    }

    scan () {
      H3PluginDeveloper.IScanBarCode(this.scanCallback);
    }

    scanCallback (text) {
      if (this.Validate(text)) {
        this.tempValue = text;
        this.isScaning = true;
        this.$updateValue(this.tempValue);
        this.isSuccessScan = true;
        setTimeout(() => { this.isScaning = false; });
      }
    }

    openUrl (e) {
      if (e.target.className.indexOf('text-box-hyperlink') > -1) {
        let url = e.target.innerText;
        if (!url.match(testUrlReg)) {
          return H3PluginDeveloper.IShowWarn('无效的网址或URL链接');
        }
        if (!/^(ftp|https?):\/\//.test(url)) {
          url = 'http://' + url.trim();
        }

        if (isDingtalk) {
          openLink(url, '无效的网址或URL链接');
        } else {
          window.open(url);
        }
      }
    }

    triggerClickFunc () {
      this.triggerClick({ namespace: this.namespace });
    }

    dialTelephone () {
      callCommonTelephone(this.tempValue);
    }

    selectTelephone (ev) {
      selectTelephone((data) => {
        if (data.length > 0) {
          this.tempValue = data[0].mobile;
          this.$updateValue(this.tempValue);
        }
      });
    }

    onKeydown (event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      }
    }
}
</script>

<style lang="less">
  .form-text-box {
    .text-box-hyperlink {
      color: #108ee9;
    }
    .h3-list-item{
      background-color: transparent;
    }
    .h3-input-count span{
      font-size: 12px;
    }
    .h3-input-view-text{
      white-space: pre-wrap;
    }
    .h3-list-item .h3-input-control textarea{
      min-height: 30px;
    }
    .h3-list-item .h3-input-extra{
          position: absolute;
          right: -10px;
          top: 0px;
          padding: 10px 10px 10px 0;
          width: 16px;
          height: 25px;
          text-align: center;
      .h3-icon,.icon{
        height: 100%;
        display: inline-block;
        line-height: 25px;
        //width: 100%;
      }
    }
    .mock-text-area{
      left: 900px;
    }
    .h3-list-item.h3-input-item.h3-list-item-middle .mail-notice{
      z-index: 12;
    }
  }
</style>
