<template>
  <layout
    :title="displayName"
    :leftOptions="{preventGoBack: true}"
    @on-click-back="goBack"
  >
    <div class="top-container">
      <div class="top-panel top-panel-base">
        <h3-search-bar
          v-show="searchShow"
          ref="searchBar"
          class="searching"
          placeholder="搜索标题"
          :onBlur="onBlur"
          :onClear="onClear"
          :value="searchValue"
          :onChange="onChange"
          :onCancel="onCancel"
        />
        <div
          v-show="!searchShow"
          class="filter-wrapper"
        >
          <h3-popover
            v-model="viewVisible"
            placement="bottom-start"
            :disabled="!canToBoard"
          >
            <span class="icon h3yun_All child-table-o-3 pannel-title list-table"></span>
            <template #content>
              <div class="view-wrapper">
                <div
                  v-for="(view, index) in viewNav"
                  :key="index"
                  class="view-item"
                  @click="view.method"
                >
                  <i
                    :class="view.class"
                    class="icon h3yun_All view-i"
                  ></i>
                  <span class="view-title">{{ view.title }}</span>
                </div>
              </div>
            </template>
          </h3-popover>
          <span
            v-show="!searchShow"
            ref="search-btn"
            class="pannel-title"
          >搜索</span>
          <span
            class="pannel-title"
            @click="listSetModal('FilterPanel')"
          >筛选</span>
          <span
            class="pannel-title"
            @click="listSetModal('SortPanel')"
          >排序</span>
          <span
            class="pannel-title"
            @click="listSetModal('StatisticsPanel')"
          >统计</span>
          <span
            class="pannel-title statistic"
            @click="openReport"
          >统计分析</span>
        </div>
      </div>
    </div>
    <h3-scroll
      ref="scroll"
      class="scroll-wrapper"
      :class="{
        'scroll-nodata': formRows.length === 0,
        'page-index': pageIndex === 0,
        'scroll-wrapper-hidden': popupShowFilter,
      }"
      :loadMore="loadMore"
      :pageSize="limit"
      :noMoreMessage="noMoreMessage"
      :scroll="scrollContent"
      :lockDown="lockDown"
      :refresh="refresh"
    >
      <div class="content-wrapper">
        <template v-if="skeletonLoading">
          <div
            v-for="(skeleton, index) in skeletons"
            :key="index"
            class="skeleton-loading"
          >
            <skeleton class="middle" />
          </div>
        </template>
        <template v-else-if="filterLoading && !skeletonLoading">
          <div
            class="mescroll-upwarp filter-loading"
            style="visibility: visible; display: block;"
          >
            <p class="upwarp-progress mescroll-rotate"></p>
            <p class="upwarp-tip">
              加载中...
            </p>
          </div>
        </template>
        <div v-else>
          <div
            v-if="isSearch && searchValue"
            class="searchTotal"
          >
            搜索结果：共{{ total }}条
          </div>
          <div
            v-if="formRows.length > 0 && !skeletonLoading"
            class="rows-container"
          >
            <lists-item
              v-for="(row, index) in formRows"
              :key="index"
              :row="row"
              :sheetCode="getSheetCode"
              :isSearch="isSearch && searchValue"
            />
          </div>
          <div
            v-else
            class="rows-container"
          >
            <template v-if="isSearch && searchValue">
              <i class="icon-empty empty-search"></i>
              <span class="empty-text">没有搜索结果</span>
            </template>
            <template v-else-if="isfilterResult && !isFilterReset">
              <i class="icon-empty empty-search"></i>
              <span class="empty-text">没有筛选结果</span>
            </template>
            <template v-else>
              <i class="icon-empty empty-list"></i>
              <span class="empty-text">没有数据</span>
              <div
                v-if="(operationPermission || formBeCreated) && !loadMoreLoading && !isSearch"
                class="data-add"
                @click="openForm"
              >
                新增数据
              </div>
            </template>
          </div>
        </div>
      </div>
    </h3-scroll>
    <transition>
      <div
        v-if="(operationPermission || formBeCreated) && !loadMoreLoading && !isSearch && total > 0"
        class="lightApp-list-add"
        :class="{bottom: !getIsIOS}"
        @click="openForm"
      >
        <span class="h3yun_All close"></span>
      </div>
    </transition>
    <transition>
      <div
        v-if="!loadMoreLoading && !isSearch && total > 0"
        class="total-wrapper"
        :class="{bottom: !getIsIOS}"
      >
        共{{ total }}条数据
      </div>
    </transition>
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
        <div class="top-label bd-bot">
          <!-- <span
            class="icon h3yun_All"
            :class="ListSetPanelIcon"
          ></span> -->
          <span class="label">{{ ListSetPanelTitle }}</span>
        </div>
        <component
          :is="lightListSet"
          v-if="popupShowFilter"
          ref="childComponents"
          :formCode="formCode"
          :controls="formCols"
          :filters="viewData.filter"
        />
        <div
          v-if="optionShow"
          class="bottom-options"
        >
          <div
            class="reset-btn btn"
            @click="handleReset"
          >
            重置
          </div>
          <div
            class="confirm-btn btn"
            type="primary"
            @click="handleConfirm"
          >
            确定
          </div>
        </div>
      </div>
    </h3-modal>
  </layout>
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
import {
  LightListActionType,
  LightListMutationType,
} from '@/light-app/store/modules/list/types';
import { H3Scroll, H3SearchBar, H3Modal } from 'h3-mobile-vue';
import { H3Popover, H3Icon } from '@h3/thinking-ui';
import debounce from 'lodash/debounce';
import ListsItem from './lists-item.vue';
import SortPanel from './sort/index.vue';
import FilterPanel from './filter/index.vue';
import StatisticsPanel from './statistics/index.vue';
import { getDataListfilter, changeDisplayMode } from '@/light-app/service/list.service';
import '@/light-app/styles/light-list.less';
import { isDingtalk, isiOS } from '@/config/common';
import { TableFilterType, DisplayMode } from '@/light-app/config/list-const';
import { Column } from '@/light-app/typings/list';
import skeleton from '@/components/common/skeleton-loading.vue';
import StorageHelper from '@/utils/storage';
import { closeApp } from '../../../config/dingtalk-interface';
const lightListModule = namespace('LightList');
const appModule = namespace('App');
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);
@Component({
  name: 'Lists',
  components: {
    ListsItem,
    H3Scroll,
    H3SearchBar,
    SortPanel,
    FilterPanel,
    StatisticsPanel,
    H3Modal,
    skeleton,
    H3Popover,
    H3Icon,
  },
})
export default class Lists extends Vue {
  @lightListModule.State('total') total; // 数据列表

  @lightListModule.State('formRows') formRows; // 数据列表

  @lightListModule.State('formViewConfigs') formViewConfigs; // 数据列表

  @lightListModule.State('formBeCreated') formBeCreated; // 数据列表

  @lightListModule.State('sortSelectedCode') sortSelectedCode; // 排序控件code

  @lightListModule.State('sortSelectedType') sortSelectedType; // 排序控件类型

  @lightListModule.State('formCols') formCols: Column[]; // 表单控件

  @lightListModule.State('viewData') viewData!: any;

  @appModule.Getter('operationPermission') operationPermission; // 表单操作权限控制

  @lightListModule.Action(LightListActionType.GetFormDataLists)
  getFormDataLists;

  @lightListModule.Mutation(LightListMutationType.HandleResetListData)
  handleResetListData;

  @lightListModule.Mutation(LightListMutationType.HandleFormDataLists)
  HandleFormDataLists;

  @lightListModule.Mutation(LightListMutationType.HandleRealSearchRows)
  handleRealSearchRows;

  @lightListModule.Mutation(LightListMutationType.HandleSortSelectedCode)
  handleSortSelectedCode;

  @lightListModule.Mutation(LightListMutationType.HandleSortSelectedType)
  handleSortSelectedType;

  @lightListModule.Mutation(LightListMutationType.HandleIsSortReset)
  handleIsSortReset;

  viewVisible: boolean = false;

  isFilterReset: boolean = false;

  limit: number = 10;

  pageIndex: number = 0;

  lastPosition: number = 0;

  maxLength: number = 10;

  searchValue: string = '';

  isSearch: boolean = false;

  formCode: any = '';

  noMoreMessage: string = '没有更多的数据';

  skeletonLoading: boolean = true; // 第一次加载骨架图loding

  filterLoading: boolean = true; // 搜索过滤排序loading

  loadMoreLoading: boolean = true; // 下拉加载loading

  popupShowFilter: boolean = false;

  lightListSet: string = '';

  isfilterResult: boolean = false; // 是否过滤操作

  searchShow: boolean = false; // 是否显示搜索输入框

  displayName: string = ''; // 表单名称

  skeletons: number = 5; // 骨架图显示数量

  nullValueCancel: boolean = false; // 空搜索值取消搜索

  lockDown: boolean = false; // 下拉刷新滚动锁

  storageKey: string = 'viewConfig';

  viewNav: any[] = [
    {
      title: '表格视图',
      class: 'child-table-o-3',
      method: () => {
        this.viewVisible = false;
        this.handleDisplayMode(0);
      },
    },
    {
      title: '看板视图',
      class: 'list-view-o-3',
      method: () => {
        this.viewVisible = false;
        this.handleDisplayMode(3);
      },
    },
  ];

  get getIsIOS () {
    return isiOS;
  }

  get canToBoard () {
    if (this.formViewConfigs) {
      return this.formViewConfigs[DisplayMode.Board];
    }
    return false;
  }

  get getAppCode () {
    return this.$route.query.appCode || window.GlobalConfig.appCode;
  }

  get getSheetCode () {
    const sheetCode = this.$route.query.sheetCode || window.GlobalConfig.menuCode;
    return sheetCode;
  }

  get isDingtalk () {
    return isDingtalk;
  }

  // 是否显示重置确认按钮
  get optionShow () {
    if (this.lightListSet === 'StatisticsPanel') {
      return false;
    } else {
      return true;
    }
  }

  // pannel标题
  get ListSetPanelTitle () {
    return this.lightListSet === 'FilterPanel'
      ? '筛选' : this.lightListSet === 'SortPanel' ? '排序' : '统计';
  }

  // pannel icon
  get ListSetPanelIcon () {
    return this.lightListSet === 'FilterPanel'
      ? 'filter-o' : this.lightListSet === 'SortPanel' ? 'descending-o' : 'formula-control';
  }

  created () {
    // 表单名称
    this.displayName = this.$route.params.sheetName || window.GlobalConfig.solutionName;
    // 实时搜索作防抖处理
    this.realSearch = debounce(this.realSearch, 500);
  }

  activated () {
    if (this.$route.params.addData) {
      this.doRefresh();
      this.lastPosition = 0;
    }
    // 保留列表页最后滚动的位置
    if (this.lastPosition) {
      setTimeout(() => {
        if (this.$refs.scroll && (this.$refs.scroll as any).mescroll) {
          (this.$refs.scroll as any).mescroll.scrollTo(this.lastPosition);
        }
      }, 0);
    }
  }

  mounted () {
    // 搜索聚焦事件监,IOS input 无法聚焦解决方法
    (this.$refs['search-btn'] as any).addEventListener('click', () => {
      this.searchShow = true;
      this.$nextTick(() => {
        // IOS兼容判断
        if (isiOS) {
          (this.$refs.searchBar as any).focus();
        } else {
          setTimeout(() => {
            (this.$refs.searchBar as any).focus();
          }, 0);
        }
      });
    });
  }

  /**
   * 更改主视图Mode
   * @prams viewMode 0: 表格视图  3: 看板视图
   */
  async handleDisplayMode (viewMode: number) {
    if (viewMode === 3) {
      const res = await changeDisplayMode({ sheetCode: this.getSheetCode, defaultDisplayMode: viewMode });
      if (res.success) {
        this.switchBoard();
      }
    } else {
      await changeDisplayMode({ sheetCode: this.getSheetCode, defaultDisplayMode: viewMode });
    }
  }

  /**
   * 取列表滚动到位置
   */
  scrollContent (mscroll, y) {
    this.lastPosition = y;
  }

  /**
   * 面板确认操作选择
   */
  handleConfirm () {
    this.popupShowFilter = false;
    this.backStack.pop();
    switch (this.lightListSet) {
      case 'FilterPanel':
        this.handleFilterConfirm();
        break;
      case 'SortPanel':
        this.handleSortConfirm();
        break;
      case 'StatisticsPanel':
        this.handleStatisticsConfirm();
        break;
      default:
        break;
    }
  }

  /**
   * 面板重置操作选择
   */
  handleReset () {
    switch (this.lightListSet) {
      case 'FilterPanel':
        this.handleFilterReset();
        break;
      case 'SortPanel':
        this.handleSortReset();
        break;
      case 'StatisticsPanel':
        this.handleStatisticsReset();
        break;
      default:
        break;
    }
  }

  handleSortConfirm () {
    this.filterLoading = true;
    this.lockDown = true;
    this.sortFetch();
  }

  // 统计确认按钮保留
  handleStatisticsConfirm () {}

  // 重置过滤条件
  handleFilterReset () {
    this.isFilterReset = true;
    (this.$refs.childComponents as any).resetFilterList();
  }

  // 确定过滤
  async handleFilterConfirm () {
    this.filterLoading = true;
    this.lockDown = true;
    const filterItems: any[] = [];
    (this.$refs.childComponents as any).filterList.forEach(item => {
      console.log('filterList.filter', item.filter);
      item.filter.ControlType = item.colData.colType;
      if (
        item.filter.operator === TableFilterType.rangedate ||
        item.filter.operator === TableFilterType.range
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
      if (filter.operator === TableFilterType.contains && filter.range) {
        filter.operator = TableFilterType.rangedate;
      }
    });
    const data = {
      sheetCode: this.getSheetCode,
      params: {
        filter: filterItems,
      },
    };
    console.log('filterItems', filterItems);
    const res = await getDataListfilter(data);
    if (res.success) {
      this.isfilterResult = true;
      this.doRefresh();
    }
  }

  handleSortReset () {
    this.handleSortSelectedType(-1);
    this.handleIsSortReset(true);
  }

  // 统计重置按钮保留
  handleStatisticsReset () {}

  /**
   * 发起排序请求
   */
  async sortFetch () {
    const sortItem = {
      columnId: this.sortSelectedCode,
      type: this.sortSelectedType,
    };
    const data = {
      sheetCode: this.getSheetCode,
      params: {
        sortBy: sortItem,
      },
    };
    const res = await getDataListfilter(data);
    if (res.success) {
      this.doRefresh();
    }
  }

  /**
   * 列表接口参数
   */
  getParams () {
    this.formCode = this.getSheetCode;
    const params = {
      sheetCode: this.getSheetCode,
      pageSize: this.limit,
      pageIndex: this.pageIndex,
      keyValue: this.searchValue,
    };
    return params;
  }

  /**
   * 重置列表接口参数
   */
  resetParams () {
    const payload = {
      total: 0,
      // rows: []
      pageIndex: 0,
    };
    this.pageIndex = 0;
    this.HandleFormDataLists(payload);
    // this.handleResetListData(payload);
  }

  /**
   * 重置列表数据
   */
  clearRows () {
    const payload = {
      rows: [],
    };
    this.handleResetListData(payload);
  }

  async getRowsList (params) {
    // const { sheetCode, pageSize, pageIndex, keyValue } = params;
    const res = await this.getFormDataLists(params);
    this.displayName = res.displayName; // 表单名称重给值
    this.skeletonLoading = false;
    this.filterLoading = false;
    this.loadMoreLoading = false;
    this.lockDown = false;
    return res;
  }

  // 列表设置弹窗
  listSetModal (val) {
    if (val === 'FilterPanel') {
      this.isFilterReset = false;
    }
    this.popupShowFilter = true;
    this.lockDown = true;
    this.lightListSet = val;
    this.backStack.push(() => {
      this.popupShowFilter = false;
    });
  }

  // 弹窗隐藏
  hideSetModal () {
    this.lockDown = false;
    this.backStack.pop();
  }

  /**
   *
   * 打开表单页面
   */
  openForm () {
    this.$router.push({
      name: 'formPage',
      params: {
        schemaCode: this.formCode,
      },
      query: {
        schemaCode: this.formCode,
        mode: 'create'
      },
    });
  }

  /**
   * 切换看板视图
   */
  switchBoard () {
    this.$router.push({
      name: 'boardEntry',
      query: {
        appCode: this.getAppCode,
        sheetCode: this.formCode,
        enableBoard: this.$route.query.enableBoard,
        canAdd: this.$route.query.canAdd,
      },
    });
  }

  /**
   *
   * 打开表单页面
   */
  openReport () {
    this.$router.push({
      name: 'lightReportPage',
      params: {
        schemaCode: this.formCode,
        displayName: this.displayName,
      },
      query: {
        appCode: this.getAppCode,
        schemaCode: this.formCode,
        filters: this.viewData && this.viewData.filter,
      },
    });
  }

  /**
   * 响应式路由参数变化，处理路由参数变化，页面不刷新；
   */
  beforeRouteLeave (to, from, next) {
    this.lightListSet = '';
    if (to.path === '/schemas') {
      this.clearRows();
    }
    this.$store.state.excludeComp = ['Lists'];
    // if (to.path === '/lists/report') {
    //   this.$store.state.excludeComp = [];
    // }
    next();
  }

  /**
   * 列表刷新
   */
  doRefresh () {
    // this.resetParams();
    const scroll: any = this.$refs.scroll;
    if (scroll && scroll.mescroll) {
      scroll.mescroll.resetUpScroll();
    }
  }

  /**
   * 下拉刷新
   */
  refresh () {
    this.doRefresh();
  }

  /**
   * @description 下拉加载操作
   * @page page.num第一页为1
   * @done
   */
  loadMore (page, done) {
    const self = this;
    this.loadMoreLoading = true;
    if (page.num === 1) {
      this.resetParams();
    } else {
      this.pageIndex = page.num - 1;
    }
    const params = this.getParams();
    this.getRowsList(params).then(() => {
      self.$nextTick(() => {
        // 实时搜索词高亮处理
        if (this.isSearch) {
          const rows = this.searchFilter(this.searchValue, this.formRows);
          this.handleRealSearchRows(rows);
        }
        done(this.limit, this.total);
      });
    });
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

  onBlur () {
    if (!this.searchValue) {
      this.searchShow = false;
    }
  }

  onCancel () {
    this.searchShow = false;
    this.isSearch = false;
    if (!this.searchValue) {
      this.nullValueCancel = true;
    } else {
      this.nullValueCancel = false;
      this.filterLoading = true;
      this.lockDown = true;
    }
  }

  onClear () {
    this.isSearch = false;
    this.nullValueCancel = false;
    this.filterLoading = true;
    this.lockDown = true;
  }

  onChange (val) {
    this.searchValue = val.trim();
    if (val) {
      this.filterLoading = true;
      this.lockDown = true;
      this.realSearch();
    } else {
      this.isSearch = false;
      // this.resetParams();
      if (!this.nullValueCancel) {
        this.filterLoading = true;
        this.lockDown = true;
        this.doRefresh();
      }
    }
  }

  /**
   * 实时搜索,并作防抖处理
   */
  realSearch () {
    this.doRefresh();
    this.isSearch = true;
  }

  htmlXss (str) {
    var s = '';
    if (str.length === 0) return '';
    s = str.replace(/&/g, '&amp;');
    s = s.replace(/</g, '&lt;');
    s = s.replace(/>/g, '&gt;');
    s = s.replace(/ /g, '&nbsp;');
    s = s.replace(/\'/g, '&#39;');
    s = s.replace(/\"/g, '&quot;');
    return s;
  }

  /**
   * @description 搜索关键词匹配
   * @params value 搜索关键词
   * @params list 数据表
   * @return 搜索数据表
   */
  searchFilter (value: string, list: any) {
    if (value === '') return this.formRows;
    const tempList = JSON.parse(JSON.stringify(list));
    let mapSearchList: Object[] = [];
    const reg = new RegExp(value, 'g');
    mapSearchList = tempList.filter(item => {
      if (item.Name.indexOf('class="search-value"') === -1) {
        item.Name = this.htmlXss(item.Name);
      }
      if (item.Name && item.Name.includes(value)) {
        item.Name = item.Name.replace(
          reg,
          `<span class="search-value">${value}</span>`);
        return item;
      }
    });
    return mapSearchList;
  }
}

</script>
<style lang='less' scoped>
@import '~@/styles/light-app.less';
// 实时搜索词高亮
/deep/.name .search-value {
  color: #107fff;
  .px2rem(font-size, 32);
}
.panel-icon {
  display: inline-block;
}
.top-container {
  position: relative;
  width: 100%;
  align-items: center;
  background-color: #fff;
  color: #999;
  z-index: 99;
  .px2rem(height, 68);
  .px2rem(line-height, 68);
  .top-panel {
    .px2rem(height, 68);
    font-size: 0;
    /deep/.h3-search-synthetic-ph-icon {
      .px2rem(width, 30);
      .px2rem(height, 30);
      background-size: 0.4rem auto;
    }
    /deep/.h3-search-synthetic-ph-placeholder {
      color: #999;
      .px2rem(font-size, 30);
    }
    .searching {
      .px2rem(height, 87);
      .px2rem(padding-left, 30);
      .px2rem(padding-right, 30);
      /deep/.h3-search-cancel {
        color: #107ff0;
        text-align: center;
        .px2rem(font-size, 30);
      }
      /deep/.h3-search-input {
        .px2rem(height, 64);
        .px2rem(width, 600);
        box-sizing: border-box;
        background-color: #f5f7f9;
        .px2rem(border-radius, 6);
        input {
          height: 100%;
          background-color: transparent;
          .px2rem(font-size, 30);
          color: #333;
          &::-webkit-search-cancel-button {
            display: none;
          }
        }
        .h3-search-synthetic-ph {
          height: 100%;
        }
        .h3-search-clear {
          .px2rem(right, 0);
          .px2rem(top, 12);
          .icon-base-close-circle {
            .px2rem(top, -10);
            &::before {
              color: #c7c7c7;
              .px2rem(font-size, 30);
            }
          }
        }
      }
    }
  }
  .filter-wrapper {
    width: 100%;
    .px2rem(padding-right, 36);
    display: flex;
    vertical-align: middle;
    font-size: 0;
    box-sizing: border-box;
    .pannel-title {
      flex: 1;
      vertical-align: middle;
      text-align: center;
      .px2rem(font-size, 24);
      color:rgba(51,51,51,1);
      &.statistic {
        text-align: right;
      }
    }
    .list-table {
      .px2rem(font-size, 30);
      color:rgba(16,127,255,1);
      position: relative;
      &::after {
        height: 100%;
        content: "";
        width: 1px;
        .px2rem(height, 32);
        background:rgba(235,237,242,1);
        position: absolute;
        .px2rem(top, 18);
        right: 0;
      }
    }
  }
}
/deep/ .h3think-popover__wrap[x-placement='bottom-start'] .h3think-popover__arrow {
  left: 0.45rem;
}
/deep/ .h3think-popover__content {
  padding: 0;
}
/deep/ .view-wrapper {
  .view-item {
    .px2rem(height, 98);
    .px2rem(line-height, 98);
    .px2rem(padding-right, 28);
    .px2rem(padding-left, 30);
    border-bottom: 1px solid #EBEDF2;
    font-size: 0;
    &:last-child {
      border-bottom: none;
    }
  }
  .view-title {
    .px2rem(font-size, 30);
    .px2rem(margin-left, 5);
    color:rgba(51,51,51,1);
  }
  .view-i {
    .px2rem(font-size, 30);
    color:rgba(16,127,255,1);
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
  background:rgba(245,247,249,1);
  .px2rem(font-size, 26);
  .px2rem(height, 44);
  .px2rem(line-height, 44);
  color:rgba(51,51,51,1);
  text-align: center;
  position: fixed;
  // .px2rem(bottom, 6);
  right: 0;
  left: 0;
  .px2rem(bottom, 0);
  bottom: calc(0.08rem + env(safe-area-inset-bottom));
  bottom: calc(0.08rem + constant(safe-area-inset-bottom));
  &.bottom {
    .px2rem(bottom, 6);
  }
}

.lightApp-list-add {
  position: fixed;
  // left: 0;
  // right: 0;
  left:50%;
  .px2rem(bottom, 44);
  bottom:calc(0.8rem + constant(safe-area-inset-bottom));
  bottom:calc(0.8rem + env(safe-area-inset-bottom));
  margin: 0 auto;
  .px2rem(width, 180);
  .px2rem(height, 180);
  .px2rem(margin-left, -45);
  border-radius: 50%;
  transition: all 1s;
  box-shadow: 0 0.16rem 0.333333rem 0 rgba(29, 101, 224, 0.22);
  z-index: 98;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(45deg) scale(.5);
  transform-origin: 0% center;
  background:rgba(16,127,255,0.8);
  // bottom: calc(0.8rem + env(safe-area-inset-bottom));
  // bottom: calc(0.8rem + constant(safe-area-inset-bottom));
  span {
    color: white;
    font-weight: 800;
    .px2rem(font-size, 64);
  }
}
.rows-container {
  .px2rem(padding-left, 24);
  .px2rem(padding-right, 24);
  .px2rem(padding-bottom, 24);
  .empty-text {
    .px2rem(font-size, 26);
    color: #999;
    display: inherit;
    text-align: center;
  }
  .data-add {
    .px2rem(width, 270);
    .px2rem(height, 72);
    .px2rem(line-height, 72);
    background:rgba(16,127,255,1);
    border-radius:44px;
    margin: 0 auto;
    .px2rem(margin-top, 48);
    text-align: center;
    color: #fff;
    .px2rem(font-size, 30);
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
    .px2rem(border-radius, 16);
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
.v-enter,.v-leave-to{
  opacity: 0;
}
.v-enter-active,.v-leave-active{
  transition: opacity .5s;
}
</style>
