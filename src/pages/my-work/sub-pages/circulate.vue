<template>
  <layout
  :title="title"
  :leftOptions="{ preventGoBack: true }"
  :rightOptions="rightOptions"
  @on-click-back="goBack"
  >
  <div class="workflow-view workflow-view-circulate">
    <div ref="header">
      <h3-tab :activeColor="'rgba(24,144,255,1)'" :barActiveColor="'rgba(24,144,255,1)'">
        <h3-tab-item selected @on-item-click="toggleStatus">待阅({{totalTodo}})</h3-tab-item>
        <h3-tab-item @on-item-click="toggleStatus">已阅</h3-tab-item>
      </h3-tab>
      <div class="search-bar" v-show="showSearchBar">
        <div class="searchBarWarpper" :class="{'h3-search-focus':isSearching, 'search-bar-wrapper-copy': status==4 && !isSearching}">
          <SearchBar prefixCls="h3-search-opposite" ref="searchBar" v-model="searchKey"  placeholder="搜索数据标题"
            :onChange="searchByKeyAsync"
            :onCancel="cancelSearch"
            :showCancelButton="false"
            :onFocus="onFocus"
            :onBlur="onBlur" />
        </div>
        <div class="filter-copy" @click="toogleIsEditing" v-show="status == 4 && !isSearching">
            已阅
        </div>
        <div class="filter" :class="{'filter-active' : showFilterCondition}" @click="toggleFilter" v-show="!isSearching">
            筛选
        </div>
      </div>
    </div>
    <h3-filter-condition v-show="showFilterCondition" :items="filterItems" :reset="resetCondition"></h3-filter-condition>
    <div class="workflow-view-scroll" :class="isEditing ? 'h3-scroll-circulate-isediting' : ''">
    <h3-scroll ref="scroll" :loadMore="loadMore" :pageSize="pageSize">
      <div>
        <p v-show="searchKey && total > 0" class="h3-search-result">搜索结果：共{{total}}条</p>
        <p class="h3-search-no-data" v-show="searchKey && total <= 0">没有找到与“{{searchKey}}”相关的表单</p>
        <h3-swipeout>
          <h3-swipeout-item  v-for="(item, index) in items" :key="index" :disabled="item.State === '2' || item.State === '3' ||  item.State === '6'" underlay-color="#ccc"  transition-mode="follow">
            <div slot="right-menu">
              <h3-swipeout-button @click.native="circulate(item,index)" :width="90" style="background:#1890ff;font-size:0.4rem;">标为已阅</h3-swipeout-button>
            </div>
            <div slot="content">
              <div :class="{'filter-padding' : showFilterCondition}">
              <h3-card-todo
                :title="getTitle(item)"
                :dataTitle="item.InstanceName"
                :progress ="item.ActivityDisplayName"
                :arriveTime ="item.ReceiveTime"
                :finishTime ="item.FinishTime"
                :photo="item.ProfilePhotoUrl"
                :objectId ="item.ObjectID"
                :selected ="item.selected"
                :name="item.OriginatorName"
                :isEditing ="isEditing"
                :approve="item.Approval"
                :isOverdueApproved="!!item.isOverdueApproved"
                :item="item"
                :index="index"
                :toDo="status==4"
                :workItemType="workItemType"
                @toogleIsEditing ="toogleIsEditing"
                @toggleSelected ="toggleSelected"
                :chaosong = "true"
                :highLightText ="searchKey"
                @openSheet ="openSheet(item)"
                @onLongTouch = "longTouchCirculate"
              ></h3-card-todo>
              </div>
            </div>
          </h3-swipeout-item>
        </h3-swipeout>
      </div>
    </h3-scroll>
    </div>
    <h3-modal :show.sync="showFilter" maskClosable type="popup" popup-direction="right" @on-hide="hideFilter" style="position: absolute">
      <workflow-filter :type="3" category="approval" ref="filter" :state="curState" @reset="resetFilter" @ok="filter"></workflow-filter>
    </h3-modal>
    <h3-batch-action-sheet v-show="isEditing" :isAll="isSelectedAll" :selectedNum="checkedNum" :tip="'已阅'" @onCancel="onCancel" @selectAll="selectAll"></h3-batch-action-sheet>

    <h3-modal :show="popupModalShow" type="popup" style="position:absolute;top: 88px;" popup-direction="down"  >
    </h3-modal>
    <h3-action-sheet
    :menus="menus"
    :message="`将全部${checkedNum === 0? totalUnRead : checkedNum}条数据标为已阅吗？`"
    show-cancel
    @on-click-menu="onClickMenu"
    v-model="actionsheetShow"
    ></h3-action-sheet>

     <h3-blank-page :style="wrapNoContentStyle"  tipText="暂无数据" img="../../assets/img/blankpage.png" v-if="showEmptyResult" >

    </h3-blank-page>
    <h3-blank-page style="bottom:0;height:auto;" :style="wrapFilterStyle" tipText="暂无筛选结果" :imageUrl="filterDodataImgSrc" :imgWidth="77" :imgHeight="77"  :showButton="true"
    buttonText="清除条件" @buttonClick="resetCondition"
    v-show="showEmptyFilterResult"
    ></h3-blank-page>
    <div class="long-touch-modal" @click="closeLongTouchModal($event)" v-show="longTouchShow">
      <div class="button-wrap">
        <div class="button mark dp-font34" @click="circulate(currentItem,currentIndex)">标为已阅</div>
        <div class="button cancel dp-font34" @click="cancelLongTouchShow">取消</div>
      </div>
    </div>
  </div>
  </layout>
</template>

<script>
import H3BatchActionSheet from '../../../../packages/widgets/h3-filter/h3-batch-action-sheet.vue';
import H3ActionSheet from '../../../../packages/components/h3-actionsheet/index.vue';

import { H3Swipeout, H3SwipeoutItem, H3SwipeoutButton } from '../../../../packages/components/h3-swipeout';
import { WorkItemTypes, WorkItemStates } from '../../../config/common';
import {
  Circulate,
  CirculateMultiItem,
  finishAllCirculate,
} from '../../../service/get-data';
import mixin from '../js/workflows';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';

export default {
  name: 'circulate',
  components: {
    H3Swipeout,
    H3SwipeoutItem,
    H3SwipeoutButton,
    H3BatchActionSheet,
    H3ActionSheet,
  },
  data() {
    return {
      title: '抄送我的',
      menus: [
        {
          type: 'error',
          label: '全部已阅',
        },
      ],
      workItemType: WorkItemTypes.Circulate,
      totalTodo: 0,
      isCheckedAll: false,
      actionName: 'FilterMyWorkItem',
      longTouchShow: false,
      currentItem: null,
      currentIndex: '',
      totalUnRead: 0,
    };
  },
  mixins: [mixin],
  beforeRouteLeave(to, from, next) {
    if (to.name === 'home' || to.name === 'singleApp') {
      this.$store.state.excludeComp = ['circulate'];
    } else {
      this.$store.state.excludeComp = [];
    }
    next();
  },
  methods: {
    async setCirculate(items, index) {
      const item = items;
      const data = await Circulate(
        item.ObjectID, item.WorkflowCode,
        item.WorkflowVersion, item.InstanceId, item.BizObjectId,
      );
      if (data.Successful) {
        if (this.status === WorkItemStates.Unfinished) {
          this.items.splice(index, 1);
        } else {
          this.$set(item, 'Approval', '1');
          this.$set(item, 'selected', false);
        }
        this.total -= 1;
        this.totalTodo = this.total;
        if (!this.items.length) {
          this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
        }
      } else {
        H3PluginDeveloper.IShowSuccess('提示', '已阅失败');
      }
    },
    // 批量已阅
    async setCirculateMultiItem(items) {
      const data = await CirculateMultiItem(items);
      if (data.Successful) {
        this.isEditing = false;
        const itemsArr = items.split(';');
        this.totalTodo -= itemsArr.length;
        this.delIsCirculateItems();
        if (!this.items.length) {
          this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
        }
      }
    },
    // 全部已阅
    async setAllCirculate() {
      const solutionCode = this.$store.state.solutionCode;
      const appCode = this.$store.state.appCode;
      const data = await finishAllCirculate(solutionCode, appCode);
      if (data.Successful) {
        this.isEditing = false;
        this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
      }
    },
    // 初始化返回的列表数据(距离截止时间初始化) && 初始化我申请的状态数据
    formatReturnData(rows) {
      const self = this;
      const nowTime = new Date().Format('yyyy/MM/dd hh:mm');
      for (const item of rows) {
        if (Number(item.State) !== WorkItemStates.Finished) {
          item.timeDisplayName = '到达时间';
          item.timeDisplayValue = item.ReceiveTime;
        } else {
          item.timeDisplayName = '审批时间';
          if (item.AllowedTime && item.FinishTime > item.AllowedTime) {
            item.isOverdueApproved = true;
          }
          item.timeDisplayValue = item.FinishTime;
        }
        item.fininshTimeName = '距截止时间';
        if (item.AllowedTime) {
          self.formatTime(item, nowTime, item.AllowedTime);
        }
      }
    },
    // 等待时间处理
    formatTime(item, start, end) {
      const self = this;
      const tmp = item;
      let startTime = new Date(start);
      let endTime = new Date(end);

      // iPhone的Date函数不支持直接传字符串创建日期
      if (typeof start === 'string') {
        startTime = self.convertStringToDate(start);
      }
      if (typeof end === 'string') {
        endTime = self.convertStringToDate(end);
      }
      if (
        (Number(tmp.State) === WorkItemStates.Waiting ||
          Number(tmp.State) === WorkItemStates.Working) &&
        tmp.AllowedTime
      ) {
        tmp.AllowedTime = true;
      }
      let approveDays = 0;
      let approveHrs = 0;
      let approveMins = 0;
      const disSeconds = Math.abs(endTime - startTime) / 1000;
      if (disSeconds === 0) {
        approveHrs = '00';
        approveMins = '00';
      } else {
        approveDays = Math.floor(disSeconds / (24 * 60 * 60));
        approveHrs = Math.floor((disSeconds % (24 * 60 * 60)) / (60 * 60));
        approveMins = Math.floor(((disSeconds % (24 * 60 * 60)) % (60 * 60)) / 60);
        // approveHrs = approveHrs >= 10 ? `${approveHrs}` : `0${approveHrs}`;
        // approveMins = approveMins >= 10 ? `${approveMins}` : `0${approveMins}`;
      }
      tmp.approveDays = approveDays;
      tmp.approveHrs = approveHrs;
      tmp.approveMins = approveMins;
    },
    // 全部已阅
    onClickMenu(key) {
      if (key === 'cancel') {
        this.onCancel();
      } else {
        // 通知后台,然后调取后台数据
        this.setAllCirculate();
      }
    },
    // 取消全部已阅
    onCancel() {
      this.isEditing = false;
    },
    // 点击全部已阅
    selectAll() {
      if (this.isSelectedAll) {
        this.actionsheetShow = true;
      } else {
        // 通知后台,然后调取后台数据
        const items = this.formatMultiItemParams();
        this.setCirculateMultiItem(items);
      }
    },
    // 格式化要已阅的数组
    formatMultiItemParams() {
      const items = [];
      const self = this;
      this.items.forEach((item) => {
        if (item.selected || self.checkedNum === 0) {
          items.push(item.ObjectID);
          // const obj = {};
          // obj.SchemaCode = item.SchemaCode;
          // obj.BizObjectId = item.BizObjectId;
          // obj.InstanceId = item.InstanceId;
          // obj.WorkflowVersion = item.WorkflowVersion;
          // obj.WorkflowCode = item.WorkflowCode;
          // obj.WorkItemId = item.ObjectID;
          // arr.push(obj);
        }
      });
      return items.join(';');
    },
    // 删除选中的已阅
    delIsCirculateItems() {
      const arr = this.items.filter((item) => {
        return !item.selected;
      });
      this.items = arr;
    },
    cancelSearch() {
      this.searchKey = '';
      this.isSearching = false;
      this.searchItems = [];
      // TODO 还原数据
      this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
    },
    longTouchCirculate(item, index) {
      if (item.State !== '2') {
        this.longTouchShow = true;
        this.currentItem = item;
        this.currentIndex = index;
      }
    },
    cancelLongTouchShow() {
      this.longTouchShow = false;
    },
    closeLongTouchModal(e) {
      if (e.currentTarget.className === 'long-touch-modal') {
        this.longTouchShow = false;
      }
    },
    circulate(item, index) {
      this.longTouchShow = false;
      this.$set(item, 'selected', true);
      this.setCirculate(item, index);
    },
    toogleIsEditing() {
      this.isEditing = !this.isEditing;
    },
    toggleSelected(objectId) {
      this.isCheckedAll = false;
      for (let i = 0; i < this.items.length; i += 1) {
        const item = this.items[i];
        if (objectId === item.ObjectID) {
          this.$set(item, 'selected', !item.selected);
          break;
        }
      }
    },
  },
  computed: {
    isSelectedAll() {
      if (this.checkedNum === 0) {
        return true;
      }
      return false;
    },
    checkedNum() {
      let num = 0;
      for (let i = 0; i < this.items.length; i += 1) {
        const item = this.items[i];
        if (item.selected) {
          num += 1;
        }
      }
      return num;
    },
  },
  watch: {
    isEditing(val) {
      if (!val) {
        for (let i = 0; i < this.items.length; i += 1) {
          const item = this.items[i];
          this.$set(item, 'selected', false);
        }
      }
    },
  },
};
</script>

<style lang="less">
@import '../css/my-work.less';
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.workflow-view-circulate {
  .search-bar {
    .search-bar-wrapper-copy{
      .px2rem(width, 502)!important;
      form {
        padding: 0;
      }
    }
    .filter-copy {
      position: absolute;
      top: 0;
      color: #666;
      .px2rem(right, 124);
      .px2rem(height, 88);
      .px2rem(line-height, 88);
      .px2rem(font-size, 32);
    }
  }
  .workflow-view-scroll{
    position: absolute;
    bottom: 0;
    height: auto;
    top: 88px;
    width: 100%;
  }
  .h3-scroll-circulate-isediting{
    .px2rem(top, 88);
  }
  .long-touch-modal {
    width: 100%;
    position: fixed;
    height: 100%;
    background-color: rgba(0,0,0,.4);
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    .button-wrap{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: #F8F8F8;
      .button {
        background-color: white;
        width: 100%;
        .px2rem(height, 100);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cancel {
        .px2rem(margin-top, 13);
      }
    }
  }
  .mescroll{
    position: relative;
    top: 0px;
  }
}

</style>


