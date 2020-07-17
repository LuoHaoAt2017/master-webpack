<template>
  <layout
    :title="DisplayName"
    :leftOptions="{preventGoBack: true}"
    :showHeader="showHeader"
    @on-click-back="goBack()"
  >
    <div id="query-form" class="query-form">
      <div ref="header" class="search-bar">
        <div class="searchBarWarpper" :class="{'h3-search-focus': isSearching, 'full-width': isExternal}">
          <H3SearchBar
            ref="searchBar"
            v-model="searchKey"
            prefixCls="h3-search-opposite"
            placeholder="请输入关键字"
            :onCancel="cancelSearch"
            :showCancelButton="false"
            :onFocus="onFocus"
            :onBlur="onBlur"
          />
        </div>
        <div
          v-if="!isExternal"
          v-show="!isSearching"
          class="filter-query"
          :class="{'filter-active': filterBtnShowBol}"
          @click="openFilterModal"
        >
          筛选
        </div>
      </div>
      <div class="view-scroll">
        <h3-scroll
          ref="scroll"
          class="scroll-wrapper"
          :refresh="refresh"
          :loadMore="loadMore"
          :pageSize="limit"
        >
          <div>
            <div v-show="searchKey && searchWrapShowBol" class="search-result-num dp-font30">
              搜索结果：共{{ searchTotal }}条
            </div>
            <div v-show="searchKey && searchWrapShowBol && searchData.length < 1" class="no-result-wrap">
              <div class="no-result-content">
                <span class="icon icon-wujieguo h3yun_All search-o"></span>
                <p class="dp-font24">
                  未找到"{{ searchKey }}"相关结果
                </p>
              </div>
            </div>
            <a
              :id="Item.ObjectId"
              v-for="(Item,index) in ItemDatas"
              :key="index"
              href="javascript:;"
              class="common-box selectitem list-item"
              :data-item="Item"
              @click.stop.prevent="clickItem(Item)"
            >
              <div class="item-container">
                <div class="item-content" style="flex-grow:2;">
                  <div class="item-select item-select-a">
                    <i class="dp-font34" :class="['h3yun_All', Item.Selected ? 'check-circle' : 'circle-o']"></i>
                  </div>
                  <div class="item-product" :class="{'item-product-hasimage': ShowImage}">
                    <div v-if="ShowImage" class="item-product-left">
                      <img v-if="!Item.__IconUrl" src="../../assets/img/product_default.png" @click.stop.prevent="previewPic(index)" />
                      <img
                        v-cloak
                        v-if="Item.__IconUrl"
                        :src="Item.__IconUrl"
                        @click.stop.prevent="previewPic(index)"
                      />
                    </div>
                    <div class="item-product-body" :class="{'no-pic': !ShowImage}">
                      <span v-if="!Item.Name || !Item.Name.IsCustom" class="item-title-top dp-font30">
                        {{ Item.Name.trim() ? (Item.Name.trim() ? Item.Name.trim() : '--') : '--' }}
                      </span>
                      <span v-else="" class="item-title-top dp-font30">
                        {{ Item.Name.Value }}
                      </span>
                      <span v-if="(Item.Status == 0 || Item.Status == '') && IsWorkflow" class="activity-name activity l-item-box">审批中</span>
                      <span v-if="(Item.Status == 0 || Item.Status == '') && !IsWorkflow" class="activity-name activity l-item-box">未提交</span>
                      <span v-if="(Item.Status == 3) && IsWorkflow" class="activity-name activity l-item-box">作废</span>
                      <div v-if="!isExternal" class="item-summary">
                        <div
                          v-for="(dicData,index) in Item.MobileDicData"
                          v-if="index < 6"
                          :key="dicData.key"
                          class="item-wrapper"
                        >
                          <span class="title">{{ dicData.key }} :</span>
                          <span class="value value-change">{{ dicData.value }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
            <div v-if="ItemDatas.length == 0 && !(searchKey && searchWrapShowBol) && ready" class="empty-sheet-container">
              <img :src="emptyImgUrl" />
              <div class="message">
                暂无数据
              </div>
            </div>
          </div>
        </h3-scroll>
      </div>
      <div v-if="IsMultiple" class="bar" @click="ok()">
        <div class="button-bar">
          <button class="button button-clear dp-font32">
            确定 <span v-show="multiSelectedItems.length">({{ multiSelectedItems.length }})</span>
          </button>
        </div>
      </div>
      <!--迭代26新功能 关联表单新增-->
      <div v-if="canCreate && !isSecondaryForm && !notFromList" class="add" @click="newQueryForm">
        <span class="h3yun_All close"></span>
      </div>
      <filterpage
        v-show="showFilter"
        v-cloak=""
        class="mescroll-touch"
        :pageId="pageId"
        :isShow="showFilter"
        :menuCode="MenuCode"
        :scopes="scopes"
        :queryItems="QueryItems"
        :effectOnly="true"
      />
      <div :class="{'h3-mask': maskShow}"></div>
    </div>
  </layout>
</template>

<script lang="ts">

import {
  Component, Watch, Vue, Mixins,
} from 'vue-property-decorator';
import { H3Scroll, H3SearchBar } from 'h3-mobile-vue';
import { State, namespace } from 'vuex-class';
import { FormMutationType } from '@/store/modules/form/types';
import { imgBaseUrl } from '@/config/env';
import {
  getAppMenuData, getAppMenuDataByParams, getFormatBizObject, LoadSchemaAcls,
} from '@/service/get-data';
// import { formLogicService } from '@/lib/form-logic';
import formLogicService from 'h3yun-formlogic/src/instance/service';
import { GetListScopeType, isEmptyObject, isDingtalk } from '@/config/common';
import { setTitle } from '@/config/dingtalk-interface';
import H3PluginDeveloper from '@/lib/h3-plugins-developer';
import filterpage from '@/components/filters/index.vue';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import imagepreview from 'h3-mobile-vue/src/plugins/imagepreview';
// import { debugState } from '../../lib/form-logic/utils/debug';
import debounce from 'lodash/debounce';
const imgURL = require('../../assets/img/product_default.png');
const FormModule = namespace('Form');

/* eslint-disable no-underscore-dangle */
Component.registerHooks(['beforeRouteLeave']);

@Component({
  name: 'formquery',
  components: {
    filterpage,
    H3Scroll,
    H3SearchBar,
  },
})
export default class formquery extends Vue {
  @FormModule.Mutation(FormMutationType.setSecondaryForm)
  setSecondaryForm;

  @FormModule.Mutation(FormMutationType.setPrimaryQueryParmers)
  setPrimaryQueryParmers;

  @FormModule.State('isSecondaryForm') isSecondaryForm;

  @FormModule.State('primaryBizObjectId') primaryBizObjectId;

  @FormModule.State('primaryQueryParmers') primaryQueryParmers;

  @State('IsExternalForm') IsExternalForm;

  @State('IsExternalShare') IsExternalShare;

  isSearching:boolean = false;

  isSearchingOnBlur:boolean = false;

  CanSelect:boolean = false; // 是否可以选中

  IsQuery:boolean = true;

  IsInGridView:boolean = false;

  IsMultiple:boolean = false;

  Required:boolean = false;

  RowId:string = null;

  DataField:string = '';

  SheetData:string = '';

  BOSchemaCode:string = '';

  AppCode:string = '';

  CurrentCode:string = '';

  DisplayName:string = '';

  AclTypes:any[] = [];

  CurrentScopeType:any = GetListScopeType.AllReadable;

  ItemDatas:any[] = []; // 初始化数据总列表

  TotalCount:number = 0; // 列表数据总条数，公用（与查询公用）

  PageIndex:number = 0; // 公用

  HasMore:boolean = false; // 公用

  HasNew:boolean = false; // 是否可以新增

  ListMode:boolean = true; // 列表模式还是日历模式

  Start:number = null;

  End:number = null;

  IsSearching:boolean = false; // 是否正在查询

  // 过滤
  QueryDefaultValues:any = null;

  QueryParams:any = {}; // 过滤参数

  searchKey:string = '';

  Sort:string = '';

  Desc:boolean = true;

  DefaultSort:boolean = true;

  SelectedSortItem:any = {
    CanSort: true,
    DataType: 5,
    Desc: false,
    DisplayName: '创建时间',
    Name: 'CreatedTime',
    Selected: true,
    SortDesc: false,
  };

  IsWorkflow:boolean = false;

  IsLoading:boolean = false;

  NotLoadData:boolean = true;

  DefaultDesc:boolean = true;

  DefaultSortName:string = '';

  pageId:any = H3PluginDeveloper.IGuid();

  ShowImage:boolean = false;

  ObjectId:string = '';

  multiSelectedItems:any[] = [];

  loadingTitle:string = '加载中...';

  isFilter:boolean = false;

  MenuCode:string = '';

  value:string = ''; // 搜索框绑定的value

  filterBtnShowBol:boolean = true;

  searchWrapShowBol:boolean = false;

  searchData:any[] = [];

  searchTotal:number = null;

  ID:string = '';

  searchPicBol:boolean = true;

  remarkedItems:string = '';

  scopes:any[] = [];

  wrapper:any = null;

  showFilter:boolean = false;

  isSingleQuery:boolean = true;

  QueryItems:any[] = [];

  isRefreshing:boolean = false;

  isLoadingMore:boolean = false;

  isChooseItemBol:boolean = false;

  emptyImgUrl:string = '';

  ready:boolean = true;

  isChild:boolean = false;

  limit:number = 15;

  bizObjectId:string = '';

  previewObject: any = null;

  params: any = null;

  // 是否可以新增关联表单
  canCreate: boolean = false;

  isChildSchema = false;

  // 是否是离开去新增页面
  toAddform: boolean = false;

  searchDebounce: any;

  isExternal = false;

  /*  get rightOptions() {
    return {
      text: this.HasNew ? '新增' : '',
      callback:  this.openForm
    }
  } */

  get maskShow () {
    if (this.isSearchingOnBlur) {
      return false;
    }
    if (this.isSearching && !this.searchKey) {
      return true;
    }
    return false;
  }

  get notFromList () {
    const messageType = window.GlobalConfig.messageType;
    return this.IsExternalForm || this.IsExternalShare || !!messageType;
  }

  get showHeader () {
    if (this.isExternal) {
      return !isDingtalk;
    }
    return !this.$store.state.corpId;
  }

  @Watch('searchKey')
  searchKeyChanged (val) {
    this.searchByKeyword(val);
  }

  created () {
    console.log('created', this.$router);
    let params = this.$route.params;
    if (params.bizObjectId) {
      window.sessionStorage.setItem('bizObjectId', params.bizObjectId);
    }
    if (Object.keys(this.$route.params).length < 1) {
      params = this.primaryQueryParmers;
    }
    if (!params.bizObjectId) {
      const sessionBizObjectId = window.sessionStorage.getItem('bizObjectId');
      const queryParams = sessionStorage.getItem(`${sessionBizObjectId}formQueryParams`);
      try {
        this.params = JSON.parse(queryParams);
      } catch (e) {

      }
    } else {
      sessionStorage.setItem(`${params.bizObjectId}formQueryParams`, JSON.stringify(params));
      this.params = params;
    }

    H3PluginDeveloper.IShowPreLoader(this.loadingTitle);
    this.AppCode = this.params.appCode;
    this.bizObjectId = this.params.bizObjectId;
    this.MenuCode = this.params.boschemacode;
    this.BOSchemaCode = this.params.boschemacode;
    this.CurrentCode = this.params.curcode ||
    this.$store.state.Form.ViewModel[this.bizObjectId].$responseContext.SchemaCode;
    this.DataField = this.params.datafield;
    this.RowId = this.params.rowid;
    this.IsMultiple = this.params.ismultiple === 'true';
    this.Required = this.params.Required === 'true';
    this.IsQuery = this.params.isQuery === 'true';
    this.isSingleQuery = this.params.isSingleQuery === 'true';
    this.IsInGridView = this.DataField ? this.DataField.indexOf('.') > 0 : false;
    this.ObjectId = this.params.ObjectId;
    this.SheetData = this.params.sheetdata || '';
    this.isExternal = this.params.isExternal === 'true';
    if (this.params.value) {
      this.remarkedItems = this.params.value;
      const items = JSON.parse(JSON.stringify(this.remarkedItems));
      if (Array.isArray(items)) {
        this.multiSelectedItems = items;
      } else {
        this.multiSelectedItems = [items];
      }
    }
    this.loadSchemaAcls();

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

    this.searchDebounce = debounce(() => {
      this.PageIndex = 0;
      if (!this.searchKey) {
        this.IsSearching = false;
        this.formatQueryParams();
        this.doRefresh();
      } else {
        this.IsSearching = true;
        this.QueryParams.ID = this.MenuCode;
        this.formatQueryParams();
        this.doRefresh();
      }
    }, 200);
  }

  mounted () {
    this.emptyImgUrl = require('../../assets/img/empty.png');
  }

  activated () {
    this.doRefresh();
    if (this.toAddform && this.$route.params.bizObjectId === this.primaryBizObjectId) {
      this.setSecondaryForm(false);
      this.toAddform = false;
    }
  }

  beforeRouteLeave (to, from, next) {
    // 强制清除缓存 注：此代码是为处理在线上环境出现异常顽固缓存，第一次进入关联表单页面后，第二次进入就不重新执行created了<根源未知>
    if (to.name !== 'filterquery' && to.name !== 'userDepartmentChoosePage') {
      this.$store.state.excludeComp = ['formquery'];
      this.$root.eventHub.$off(`executeFilter-${this.pageId}`);
      this.$root.eventHub.$off('cancel-filter');
      this.$destroy();
    }
    next();
  }

  searchByKeyAsync () {
    if (this.searchKey) {
      this.showFilter = false;
      const self = this;
      this.$nextTick(() => {
        self.searchByKey();
      });
    }
  }

  searchByKey () {
    if (!this.searchKey) {
      this.isSearching = false;
    } else {
      this.isSearching = true;
    }
    this.doRefresh();
  }

  onFocus () {
    this.isSearching = true;
    this.isSearchingOnBlur = false;
    this.searchKey = '';
    this.searchPicBol = false;
  }

  onBlur () {
    this.isSearchingOnBlur = true;
    if (!this.searchKey) {
      this.isSearching = false;
      this.doRefresh();
    }
  }

  async getMenuList (
    code, pageIndex, aclType, from, to,
    NotLoadData, sort, desc, successCallback,
  ) {
    const data = await getAppMenuData(
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
      this.CurrentCode,
      code,
      this.DataField,
      this.SheetData,
      this.limit,
      this.isExternal,
    );
    if (data) {
      H3PluginDeveloper.IHidePreLoader();
    }
    if (!data.Successful) {
      this.IsLoading = false;
      const scroll:any = this.$refs.scroll;
      if (scroll && scroll.mescroll) {
        scroll.mescroll.endErr();
      }
      H3PluginDeveloper.IHidePreLoader();
      H3PluginDeveloper.IShowError(data.ErrorMessage);
      return;
    }
    successCallback(data);
  }

  refresh (page, done, err) {
    this.isRefreshing = true;
    page.num = 1;
    page.size = 15;
    this.dealData(page, done, err);
    this.doRefresh();
  }

  loadMore (page, done, err) {
    this.isRefreshing = false;
    this.dealData(page, done, err);
  }

  dealData (page, done, err) {
    const params = Object.assign({}, this.QueryParams);
    if (isEmptyObject(params.searchParamsJson)) {
      const start = (page.num - 1) * this.limit;
      this.getMenuList(
        this.BOSchemaCode,
        page.num - 1,
        this.CurrentScopeType,
        start,
        start + page.size,
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
          this.displayItems(data);
        },
      );
    } else if (this.DefaultSort) {
      if (params && params.sort) {
        params.sort = this.DefaultSortName;
      }
      if (params && params.order) {
        params.order = this.DefaultDesc ? 'desc' : 'asc';
      } else {
        params.order = this.Desc ? 'desc' : 'asc';
      }
      params.SheetData = this.SheetData;
      params.searchParamsJson = JSON.stringify(params.searchParamsJson);
      params.offset = (page.num - 1) * this.limit;
      params.limit = this.limit;
      params.Status = 1;
      params.DataField = this.DataField;
      params.SheetCode = this.CurrentCode;
      params.ActionName = 'GetAppDatas';
      params.IsExternal = this.isExternal;
      if (params.IsExternal) {
        params.SheetQuery = 1;
      }
      this.getMenuListByParams(
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
          this.displayItems(curPageData.ReturnData.Data);
        },
      );
    }
  }

  goBack () {
    if (!this.showFilter) {
      if (!this.IsQuery) {
        this.$root.eventHub.$off(`executeFilter-${this.pageId}`);
        this.$root.eventHub.$off('cancel-filter');
        // this.$destroy();
      }
      this.$store.state.excludeComp = ['formquery'];
      this.$router.go(-1);
    } else {
      this.showFilter = false;
      return false;
    }
    return null;
  }

  // 选择列表某项并打开表单页面
  clickItem (row) {
    if (this.IsMultiple && (this.IsInGridView || !this.isSingleQuery)) {
      this.changeSelectState(row);
    } else {
      this.ItemDatas.forEach(item => {
        if (item.ObjectId !== row.ObjectId) {
          item.Selected = false;
        }
      });
      row.Selected = this.Required || !row.Selected;
      row.isChild = this.isChild;
      row.IsChildSchema = this.isChildSchema;
      this.$forceUpdate();
      const $store = this.$store;
      const payload = {
        namespace: this.params.namespace,
        value: row.Selected ? row : null,
      };
      $store.dispatch(`Form/ViewModel/${ViewModelAction.INPUTQUERY}`, payload);
      this.$store.state.excludeComp = ['formquery'];

      this.goBack();
    }
  }

  // 确认选项并返回表单页面
  async ok () {
    if (this.isChooseItemBol) {
      return;
    }
    this.isChooseItemBol = true;
    await this.getBizObject({
      value: this.multiSelectedItems,
      isQueryChild: this.isChild,
      boschemacode: this.BOSchemaCode,
    });

    const $store = this.$store;
    const payload = {
      namespace: this.params.namespace,
      value: this.multiSelectedItems,
      // needCache: this.isSingleQuery && this.IsMultiple,
      // isQueryChild: this.isChild,
      // boschemacode: this.BOSchemaCode,
      // todo: 处理子表
    };
    $store.dispatch(`Form/ViewModel/${ViewModelAction.INPUTQUERY}`, payload);
    this.$store.state.excludeComp = ['formquery'];
    this.$router.go(-1);
  }

  // 切换选中状态
  changeSelectState (tempItem) {
    const item = tempItem;
    item.Selected = !item.Selected;
    if (item.Selected) {
      item.IsChildSchema = this.isChildSchema;
      this.multiSelectedItems.push(item);
    } else {
      this.multiSelectedItems.forEach((obj, idx) => {
        if (this.isChild) {
          if (obj[`${this.BOSchemaCode}.ObjectId`] === item[`${this.BOSchemaCode}.ObjectId`]) {
            this.multiSelectedItems.splice(idx, 1);
            return false;
          }
        } else if ((obj.ObjectId || obj) === item.ObjectId) {
          this.multiSelectedItems.splice(idx, 1);
          return false;
        }
        return false;
      });
    }
    this.$forceUpdate();
  }

  // 数据详情最多只显示6条
  showMobileDicData (MobileDicData, item, idx) {
    const keysArr = Object.keys(MobileDicData);
    const index = keysArr.indexOf(idx);
    if (index > 5) {
      return false;
    }
    return null;
  }

  // 格式化过滤参数
  formatQueryParams () {
    console.log('格式化过滤参数');
    if (!this.QueryParams) {
      this.QueryParams = {};
    }
    if (this.searchKey) {
      if (!this.QueryParams.searchParamsJson) {
        const tmp:any = {};
        tmp.Name = [this.searchKey];
        this.QueryParams.searchParamsJson = tmp;
        // this.QueryParams['searchParamsJson']=JSON.stringify(tmp);
      } else {
        const tmp = this.QueryParams.searchParamsJson;
        tmp.Name = [this.searchKey];
        this.QueryParams.searchParamsJson = tmp;
      }
    } else if (this.QueryParams.searchParamsJson) {
      const tmp = this.QueryParams.searchParamsJson;
      delete tmp.Name;
      this.QueryParams.searchParamsJson = tmp;
    } else {
      this.QueryParams.searchParamsJson = {};
    }
    this.QueryParams.sort = this.Sort;
    this.QueryParams.order = this.Desc ? 'desc' : 'asc';
    this.QueryParams.SchemaCode = this.BOSchemaCode;
    this.QueryParams.scopeType = this.CurrentScopeType;
  }

  // 根据关键字过滤
  searchByKeyword (keyword) {
    this.searchKey = keyword;
    this.searchDebounce ? this.searchDebounce() : '';
  }

  // 取消关键字过滤
  cancelSearch () {
    this.filterBtnShowBol = true;
    this.searchWrapShowBol = false;
    this.searchKey = '';
    this.isSearching = false;
    this.HasMore = false;
    this.PageIndex = 0;
    this.ItemDatas = [];
    this.formatQueryParams();
    this.doRefresh();
    this.searchPicBol = true;
  }

  // 显示筛选组件
  openFilterModal () {
    this.showFilter = true;
  }

  // 打开表单页面
  openForm () {
    this.$router.push({
      name: 'queryFormPage',
      params: {
        schemaCode: this.BOSchemaCode,
      },
    });
  }

  // 展示列表数据
  displayItems (data) {
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
              const dicData = mobileDicData[key];
              for (const keykey in dicData) {
                let colvalue = dicData[keykey];
                if (Object.prototype.hasOwnProperty.call(dicData, keykey)) {
                  for (const conkey in data.rows.Columns) {
                    const column = data.rows.Columns[conkey];
                    if (column.Code === key && !isNaN(row[key])) {
                      if (row[key] && row[key].constructor === Number) {
                        colvalue = parseFloat(row[key]).toFixed(column.DecimalPlaces || 0);
                        if (column.ShowMode && column.ShowMode === 1) {
                          colvalue = colvalue.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                        }
                      }
                    }
                  }
                  row.MobileDicData.push({
                    key: keykey,
                    value: colvalue,
                  });
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
        if (this.isRefreshing) this.ItemDatas = [].concat(data.rows.ReturnData);
        else this.ItemDatas = this.ItemDatas.concat(data.rows.ReturnData);
        // 把已选择的标记上
        this.multiSelectedItems.forEach((obj, idx) => {
          obj.ObjectId = obj.objectId || obj.ObjectId;
          this.ItemDatas.forEach((temps) => {
            const temp = temps;
            if (data.rows.ChildSchemaCode) {
              let selectedItemObjectId = obj.ObjectId || obj.objectId || obj;
              selectedItemObjectId = obj[`${data.rows.ChildSchemaCode}.ObjectId`] || selectedItemObjectId;
              if (selectedItemObjectId === temp[`${data.rows.ChildSchemaCode}.ObjectId`]) {
                temp.Selected = true;
                this.multiSelectedItems[idx] = temp;
              }
            } else if ((obj.ObjectId || obj.objectId || obj) === temp.ObjectId) {
              temp.Selected = true;
              this.multiSelectedItems[idx] = temp;
            }
          });
        });
        this.ready = false;
      } else {
        this.ready = true;
      }
    }
  }

  async getMenuListByParams (params, successCallback) {
    const data = await getAppMenuDataByParams(params);
    if (!data.Successful) {
      H3PluginDeveloper.IHidePreLoader();
      H3PluginDeveloper.IShowError(data.ErrorMessage);
      return;
    }
    successCallback(data);
  }

  doRefresh () {
    const scroll:any = this.$refs.scroll;
    if (scroll && scroll.mescroll) {
      scroll.mescroll.resetUpScroll();
    }
  }

  previewPic (index) {
    const photos = this.ItemDatas.map(item => {
      return item.__IconUrl ? `${item.__IconUrl}` : imgURL;
    });
    this.previewObject = imagepreview({
      images: photos,
      index: index,
      onClose: () => {
        this.backStack.pop();
      },
    });
    this.backStack.push(() => {
      this.previewObject.$destroy();
    });
  }

  async getBizObject ({ value, isQueryChild, boschemacode }) {
    // 如果是关联表单关联子表多选，需要先合并请求
    let objectIds = '';
    value.forEach((item) => {
      let objectId = item.ObjectId;
      if (isQueryChild) {
        objectId = item[`${boschemacode}.ObjectId`];
      }
      objectIds += `${objectId};`;
    });
    const result = await getFormatBizObject(boschemacode, objectIds);
    if (result.Successful) {
      result.ReturnData.ListViewData.forEach((item) => {
        let objectId = item.ObjectId;
        if (isQueryChild) {
          objectId = item[`${boschemacode}.ObjectId`];
        }
        formLogicService.getCurrentForm().$setQueryCache(objectId, item);
      });
    }
  }

  // 新增表单
  newQueryForm () {
    this.toAddform = true;
    if (!this.isSecondaryForm) {
      if (Object.keys(this.$route.params).length > 0) {
        this.setPrimaryQueryParmers(this.$route.params);
      }
      this.setSecondaryForm(true);
    }
    this.$router.push({
      name: 'formQueryPage',
      params: {
        schemaCode: this.BOSchemaCode,
        mappingSchemaCode: this.CurrentCode,
        mappingValue: this.bizObjectId,
      },
      query: {
        // 标识是从关联表单新增进入的表单页面
        refleshRoute: '3',
        // 标识是从关联表单新增进入的表单页面
        fromFormQuery: '1',
        // 关联的表单的schemaCode
        BOSchemaCode: this.BOSchemaCode,
        // 进入关联表单列表的路由信息
        routerParams: this.params,
      },
    });
  }

  // 获取关联表单权限
  async loadSchemaAcls () {
    const res = await LoadSchemaAcls(this.BOSchemaCode);
    if (res.Successful) {
      const returnData = res.ReturnData;
      const schema = returnData[this.BOSchemaCode];
      this.canCreate = schema.CanCreate;
      this.isChildSchema = schema.IsChildSchema;
    }
  }
}
</script>

<style lang="less">
@baseFontSize: 75;
.px2rem(@name, @px) {
  @{name}: @px / @baseFontSize * 1rem;
}

#query-form {
  .h3-mask{
    position: absolute;
    top: 44px;
    bottom: 0;
    width: 100%;
    background-color: rgba(0,0,0,.4);
    z-index: 999;
  }
  .search-bar {
    position: relative;
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
    background-color: white;
    box-shadow:0px 1px 0px 0px rgba(228,228,228,1);
    .searchBarWarpper {
      .px2rem(width, 596);
      &.full-width {
        width: 100% !important;
      }
      form {
        padding: 0;
      }
    }
    .filter-query {
      position: absolute;
      //top: 0;
      .px2rem(top, 8);
      color: #666;
      text-align: center;
      .px2rem(right, 16);
      .px2rem(height, 88);
      .px2rem(width, 88);
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
  .h3-search-focus {
    width: 100% !important;
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
      .px2rem(padding-top, 26);
      .px2rem(padding-bottom, 26);
      .px2rem(padding-right, 24);
      display: flex;
      position: relative;
      width: auto;
      border-bottom: 1px solid #EEEEEE;
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
    z-index: 99;
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
  .empty-sheet-container {
    width: 100%;
    text-align: center;
    .px2rem(padding-top,160);
    img {
      .px2rem(width,270);
      .px2rem(height,280);
    }
    div.message {
      .px2rem(margin-top,50);
      .px2rem(font-size,28);
      color: #999;
    }
  }

  .view-scroll{
    position: absolute;
    top:44px;
    bottom: 0;
    width: 100%;
    height: auto;
    .query-form .mescroll {
      position: relative;
      bottom: 0;
      height: auto !important;
      z-index: 2;
      width: 100%;
    }
    .scroll-wrapper {
      position: relative;
      top: 0px;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      & > div {
        width: 100%;
        padding-bottom: 0;
        overflow-x: hidden;
      }
    }
  }
}
</style>
