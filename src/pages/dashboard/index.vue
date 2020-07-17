<template>
  <layout
    :title="title"
    :leftOptions="{preventGoBack: true}"
    @on-click-back="goBack"
  >
    <div :class="prefixCls">
      <h3-report-mobile
        :corpId="corpId"
        :reportId="reportId"
        :config="config"
      />
    </div>
  </layout>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import options from '@h3/report/dist/options';
import { MDashboard } from '@h3/report';
import { instance } from '@/light-app/service/report-fetch';
import { getCookie } from '../../config/common';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { closeApp } from '../../config/dingtalk-interface';
import ReportOrg from './filter-comp/report-org.vue';

options.integrateComponents = (field: any) : any | null => {
  let components: any = null;
  switch (field.dataType) {
    case 26:
    case 27:
    case 260:
    case 261:
    case 270:
    case 271:
      components = ReportOrg;
      break;
  }
  return components;
};

options.axios = instance;
options.message = {
  success: H3PluginDeveloper.IShowSuccess,
  error: H3PluginDeveloper.IShowError,
  info: H3PluginDeveloper.IShowSuccess,
  warning: H3PluginDeveloper.IShowWarn,
};

Component.registerHooks(['beforeRouteLeave']);
@Component({
  name: 'Dashboard',
  components: {
    H3ReportMobile: MDashboard,
    ReportOrg,
  },
})
export default class Dashboard extends Vue {
  @State('UserInfo')
  UserInfo: H3.Common.UserInfo;

  prefixCls = 'h3-report-pro-test';

  // 仪表盘ID
  reportId:string = '';

  // 仪表盘配置
  config: any = {
    token: '',
    userId: '',
    version: '3.0',
  };

  corpId: string = '';

  get getAppCode () {
    return this.$route.query.AppCode || window.GlobalConfig.appCode;
  }

  get title () {
    const res = this.$route.params;
    if (res && res.displayName) {
      return res.displayName;
    }
    return window.GlobalConfig.solutionName;
  }

  created () {
    const res = this.$route.query;
    if (res && res.reportId) {
      this.reportId = res.reportId as string;
    } else {
      this.reportId = window.GlobalConfig.menuCode;
    }
    this.corpId = getCookie('h3_EngineCode') || '';
    this.config.token = getCookie('h3_Session');
    this.config.userId = this.UserInfo.userId;
  }

  beforeRouteLeave (to, from, next) {
    this.$store.state.excludeComp = ['dashboard'];
    this.$destroy();
    next();
  }

  goBack () {
    if (window.GlobalConfig.appRankType &&
     window.GlobalConfig.appRankType === 'DashBoard') {
      closeApp();
    } else {
      this.$router.replace({
        name: 'schemas',
        query: {
          appCode: this.getAppCode,
        },
      });
    }
  }
}
</script>

<style lang="less" scoped>
  html,body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .h3-report-pro-test{
    height: 100%;
    width: 100%;
  }
</style>
