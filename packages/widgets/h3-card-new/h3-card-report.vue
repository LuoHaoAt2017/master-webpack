<template>
  <div :class="wrapCls">
    <h3-card
      :class-name="cardCls"
      :has-body-content="true"
      :header-badge="headerBadge"
      :is-demo="report.isDemo"
      :class="report.RemoveAnimation"
      @onClickBody="onClickBody(report)"
      :back-drop-height="backDropType"
      :show-back-drop="report.showCardBackDrop"
      v-if="!report.hideCardReport"
      v-for="report in reportWidgets"  :key="report.ReportWidgetId" :ref="report.ReportWidgetId">

      <template slot="headerTitle">
        <span v-if="backDropType === '25%'" :style="{color:report.iconColor}" :class="iconType(report.type)"></span>
        {{report.ReportWidgetName}}
      </template>
      <template slot="headerExtra">
        {{report.extra}}
      </template>

      <report :report-id="report.ReportId" :widget-id="report.ReportWidgetId" :ready="report.ready" @reportCallback="reportCallback($event, report)" v-if="report.ready"></report>
      
      <template slot="backdrop" v-if="backDropType === '25%'">
        <div class="backdropOneBtn" @click.stop="onClickAdd(report)">
          <span class=" aufont icon-base-plus-circle"></span>
          添加该卡片
        </div>
      </template>
      <template slot="backdrop" v-if="backDropType === '100%'">
        <div class="backdropcontent">
          当前表单无数据，默认显示示例卡片<br><br>
          示例卡片隐藏后，若有表单数据产生，会默认为你展示
        </div>
        <div class="backdropBtn">
          <span @click="hideAllReprot(report)">隐藏全部示例</span>
          <span @click="hideThisReport(report)">隐藏该示例</span>
        </div>
      </template>
    </h3-card>
  </div>
</template>
<script>
import cx from 'classnames';
import H3Title from '../h3-title/h3-title.vue';
import H3Card from './h3-card.vue';
import H3ToolTip from '../h3-tool-tip/h3-tool-tip.vue';
import report from '../../../src/components/reports/index.vue';


const prefixCls = 'h3-card-report';
export default {
  name: 'h3-card-report',
  components: {
    H3Title,
    H3Card,
    H3ToolTip,
    report,
  },
  props: {
    className: String,
    thumbStyle: Object,
    reportWidgets: Array,
    headerClassName: String,
    headerStyle: Object,
    headerBadge: {
      type: Boolean,
      default: false,
    },
    hasHeaderExtra: Boolean,
    bodyClassName: String,
    bodyStyle: Object,
    backDropType: {
      type: String,
      default: '100%',
    },
  },
  data() {
    return {
    };
  },
  methods: {
    onClickBody(item) {
      if (item.isDemo) {
        this.$set(item, 'showCardBackDrop', true);
      } else {
        this.$emit('onClickContent', item);
      }
    },
    onClickAdd(report) {
      this.$emit('onAddCard', report);
    },
    reportCallback(data, report) {
      this.$set(report, 'type', data.widgetType);
      this.$set(report, 'isDemo', data.isDemo);
    },
    hideAllReprot(curReport) {
      this.$set(curReport, 'showCardBackDrop', false);
      const demoReports = this.reportWidgets.filter(reportItem => (reportItem.isDemo));
      for (let i = 0; i < demoReports.length; i += 1) {
        const demoReport = demoReports[i];
        if (demoReport.isDemo) {
          setTimeout(() => {
            this.$set(demoReport, 'RemoveAnimation', 'remove');
          }, 300);
          setTimeout(() => {
            this.$set(demoReport, 'hideCardReport', true);
            if (i === demoReports.length - 1) {
              this.$emit('onHideAllCard');
            }
          }, 1300);
        }
      }
    },
    hideThisReport(report) {
      this.$set(report, 'showCardBackDrop', false);
      setTimeout(() => {
        this.$set(report, 'RemoveAnimation', 'remove');
      }, 300);
      setTimeout(() => {
        this.$set(report, 'hideCardReport', true);
        this.$emit('onHideThisCard', report);
      }, 1300);
    },
    iconType(type) {
      return cx('aufont', {
        'icon-base-linechart': type === 0, // 折线图
        'icon-base-bar-graph': type === 1, // 柱形图
        'icon-base-pie-chart': type === 2, // 饼状图
        'icon-base-radar-chart': type === 3, // 雷达图
        'icon-base-funnel-plot': type === 4, // 漏斗图
        'icon-base-simple-kanban': type === 5, // 简易看板
      });
    },
  },
  computed: {
    wrapCls() {
      return cx(prefixCls, this.className);
    },
    cardCls() {
      return cx(this.bodyClassName, {
        'home-report-card': this.backDropType === '100%',
        'setting-card-bottom': this.backDropType === '25%',
      });
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';
@import '../../styles/h3-ui/h3-card';
.common-report{
  // .px2rem(min-height,438) !important;
  // .px2rem(max-height,536) !important;
}
.home-report-card{
  .px2rem(margin-bottom,24) !important;
  .common-report
}
.setting-card-bottom{
  .px2rem(margin-bottom,24) !important;
  .common-report
}
</style>


