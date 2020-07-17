<template>
  <ControlWrapper class="form-seq-no" :visible="visible" :disabled="disabled">
    <h3-field
      class="form-seq-no"
      :readOnly="true"
      :showIcon="false"
      :layout="controlLayout"
      :label="options.DisplayName"
    >
      <div class="text-content" :class="{'placeholder-color': emptyValue}" v-text="currentVal"></div>
      <!-- <input class="dp-font26" type="text" placeholder="系统自动生成" readonly v-model="currentVal"> -->
    </h3-field>
  </ControlWrapper>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { H3Field } from 'h3-mobile-vue';
import baseControler from '../mixins/base-controler';
import ControlWrapper from '../shared/control-wrapper.vue';

@Component({
  components: {
    H3Field,
    ControlWrapper,
  },
})
export default class FormSeqNo extends Mixins(baseControler) {
  // 数据验证
  get currentVal () {
    return this.value ? this.value : '系统自动生成';
  }

  get emptyValue () {
    return !this.value;
  }
}
</script>
<style lang="less">
.form-seq-no {
  .placeholder-color {
    color: #999;
  }
  .text-content {
    font-size: 15px;
  }
}
</style>
