<template>
  <ControlWrapper
    class="form-text-area"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <h3-textarea
      :value="showValue"
      :title="options.DisplayName"
      :editable="editable"
      :required="options.Required"
      :rows="rows"
      :tip="options.description"
      :autoHeight="true"
      :placeholder="placeholder"
      :clear="true"
      :layout="controlLayout"
      :watchValue="watchValue"
      @onFocus="onFocus"
      @onBlur="onBlur"
      @onChange="onChange"
      @onContentClick="openUrl($event)"
    />
  </ControlWrapper>
</template>

<script lang='ts'>
import { H3Textarea } from 'h3-mobile-vue';
import { Component, Mixins, Watch } from 'vue-property-decorator';
import mixin from '../mixins/base-controler';
import { openLink } from '../../../config/dingtalk-interface';
import { testUrlReg, isDingtalk, isWeixinBrowser } from '@/config/common';
import ControlWrapper from '../shared/control-wrapper.vue';
import { FormTextAreaOptions } from '@/lib/form-logic/types/control-options-map';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';

@Component({
  components: {
    H3Textarea,
    ControlWrapper,
  },
})
export default class FormTextarea extends Mixins(mixin) {
  rows: number = 3;

  isFocus: boolean = false;

  tempValue: string = '';

  options!: FormTextAreaOptions;

  created () {
    // 判断rows行数
    if (this.editable) {
      this.rows = Number(this.options.rows);
    } else {
      this.rows = 3;
    }
    this.tempValue = this.value || '';
  }

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

  onChange (val) {
    this.tempValue = val;
    this.valid.empty = false;
  }

  openUrl (e) {
    if (e.target.className.indexOf('text-box-hyperlink') > -1) {
      let url = e.target.innerText;
      if (!url.match(testUrlReg)){
        return H3PluginDeveloper.IShowWarn('无效的网址或URL链接');
      }
      if (!/^(ftp|https?):\/\//.test(url)){
        url = 'http://' + url.trim();
      }

      if (isDingtalk) {
        openLink(url, '无效的网址或URL链接');
      } else {
        window.open(url);
      }
    }
  }

  get showValue () {
    // const value = this.tempValue + '';

    // if (value && !this.editable && value.indexOf('text-box-hyperlink') === -1) {
    //   return value.replace(testUrlReg, str => `<span class="text-box-hyperlink dp-font30">${str}</span>`);
    // }
    // return value;
    // console.log(testUrlReg);
    const value = this.tempValue + '';
    if(value && !this.editable  && value.indexOf('text-box-hyperlink') === -1){
      let newValue = value.replace(/>/g, '&gt;')
                  .replace(/</g, '&lt;')
                  .replace(testUrlReg, str => `<span class="text-box-hyperlink dp-font30">${str}</span>`);
      return newValue;
    }else{
      return value
    }
  }

  get placeholder () {
    return this.options.placeholder || '请填写';
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

  onFocus () {
    this.isFocus = true;
  }

  onBlur () {
    this.isFocus = false;
    this.$updateValue(this.tempValue);
    // 触发执行前端事件
    if (this.tempValue) {
      this.getFrontEventsValue({
        value: this.tempValue,
        namespace: this.namespace,
      });
    }
  }
}
</script>
<style lang="less">
.form-text-area {
  .text-box-hyperlink {
    color: #108ee9;
  }
  .h3-textarea-count span{
    font-size: 12px;
  }
  .h3-textarea-view-text{
    white-space: pre-wrap;
  }
}
</style>
