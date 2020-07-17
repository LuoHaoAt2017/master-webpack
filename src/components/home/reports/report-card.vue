<template>
<!-- lbb修改代码规范 -->
  <div class="report-card">
    <h3-card
      :has-body-content="true"
      :is-demo="isDemo"
      class-name="report-card"
      :class="removeAnimation"
      @onClickBody="onClickBody"
      :back-drop-height="backDropHeight"
      :show-back-drop="showCardBackDrop">
      <template slot="headerTitle">
        <span class="aufont report-card-icon" v-if="cardType === 'custom'" :style="{color:iconColor}" :class="widgetIcon"></span>
        <span class="report-card-title dp-font30">{{report.ReportWidgetName}}</span>
      </template>
      <div class="report-content" ref="container"></div>
      <template slot="backdrop">
        <slot name="mask"></slot>
      </template>
    </h3-card>
  </div>
</template>
<script>
import '../../../lib/reports/Chart';
import '../../../lib/reports/ChartBase-mobile';
import '../../../lib/reports/excanvas.min';
import '../../../lib/reports/jquery.dataTables.min';
import '../../../lib/reports/ReportViewManagerMobile';
import { loadHomeReportWidget } from '../../../service/get-data';
import H3Card from '../../../../packages/widgets/h3-card-new/h3-card.vue';
import {
  FilterType,
  TimeTransport,
  NumberTransport,
  isiOS,
  isDingtalk,
  h3AutoHide,
  includeLanscape,
  sliderbuild,
} from '../../../config/common';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';

export default {
  props: {
    report: {
      type: Object,
      required: true,
    },
    cardType: String,
    ready: {
      type: Boolean,
      default: true,
    },
    iconColor: String,
  },
  components: {
    H3Card,
  },
  data() {
    return {
      removeAnimation: '',
      showCardBackDrop: false,
      isDemo: false,
      colors: ['#4DA9EB', '#00B25E', '#F19333', '#F06065', '#5C7197', '#9D88BF'],
      reportWidget: null,
    };
  },
  created() {
    this.showCardBackDrop = this.cardType === 'custom';
  },
  mounted() {
    this.$nextTick(() => {
      // 控制报表卡片，在ready时渲染
      if (this.ready) {
        this.renderReport(this.report.ReportId, this.report.ReportWidgetId, this.$refs.container);
      } else {
        const unwatch = this.$watch('ready', (val) => {
          if (val) {
            this.renderReport(
              this.report.ReportId,
              this.report.ReportWidgetId,
              this.$refs.container,
            );
            unwatch();
          }
        });
      }
    });
  },
  methods: {
    async renderReport(reportId, reportWidgetId, reportContainer) {
      let data = await loadHomeReportWidget(reportId, reportWidgetId);
      if (data.Successful) {
        const reportFilters = data.ReturnData.ReportFilters;
        data = data.ReturnData.Data;
        this.reportWidget = data.ReportWidget;
        const reportPageCode = data.ReportPageCode;
        const color = this.colors[Math.ceil(Math.random() * 6)];
        const manager = new ReportViewManager(null, reportContainer, reportPageCode, true);
        const filterValues = {};
        if(reportFilters != null && reportFilters.length > 0){
          for (const filter of reportFilters) {
            const ColumnCode = filter.ColumnCode;
            const FilterValue = filter.FilterValue;
            // const DisplayName = filter.DisplayName;
            const myfiltertype = filter.FilterType;
            const ColumnType = filter.ColumnType;
            const defaultValue = filter.DefaultValue;
            if (myfiltertype === FilterType.Organization) {
              switch (FilterValue) {
                case '1':
                  filterValues[ColumnCode] = [this.$store.state.UserInfo.userId];
                  break;
                case '2':
                  filterValues[ColumnCode] = [this.$store.state.UserInfo.userParent];
                  break;
                case '3':
                  filterValues[ColumnCode] = [];
                  break;
                default:
                  break;
              }
            } else if (myfiltertype === FilterType.DateTime) {
              const TimeValue = TimeTransport(FilterValue);
              filterValues[ColumnCode] = TimeValue;
            } else if (myfiltertype === FilterType.Numeric) {
              filterValues[ColumnCode] = NumberTransport(FilterValue);
            } else if (
              myfiltertype === FilterType.FixedValue ||
              ColumnType === 5 ||
              myfiltertype === FilterType.MasterData ||
              myfiltertype === FilterType.Boolean
            ) {
              filterValues[ColumnCode] = [defaultValue];
            } else {
              filterValues[ColumnCode] = [FilterValue || defaultValue];
            }
          }
        }
        manager.GetReport(
          H3PluginDeveloper.IClone(filterValues), this.reportWidget,
          null, null, true, this, null, color,
          (isDemo) => {
            this.isDemo = isDemo;
          },
        );
      }
    },
    onClickBody() {
      // if (this.cardType === 'home') {
      //   this.showCardBackDrop = true;
      //   return;
      // }
      this.$router.push({
        name: 'report',
        params: {
          reportCode: this.report.ReportId,
          widgetId: this.report.ReportWidgetId,
          currentWidget: this.reportWidget,
        },
      });
    },
  },
  computed: {
    widgetIcon() {
      const widgetCls = {
        0: 'icon-base-linechart', // 折线图
        1: 'icon-base-bar-graph', // 柱形图
        2: 'icon-base-pie-chart', // 饼状图
        4: 'icon-base-radar-chart', // 雷达图
        6: 'icon-base-funnel-plot', // 漏斗图
        9: 'icon-base-simple-kanban', // 简易看板
      };
      return widgetCls[this.report.WidgetType];
    },
    backDropHeight() {
      const typeHeights = {
        home: '100%',
        custom: '44px',
      };
      return typeHeights[this.cardType];
    },
  },
};
</script>
<style lang="less">
@import './style/ChartBase.css';
@import './style/report.less';
@baseFontSize: 75;
.px2rem(@name,@px) {
    @{name}: @px/@baseFontSize * 1rem;
}
.report-card{
  .px2rem(margin-bottom,30) !important;
  .h3-card-header-content{
    font-size: 0;
    .px2rem(height,45);
  }
  .report-card-icon{
    .px2rem(margin-right,16);
  }
  .report-card-title{
    display: inline-block;
    color: #333;
  }
  .h3-back-drop{
    .px2rem(border-bottom-left-radius,12);
    .px2rem(border-bottom-right-radius,12);
    background: #fff;
  }
  .h3-card{
    .px2rem(margin-left,20);
    .px2rem(margin-right,20);
    box-shadow: 0 6px 28px 0 rgba(80, 119, 188, 0.11);
    .px2rem(border-radius,10);
  }
}
</style>
