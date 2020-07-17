<template>
  <ControlWrapper
    class="form-formula"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <h3-field
      :label="options.DisplayName"
      :tip="options.description"
      :layout="controlLayout"
      :showIcon="false"
    >
      <pre class="text" v-html="currentValue" @click="openUrl($event)"></pre>
    </h3-field>
  </ControlWrapper>
</template>
<script lang="ts">
import { H3Field } from 'h3-mobile-vue';
import { Component, Watch, Mixins } from 'vue-property-decorator';
import baseControler from '../mixins/base-controler';
import ControlWrapper from '../shared/control-wrapper.vue';
import { FormFormulaOptions } from '@/lib/form-logic/types/control-options-map';
import { openLink } from '../../../config/dingtalk-interface';
import { testUrlReg } from '../../../config/common';

@Component({
  components: {
    H3Field,
    ControlWrapper,
  },
})
export default class FormFormula extends Mixins(baseControler) {
  // 邦定的类型
  BindControlType: any = {
    Text: 'text',
    DateTime: 'datetime',
    Number: 'number',
    Bool: 'boolean',
  };

  options!: FormFormulaOptions;

  get currentValue () {
    if (this.value && this.options.bindtype === this.BindControlType.Text) {
      return this.value.replace(testUrlReg, str => `<span>${str}</span>`);
    } else if (this.options.bindtype === 'number' && !this.value) {
      return '0';
    }
    return this.value;
  }

  openUrl (e) {
    if (e.target.tagName === 'SPAN') {
      let url = e.target.innerText;
      url = /^www./.test(url) ? `http://${url}` : url;
      openLink(url, '无效的网址或URL链接');
    }
  }
}
</script>
<style lang="less">
.form-formula {
  .text {
    font-size: 15px;
    word-break: break-all;
    overflow: hidden;
    white-space: pre-wrap;
  }
}
</style>
