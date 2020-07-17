<template>
  <layout
  :title="title"
  :leftOptions="{ preventGoBack: true }"
  :rightOptions="rightOptions"
  @on-click-back="goBack"
  >
  <div class="workflow-view workflow-view-approve">
    <div ref="header">
      <h3-tab :activeColor="'rgba(24,144,255,1)'" :barActiveColor="'rgba(24,144,255,1)'">
        <h3-tab-item selected @on-item-click="toggleStatus">待审批({{totalTodo}})</h3-tab-item>
        <h3-tab-item @on-item-click="toggleStatus">已审批</h3-tab-item>
      </h3-tab>
      <div class="search-bar" v-show="showSearchBar">
        <div class="searchBarWarpper" :class="{'h3-search-focus':isSearching }">
          <SearchBar prefixCls="h3-search-opposite"  ref="searchBar" v-model="searchKey"  placeholder="搜索数据标题"
            :onChange="searchByKeyAsync"
            :onCancel="cancelSearch"
            :showCancelButton="false"
            :onFocus="onFocus"
            :onBlur="onBlur" />
        </div>
        <div class="filter" :class="{'filter-active' : showFilterCondition}" @click="toggleFilter" v-show="!isSearching">
            筛选
        </div>
      </div>
    </div>
    <h3-filter-condition ref="filterCondition" v-show="showFilterCondition" :items="filterItems" :reset="resetCondition" style="position: absolute"></h3-filter-condition>
    <div class="workflow-view-scroll">
      <h3-scroll ref="scroll" :loadMore="loadMore" :pageSize="pageSize">
        <div>
          <p v-show="searchKey && total > 0" class="h3-search-result">搜索结果：共{{total}}条</p>
          <p class="h3-search-no-data" v-show="searchKey && total <= 0">没有找到与“{{searchKey}}”相关的表单</p>
          <div :class="{'filter-padding' : showFilterCondition}">
          <h3-card-todo v-for="(item, index) in items" :key="index"
            :approve="item.Approval"
            :allowedTime="item.AllowedTime"
            :waitedDay="item.approveDays"
            :waitedHour ="item.approveHrs"
            :waitedMinute ="item.approveMins"
            :title="getTitle(item)"
            :dataTitle="item.InstanceName"
            :progress ="item.ActivityDisplayName"
            :arriveTime ="item.ReceiveTime"
            :finishTime ="item.FinishTime"
            :photo="item.ProfilePhotoUrl"
            :objectId ="item.ObjectID"
            :name="item.OriginatorName"
            :toDo="status==4"
            :workItemType="workItemType"
            :isOverdueApproved="!!item.isOverdueApproved"
            :reviewResult="getItemState(item)"
            :highLightText ="searchKey.toLowerCase()"
            @openSheet="openSheet(item)"
            :state="item.State"
          ></h3-card-todo>
          </div>
        </div>
      </h3-scroll>
    </div>
    <h3-modal :show.sync="showFilter" maskClosable type="popup" popup-direction="right" @on-hide="hideFilter" style="position: absolute">
      <workflow-filter :type="2" :state="curState" ref="filter" @reset="resetFilter" @ok="filter" ></workflow-filter>
    </h3-modal>

    <h3-modal :show="popupModalShow" type="popup" style="position: absolute;top: 88px;" popup-direction="down"></h3-modal>

    <h3-blank-page :style="wrapNoContentStyle"  tipText="暂无数据" img="../../assets/img/blankpage.png" v-if="showEmptyResult" ></h3-blank-page>

    <h3-blank-page style="bottom:0;height:auto;" :style="wrapFilterStyle" tipText="暂无筛选结果"  :imageUrl="filterDodataImgSrc"
      :imgWidth="77" :imgHeight="77" :showButton="true" buttonText="清除条件" @buttonClick="resetCondition" v-show="showEmptyFilterResult">
    </h3-blank-page>
  </div>
  </layout>
</template>

<script>
import { WorkItemTypes, WorkItemStates } from '../../../config/common';
import mixin from '../js/workflows';

export default {
  name: 'approval',
  data() {
    return {
      title: '待我审批',
      totalTodo: 0,
      workItemType: WorkItemTypes.Approve,
      actionName: 'FilterMyWorkItem',
    };
  },
  mixins: [mixin],
  // beforeRouteLeave(to, from, next) {
  //   if (to.name === 'home' || to.name === 'singleApp') {
  //     this.$store.state.excludeComp = ['approval'];
  //   } else {
  //     this.$store.state.excludeComp = [];
  //   }
  //   next();
  // },
  methods: {
    // 初始化返回的列表数据(距离截止时间初始化) && 初始化我申请的状态数据
    formatReturnData(rows) {
      const self = this;
      const nowTime = new Date().Format('yyyy/MM/dd hh:mm');
      for (const item of rows) {
        self.formatTime(item, nowTime, item.AllowedTime);
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
    getItemState(item) {
      if (item.Approval === '1' && this.status !== 4) {
        return 'approved';
      } else if (item.State !== '2' && item.Urged !== '0') {
        return 'urged';
      } else if (item.State === '2' && item.Approval === '0' && this.status !== 4) {
        return 'disapproved';
      }
      return '';
    },
    cancelSearch() {
      this.total = -1;
      this.searchKey = '';
      this.isSearching = false;
      this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
    },
  },
};
</script>

<style lang="less">
@import '../css/my-work.less';
@import '../../../styles/mixins.less';

// @baseFontSize: 75;
// .px2rem(@name,@px) {
//   @{name}: @px/@baseFontSize * 1rem;
// }
.workflow-view-approve {
  .workflow-view-scroll{
    position: absolute;
    bottom: 0;
    height: auto;
    top: 88px;
    width: 100%;
  }
  .h3-search-result{
    .px2rem(padding-left, 30);
  }
  .mescroll{
    position: relative;
    top: 0px;
  }
}

</style>


