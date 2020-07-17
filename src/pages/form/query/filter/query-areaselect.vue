<template>
  <query-control-wrapper
    :title="title"
  >
    <h3-input
      v-model="areaStr"
      readonly
      :border="false"
      placeholder="请选择省市区"
      @click="toggle"
    />
    <h3-area-picker
      v-model="visible"
      :source="source"
      :value="value"
      :mode="mode"
      maskClosable
      @select="select"
    />
  </query-control-wrapper>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { H3Input, H3AreaPicker } from '@h3/thinking-ui';
import QueryControlWrapper from './query-control.vue';
import requestPct from '@/utils/request-pct';
@Component({
  name: 'query-filter-text',
  components: {
    H3Input,
    H3AreaPicker,
    QueryControlWrapper,
  },
})
export default class QueryFilterText extends Vue {
  @Prop() title!: string;

  @Prop() dataField!: string;

  @Prop({
    type: String,
    default: 'P-C-T',
  }) mode!: string;

  visible = false;

  value = [];

  areaStr = '';

  source = [];

  created () {
    requestPct().then(data => {
      this.source = data.treeData;
    });
  }

  toggle () {
    this.visible = true;
  }

  select (vals) {
    let areaStr = '';
    vals.forEach(val => {
      areaStr += val.name;
    });
    this.areaStr = areaStr;
    const id = vals[vals.length - 1].id;
    this.$emit('change', this.dataField, id);
  }
}

</script>
<style lang='less' scoped>
</style>
