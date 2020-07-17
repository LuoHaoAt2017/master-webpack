<template>
  <layout
    :title="displayName"
    :leftOptions="{preventGoBack: true}"
    @on-click-back="goBack"
  >
    <div class="board-view">
      <div class="board-view__top">
        <div>
          <h3-popover
            v-model="viewToggleVisible"
            :offset="-10"
            placement="bottom-start"
          >
            <div class="view-toggle-btn">
              <span class="h3yun_All list-view-o-3"></span>
            </div>
            <template slot="content">
              <div
                v-for="view in views"
                :key="view.code"
                class="view-toggle-item"
                @click="selectView(view)"
              >
                <i class="h3yun_All" :class="view.icon"></i>
                <span>{{ view.name }}</span>
              </div>
            </template>
          </h3-popover>
          <div class="divider"></div>
          <span
            @click="showBoardCol"
          >看板列</span>
        </div>
        <span
          @click="showGroup"
        >分组</span>
        <span
          @click="showFilter"
        >筛选</span>
        <span
          @click="showSort"
        >排序</span>
        <span
          @click="openReport"
        >统计分析</span>
      </div>
      <template v-if="skeletonLoading">
        <div
          v-for="(skeleton, index) in skeletons"
          :key="index"
          class="skeleton-loading"
        >
          <skeleton class="middle" />
        </div>
      </template>
      <board-layout
        v-if="stacks && stacks.length > 0"
        v-show="!skeletonLoading"
        ref="borardLayout"
        :stacks="stacks"
      />
      <div v-if="total >= 0" class="board-view__bottom">
        {{ `${index + 1}/${total}` }}
      </div>

      <group-field
        v-if="showGroupModel"
        @update-group-field="updateGroupField"
        @update-group-value="updateGroupDefaultValue"
        @closeFieldModel="closeGroupModel"
      />
      <field-order
        v-if="showSortModel"
        @sort-column-update="sortColumnUpdate"
        @closeModel="closeSortModel"
      />
      <board-col-sort
        v-if="boardColModel"
        @closeModel="closeBoardColModel"
      />
      <h3-modal
        :show.sync="popupShowFilter"
        :class="{'lightlist-set-modal': !isDingtalk}"
        maskClosable
        type="popup"
        popupDirection="right"
        popupScale="78.4"
        @on-hide="hideSetModal"
      >
        <div class="lightList-set-panel">
          <!-- <div class="top-label">
            <span
              class="icon h3yun_All filter-o"
            ></span>
            <span class="label">筛选</span>
          </div> -->
          <filter-panel
            v-if="popupShowFilter"
            ref="filterPanel"
            :formCode="getSheetCode"
            :filters="filterColumns"
            :controls="filterControls"
          />
          <div
            class="bottom-options bd-top"
          >
            <div
              class="reset-btn btn"
              @click="handleReset"
            >
              <i class="icon h3yun_All reload-o"></i>
              重置
            </div>
            <div
              class="confirm-btn btn"
              type="primary"
              @click="handleConfirm"
            >
              <i class="icon h3yun_All check"></i>
              确定
            </div>
          </div>
        </div>
      </h3-modal>
    </div>
  </layout>
</template>

<script lang="ts">
import {
  Vue,
  Component,
} from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import {
  BoardActionType,
  BoardMutationType,
} from '../store/types';
import { H3Scroll, H3Modal } from 'h3-mobile-vue';
import { H3ImageViewer, H3Popover } from '@h3/thinking-ui';
// import debounce from 'lodash/debounce';

import { Board } from '../typings/board';
import {
  IBoardSetting, FilterType, IBoardSingleDataRequest, UnclassifiedField,
} from '../typings/index';
import { updateBoard, setFilters } from '../apis';
import '@/light-app/styles/light-list.less';

import { isDingtalk } from '@/config/common';
import BoardLayout from '../components/layout/board-layout.vue';
import GroupField from '../components/settings/group-field.vue';
import FieldOrder from '../components/settings/field-order.vue';
import BoardColSort from '../components/settings/board-col-sort.vue';
import { getDateRange, isRuleShouleBeRemoved } from '../utils/board-utils';
import FilterPanel from '@/light-app/pages/list/filter/index.vue';
import { FormControlType, BoardGroupDateFormat, BoardGroupAllValue } from '../typings/const';

// import { TableFilterType } from '@/light-app/config/list-const';
import skeleton from '@/components/common/skeleton-loading.vue';
import { closeApp } from '../../config/dingtalk-interface';
const lightBoardModule = namespace('LightBoard');

Vue.use(H3ImageViewer);

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);
@Component({
  name: 'board-page',
  components: {
    // ListsItem,
    H3Scroll,
    // SortPanel,
    FilterPanel,
    // StatisticsPanel,
    H3Modal,
    skeleton,
    H3Popover,
    BoardLayout,
    GroupField,
    FieldOrder,
    BoardColSort,
  },
})
export default class BoardPage extends Vue {
  // @State('UserInfo') userInfo ;

  @lightBoardModule.State('board') board!: Board;

  @lightBoardModule.Getter('controlOptions') controlOptions;

  @lightBoardModule.Getter('boardColumnType') boardColumnType;

  @lightBoardModule.State('isEditing') isFormEditing;

  @lightBoardModule.State('isCreating') isFormCreating;

  @lightBoardModule.State('editingStackValue') editingStackValue;

  @lightBoardModule.Mutation(BoardMutationType.InitColumnDatas) initColumnData;

  @lightBoardModule.Mutation(BoardMutationType.ResetBoard) resetBoard;

  @lightBoardModule.Mutation(BoardMutationType.CorrectFilterColumns) correctFilterColumns;

  @lightBoardModule.Mutation(BoardMutationType.ResetFilterSetting) resetFilterSetting;

  @lightBoardModule.Mutation(BoardMutationType.RemoveForm) removeForm;

  @lightBoardModule.Action(BoardActionType.EditCard) editCard;

  @lightBoardModule.Action(BoardActionType.InitData) init;

  @lightBoardModule.Action(BoardActionType.GetBoardColumnDatas) getBoardColumnDatas;

  @lightBoardModule.Action(BoardActionType.GetNewForm) getNewForm;

  @lightBoardModule.Action(BoardActionType.ChangeDisplayMode) changeDisplayMode;

  appCode = '';

  sheetCode = '';

  enableBoard = true;

  canAdd = true;

  sheetName = '';

  displayName = ''; // 表单名称

  viewToggleVisible = false;

  views = [
    {
      icon: 'child-table-o-3',
      name: '表格视图',
      code: 'sheet',
      action: (self) => {
        this.changeDisplayMode({ sheetCode: self.getSheetCode, defaultDisplayMode: 0 });
        self.$router.push({
          name: 'lightListPage',
          query: {
            appCode: self.getAppCode,
            sheetCode: self.getSheetCode,
            enableBoard: `${self.$route.query.enableBoard}`,
            canAdd: `${self.$route.query.canAdd}`,
          },
          params: {
            sheetName: self.displayName,
          },
        });
        self.viewToggleVisible = false;
      },
    },
    {
      icon: 'list-view-o-3',
      name: '看板视图',
      code: 'board',
      action: (self) => {
        self.viewToggleVisible = false;
      },
    },
  ];

  showGroupModel = false;

  showSortModel = false;

  boardColModel = false;

  popupShowFilter = false;

  skeletonLoading = false;

  skeletons = 5;

  lastIndex = -1; // 打开表单之前的列索引

  lastScrollTop = 0; // 打开表单之前的垂直方向上的滚动距离

  get getAppCode () {
    return this.$route.query.appCode || window.GlobalConfig.appCode;
  }

  get canAddData () {
    return this.$route.query.canAdd === 'true';
  }

  get getSheetCode () {
    return this.$route.query.sheetCode || window.GlobalConfig.menuCode;
  }

  get isDingtalk () {
    return isDingtalk;
  }

  get stacks () {
    return this.board.stacks;
  }

  get filterColumns () {
    return this.board.filterColumns;
  }

  get filterControls () {
    return this.board.controls.map(control => {
      return {
        code: control.FieldCode,
        displayName: control.DisplayName,
        colType: control.Type,
        controlOptions: control.Options,
      };
    });
  }

  get index () {
    return this.board.index > this.total - 1 ? this.board.index - 1 : this.board.index;
  }

  get total () {
    return this.stacks && this.stacks.length;
  }

  async created () {
    // 表单名称
    this.displayName = this.$route.params.sheetName || window.GlobalConfig.solutionName;
    this.skeletonLoading = true;
    const ret = await this.init(this.getSheetCode);
    if (ret.success) {
      this.skeletonLoading = false;
      this.$nextTick(() => {
        const cols = this.board.stacks.map(col => col.ColumnValue);
        this.correctFilter();
        this.initColumnData(cols);
        this.board.refreshDatas(true);
      });
    }
  }

  mounted () {
    this.eventOn();
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  eventOn () {
    this.$root.eventHub.$on('form-card-edit', async (bizObjectId: string) => {
      const req: IBoardSingleDataRequest = {
        SchemaCode: this.board.schemaCode,
        BizObjectId: bizObjectId,
        GroupColumn: this.board.groupColumn,
        GroupConfig: this.board.groupConfig,
        FilterItems: this.board.filterColumns,
      };
      const ret = await this.getNewForm(req);
      if (ret.success) {
        // 还有可能修改后被过滤掉了
        if (!ret.returnData.Data) {
          if (this.editingStackValue) {
            this.removeForm({ stackValue: this.editingStackValue, id: bizObjectId });
          }
          return;
        }
        // 获取新列值
        let newColumnValue = '';
        if (this.boardColumnType === FormControlType.FormDropDownList) {
          newColumnValue = ret.returnData.Data.cellValues[this.board.boardColumnField] || UnclassifiedField;
        } else {
          const units = ret.returnData.Data.cellValues[this.board.boardColumnField];
          if (units.length > 0) {
            newColumnValue = (units[0] && units[0].UnitId) || UnclassifiedField;
            // 判断是否在看板列中
            const index = this.stacks.findIndex(stack => stack.ColumnValue === newColumnValue);
            if (index < 0) {
              newColumnValue = UnclassifiedField;
            }
          }
        }
        let payload;
        if (this.editingStackValue) {
          payload = { newColumnValue, columnValue: this.editingStackValue, bizObjectId, form: ret.returnData.Data };
        } else {
          payload = { newColumnValue, columnValue: '', bizObjectId, form: ret.returnData.Data };
        }
        this.editCard(payload);
      }
    });
    this.$root.eventHub.$on('form-card-remove', (bizObjectId: string) => {
      if (this.editingStackValue) {
        this.removeForm({ stackValue: this.editingStackValue, id: bizObjectId });
      }
    });
  }

  eventOff () {
    this.$root.eventHub.$off('form-card-edit');
    this.$root.eventHub.$off('form-card-remove');
  }

  /**
   * 修正筛选数据
  */
  correctFilter () {
    const ret = [];
    // 去除由于格式转换导致的失效规则
    for (const rule of this.board.filterColumns) {
      if (!isRuleShouleBeRemoved(rule, this.controlOptions)) {
        ret.push(rule);
      }
    }
    this.correctFilterColumns(ret);
  }

  /**
   * 获取路由切换之前的垂直方向滚动距离
   */
  getLastStackScrollTop (layout, index) {
    const stackBody = layout.$children[index].$el.querySelector('.board-stack__body');
    if (stackBody) {
      return stackBody.scrollTop;
    }
    return 0;
  }

  /**
   * 还原垂直滚动之前的距离
   */
  restoreLastStackScrollTop (layout, index, scrollTop) {
    const stackBody = layout.$children[index].$el.querySelector('.board-stack__body');
    if (stackBody) {
      stackBody.scrollTop = scrollTop;
    }
  }

  /**
   * 响应式路由参数变化，处理路由参数变化，页面不刷新；
   */
  beforeRouteLeave (to, from, next) {
    const boardLayout = this.$refs.borardLayout as any;
    this.lastIndex = this.index;
    // this.board.index = 0;
    if (to.path === '/formPage') {
      this.lastScrollTop = this.getLastStackScrollTop(boardLayout, this.lastIndex);
    }
    if (boardLayout && boardLayout.stackAddOrgVisible) { // 存在人员部门弹窗没有关闭，先关闭
      boardLayout.stackAddOrgVisible = false;
      next(false);
      return;
    }
    if (to.path === '/schemas' || to.path === '/lists') {
      this.resetBoard();
      this.$store.state.excludeComp = ['board-page'];
    }
    next();
  }

  activated () {
    if (this.lastIndex > -1) {
      // 还原看板列滚动的位置
      this.restoreLastStackScrollTop(this.$refs.borardLayout, this.lastIndex, this.lastScrollTop);
      this.board.fastChange(this.lastIndex);
    }
  }

  beforeDestroy () {
    this.eventOff();
  }

  /**
   * 更新看板设置
   */
  async updateBoardSetting () {
    const data : IBoardSetting = {
      ObjectId: this.board.objectId,
      GroupColumn: this.board.groupColumn,
      IsFixedSide: this.board.isFixedSide,
      DisplayColumns: this.board.displayColumns,
      Colors: this.board.colors,
      FilterColumns: [], // 筛选数据走表格视图的接口，不在这里配置
      CoverColumn: this.board.coverColumn,
      IsShowTitle: this.board.isShowTitle,
      // IsCollapsed: this.board.isCollapsed,
    };
    await updateBoard(data);
  }

  /**
   * 分组字段改变
  */
  async updateGroupField () {
    this.updateBoardSetting();
    this.setBoardInfo();
  }

  /**
   * 分组字段下选中数据的改变
  */
  updateGroupDefaultValue () {
    this.setBoardInfo();
  }

  /**
   * 分组值保存 并刷新卡片数据
  */
  async setBoardInfo () {
    const data = this.board;
    await setFilters(data.filterColumns, data.groupConfig, data.sortColumns, data.schemaCode);
    this.board.refreshDatas();
  }

  toggleViewSwitch () {
    this.viewToggleVisible = !this.viewToggleVisible;
  }

  selectView (view) {
    view.action(this);// .apply(this);
  }

  /**
   * 统计分析
  */
  openReport () {
    this.$router.push({
      name: 'lightReportPage',
      params: {
        schemaCode: this.getSheetCode as string,
        displayName: this.displayName,
      },
      query: {
        appCode: this.getAppCode,
        schemaCode: this.getSheetCode,
        filters: this.getFilterItems(),
      },
    });
  }

  /**
   * 获取过滤参数， 包括分组值
  */
  getFilterItems () {
    const filterItems = [].concat(this.filterColumns);
    if (this.board.groupColumn && this.board.groupConfig && this.board.groupConfig.DefaultValue) {
      // 判断分组字段类型和格式
      const group = this.controlOptions[this.board.groupColumn];
      if (group && group.Type === FormControlType.FormDateTime) {
        const dateTimeMode = this.board.groupConfig.DateTimeFormat;
        let ret;
        switch (dateTimeMode) {
          case BoardGroupDateFormat.Year:
            ret = getDateRange(this.board.groupConfig.DefaultValue).year;
            break;
          case BoardGroupDateFormat.Month:
            ret = getDateRange(this.board.groupConfig.DefaultValue).thisMonth;
            break;
          case BoardGroupDateFormat.Day:
            ret = getDateRange(this.board.groupConfig.DefaultValue).today;
            break;
        }
        if (this.board.groupConfig.DefaultValue !== BoardGroupAllValue) {
          filterItems.push({
            columnId: this.board.groupColumn,
            operator: FilterType.rangedate,
            value: null,
            name: '',
            range: ret,
          });
        }
      } else {
        if (this.board.groupConfig.DefaultValue !== BoardGroupAllValue) {
          filterItems.push({
            columnId: this.board.groupColumn,
            operator: FilterType.equal,
            value: this.board.groupConfig.DefaultValue,
            name: '',
            range: null,
          });
        }
      }
    }
    return filterItems;
  }

  /**
   * 显示看板列弹窗
  */
  showBoardCol () {
    this.boardColModel = true;
  }

  /**
   * 关闭看板列弹窗
  */
  closeBoardColModel () {
    this.boardColModel = false;
  }

  /**
   * 关闭分组弹窗
  */
  closeGroupModel () {
    this.showGroupModel = false;
  }

  /**
   * 显示分组弹窗
  */
  showGroup () {
    this.showGroupModel = true;
  }

  /**
   * 显示排序弹窗
  */
  showSort () {
    this.showSortModel = true;
  }

  /**
   * 关闭排序弹窗
  */
  closeSortModel () {
    this.showSortModel = false;
  }

  showFilter () {
    this.popupShowFilter = true;
  }

  hideSetModal () {
    this.popupShowFilter = false;
  }

  handleConfirm () {
    this.popupShowFilter = false;
    this.setBoardFilter();
  }

  handleReset () {
    (this.$refs.filterPanel as any).resetFilterList();
  }

  async setBoardFilter () {
    const filterItems: any[] = [];
    (this.$refs.filterPanel as any).filterList.forEach(item => {
      if (
        item.filter.operator === FilterType.rangedate ||
        item.filter.operator === FilterType.range
      ) {
        if (item.filter.range.min || item.filter.range.max) {
          filterItems.push(item.filter);
        }
      } else if (
        item.filter.value instanceof Array &&
        item.filter.value.length > 0
      ) {
        filterItems.push(item.filter);
      } else if (item.filter.value && !(item.filter.value instanceof Array)) {
        filterItems.push(item.filter);
      }
    });
    // 特殊处理日期类型
    filterItems.forEach(filter => {
      if (filter.operator === FilterType.contains && filter.range) {
        filter.operator = FilterType.rangedate;
      }
    });
    this.resetFilterSetting(filterItems);
    const data = this.board;
    await setFilters(data.filterColumns, data.groupConfig, data.sortColumns, data.schemaCode);
    this.board.refreshDatas();
  }

  /**
   * 排序更新
  */
  async sortColumnUpdate () {
    const data = this.board;
    await setFilters(data.filterColumns, data.groupConfig, data.sortColumns, data.schemaCode);
    this.board.refreshDatas();
    this.showSortModel = false;
  }

  goBack () {
    if (window.GlobalConfig.isList) {
      closeApp();
    } else {
      this.$router.replace({
        name: 'schemas',
        query: {
          appCode: this.getAppCode,
        },
      });
    }
  }
}
</script>
<style lang='less' scoped>
@import '~@/styles/light-app.less';
// 实时搜索词高亮
.board-view {
  position: relative;
  width: 100%;
  height: 100%;
  align-items: center;
  background-color: #fff;
  color: #999;
  z-index: 99;
  &__top {
    .px2rem(height, 68);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .px2rem(padding-left, 36);
    .px2rem(padding-right, 36);
    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .px2rem(height, 68);
      .divider {
        width: 0;
        .px2rem(height, 32);
        .px2rem(margin-left, 36);
        .px2rem(margin-right, 24);
        border-left: 1px solid #EBEDF2;
      }
      & > span {
        .px2rem(padding-left, 12);
        .px2rem(padding-right, 12);
        .px2rem(padding-top, 4);
        .px2rem(padding-bottom, 4);
        .px2rem(border-radius, 8);
        .px2rem(font-size, 24);
        color: @lightAppTextColor;
        &:active {
          background: #EAEDF2;
        }
      }
    }
    .view-toggle-btn {
      position: relative;
      // &::after {
      //   content: '';
      //   position: absolute;
      //   width: 0;
      //   height: 100%;
      //   top: 0;
      //   .px2rem(right, -28);
      //   border-left: 1px solid #EBEDF2;
      //   transform: scaleY(0.7);
      // }
      span {
        color: @lightAppPrimaryColor;
        .px2rem(font-size, 36);
      }
    }
    & > span {
      .px2rem(padding-left, 12);
      .px2rem(padding-right, 12);
      .px2rem(padding-top, 4);
      .px2rem(padding-bottom, 4);
      .px2rem(border-radius, 8);
      .px2rem(font-size, 24);
      color: @lightAppTextColor;
      &:active {
        background: #EAEDF2;
      }
    }
  }
  &__bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    // transform: translateX(-50%);
    .px2rem(height, 44);
    .px2rem(line-height, 44);
    .px2rem(font-size, 26);
    font-family:PingFangSC-Regular,PingFang SC;
    text-align: center;
    color:#333;
  }
  .filter-wrapper {
    vertical-align: middle;
    font-size: 0;
    float: right;
    .px2rem(padding-right, 12);
    box-sizing: border-box;
    /deep/.pannel-title-icon {
      vertical-align: middle;
      display: inline-block;
      .px2rem(font-size, 36);
      color: #6c7482;
      .px2rem(margin-left, 8);
      .px2rem(padding-left, 20);
      .px2rem(padding-right, 20);
    }
  }
}
.scroll-wrapper {
  position: relative;
  top: 0;
  width: 100%;
  background: #f5f7f9;
  height: calc(100% - 88 / @baseFontSize * 1rem);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &.scroll-nodata,
  &.page-index {
    /deep/.mescroll-hardware{
      display: none !important;
    }
  }
}
.scroll-wrapper-hidden{
  overflow-y: hidden;
}
.content-wrapper {
  .px2rem(top, 88);
  width: 100%;
  z-index: 499;
  overflow-y: auto;
  overflow-x: hidden;
  .searchTotal {
    .px2rem(height, 60);
    .px2rem(line-height, 80);
    .px2rem(font-size, 26);
    .px2rem(padding-left, 30);
    color: #999;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    box-sizing: border-box;
  }
}
.total-wrapper {
  float: left;
  .px2rem(height, 88);
  .px2rem(line-height, 88);
  .px2rem(font-size, 24);
  .px2rem(padding-left, 30);
  text-align: left;
  color: #999;
  width: 40%;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.rows-container {
  .px2rem(padding-left, 30);
  .px2rem(padding-right, 30);
  .empty-text {
    .px2rem(font-size, 26);
    color: #999;
    display: inherit;
    text-align: center;
  }
  .icon-empty {
    display: block;
    margin: 0 auto;
    .px2rem(margin-top, 300);
    background-size: 100% 100%;
    &.empty-list {
      background-image: url('~@/assets/img/icon-list-empty.png');
      .px2rem(width, 210);
      .px2rem(height, 212);
    }
    &.empty-search {
      .px2rem(width, 230);
      .px2rem(height, 214);
      background-image: url('~@/assets/img/icon-list-search-empty.png');
    }
    @media screen and (-webkit-min-device-pixel-ratio: 2),
      screen and (min--moz-device-pixel-ratio: 2) {
      &.empty-list {
        background-image: url('~@/assets/img/icon-list-empty-2x.png');
      }
      &.empty-search {
        background-image: url('~@/assets/img/icon-list-search-empty-2x.png');
      }
    }
    @media screen and (-webkit-min-device-pixel-ratio: 3),
      screen and (min--moz-device-pixel-ratio: 3) {
      &.empty-list {
        background-image: url('~@/assets/img/icon-list-empty-2x.png');
      }
      &.empty-search {
        background-image: url('~@/assets/img/icon-list-search-empty-2x.png');
      }
    }
  }
}
.skeleton-loading {
  display: flex;
  align-items: center;
  width: 100%;
  .middle {
    flex: 1;
    .px2rem(height, 149);
    .px2rem(margin-left, 30);
    .px2rem(margin-right, 30);
    .px2rem(margin-top, 24);
    .px2rem(border-radius, 6);
  }
}
@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
</style>
<style lang="less">
@import '~@/styles/light-app.less';
*{
  -webkit-touch-callout:none !important; /*系统默认菜单被禁用*/
  -webkit-user-select:none !important; /*webkit浏览器*/
  -khtml-user-select:none !important; /*早期浏览器*/
  -moz-user-select:none !important;/*火狐*/
  -ms-user-select:none !important; /*IE10*/
  user-select:none !important;
}
input,textarea {
  -webkit-user-select:auto !important; /*webkit浏览器*/
}
.view-toggle-item {
  position: relative;
  .px2rem(height, 86);
  .px2rem(line-height, 86);
  .px2rem(padding-left, 14);
  .px2rem(padding-right, 14);
  i {
    .px2rem(margin-right, 10);
    .px2rem(font-size, 30);
    color: @lightAppPrimaryColor;
  }
  span{
    .px2rem(font-size, 30);
    color:@lightAppTextColor;
  }
}
.h3think-popover__content {
  .view-toggle-item:first-child {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 0;
      width: 100%;
      border-bottom: 1px solid #EBEDF2;
    }
  }
}

</style>
