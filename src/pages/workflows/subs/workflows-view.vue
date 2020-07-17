<template>
<!-- lbb修改代码规范 -->
  <div id="flowsviews" class="bc-w" ref="flowsviews"> 
    <div>
        <div class="search-counts dp-font22 " v-if="searchKey !== ''" ref="searchCounts">搜索结果：共<span class="dp-font22">{{searchDataCounts}}</span>条</div>
        <div class="brash-more t-c p-r dp-font26"  v-if="downTips">
          <span class="brash-icon p-a t-c"
                :class="{'ic-rotate':icRotate,'icon-loading':downLoading,'icon-arrow-down-thin':!downLoading}"></span>
          <span class="brash-info dp-font26">{{downLoading?'数据加载中...':(brashInfo?'下拉可以刷新':'松开立即刷新')}}</span>
        </div>
        <div class="brash-more is-browsered t-c dp-font26 pullup-tips" v-if="showBrash">{{'刷新了' + brashCounts +'条数据'}}</div>          
        <!-- <div class="flows-box" v-swipeY = "{app:hasMoreDatas,hader: swipeYHandler}">       -->

          <div class="flows-box">      
      <div class="main fl-b bb" v-for="(item,index) in showData" :key="item.name"
            :class="{'bd-no':index === showData.length-1}"
            @click="openSheet(item,$event)"
            style="margin-top:0;">
          <div class="item-l" >
            <span class="img-box in-l" v-if="item.ProfilePhotoUrl"><img :src="item.ProfilePhotoUrl"></span>
            <span class="item-name-profile" v-else>{{ getOriginatorName(item)}}</span>
          </div>
          <div class="item-r fl-o">
              <ul class="item-r-box">
                  <li class="item-title-box info-pd bd-color dp-font32 fw-b clearfix">
                    <span class="item-title bd-color dp-font32 fw-b fl-l">{{!isInstanced ? (item.OriginatorName + '的' + item.WorkflowDisplayName) : (item.Originator + '的' + item.WorkflowDisplayName)}}</span>                    
                    <span class="tt-status fl-l dp-font20" :class="[ statuArr[Number(item.Status)].bg ]" v-if="isInstanced">{{statuArr[Number(item.Status)].text}}</span>                                        
                  </li>
                  <li class="item-neg-title info-pd bd-color dp-font28 fw-b" v-html="item.InstanceName">{{item.InstanceName}}</li>
                  <li class="aprroves fl-b" 
                    v-if="!isInstanced || (isInstanced && item.StateCode !== WorkflowInstanceStates.Finished && item.StateCode !== WorkflowInstanceStates.Canceled)">
                      <div class="aprovesTp dp-font26" v-if="item.ActivityDisplayName">
                        <template v-if="isInstanced">
                          <span>
                            {{ item.ActivityDisplayName + (item.MultiNodesAtSameTime === 1 ? "等" : "") + ': ' + item.CurrentParticipant + (item.ParticipantDingTalkAccounts.length > 1 ? "等" : "") }}&nbsp;&nbsp;
                          </span>
                        </template>
                        <template v-else>
                          <span>{{item.ActivityDisplayName}}&nbsp;&nbsp;</span>
                        </template>
                        <span class="cl-gr dp-font20"
                          v-if="item.isOverdueApproved">已超时&nbsp;&nbsp;系统自动通过</span>                      
                      </div>
                      <div class="fl-o" v-if="item.AllowedTime === true || (item.AllowedTime && (item.State === '0' || item.State === '1'))">
                          <span class="cl-gr dp-font20">{{item.fininshTimeName}}&nbsp;</span>
                          <template v-if="item.approveDays > 0">
                            <span class="cl-rd dp-font22">{{item.approveDays}}</span><span class="cl-gr dp-font20">天</span>
                          </template>
                          <template v-else-if="item.approveHrs > 0">
                            <span class="cl-rd dp-font22">{{item.approveHrs}}</span><span class="cl-gr dp-font20">小时</span>
                          </template>
                          <template v-else-if="item.approveMins > 0">
                            <span class="cl-rd dp-font22">{{item.approveMins}}</span><span class="cl-gr dp-font20">分钟</span>
                          </template>                                        
                      </div>                       
                  </li>
                  <li class="arrive-tm info-pd fl-b" >                      
                      <div class="fl-o">
                          <span class="cl-gr dp-font20">{{item.timeDisplayName}}: </span>
                          <span class="cl-gr dp-font20">{{item.timeDisplayValue}}</span> 
                      </div>                       
                  </li>
              </ul>
          </div> 
          <span class="to-remind p-a fw-b" 
            v-if="item.StateCode && (item.StateCode === 2)" @click.stop="toRemind(item)">催办
          </span> 
          <template v-if="item.ItemType && item.ItemType === WorkItemTypes.Approve && status === WorkItemStates.Finished">
            <span class="icon-remind p-a" 
              v-if="item.Approval !== '1' && item.Approval !== '-1'">
              <img src="../../../assets/img/butongyi.png" alt="图片">
            </span>
            <span class="icon-remind p-a" 
              v-else-if="item.Approval === '-1'">
              <img src="../../../assets/img/zuofei.png" alt="图片">
            </span>
            <span class="icon-remind p-a" 
              v-else-if="item.Approval === '1'">
              <img src="../../../assets/img/tongyi.png" alt="图片">
            </span>
          </template>   
          <template v-if="item.ItemType !== void(0) && (item.ItemType === WorkItemTypes.Approve || item.ItemType === WorkItemTypes.Fill)">
            <span class="icon-remind p-a" v-if="(Number(item.State) === WorkItemStates.Waiting || Number(item.State) === WorkItemStates.Working) &&  Number(item.Urged) === 1">
              <img src="../../../assets/img/beichuiban.png" alt="图片">
            </span>
          </template>
      </div>
      <div class="pull-up-tips t-c p-r dp-font22" v-if="showPullUp">
        <span class=" p-a" :class="{'icon-loading':isUpLoading}"></span>
        <span class="brash-info dp-font22" 
          v-html="hasMoreDatas ? (isUpLoading ? '更多加载中...' : '上拉加载更多') : '所有数据均加载完毕'"></span>
      </div>
    </div>        
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import {
  isDingtalk,
  isiOS,
  WorkItemTypes,
  WorkItemStates,
  WorkflowInstanceStates,
} from '../../../config/common';
import {
  getWorkItemsAndTasks,
  urge,
  GetBoEnableSheetHome,
} from '../../../service/get-data';

export default {
  name: 'flowsviews',
  props: [
    'events',
    'pageId',
    'workItemType',
    'status',
    'searchKey',
    'showSearchResults',
  ],
  data() {
    return {
      downTips: false,
      icRotate: false,
      downLoading: false,
      showPullUp: false, // 上拉提示展示
      brashInfo: true,
      showBrash: false,
      brashCounts: 0,
      title: '', // 流程页面传过来的标题数据
      isUpLoading: false, // 是否上拉状态
      hasMoreDatas: true, // 还有更多数据未加载
      PageIndex: 0,
      PageSize: 10,
      searchDataCounts: 0,
      ActionName: '', // 申请、非申请流程参数
      OrderBy: '', // 排序参数
      showData: [], // 流程列表数据
      // item.Approval,item.State,item.Urge数值类型为字符串
      hasDatas: false,
      isInstanced: false, // 是否为已申请
      isFiltered: false, // 标志是否为过滤状态
      // properName:'<h1>我是大号字体</h1>',
      WorkItemTypes,
      WorkItemStates,
      WorkflowInstanceStates,
      statuArr: [
        // 状态数组
        {
          text: '进行中',
          bg: 'bg-blue',
        },
        {
          text: '生效',
          bg: 'bg-grr',
        },
        {
          text: '草稿',
          bg: 'bg-org',
        },
        {
          text: '作废',
          bg: 'bg-greay',
        },
        {
          text: '初始化',
          bg: 'bg-blue',
        },
      ],
      filterParams: [],
    };
  },

  // directives: {
  //   swipeY
  // },
  created() {
    this.getWorkflowLists();
    this.addScroll();
    this.throttledGetWorkflowLists = H3PluginDeveloper.IThrottle(
      this.getWorkflowLists,
      this,
      300,
    );

    this.$root.eventHub.$on('form-button-clicked', () => {
      this.cachedButNeedRefresh = true;
    });

    this.$root.eventHub.$on(`executeFilter-${this.pageId}`, (res) => {
      this.PageIndex = 0;
      this.filterParams = res;
      this.getWorkflowLists();
      this.scrollToTop();
    });
  },
  activated() {
    if (this.cachedButNeedRefresh) {
      this.PageIndex = 0;
      this.filterParams = [];
      this.getWorkflowLists();
      this.cachedButNeedRefresh = false;
    }
  },
  methods: {
    getOriginatorName(item) {
      const originatorName = item.OriginatorName || item.Originator;
      return originatorName.substr(originatorName.length - 2, 2);
    },
    // 下拉刷新完成后初始化
    brashInit() {
      this.downTips = false;
      this.icRotate = false;
      this.downLoading = false;
      // this.showPullUp = false;
      this.isUpLoading = false;
      this.brashInfo = true;
      this.showBrash = false;
      this.brashCounts = 0;
    },
    // 添加滚动事件
    addScroll() {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.flowsviews, {
          probeType: 3,
          click: true,
          scrollY: true,
          // resizePolling:20,
          bounce: true,
          scrollbar: true,
        });
        // 下拉刷新
        this.scroll.on('scroll', (props) => {
          const currentY = props.y;
          if (currentY >= 30 && currentY < 50) {
            this.downTips = true;
            this.icRotate = false;
            this.brashInfo = true;
          } else if (currentY >= 50) {
            this.icRotate = true;
            this.brashInfo = false;
          } else {
            this.downTips = false;
          }
        });
        // 上拉加载更多
        this.scroll.on('touchEnd', (e) => {
          const el = this.scroll.scroller;
          const currentY = e.y;
          const availlHeight = el.parentElement.offsetHeight;
          const elHeight = el.offsetHeight;
          if (currentY >= 50) {
            const obj = {};
            const pull = true;
            obj.self = this;
            obj.el = el;
            this.swipeYHandler(obj, pull);
          } else if (currentY < availlHeight - elHeight) {
            const obj = {};
            const pull = false;
            obj.self = this;
            obj.el = el;
            this.swipeYHandler(obj, pull);
          }
        });
      });
    },
    switchPullUp() {
      // 下拉提示底部隐藏
      this.$nextTick(() => {
        const el = this.$refs.flowsviews;
        if (el) {
          const availlHeight = el.parentElement.offsetHeight;
          const elHeight = el.children[0].offsetHeight;
          if (availlHeight > elHeight) {
            this.showPullUp = false;
          } else {
            this.showPullUp = true;
          }
        }
      });
    },
    // 刚进入页面后初始化页面
    init() {
      this.index = 0;
      H3PluginDeveloper.IShowPreLoader('数据加载中...');
      // 初始化下拉刷新提示的样式
    },
    // 下拉刷新、回弹效果
    brashDatas(data, obj, pull) {
      if (pull) {
        this.brashCounts = data.ReturnData.Data.rows.length;
        this.downTips = false;
        const that = this;
        setTimeout(() => {
          that.showBrash = true;
          setTimeout(() => {
            that.showBrash = false;
            that.brashInit();
            obj.self.scroll.refresh();
          }, 1000);
        }, 800);
      } else {
        this.isUpLoading = false;
        setTimeout(() => {
          obj.self.scroll.refresh();
        }, 30);
      }
    },
    // 上下滑动回调函数
    swipeYHandler(obj, pull) {
      this.downLoading = true;
      if (pull) {
        this.PageIndex = 0;
        this.getWorkflowLists(obj, pull, this.workItemType);
      } else if (this.hasMoreDatas) {
        this.PageIndex += 1;
        this.isUpLoading = true;
        this.getWorkflowLists(obj, pull, this.workItemType);
      } else {
        this.isUpLoading = false;
      }
    },
    // 清除流程过滤缓存
    clearFlowsFilters() {
      this.WorkCriticalLevel = '';
      this.WorkflowInstanceState = '';
      // this.WorkItemState = 4;
      this.WorkflowDisplayName = '';
    },
    // 搜索结果展示
    showSearch(row) {
      let rows = row;
      const counts = rows.length;
      this.$root.eventHub.$emit('show-search-counts', counts);
      this.searchDataCounts = counts;
      const tempArr = [];
      for (let i = 0; i < rows.length; i += 1) {
        rows[i].InstanceName = rows[i].InstanceName.replace(
          '<span class="title-bold dp-font32">',
          '',
        );
        rows[i].InstanceName = rows[i].InstanceName.replace('</span>', '');
        if (rows[i].InstanceName.indexOf(this.searchKey) > -1) {
          tempArr[i] = rows[i];
        }
      }

      for (let i = 0; i < tempArr.length; i += 1) {
        tempArr[i].InstanceName = tempArr[i].InstanceName.replace(
          '<span class="title-bold dp-font32">',
          '',
        );
        tempArr[i].InstanceName = tempArr[i].InstanceName.replace(
          '</span>',
          '',
        );
        tempArr[i].InstanceName = tempArr[i].InstanceName.replace(
          this.searchKey,
          `<span class="title-bold dp-font32">${this.searchKey}</span>`,
        );
        // Vue.set(this.showData, i, tempArr[i]);
      }

      rows = [].concat(rows);
      return false;
    },
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
          });
        }
      }
    },
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
        });
      } else {
        this.getSheetData(item.SchemaCode, item.BizObjectId);
      }
    },
    // 等待时间处理
    formatTime(items, start, end) {
      const item = items;
      let startTime = new Date(start);
      let endTime = new Date(end);

      // iPhone的Date函数不支持直接传字符串创建日期
      if (typeof start === 'string') {
        startTime = this.convertStringToDate(start);
      }
      if (typeof end === 'string') {
        endTime = this.convertStringToDate(end);
      }
      if (
        (Number(item.State) === WorkItemStates.Waiting ||
          Number(item.State) === WorkItemStates.Working) &&
        item.AllowedTime) {
        item.AllowedTime = true;
      }
      let approveDays = 0;
      let approveHrs = 0;
      let approveMins = 0;
      const disSeconds = Math.abs(endTime - startTime) / 1000;
      if (disSeconds > 0) {
        approveDays = Math.floor(disSeconds / (24 * 60 * 60));
        approveHrs = Math.floor((disSeconds % (24 * 60 * 60)) / (60 * 60));
        approveMins = Math.floor(((disSeconds % (24 * 60 * 60)) % (60 * 60)) / 60);
      }
      item.approveDays = approveDays;
      item.approveHrs = approveHrs;
      item.approveMins = approveMins;
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
    // 初始化返回的列表数据(距离截止时间初始化) && 初始化我申请的状态数据
    formatReturnData(rows) {
      for (const item of rows) {
        // 非我的申请
        if (this.workItemType !== undefined && this.workItemType !== -1) {
          if (
            Number(item.State) === WorkItemStates.Waiting ||
            Number(item.State) === WorkItemStates.Working
          ) {
            item.timeDisplayName = '到达时间';
            item.timeDisplayValue = item.ReceiveTime;
          } else {
            switch (this.workItemType) {
              case WorkItemTypes.Fill:
                item.timeDisplayName = '完成时间';
                if (item.AllowedTime && item.FinishTime > item.AllowedTime) {
                  item.isOverdueApproved = true;
                }
                break;
              case WorkItemTypes.Approve:
                item.timeDisplayName = '审批时间';
                item.ItemType = WorkItemTypes.Approve;
                if (item.AllowedTime && item.FinishTime > item.AllowedTime) {
                  item.isOverdueApproved = true;
                }
                break;
              case WorkItemTypes.Circulate:
                item.timeDisplayName = '查阅时间';
                break;
              default:
                break;
            }
            item.timeDisplayValue = item.FinishTime;
          }

          item.fininshTimeName = '距截止时间';
          this.formatTime(item, item.ReceiveTime, item.AllowedTime);
        } else {
          switch (item.StateCode) {
            case WorkflowInstanceStates.Running:
              item.AllowedTime = true;
              item.timeDisplayName = '创建时间';
              item.timeDisplayValue = item.StartTime;
              break;
            case WorkflowInstanceStates.Finished:
              item.timeDisplayName = '生效时间';
              item.timeDisplayValue = item.FinishTime;
              break;
            case WorkflowInstanceStates.Canceled:
              item.timeDisplayName = '作废时间';
              item.timeDisplayValue = item.FinishTime;
              break;
            default:
              break;
          }
          item.fininshTimeName = '已等待';
          this.formatTime(item, item.StartTime, new Date());
        }

        // 处理申请的状态
        if (this.isInstanced) {
          switch (item.StateCode) {
            case 2: //
              item.Status = 0;
              break;
            case 4:
              item.Status = 1;
              break;
            case 5:
              item.Status = 3;
              break;
            case 0:
              item.Status = 4;
              break;
            default:
              break;
          }
        }
      }
    },
    // 获取已办、待办
    async getWorkflowLists(obj, pull) {
      H3PluginDeveloper.IShowPreLoader('数据加载中...');
      let isMyStart = 0;
      if (this.workItemType !== -1) {
        if (this.status === WorkItemStates.Finished) {
          this.OrderBy = 'h_WorkItem.FinishTime';
        } else {
          this.OrderBy = 'Urged desc,AllowedTime,ReceiveTime';
        }
        this.ActionName = 'FilterMyWorkItem';
      } else {
        // 我申请的
        isMyStart = 1;
        this.OrderBy = 'State,CreatedTime';
        this.isInstanced = true;
        this.ActionName = 'FilterAllMyInstance';
      }
      const appCode = this.$store.state.appCode;
      const solutionCode = this.$store.state.solutionCode;
      // if (!appCode && !solutionCode) {
      //   appCode = 'home';
      //   solutionCode = 'home';
      // }
      const data = await getWorkItemsAndTasks(
        this.PageIndex,
        this.PageSize,
        this.state,
        null,
        null,
        appCode,
        solutionCode,
        null,
        isMyStart,
        null,
        this.workItemType,
        this.ActionName,
        this.filterParams.SchemaCode
          ? this.filterParams.SchemaCode
          : null,
        this.filterParams.WorkCriticalLevel !== undefined
          ? this.filterParams.WorkCriticalLevel
          : -1,
        this.OrderBy,
        this.status,
        this.searchKey,
        // this.WorkflowInstanceState
        this.filterParams.InstanceState
          ? this.filterParams.InstanceState
          : 8,
      );
      // 判断已审批不应指定 ItemType ,因为有跳过审批节点的可能
      H3PluginDeveloper.IHidePreLoader();
      if (data.ReturnData.Data) {
        this.Total = data.ReturnData.Data.total;

        this.$root.eventHub.$emit('flows-data-loaded', {
          totalCount: this.Total,
          currentLoadCount: data.ReturnData.Data.rows.length,
        });

        const rows = data.ReturnData.Data.rows;
        this.formatReturnData(rows);
        if (this.searchKey && this.searchKey.length > 0) {
          this.showSearch(rows);
        }
        // 上/下拉刷新数据
        if (obj) {
          this.brashDatas(data, obj, pull);
        }
        if (this.PageIndex === 0) {
          this.showData = [].concat(rows);
        } else {
          this.showData = this.showData.concat(rows);
        }
        this.switchPullUp();

        if (this.showData.length < data.ReturnData.Data.total) {
          this.hasMoreDatas = true;
        } else {
          this.hasMoreDatas = false;
        }
      }
    },
    async urge(instanceId, content) {
      const res = await urge(instanceId, content);
      if (res.Successful) {
        H3PluginDeveloper.IShowSuccess('催办成功!');
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
      var text = '请您尽快处理！';
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
    // 催办功能
    toRemind(item) {
      const content = `${this.$store.state.UserInfo.userName}的${item.WorkflowDisplayName}`;
      if (isDingtalk) {
        this.postDing(content, item);
      } else {
        this.urge(item.InstanceId, content);
      }
    },
    refresh(done) {
      done();
    },
    scrollToTop() {
      if (this.scroll) {
        this.scroll.scrollTo(0, 0);
      }
      // this.scroll && this.scroll.scrollTo(0, 0);
    },
  },
  watch: {
    searchKey() {
      this.throttledGetWorkflowLists();
    },
    status() {
      this.PageIndex = 0;
      this.filterParams = [];
      this.getWorkflowLists();
      this.scrollToTop();
    },
  },
};
</script>
<style lang="less">
@import "../../../styles/common.less";
#flowsviews {
  background-color: #f5f5f5;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  overflow: hidden;
  .info-pd {
    padding: 0.06rem 0;
  }
  .cl-gr {
    color: #999999;
  }
  .cl-rd {
    color: #f0584b;
  }
  .bd-bot {
    border: 0 !important;
    background-image: -webkit-linear-gradient(
      0deg,
      #e4e4e4,
      #e4e4e4 50%,
      transparent 50%
    );
    background-image: linear-gradient(
      0deg,
      #e4e4e4,
      #e4e4e4 50%,
      transparent 50%
    );
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
  }
  .bb {
    border: 0 !important;
    background-image: -webkit-linear-gradient(
      0deg,
      #e4e4e4,
      #e4e4e4 50%,
      transparent 50%
    );
    background-image: linear-gradient(
      0deg,
      #e4e4e4,
      #e4e4e4 50%,
      transparent 50%
    );
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
    margin-bottom: 1px;
  }
  //刷新控制样式
  .brash-more {
    // position: absolute;
    height: 40px;
    line-height: 40px;
    z-index: 1000;
    // background-color: #fff;
    background-color: #f5f5f5;
    // position: absolute;
    top: 0;
    width: 100%;
    color: #9baabd;
    .brash-icon {
      left: 33%;
      top: 30%; /* transform: translateY(-50%); */
      transform-origin: center center;
      transition: all 0.3s;
      color: #9baabd;
      font-size: 0.4rem;
    }
    .ic-rotate {
      transform: rotate(-180deg);
    }
    .icon-loading {
      left: 33%; // top: 50%;
      top: 30%;
      transform-origin: center;
      color: #9baabd;
      animation: brashing 0.5s infinite;
    }
    @keyframes brashing {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
  .is-browsered {
    // background-color: #108ee9;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    // background-image: url('../../assets/img/fresh.gif');
    color: #fff;
  }
  .pullup-tips {
    background: url("../../../assets/img/fresh.gif") no-repeat center center;
  }
  .flows-box {
    margin-top: 1px;
    background-color: #fff;
    .pull-up-tips {
      padding: 0.2rem 0;
      .brash-info {
        color: #9baabd;
      }
      .icon-loading {
        left: 33%;
        top: 35%;
        // transform: translateY(-50%);
        transform-origin: center;
        color: #9baabd;
        animation: brashing 0.5s infinite;
      }
    }
  }
  .main {
    width: 100% !important;
    padding: 0.15rem 0 0.3rem 0; // border-bottom: 1px solid #e8e8e8;
    position: relative;
    top: 0;
    bottom: 0;
    .item-l {
      padding: 0.1rem 0.22rem;
      .img-box {
        img {
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
        }
      }
      .item-name-profile {
        display: inline-block;
        width: 0.8rem;
        height: 0.8rem;
        line-height: 0.8rem;
        color: #fff;
        text-align: center;
        background-color: #38adff;
        border-radius: 50%;
      }
    }
    .item-r {
      .item-title {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 80%;
      }
      .tt-status {
        // width: 15%;
        width: 1.1rem; // width: .55rem;
        height: 0.45rem;
        line-height: 0.45rem;
        margin-top: 0.05rem;
        border-radius: 0.1rem;
        margin-left: 2%;
        text-align: center;
        color: #fff;
        font-weight: normal;
        font-size: 12px;
        padding-top: 1px;
      }
      .item-title-box,
      .item-neg-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 80%;
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
      .title-bold {
        color: #108ee9;
      }
      .aprroves {
        height: 0.4rem;
        line-height: 0.4rem;
        .aprovesTp {
          color: #ef8923;
        }
      }
    }
    .to-remind {
      bottom: 0.4rem;
      right: 0.25rem;
      color: #108ee9;
      padding: 0.1rem 0.3rem;
      border: 1px solid #108ee9;
      border-radius: 0.1rem;
    }
    .icon-remind {
      top: 0.9rem;
      right: 0.25rem;
      color: #f5a623;
      img {
        width: 1.5rem;
        height: 1.2rem;
      }
    }
  }
  .bd-no {
    // border-bottom: none;
    margin-bottom: 0;
  }
  .bd-top {
    margin-top: 1px;
  }
}
</style>


