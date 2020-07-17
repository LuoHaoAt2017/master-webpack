<template>
  <div class="attribute-rows">
    <ul class="radio-list">
      <li
        v-for="item in chooseItems"
        :key="item.id"
        class="radio-item item"
        @click="radioChange(item.id, item.name)"
      >
        <span
          class="icon h3yun_All"
          :class="[filterValue && filterValue.indexOf(`${item.id}`) > -1 ? 'check-circle selected' : 'circle-o']"
        ></span>
        <span class="label">{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch, Inject } from 'vue-property-decorator';
import { FilterAttributeType, TableFilterType } from '@/light-app/config/list-const';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

@Component({
  name: 'filterSingleSelect',
  components: {
  }
})
export default class filterSingleSelect extends Vue {

  @Prop()
  colId: string;

  @Prop()
  formCode: string;

  @Prop()
  colIndex: number;

  @Prop()
  colfilter: any;

  @Prop()
  defaultAttr: any;

  filterValue: string = '';

  filterName: string = '';

  chooseItems:any[] = [];

  created() {
    this.chooseItems = this.defaultAttr.options.list;
    // 还原值
    if (this.colfilter.operator === TableFilterType.contains
      || (this.colfilter.operator === TableFilterType.rangedate && this.colfilter.range)
    ) {
      this.filterValue = this.colfilter.value;
    }
   
  }

  radioChange(id, name) {
    if (this.filterValue && this.filterValue.indexOf(id) > -1) {
      this.filterValue = '';
      this.filterName = '';
    } else {
      this.filterValue = id;
      this.filterName = name;
    }

    let ret;
    const dateHandlerMap = {
      today: this.today,
      yesterday: this.yesterday,
      thisWeek: this.thisWeek,
      lastWeek: this.lastWeek,
      thisMonth: this.thisMonth,
      lastMonth: this.lastMonth,
      year: this.year,
      lastYear: this.lastYear,
    }
    if (dateHandlerMap[id]) {
      ret = dateHandlerMap[id]();
      ret.min = `${ret.min} 00:00`;
      ret.max = `${ret.max} 23:59`;
    } else {
      ret = this.filterValue
    }

    this.$emit('change', {
      filterType: FilterAttributeType.SingleSelect,
      value: this.filterValue,
      colIndex: this.colIndex,
      name: this.filterName,
      range: ret
    })
  }
  // 今天
  today() {
    return {
      min: moment().format(dateFormat),
      max: moment().format(dateFormat),
    };
  }
  // 昨天
  yesterday() {
    return {
      min: moment().subtract('days', 1).format(dateFormat),
      max: moment().subtract('days', 1).format(dateFormat),
    };
  }
  // 本周
  thisWeek() {
    const weekOfDay = parseInt(moment().format('d'));
    return {
      min: moment().subtract(weekOfDay, 'days').format(dateFormat),
      max: moment().add(7 - weekOfDay - 1, 'days').format(dateFormat),
    };
  }
  // 上周
  lastWeek() {
    const weekOfDay = parseInt(moment().format('d'));
    return {
      min: moment().subtract(weekOfDay + 7, 'days').format(dateFormat),
      max: moment().subtract(weekOfDay + 1, 'days').format(dateFormat),
    };
  }
  // 本月
  thisMonth() {
    const start = moment().add('month', 0).format('YYYY-MM') + '-01';
    return {
      min: start,
      max: moment(start).add('month', 1).add('days', -1).format(dateFormat),
    };
  }
  // 上月
  lastMonth() {
    const start = moment().subtract('month', 1).format('YYYY-MM') + '-01';
    return {
      min: start,
      max: moment(start).subtract('month', -1).add('days', -1).format(dateFormat),
    };
  }
  // 本年
  year() {
    return {
      min: moment().startOf('year').format(dateFormat),
      max: moment().endOf('year').endOf('year').format(dateFormat),
    }
  }
  // 上一年
  lastYear() {
    return {
      min: moment().add('year', -1).startOf('year').format(dateFormat),
      max: moment().add('year', -1).endOf('year').endOf('year').format(dateFormat),
    }
  }

  @Watch('colfilter', {deep: true})
  handleColFilter(nVal) {
    if (this.colfilter.operator !== TableFilterType.contains) {
      this.filterValue = '';
      this.filterName = '';
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
