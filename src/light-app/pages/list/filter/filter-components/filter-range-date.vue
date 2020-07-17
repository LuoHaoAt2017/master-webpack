<template>
  <div class="attribute-rows filter-range-date">
    <div class="date-choose" :class="{'date-choose-m': isHHmm}">
      <h3-datetime
        cancelText='取消'
        confirmText='确定'
        clearText='清除'
        :format="dateFormat"
        placeholder="开始时间"
        @on-clear="clearMinDate"
        @onConfirm="dateConfirmMin"
        v-model="range.min"
        :show="minPickerShow"
        @on-show="onMinShow"
        @on-hide="onHide"
      ></h3-datetime>
    </div>
    <span class="span-line">-</span>
    <div class="date-choose" :class="{'date-choose-m': isHHmm}">
      <h3-datetime
        cancelText='取消'
        confirmText='确定'
        clearText='清除'
        :format="dateFormat"
        placeholder="结束时间"
        @on-clear="clearMaxDate"
        @onConfirm="dateConfirmMax"
        :startDate="range.min"
        v-model="range.max"
        :show="maxPickerShow"
        @on-show="onMaxShow"
        @on-hide="onHide"
      ></h3-datetime>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch, Inject } from 'vue-property-decorator';
import { H3Datetime } from 'h3-mobile-vue';
import { FilterAttributeType, TableFilterType } from '@/light-app/config/list-const';
import { FormControlType } from '@/light-app/config/form-control-type';

@Component({
  name: 'filterRangeDate',
  components: {
    H3Datetime
  }
})
export default class filterRangeDate extends Vue {

  @Prop()
  colId: string;

  @Prop()
  formCode: string;

  @Prop()
  colIndex: number;

  @Prop()
  colfilter: any;

  @Prop()
  colData: any;

  range:any = {
    max: null,
    min: null
  }

  dateFormat: string = 'YYYY-MM-DD';

  maxPickerShow: boolean = false;

  minPickerShow: boolean = false;

  isSetLeft: boolean = false;

  isHHmm: boolean = false;

  created() {
    if (this.colData.controlOptions.DateTimeMode === 'yyyy-mm-dd hh:mm') {
      this.dateFormat = 'YYYY-MM-DD HH:mm';
      this.isHHmm = true;
    } else if (this.colData.controlOptions.DateTimeMode === 'yyyy-mm') {
      this.dateFormat = 'YYYY-MM';
    } else if (this.colData.controlOptions.DateTimeMode === 'hh:mm') {
      this.dateFormat = 'HH:mm';
    }
     // 创建时间和修改时间默认是年月日时分
    if (this.colData.colType === FormControlType.FormCreatedTime
      || this.colData.colType === FormControlType.FormModifiedTime
    ) {
      this.dateFormat = 'YYYY/MM/DD HH:mm';
    }
    // 还原值
    if (this.colfilter.operator === TableFilterType.rangedate && !this.colfilter.value) {
      this.range.min = this.colfilter.range.min || null;
      this.range.max = this.colfilter.range.max || null;
    }
  }
  clearMinDate() {
    this.isSetLeft = false;
    this.range.min = null;
    this.$emit('change', {
      filterType: FilterAttributeType.RangeDate,
      value: null,
      colIndex: this.colIndex,
      name: '',
      range: this.range
    })
  }

  clearMaxDate() {
    this.isSetLeft = false;
    this.range.max = null;
    this.$emit('change', {
      filterType: FilterAttributeType.RangeDate,
      value: null,
      colIndex: this.colIndex,
      name: '',
      range: this.range
    })
  }

  // 开始时间
  dateConfirmMin(date) {
    this.isSetLeft = false;
    this.range.min = date;
    if (this.range.min) {
      this.$emit('change', {
        filterType: FilterAttributeType.RangeDate,
        value: null,
        colIndex: this.colIndex,
        name: '',
        range: this.range
      })    
    }
  }

  // 结束时间
  dateConfirmMax(date) {
    this.isSetLeft = false;
    this.range.max = date;
    if (this.range.max) {
      this.$emit('change', {
        filterType: FilterAttributeType.RangeDate,
        value: null,
        colIndex: this.colIndex,
        name: '',
        range: this.range
      })
    }
  }

  onMinShow() {
    this.minPickerShow = true;
    this.isSetLeft = false;
    this.backStack.push(() => {
      this.minPickerShow = false;
      this.isSetLeft = true;
    })
  }

  onMaxShow() {
    this.maxPickerShow = true;
    this.isSetLeft = false;
    this.backStack.push(() => {
      this.maxPickerShow = false;
      this.isSetLeft = true;
    })
  }

  onHide() {
    if (this.isSetLeft) {
      this.isSetLeft = false;
      return;
    }
    this.backStack.pop();
  }

  
  @Watch('colfilter', {deep: true})
  handleColFilter(nVal) {
    if (this.colfilter.operator !== TableFilterType.rangedate) {
      this.range.min = '';
      this.range.max = '';
    }
  }

}
</script>

