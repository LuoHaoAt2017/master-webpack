<template>
  <query-control-wrapper
    :title="title"
  >
    <h3-input
      v-model="value"
      :border="false"
      placeholder="请输入"
      @change="change"
    />
  </query-control-wrapper>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { H3Input } from '@h3/thinking-ui';
import QueryControlWrapper from './query-control.vue';
@Component({
  name: 'query-filter-text',
  components: {
    H3Input,
    QueryControlWrapper,
  },
})
export default class QueryFilterText extends Vue {
  @Prop() title!: string;

  @Prop() dataField!: string;

  value = '';

  change () {
    this.$emit('change', this.dataField, this.value);
  }
}

</script>
<style lang='less' scoped>

</style>
