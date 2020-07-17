<template>
  <div id="query-form">
    <layout :title="DisplayName" :leftOptions="{ preventGoBack: true }" @on-click-back="goBack">
    <div class="query-form-search">
      <div class="search-bar" ref="header">
        <div class="searchBarWarpper" :class="{'h3-search-focus':isSearching}">
        <H3SearchBar prefixCls="h3-search-opposite" ref="searchBar" v-model="value" placeholder="请输入关键字"
                     :onChange="searchByKeyAsync"
                     :onCancel="cancelSearch"
                     :showCancelButton="false"
                     :onFocus="onFocus"
                     :onBlur="onBlur" />
        </div>
        <div class="filter" :class="{'filter-active' : filterBtnShowBol}" @click="openFilterModal" v-show="!isSearching">
          筛选
        </div>
      </div>
    </div>
    <!-- :class="[$store.state.corpId?'isDing':'']" -->
    <div class="query-wrapper">
      <div class="query-list-content">
        <div class="top-tip refresh-hook" style="display:none;">
          <div style="display:flex;justify-content: center;">
              <span class="brash-icon icon-arrow-down-thin h3yun_All arrow-down-o"></span>
              <span class="refresh-text">下拉可以刷新</span>
          </div>
        </div>
        <div class="brash-more is-browsered t-c dp-font22" ref="pullUpShow" style="display:none;">加载了10</div>
        <div class="search-result-num dp-font30" v-show='value&&searchWrapShowBol'>搜索结果：共{{searchData.length}}条</div>
        <div class="no-result-wrap" v-show='value&&searchWrapShowBol&&searchData.length<1'>
          <div class="no-result-content">
            <span class="icon icon-wujieguo h3yun_All search-o"></span>
            <p class="dp-font24">未找到"{{value}}"相关结果</p>
          </div>
        </div>
        <a href="javascript:;" v-for="(Item,index) in ItemDatas" :key='index' class="common-box selectitem list-item"
          :id="Item.ObjectId" :data-item="Item" @click.stop.prevent="clickItem(Item)">
          <!--  :class="[ItemDatas && ItemDatas.length>0 && ItemDatas.length-1==index?'item-bottom bd':'bd-top']" -->
          <div class="item-container bd-bot">
            <div class="item-content" style="flex-grow:2;">
              <div class="item-select item-select-a" v-if="CanSelect" @click.stop.prevent="changeSelectState(Item)">
                <i class="dp-font34" :class="['h3yun_All', Item.Selected?'check-circle':'circle-o']" v-if="IsMultiple"></i>
                <i class="dp-font34" :class="[Item.Selected?'icon-Path':'']" v-else></i>
              </div>
              <div class="item-product" :class="{'item-product-hasimage':ShowImage}">
                <div class="item-product-left" v-if="ShowImage">
                  <img src="../../assets/img/product_default.png" v-if="!Item.__IconUrl" @click.stop.prevent="previewDefault()" />
                  <img v-cloak :src="Item.__IconUrl" v-if="Item.__IconUrl" @click.stop.prevent="preview(Item.IconId)" />
                </div>
                <div class="item-product-body" :class="{'no-pic':!ShowImage}">
                  <span v-if="!Item.Name.IsCustom" class="item-title-top dp-font30">
                    {{Item.Name.trim() ? (Item.Name.trim() ? Item.Name.trim() : '--') : '--'}}
                  </span>
                  <span v-else class="item-title-top dp-font30">
                    {{Item.Name.Value}}
                  </span>
                  <span class="activity-name activity l-item-box" v-if="(Item.Status==0||Item.Status=='') && IsWorkflow">审批中</span>
                  <span class="activity-name activity l-item-box" v-if="(Item.Status==0||Item.Status=='') && !IsWorkflow">未提交</span>
                  <span class="activity-name activity l-item-box" v-if="(Item.Status==3) && IsWorkflow">作废</span>
                  <div class="item-summary">
                    <div class="item-wrapper" v-for="(dicData,index) in Item.MobileDicData" :key='dicData.key' v-if='index<6'>
                      <span class="title">{{dicData.key}} :</span>
                      <span class="value value-change">{{dicData.value}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
        <div class="bottom-tip  loading-hook" style="display:none;">
          <div style="display:flex;justify-content: center;">
              <div class="loading" >
                <span class="icon-loading"></span>
              </div>
              <span class="loading-text">上拉加载更多</span>
          </div>
        </div>
        <div class="no-moredata" v-show="!HasMore && ItemDatas.length>0">没有更多数据了</div>
      </div>
    </div>
    <!-- </scroller> -->
    <div class="bar" v-if="IsMultiple" @click="ok()">
      <div class="button-bar">
        <button class="button button-clear dp-font32">确定</button>
      </div>
    </div>
     <filterpage v-show="showFilter"  v-cloak :page-id="pageId" :is-show="showFilter" :menu-code="MenuCode" :scopes = "scopes" :query-items="QueryItems" :effect-only="true"></filterpage>
    </layout>
  </div>
</template>

<script>
import { H3SearchBar } from "h3-mobile-vue";
import BScroll from 'better-scroll';
import { getAppMenuData, getAppMenuDataByParams } from '../../service/get-data';
import { GetListScopeType, isEmptyObject, getFirstAndLastMonthDay } from '../../config/common';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import filterpage from '../../components/filters/index.vue';
/* eslint-disable no-underscore-dangle */

export default {
  name: 'filterquery',
  components: {
    H3SearchBar,
    filterpage,
  },
  data() {
    return {
      isSearching: false,
      isSearchingOnBlur: false,
      isAutoFixed: false,
      CanSelect: false, // 是否可以选中
      IsQuery: true,
      IsInGridView: false,
      IsMultiple: false,
      RowId: null,
      DataField: '',
      SheetData: '',
      BOSchemaCode: '',
      CheckedItems: [],
      AppCode: '',
      DisplayName: '',
      AclTypes: [],
      CurrentScopeType: GetListScopeType.GlobalAll,
      ItemDatas: [], // 初始化数据总列表
      TotalCount: 0, // 列表数据总条数，公用（与查询公用）
      PageIndex: 0, // 公用
      CustomActions: [], // 自定义按钮
      HasMore: false, // 公用
      HasNew: false, // 是否可以新增
      HasImport: false, // 是否可以导入
      ListMode: true, // 列表模式还是日历模式
      // 日历模式参数
      CurDate: new Date(),
      Start: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`,
      End: getFirstAndLastMonthDay(new Date().getFullYear(), new Date().getMonth() + 1),
      IsSearching: false, // 是否正在查询
      // 过滤
      QueryDefaultValues: null,
      QueryParams: {}, // 过滤参数
      SearchKey: '',
      FilterParamsJsonString: '',
      // 排序
      SortItems: [],
      // Modal
      ModalType: {
        Query: 0,
        Sort: 1,
      },
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
      // HideSheet: null,
      IsLoading: false,
      FirstLoad: true,
      NotLoadData: true,
      DefaultDesc: true,
      DefaultSortName: '',
      Listbool: false,
      pageId: H3PluginDeveloper.IGuid(),
      sourcePageId: '',
      ShowImage: false,
      DefaultIconUrl: '../../assets/img/product_default.png',
      ObjectId: '',
      multiSelectedItems: [],
      loadingTitle: '加载中...',
      isFilter: false,
      MenuCode: '',
      value: '', // 搜索框绑定的value
      filterBtnShowBol: true,
      searchWrapShowBol: false,
      searchData: [],
      ID: '',
      searchPicBol: true,
      remarkedItems: [],
      filterMark: '关联筛选',
      scopes: [],
      queryScroll: null,
      wrapper: null,
      listContent: null,
      topTip: null,
      bottomTip: null,
      showFilter: false,
      isSingleQuery: true,
      QueryItems: [],
      isRefreshing: false,
      isLoadingMore: false,
    };
  },
  created() {
    H3PluginDeveloper.IShowPreLoader(this.loadingTitle);
    this.AppCode = this.$route.params.appCode;
    this.MenuCode = this.$route.params.boschemacode;
    this.BOSchemaCode = this.$route.params.boschemacode;
    this.DataField = this.$route.params.datafield;
    this.RowId = this.$route.params.rowid;
    this.IsMultiple = this.$route.params.ismultiple;
    this.IsQuery = this.$route.params.isQuery;
    this.isSingleQuery = this.$route.params.isSingleQuery;
    this.IsInGridView = this.DataField ? this.DataField.indexOf('.') > 0 : false;
    this.ObjectId = this.$route.params.ObjectId;
    this.sourcePageId = this.$route.params.pageId;
    this.SheetData = this.$route.params.sheetdata || '';
    if (this.$route.params.value) {
      this.remarkedItems = this.$route.params.value;
      this.multiSelectedItems = JSON.parse(JSON.stringify(this.remarkedItems));
    }
    this.getMenuList(
      this.BOSchemaCode,
      this.PageIndex,
      this.CurrentScopeType,
      this.Start,
      this.End,
      this.NotLoadData,
      null,
      null,
    );

    // 取消单复选框后更新状态
    this.$root.eventHub.$on('cansel-checkBox', () => {
      this.checkBoxShowed = false;
    });
    // 确认单复选框后更新值
    this.$root.eventHub.$on('cansel-checkBox', () => {
      this.checkBoxShowed = false;
    });
    // 单选/复选弹出状态
    this.$root.eventHub.$on('show-checkBox', () => {
      this.checkBoxShowed = true;
    });
    // 确认筛选
    this.$root.eventHub.$on(`executeFilter-${this.pageId}`, (params) => {
      this.showFilter = false;
      if (params.scopeType !== undefined) {
        this.CurrentScopeType = params.scopeType;
      }
      this.QueryParams.searchParamsJson = params.searchParamsJson;
      // this.QueryParams=params;
      this.formatQueryParams();
      this.doRefresh();
    });
    // 取消筛选
    this.$root.eventHub.$on('cancel-filter', (pageId) => {
      if (this.pageId === pageId) {
        this.showFilter = false;
      }
    });
  },
  mounted() {
    $('.weui-icon-clear').addClass('icon-reset');
    $('.weui-icon-search').addClass('icon-search2');
  },
  activated() {
    if (!this.$route.params.boschemacode) return;
    if (this.BOSchemaCode !== this.$route.params.boschemacode) {
      this.BOSchemaCode = this.$route.params.boschemacode;
      this.DataField = this.$route.params.datafield;
      this.RowId = this.$route.params.rowid;
      this.IsMultiple = this.$route.params.IsMultiple;
      this.IsQuery = this.$route.params.isQuery;
      this.isSingleQuery = this.$route.params.isSingleQuery;
      this.IsInGridView = this.DataField ? this.DataField.indexOf('.') > 0 : false;
      this.SheetData = this.$route.params.sheetdata || '';
      this.getMenuList(
        this.BOSchemaCode,
        this.PageIndex,
        this.CurrentScopeType,
        this.Start,
        this.End,
        this.NotLoadData,
        null,
        null,
      );
    }
  },
  methods: {
    goBack() {
      if (!this.showFilter) {
        if (!this.IsQuery) {
          this.$router.go(-1);
        } else {
          this.$router.goBack();
          this.$destroy();
        }
      } else {
        this.showFilter = false;
      }
    },
    // 选择列表某项并打开表单页面
    clickItem(item) {
      const self = this;
      if (this.IsMultiple && (this.IsInGridView || !this.isSingleQuery)) {
        this.changeSelectState(item);
      } else {
        // 关联查询控件赋值
        this.$root.eventHub.$emit(`QUERY_ASSIGN_VALUE${this.sourcePageId}`, {
          rowId: self.RowId,
          datafield: self.DataField,
          item,
          ObjectId: self.ObjectId,
        });
        this.$store.state.excludeComp = ['filterquery'];
        this.goBack();
        // this.$destroy();
      }
    },
    // 确认选项并返回表单页面
    ok() {
      const self = this;
      // 关联查询控件赋值
      this.$root.eventHub.$emit(`QUERY_ASSIGN_VALUE${this.sourcePageId}`, {
        rowId: self.RowId,
        datafield: self.DataField,
        item: self.multiSelectedItems,
        ObjectId: self.ObjectId,
      });
      this.$store.state.excludeComp = ['filterquery'];
      this.$router.go(-1);
    },
    // 切换选中状态
    changeSelectState(items) {
      const item = items;
      item.Selected = !item.Selected;
      if (item.Selected) {
        this.multiSelectedItems.push(item);
      } else {
        this.multiSelectedItems.some((obj, idx) => {
          if ((obj.ObjectId || obj) === item.ObjectId) {
            this.multiSelectedItems.splice(idx, 1);
            return false;
          }
          return false;
        });
      }
      this.$forceUpdate();
    },
    // 数据详情最多只显示6条
    showMobileDicData(MobileDicData, item, idx) {
      const keysArr = Object.keys(MobileDicData);
      const index = keysArr.indexOf(idx);
      if (index > 5) {
        return false;
      }
      return true;
    },
    // 格式化过滤参数
    formatQueryParams() {
      if (!this.QueryParams) {
        this.QueryParams = {};
      }
      if (this.SearchKey) {
        if (!this.QueryParams.searchParamsJson) {
          const tmp = {};
          tmp.Name = [this.SearchKey];
          this.QueryParams.searchParamsJson = tmp;
          // this.QueryParams.searchParamsJson=JSON.stringify(tmp);
        } else {
          const tmp = this.QueryParams.searchParamsJson;
          tmp.Name = [this.SearchKey];
          this.QueryParams.searchParamsJson = tmp;
        }
      } else if (this.QueryParams.searchParamsJson) {
        const tmp = this.QueryParams.searchParamsJson;
        delete tmp.Name;
        this.QueryParams.searchParamsJson = tmp;
      } else {
        this.QueryParams.searchParamsJson = {};
      }
      this.QueryParams.searchParamsJson.Status = ['1']; // 有且仅获取有效数据
      this.QueryParams.sort = this.Sort;
      this.QueryParams.order = this.Desc ? 'desc' : 'asc';
      this.QueryParams.SchemaCode = this.BOSchemaCode;
      this.QueryParams.scopeType = this.CurrentScopeType;
    },
    // 根据关键字过滤
    searchByKeyword(keyword) {
      const self = this;
      self.SearchKey = keyword;
      setTimeout(function b() {
        if (keyword === self.SearchKey) {
          self.PageIndex = 0;
          if (keyword === '') {
            self.IsSearching = false;
            self.formatQueryParams();
            self.refresh();
          } else {
            self.IsSearching = true;
            self.QueryParams.ID = this.MenuCode;
            self.formatQueryParams();
            self.doRefresh();
            self.SearchKey = null;
          }
        }
      }, 500);
    },
    // 取消关键字过滤
    cancelSearch() {
      this.filterBtnShowBol = true;
      this.searchWrapShowBol = false;
      this.value = '';
      this.SearchKey = '';
      this.IsSearching = false;
      this.HasMore = false;
      this.PageIndex = 0;
      this.ItemDatas = [];
      this.formatQueryParams();
      this.doRefresh();
      this.searchPicBol = true;
    },
    // 搜索框聚焦
    searchFocus() {
      this.filterBtnShowBol = false;
      this.searchPicBol = false;
    },
    // 排序
    openSortModal() {},
    // 显示筛选组件
    openFilterModal() {
      this.showFilter = true;
    },
    // 打开表单页面
    openForm() {
      this.$router.push({
        name: 'queryFormPage',
        params: {
          schemaCode: this.BOSchemaCode,
        },
      });
    },

    // 通过过滤参数获取列表数据
    async getMenuListByFilters(params) {
      let data = await getAppMenuDataByParams(params);
      if (!data.Successful) {
        return;
      }
      data = data.ReturnData.Data;
      this.displayFilterItems(data);
    },
    // 过滤数据列表展示
    displayFilterItems(data) {
      if (data.rows.ReturnData) {
        for (const item of data.rows.ReturnData) {
          const mobileDicData = item.__MobileDicData;
          item.MobileDicData = [];
          for (const key in mobileDicData) {
            if (Object.prototype.hasOwnProperty.call(mobileDicData, key)) {
              const dicData = mobileDicData[key];
              for (const keykey in dicData) {
                if (Object.prototype.hasOwnProperty.call(dicData, keykey)) {
                  item.MobileDicData.push({
                    key: keykey,
                    value: dicData[keykey],
                  });
                }
              }
            }
          }
          item.Selcted = false;
          if (
            item.WorkflowInstanceId &&
            data.rows.WorkflowState &&
            data.rows.WorkflowState[item.WorkflowInstanceId] &&
            data.rows.WorkflowState[item.WorkflowInstanceId].length > 0
          ) {
            // 是否本人
            let dingUsers = '';
            let participant = '';
            item.ShowDing = this.$store.state.UserInfo.userId === this.CreatedBy;
            if (data.rows.WorkflowState[item.WorkflowInstanceId].length === 1) {
              if (this.$store.state.UserInfo.userId ===
              data.rows.WorkflowState[item.WorkflowInstanceId][0].UserId) {
                item.ShowDing = false;
                participant = '我';
              } else {
                participant = data.rows.WorkflowState[item.WorkflowInstanceId][0].UserName;
                dingUsers = data.rows.WorkflowState[item.WorkflowInstanceId][0].DingId.substr(
                  0,
                  data.rows.WorkflowState[item.WorkflowInstanceId][0].DingId.indexOf('.'),
                );
              }
              item.DingUsers = dingUsers;
              item.Participant = participant;
            } else {
              let userCount = 0;
              for (const workitem of data.rows.WorkflowState[item.WorkflowInstanceId]) {
                userCount += 1;
                if (userCount <= 2) {
                  if (this.$store.state.UserInfo.userId === workitem.UserId) {
                    participant += '我、';
                    item.ShowDing = false;
                  } else {
                    participant += `${workitem.UserName}、`;
                  }
                }
                if (workitem.DingId) {
                  dingUsers += `${workitem.DingId.substr(0, workitem.DingId.indexOf('.'))};`;
                }
              }
              item.DingUsers = dingUsers;
              if (data.rows.WorkflowState[item.WorkflowInstanceId].length > 2) {
                item.Participant = `${participant.substr(0, participant.length - 1)}等`;
              } else {
                item.Participant = participant.substr(0, participant.length - 1);
              }
            }
          } else {
            item.ShowDing = false;
          }
        }
        this.ItemDatas = data.rows.ReturnData;
      }
    },
    // 展示列表数据
    displayItems(data) {
      this.AclTypes = data.ScopeTypes;
      if (data.rows) {
        this.ShowImage = data.rows.IconProperty || false;
        if (this.IsQuery) {
          this.HasNew = false;
          // ERROR DD 接口
        } else if (data.rows.Actions && data.rows.Actions.Create && !data.IsChild) {
          // 判断是否有新增
          this.HasNew = true;
        } else {
          this.HasNew = false;
        }
        this.TotalCount = data.rows.DataCount;
        this.DisplayName = data.rows.DisplayName;
        // 判断是否存在选中框
        if (this.IsInGridView) {
          // 子表中字段多选类型有选中值时不显示选择框
          if (this.IsMultiple) {
            this.CanSelect = true;
            if (this.$store.state.querySelectedItems.length > 0) {
              this.CanSelect = false;
            }
          }
        } else if (this.IsMultiple) {
          this.CanSelect = true;
        }
        // ERROR mounted中设置标题
        if (data.rows.ReturnData && data.rows.ReturnData.length > 0) {
          for (const row of data.rows.ReturnData) {
            if (row[`${this.BOSchemaCode}.Name`]) {
              const newName = (row[`${this.BOSchemaCode}.Name`] || '').trim();
              row.Name = newName === '' ? '--' : newName;
            }
            const mobileDicData = row.__MobileDicData;
            row.MobileDicData = [];
            for (const key in mobileDicData) {
              if (Object.prototype.hasOwnProperty.call(mobileDicData, key)) {
                const item = mobileDicData[key];
                for (const keykey in item) {
                  if (Object.prototype.hasOwnProperty.call(item, keykey)) {
                    row.MobileDicData.push({ key: keykey, value: item[keykey] });
                  }
                }
              }
            }
            if (this.CanSelect) {
              if (this.$store.state.querySelectedItems.length > 0) {
                // 如果关联的是子表
                let sels = [];
                if (row[`${this.BOSchemaCode}.ObjectId`]) {
                  sels = this.$store.state.querySelectedItems.find(val => val === row[`${this.BOSchemaCode}.ObjectId`]);
                  row.Selected = sels.length > 0;
                } else {
                  sels = this.$store.state.querySelectedItems.find(val => val === row[`${this.BOSchemaCode}.ObjectId`]);
                  row.Selected = sels.length > 0;
                }
              } else {
                row.Selected = false;
              }
            }
          }
          this.ItemDatas = this.ItemDatas.concat(data.rows.ReturnData);
          // 把已选择的标记上
          this.multiSelectedItems.some((obj) => {
            this.ItemDatas.some((temps) => {
              const temp = temps;
              if ((obj.ObjectId || obj) === temp.ObjectId) {
                temp.Selected = !temp.Selected;
              }
              return null;
            });
            return null;
          });
          if (this.TotalCount > this.ItemDatas.length) {
            this.HasMore = true;
            this.PageIndex += 1;
          } else {
            this.HasMore = false;
          }
        }
      }
      if (this.isRefreshing) {
        this.isRefreshing = false;

        $('.top-tip').fadeOut(300);
        $('.brash-more')
          .show()
          .text(`更新了${data.rows.ReturnData.length}条数据`);
        $('.brash-more').slideUp(1300);
      }
      if (this.isLoadingMore) {
        this.isLoadingMore = false;
        $(this.bottomTip).fadeOut(300);
      }
      // 初始化scroll
      this.$nextTick(() => {
        if (!this.queryScroll) {
          this.initScroll();
        } else {
          this.queryScroll.refresh();
        }
      });
    },
    bScrollClick() {
      if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
      if (/Chrome/i.test(navigator.userAgent)) return /Android/i.test(navigator.userAgent);
      if (/Silk/i.test(navigator.userAgent)) return false;
      if (/Android/i.test(navigator.userAgent)) {
        const s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
        return parseFloat(s[0] + s[3]) >= 44;
      }
      return null;
    },

    async getMenuList(code, pageIndex, aclType, from, to, NotLoadData, sort, desc) {
      let data = await getAppMenuData(
        2,
        code,
        pageIndex,
        aclType,
        from,
        to,
        1,
        NotLoadData,
        1,
        sort,
        desc,
        '',
        code,
        this.DataField,
        this.SheetData,
      );
      if (data) {
        H3PluginDeveloper.IHidePreLoader();
      }
      if (!data.Successful) {
        this.IsLoading = false;
      } else {
        data = data.ReturnData.Data;
        this.scopes = [].concat(data.ScopeTypes);
        // setTitle(data.DisplayName);
        this.DisplayName = data.DisplayName;
        this.ID = data.rows.SchemaCode;
        this.QueryItems = data.QueryItems;
        if (data.rows.ChildSchemaCode && data.rows.ChildSchemaCode === this.dataField) {
          this.IsInGridView = true;
        }
        this.displayItems(data);
      }
    },
    initScroll() {
      const that = this;
      this.wrapper = document.querySelector('.query-wrapper');
      this.topTip = document.querySelector('.refresh-hook');
      this.bottomTip = document.querySelector('.loading-hook');
      // 高度修正
      const height = $(this.wrapper).height();
      document.querySelector('.query-list-content').style.minHeight = `${height + 10}px`;
      if (this.IsMultiple) {
        document.querySelector('.query-list-content').style.paddingBottom = '100px';
      } else {
        document.querySelector('.query-list-content').style.paddingBottom = '80px';
      }
      this.queryScroll = new BScroll(this.wrapper, {
        probeType: 3,
        click: true,
        scrollbar: true,
      });
      // 滑动中
      this.queryScroll.on('scroll', (position) => {
        if (!$('.brash-more').is(':hidden')) {
          return;
        }
        if (that.isRefreshing) {
          return;
        }
        if (position.y >= 10 && position.y < 30) {
          $(that.topTip).fadeIn(300);
          $(that.topTip)
            .find('.brash-icon')
            .css({ transform: 'rotate(0)' });
        } else if (position.y >= 30) {
          $(that.topTip)
            .find('.refresh-text')
            .html('松开立即刷新');
          $(that.topTip)
            .find('.brash-icon')
            .css({ transform: 'rotate(180deg)' });
        }
      });
      this.queryScroll.on('touchEnd', function a(position) {
        if (position.y > 30) {
          setTimeout(() => {
            /*
              * 这里发送ajax刷新数据
              * 刷新后,后台只返回第1页的数据,无论用户是否已经上拉加载了更多
              */
            that.isRefreshing = true;
            $(that.topTip)
              .find('.refresh-text')
              .html('刷新中...');
            that.doRefresh();
          }, 300);
        } else if (position.y < this.maxScrollY - 30) {
          if (!that.HasMore) {
            return;
          }
          $(that.bottomTip).fadeIn(300);

          $(that.bottomTip)
            .find('.loading-text')
            .html('加载中...');
          setTimeout(() => {
            $(that.bottomTip)
              .find('.loading-text')
              .html('查看更多'); // 恢复文本值
            // 向列表添加数据
            that.isLoadingMore = true;
            that.loadMoreData();
          }, 300);
        }
      });
      this.queryScroll.on('scrollEnd', (position) => {
        if (position.y < 30 && position.y >= 0) {
          $(that.topTip).hide();
          that.queryScroll.scrollTo(0, 0, 300);
          $(that.topTip)
            .find('.refresh-text')
            .html('下拉可以刷新');
        }
      });
    },
    async getMenuListByParams(params) {
      const data = await getAppMenuDataByParams(params);
      if (!data.Successful) {
        return;
      }
      this.searchWrapShowBol = true;
      this.ID = data.ReturnData.Data.rows.SchemaCode;
      this.searchData = data.ReturnData.Data.rows.ReturnData;
      this.displayItems(data.ReturnData.Data);
    },
    doRefresh() {
      this.PageIndex = 0;
      this.ItemDatas = [];
      const params = Object.assign({}, this.QueryParams);
      if (isEmptyObject(params.searchParamsJson)) {
        this.getMenuList(
          this.BOSchemaCode,
          this.PageIndex,
          this.CurrentScopeType,
          this.Start,
          this.End,
          this.NotLoadData,
          this.SelectedSortItem.Name,
          this.Desc,
        );
      } else {
        if (this.DefaultSort) {
          if (params && params.sort) params.sort = this.DefaultSortName;
          if (params && params.order) params.order = this.DefaultDesc ? 'desc' : 'asc';
        }
        params.searchParamsJson = JSON.stringify(params.searchParamsJson);
        params.offset = 0;
        params.limit = 10;
        params.ActionName = 'GetAppDatas';
        this.getMenuListByParams(params);
      }
    },
    loadMoreData() {
      // let that = this;
      this.HasMore = false;

      if (isEmptyObject(this.QueryParams.searchParamsJson)) {
        this.getMenuList(
          this.MenuCode,
          this.PageIndex,
          this.CurrentScopeType,
          this.Start,
          this.End,
          this.NotLoadData,
          this.SelectedSortItem.Name,
          this.Desc,
        );
      } else {
        const params = Object.assign({}, this.QueryParams);
        params.offset = this.PageIndex * 10;
        params.limit = 10;

        params.searchParamsJson = JSON.stringify(params.searchParamsJson);
        if (this.DefaultSort) {
          if (params && params.sort) params.sort = this.DefaultSortName;
          if (params && params.order) params.order = this.DefaultDesc ? 'desc' : 'asc';
        }
        params.ActionName = 'GetAppDatas';
        this.getMenuListByParams(params);
      }
    },
    searchByKeyAsync() {
      if (this.searchKey) {
        this.showFilter = false;
        const self = this;
        this.$nextTick(() => {
          self.searchByKey();
        });
      }
    },
    searchByKey() {
      if (!this.searchKey) {
        this.isSearching = false;
      } else {
        this.isSearching = true;
      }
    },
    onBlur() {
      // TODO
      // this.total = -1;
      this.isSearchingOnBlur = true;
      if (!this.searchKey) {
        this.isSearching = false;
      }
    },
    onFocus() {
      // TODO
      this.isSearching = true;
      this.isSearchingOnBlur = false;
      this.searchKey = '';
      this.filterItems = {};
      this.searchPicBol = false;
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.searchByKeyword(val);
      } else {
        this.SearchKey = ''
        this.formatQueryParams();
        this.doRefresh();
      }
    },
  },
};
</script>

<style lang="less">
@baseFontSize: 75;
.px2rem(@name, @px) {
  @{name}: @px / @baseFontSize * 1rem;
}

#query-form {
  height: 100%;
  .query-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    top:0;
    background-color: white;
    .px2rem(margin-top,92);
    &.isDing {
      margin-top: 0;
    }
    .top-tip,
    .bottom-tip {
      text-align: center;
    }
  }
  .h3-search-focus {
    width: 100% !important;
  }
  .search-bar {
    position: relative;
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
    background-color: white;
    box-shadow:0px 1px 0px 0px rgba(228,228,228,1);
    .searchBarWarpper {
      .px2rem(width, 596);
      form {
        padding: 0;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      color: #666;
      .px2rem(right, 32);
      .px2rem(height, 88);
      .px2rem(line-height, 88);
      .px2rem(font-size, 32);
      &:before {
        content: '';
      }
    }
    .filter-active {
      color: #1890FF;
    }
  }
  .normal-top {
    .px2rem(margin-top, 98);
  }
  .search-result-num {
    color: #999999;
    .px2rem(margin-left, 24);
    .px2rem(padding-top, 28);
    .px2rem(padding-bottom, 28);
    border-bottom: 1px solid #ebebeb;
  }
  .no-result-wrap {
    height: 100%;
    display: flex;
    justify-content: center;
    .no-result-content {
      .px2rem(margin-top, 160);
      text-align: center;
      .icon {
        .px2rem(font-size, 200);
        color: #999999;
      }
      .icon-wujieguo {
        border: 1px solid #b7b7b7;
        border-radius: 50%;
      }
      p {
        .px2rem(margin-top, 45);
        color: #999999;
      }
    }
  }
  .query-form-search {
    .weui-search-bar {
      .px2rem(padding-top, 24);
      .px2rem(padding-bottom, 24);
      .px2rem(padding-left, 50);
      .px2rem(padding-right, 130);
      background-color: white;
      font-size: inherit;
      &:before {
        height: 0;
        border: none;
      }
      &:after {
        height: 0;
        border: none;
      }
      .search-pic {
        color: #999999;
        position: absolute;
        .px2rem(top, 44);
        z-index: 9;
      }
      .search-pic-default {
        .px2rem(left, 274);
      }
      .search-pic-active {
        .px2rem(left, 76);
      }
    }
    .weui-search-bar__form {
      font-size: inherit;
    }
    .weui-search-bar__form:after {
      border: none;
    }
    .weui-search-bar__label {
      background-color: #f2f3f5;
      .px2rem(line-height, 48);
      bottom: inherit;
      span {
        line-height: 100%;
      }
    }
    .weui-search-bar__box {
      display: flex;
      align-items: center;
      .px2rem(height, 66);
      background-color: #f2f3f5;
    }
    .weui-search-bar__cancel-btn {
      color: #108ee9;
      font-size: inherit;
    }
    .weui-icon-search {
      color: #999999; // display: none;
    }
    .weui-search-bar__cancel-btn {
      position: absolute;
      .px2rem(right, 50);
    }
    .filter-btn {
      position: absolute;
      .px2rem(right, 50);
      .px2rem(line-height, 114);
      top: 0;
      color: #108ee9;
    }
  }
  ._v-container {
    .px2rem(margin-top, -8);
    top: 1.7rem;
    background-color: white;
  }

  button {
    background-color: white;
    border: none;
    color: #108ee9;
  }

  .common-box {
    // border-top: 1px solid #e4e4e4;
    background-color: #fff;
    position: relative;
    .px2rem(min-height, 44);
  }

  .scroll-content-default {
    .px2rem(margin-top, 86);
  }
  .scroll-content-ding {
    .px2rem(margin-top, 46);
  }

  .list-item {
    // border-bottom: 1px solid #ebebeb;
    background-color: #fff;
    display: block;
    &:active {
      background-color: #f2f3f5;
    }
    .item-container {
      .px2rem(padding-top, 28);
      .px2rem(padding-bottom, 28);
      display: flex;
      position: relative;
      width: 100%;
      box-sizing: border-box;
      .item-select {
        .px2rem(padding-right,35);
      }
      .item-content {
        display: flex;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .px2rem(padding-left,35);
        .px2rem(padding-right,76);
        .item-product {
          position: relative;
          overflow: hidden;
        }
        .item-product-hasimage {
          .px2rem(min-height, 50);
        }
        .item-product-left {
          position: absolute;
          .px2rem(left, 10);
        }
        .item-product-left img {
          .px2rem(width, 50);
          .px2rem(height, 50);
        }
      }
    }
  }

  .bar {
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0;
    .px2rem(height, 98);
    background-color: white;
    border-top: 1px solid #d9d9d9;
  }

  .item-product-body {
    .px2rem(margin-left, 78);
  }

  .no-pic {
    margin-left: 0;
  }

  .value-change {
    color: #000000 !important;
  }

  .profile {
    .px2rem(width, 37);
    .px2rem(height, 37);
    .px2rem(line-height, 37);
    border-radius: 50%;
    text-align: center;
    color: #fff;
  }

  .profile img {
    .px2rem(width, 37);
    .px2rem(height, 37);
    border-radius: 50%;
  }

  .item-title-top {
    color: #000000;
    .px2rem(line-height, 42);
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .item-summary {
    .px2rem(margin-top, 10);
    background: none;
    color: #999999;
    .item-wrapper {
      span {
        font-size: inherit;
        .px2rem(line-height, 38);
      }
    }
    .item-wrapper {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .item-h {
    .px2rem(min-height, 20);
    width: 100%;
    .px2rem(line-height, 25);
    .px2rem(padding-right, 70);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0;
  }

  .item-select-a {
    .px2rem(flex-basis, 40);
    display: flex;
    justify-content: center;
    align-items: center;
    .check-circle {
      color: #108ee9;
    }
    .circle-o {
      margin-left: 0;
      color: #dedfde;
    }
  }

  div.item-tool {
    display: flex;
    .px2rem(flex-basis, 40);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    div {
      .px2rem(padding-top, 5);
      .px2rem(padding-bottom, 5);
      span {
        color: #108ee9;
      }
    }
  }

  .l-item-box {
    display: inline-block;
    line-height: 1;
    .px2rem(padding-top, 2);
    .px2rem(padding-bottom, 2);
    .px2rem(padding-left, 4);
    .px2rem(padding-right, 4);
    text-align: center;
    color: #69a8e8;
    border: 1px solid #69a8e8;
    .px2rem(border-radius, 2);
    .px2rem(margin-left, 9);
  }

  div.item-handler {
    color: #6abd5f;
    .px2rem(margin-top, 3);
  }

  a.list-ding {
    position: absolute;
    .px2rem(right, 15);
    -webkit-transform: translateY(-100%);
    transform: translateY(-100%);
  }

  .has-bottom {
    .px2rem(margin-bottom, 44);
  }

  .none-bottom {
    margin-bottom: 0;
  }
}

.no-moredata {
  position: absolute;
  left: 0;
  .px2rem(bottom,80);
  width: 100%;
  text-align: center;
  color: #999;
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
</style>
