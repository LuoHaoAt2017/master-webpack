<template>
  <ControlWrapper
    class="form-radio-button-list"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <h3-radio-list
      ref="radio"
      v-model="currentValue"
      :class="wrapCls"
      :title="options.DisplayName"
      :options="items"
      :showMode="options.selectshowmode"
      confirmText=""
      :layout="controlLayout"
      :editable="editable"
      :placeholder="editable ? placeholder : ''"
      :tip="options.description"
      :required="editable && options.Required"
      :show="pickerShow"
      :showEmptyOptions="showEmptyOptions"
      @onClear="onClear"
      @onChange="onChange"
      @onShow="onShow"
      @onHide="onHide"
    />
  </ControlWrapper>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { H3Radio } from 'h3-mobile-vue';
import mixin from '../mixins/base-controler';
import ControlWrapper from '../shared/control-wrapper.vue';
import { FormRadioButtonListOptions } from '@/lib/form-logic/types/control-options-map';

  @Component({
    components: {
      H3RadioList: H3Radio.List,
      ControlWrapper,
    },
  })
export default class FormRadioButtonList extends Mixins(mixin) {
    placeholder: string = '请选择';

    pickerShow: boolean = false;

    options!: FormRadioButtonListOptions;

    get items () {
      return this.options.defaultItems.map(item => {
        return { value: item.Value, label: item.Text };
      });
    }

    get currentValue () {
      return this.value.Value;
    }

    set currentValue (val) {}

    get wrapCls () {
      return {
        error: this.valid.empty,
      };
    }

    get showEmptyOptions () {
      return !this.options.Required;
    }

    // 处理选中后的值
    onChange (item: any) {
      this.clearValid();
      if (typeof item === 'object') {
        this.value = { Value: item.value, Text: item.label };
      } else {
        this.value = {};
      }
    }

    onClear () {
      this.value = {};
    }

    onShow () {
      this.pickerShow = true;
      this.clearValid();
      this.backStack.push(() => {
        this.pickerShow = false;
      });
    }

    onHide () {
      this.backStack.pop();
    }
}
</script>
