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
          :class="[filterValue.indexOf(`${item.id}`) > -1 ? 'check-circle selected' : 'circle-o']"
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
  name: 'filterIsFilled',
  components: {
  }
})
export default class filterIsFilled extends Vue {
  @Prop()
  colId: string;

  @Prop()
  colIndex: number;

  @Prop()
  colfilter: any;

  filterValue: string = '';
  baseCondition:any[] = [
    {
      id: 'filled',
      name: '已填写'
    },
    {
      id: 'empty',
      name: '未填写'
    }
  ];

  created() {
    // 还原值
    if (this.colfilter.operator === TableFilterType.filled || this.colfilter.operator === TableFilterType.empty) {
      this.filterValue = this.colfilter.value;
    }
  }

  radioChange(id) {
    if (this.filterValue.indexOf(id) > -1) {
      this.filterValue = '';
    } else {
      this.filterValue = id;
    }
    this.$emit('change', {
      filterType: FilterAttributeType.IsFilled,
      value: this.filterValue,
      colIndex: this.colIndex
    })
  }

  @Watch('colfilter', {deep: true})
  handleColFilter(nVal) {
    if (this.colfilter.operator !== TableFilterType.filled && this.colfilter.operator !== TableFilterType.empty) {
      this.filterValue = '';
    }
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
