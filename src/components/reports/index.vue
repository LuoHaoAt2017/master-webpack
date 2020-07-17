<template>
<!-- lbb修改代码规范 -->
    <div class="report-content" >

    </div>
</template>
<script>
import '../../lib/reports/Chart';
import '../../lib/reports/ChartBase-mobile';
import '../../lib/reports/excanvas.min';
import '../../lib/reports/jquery.dataTables.min';
import '../../lib/reports/ReportViewManagerMobile';
import { loadHomeReportWidget } from '../../service/get-data';

export default {
  props: {
    reportId: {
      type: String,
      required: true,
    },
    widgetId: {
      type: String,
      required: true,
    },
    ready: {
      type: Boolean,
    },
  },
  data() {
    return {
      colors: ['#4DA9EB', '#00B25E', '#F19333', '#F06065', '#5C7197', '#9D88BF'],
    };
  },
  mounted() {
    const self = this;
    this.$nextTick(() => {
      setTimeout(() => {
        self.renderReport(self.reportId, self.widgetId, self.$el);
      }, 10);
    });
  },
  methods: {
    async renderReport(reportId, reportWidgetId, reportContainer) {
      let data = await loadHomeReportWidget(reportId, reportWidgetId);
      if (data.Successful) {
        data = data.ReturnData.Data;
        const reportWidget = data.ReportWidget;
        const reportPageCode = data.ReportPageCode;
        const color = this.colors[Math.ceil(Math.random() * 6)];
        const manager = new ReportViewManager(null, reportContainer, reportPageCode, true);
        manager.GetReport(
          null, reportWidget,
          null, null, true, this, null, color,
          (isDemo) => {
            this.$emit('reportCallback', {
              isDemo,
            });
          },
        );
      }
    },
  },
};
</script>
<style lang="less">
@import './style/ChartBase.css';
@import './style/report.less';
div.report-content {
  position: relative;
  border-radius: 6px;
}
</style>
