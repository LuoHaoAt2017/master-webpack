<template>
  <div class="query-filter-multi-select bd-bot">
    <h3-checkbox-list
      ref="checkbox"
      v-model="value"
      :title="title"
      :options="options"
      showMode="0"
      placeHolder="请选择"
      :editable="true"
      :show="visible"
      layout="v"
      @onChange="change"
      @on-clear="clear"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { H3Checkbox } from 'h3-mobile-vue';
@Component({
  name: 'query-multi-select',
  components: {
    H3CheckboxList: H3Checkbox.List,
  },
})
export default class QueryMultiSelect extends Vue {
  @Prop() title!: string;

  @Prop() dataField!: string;

  @Prop() options!: string[];

  visible = false;

  value = [];

  change (val) {
    this.$emit('change', this.dataField, val.join(';'));
  }

  clear () {
    this.$emit('change', this.dataField, '');
  }
}

</script>
<style lang='less' scoped>
@import '../../../../styles/common';
.query-filter-multi-select {
  background: #fff;
  /deep/ .h3-field-label-title {
    // .px2rem(height, 44);
    // .px2rem(line-height, 44);
    .px2rem(font-size, 28);
    font-family:PingFangSC-Semibold,PingFang SC;
    font-weight:600;
    color:rgb(26, 13, 13);
  }
  /deep/ .h3-field-placeholder {
    .px2rem(font-size, 30);
  }
}
</style>
