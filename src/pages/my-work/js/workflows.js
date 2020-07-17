import SearchBar from '../../../../packages/components/h3-search-bar';
import H3Scroll from '../../../../packages/components/h3-scroll/mescroll';
import H3Modal from '../../../../packages/components/h3-modal';
import H3CardTodo from '../card-todo-list';
import H3BlankPage from '../../../../packages/widgets/h3-blank-page';
import H3FilterCondition from '../../../../packages/widgets/h3-filter/h3-filter-condition';
import { H3Tab, H3TabItem } from '../../../../packages/components/h3-tab/';

import WorkflowFilter from '../filter/filter';

import { GetBoEnableSheetHome, getWorkItemsAndTasks } from '../../../service/get-data';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { WorkItemStates, backStack } from '../../../config/common';
import throttle from 'lodash/throttle'
import filterDodataImgSrc from '../../../assets/img/filternodata.png';
import {setRightMenu, hideRightMenu} from '../../../config/dingtalk-interface';

const mixin = {
  components: {
    SearchBar,
    H3Scroll,
    H3Modal,
    H3CardTodo,
    H3BlankPage,
    H3FilterCondition,
    H3Tab,
    H3TabItem,
    WorkflowFilter,
  },
  data() {
    return {
      pageSize: 10,
      total: 0,
      searchKey: '',
      searchItems: [],
      showFilter: false,
      showFilterCondition: false,
      filterItems: {},
      actionsheetShow: false,
      isEditing: false,
      items: [],
      status: WorkItemStates.Unfinished,
      isSearching: false,
      isSearchingOnBlur: false,
      headerHeight: 0,
      filterDodataImgSrc,
      fontSize: 16, // 根元素的字体大小
      orderBy: 'State,CreatedTime',
      // filterItemsArr: [],
      // tabIndex: 0,
      isInstance: false,
      rightOptions: {
        text: '发起流程',
        callback: ()=>{
          this.$store.state.excludeComp = ['apps'];
          this.$router.push({ name: 'startWorkflow'});
        }
      }
    };
  },
  created() {
    const that = this;
    that.$root.eventHub.$on('form-updated', () => {
      this.$nextTick(() => {
        if (that.$refs.scroll) {
          that.$refs.scroll.mescroll.resetUpScroll();
        }
      });
    });
    that.$root.eventHub.$on('forward-updated', () => {
      this.$nextTick(() => {
        if (that.$refs.scroll) {
          that.$refs.scroll.mescroll.resetUpScroll();
        }
      });
    });
    // this.setLeftAndTitle();
    this.searchByKeyAsync = throttle(this.searchByKeyAsync, 300, { leading: true, trailing: true });
  },
  mounted() {
    this.$nextTick(() => {
      this.headerHeight = this.$refs.header.offsetHeight;
      this.fontSize = parseFloat(document.querySelector('html').style.fontSize);
    });
  },
  activated() {
    this.setRightButton()
    // this.setLeftAndTitle();
    // if (this.$refs.scroll.mescroll) {
      // this.$refs.scroll.mescroll.setBounce(false);
    // }
    if (this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.lastScrollTop) {
      this.$refs.scroll.mescroll.setScrollTop(this.$refs.scroll.mescroll.lastScrollTop);
      setTimeout(() => { // 需延时,因为setScrollTop内部会触发onScroll,可能会渐显回到顶部按钮
        this.$refs.scroll.mescroll.setTopBtnFadeDuration(0);// 设置回到顶部按钮显示时无渐显动画
      }, 16);
    }
  },
  deactivated() {
    hideRightMenu();
  },
  beforeRouteLeave(to, from, next) {
    hideRightMenu();
    if (this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll) {
      // this.$refs.scroll.mescroll.setBounce(true);
      this.$refs.scroll.mescroll.lastScrollTop = this.$refs.scroll.mescroll.getScrollTop();
    }
    next();
  },
  methods: {
    //setLeftAndTitle() {
      // setTitle(this.title);
      // setLeft(() => {
      //   this.goBack();
      // });
    //},
    // 打开表单
    openSheet(item) {
      if (item.ItemType !== 1) {
        // 长按事件 新建
        this.$router.push({
          name: 'formPage',
          params: {
            bizObjectId: item.BizObjectId,
            schemaCode: item.SchemaCode,
            workflowCode: item.WorkflowCode,
            workItemId: item.ObjectID || item.OriginWorkItemID,
            instanceId: item.InstanceId,
            mode: item.State !== '2' ? 'Edit' : 'View',
          },
          query: {
            bizObjectId: item.BizObjectId,
            schemaCode: item.SchemaCode,
            workItemId: item.ObjectID || item.OriginWorkItemID,
            instanceId: item.InstanceId,
          },
        });
      } else {
        this.getSheetData(item.SchemaCode, item.BizObjectId);
      }
    },
    resetCondition() {
      this.filterItems = {};
      // this.filterItemsArr[this.tabIndex] = undefined;
      this.showFilterCondition = false;
      this.$refs.filter.handleReset();
      this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
    },
    resetFilter() { // 重置筛选条件
      this.filterItems = {};
      // this.filterItemsArr[this.tabIndex] = undefined;
      this.showFilterCondition = false;
      this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
    },
    filter(res) { // 执行筛选
      this.showFilter = false;
      this.stopScroll();
      this.filterItems = {};
      let allAll = true;
      for (const key of Object.keys(res)) {
        if (Object.prototype.hasOwnProperty.call(res, key)) {
          if (res[key] && res[key].Code !== 'All') {
            allAll = false;
            if (res[key].Active) {
              this.filterItems[key] = res[key];
            }
          }
        }
      }
      if (allAll) {
        this.showFilterCondition = false;
      } else {
        this.showFilterCondition = true;
      }
      this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
      this.stopScroll();
    },
    stopScroll() {
      if (this.showFilter) {
        $('.mescroll').css('overflow', 'hidden');
      } else {
        $('.mescroll').css('overflow', '');
      }
    },
    hideFilter() {
      this.showFilter = false;
      this.stopScroll();
      const res = this.$refs.filter.callBackRes();
      this.filter(res);
    },
    goBack() {
      if (this.showFilter) {
        this.showFilter = false;
        this.stopScroll();
      } else {
        this.$router.go(-1);
      }
    },
    searchByKeyAsync() {
      if (this.searchKey) {
        this.showFilter = false;
        this.stopScroll();
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
      // TODO
      this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
    },
    onFocus() {
      // TODO
      this.isSearching = true;
      this.isSearchingOnBlur = false;
      this.showFilterCondition = false;
      this.searchKey = '';
      this.filterItems = {};
    },
    onBlur() {
      // TODO
      // this.total = -1;
      this.isSearchingOnBlur = true;
      if (!this.searchKey) {
        this.isSearching = false;
        this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
      }
    },
    toggleStatus(index) {
      // this.tabIndex = index;
      // if (!$.isEmptyObject(this.filterItems)) {
      //   if (index === 0) {
      //     this.filterItemsArr[1] = this.filterItems;
      //   } else {
      //     this.filterItemsArr[0] = this.filterItems;
      //   }
      // }
      // this.showFilterCondition = this.filterItemsArr[index] || false;
      this.isSearching = false;
      this.searchKey = '';
      this.filterItems = {};
      this.showFilterCondition = false;
      if (index === 0) {
        if (this.status !== WorkItemStates.Unfinished) {
          this.items = [];
          this.chaosongState = '';
          this.status = WorkItemStates.Unfinished;
          this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
        }
      } else if (this.status !== WorkItemStates.Finished) {
        this.items = [];
        // if (this.workItemType === 3) {
        this.status = WorkItemStates.Finished;
        // } else {
        //   this.status = WorkItemStates.Finished;
        // }
        this.isEditing = false;
        this.chaosongState = 'all';
        this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
      }
    },
    loadMore(page, done, err) {
      // if (this.filterItemsArr[this.tabIndex]) {
      //   this.filterItems = this.filterItemsArr[this.tabIndex];
      // }
      const self = this;
      this.getWorkflowLists(page.num, page.size, (curPageData) => {
        self.total = curPageData.total;
        if (self.workItemType !== -1 && self.status === WorkItemStates.Unfinished) {
          self.totalTodo = self.total;
        }
        const rows = curPageData.rows;
        if (page.num === 1) {
          self.items = [];
        }
        self.formatReturnData(rows);
        self.items = self.items.concat(rows);
        done(rows.length, self.Total);
      }, () => {
        // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        err();
      });
    },
    // 将日期格式的字符串转成日期，因为iPhone不支持new Date(string)构造函数
    convertStringToDate(dateStr) {
      const dateSegments = dateStr.split(/[- :/]/);
      for (let i = 0; i < dateSegments.length; i += 1) {
        dateSegments[i] = parseInt(dateSegments[i], 10);
      }

      return new Date(
        dateSegments[0],
        dateSegments[1] - 1,
        dateSegments[2],
        dateSegments[3] || 0,
        dateSegments[4] || 0,
        dateSegments[5] || 0,
      );
    },
    getTitle(item) {
      if (item.ActivityDisplayName !== item.DisplayName) {
        return item.DisplayName;
      }
      return !this.isInstance ? (`${item.OriginatorName}的${item.WorkflowDisplayName}`) : (`${item.Originator}的${item.WorkflowDisplayName}`);
    },
    /* */
    // 打开表单
    async getSheetData(schemacode, bizObjectId) {
      let data = await GetBoEnableSheetHome(schemacode, bizObjectId);
      if (data.Successful === false) {
        H3PluginDeveloper.IShowError('提示', data.ErrorMessage, () => {});
      } else {
        data = data.ReturnData.Data;
        if (data.enableHomePage === true || data.enableHomePage === 'true') {
          this.$router.push({
            name: 'sheethome',
            params: {
              schemaCode: schemacode,
              bizObjectId,
              displayName: data.Name,
            },
          });
        } else {
          // 长按事件 新建
          this.$router.push({
            name: 'formPage',
            params: { schemaCode: schemacode, bizObjectId },
            query: { schemaCode: schemacode, bizObjectId },
          });
        }
      }
    },
    // 获取代办数据
    async getWorkflowLists(pageNum, pageSize, successCallback) {
      const self = this;
      let isMyStart = 0;
      if (self.workItemType !== -1) {
        if (self.status !== WorkItemStates.Unfinished &&
          self.status !== WorkItemStates.Unspecified) {
          self.orderBy = 'h_WorkItem.FinishTime';
        } else {
          self.orderBy = 'Urged desc,AllowedTime,ReceiveTime';
        }
      } else {
        isMyStart = 0;
        this.isInstance = true;
      }
      const appCode = self.$store.state.appCode;
      const solutionCode = self.$store.state.solutionCode;
      let sheetCode = null;
      let criticalLevel = -1;
      let instanceState = 8;
      if (self.filterItems.Critical) {
        criticalLevel = self.filterItems.Critical.Value;
      }
      if (self.filterItems.Sheet) {
        sheetCode = self.filterItems.Sheet.Value;
      }
      if (self.filterItems.InstanceState) {
        instanceState = self.filterItems.InstanceState.Value;
      }
      const pageIndex = pageNum - 1;
      const data = await getWorkItemsAndTasks(
        pageIndex,
        pageSize,
        null,
        null,
        null,
        appCode,
        solutionCode,
        null,
        isMyStart,
        null,
        self.workItemType,
        this.actionName,
        sheetCode,
        criticalLevel,
        self.orderBy,
        self.status,
        self.searchKey,
        instanceState,
      );

      if (data.ReturnData.Data) {
        this.totalUnRead = data.ReturnData.Data.total;
        if (successCallback) {
          successCallback(data.ReturnData.Data);
        }
      }
    },
    setRightButton() {
      setRightMenu('发起流程', () =>{
        this.$store.state.excludeComp = ['apps'];
        this.$router.push({ name: 'startWorkflow'});
      });
    },
  },
  computed: {
    showSearchBar() {
      return (this.total !== 0 || !$.isEmptyObject(this.filterItems) ||
       this.isSearching) && !this.isEditing;
    },
    curState() {
      if (this.status === WorkItemStates.Unfinished) {
        return 4;
      }
      return 2;
    },
    showEmptyFilterResult() {
      return this.total === 0 && !$.isEmptyObject(this.filterItems);
    },
    showEmptyResult() {
      return this.total === 0 && $.isEmptyObject(this.filterItems) && !this.searchKey;
    },
    popupModalShow() {
      if (this.isSearchingOnBlur) {
        return false;
      }
      if (this.isSearching && !this.searchKey) {
        return true;
      }
      return false;
    },
    wrapNoContentStyle() {
      if (this.workItemType === -1) {
        return 0;
      }
      return {
        top: '44px',
      };
    },
    wrapFilterStyle() {
      if (this.showFilterCondition) {
        if (this.workItemType !== -1) {
          return {
            top: '124px',
            background: '#f8f8f8',
          };
        }
        return {
          top: '88px',
          background: '#f8f8f8',
        };
      }
      if (this.workItemType !== -1) {
        return {
          top: '88px',
          background: '#f8f8f8',
        };
      }
      return {
        top: '44px',
        background: '#f8f8f8',
      };
    },
  },
};

export default mixin;
