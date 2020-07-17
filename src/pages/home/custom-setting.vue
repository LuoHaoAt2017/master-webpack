<template>
  <layout :title="title" :leftOptions="{preventGoBack: true}" @on-click-back="confirmBeforeExit">
    <div
      id="custom-setting"
      v-if="hasReports"
      class="setting"
      :class="{'no-footer': !isShowFooter}"
    >
      <div ref="wrapper" class="main">
        <div>
          <template v-if="cardSetting && cardSetting.length > 0">
            <h3-title className="title-custom" size="xl" title="已添加的图形报表" />
          </template>
          <h3-sort-list :list="cardSetting" @onOrderChange="isEdited = true">
            <h3-sort-item
              v-for="(item,index) in cardSetting"
              :key="index"
              class="app-order-item custom-setting-item"
              :order="index"
              :enabled="true"
            >
              <span style="margin-right: 12px;">
                <h3-icon
                  type="minus-circle"
                  size="16"
                  style="color:red;"
                  @click.native="removeCard(item, index)"
                />
              </span>
              <h3-title
                className="title-custom-item"
                :iconSize="16"
                size="lg"
                :iconColor="item.iconColor"
                :iconType="item.icon"
                :title="item.displayName"
              />
            </h3-sort-item>
          </h3-sort-list>
          <template v-if="hasReports">
            <h3-title
              className="title-custom"
              style="margin-bottom: 0;"
              size="xl"
              title="未添加的图形报表"
            />
            <h3-title className="title-custom-tip" size="xs" title="以下图表点击【添加到首页】后，将会显示在首页" />
            <template v-for="(report,index) in allCards">
              <report-card
                v-if="!report.IsChart3"
                v-show="!report.added"
                :key="report.ReportWidgetId"
                ref="report.ReportWidgetId"
                :report="report"
                cardType="custom"
                :ready="!report.added"
                :iconColor="iconColors[index % 5]"
              >
                <template slot="mask">
                  <div class="backdropOneBtn dp-font26" @click.stop="addCard(report)">
                    <span class="aufont icon-base-plus-circle"></span>
                    添加到首页
                  </div>
                </template>
              </report-card>
              <div
                v-else
                v-show="!report.added"
                :key="report.uuid"
                class="report-content-new"
              >
                <div class="single-add">
                  <div class="backdropOneBtn dp-font26" @click.stop="addCard(report)">
                    <span class="aufont icon-base-plus-circle"></span>
                    添加到首页
                  </div>
                </div>
                <h3-single-chart
                  :corpId="report.corpId"
                  :reportId="report.ReportId"
                  :chartId="report.ReportWidgetId"
                  :config="report.config"
                  @full-screen="onFullScreenChange"
                />
              </div>
            </template>
          </template>
          <!-- <template v-else>
            <h3-title class-name="title-custom-tip" size="xs" :title="reportHintMsg"></h3-title>
            <div class="demo-report-card" v-for="imgUrl in demoReportUrls">
              <img style="width:100%" :src="imgUrl">
            </div>
          </template>-->
        </div>
      </div>
      <div v-if="isShowFooter" class="footer">
        <h3-button-group :buttonGroup="footerButtons" />
      </div>
    </div>
    <div v-else class="empty-cards">
      <img src="../../assets/img/empty-cards.png" />
      <p>暂无报表卡片，请{{ UserInfo.isAdministrator ? '登录电脑端配置' : '联系管理员配置' }}</p>
    </div>
  </layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { MDashboard } from '@h3/report';
import { State, namespace } from 'vuex-class';
// h3 widgets
import { h3SortList, h3SortItem } from '../../../packages/widgets/h3-sort-list';
import H3Title from '../../../packages/widgets/h3-title/h3-title.vue';
// import H3Icon from '../../../packages/widgets/h3-icon/index.vue';
import { H3Icon } from '@h3/thinking-ui';
import H3ButtonGroup from '../../../packages/widgets/h3-button/h3-button-group2.vue';
// components
import ReportCard from '@/components/home/reports/report-card.vue';
import { HomeMutationType } from '@/store/modules/home/types';

const HomeModule = namespace('Home');
Component.registerHooks([
  'beforeRouteLeave',
]);

@Component({
  name: 'customsetting',
  components: {
    h3SortList,
    h3SortItem,
    H3Title,
    H3Icon,
    H3ButtonGroup,
    ReportCard,
    H3SingleChart: MDashboard.SingleChart,
  },
})
export default class CustomSetting extends Vue {
  @Prop()
  // 表示从首页进入自定义卡片，此时本地配置和卡片都已生成不需要重新读取
  fromHome: boolean;

  title: string = '自定义卡片';

  cardSetting: any[] = [];

  // allCards: (H3.Home.ReportItem & { added: boolean })[] = [];
  allCards: any = [];

  isEdited: boolean = false;

  demoReportTypes: string[] = ['折线图', '柱状图', '饼图', '雷达图', '漏斗图', '简易看板'];

  iconColors: string[] = ['#40A9FF', '#FFA940', '#FF6851', '#73D13D', '#36CFC9'];

  footerButtons: any = [];

  confirmActions: any = [];

  isShowFooter:boolean = true;

  @State('UserInfo')
  UserInfo;

  @HomeModule.State('ReportList')
  AllReportList: H3.Home.ReportItem[];

  @HomeModule.State('customCards')
  customCards;

  @HomeModule.State('customCardsSetting')
  customCardsSetting;

  @HomeModule.State('customCardsSettingKey')
  customCardsSettingKey: string;

  @HomeModule.Mutation(HomeMutationType.GetLocalCardSetting)
  getLocalCardSetting;

  created () {
    const self = this;
    this.footerButtons = [
      {
        action: 'cancel',
        type: 'default',
        title: '取消',
        size: 'lg',
        onClick () {
          self.confirmBeforeExit();
        },
      },
      {
        action: 'ok',
        title: '确定',
        size: 'lg',
        type: 'primary',
        onClick () {
          self.saveCustomSetting();
          // 手机卡的时候有的时候配置没刷新
          setTimeout(() => {
            self.$router.go(-1);
          }, 500);
        },
      },
    ];
    this.confirmActions = [
      {
        text: '不保存',
        onPress () {
          self.$router.go(-1);
        },
      },
      {
        text: '保存',
        onPress () {
          self.saveCustomSetting();
          // 手机卡的时候有的时候配置没刷新
          setTimeout(() => {
            self.$router.go(-1);
          }, 500);
        },
      },
    ];
  }

  activated () {
    this.isEdited = false;
    if (!this.fromHome) {
      this.getLocalCardSetting();
    }
    this.convertToSettingData();
  }

  onFullScreenChange (isFullScreen) {
    this.isShowFooter = !isFullScreen;
  }

  convertToSettingData () {
    const customSetting = this.customCardsSetting;
    this.cardSetting = this.customCards.map((card, index) => {
      // 是报表
      // if (card.ReportWidgetId) {
      const iconColor = this.iconColors[index % 5];
      return {
        icon: this.getIconType(card.WidgetType),
        iconColor,
        code: card.ReportWidgetId,
        displayName: card.ReportWidgetName,
        reportId: card.ReportId,
        widgetType: card.WidgetType,
      };
      // }
      // 是快速新增
      // return {
      //   icon: this.getIconType(0),
      //   iconColor: 'blue',
      //   code: 'RecentCreated',
      //   displayName: '快速新增',
      //   reportId: card.ReportId,
      //   widgetType: card.WidgetType,
      // };
    });
    this.allCards = this.AllReportList.map((item) => {
      const reportWidget = {
        ReportId: item.ReportId,
        ReportWidgetId: item.ReportWidgetId,
        ReportWidgetName: item.ReportWidgetName,
        WidgetType: item.WidgetType,
        added: customSetting ? customSetting[item.ReportWidgetId] : false,
        IsChart3: item.IsChart3,
        config: item.config,
        corpId: item.corpId,
      };
      return reportWidget;
    });
  }

  addCard (report) {
    const newAdded = {
      icon: this.getIconType(report.WidgetType),
      iconColor: this.iconColors[this.cardSetting.length % 5],
      code: report.ReportWidgetId,
      displayName: report.ReportWidgetName,
      reportId: report.ReportId,
      type: report.widgetType,
      ...report,
    };
    this.cardSetting.push(newAdded);
    this.$set(report, 'added', true);
    this.isEdited = true;
  }

  removeCard (item, index) {
    this.cardSetting.splice(index, 1);
    for (let i = 0; i < this.allCards.length; i += 1) {
      const reportItem = this.allCards[i];
      if (reportItem.ReportWidgetId === item.code) {
        this.$set(reportItem, 'added', false);
        break;
      }
    }
    this.isEdited = true;
  }

  confirmBeforeExit () {
    if (this.isEdited) {
      this.$h3.modal.show({
        content: '你的修改未保存，是否需要保存？',
        type: 'alert',
        actions: this.confirmActions,
      });
    } else {
      this.$router.go(-1);
    }
  }

  saveCustomSetting () {
    const setting = {};
    this.allCards.forEach((card) => {
      if (card.added) {
        setting[card.ReportWidgetId || card.WidgetId] =
          this.cardSetting.findIndex(item => item.code === (card.ReportWidgetId || card.WidgetId)) + 1;
      } else {
        setting[card.ReportWidgetId] = false;
      }
    });
    const customSetting = setting;
    const customCardSettingKey = this.customCardsSettingKey;
    window.localStorage.setItem(customCardSettingKey, JSON.stringify(customSetting));
    this.getLocalCardSetting();
  }

  getIconType (type) {
    const iconMap = {
      0: 'line-chart-o', // 折线图
      1: 'histogram-o', // 柱形图
      2: 'pie-chart-o', // 饼状图
      3: 'area-chart', // 面积图
      4: 'radar-chart-o', // 雷达图
      5: '', // 仪表盘
      6: 'funnel-plot-o', // 漏斗图
      7: 'list-o1', // 明细表
      8: 'list-o1', // 汇总表
      9: 'progress-o', // 简易看板
      10: 'stacked-chart-o', // 堆叠柱状图
      11: 'bar-chart-o', // 条形图
      12: 'fluoroscopy-o', // 透视图
      13: 'indicator-chart-o', // 指标图
      14: 'dot-chart', // 散点图
      15: 'biaxial-plot-o', // 双轴图
    };
    return iconMap[type] || 'line-chart-o';
  }

  beforeRouteLeave (to, from, next) {
    this.$store.state.excludeComp = ['customsetting'];
    this.isShowFooter = true;
    next();
  }

  get hasReports () {
    return this.AllReportList.length > 0;
  }
}
</script>

<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.h3-sort-list .h3-list-body {
  background-color: rgb(248, 248, 248);
}
.app-order-item {
  .px2rem(padding-left, 30);
  .h3-list-item .h3-list-line::after {
    content: " ";
    background-color: #eee !important;
  }
  .h3-list-content {
    .px2rem(font-size, 26) !important;
    .px2rem(line-height, 37) !important;
    .px2rem(padding-top, 30) !important;
    .px2rem(padding-bottom, 30) !important;
    display: flex;
    align-items: center;
  }
  &.custom-setting-item .h3-list-line .h3-list-extra{
    flex:none;
  }
}
.empty-cards {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
  }
  p {
    color: #666666;
    .px2rem(font-size, 30);
  }
}
#custom-setting {
  height: 100%;
  width: 100%;
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  &.no-footer .main{
    bottom: 0;
  }
  .main {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 44px;
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #f5f7f9;
  }
  .report-hint {
    color: #999;
    font-size: 12px;
  }
  .demo-report-card {
    .px2rem(margin-top, 32);
    .px2rem(margin-left, 30);
    .px2rem(margin-right, 30);
    .px2rem(width, 690);
  }

  .h3-button-group-primary{
    background: #FFFFFF;
    color: #107fff;
    border-left-color: #ddd !important;
  }
}
.title-custom {
  .px2rem(line-height, 40);
  color: #333;
  .px2rem(margin-top, 32);
  .px2rem(margin-bottom, 32);
  span {
    .px2rem(height, 40);
    .px2rem(line-height, 40);
  }
  .title-size {
    margin-left: 0;
  }
  .title-size-xl {
    font-weight: 500;
  }
}
.title-custom-tip {
  .px2rem(margin-top, 8);
  .px2rem(margin-bottom, 24);
  .title-size {
    margin-left: 0;
  }
}
.title-custom-item {
  margin-left: 0 !important;
  .title-size {
    .px2rem(margin-left, 24);
  }
}
</style>
