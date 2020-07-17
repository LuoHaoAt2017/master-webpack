<template>
  <div class="main wrapper">
    <div class="sec-wrapper">
      <h3-title
        title="常用表单"
        class="title-home-custom"
        size="xl"
        icon-size="18"
        iconType="star-o"
        iconColor="#FDAA3F"
        class-name="home"
      >
        <template slot="extra">
          <span
            class="manage-favorite"
            @click="manageFavoriteSetting"
          >管理</span>
          <h3-tool-tip
            content='点击添加常用表单'
            @hideTip='hideTip'
            :showTip='showTip'
            direction="right-top"
            class='home-tool-tip'
          ></h3-tool-tip>
        </template>
      </h3-title>
      <home-card-menu
        :common-nodes="favoriteNodes"
        :is-custom="isCustomFavoriteNodes"
        @onClickApp="viewApp"
        @onLongTouch="openFormPage"
        @manage="manageFavoriteSetting"
      >
      </home-card-menu>
      <div
        v-for="card in cardComponents"
        :key='card'
      >
        <template v-if="card == 'assist'">
          <h3-title
            title='审批助手'
            class="title-home-custom"
            size="xl"
            icon-size="18"
            icon-type='process-seal'
            icon-color='#74D03D'
            class-name="home-swiper"
          ></h3-title>
          <home-card-assist
            :approve-assist='approveItems'
            @onClickContent="openAssistForm"
            @onHandle="openAssistForm"
            @RequestLatestData="requestLatestData"
            @onSwiperChange="afterSwipeAssist"
          ></home-card-assist>
        </template>
        <template v-if="card == 'trace'">
          <h3-title
            title='审批追踪'
            class="title-home-custom"
            size="xl"
            icon-size="18"
            icon-type='track'
            icon-color='#40A9FF'
            class-name="home-swiper"
            :class="{'trace-home': approveItems.length > 1}"
          >
            <template slot="extra"><span @click='openMyAplication'>查看全部</span></template>
          </h3-title>
          <home-card-trace
            :approve-trace="traces"
            @onPressToDo="urgeTrace"
            @onClickContent="openTraceForm"
            @RequestLatestData="requestLatestData"
            @onSwiperChange="afterSwipeTrace"
          ></home-card-trace>
        </template>
      </div>
      <template v-if="reportWidgets.length > 0">
        <h3-title-tip
          title="图形报表"
          class="title-home-custom"
          size="xl"
          icon-size="18"
          iconType="graphical"
          iconColor="#F0624C"
          class-name="home"
          :tip-content="reportToolText"
          :tip-extra-btn="reportToolBtn"
          @hideTip="hideReportTip"
          :show-tip="reportToolTipShow"
        >
        </h3-title-tip>
        <home-reports :report-widgets="reportWidgets"></home-reports>
      </template>
      <h3-icon-button :on-click="manageCardSetting">管理卡片</h3-icon-button>
    </div>
  </div>
</template>

<script>
import longtouch from '../../directives/long-touch';
import { setTitle, setLeft, closeApp, openLink, showRightMenu, hideRightMenu } from '../../config/dingtalk-interface';
import { isiOS, isDingtalk } from '../../config/common';
import smartForm from '../../lib/smart-form';
import {
  getHomeDatas,
  getApproveItems,
  getWorkflowTrace,
  urge,
  changeInstanceRemindState,
  getLastBizObjectIdBySchema,
} from '../../service/get-data';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
// h3 widgets
import H3Title from '../../../packages/widgets/h3-title/h3-title';
import H3TitleTip from '../../../packages/widgets/h3-title/h3-title-tip';
import H3Card from '../../../packages/widgets/h3-card-new/h3-card';
import H3ToolTip from '../../../packages/widgets/h3-tool-tip/h3-tool-tip';
import H3IconButton from '../../../packages/widgets/h3-button-icon/h3-button-icon';
// components
import HomeCardMenu from '../../components/home/home-card-menu';
import HomeCardTrace from '../../components/home/home-card-trace';
import HomeCardAssist from '../../components/home/home-card-assist';
import HomeReports from '../../components/home/reports/home-reports';

export default {
  name: 'home',
  data() {
    return {
      title: null,
      appCode: null,
      solutionCode: null,
      appType: 0,
      favoriteNodes: [],
      reportWidgets: [],
      isCustomFavoriteNodes: null,
      willExpire: false,
      reportToolText: '自动为你添加了管理员设置的图形报表',
      reportToolBtn: [
        {
          name: '管理',
          action: this.manageCardSetting,
          cutline: true,
        },
      ],
      reportToolTipShow: true,
      // showReportCards: false,
      showTip: false,
      traces: [],
      approveItems: [],
      allReportWidgets: [],
      customSetting: {},
      cardComponents: [],
      assistBadgeRecord: {},
      traceBadgeRecord: {},
      assistDemoKey: 'approve-assist',
      traceDemoKey: 'approve-trace',
      isAttachmentWillLimited: false,
      isAttachmentLimited: false,
      leaveAttachment: 0,
    };
  },
  components: {
    H3Title,
    H3Card,
    H3ToolTip,
    H3IconButton,
    H3TitleTip,
    HomeCardMenu,
    HomeCardTrace,
    HomeCardAssist,
    HomeReports,
  },
  directives: {
    longtouch,
  },
  created() {
    this.goToActivity(window.GlobalConfig.dingId);
    this.title = window.GlobalConfig.solutionName || '氚云';
    this.appCode = this.$store.state.appCode || '';
    this.solutionCode = this.$store.state.solutionCode;
    this.appType = this.$store.state.appType || '0';
    const customCardSettingKey = `customCardSetting-${window.GlobalConfig.userId}-${window.GlobalConfig.engineCode}-${this.solutionCode}`;
    this.$store.state.customCardSettingKey = window.btoa(customCardSettingKey);
    this.requestHomeData(this.appCode, this.solutionCode, this.appType);
    // webworker 替换
    this.getReportTipShowStaus();
    this.$root.eventHub.$on('Update-FavoriteFunctions', (nodes) => {
      this.favoriteNodes = nodes;
      this.isCustomFavoriteNodes = true;
    });
    this.$root.eventHub.$on('commission-updated', () => {
      this.requestLatestData();
    });
    this.$root.eventHub.$on('trace-updated', (instanceId) => {
      this.changeRemindState(instanceId);
    });
  },
  activated() {
    setTitle(this.title);
    setLeft(() => {
      this.goBack();
    });
    showRightMenu();
    this.requestLatestData();
    this.getCustomSetting();
  },
  methods: {
    goToActivity(dingId) {
      const hasShown = `${dingId}_hassend`;
      const hasSend = window.localStorage.getItem(hasShown);

      if (!hasSend && window.GlobalConfig.isAPaaS &&
        window.Environment && window.Environment.EnableActivity) {
        window.localStorage.setItem(hasShown, true);
        openLink(encodeURI(`${window.Environment.ApiHost}/Activity/Mobile/index.html?showmenu=false&enginecode=${window.GlobalConfig.engineCode}&userid=${window.GlobalConfig.userId}&dingid=${window.GlobalConfig.dingId}&accesstoken=${window.GlobalConfig.accessToken}`));
      }
    },
    async requestApproveItems(appCode, solutionCode, appType) {
      const res = await getApproveItems(appCode, solutionCode, appType);
      if (res.Successful) {
        const approveItems = res.ReturnData.ApproveItems;
        // error 后台接口变动导致返回null，非空判断
        if (!approveItems) return;
        for (let i = 0; i < approveItems.length; i += 1) {
          approveItems[i].isHandle = approveItems[i].ItemType === 0;
          approveItems[i].handleText = approveItems[i].ActivityDisplayName;
          approveItems[i].hideHeadbadge = !!this.assistBadgeRecord[approveItems[i].ObjectID];
        }
        this.approveItems = approveItems;
        const isReadassistDemo = window.localStorage.getItem(this.assistDemoKey);
        if (!isReadassistDemo && approveItems.length) {
          window.localStorage.setItem(this.assistDemoKey, true);
        }
      }
    },
    async requestWorkflowTraces(appCode, solutionCode, appType) {
      const res = await getWorkflowTrace(appCode, solutionCode, appType);
      if (res.Successful) {
        const isReadTraceDemo = window.localStorage.getItem(this.traceDemoKey);
        if (!isReadTraceDemo && res.ReturnData.Data.length) {
          window.localStorage.setItem(this.traceDemoKey, true);
        }
        this.traces = res.ReturnData.Data.map((traceItem) => {
          const PartcipantName =
            (traceItem.Participants && traceItem.Participants[0] && traceItem.Participants[0].Name) || '';
          const IsLastNode = traceItem.Participants && traceItem.Participants.length > 0;
          const traceData = Object.assign(traceItem, {
            SpendTime: traceItem.UserTime,
            ItemSumary: traceItem.ItemSummary || '',
            IsLastNode,
            PartcipantName,
            hideHeadbadge: !!this.traceBadgeRecord[traceItem.BizObjectID],
          });
          switch (traceData.InstanceState) {
            case 4:
              if (traceData.InstanceApproval === 1) {
                traceData.ApproveResult = 'agree';
              } else {
                traceData.ApproveResult = 'disagree';
              }
              break;
            case 5:
              traceData.ApproveResult = 'disagree';
              break;
            case 2:
            default:
              break;
          }
          return traceData;
        });
      }
    },
    async requestHomeData(appCode, solutionCode, appType) {
      const res = await getHomeDatas(appCode, solutionCode, appType);
      if (res.Successful && res.ReturnData.Result) {
        this.$store.state.isAPaaS = res.ReturnData.IsAPaaS;
        // 获取用户自定义报表
        this.allReportWidgets = res.ReturnData.ReportWidgets;
        this.reportWidgets = this.getReportSetting(true);
        this.favoriteNodes = res.ReturnData.FavoriteNodes;
        // 用户自定义常用表单
        this.isCustomFavoriteNodes = res.ReturnData.IsCustomFavoriteNodes;
        // 常用表单 tips
        const tipKey = `homeTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
        this.showTip = !(localStorage.getItem(tipKey));
      } else {
        this.isCustomFavoriteNodes = false;
      }
    },
    async urge(instanceId, content) {
      await urge(instanceId, content);
    },
    async changeRemindState(instanceId) {
      const res = await changeInstanceRemindState(instanceId);
      if (res.Successful) {
        this.requestWorkflowTraces();
      }
    },
    async goToSingleFormPage(schemaCode) {
      const data = await getLastBizObjectIdBySchema(schemaCode);
      if (data.Successful) {
        const objectId = data.ReturnData.Data.BizObjectId;
        this.$router.push({
          name: 'formPage',
          params: {
            schemaCode,
            bizObjectId: objectId,
            showList: false,
          },
        });
      } else {
        this.$router.push({
          name: 'formPage',
          params: { schemaCode, showList: false },
        });
      }
    },
    /* */
    urgeTrace(item) {
      const content = `${this.$store.state.UserInfo.userName}的${item.DisplayName}`;
      if (isDingtalk) {
        this.postDing(content, item);
      } else {
        this.urge(item.InstanceId, content);
      }
    },
    postDing(content, item) {
      const that = this;
      const dingUsers = []; // 可以为空
      if (item.Participants) {
        for (const participant of item.Participants) {
          const dingtalkAccount = participant.DingTalkAccount;
          if (dingtalkAccount) {
            dingUsers.push(dingtalkAccount.substring(0, dingtalkAccount.indexOf('.')));
          }
        }
      }
      const text = '请您尽快处理！';
      const title = '任务催办通知';
      const hostAddress = `${window.location.protocol}//${window.location.host}`;
      const corpId = this.$store.state.corpId;
      let url = null; // 打开流程的链接
      if (this.$store.state.suitekey) {
        // ISV接入
        url = `${hostAddress}/index.html?corpid=${corpId}&MessageType=Urge&suitekey=${this.$store.state.suitekey}&SchemaCode=${item.WorkflowCode}&BizObjectId=${item.BizObjectId}&appid=${item.AppCode}`;
      } else {
        // 企业接入
        url = `${hostAddress}/index.html?corpid=${corpId}&MessageType=Urge&agentid=${this.$store.state.agentId}&SchemaCode=${item.WorkflowCode}&BizObjectId=${item.BizObjectId}&appid=${item.AppCode}`;
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
          return true;
        },
        () => { },
      );
    },
    requestLatestData() {
      this.requestWorkflowTraces(this.appCode, this.solutionCode, this.appType);
      this.requestApproveItems(this.appCode, this.solutionCode, this.appType);
    },
    /* */
    openAssistForm(item) {
      this.$store.state.childRenderedLen = 0;
      this.$store.state.gridChildLen = 0;
      this.initSmartFormControls();
      this.$set(item, 'hideHeadbadge', true);
      this.$router.push({
        name: 'formPage',
        params: {
          bizObjectId: item.BizObjectId,
          schemaCode: item.SchemaCode,
          workflowCode: item.WorkflowCode,
          workItemId: item.ObjectID,
          // instanceId: item.InstanceId,
          mode: 'Edit',
        },
      });
    },
    openTraceForm(item) {
      if (item.InstanceState !== 2) {
        this.changeRemindState(item.InstanceId);
      }
      this.$set(item, 'hideHeadbadge', true);
      this.$router.push({
        name: 'formPage',
        params: {
          bizObjectId: item.BizObjectId,
          schemaCode: item.WorkflowCode,
          workflowCode: item.WorkflowCode,
          // instanceId: item.InstanceId,  // 这个地方加上这个参数会导致发起人能够看到其没权限看到的字段
          originator: item.Originator,
        },
      });
    },
    openFormPage(app) {
      if (!app.BeCreated) {
        H3PluginDeveloper.IShowTip('提示', '没有权限');
        return;
      }
      if (app.MenuType === 'SingletonModule') {
        // 表单列表
        this.goToSingleFormPage(app.SchemaCode);
      } else {
        this.$store.state.childRenderedLen = 0;
        this.$store.state.gridChildLen = 0;
        // 进入表单页面之前把smartform之前存的表单控件清空
        this.initSmartFormControls();
        const code = app.SchemaCode;
        this.$router.push({
          name: 'formPage',
          params: { schemaCode: code },
          query: { schemaCode: code },
        });
      }
    },
    openMyAplication() {
      this.$router.push('myapplication');
    },
    hideTip() {
      this.showTip = false;
      const tipKey = `homeTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
      localStorage.setItem(tipKey, true);
    },
    hideReportTip() {
      const reportTipKey = `reportTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
      localStorage.setItem(reportTipKey, true);
    },
    afterSwipeAssist(index) {
      const swipeItem = this.approveItems[index];
      if (swipeItem) {
        this.assistBadgeRecord[swipeItem.ObjectID] = true;
      }
    },
    afterSwipeTrace(index) {
      const swipeItem = this.traces[index];
      if (swipeItem) {
        this.traceBadgeRecord[swipeItem.BizObjectID] = true;
      }
    },
    manageCardSetting() {
      const reportTipKey = `reportTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
      localStorage.setItem(reportTipKey, true);
      this.reportToolTipShow = false;
      this.$router.push({ name: 'customsetting', params: {} });
    },
    manageFavoriteSetting() {
      if (this.isCustomFavoriteNodes === null) return;
      if (this.showTip) {
        this.hideTip();
      }
      this.$router.push({ name: 'favoriatesetting', params: {} });
    },
    getReportTipShowStaus() {
      const reportTipKey = `reportTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
      this.reportToolTipShow = !localStorage.getItem(reportTipKey);
    },
    getCustomSetting() {
      const defaultCardComponents = ['assist', 'trace'];
      const customCardSettingKey = this.$store.state.customCardSettingKey;
      const customSettingStr = window.localStorage.getItem(customCardSettingKey) || '{}';
      this.customSetting = JSON.parse(customSettingStr);
      this.cardComponents = this.customSetting.cards || defaultCardComponents;
      this.reportWidgets = this.getReportSetting(false);
    },
    getReportSetting(dataLoad) {
      let reportWidgets = [];
      const allReports = this.allReportWidgets;
      if (allReports && allReports.length > 0) {
        const localReports = this.customSetting.reports;
        if (localReports) {
          const newLocalReports = {};
          let hasNewReport = false;
          for (let i = 0; i < allReports.length; i += 1) {
            const report = allReports[i];
            let mapVal = localReports[report.ReportWidgetId];
            if (mapVal === undefined) { // 在本地缓存中查不到，这是个新的报表
              hasNewReport = true;
              mapVal = false;
            } else if (mapVal) { // true 用户自定义配置了这个报表
              reportWidgets.push(report);
            }
            // 刷新本地配置数据，排除在后台中删除的报表，添加新增的报表
            // 保证前后台报表数据同步
            newLocalReports[report.ReportWidgetId] = mapVal;
          }
          this.customSetting.reports = newLocalReports;
          reportWidgets = reportWidgets.sort((a, b) => {
            const aIndex = localReports[a.ReportWidgetId];
            const bIndex = localReports[b.ReportWidgetId];
            return aIndex - bIndex;
          });
          // 第一次数据加载
          if (dataLoad && reportWidgets.length > 0) {
            // 存储本地存储数据
            window.localStorage.setItem(
              this.$store.state.customCardSettingKey,
              JSON.stringify(this.customSetting),
            );
            // 显示提示框
            if (hasNewReport) {
              this.reportToolText = '有新的报表待添加';
              this.reportToolTipShow = true;
              this.reportToolBtn = [{
                name: '添加',
                action: this.manageCardSetting,
                cutline: true,
              }];
            }
          }
        } else {
          reportWidgets = allReports.slice(0, 5);
        }
      }
      return reportWidgets;
    },
    viewApp(node) {
      if (node.MenuType === 'SingletonModule') {
        // 表单列表
        this.goToSingleFormPage(node.SchemaCode);
      } else {
        this.$router.push({
          name: 'list',
          params: { schemaCode: node.Code || node.SchemaCode, appName: node.DisplayName, appCode: node.AppCode },
        });
      }
    },
    viewReport(reportId, reportWIdgetId) {
      this.$router.push({
        name: 'report',
        params: { reportId, widgetId: reportWIdgetId },
      });
    },
    // 初始化smartform里面的controls和自定义代码函数
    initSmartFormControls() {
      const dataFields = Object.keys(smartForm.controls);
      if (dataFields && dataFields.length > 0) {
        for (const dataField of dataFields) {
          delete smartForm[dataField];
        }
        smartForm.controls = {};
      }
      smartForm.components = [];
      smartForm.mappingControlsVal = {};
      Object.assign(smartForm, {
        OnLoad() { },
        OnLoadActions() { },
        OnValidate() {
          return true;
        },
        BeforeSubmit() { },
        AfterSubmit() { },
      });
    },
    goBack() {
      const $modal = $('.h3-modal-container');
      const $button = $('.h3-modal-button');
      const modalStyle = $modal.css('display');
      if (modalStyle !== 'none') {
        $button.click();
      } else {
        closeApp();
      }
    },
    appExpireed(goodsCode) {
      if (goodsCode) {
        const corpId = this.$store.state.corpId || '$CORPID$';
        this.$h3.modal.show({
          title: '超期提醒',
          maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
          content: `<div style="text-align:left">尊敬的用户，氚云平台使用权<span style="color:red">已到期</span>到期，为避免应用过期导致数据丢失，请及时购买续费，或拨打客服电话: 4000-899-893咨询
                    <p style="color:rgba(0,0,0,0.65);margin-top:5px">咨询客服服务时间：周一至周五 上午9:00 - 12:00 下午 13:30 - 18:00</p></div>`,
          type: 'alert',
          actions: [
            {
              text: '立即续费',
              onPress() {
                const payUrl = 'https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&' +
                  `goodsCode=${goodsCode}&corpId=${corpId}`;
                if (isDingtalk) {
                  openLink(payUrl);
                } else {
                  window.location.href = payUrl;
                }
              },
            },
          ],
        });
      } else {
        this.$h3.modal.show({
          title: '超期提醒',
          maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
          content: `<div style="text-align:left">尊敬的用户，氚云平台使用权<span style="color:red">已到期</span>到期，为避免应用过期导致数据丢失，请及时购买续费，或拨打客服电话: 4000-899-893咨询
                    <p style="color:rgba(0,0,0,0.65);margin-top:5px">咨询客服服务时间：周一至周五 上午9:00 - 12:00 下午 13:30 - 18:00</p></div>`,
          type: 'alert',
          actions: [{
            text: '立即咨询',
            onPress: () => {
              const payUrl = 'https://www.sobot.com/chat/h5/index.html?sysNum=ba53512829e343058872e7c2ab942a7e&color=0f92ed&lan=cn&invite=0&unreadcount=0';
              if (isDingtalk) {
                openLink(payUrl);
              } else {
                window.location.href = payUrl;
              }
            },
          }],
        });
      }
    },
    appExpireWarn(goodsCode) {
      if (goodsCode) {
        const corpId = this.$store.state.corpId || '$CORPID$';
        this.$h3.modal.show({
          title: '温馨提醒',
          maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
          content: `<div style="text-align:left">尊敬的用户，氚云平台使用权将于<span style="color:red">${window.GlobalConfig.expireDate}</span>到期，为避免影响正常使用，请及时购买续费，或拨打客服电话: 4000-899-893咨询
                    <p style="color:rgba(0,0,0,0.65);margin-top:5px">咨询客服服务时间：周一至周五 上午9:00 - 12:00 下午 13:30 - 18:00</p></div>`,
          type: 'alert',
          actions: [
            {
              text: '取消',
              onPress: () => { },
            },
            {
              text: '立即续费',
              onPress: () => {
                const payUrl = 'https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&' +
                  `goodsCode=${goodsCode}&corpId=${corpId}`;
                if (isDingtalk) {
                  openLink(payUrl);
                } else {
                  window.location.href = payUrl;
                }
              },
            }],
        });
      } else {
        this.$h3.modal.show({
          title: '温馨提醒',
          maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
          content: `<div style="text-align:left">尊敬的用户，氚云平台使用权将于<span style="color:red">${window.GlobalConfig.expireDate}</span>到期，为避免影响正常使用，请及时购买续费，或拨打客服电话: 4000-899-893咨询
                    <p style="color:rgba(0,0,0,0.65);margin-top:5px">咨询客服服务时间：周一至周五 上午9:00 - 12:00 下午 13:30 - 18:00</p></div>`,
          type: 'alert',
          actions: [
            {
              text: '取消',
              onPress: () => { },
            },
            {
              text: '立即续费',
              onPress: () => {
                const payUrl = 'https://www.sobot.com/chat/h5/index.html?sysNum=ba53512829e343058872e7c2ab942a7e&color=0f92ed&lan=cn&invite=0&unreadcount=0';
                if (isDingtalk) {
                  openLink(payUrl);
                } else {
                  window.location.href = payUrl;
                }
              },
            }],
        });
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$store.state.excludeComp = [];
    hideRightMenu();
    if (to.name === 'favoriatesetting') {
      if (this.isCustomFavoriteNodes) {
        this.$store.state.favoriteFunctions = this.favoriteNodes;
      } else if (this.favoriteNodes.length === 0) {
        this.$store.state.noApps = true;
      }
    }
    if (to.name === 'customsetting') {
      this.$store.state.reportWidgets = this.allReportWidgets;
    }
    next();
  },
};
</script>
<style lang="less" scoped>
@import "../../assets/css/home.less";
.manage-favorite {
  margin: -10px 0;
  padding: 10px 0 10px 20px;
}
</style>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.hasPaddingTop {
  .px2rem(top, 98);
}
.commapp-container {
  .px2rem(min-height, 180);
}
.empty-row {
  .px2rem(padding-top, 158);
  .px2rem(padding-bottom, 158);
  div {
    text-align: center;
    &.message {
      .px2rem(margin-top, 46);
      .px2rem(font-size, 24);
    }
    span {
      .px2rem(font-size, 48);
    }
  }
}
.h3-title-tip .tip {
  z-index: 999 !important;
  .px2rem(width, 690);
}
.manage-favorite {
  margin: -10px 0;
  padding: 10px 0 10px 20px;
}
.wrapper {
  -webkit-overflow-scrolling: touch;
  transform: translated3d(0, 0, 0);
  -ms-transform: translated3d(0, 0, 0);
  -moz-transform: translated3d(0, 0, 0);
  -webkit-transform: translated3d(0, 0, 0);
  .trace-home {
    .px2rem(margin-top, 32) !important;
  }
}

.add-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  .px2rem(margin-bottom, 20);
  .bd-lrtb span {
    .px2rem(font-size, 34);
  }
}
.title-home-custom {
  .h3-icon {
    transform: translateY(1px);
  }
  .title-size {
    font-weight: 500;
    color: #333;
  }
}
.h3-icon-button .item-icon-default .h3-icon-24 {
  height: auto !important;
  transform: translateX(-1px);
}

.attachment-limit-wrapper {
  .h3-modal-popup {
    left: 11%;
    width: 78%;
    .px2rem(top, 140);
    box-sizing: border-box;

    .h3-modal-content {
      .px2rem(border-radius, 14);
    }
  }
}
</style>
