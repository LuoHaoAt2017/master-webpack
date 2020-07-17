<template>
    <div class="wf-filter">
        <div class="wf-filter-title">
            单据名称
        </div>
        <div class="wf-filter-value ">
            <div v-for="(item,index) in formVal.DefaultItems" :key="index"  class="sheet"
            :class="[item.Active?'active':'']" @click="setItemActive(item)">
                {{getItemDisplayName(item)}}
            </div>
        </div>
    </div>
</template>
<script>
// zyq;
export default {
  name: 'FormSheets',
  props: ['formVal'],
  data() {
    return {};
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$set(this.formVal.DefaultItems[0], 'Active', true);
    },
    getValue() {
      for (const item of this.formVal.DefaultItems) {
        if (item.Active) {
          return item.SchemaCode;
        }
      }
      return '';
    },
    setValue() {},
    getItemDisplayName(item) {
      if (item.SchemaCode && this.formVal.Status !== 2 && this.formVal.Type !== -1) {
        return `${item.SheetName}(${item.Count})`;
      }
      return item.SheetName;
    },
    setItemActive(item) {
      for (const it of this.formVal.DefaultItems) {
        if (it.Active) {
          this.$set(it, 'Active', false);
        }
      }
      this.$set(item, 'Active', true);
    },
  },
};
</script>
<style lang="less">

</style>
