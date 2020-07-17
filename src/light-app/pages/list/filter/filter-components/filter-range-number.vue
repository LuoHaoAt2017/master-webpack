<template>
  <div class="attribute-rows">
    <p class="i-title">自定义数字范围</p>
    <div class="radio-item-box">
      <span @click="minInputClick">
        <input
          ref="minInputRef"
          type="number"
          class="number-input"
          placeholder="最小值"
          v-model="range.min"
          @input="minInput"
        />
      </span>
      <span class="span-line">-</span>
      <span @click="maxInputClick">
        <input
          ref="maxInputRef"
          type="number"
          class="number-input"
          placeholder="最大值"
          v-model="range.max"
          @input="maxInput"
        />
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch, Inject } from 'vue-property-decorator';
import { H3Input } from 'h3-mobile-vue';
import { FilterAttributeType, TableFilterType } from '@/light-app/config/list-const';

@Component({
  name: 'filterRangeNumber',
  components: {
    H3Input
  }
})
export default class filterRangeNumber extends Vue {
  @Prop()
  colId: string;

  @Prop()
  formCode: string;

  @Prop()
  colIndex: number;

  @Prop()
  colfilter: any;

  range: any = {
    max: null,
    min: null
  }

  created() {
    // 还原值
    if (this.colfilter.operator === TableFilterType.range) {
      this.range = this.colfilter.range;
    }
  }
  // 输入最小值
  minInput() {
    if (this.range.min && this.range.min.split('.')[0].length > 15) {
      this.range.min = this.range.min.substr(0,15);
    } else if (this.range.min.split('.')[1] && this.range.min.split('.')[1].length > 6) {
      this.range.min = this.range.min.substr(0, this.range.min.split('.')[0].length + 7);
    }
    this.$emit('change', {
      filterType: FilterAttributeType.RangeNumber,
      value: null,
      colIndex: this.colIndex,
      name: '',
      range: this.range
    })
  }
  // 输入最大值
  maxInput() {
    if (this.range.max && this.range.max.split('.')[0].length > 15) {
      this.range.max = this.range.max.substr(0,15);
    } else if (this.range.max.split('.')[1] && this.range.max.split('.')[1].length > 6) {
      this.range.max = this.range.max.substr(0, this.range.max.split('.')[0].length + 7);
    }
    this.$emit('change', {
      filterType: FilterAttributeType.RangeNumber,
      value: null,
      colIndex: this.colIndex,
      name: '',
      range: this.range
    })
  }

  minInputClick() {
    if (this.$refs.minInputRef) {
      (this.$refs.minInputRef as any).focus();
    }
  }

  maxInputClick() {
    if (this.$refs.maxInputRef) {
      (this.$refs.maxInputRef as any).focus();
    }
  }

  @Watch('colfilter', {deep: true})
  handleColFilter(nVal) {
    if (this.colfilter.operator !== TableFilterType.range) {
      this.range.min = null;
      this.range.max = null;
    }
  }
  
}
</script>
<style lang="less" scoped>
@import '~@/styles/light-app.less';
.attribute-rows{
  background:rgba(245,247,249,1);
  .i-title{
    color: #999;
    text-align:left;
    .px2rem(padding-top, 12);
    .px2rem(padding-left, 30);
    .px2rem(line-height, 34);
  }
}

.radio-item-box{
  display: flex;
  .px2rem(margin-top, 15);
  .px2rem(padding-left, 24);
  .px2rem(padding-right, 32);
  .number-input{
    .px2rem(height, 56);
    .px2rem(width, 250);
    .px2rem(border-radius, 28);
    flex: 1;
    .px2rem(padding-left, 16);
    box-sizing: border-box;
  }
  .span-line{
    display: inline-block;
    .px2rem(font-size, 24);
    color: #333;
    .px2rem(line-height, 64);
    padding: 0 0.1rem;
  }
}

</style>
