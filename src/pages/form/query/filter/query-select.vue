<template>
  <query-control-wrapper
    :title="title"
  >
    <h3-input
      v-model="displayName"
      :border="false"
      readonly
      placeholder="请选择"
      @click="toggle"
    >
      <template #append>
        <h3-icon type="right" @click.self.stop="toggle" />
      </template>
    </h3-input>
    <h3-picker
      v-model="visible"
      :data="source"
      maskClosable
      @select="select"
    />
  </query-control-wrapper>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { H3Input, H3Picker, H3Icon } from '@h3/thinking-ui';
import QueryControlWrapper from './query-control.vue';
@Component({
  name: 'query-filter-select',
  components: {
    H3Picker,
    H3Input,
    H3Icon,
    QueryControlWrapper,
  },
})
export default class QueryFilterSelect extends Vue {
  @Prop() title!: string;

  @Prop() dataField!: string;

  @Prop() options!: string[];

  value = '';

  visible = false;

  displayName = '';

  get source () {
    return [this.options];
  }

  toggle () {
    this.visible = true;
  }

  select (val) {
    this.displayName = val[0];
    this.$emit('change', this.dataField, this.displayName);
  }
}

</script>
<style lang='less' scoped>

</style>
