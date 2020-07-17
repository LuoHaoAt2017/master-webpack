<template>
  <ControlWrapper class="form-label" :visible="visible" :disabled="disabled">
    <h3-field
      class="form-label"
      :readOnly="true"
      :showIcon="false"
      :layout="controlLayout"
      :label="options.DisplayName"
    >
      <input
        v-if="!value"
        v-model="displayValue"
        type="text"
        :placeholder="'系统自动生成'"
        readonly
      />
      <div
        v-else
        class="text"
        :class="{'placeholder-color': !value}"
      >
        {{ displayValue || '系统自动生成' }}
      </div>
    </h3-field>
  </ControlWrapper>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { H3Field } from 'h3-mobile-vue';
import baseControler from '../mixins/base-controler';
import FormLabelOptions from '@/lib/form-logic/types/form-label-opts';
import ControlWrapper from '../shared/control-wrapper.vue';

  @Component({
    components: {
      H3Field,
      ControlWrapper,
    },
  })
export default class FormLabel extends Mixins(baseControler) {
    options!: FormLabelOptions;

    get displayValue () {
      if (this.visible && !this.value && this.options.tempValue) {
        this.value = this.options.tempValue;
      }
      return this.value;
    }
}
</script>
<style lang="less">
  .form-label {
    background-color: white;
    input, .text {
      font-size: 15px;
    }
    .placeholder-color {
      color: #999;
    }
  }
</style>
