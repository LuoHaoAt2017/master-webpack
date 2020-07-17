<template>
  <ControlWrapper class="form-button" :visible="visible && !IsExternalShare">
    <h3-button type="default" @click.native="clickButton()">
      {{ options.displayname }}
    </h3-button>
  </ControlWrapper>
</template>
<script lang='ts'>
import { State, namespace } from 'vuex-class';
import { H3Button } from 'h3-mobile-vue';

import { Component, Prop, Mixins } from 'vue-property-decorator';
import baseControler from '../mixins/base-controler';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import resultHandler from '../../../utils/result-handler';
import ControlWrapper from '../shared/control-wrapper.vue';
import { FormButtonOptions } from '@/lib/form-logic/types/control-options-map';

const FormVM = namespace('Form/ViewModel');

@Component({
  components: {
    H3Button,
    ControlWrapper,
  },
})
export default class FormButton extends Mixins(baseControler) {
  @State('IsExternalShare')
  IsExternalShare;

  @Prop({ type: String })
  namespace!: string;

  Action: string = '';

  bizObjectId: string = '';

  options!: FormButtonOptions;

  created () {
    const namespaceArr = this.namespace.split('/');
    this.bizObjectId = namespaceArr[0];
    this.Action = this.dataField;
  }

  @FormVM.Action(ViewModelAction.DOACTION) doLogicAction;

  @FormVM.Action(ViewModelAction.DOAFTERSUBMIT) doAfterSubmit;

  clickButton () {
    const self = this;
    const activeElement = document.activeElement;
    // 避免输入框未执行赋值处理
    if (activeElement) {
      (activeElement as any).blur();
    }
    setTimeout(() => {
      this.$store.state.isClickCustomButtom = true;
      const actionResult = this.doLogicAction({
        bizObjectId: this.bizObjectId,
        actionControl: this,
      });
      actionResult.then((response) => {
        if (response && response.Successful) {
          self.doAfterSubmit({
            action: self.Action,
            responseValue: response.ReturnData.StartFormResponse,
            bizObjectId: this.bizObjectId,
          });
          H3PluginDeveloper.IHidePreLoader();
          resultHandler(self, response.ReturnData.StartFormResponse, self, self.bizObjectId);
        }
      });
    }, 0);
  }

  get visible (): boolean {
    return this.$parent.form[this.dataField].visible;
  }
}
</script>
<style lang="less">
.form-button {
  text-align: center;
}
</style>
