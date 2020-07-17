<template>
  <div class="attribute-rows">
    <ul class="radio-list">
      <li
        v-for="item in baseCondition"
        :key="item.id"
        class="radio-item item"
        @click="radioChange(item.id)"
      >
        <span
          class="icon h3yun_All"
          :class="[item.bool ? 'check-circle selected' : 'circle-o']"
        ></span>
        <span class="label">{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { FilterAttributeType, TableFilterType } from '@/light-app/config/list-const';

@Component({
  name: 'equalMate',
  components: {
  },
})
export default class equalMate extends Vue {
  @Prop()
  metaOperator: number;

  filterValue: string = '';

  chooseOperator: number = 0;

  get baseCondition () {
    return [
      {
        id: 'fuzzy',
        bool: this.chooseOperator === TableFilterType.contains,
        name: '模糊匹配',
      },
      {
        id: 'equal',
        bool: this.chooseOperator === TableFilterType.equal,
        name: '精确匹配',
      },
    ];
  }

  created () {
    this.chooseOperator = this.metaOperator;
  }

  /**
   * 精确模糊匹配切换
   */
  radioChange (id) {
    if (id === 'equal') {
      this.chooseOperator = TableFilterType.equal;
    } else {
      this.chooseOperator = TableFilterType.contains;
    }
    this.$emit('change', this.chooseOperator);
  }

  @Watch('metaOperator', { deep: true })
  handleMateOperator (nVal) {
    this.chooseOperator = nVal;
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/light-app.less';
.attribute-rows{
  background:rgba(245,247,249,1);
  .radio-list{
    .label{
      .px2rem(margin-left, 72) !important;
    }
  }
}
</style>
