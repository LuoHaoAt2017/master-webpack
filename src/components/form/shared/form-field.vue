<template>
  <div class="form-field">
    <h3-field
      :label="label"
      labelWidth="98px"
      :readonly="readonly"
      :required="required"
      :layout="layoutText"
      :showIcon="!readonly"
      @contentClick="onContentClick"
    >
      <template v-if="tip" #label-icon>
        <h3-tooltip
          :content="tip"
          placement="bottom-start"
          width="60vw"
        >
          <h3-icon type="question-circle-o" size="14" color="#999" />
        </h3-tooltip>
      </template>
      <h3-icon
        v-if="!readonly"
        slot="content-icon"
        type="right"
        size="12"
      />
      <slot></slot>
    </h3-field>
    <!-- 字段底部下方，（地址控件详细地址） -->
    <div class="form-field__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { H3Field, H3Tooltip, H3Icon } from '@h3/thinking-ui';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {
    H3Field,
    H3Tooltip,
    H3Icon,
  },
})
export default class FormAreaSelect extends Vue {
  @Prop({ type: Boolean })
  required!: boolean;

  @Prop({ type: Boolean })
  readonly!: boolean;

  @Prop({ type: String })
  tip!: string;

  @Prop({ type: String })
  label!: string;

  @Prop({
    type: String,
    default: 'h',
    validator: function (value) {
      return ['h', 'v'].includes(value);
    },
  })
  layout!: 'h' | 'v';

  onContentClick () {
    this.$emit('contentClick');
  }

  get layoutText () {
    const layoutMap = {
      h: 'horizontal',
      v: 'vertical',
    };
    return layoutMap[this.layout];
  }
}
</script>
<style lang="less">
@import url("~@/styles/mixins.less");
.form-field {
  position: relative;
  &__footer {
    position: relative;
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
    .hairline('bottom');
  }
  .h3think-field {
    border: none;
    padding: 0 8px;
  }
  .h3think-field__label {
    position: relative;
    line-height: 26px;
    padding: 10px 15px 0 0;
  }
  .h3think-field__body {
    min-height: 45px;
  }
  .h3think-label .h3think-label__text {
    font-size: 15px;
    font-weight: 700 !important;
  }
}
</style>
