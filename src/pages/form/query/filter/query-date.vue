<template>
  <query-control-wrapper
    :title="title"
  >
    <h3-input
      v-model="value"
      :border="false"
      readonly
      placeholder="请选择日期"
      @click="toggle"
    />
    <h3-datetime-picker
      v-model="visible"
      maskClosable
      :value="value"
      mode="datetime"
      format="YYYY-MM-DD"
      @select="select"
    />
  </query-control-wrapper>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { H3Input, H3DatetimePicker } from '@h3/thinking-ui';
import QueryControlWrapper from './query-control.vue';
@Component({
  name: 'query-filter-date',
  components: {
    H3Input,
    H3DatetimePicker,
    QueryControlWrapper,
  },
})
export default class QueryFilterDate extends Vue {
  @Prop() title!: string;

  @Prop() dataField!: string;

  visible = false;

  value = '';

  toggle () {
    this.visible = true;
  }

  select (val) {
    this.value = val;
    this.$emit('change', this.dataField, this.value);
  }
}

</script>
<style lang='less' scoped>
</style>
