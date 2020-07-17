<template>
  <div
    v-show="visible"
    :class="{'control-error': error, 'control-disabled': disabled}"
    class="control-wrapper"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ControlWrapper extends Vue {
  @Prop({ type: Boolean, default: true })
  visible!: boolean;

  @Prop({ type: Boolean, default: false })
  error!: boolean;

  @Prop({ type: Boolean, default: false })
  disabled!: boolean;
}
</script>
<style lang="less">
  @import '../../../styles/form-base.less';
</style>
