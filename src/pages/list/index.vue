<template>
  <div id="list">
    <layout
      :title="DisplayName"
      :leftOptions="{preventGoBack: true}"
      :custom="true"
      @on-click-back="goBack"
    >
      <!-- <x-header  v-if="!$store.state.corpId" :left-options="{preventGoBack:true}" @on-click-back="goBack()">
        {{DisplayName}}
      <div class="buttons">
        <i class="button-icon buttons-item" v-if="isCustomActionsBol" @click="openMoreActions">. . .</i>
        <div class="mask-wrap animate" v-show="isMoreActionsBol">
          <div class="more-mask" @click="closeMoreActions"></div>
          <ul class="more-body animate" :class="[$store.state.corpId?'isDing':'']">
            <li class="more-item" v-for="item in CustomActions" :key='item.Text' @click="DoAction(item.Action)">{{item.Text}}</li>
          </ul>
        </div>
      </div>
    </x-header> -->
      <div
        slot="header__right"
        class="buttons"
      >
        <i
          v-if="isCustomActionsBol"
          class="button-icon buttons-item"
          @click="openMoreActions"
        >. . .</i>
        <div
          v-show="isMoreActionsBol"
          class="mask-wrap animate"
        >
          <div
            class="more-mask"
            @click="closeMoreActions"
          ></div>
          <ul
            class="more-body animate"
            :class="[$store.state.corpId ? 'isDing' : '']"
          >
            <li
              v-for="item in CustomActions"
              :key="item.Text"
              class="more-item"
              @click="DoAction(item.Action)"
            >
              {{ item.Text }}
            </li>
          </ul>
        </div>
      </div>
      <div class="wrapper">
        <div
          v-show="!IsSearching"
          class="top-panel  bd-top"
        >
          <div @click="showSearch">
            <span class="icon h3yun_All search-o"></span>
            <span>搜索</span>
          </div>
          <div @click="toggleFilter">
            <span class="icon filter-o h3yun_All"></span>
            <span>筛选</span>
          </div>
        </div>
        <div
          v-show="IsSearching"
          class="top-panel-search bd-top "
        >
          <div>
            <input
              ref="outText"
              v-model="SearchKey"
              type="text"
              :placeholder="placeHolder"
            />
            <span class="search h3yun_All search-o"></span>
            <span
              class="clear h3yun_All close-circle"
              @click="cancelSearch"
            ></span>
          </div>
          <div @click="hideSearch">
            取消
          </div>
        </div>
        <!-- 日历模式 -->
        <div
          v-show="isCalendarMode && !SearchKey"
          ref="calendarContent"
          class="calendar-content"
        >
          <!-- <input class="calendar" type="datetime" v-model="CalendarTime"> -->
          <calendar
            :choseDay="clickDay"
            :changeMonth="changeMonth"
            :collapse.sync="isCalendarCollapse"
          />
        </div>
        <div
          v-show="isCalendarMode && !SearchKey"
          class="calendar-title"
          style="position:absolute;z-index:90;width:100%"
        >
          {{ CalendarTime === CurDate ? '今天' : CalendarTime }}
        </div>
        <!-- 解决点击calendar-title会触发日历时间改变问题 -->
        <div
          v-show="isCalendarMode && !SearchKey"
          class="calendar-split"
        >
        </div>
        <h3-scroll
          ref="scroll"
          class="scroll-wrapper"
          :loadMore="loadMore"
          :pageSize="limit"
          :scroll="scrollContent"
          :refresh="doRefresh"
          :class="{'scroll-wrapper__calendar': isCalendarMode && isCalendarCollapse}"
        >
          <div>
            <div
              v-show="searchKey && searchWrapShowBol"
              class="search-result-num dp-font30"
            >
              搜索结果：共{{ searchTotal }}条
            </div>
            <div
              v-show="searchKey && searchWrapShowBol && searchData.length < 1"
              class="no-result-wrap"
            >
              <div class="no-result-content">
                <span class="icon icon-wujieguo"></span>
                <p class="dp-font24">
                  未找到"{{ searchKey }}"相关结果
                </p>
              </div>
            </div>
            <!-- 列表模式 -->
            <template v-if="!isAxisMode">
              <div
                :id="Item.ObjectId"
                v-for="(Item,index) in ItemDatas"
                v-cloak
                :key="index"
                class="common-box selectitem list-item"
                :class="[ItemDatas && ItemDatas.length > 0 && ItemDatas.length - 1 == index ? 'item-bottom bd-db' : 'bd-top']"
                :data-item="Item"
                @click="openListItem(Item)"
              >
                <div class="item-container">
                  <div
                    v-if="CanSelect"
                    class="item-select item-select-a"
                    @click.stop.prevent="changeSelectState(Item)"
                  >
                    <i
                      v-if="Item.Selected"
                      class="h3yun_All check-circle checkyes"
                    ></i>
                    <i
                      v-else
                      class="h3yun_All check-circle checkno"
                    ></i>
                  </div>
                  <div
                    class="item-content"
                    style="flex-grow:2;"
                  >
                    <div
                      class="item-product"
                      :class="{'item-product-hasimage': ShowImage}"
                    >
                      <div
                        v-if="ShowImage"
                        v-preview="{isPreview: true, corpId: $store.state.corpId}"
                        class="item-product-left"
                      >
                        <img
                          :id="Item.IconId"
                          v-if="Item.__IconUrl"
                          :src="Item.__IconUrl"
                          :data-name="Item.Name"
                        />
                        <img
                          v-if="!Item.__IconUrl"
                          src="../../assets/img/icon-pic.png"
                        />
                      </div>
                      <div
                        class="item-product-body"
                        :class="{'no-pic': !ShowImage}"
                        @click.stop="openListItem(Item)"
                      >
                        <div class="item-title-name">
                          <div class="item-title-top">
                            <span v-if="(Item.Name && !Item.Name.IsCustom) || !Item.Name">{{ Item.Name }}</span>
                            <span v-if="Item.Name && Item.Name.IsCustom">{{ Item.Name.Value }}</span>
                          </div>
                          <span
                            v-if="Item.Status || Item.Status == 0"
                            class="item-status"
                            :class="[statuArr[Number(Item.Status)].bg]"
                          >{{ statuArr[Number(Item.Status)].text }}</span>
                        </div>
                        <div class="item-summary">
                          <div
                            v-for="(dicData,kindex) in Item.MobileDicData"
                            :key="kindex"
                            class="item-wrapper"
                          >
                            <template v-if="kindex < 5">
                              <span class="title">{{ dicData.key }} :</span>
                              <span class="value value-change">{{ dicData.value }}</span>
                            </template>
                          </div>
                        </div>
                        <div
                          v-if="Item.Status === 2 && IsWorkflow"
                          class="item-handler"
                        >
                          <span>当前处理人：</span>
                          <span>{{ Item.Participant }}</span>
                        </div>
                        <div
                          v-if="Item.ShowLabel"
                          class="item-summary"
                        >
                          <div
                            v-for="(LabelItem) in Item.LabelDatas"
                            :key="LabelItem.Code"
                            class="item-wrapper"
                            :data-item="LabelItem"
                          >
                            {{ LabelItem.DisplayName }} :
                            <span
                              class="item-label"
                              :style="{backgroundColor: '#' + Item[LabelItem.Code].Color.toString(16)}"
                            >
                              {{ Item[LabelItem.Code].Value }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 时间轴模式 -->
            <div
              v-if="isAxisMode"
              class="content-box timeline"
            >
              <div class="list-content list-content-hook">
                <div
                  v-for="group in groupDates"
                  :key="group.id"
                >
                  <div class="timeline-item">
                    <div class="timeline-item-head-group">
                      <i class="icon-xuanzhong h3yun_All single-selection-o"></i>
                    </div>
                    <div class="timeline-item-tail"></div>
                    <div class="timeline-item-content">
                      <p class="item-group">
                        {{ group.key }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-for="(Item,index) in group.value"
                    :key="Item.ObjectId"
                    class="timeline-item"
                    @click="openListItem(Item)"
                  >
                    <div class="timeline-item-color timeline-item-head">
                    </div>
                    <div
                      class="timeline-item-tail"
                      style="display:block;"
                    ></div>
                    <div class="timeline-item-content">
                      <div class="item-wrapper">
                        <div>
                          <p
                            v-if="axis && Item[axis] && timeLineAxisDisplayFormat === 'yyyy-mm-dd hh:ii'"
                            class="item-time"
                          >
                            {{ getFormatDateStr(Item[axis]) }}
                          </p>
                          <!-- <div class="item-status" v-if="Item.Status>-1" :class="[statuArr[Item.Status] && statuArr[Item.Status].bg]">{{statuArr[Item.Status] && statuArr[Item.Status].text}}</div>  -->
                        </div>
                        <div class="item-product">
                          <div>
                            <div class="item-title-name">
                              <div class="item-title-top">
                                <span v-if="(Item.Name && !Item.Name.IsCustom) || !Item.Name">{{ Item.Name }}</span>
                                <span v-if="Item.Name && Item.Name.IsCustom">{{ Item.Name.Value }}</span>
                              </div>
                              <span
                                class="item-status"
                                :class="[statuArr[Number(Item.Status)].bg]"
                              >{{ statuArr[Number(Item.Status)].text }}</span>
                            </div>
                            <pre style="overflow:hidden;text-overflow:ellipsis;">{{ Item.Summary }}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="ItemDatas.length === 0 && !(searchKey && searchWrapShowBol) && !IsLoading"
              class="noMore collapse"
            >
              没有更多数据
            </div>
            <!--  <div class="noMore noCollapse" ref="noCalendarCollapse" v-show="isCalendarMode && !isCalendarCollapse">没有更多数据</div>-->
          </div>
        </h3-scroll>
      </div>
      <div class="list-guide-tip">
        <guide-tool-tip
          v-if="showGuideTip"
          content="点击新建业务数据"
          :showTip="showGuideTip"
          direction="right-bottom"
          @hideTip="hideTip"
        />
        <h3-tool-tip
          v-else
          content="点击新建业务数据"
          :showTip="showTip"
          direction="right-bottom"
          @hideTip="hideTip"
        />
      </div>
      <div
        v-if="HasNew"
        class="add"
        @click="openForm"
      >
        <span class="h3yun_All close"></span>
      </div>
      <filterpage
        v-show="showFilter"
        v-cloak
        :pageId="pageId"
        :isShow="showFilter"
        :menuCode="MenuCode"
        :scopes="AclTypes"
        :queryItems="QueryItems"
      />
    </layout>
  </div>
</template>

<script>
import { H3Scroll } from 'h3-mobile-vue';
import '../../utils/pre-view';
import preview from '../../directives/preview';
import ListView from '../../utils/list-view';
// import Search from '../../components/search/search';
import { getAppMenuData, getAppMenuDataByParams, doActionData } from '../../service/get-data';
import {
  setRightMultiMenu, hideRightMenu, setTitle, closeApp,
} from '../../config/dingtalk-interface';
import {
  GetListScopeType, isEmptyObject, getFirstAndLastMonthDay, SortDirection, isiOS,
} from '../../config/common';
import { SolutionTypes, SolutionState } from '../../config/license';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import filterpage from '../../components/filters/index.vue';
import h3ToolTip from '../../../packages/widgets/h3-tool-tip/h3-tool-tip.vue';
import guideToolTip from '../../components/introduce/guide-tool-tip/index.vue';
import calendar from '../../../packages/components/h3-calendar';

/* eslint-disable no-underscore-dangle */
// Vue.use(VueScroller);
export default {
  name: 'List',
  components: {
    // Search,
    filterpage,
    h3ToolTip,
    calendar,
    guideToolTip,
    H3Scroll,
  },
  directives: {
    preview,
  },
  data () {
    return {
      AppCode: '',
      MenuCode: '',
      DisplayName: '',
      AclTypes: [],
      CurrentScopeType: GetListScopeType.GlobalAll,
      ItemDatas: [],
      TotalCount: 0, // 列总条数，公用（与查询公用）
      PageIndex: 0, // 公用
      CustomActions: [], // 自定义按钮
      HasMore: false, // 公用
      HasNew: false, // 是否可以新增
      HasImport: false, // 是否可以导入
      CanSelect: false, // 是否可以选中
      ListMode: true, // 列表模式还是日历模式
      // 日历模式参数
      CurDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      CalendarTime: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      // Start: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`,
      // End: getFirstAndLastMonthDay(new Date().getFullYear(), new Date().getMonth() + 1),
      Start: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      End: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() + 1}`,
      IsSearching: false, // 是否正在查询
      // 过滤
      QueryDefaultValues: null,
      QueryParams: {}, // 过滤参数
      QueryItems: [],
      SearchKey: '',
      FilterParamsJsonString: '',
      Sort: '',
      Desc: true,
      DefaultSort: true,
      SelectedSortItem: {
        CanSort: true,
        DataType: 5,
        Desc: false,
        DisplayName: '创建时间',
        Name: 'CreatedTime',
        Selected: true,
        SortDesc: false,
      },
      RightButtonFlag: false,
      IsWorkflow: false,
      // 失败后重复请求一次
      ReLoadCount: 0,
      IsLoading: false,
      FirstLoad: true,
      NotLoadData: true,
      DefaultDesc: true,
      DefaultSortName: '',
      Listbool: false,
      QueryMenus: null,
      ShowImage: false,
      DefaultIconUrl: '/Content/images/product_default.png',
      javascript: '',
      isCustomActionsBol: false, // 是否有自定义按钮
      isMoreActionsBol: false, // 是否显示自定义按钮
      loadingTitle: '加载中...',
      isAxisMode: false, // 判断是否是时间轴模式
      isCalendarMode: false, // 判断是否是日历模式
      isCalendarCollapse: true, // 日历展开折叠
      showFilter: false,
      pageId: H3PluginDeveloper.IGuid(),
      placeHolder: '搜索标题',
      listView: null,
      statuArr: [
        {
          text: '草稿',
          bg: 'bg-org',
        },
        {
          text: '生效',
          bg: 'bg-grr',
        },
        {
          text: '进行中',
          bg: 'bg-blue',
        },
        {
          text: '作废',
          bg: 'bg-greay',
        },
      ],
      groupDates: [],
      isRefreshing: false,
      lastPosition: 0, // 上次滚动的位置，返回时还原
      showTip: false,
      showGuideTip: false,
      noDataText: '',
      limit: 15,
      searchKey: '',
      searchTotal: null,
    };
  },
  computed: {
    calendarStyles () {
      let style = {};
      if (this.isCalendarMode) {
        // if (this.SearchKey) {
        //   style = {
        //     'margin-top': '39px',
        //   };
        // } else {
        //   style = {
        //     'margin-top': '0',
        //   };
        // }
        style = {
          top: '0',
        };
      }
      return style;
    },
  },
  watch: {
    DisplayName (val) {
      if (val && val !== undefined) {
        setTitle(val);
      }
    },
    SearchKey () {
      this.searchByKeyword();
    },
    CalendarTime (val) {
      this.Start = val;
      const end = new Date(val.replace(/-/g, '/'));
      end.setDate(end.getDate() + 1);
      this.End = this.convertDate(end);
      this.doRefresh();
    },
  },
  created () {
    // 加载列表数据
    const that = this;
    that.AppCode = this.$route.params.appCode;
    that.MenuCode = that.$route.params.schemaCode || that.$route.query.schemaCode || window.GlobalConfig.menuCode;
    that.DisplayName = that.$route.params.appName;
    H3PluginDeveloper.IShowPreLoader(that.loadingTitle);
    // that.getMenuList(
    //   that.MenuCode,
    //   that.PageIndex,
    //   that.CurrentScopeType,
    //   that.Start,
    //   that.End,
    //   that.NotLoadData,
    //   that.SelectedSortItem.Name,
    //   that.Desc,
    // );

    // 确认筛选
    that.$root.eventHub.$on(`executeFilter-${that.pageId}`, (params) => {
      that.HasMore = false;
      that.showFilter = false;
      if (params.scopeType !== undefined) {
        that.CurrentScopeType = params.scopeType;
      }
      that.QueryParams.searchParamsJson = params.searchParamsJson;
      that.formatQueryParams();
      that.doRefresh();
      that.setButtons();
    });
    // 取消筛选
    that.$root.eventHub.$on('cancel-filter', () => {
      that.showFilter = false;
      that.setButtons();
    });
    // 表单更新
    that.$root.eventHub.$on('form-updated', () => {
      // this.QueryParams = {};
      that.doRefresh();
    });
    // 转发更新
    that.$root.eventHub.$on('forward-updated', () => {
      that.doRefresh();
    });
  },
  mounted () {
    // this.$refs.myscroller && this.$refs.myscroller.finishInfinite(true);
    // const that = this;
    // setTimeout(()=>{
    //   that.$refs.myscroller && that.$refs.myscroller.finishInfinite(false);
    // },300);
  },
  doRefresh () {
    const scroll = this.$refs.scroll;
    if (scroll && scroll.mescroll) {
      scroll.mescroll.resetUpScroll();
    }
  },
  activated () {
    if (this.lastPosition) {
      // setTimeout(() => {
      if (this.$refs.scroll && this.$refs.scroll.mescroll) {
        this.$refs.scroll.$el.scrollTop = this.lastPosition;
      }
      // }, 0);
    }
    this.setButtons();
  },
  deactivated () {
    hideRightMenu();
  },
  beforeRouteLeave (to, from, next) {
    hideRightMenu();
    if (to.path === '/schemas' || to.path === '/home' || to.path === '/apps' || to.path === '/rootSchemas' || to.path === '/singleApp') {
      this.$store.state.excludeComp = ['List'];
      this.$root.eventHub.$off('form-updated');
    } else {
      this.$store.state.excludeComp = [];
    }
    next();
  },
  methods: {
    inputFocus () {
      alert(1);

      this.$nextTick(() => {
        this.$refs.outText.focus();
        this.$emit('input');
      });
    },
    goBack () {
      H3PluginDeveloper.IHidePreLoader();
      const solutionState = window.GlobalConfig.solutionStates;
      const solutionType = window.GlobalConfig.solutionType;
      const hasSend = window.localStorage.getItem('hasSend');
      if (solutionState && solutionState.indexOf(SolutionState.Expire) > -1 && solutionType !== SolutionTypes.APass) {
        this.$h3.modal.hide();
      }
      if (solutionState && solutionState.indexOf(SolutionState.WillExpire) > -1 && !hasSend) {
        this.$h3.modal.hide();
      } else if (window.GlobalConfig.isAdministrator && !hasSend && (solutionState.indexOf(SolutionState.FileSizeExceed) > -1 || solutionState.indexOf(SolutionState.FileSizeWillExceed) > -1)) {
        this.$h3.modal.hide();
      }
      if ($('div.fly-zoom-box').length > 0) {
        $('.fly-zoom-box-close').click();
      } else if (this.$aut.select.isShow()) {
        this.$aut.select.hide();
      } else if (this.$store.state.DateTimePluginShow) {
        this.$h3.datetime.hide();
      } else if (this.showFilter) {
        this.showFilter = false;
      } else if (window.GlobalConfig.isList) {
        closeApp();
      } else if (this.$store.state.isSingleApp) {
        this.$router.replace({
          name: 'singleApp',
        });
      } else {
        // this.$router.go(-1);
        /**
         * add by guosha
         * 返回正确的上一级
         */
        this.$router.replace({
          name: 'schemas',
          query: {
            appCode: this.AppCode,
          },
          params: {
            appCode: this.AppCode,
          },
        });
      }
    },
    // 打开表单页面
    openForm () {
      if (this.showTip) {
        this.hideTip();
      }
      this.$router.push({
        name: 'formPage',
        params: {
          schemaCode: this.MenuCode,
        },
        query: {
          schemaCode: this.MenuCode,
          mode: 'create',
        },
      });
    },
    /**
     * changed by linxh@authine.com
     * description ios下无法直接调用focus方法，必须通过一个手动触发的事件引诱focus方法
     * please call me bigOld
     * copyright auguest 26 2019
    */
    showSearch () {
      this.IsSearching = true;
      this.$nextTick(() => {
        this.$refs.outText.focus();
        this.$emit('input');
      });
    },
    hideSearch () {
      this.IsSearching = false;
      this.SearchKey = '';
      this.cancelSearch();
    },
    toggleFilter () {
      this.showFilter = true;
      hideRightMenu();
    },
    hideTip () {
      this.showGuideTip = false;
      this.showTip = false;
    },
    // 切换选中状态
    changeSelectState (item) {
      this.$set(item, 'Selected', !item.Selected);
    },
    // 格式化过滤参数
    formatQueryParams () {
      if (!this.QueryParams) {
        this.QueryParams = {};
      }
      if (this.SearchKey) {
        if (!this.QueryParams.searchParamsJson) {
          const tmp = {};
          tmp.Name = [this.SearchKey];
          // this.QueryParams.searchParamsJson=JSON.stringify(tmp);
          this.QueryParams.searchParamsJson = tmp;
        } else {
          const tmp = this.QueryParams.searchParamsJson;
          tmp.Name = [this.SearchKey];
          // this.QueryParams.searchParamsJson=JSON.stringify(tmp);
          this.QueryParams.searchParamsJson = tmp;
        }
      } else if (this.QueryParams.searchParamsJson) {
        const tmp = this.QueryParams.searchParamsJson;
        delete tmp.Name;
        this.QueryParams.searchParamsJson = tmp;
      } else {
        this.QueryParams.searchParamsJson = {};
      }
      this.QueryParams.limit = 15;
      this.QueryParams.ID = this.MenuCode;
      this.QueryParams.scopeType = this.CurrentScopeType;
    },
    // 根据关键字过滤
    searchByKeyword () {
      const self = this;
      if (!this.SearchKey) {
        this.cancelSearch();
      } else {
        self.formatQueryParams();
        self.doRefresh();
      }
    },
    // 取消关键字过滤
    cancelSearch () {
      this.SearchKey = '';
      this.PageIndex = 0;
      this.ItemDatas = [];
      this.formatQueryParams();
      this.doRefresh();
    },

    buildLabelItems (data, tempItems) {
      const items = tempItems;
      for (let i = 0, len = items.length; i < len; i += 1) {
        items[i].LabelDatas = [];
        items[i].ShowLabel = false;

        for (const key in data.rows.Columns) {
          if (items[i][key] != null && items[i][key].IsCustom && items[i][key].Color !== '-1') {
            items[i].ShowLabel = true;
            items[i].LabelDatas.push(data.rows.Columns[key]);
          }
        }
      }
    },
    // 展示列表数据
    displayItems (data) {
      this.TotalCount = data.rows.DataCount;
      this.axis = data.rows.Axis;
      this.timeLineAxisDisplayFormat = data.rows.TimeLineAxisDisplayFormat
        ? data.rows.TimeLineAxisDisplayFormat
        : 'yyyy-mm-dd hh:ii';
      if (data.rows.DisplayMode === 2) {
        this.isAxisMode = true;
        this.formatItems(data.rows.ReturnData);
      } else {
        if (!this.listView) {
          this.listView = new ListView();
          this.listView.Init(data.rows, this);
        }
        if (data.rows.ReturnData) {
          for (const item of data.rows.ReturnData) {
            const mobileDicData = item.__MobileDicData;
            item.MobileDicData = [];
            for (const key in mobileDicData) {
              if (Object.prototype.hasOwnProperty.call(mobileDicData, key)) {
                const dicData = mobileDicData[key];
                for (const keykey in dicData) {
                  let colvalue = dicData[keykey];
                  if (Object.prototype.hasOwnProperty.call(dicData, keykey)) {
                    for (const conkey in data.rows.Columns) {
                      const column = data.rows.Columns[conkey];
                      if (column.Code === key && !isNaN(item[key])) {
                        if (item[key] && item[key].constructor === Number) {
                          colvalue = parseFloat(item[key]).toFixed(column.DecimalPlaces || 0);
                          if (column.ShowMode && column.ShowMode === 1) {
                            colvalue = colvalue.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                          }
                        }
                      }
                    }
                    item.MobileDicData.push({
                      key: keykey,
                      value: colvalue,
                    });
                  }
                }
              }
            }
            if (
              item.WorkflowInstanceId &&
              data.rows.WorkflowState &&
              data.rows.WorkflowState[item.WorkflowInstanceId] &&
              data.rows.WorkflowState[item.WorkflowInstanceId].length > 0
            ) {
              let participant = '';
              if (data.rows.WorkflowState[item.WorkflowInstanceId].length === 1) {
                if (this.$store.state.UserInfo.userId === data.rows.WorkflowState[item.WorkflowInstanceId][0].UserId) {
                  participant = '我';
                } else {
                  participant = data.rows.WorkflowState[item.WorkflowInstanceId][0].UserName;
                }
                item.Participant = participant;
              } else {
                let userCount = 0;
                for (const workitem of data.rows.WorkflowState[item.WorkflowInstanceId]) {
                  userCount += 1;
                  if (userCount <= 2) {
                    if (this.$store.state.UserInfo.userId === workitem.UserId) {
                      participant += '我、';
                    } else {
                      participant += `${workitem.UserName}、`;
                    }
                  }
                }
                if (userCount > 2) {
                  item.Participant = `${participant.substr(0, participant.length - 1)}等`;
                } else {
                  item.Participant = participant.substr(0, participant.length - 1);
                }
              }
            }
            item.Selcted = false;
          }
        }
      }
      this.buildLabelItems(data, data.rows.ReturnData);
      if (this.PageIndex === 0) {
        this.ItemDatas = [].concat(data.rows.ReturnData);
      } else {
        this.ItemDatas = this.ItemDatas.concat(data.rows.ReturnData);
      }

      if (this.ItemDatas && data.rows.DataCount > this.ItemDatas.length) {
        this.HasMore = true;
        this.noData = false;
        this.noDataText = '';
        this.PageIndex += 1;
      } else {
        this.HasMore = false;
        this.noData = true;
        if (!this.isCalendarMode && data.rows.DataCount.DisplayMode != 1) {
          this.noDataText = '没有更多数据';
        } else {
          this.noDataText = '';
        }
      }
    },
    formatItems (items) {
      if (items && items.length > 0) {
        for (const item of items) {
          const axisValue = item[this.axis];
          if (!axisValue) {
            let emptyObj = this.getKeyObject(this.groupDates, this.emptyKey);
            if (!emptyObj) {
              emptyObj = {
                key: this.emptyKey,
                value: [],
                id: H3PluginDeveloper.IGuid(),
              };
              this.groupDates.push(emptyObj);
            }
            emptyObj.value.push(item);
          } else {
            const dateStr = new Date(axisValue.replace(/-/g, '/')).Format('yyyy-MM-dd');
            let dateObj = this.getKeyObject(this.groupDates, dateStr);
            if (!dateObj) {
              dateObj = {
                key: dateStr,
                value: [],
                id: H3PluginDeveloper.IGuid(),
              };
              this.groupDates.push(dateObj);
            }
            dateObj.value.push(item);
          }
        }
      }
    },
    loadMore (page, done, err) {
      if (page.num === 1) {
        this.resetParam();
      }
      this.noDataText = '';
      this.IsLoading = true;
      const params = Object.assign({}, this.QueryParams);
      if (isEmptyObject(params.searchParamsJson)) {
        const start = (page.num - 1) * this.limit;
        this.getMenuList(
          this.MenuCode,
          page.num - 1,
          this.CurrentScopeType,
          this.Start,
          this.End,
          this.NotLoadData,
          this.SelectedSortItem.Name,
          this.Desc,
          (curPageData) => {
            const data = curPageData.ReturnData.Data;
            this.isChild = data.IsChild;
            this.scopes = [].concat(data.ScopeTypes);
            this.DisplayName = data.DisplayName || data.rows.DisplayName;
            this.ID = data.rows.SchemaCode;
            this.QueryItems = data.QueryItems;
            if (page.num === 1) {
              this.ItemDatas = [];
            }
            done(data.rows.ReturnData.length, data.Total);
            // this.displayItems(curPageData.ReturnData.Data);
          },
        );
      } else {
        if (this.DefaultSort) {
          if (!params.sort) {
            params.sort = this.DefaultSortName;
          }
          if (!params.order) {
            params.order = this.DefaultDesc ? 'desc' : 'asc';
          }
        }
        params.searchParamsJson = JSON.stringify(params.searchParamsJson);
        params.limit = 15;
        params.offset = this.PageIndex * params.limit;
        params.ID = this.MenuCode;
        params.ActionName = 'GetAppDatas';
        if (this.isCalendarMode && !this.IsSearching) {
          const startDate = new Date(this.Start.replace(/-/g, '/'));
          const endDate = new Date(this.End.replace(/-/g, '/'));
          params.from = startDate.getTime();
          params.to = endDate.getTime();
        }
        this.getMenuListByFilters(
          params,
          (curPageData) => {
            if (page.num === 1) {
              this.ItemDatas = [];
            }
            this.searchWrapShowBol = true;
            this.ID = curPageData.ReturnData.Data.rows.SchemaCode;
            this.searchData = curPageData.ReturnData.Data.rows.ReturnData;
            this.searchTotal = curPageData.ReturnData.Data.Total;
            done(this.searchData.length, curPageData.ReturnData.Data.Total);
            // this.displayItems(curPageData.ReturnData.Data);
          },
        );
      }
    },
    containsKey (arr, key) {
      for (const tmp of arr) {
        if (tmp.key === key) {
          return true;
        }
      }
      return null;
    },
    getKeyObject (arr, key) {
      for (const tmp of arr) {
        if (tmp.key === key) {
          return tmp;
        }
      }
      return null;
    },
    getFormatDateStr (dateStr) {
      return new Date(dateStr.replace(/-/g, '/')).Format('hh:mm');
    },

    // 打开自定义按钮
    openMoreActions () {
      this.isMoreActionsBol = true;
    },
    // 关闭自定义按钮
    closeMoreActions (e) {
      if (e.target.className === 'more-mask') {
        this.isMoreActionsBol = false;
      }
    },
    // 工具栏自定义按钮点击事件
    DoAction (ActionName) {
      this.isMoreActionsBol = false;
      this.$store.state.childRenderedLen = 0;
      this.$store.state.gridChildLen = 0;
      this.listView.DoAction(ActionName);
    },
    getSelected () {
      // 获取界面上的选中元素
      const selected = [];
      for (const item of this.ItemDatas) {
        if (item.Selected) {
          selected.push(item);
        }
      }
      return selected;
    },

    RefreshView () {
      if (this.$route.name === 'list') {
        this.doRefresh();
      }
    },
    async getMenuList (code, pageIndex, aclType, from, to, NotLoadData, sort, desc, successCallback) {
      // let start = Date.parse(from);
      // let end = Date.parse(to);
      const startDate = new Date(from.replace(/-/g, '/'));
      const endDate = new Date(to.replace(/-/g, '/'));
      const start = startDate.getTime();
      const end = endDate.getTime();
      let data = await getAppMenuData(1, code, pageIndex, aclType, start, end, null, NotLoadData, null, sort, desc);
      H3PluginDeveloper.IHidePreLoader();
      this.IsLoading = false;
      if (!data.Successful) {
        H3PluginDeveloper.IShowError(data.ErrorMessage);
        return;
      }
      successCallback(data);
      data = data.ReturnData.Data;
      if (data.rows.Javascript === null) {
        data.rows.Javascript = '$.ListView.ActionPreDo = function(actionCode){};';
      }

      // 默认过滤条件
      if (data.QueryDefaultValues) {
        if (data.QueryDefaultValues.constructor === String) {
          data.QueryDefaultValues = data.QueryDefaultValues.replace(/(\\\\)/g, '\\');
          this.QueryParams.searchParamsJson = JSON.parse(data.QueryDefaultValues);
        } else {
          this.QueryParams.searchParamsJson = data.QueryDefaultValues;
        }
      }
      this.QueryParams.ID = code;
      this.QueryParams.limit = 15;
      this.QueryParams.scopeType = GetListScopeType.GlobalAll;

      this.QueryItems = data.QueryItems;
      this.NotLoadData = false;
      this.AppCode = data.AppCode;
      this.DisplayName = data.DisplayName;
      this.ReLoadCount = 0;
      this.AclTypes = data.ScopeTypes;
      this.IsWorkflow = data.IsWorkflow;
      this.SelectedSortItem.Desc = data.SortDirection === SortDirection.Descending || false;
      this.SelectedSortItem.Name = data.SortBy;
      if (this.FirstLoad) {
        this.DefaultDesc = this.SelectedSortItem.Desc;
        this.Desc = this.SelectedSortItem.Desc;
        this.DefaultSortName = data.SortBy;
      }
      // 判断是时间轴模式还是列表模式
      if (data.rows.DisplayMode === 1) {
        this.isCalendarMode = true;
      } else if (data.rows.DisplayMode === 2) {
        this.isAxisMode = true;
      }
      this.ShowImage = data.rows.IconProperty || false;
      // 获取列表自定义按钮
      this.CustomActions = [];
      for (const k in data.rows.Actions) {
        if (data.rows.Actions[k].Action === 'Create') {
          this.HasNew = true;
          // this.CustomActions.push(data.rows.Actions[k]);
        } else if (
          data.rows.Actions[k].Action === 'Import' ||
          data.rows.Actions[k].Action === 'Export' ||
          data.rows.Actions[k].Action === 'Remove' ||
          data.rows.Actions[k].Action === 'PrintQrCode' ||
          data.rows.Actions[k].IsPrintAction
        ) {
          continue;
        } else {
          this.CustomActions.push(data.rows.Actions[k]);
        }
      }

      // 是否可以选中
      this.CanSelect = (data.rows.Selectable && this.CustomActions.length > 0) || false;
      this.ListMode = true;
      if (this.isRefreshing) {
        this.isRefreshing = false;
      } else {
        this.setDingRightMenu();
      }
      this.displayItems(data);
      // if (this.HasNew) {
      //   this.showGuideTip = !!this.$store.state.isShowGuide;
      //   if (!this.showGuideTip) {
      //     const tipKey = `listTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
      //     this.showTip = !localStorage.getItem(tipKey);
      //   }
      // }

        const tipKey = `listTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
        const isShowGuide = window.GlobalConfig.isShowGuide;
        const hasGuided = localStorage.getItem(tipKey);
        if (this.HasNew && !hasGuided && isShowGuide) {
          this.showGuideTip = true;
          const tipKey = `listTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
          localStorage.setItem(tipKey, true);
          if (!this.showGuideTip) {
            this.showTip = false;
          }
        }
    },
    // 添加按钮方法
    setButtons () {
      const that = this;
      const items = [];
      const len = this.CustomActions.length;
      for (let i = 0; i < len; i += 1) {
        const tempObj = {};
        tempObj.id = this.CustomActions[i].Action;
        tempObj.iconId = '';
        tempObj.text = this.CustomActions[i].Text;
        items.push(tempObj);
      }
      // if (len === 2) {
      //   items.push({
      //     id: 'Invalid',
      //     iconId: '',
      //     text: ' ',
      //   });
      // }
      if (items.length > 0) {
        setRightMultiMenu(that.DoAction, items, that.openForm, that.MenuCode);
      } else {
        hideRightMenu();
      }
      // setRightMultiMenu(that.DoAction, items, that.openForm, that.MenuCode);
    },
    setDingRightMenu () {
      if (this.CustomActions.length > 0) {
        this.isCustomActionsBol = true;
        // 设置钉钉新增及自定义按钮
        this.setButtons();
      } else {
        hideRightMenu();
      }
    },
    // 通过过滤参数获取列表数据
    async getMenuListByFilters (params, successCallback) {
      let data = await getAppMenuDataByParams(params);
      this.IsLoading = false;
      if (!data.Successful) {
        H3PluginDeveloper.IShowError(data.ErrorMessage);
        return;
      }
      successCallback(data);
      data = data.ReturnData.Data;
      this.displayItems(data);
    },
    async getDoActionData (postData) {
      const data = await doActionData(postData);
      if (data.Successful) {
        this.doRefresh();
      } else if (data.Errors.length > 0) {
        // 当有返回错误提示信息时，优先显示提示信息
        H3PluginDeveloper.IShowWarn(data.Errors[0]);
      } else {
        H3PluginDeveloper.IShowWarn('失败!');
      }
    },
    // 打开一条记录，跳转到表单或表单首页
    openListItem (tempItem) {
      const item = tempItem;
      // console.log('________?', item);
      // if (!item.Name) {
      //   this.$router.push({
      //     name: 'formPage',
      //     params: {
      //       schemaCode: this.MenuCode,
      //       bizObjectId: item.ObjectId,
      //       linkSource: 'list',
      //     },
      //     query: {
      //       schemaCode: this.MenuCode,
      //       bizObjectId: item.ObjectId,
      //     },
      //   });
      // } else
      if (!item.Name || !item.Name.IsCustom) {
        if (item.EnableHomePage) {
          this.$router.push({
            path: `/sheet-home/${item.ObjectId}/${this.MenuCode}`,
            params: {
              appCode: this.AppCode,
              appName: this.DisplayName,
              mode: item.Status === 0 ? `${item.Status}` : '',
            },
          });
        } else {
          this.$router.push({
            name: 'formPage',
            params: {
              schemaCode: this.MenuCode,
              bizObjectId: item.ObjectId,
              mode: item.Status === 0 ? `${item.Status}` : '',
              // instanceId: item.WorkflowInstanceId
            },
            query: {
              schemaCode: this.MenuCode,
              bizObjectId: item.ObjectId,
              // instanceId: item.WorkflowInstanceId
            },
          });
        }
      } else {
        if (item.Name.SchemaCode === null) {
          item.Name.SchemaCode = this.MenuCode;
        }

        if (item.Name.ObjectId === null) {
          item.Name.ObjectId = item.ObjectId;
        }
        H3PluginDeveloper.IShowForm(
          item.Name.SchemaCode,
          item.Name.ObjectId,
          item.Name.Parameters,
          false,
          item.Name.ShowList,
        );
      }
    },
    doRefresh () {
      this.resetParam();
      this.isRefreshing = true;
      const scroll = this.$refs.scroll;
      if (scroll.mescroll) {
        scroll.mescroll.resetUpScroll();
      }
    },
    resetParam () {
      this.PageIndex = 0;
      this.ItemDatas = [];
      this.groupDates = [];
      const params = Object.assign({}, this.QueryParams);
      if (this.listview) {
        if (!params.searchParamsJson) {
          params.searchParamsJson = {};
        }
      }
    },
    // doRefresh() {
    //   this.isRefreshing = true;
    //   this.PageIndex = 0;
    //   this.ItemDatas = [];
    //   this.groupDates = [];
    //   const params = Object.assign({}, this.QueryParams);
    //   if (this.listview) {
    //     if (!params.searchParamsJson) {
    //       params.searchParamsJson = {};
    //     }
    //     // this.listview.InitQueryItems(params.searchParamsJson);
    //   }
    //   if (isEmptyObject(params.searchParamsJson)) {
    //     this.getMenuList(
    //       this.MenuCode,
    //       this.PageIndex,
    //       this.CurrentScopeType,
    //       this.Start,
    //       this.End,
    //       this.NotLoadData,
    //       this.SelectedSortItem.Name,
    //       this.Desc,

    //     );
    //   } else {
    //     if (this.DefaultSort) {
    //       if (!params.sort) {
    //         params.sort = this.DefaultSortName;
    //       }
    //       if (!params.order) {
    //         params.order = this.DefaultDesc ? 'desc' : 'asc';
    //       }
    //     }
    //     params.searchParamsJson = JSON.stringify(params.searchParamsJson);
    //     params.offset = 0;
    //     params.limit = 15;
    //     params.ActionName = 'GetAppDatas';
    //     if (this.isCalendarMode && !this.IsSearching) {
    //       const startDate = new Date(this.Start.replace(/-/g, '/'));
    //       const endDate = new Date(this.End.replace(/-/g, '/'));
    //       params.from = startDate.getTime();
    //       params.to = endDate.getTime();
    //     }
    //     this.getMenuListByFilters(params);
    //   }
    // },
    refresh (done) {
      this.doRefresh();
      done();
    },
    // infinite(done) {
    //   if (!this.HasMore || this.PageIndex === 0) {
    //     setTimeout(() => {
    //       this.$refs.myscroller && this.$refs.myscroller.finishInfinite(2);
    //     },300);
    //     return;
    //   }
    //   const that = this;
    //   setTimeout(() => {
    //     that.HasMore = false;
    //     if (isEmptyObject(that.QueryParams.searchParamsJson)) {
    //       that.getMenuList(
    //         that.MenuCode,
    //         that.PageIndex,
    //         that.CurrentScopeType,
    //         that.Start,
    //         that.End,
    //         that.NotLoadData,
    //         that.SelectedSortItem.Name,
    //         that.Desc,
    //       );
    //     } else {
    //       // that.QueryParams["offset"] = that.PageIndex * 10;
    //       const params = Object.assign({}, that.QueryParams);
    //       params.offset = that.PageIndex * 10;
    //       params.limit = 15;
    //       params.ID = that.MenuCode;
    //       params.searchParamsJson = JSON.stringify(params.searchParamsJson);
    //       if (that.DefaultSort) {
    //         if (params && params.sort) params.sort = that.DefaultSortName;
    //         if (params && params.order) params.order = that.DefaultDesc ? 'desc' : 'asc';
    //       }
    //       params.ActionName = 'GetAppDatas';
    //       that.getMenuListByFilters(params);
    //     }
    //     if (that.$refs.myscroller) {
    //       that.$refs.myscroller.resize();
    //     }
    //     done();
    //   }, 1500);
    // },
    clickDay (data) {
      this.CalendarTime = this.convertDate(data);
    },
    changeMonth (data) {
      this.CalendarTime = data.replace(/\//g, '-');
    },
    convertDate (date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    scrollContent (mscroll, y) {
      this.lastPosition = y;
    },
  },
};
</script>

<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.aufont {
  font-family: 'aufont' !important;
}
.bg-blue {
  background-color: #37abfd;
}
.bg-grr {
  background-color: #00ce98;
}
.bg-org {
  background-color: #f5a623;
}
.bg-greay {
  background-color: #d6d6d6;
}
#list {
  height: 100%;
  .wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    div.top-panel,
    div.top-panel-search {
      //position: absolute;
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      .px2rem(height, 78);
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      color: #999;
      z-index: 99;
      .px2rem(font-size, 26);
    }
    div.top-panel {
      div {
        flex-basis: 50%;
        text-align: center;
        height: 100%;
        .px2rem(line-height, 78);
        &:first-child {
          border-right: 1px solid #d7d5d5;
        }
      }
    }
    div.top-panel-search {
      div:first-child {
        position: relative;
        .px2rem(flex-basis, 662);
        .px2rem(margin-left, 24);
        .px2rem(height, 54);
        background-color: #f0efef;
        .px2rem(padding-left, 58);
        .px2rem(border-radius, 4);
        input {
          width: 100%;
          .px2rem(height, 54);
          .px2rem(line-height, 54);
          background-color: transparent;
          .px2rem(font-size, 26);
        }
        input::-webkit-input-placeholder {
          color: #ccc;
        }
        input:-moz-placeholder {
          color: #ccc;
        }
        input::-moz-placeholder {
          color: #ccc;
        }
        input:-ms-input-placeholder {
          color: #ccc;
        }
        span {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          .px2rem(font-size, 28);
          &.search {
            .px2rem(left, 16);
            color: #999;
          }
          &.clear {
            .px2rem(right, 16);
            color: #8e8e93;
          }
        }
      }
      div:last-child {
        flex-shrink: 0;
        .px2rem(flex-basis, 88);
        color: #38adff;
        text-align: center;
      }
    }
    .calendar-content {
      position: relative;
      //margin-top: 1.04rem;
      border-top: 1px solid #e4e4e4;
      .calendar {
        width: 100%;
        margin-top: 0.1rem;
        line-height: 25px;
      }
    }
    .calendar-split {
      height: 35px;
    }
    .calendar-title {
      background: #fff;
      line-height: 35px;
      padding-left: 20px;
    }
    .wrapper-content {
      top: 0px;
      position: relative;
      .px2rem(margin-top, 78);
      // bottom: 0;
      // left: 0;
      width: 100%;
    }
  }
  .top-default {
    .px2rem(top, 92);
  }
  .list-guide-tip {
    position: absolute;
    z-index: 66;
    .px2rem(right, 32);
    .px2rem(bottom, 276);
  }

  .buttons {
    position: absolute;
    z-index: 999999999;
    top: 0;
    right: 0.24rem;
    font-size: 0;
    .px2rem(height, 98);
    .px2rem(line-height, 98);
    .buttons-item {
      display: inline-block;
      padding: 0 0.2rem;
      font-size: 18px;
      margin-right: 20px;
      color: #107fff;
      position: relative;
      top: -0.1rem;
    }
    .animate .more-mask {
      opacity: 1;
    }
    .mask-wrap {
      transition: all 0.3s linear;
      .more-mask {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 10000;
        background-color: rgba(3, 3, 3, 0.2);
        transition: opacity 0.3s linear;
      }
      .more-body {
        transform: scale(1);
        opacity: 1;
        position: fixed;
        z-index: 10000;
        .px2rem(top, 98);
        right: 0;
        background: #ffffff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
        border-radius: 6px;
        max-width: 90%;
        min-width: 80px;
        margin: 0;
        padding: 0;
        transform-origin: top right;
        transition: transform 0.3s linear, opacity 0.3s linear;
        &.isDing {
          top: 0;
        }
        .more-item {
          text-align: center;
          list-style: none;
          font-size: 16px;
          color: #209df3;
          letter-spacing: 0.6px;
          height: 44px;
          line-height: 44px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 0 12px;
          min-width: 80px;
        }
        .more-body .more-item:first-child {
          border-top: 0;
        }
      }
    }
  }
  .item-flag {
    position: absolute;
    top: 0;
    right: 5px;
  }
  .checkno {
    color: #dedfde;
  }

  .checkyes {
    color: #0896ff;
  }

  .list-content-wrap {
    top: 2rem !important;
  }

  .common-box {
    padding: 12px;
    border-top: 1px solid #e4e4e4;
    background-color: #fff;
    position: relative;
    min-height: 44px;
  }

  .list-item {
    padding: 16px 12px;
    border-top: 1px solid #e4e4e4;
    background-color: #fff;
    .item-container {
      display: flex;
      position: relative;
      width: 100%;
      .item-select {
        flex-basis: 40px;
        i {
          font-size: 24px;
        }
      }
      .item-content {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 0.2rem;
        .item-product {
          position: relative;
          overflow: hidden;
        }
        .item-product-hasimage {
          .px2rem(min-height, 100);
        }
        .item-product-left {
          position: absolute;
          .px2rem(left, 20);
          top: 50%;
          transform: translateY(-50%);
        }
        .item-product-left img {
          .px2rem(width, 100);
          .px2rem(height, 100);
        }
      }
    }
  }

  .item-product-body {
    margin-left: 78px;
    line-height: 12px;
    h4 {
      color: #333333;
      font-size: 16px;
      margin-bottom: 8px;
    }
    span {
      line-height: 17px;
    }
  }

  .no-pic {
    margin-left: 0;
  }

  .value-change {
    color: #555758 !important;
    font-size: 13px !important;
  }

  .profile {
    width: 37px;
    height: 37px;
    line-height: 37px;
    border-radius: 50%;
    text-align: center;
    color: #fff;
  }

  .profile img {
    width: 37px;
    height: 37px;
    border-radius: 50%;
  }

  .item-summary {
    .px2rem(margin-top, 16);
    background: none;
    font-size: 14px;
    color: #999999;
    .item-wrapper {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .px2rem(line-height, 34);
      .px2rem(margin-bottom, 8);
      .item-label {
        display: inline-block;
        padding: 0 10px;
        .px2rem(height, 34);
        .px2rem(border-radius, 8);
        color: #fff;
      }
    }
  }

  .item-h {
    min-height: 20px;
    width: 100%;
    line-height: 25px;
    padding-right: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0;
  }

  .item-select-a {
    flex-basis: 40px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .checkno {
      margin-left: 0;
    }
  }

  div.item-tool {
    display: flex;
    flex-basis: 40px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    div {
      padding: 5px 0;
      span {
        font-size: 20px;
        color: #108ee9;
      }
    }
  }

  .l-item-box {
    display: inline-block;
    line-height: 1;
    font-size: 12px;
    padding: 2px 4px;
    text-align: center;
    color: #69a8e8;
    border: 1px solid #69a8e8;
    border-radius: 2px;
    margin-left: 9px;
  }

  div.item-handler {
    color: #6abd5f;
    font-size: 14px;
    margin-top: 3px;
  }

  .add {
    .px2rem(width, 96);
    .px2rem(height, 96);
    background-color: #108ee9;
    position: absolute;
    .px2rem(right, 44);
    .px2rem(bottom, 146);
    border-radius: 50%;
    z-index: 2;
    transition: all 1s;
    box-shadow: 0 0 0.8rem rgba(16, 142, 233, 0.5);
    z-index: 110;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(45deg);
    span {
      color: white;
      font-weight: 800;
    }
  }

  div.timeline {
    background-color: #fff;
    .px2rem(padding-left, 49);
    .px2rem(padding-right, 24);
    div.timeline-item {
      position: relative;
      div.timeline-item-head,
      div.timeline-item-head-first {
        position: absolute;
        content: '';
        z-index: 99;
        border-radius: 99px;
      }
      div.timeline-item-head-group {
        position: absolute;
        top: 20px;
        i {
          color: #38adff;
        }
      }
      div.timeline-item-head {
        width: 10px;
        height: 10px;
        left: 1px;
        top: 20px;
      }
      div.timeline-item-tail {
        position: absolute;
        content: '';
        height: 100%;
        width: 1px;
        left: 6px;
        top: 0;
      }
      div.timeline-item-tail,
      div.timeline-item-color {
        background-color: #108ee9 !important;
      }
      div.timeline-item-content {
        .px2rem(padding-top, 15);

        .px2rem(margin-left, 60);
        .px2rem(padding-right, 34);
        .px2rem(padding-bottom, 15);
        .px2rem(border-radius, 8);
        p.item-group {
          .px2rem(height, 70);
          .px2rem(line-height, 70);
        }
        div.item-wrapper {
          position: relative;
          .px2rem(padding-left, 28);
          .px2rem(padding-bottom, 54);
          .px2rem(padding-top, 22);
          box-shadow: 0 0 5px #d9d9d9;
          &:before {
            position: absolute;
            left: -11px;
            top: 10px;
            z-index: 8888;
            content: '';
            border-style: solid;
            border-width: 6px;
            border-color: transparent #fff transparent transparent;
          }
          &:after {
            position: absolute;
            left: -12px;
            top: 10px;
            z-index: 8887;
            content: '';
            border-style: solid;
            border-width: 6px;
            border-color: transparent #d9d9d9 transparent transparent;
          }
          p.item-time {
            .px2rem(font-size, 28);
            color: #797979;
            display: inline-block;
          }
          // .item-title-top {
          //   .px2rem(font-size,32);
          //   color: #333;
          // }
          // pre {
          //   .px2rem(font-size,28);
          //   color: #717171;
          //   .px2rem(margin-top,8);
          // }
        }
      }
    }
  }
  .item-title-name {
    overflow: hidden;
    .px2rem(margin-right, 12);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item-title-top {
      color: #333333;
      .px2rem(font-size, 32);
      .px2rem(margin-right, 12);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .item-status {
      flex-shrink: 0;
      .px2rem(flex-basis, 82);
      color: #fff;
      .px2rem(border-radius, 6);
      .px2rem(font-size, 20);
      .px2rem(padding-left, 21);
      // .px2rem(padding-right,21);
      .px2rem(padding-top, 1);
      .px2rem(padding-bottom, 1);
    }
  }

  .scroll-wrapper {
    position: relative;
    //.px2rem(top, 78) !important;
    top: 0;
    width: 100%;
    height: calc(100% - 78 / @baseFontSize * 1rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    & > div {
      width: 100%;
      padding-bottom: 0;
      overflow-x: hidden;
    }
  }

  .scroll-wrapper__calendar {
    height: calc(100% - 340 / @baseFontSize * 1rem);
    top: 0;
  }
}
.noMore {
  box-sizing: border-box;
  text-align: center;
  padding-top: 20px;
  color: rgb(170, 170, 170);
}
.collapse {
  height: 140px;
}
.noCollapse {
  height: 387px;
}
</style>
