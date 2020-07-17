<template>
  <div class="modal-section">
    <h3-accordion
      ref="accordion"
      class="light-list-accordion"
    >
      <h3-accordion-item
        v-for="(col) in getCols"
        :key="col.code"
        ref="accordionItem"
        position="right"
        content-height="108"
        :title="col.displayName"
        class="list-item"
      >
        <span
          slot="title"
          class="select-val"
        >{{ getSortLabel[col.code] }}</span>
        <div
          class="list-wrapper"
          @click.stop="handleClickRadio(col.code)"
        >
          <l-radio
            ref="listRadio"
            :list="list"
            :defaultValue="getSortType[col.code]"
            @click="handleRadioValue"
          />
        </div>
      </h3-accordion-item>
    </h3-accordion>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { LightListActionType, LightListMutationType } from '@/light-app/store/modules/list/types';
import { H3Button, H3Accordion, H3Radio } from 'h3-mobile-vue';
import LRadio from '../l-radio.vue';
import { FormControlType } from '@/light-app/config/form-control-type';
import { SortLabel, TableSortType } from '@/light-app/config/list-const';
import { Column, ViewData } from '@/light-app/typings/list';
const lightListModule = namespace('LightList');
// 暂不支持排序控件类型
const unsupportedSortControl = {
  [FormControlType.FormAttachment]: true, // 附件
  [FormControlType.FormPhoto]: true, // 图片
  [FormControlType.FormOwner]: true, // 拥有者
  [FormControlType.FormCreater]: true, // 创建人
  [FormControlType.FormGridView]: true, // 子表
  [FormControlType.FormAreaSelect]: true, // 地址
  [FormControlType.FormMap]: true, // 位置
  [FormControlType.FormQuery]: true, // 关联表单
  [FormControlType.Participant]: true, // 当前处理人
  [FormControlType.ActivityName]: true, // 当前节点
};
@Component({
  name: 'sort-panel',
  components: {
    H3Button,
    H3Accordion,
    H3AccordionItem: H3Accordion.Item,
    LRadio,
    H3Radio,
  },
})
export default class SortPanel extends Vue {
  @lightListModule.State('formCols')
  formCols: Column[]; // 数据列表

  @lightListModule.State('viewData')
  viewData: any; // 数据列表

  @lightListModule.State('isSortReset')
  isSortReset: boolean; // 是否排序重置

  @lightListModule.Mutation(LightListMutationType.HandleSortSelectedCode) 
  handleSortSelectedCode;

  @lightListModule.Mutation(LightListMutationType.HandleSortSelectedType) 
  handleSortSelectedType;

  @lightListModule.Mutation(LightListMutationType.HandleIsSortReset) 
  handleIsSortReset;

  @Prop()
  currentSort: TableSortType;

  list: object[] = [{ value: 0, label: '升序' }, { value: 1, label: '降序' }];

  sortText: any = {};

  sortType: any = {};

  selectedCode: string = '';

  selectedType: number = -1;

  sortTypeChange: boolean = false;

  limit: number = 10;

  get defaultCode () {
    return this.viewData.sortBy.columnId;
  }

  get defaultType () {
    return this.viewData.sortBy.type;
  }

  /**
   * 过滤不支持排序控件
   **/
  get getCols () {
    const cols = this.formCols && this.formCols.filter(item => {
      return !unsupportedSortControl[item.colType];
    });
    return cols;
  }

  get getSortLabel () {
    const map = {
      [TableSortType.Ascending]: SortLabel.up,
      [TableSortType.Descending]: SortLabel.down,
    };
    if (!this.sortTypeChange) {
      this.$set(this.sortText, this.defaultCode, map[this.defaultType]);
      this.sortTypeChange = false;
    }
    return this.sortText;
  }

  get getSortType () {
    if (!this.sortTypeChange) {
      this.$set(this.sortType, this.defaultCode, this.defaultType);
      this.handleSortSelectedType(this.defaultType);
      this.handleSortSelectedCode(this.defaultCode); // 修改排序控件类型code状态
      this.selectedCode = this.defaultCode;
      this.sortTypeChange = false;
    }
    return this.sortType;
  }

  /**
   * 单选框
   */
  handleRadioValue (val) {
    this.selectedType = val;
  }

  /**
   * 处理label显示
   */
  handleClickRadio (code) {
    this.handleIsSortReset(false);
    this.sortTypeChange = true;
    this.handleSortSelectedCode(code);
    this.selectedCode = code;
    this.getCols.forEach(x => {
      if (x.code === code) {
        if (this.selectedType === 0) {
          this.$set(this.sortText, x.code, SortLabel.up);
          this.$set(this.sortType, x.code, TableSortType.Ascending);
          this.handleSortSelectedType(TableSortType.Ascending);
        } else if (this.selectedType === 1) {
          this.$set(this.sortText, x.code, SortLabel.down);
          this.$set(this.sortType, x.code, TableSortType.Descending);
          this.handleSortSelectedType(TableSortType.Descending);
        }
      } else {
        this.$set(this.sortText, x.code, '');
        this.$set(this.sortType, x.code, TableSortType.Unspecified);
      }
    });
  }

  @Watch('isSortReset')
  handleSortReset (val) {
    if (val) {
      this.$set(this.sortText, this.selectedCode, '');
      this.$set(this.sortType, this.selectedCode, -1);
    }
  }
}

</script>
<style lang='less' scoped>
.light-list-accordion {
  .list-item {
    &::before {
      content: '';
    }
  }
}
</style>
