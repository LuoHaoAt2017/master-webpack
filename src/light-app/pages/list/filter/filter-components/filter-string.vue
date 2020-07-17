<template>
  <div class="attribute-rows" @click="inputClicked">
    <input
      class="filter-input"
      ref="phoneInput"
      :placeholder="placeholderStr"
      v-model.trim="sortText"
      @input="inputChange"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { H3Input } from 'h3-mobile-vue';
import { filterEmojiExp } from '@/light-app/config/const';
import { FilterAttributeType, TableFilterType } from '@/light-app/config/list-const';

@Component({
  name: 'filterString',
  components: {
  }
})
export default class filterString extends Vue {

  @Prop()
  colId: string;

  @Prop()
  colIndex: number;

  @Prop()
  colfilter: any;

  placeholderStr:string = '请输入';

  sortText:string = '';

  created() {
    // 还原值
    if (this.colfilter.operator === TableFilterType.contains) {
      this.sortText = this.colfilter.value;
    }
  }

  inputChange() {
    this.sortText = this.sortText.substr(0, 10);
    this.$emit('change', {
      filterType: FilterAttributeType.String,
      value: this.sortText,
      colIndex: this.colIndex
    })
  }

  inputClicked() {
    if (this.$refs.phoneInput) {
      (this.$refs.phoneInput as any).focus();
    }
  }

  @Watch('colfilter', {deep: true})
  handleColFilter(nVal) {
    if (this.colfilter.operator !== TableFilterType.contains) {
      this.sortText = '';
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/light-app.less';
.filter-input{
  width: 100%;
  .px2rem(height, 56);
  .px2rem(padding-left, 30);
  background:rgba(245,247,249,1);
  box-sizing: border-box;
  .px2rem(border-radius, 28);
}
.attribute-rows{
  padding: 0.12rem 0.3rem;
  background: #fff;
}
</style>
