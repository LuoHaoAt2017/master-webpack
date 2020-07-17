<template>
    <div class="wf-filter">
        <div class="wf-filter-title">
            流程状态
        </div>
        <div class="wf-filter-value ">
            <div v-for="(item,index) in stateList" :key="index"  class="instance-state"
            :class="[item.Active?'active':'']" @click="setItemActive(item)">
                {{item.Text}}
            </div>
        </div>
    </div>
</template>
<script>
// zyq;
export default {
  name: 'FormInstanceState',
  props: ['formVal'],
  data() {
    return {
      stateList: [
        { Text: '全部', Value: 8, Active: false },
        { Text: '进行中', Value: 2, Active: false },
        { Text: '生效', Value: 4, Active: false },
        { Text: '作废', Value: 5, Active: false },
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.stateList[0].Active = true;
    },
    getValue() {
      for (const item of this.stateList) {
        if (item.Active) {
          return item.Value;
        }
      }
      return '';
    },
    setValue() {},
    setItemActive(item) {
      for (const it of this.stateList) {
        this.$set(it, 'Active', false);
      }
      this.$set(item, 'Active', true);
    },
  },
};
</script>
<style lang="less">

</style>