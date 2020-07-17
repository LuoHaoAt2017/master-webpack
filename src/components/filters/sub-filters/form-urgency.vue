<template>
    <div class="wf-filter">
        <div class="wf-filter-title">
            紧要程度
        </div>
        <div class="wf-filter-value ">
            <div v-for="(item,index) in stateList" :key="index"  class="urgency"
            :class="[item.Active?'active':'']" @click="setItemActive(item)">
                {{item.Text}}
            </div>
        </div>
    </div>
</template>
<script>
// zyq;
export default {
  name: 'FormUrgency',
  props: ['formVal'],
  data() {
    return {
      stateList: [
        { Text: '全部', Value: -1, Active: false },
        { Text: '限时', Value: 0, Active: false },
        { Text: '催办', Value: 1, Active: false },
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