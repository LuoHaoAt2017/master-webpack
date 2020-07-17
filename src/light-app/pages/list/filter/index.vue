<template>
  <!-- 过滤条件选择区域 -->
  <div class="modal-section">
    <h3-accordion class="light-list-accordion">
      <h3-accordion-item
        v-for="(control, colIndex) in filterList"
        :key="control.columnId"
        :title="control.name"
        class="list-item"
      >
        <span
          v-if="control.filter"
          slot="title"
          class="filter-value"
        >
          {{ getTagValue(control.filter) }}
        </span>
        <component
          :is="filter.type"
          v-for="(filter, index) in control.filterCondition"
          :key="`${control.columnId}${index}`"
          :defaultAttr="filter"
          :colfilter="control.filter"
          :colId="control.columnId"
          :colIndex="colIndex"
          :formCode="formCode"
          :colData="control.colData"
          @change="updateFilterSet"
        />
      </h3-accordion-item>
    </h3-accordion>
  </div>
  <!-- 过滤条件选择区域 -->
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins,
} from 'vue-property-decorator';
import {
  State, Getter, Mutation, Action, namespace,
} from 'vuex-class';
import { H3Button, H3Accordion } from 'h3-mobile-vue';
import FilterString from './filter-components/filter-string.vue';
import FilterIsFilled from './filter-components/filter-isFilled.vue';
import FilterMutilSelect from './filter-components/filter-mutil-select.vue';
import FilterSingleSelect from './filter-components/filter-single-select.vue';
import FilterRangeNumber from './filter-components/filter-range-number.vue';
import FilterRangeDate from './filter-components/filter-range-date.vue';

import { ContorlTypeObject } from '@/light-app/config/form-control-type';
import { Column, ViewData } from '@/light-app/typings/list';
import { TableFilterType, FilterAttributeType } from '@/light-app/config/list-const';

const lightListModule = namespace('LightList');

const lightBoardModule = namespace('LightBoard');

@Component({
  name: 'filter-empty',
  components: {
    H3Button,
    H3Accordion,
    H3AccordionItem: H3Accordion.Item,

    FilterString,
    FilterIsFilled,
    FilterMutilSelect,
    FilterSingleSelect,
    FilterRangeNumber,
    FilterRangeDate,
  },
})
export default class FilterPanel extends Vue {
  @Prop()
  formCode: string;

  @Prop()
  filters: any;

  @Prop()
  controls: any[];

  @lightListModule.State('viewData') viewData: any;

  // @lightListModule.State('formCols')
  // formCols: Column[];

  // @lightListModule.State('viewData')
  // viewData: any;

  // @lightBoardModule.State('board') board: any;

  filterList: any[] = [];

  filterSet: any[] = []; // 过滤项

  dateFieldRange = {
    today: '今天',
    yesterday: '昨天',
    thisWeek: '本周',
    lastWeek: '上周',
    thisMonth: '本月',
    lastMonth: '上月',
    year: '本年',
    lastYear: '去年',
  };

  filledOrEmpty = {
    filled: '已填写',
    empty: '未填写',
  };

  mounted () {
    this.filterSet = JSON.parse(JSON.stringify(this.filters));
    this.controls.forEach((control) => {
      let filterItem = null; // 控件对应过滤条件
      if (this.filters.length > 0) {
        for (let index = 0; index < this.filters.length; index++) {
          const filter = this.filters[index];
          if (control.code === filter.columnId) {
            filterItem = filter;
            break;
          }
        }
      }
      const filterProperties = JSON.parse(JSON.stringify(ContorlTypeObject[control.colType].filterProperties));
      if (filterProperties.length === 0) {
        return;
      }
      if (!filterItem) {
        filterItem = {
          columnId: control.code,
          value: null,
          name: '',
          operator: '',
          range: null,
        };
      }

      this.filterList.push({
        columnId: control.code,
        name: control.displayName,
        filter: filterItem,
        filterCondition: filterProperties,
        colData: control,
      });
    });
  }

  // 更新过滤条件
  updateFilterSet (data) {
    this.filterList[data.colIndex].filter.value = data.value;
    this.filterList[data.colIndex].filter.name = data.name;
    if (data.range) {
      this.filterList[data.colIndex].filter.range = data.range;
    }
    this.filterList[data.colIndex].filter.operator = this.getFilterType(data.filterType, data.value, data.operator);
  }

  // 显示过滤条件
  getTagValue (set) {
    const tag = JSON.parse(JSON.stringify(set));
    if (tag.operator === TableFilterType.range) {
      if (
        tag.range.min != null &&
        tag.range.min !== '' &&
        tag.range.max != null &&
        tag.range.max !== ''
      ) {
        return `${tag.range.min} ~ ${tag.range.max}`;
      } else if (tag.range.min) {
        return `大于等于${tag.range.min}`;
      } else if (tag.range.max) {
        return `小于等于${tag.range.max}`;
      }
    } else if (tag.operator === TableFilterType.contains || tag.operator === TableFilterType.equal) {
      // 特殊处理 从已填数据中拿的过滤条件
      if (tag.name) {
        tag.value = tag.name;
      }
    } else if (tag.operator === TableFilterType.rangedate) {
      if (this.dateFieldRange[tag.value]) {
        return `${this.dateFieldRange[tag.value]}`;
      } else if (tag.range.min && tag.range.max) {
        return `${tag.range.min}~${tag.range.max}`;
      } else if (tag.range.min) {
        return `${tag.range.min}之后`;
      } else if (tag.range.max) {
        return `${tag.range.max}之前`;
      } else {
        return '';
      }
    } else if (tag.operator === 'user-contains') {
      return tag.value.map(user => user.username).join('，');
    } else if (tag.operator === TableFilterType.empty) {
      return this.filledOrEmpty[tag.value];
    } else if (tag.operator === TableFilterType.filled) {
      return this.filledOrEmpty[tag.value];
    }
    if (`${tag.value}`.indexOf(',') > -1) {
      return `${tag.value}`.replace(/,/g, '，');
    }
    if (!tag.value) {
      return '';
    }
    return `${tag.value}`;
  }

  /**
  * 获取过滤操作类型
  * */
  getFilterType (type, value, mateOperator) {
    let filterType: number = -1;
    switch (type) {
      case FilterAttributeType.String:
      case FilterAttributeType.MultiSelect:
      case FilterAttributeType.SingleSelect:
        filterType = TableFilterType.contains;
        break;
      case FilterAttributeType.IsFilled:
        if (value === 'filled') {
          filterType = TableFilterType.filled;
        } else {
          filterType = TableFilterType.empty;
        }
        break;
      case FilterAttributeType.RangeNumber:
        filterType = TableFilterType.range;
        break;
      case FilterAttributeType.RangeDate:
        filterType = TableFilterType.rangedate;
        break;
      default:
        break;
    }
    // 多选类型时 更改权限值
    if (type === FilterAttributeType.MultiSelect) {
      filterType = mateOperator;
    }
    return filterType;
  }

  // 重置
  resetFilterList () {
    this.filterList = this.filterList.map((item) => {
      return {
        columnId: item.columnId,
        name: item.name,
        filter: {
          columnId: item.columnId,
          value: null,
          name: '',
          operator: '',
          range: null,
        },
        filterCondition: item.filterCondition,
        colData: item.colData,
      };
    });
  }
}
</script>

<style lang='less' scoped>
@import '~@/styles/light-app.less';
.modal-section{
  .light-list-accordion /deep/.accordion-content{
    padding-right:0;
  }
  /deep/.list-accordion-title-wrapper{
    display:flex;
  }
}
.light-list-accordion {
  .list-item {
    &::before {
      content: '';
    }
  }
}
</style>
