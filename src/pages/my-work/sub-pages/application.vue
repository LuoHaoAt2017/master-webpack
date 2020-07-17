<template>
  <layout
    :title="title"
    :leftOptions="{ preventGoBack: true }"
    :rightOptions="rightOptions"
    @on-click-back="goBack()"
  >
    <div class="workflow-view workflow-view-application">
      <div
        class="search-bar"
        ref="header"
        v-show="showSearchBar"
      >
        <div
          class="searchBarWarpper"
          :class="{'h3-search-focus':isSearching}"
        >
          <SearchBar
            prefixCls="h3-search-opposite"
            ref="searchBar"
            v-model="searchKey"
            placeholder="搜索数据标题"
            :onChange="searchByKeyAsync"
            :onCancel="cancelSearch"
            :showCancelButton="false"
            :onFocus="onFocus"
            :onBlur="onBlur"
          />
        </div>
        <div
          class="filter"
          :class="{'filter-active' : showFilterCondition}"
          @click="toggleFilter"
          v-show="!isSearching"
        >
          筛选
        </div>
      </div>
      <h3-filter-condition
        v-show="showFilterCondition"
        :items="filterItems"
        :reset="resetCondition"
      ></h3-filter-condition>
      <div class="workflow-view-scroll">
        <h3-scroll
          ref="scroll"
          :loadMore="loadMore"
          :pageSize="pageSize"
        >
          <div>
            <p
              v-show="searchKey && total > 0"
              class="h3-search-result"
            >搜索结果：共{{total}}条</p>
            <p
              class="h3-search-no-data"
              v-show="searchKey && total <= 0"
            >没有找到与“{{searchKey}}”相关的表单</p>
            <div :class="{'filter-padding' : showFilterCondition}">
              <h3-card-todo
                v-for="(item, index) in items"
                :key="index"
                :title="!isInstance ? (`${item.OriginatorName}的${item.WorkflowDisplayName}`) : (`${item.Originator}的${item.WorkflowDisplayName}`)"
                :dataTitle="item.InstanceName"
                :progress="item.ActivityDisplayName"
                :waitedDay="item.approveDays"
                :waitedHour="item.approveHrs"
                :waitedMinute="item.approveMins"
                :currentParticipant="item.CurrentParticipant"
                :arriveTime="item.StartTime"
                :photo="item.ProfilePhotoUrl"
                :name="item.Originator"
                :objectId="item.WorkItemID || item.InstanceId"
                :request="true"
                :workItemType="workItemType"
                :requestResult="getRequestResult(item)"
                :requestResultTime="item.CurrentFinishTime ? item.CurrentFinishTime:item.StartTime"
                :highLightText="searchKey.toLowerCase()"
                @urge="toRemind(item)"
                @openSheet="openSheet(item)"
              ></h3-card-todo>
            </div>
          </div>
        </h3-scroll>
      </div>
      <h3-modal
        :show.sync="showFilter"
        maskClosable
        type="popup"
        popup-direction="right"
        @on-hide="hideFilter"
        style="position: absolute"
      >
        <workflow-filter
          :type="-1"
          ref="filter"
          :state="curState"
          @reset="resetFilter"
          @ok="filter"
        ></workflow-filter>
      </h3-modal>

      <h3-modal
        :show="popupModalShow"
        type="popup"
        style="position:absolute;top: 44px;"
        popup-direction="down"
      >
      </h3-modal>
      <h3-blank-page
        :style="wrapNoContentStyle"
        tipText="暂无数据"
        img="../../assets/img/blankpage.png"
        v-if="showEmptyResult"
      >

      </h3-blank-page>
      <h3-blank-page
        style="bottom:0;height:auto;"
        :style="wrapFilterStyle"
        :imageUrl="filterDodataImgSrc"
        :imgWidth="77"
        :imgHeight="77"
        tipText="暂无筛选结果"
        :showButton="true"
        buttonText="清除条件"
        @buttonClick="resetCondition"
        v-show="showEmptyFilterResult"
      ></h3-blank-page>
    </div>
  </layout>
</template>

<script>
import { urge } from '../../../service/get-data';
import {
  isDingtalk,
  isiOS,
} from '../../../config/common';
import mixin from '../js/workflows';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';

export default {
  name: 'myapplication',
  data() {
    return {
      title: '我发起的',
      workItemType: -1,
      actionName: 'FilterAllMyInstance',
    };
  },
  mixins: [mixin],
  beforeRouteLeave(to, from, next) {
    if (to.name === 'home' || to.name === 'singleApp') {
      this.$store.state.excludeComp = ['myapplication'];
    } else {
      this.$store.state.excludeComp = [];
    }
    next();
  },
  methods: {
    // 初始化返回的列表数据(距离截止时间初始化) && 初始化我申请的状态数据
    formatReturnData(rows) {
      const self = this;
      for (const item of rows) {
        self.formatTime(item, item.StartTime);
      }
    },
    // 等待时间处理
    formatTime(item, start) {
      const self = this;
      const tmp = item;
      // let startTime = new Date(start);
      const endTime = new Date();

      // iPhone的Date函数不支持直接传字符串创建日期
      // if (typeof start === 'string') {
      const startTime = self.convertStringToDate(start);
      // }
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
    cancelSearch() {
      this.searchKey = '';
      this.isSearching = false;
      this.searchItems = [];
      // TODO 还原数据
      this.$refs.scroll && this.$refs.scroll.mescroll && this.$refs.scroll.mescroll.resetUpScroll();
    },
    getRequestResult(item) {
      if (item.StateCode === 2) {
        return 'approving';
      } else if (item.StateCode === 4) {
        return 'executed';
      } else if (item.StateCode === 5) {
        return 'cancellation';
      }
      return 'draft';
    },
    toRemind(item) {
      // 接收催办事件
      const content = `${this.$store.state.UserInfo.userName}的${item.WorkflowDisplayName}`;
      if (isDingtalk) {
        this.postDing(content, item);
      } else {
        this.urge(item.InstanceId, content);
      }
    },
    postDing(content, item) {
      const that = this;
      const dingUsers = []; // 可以为空
      if (item.ParticipantDingTalkAccounts) {
        for (let i = 0; i < item.ParticipantDingTalkAccounts.length; i += 1) {
          const dingtalkAccount = item.ParticipantDingTalkAccounts[i];
          if (dingtalkAccount) {
            dingUsers.push(dingtalkAccount.substring(0, dingtalkAccount.indexOf('.')));
          }
        }
      }
      const text = `请您尽快处理！`;
      const title = '任务催办通知';
      const hostAddress = `${window.location.protocol}//${
        window.location.host
        }`;
      const corpId = this.$store.state.corpId;
      let url = null; // 打开流程的链接
      if (this.$store.state.suitekey) {
        // ISV接入
        url = `${hostAddress}/index.html?corpid=${corpId}&MessageType=Urge&suitekey=${this.$store.state.suitekey}&SchemaCode=${item.SchemaCode}&BizObjectId=${item.BizObjectId}&appid=${item.SchemaCode}`;
      } else {
        // 企业接入
        url = `${hostAddress}/index.html?corpid=${corpId}&MessageType=Urge&agentid=${this.$store.state.agentId}&SchemaCode=${item.SchemaCode}&BizObjectId=${item.BizObjectId}&appid=${item.SchemaCode}`;
      }
      const subText = content;
      const imageUrl = `${hostAddress}/Content/Images/Task.png`;
      H3PluginDeveloper.IPostLinkDing(
        dingUsers,
        corpId,
        text,
        title,
        url,
        imageUrl,
        subText,
        (e) => {
          if (isiOS) {
            if (e) {
              that.urge(item.InstanceId, e.text);
            } else {
              return false;
            }
          } else if (e.dingCreateResult) {
            that.urge(item.InstanceId, e.text);
          } else {
            return false;
          }
          return null;
        },
        () => {
        },
      );
    },
    async urge(instanceId, content) {
      const res = await urge(instanceId, content);
      if (res.Successful) {
        H3PluginDeveloper.IShowSuccess('催办成功!');
      }
    },
  },
};
</script>

<style lang="less">
@import '../css/my-work.less';
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.workflow-view-application {
  .workflow-view-scroll {
    position: absolute;
    bottom: 0;
    height: auto;
    top: 44px;
    width: 100%;
  }
  .h3-search-result {
    .px2rem(padding-left, 30);
  }
  .mescroll {
    position: relative;
    top: 0px;
  }
}
</style>


