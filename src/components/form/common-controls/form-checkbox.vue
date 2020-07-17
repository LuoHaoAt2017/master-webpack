<template>
  <ControlWrapper
    class="form-check-box"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <h3-switch-item
      v-model="value"
      :title="options.DisplayName"
      label="是;否"
      color="#108ee9"
      :checked="value"
      :readonly="!editable"
      :layout="controlLayout"
      @onClick="switchClick"
    />
  </ControlWrapper>
</template>

<script lang='ts'>
import { H3Switch } from 'h3-mobile-vue';
import { Component, Mixins } from 'vue-property-decorator';
import baseControler from '../mixins/base-controler';
import { FormCheckboxOptions } from '@/lib/form-logic/types/control-options-map';
import ControlWrapper from '../shared/control-wrapper.vue';

@Component({
  components: {
    H3SwitchItem: H3Switch.Item,
    ControlWrapper,
  },
})
export default class FormCheckbox extends Mixins(baseControler) {
  options!: FormCheckboxOptions;

  created () { }

  mounted () { }

  switchClick () {
  }
}
</script>
