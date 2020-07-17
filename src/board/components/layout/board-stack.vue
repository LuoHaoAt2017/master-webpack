<template>
  <div class="board-stack" :data-index="index" :style="stackStyle">
    <div ref="thumb" class="board-stack__thumb">
      <div class="board-stack__title">
        <span>{{ `${title}·${recordsCount}` }}</span>
        <span v-if="rightMenuVisible" class="board-stack__menu" @click="toggleStackMenu">
          <i class="h3yun_All ellipsis-o"></i>
        </span>
      </div>
      <div v-load="{handler: loadMore}" class="board-stack__body">
        <draggable
          class="card-list"
          :list="sortRecords"
          :options="cardSortOptions"
          :data-index="index"
          :data-value="stackValue"
          @start="sortStart"
          @end="sortEnd"
          @change="onChange"
        >
          <board-card
            :id="record.Code"
            v-for="record in sortRecords"
            :key="record.Code"
            :editable="editable"
            :showTitle="showTitle"
            :displayFields="displayFields"
            :stackValue="stackValue"
            :record="record"
            :cover="cover"
            :controlOptions="controlOptions"
          />
          <div v-show="recordsCount === 0" draggable="false" class="board-stack__placeholder seize">
            暂无记录
          </div>
        </draggable>
        <div
          v-if="enableCreate"
          v-show="!fixPlus"
          class="board-stack__plus"
          @click="addForm"
        >
          <span class="h3yun_All plus-o"></span>
        </div>
      </div>
    </div>
    <div v-show="isLoadingMore" class="loading">
      <span class="h3yun_All loading-o"></span>
      正在加载...
    </div>
    <div
      v-if="enableCreate"
      v-show="fixPlus"
      class="board-stack__plus board-stack__plus-fixed"
      @click="addForm"
    >
      <span class="h3yun_All plus-o"></span>
    </div>
    <h3-action-sheet
      v-model="stackMenuVisible"
      :menus="formatedMenus"
      :showCancel="true"
      :maskClosable="true"
      @select="selectMenu"
    />
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { namespace } from 'vuex-class';
// import { H3Scroll } from 'h3-mobile-vue';
import { H3ActionSheet } from '@h3/thinking-ui';
import throttle from 'lodash/throttle';
import { FormControlType } from '../../typings/const';
import { Board } from '../../typings/board';
import { IBoardSortColumn, IBoardDisplayColumn, UnclassifiedField, IBoardColumnRecord } from '../../typings/index';
import { hasParent } from '../../utils/dom';
import draggable from '../vuedraggable';
import BoardCard from './board-card.vue';
import load from '../../directives/load';
import { BoardActionType, BoardMutationType } from '../../store/types';
import BoardLayout from './board-layout.vue';
const LightBoardModule = namespace('LightBoard');

@Component({
  components: {
    draggable,
    // H3Scroll,
    BoardCard,
    H3ActionSheet,
  },
  directives: {
    load,
  },
})
export default class Stack extends Vue {
  @Prop() id!: string;

  @Prop() index!:number;

  @Prop() stackWidth!: number;

  @Prop() total!: number;

  @Prop() stackHeight!: number;

  @Prop() title!: string;

  @Prop() stackValue!: string;

  @Prop() stackUrl!: string; // stack 单选人类型， 人员图像

  @Prop() showTitle!: boolean; // card是否显示标题

  @Prop() stackField!: string; // 分类字段

  @Prop() stackFieldType!: FormControlType; // 分类字段类型

  @Prop() cover!: string; // 封面字段

  @Prop() removable?: boolean; // 是否可以删除

  @Prop() sortFields!: IBoardSortColumn[]; // 排序字段集合

  @Prop() displayFields!: IBoardDisplayColumn[]; // 显示字段集合

  @Prop() editable!: boolean; // 是否有字段编辑权限，跨列拖动卡片

  @Prop() required!: boolean; // 分类字段是否必填

  @Prop() isNew!: boolean; // 是否是新增加列，新增加列可以编辑标题，编辑失去焦点，更新该值

  @Prop() isAdministrator!: boolean; // 是否管理员

  @Prop() enableWorkflow!: boolean; // 是否启用了流程

  @Prop() enableCreate!: boolean; // 是否可以创建表单

  @Prop() controlOptions!: any; // 控件属性对象

  @Prop() allColumnValues!: any; // 所有看板列值集合

  @Prop() unitSelectionRange!: string; // 人员部门选择范围

  @Prop() stackBodyHeight!: number;

  @Prop() gutter!: number;

  @Prop() menuVisible!: boolean;

  @Prop() menus!: any;

  // gutter = 15;

  cards : any= [];

  limit = 10;

  fixPlus = false;

  @LightBoardModule.State('board') board!: Board;

  @LightBoardModule.State('boardColumnRecords') boardColumnRecords;

  @LightBoardModule.Mutation(BoardMutationType.RemoveForm) removeForm;

  @LightBoardModule.Mutation(BoardMutationType.SetFormEditingInfo) setFormEditingInfo;

  @LightBoardModule.Action(BoardActionType.SortCard) sortCard;

  @LightBoardModule.Action(BoardActionType.UpdateCard) updateCard;

  @LightBoardModule.Action(BoardActionType.GetBoardColumnDatas) getColumnDatas;

  stackMenuVisible = false;

  isLoadingMore = false;

  get cardSortOptions () {
    return {
      group: 'cards',
      forceFallback: true,
      dragClass: 'board-card__drag',
      chosenClass: 'board-card__chosen',
      preventOnFilter: true,
      scroll: true,
      handle: '.board-card',
      scrollSensitivity: 100, // 滚动的灵敏度,其实是拖拽离滚动边界的距离触发事件的距离边界+-30px的地方触发拖拽滚动事件，
      scrollSpeed: 10, // 滚动速度
      sort: !this.disableSort, // 控制列表内部是否可以排序 TODO 如果有排序字段，同列不允许拖动排序
      animation: 150,
      dropBubble: true,
      delay: 300,
      fallbackOnBody: true,
    };
  }

  get disableSort () {
    return this.sortFields && this.sortFields.length > 0;
  }

  get stackStyle () {
    return {
      left: `${(this.stackWidth + this.gutter) * this.index + this.gutter * 2}px`,
      width: `${this.stackWidth}px`,
    };
  }

  get columnDataModel () {
    const columnValue = this.stackValue;
    return this.boardColumnRecords[columnValue];
  }

  get pageIndex () {
    if (this.columnDataModel) {
      return this.columnDataModel.PageIndex;
    }
    return 0;
  }

  /**
   * 设置排序字段后，根据排序字段对记录排序
   */
  get sortRecords () {
    if (this.columnDataModel) {
      return this.columnDataModel.Datas;
    }
    return [];
  }

  /**
   * 记录条数
   */
  get recordsCount () {
    if (this.columnDataModel) {
      return this.columnDataModel.Count;
    }
    return 0;
  }

  /**
   * 是否系统人员部门字段类型
   */
  get isSystemField () {
    return this.stackFieldType === FormControlType.FormOwner ||
    this.stackFieldType === FormControlType.FormCreater ||
    this.stackFieldType === FormControlType.FormOwnerDepartment;
  }

  /**
   * 判断是否允许拖动卡片(禁止情形：1、用户无编辑清醒; 2、系统字段不允许修改；3、必填字段拖入未分类)
   */
  get canEditCard () {
    // 可不编辑状态后系统字段不允许拖动
    if (!this.editable || this.isSystemField || this.enableWorkflow) {
      return false;
    }
    return true;
  }

  /**
   * 是否可以删除列
   */
  get canRemoveStack () {
    return this.isAdministrator && this.stackValue;
  }

  get formatedMenus () {
    if (this.isAdministrator && this.stackValue === UnclassifiedField) {
      const ret = [];
      this.menus.forEach((menu) => {
        if (menu.code !== 'remove') {
          ret.push(menu);
        }
      });
      return ret;
    }
    return this.menus;
  }

  get rightMenuVisible () {
    return this.menuVisible && !(this.stackValue === UnclassifiedField && this.board.stacks.length === 51);
  }

  @Watch('sortRecords')
  onRecordsChangedHandler () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.setPlusStatus();
      }, 1000);
    });
  }

  mounted () {
    this.loadMore = throttle(this.loadMore, 100);
    this.setPlusStatus();
  }

  canLoadMore (index: number) {
    const columnValue = this.board.stacks[index].ColumnValue;
    const dataModel = this.boardColumnRecords[columnValue] as IBoardColumnRecord;
    return dataModel.Count > dataModel.Datas.length;
  }

  loadMore (event) {
    if ((this.$parent as BoardLayout).isSorting || this.isLoadingMore) {
      return;
    }
    const vm = this;
    const index = this.index;
    const activeStack = this.$el;
    if (activeStack) {
      const parent = activeStack.querySelector('.board-stack__body') as any;
      if (parent && hasParent(event.target, parent)) {
        // 判断是否需要加载更多
        const { scrollTop, offsetHeight } = parent;
        const list = parent.children[0];
        if ((scrollTop + offsetHeight > list.offsetHeight - 10) && this.canLoadMore(index)) {
          this.isLoadingMore = true;
          // 加载更多数据
          setTimeout(async () => {
            const columnValues = [vm.board.stacks[index].ColumnValue];
            const dataModel = vm.boardColumnRecords[vm.board.stacks[index].ColumnValue] as IBoardColumnRecord;
            const params = {
              columnValues,
              pageIndex: dataModel.PageIndex + 1,
              isLoadMore: true,
            };
            await vm.getColumnDatas(params);
            this.isLoadingMore = false;
          }, 300);
        }
      }
    }
  }

  setPlusStatus () {
    if (this.enableCreate) {
      const layout = document.querySelector('.board-layout') as HTMLElement;
      if (layout) {
        const thumb = this.$refs.thumb as HTMLElement;
        const diff = layout.offsetHeight - thumb.offsetHeight;
        if (layout.offsetHeight > 0 && diff < 30) {
          this.fixPlus = true;
        } else {
          this.fixPlus = false;
        }
      }
    }
  }

  toggleStackMenu () {
    this.stackMenuVisible = true;
  }

  /**
   * 看板列快捷操作
  */
  selectMenu (menu) {
    this.stackMenuVisible = false;
    switch (menu.code) {
      case 'add':
        this.$emit('add-stack', this.index);
        break;
      case 'remove':
        this.remove();
        break;
      default:
        break;
    }
  }

  addForm () {
    // TODO 新增数据，待添加自定义参数
    const { schemaCode } = this.board;
    const formDefaultValue = {};
    if (this.stackValue && this.stackValue !== UnclassifiedField) {
      formDefaultValue[this.stackField] = this.stackValue;
    }
    // 如果有分组默认值
    if (this.board.groupColumn && this.board.groupConfig && this.board.groupConfig.DefaultValue &&
     this.board.groupConfig.DefaultValue !== '__All__') {
      formDefaultValue[this.board.groupColumn] = this.board.groupConfig.DefaultValue;
    }
    this.setFormEditingInfo('');
    this.$store.state.excludeComp = [];
    this.$router.push({
      name: 'formPage',
      params: {
        schemaCode: schemaCode,
        formDefaultValue: JSON.stringify(formDefaultValue), // 和pc端命名保持一致
        fromBoard: 'true',
      },
      query: {
        schemaCode: schemaCode,
      },
    });
  }

  remove () {
    let message;
    if (this.stackFieldType === FormControlType.FormDropDownList) {
      message = `删除列将会同步删除【${this.controlOptions[this.stackField].DisplayName}】字段的此选项，且列数据将会移入“未分类”`;
    } else {
      message = `删除列将会保留此列【${this.controlOptions[this.stackField].DisplayName}】字段值，且列数据将会移入“未分类”`;
    }
    const vm = this;
    // 弹框确认
    this.$modal.confirm({
      title: '确定删除吗？',
      content: message,
      onConfirm () {
        // console.log('confirm clicked');
        vm.board.removeStack(vm.id);
      },
    });
  }

  sortStart () {
    this.$emit('sort-start');
  }

  sortEnd (evt: any) {
    const { to } = evt;
    const { index } = (to as any).dataset;
    this.$emit('sort-end', { from: this.index, to: parseInt(index, 10) });
    this.onEnd(evt);
  }

  /**
   * 拖拽排序结束事件
   */
  onEnd (evt) {
    // const from = evt.from; // 处理元素清空后占位元素显示文字不显示的情况，前面通过设置opacity=0 来设置拖拽滑过的效果
    // 同列内拖动不做处理
    if (evt.from !== evt.to) {
      let message = '';
      if (!this.editable) {
      // 提醒不能编辑， 区分不同场景
        message = '您没有列字段编辑权限，无法跨列移动卡片';
      } else if (this.isSystemField) {
        message = '看板列是系统字段，不支持跨列移动卡片';
      } else if (this.required && (!evt.to.dataset.value || evt.to.dataset.value === UnclassifiedField)) {
        message = '看板列为必填字段，您不能将它拖入未分类列中';
      } else if (this.enableWorkflow) {
        message = '流程数据不支持跨列移动卡片';
      }
      if (message) {
        this.$toast.show({
          text: message,
        });
      }
    } else {
      const { oldIndex, newIndex } = evt;
      if (oldIndex === newIndex) {
        return;
      }
      const prevObjectId = this.sortRecords[newIndex - 1] ? this.sortRecords[newIndex - 1].Code : '';
      const nextObjectId = this.sortRecords[newIndex + 1] ? this.sortRecords[newIndex + 1].Code : '';
      this.sortCard({ stackValue: this.stackValue, id: this.sortRecords[newIndex].Code, prevObjectId, nextObjectId });
    }
  }

  /**
   * stack 内card排序
   */
  onChange (evt) {
    if (evt.added) {
      const { element, newIndex } = evt.added;
      const { Code } = element;
      if (!this.canEditCard || (this.required && (!this.stackValue || this.stackValue === UnclassifiedField))) {
        // this.sortRecords.splice(newIndex, 1);
        const index = this.sortRecords.findIndex(record => record.Code === Code);
        if (index > -1) {
          this.sortRecords.splice(index, 1);
        }
        // const seize = evt.evt.to.querySelector('.seize');
        // if (seize) {
        //   seize.style.opacity = 1;
        // }
        return;
      }
      const prevIndex = newIndex - 1;
      const nextIndex = newIndex + 1;
      let prevObjectId, nextObjectId;
      if (this.sortFields.length > 0) {
        prevObjectId = '';
        nextObjectId = '';
      } else {
        prevObjectId = this.sortRecords[prevIndex] ? this.sortRecords[prevIndex].Code : '';
        nextObjectId = this.sortRecords[nextIndex] ? this.sortRecords[nextIndex].Code : '';
      }
      const params: {id: string; targetColumnValue: string;
      targetPrevBizObjectId: string; targetNextBizObjectId: string; element: any;
      bolumnColumnType: FormControlType; avatar: string; name: string;} = {
        id: Code,
        targetColumnValue: this.stackValue === UnclassifiedField ? '' : this.stackValue,
        targetPrevBizObjectId: prevObjectId,
        targetNextBizObjectId: nextObjectId,
        element,
        bolumnColumnType: this.stackFieldType,
        avatar: this.stackUrl,
        name: this.title,
      };
      this.updateCard(params);
    } else if (evt.removed) {
      if (!this.canEditCard || (this.required && (!evt.evt.to.dataset.value || evt.evt.to.dataset.value === UnclassifiedField))) {
        const { oldIndex, element } = evt.removed;
        this.sortRecords.splice(oldIndex, 0, element);
      } else {
        const { element } = evt.removed;
        this.removeForm({ stackValue: this.stackValue, id: element.Code });
      }
    }
  }
}
</script>
<style lang='less' scoped>
@import '~@/styles/light-app.less';
.board-stack {
    position: absolute;
    height: 100%;
    &__menu {
      .px2rem(width, 44);
      .px2rem(height, 44);
      .px2rem(line-height, 44);
      border-radius: 50%;
      text-align: center;
      &:active {
        background: #fff;
      }
    }
    &__thumb {
      position: relative;
      display: flex;
      flex-direction: column;
      max-height: calc(100% - 28 / @baseFontSize * 1rem);
      .px2rem(padding-left, 28);
      .px2rem(padding-right, 28);
      .px2rem(padding-top, 24);
      .px2rem(border-radius, 24);
      background:rgba(235,237,242,1);
      border:1px solid rgba(235,237,242,1);
    }
    &__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .px2rem(height, 44);
      color: #333;
      & > span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    &__body {
      .px2rem(margin-top, 20);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    &__plus {
      .px2rem(width, 90);
      .px2rem(height, 90);
      .px2rem(line-height, 90);
      .px2rem(margin-top, 40);
      .px2rem(margin-bottom, 16);
      left: 50%;
      position: relative;
      transform: translateX(-50%);
      text-align: center;
      border-radius: 50%;
      background: #107fff;
      color: #fff;
      opacity: 0.8;
      &-fixed {
        position: absolute;
        .px2rem(bottom, 16);
        margin-bottom: 0;
      }
    }
    &__placeholder {
      .px2rem(padding-top, 30);
      .px2rem(padding-bottom, 30);
      text-align: center;
      color: #999;
    }
    &__menu-item {
      position: relative;
      .px2rem(height, 86);
      .px2rem(line-height, 86);
      .px2rem(padding-left, 14);
      .px2rem(padding-right, 14);
      i {
        .px2rem(margin-right, 10);
        color: @lightAppPrimaryColor;
      }
    }
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      .px2rem(left, 44);
      .px2rem(right, 44);
      bottom: 0px;
      background: #fff;
      opacity: 1;
      transition: opacity 150ms linear;
      span {
        .px2rem(margin-right, 16);
        animation: loading 1s infinite;
      }
    }
  }
  .card {
    height: 100px;
    margin-bottom: 10px;
    line-height: 100px;
    text-align: left;
    border: 1px solid silver;
    background: #fff;
  }
  .content-wrapper {
    top: 24px;
    width: 100%;
    z-index: 499;
    overflow-y: auto;
    overflow-x: hidden;
  }
  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform:rotate(360deg);
    }
  }
</style>
