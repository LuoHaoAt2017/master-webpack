<template>
  <ControlWrapper
    class="form-checkbox-list"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <h3-checkbox-list
      ref="checkbox"
      v-model="currentValue"
      :class="wrapCls"
      :title="options.DisplayName"
      :options="items"
      :required="editable && options.Required"
      :showMode="options.selectshowmode"
      :tip="options.description"
      :placeHolder="editable ? placeholder : ''"
      :editable="editable"
      :show="pickerShow"
      :layout="controlLayout"
      @onChange="onChange"
      @on-clear="onClear"
      @onShow="onShow"
      @onHide="onHide"
    />
  </ControlWrapper>
</template>

<script lang="ts">
import { H3Checkbox } from 'h3-mobile-vue';
import { Component, Mixins } from 'vue-property-decorator';
import baseControler from '../mixins/base-controler';
import { FormCheckboxListOptions } from '@/lib/form-logic/types/control-options-map';
import ControlWrapper from '../shared/control-wrapper.vue';

  @Component({
    components: {
      H3CheckboxList: H3Checkbox.List,
      ControlWrapper,
    },
  })
export default class FormCheckboxList extends Mixins(baseControler) {
    placeholder: string = '请选择';

    pickerShow: boolean = false;

    options!: FormCheckboxListOptions;

    get items () {
      return this.options.defaultItems.map((item: any) => {
        return { value: item.Value, label: item.Text };
      });
    }

    get currentValue () {
      if (this.value === undefined || this.value == null || this.value === '') {
        return [];
      }
      if (!this.disabled) {
        const ret: string[] = [];
        const options = this.items.map(item => item.value);
        for (const item of this.value) {
          if (options.indexOf(item.Value) > -1) {
            ret.push(item.Value);
          }
        }
        return ret;
      } else {
        return this.value.map(item => {
          return item.Value;
        });
      }
    }

    set currentValue (val) {
      this.value = val;
    }

    get wrapCls () {
      return {
        error: this.valid.empty,
      };
    }

    // 选中处理
    onChange (items) {
      this.clearValid();
      this.value = items;
    }

    onClear () {
      this.clearValid();
      this.value = [];
    }

    onShow () {
      this.clearValid();
      this.pickerShow = true;
      this.backStack.push(() => {
        this.pickerShow = false;
      });
    }

    onHide () {
      this.backStack.pop();
    }
}
</script>

<style lang="less">
  .form-checkbox-list{
    .h3-checkbox-list-1 .h3-field-box .h3-PR{
      padding-top: 10px;
    }
  }
  .h3-checkbox-list-0 .h3-field-icon-wrapper {
    position:static !important
  }
</style>
