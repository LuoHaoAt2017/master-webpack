<template>
  <div class="home-reports">
    <template v-if="showCustomCards">
      <template v-for="report in customCards">
        <report-card
          v-if="!report.IsChart3"
          :key="report.ReportWidgetId"
          :report="report"
          :ready="loadReport"
          cardType="home"
        >
        <!--template slot="mask">
          <div class="backdropcontent">
            <p>{{$store.state.UserInfo.isAdministrator?'登录电脑端应用管理':'请联系公司系统管理员'}}</p>
            <p>将“报表配置到移动端首页”</p>
            当前表单无数据，默认显示示例卡片<br><br>
            示例卡片隐藏后，若有表单数据产生，会默认为你展示 -->
          <!-- </div> -->
          <!-- <div class="backdropBtn"> -->
          <!-- <span @click="hideAllReprot(report)">隐藏全部示例</span> -->
          <!-- <span @click="hideThisReport(report)">隐藏该示例</span> -->
          <!-- <span class="dp-font30" @click="hideThisMask(report)">我知道了</span> -->
          <!-- </div> -->
        <!-- </template> -->
        </report-card>
        <div
          v-else
          :key="report.ReportWidgetId"
          class="report-content-new"
        >
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
    <h3-card
      v-else
      :hasBodyContent="true"
      class="report-demo-card"
      :isDemo="true"
      backDropHeight="100%"
      :showBackDrop="showDemoCardBackDrop"
      @onClickBody="onClickBody"
    >
      <template slot="headerTitle">
        <span class="report-card-title dp-font30">示例报表</span>
      </template>
      <div class="report-content">
        <img src="../../../assets/img/report-demo.png" />
      </div>
      <template slot="backdrop">
        <slot name="mask">
          <div class="backdropcontent">
            <p>{{ UserInfo.isAdministrator ? '登录电脑端应用管理' : '请联系公司系统管理员' }}</p>
            <p>将“报表配置到移动端首页”</p>
          </div>
          <div class="backdropBtn">
            <span class="dp-font30" @click="hideDemoMask()">我知道了</span>
          </div>
        </slot>
      </template>
    </h3-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace, State, Mutation } from 'vuex-class';
import { MDashboard } from '@h3/report';
import { MutationType } from '@/store/types';

import ReportCard from './report-card.vue';
import H3Card from '../../../../packages/widgets/h3-card-new/h3-card.vue';
// vuex-class module命名空间
const homeModule = namespace('Home');

@Component({
  components: {
    ReportCard,
    H3Card,
    H3SingleChart: MDashboard.SingleChart,
  },
})
export default class HomeReports extends Vue {
   @Mutation(MutationType.ToggleTabbarShow) toggleTabbarShow;

  @homeModule.State('customCards')
  customCards;

  @homeModule.Getter('showCustomCards')
  showCustomCards: boolean;

  @State('UserInfo')
  UserInfo;

  showDemoCardBackDrop: boolean = false;

  loadReport: boolean = true;

  onClickBody () {
    this.showDemoCardBackDrop = true;
  }

  hideDemoMask () {
    this.showDemoCardBackDrop = false;
  }

  onFullScreenChange (isFullScreen) {
    try {
      if (isFullScreen) {
        (document.querySelector('#home-page') as HTMLElement).style.bottom = '0px';
      } else {
        document.querySelector('#home-page').removeAttribute('style');
      }
    } catch (error) {

    }
    this.toggleTabbarShow(!isFullScreen);
  }

  deactivated () {
    this.toggleTabbarShow(true);
  }

  // mounted() {
  //   this.$nextTick(() => {
  //     const wrapper = document.querySelector('.main.wrapper');
  //     const clientTop = this.$el.getBoundingClientRect().top;
  //     this.clientHeight = wrapper.clientHeight;
  //     if (clientTop < this.clientHeight) {
  //       this.loadReport = true;
  //     } else {
  //       wrapper.addEventListener('scroll', this.onScroll);
  //     }
  //   });
  // },
  // activated() {
  //   const wrapper = document.querySelector('.main.wrapper');
  //   if (!this.loadReport && wrapper) {
  //     wrapper.addEventListener('scroll', this.onScroll);
  //   }
  // },
  // deactivated() {
  //   const wrapper = document.querySelector('.main.wrapper');
  //   if (!this.loadReport && wrapper) {
  //     wrapper.removeEventListener('scroll', this.onScroll);
  //   }
  // },
  // onScroll() {
  //   const wrapper = document.querySelector('.main.wrapper');
  //   const clientTop = this.$el.getBoundingClientRect().top;
  //   if (clientTop < this.clientHeight) {
  //     this.loadReport = true;
  //     wrapper.removeEventListener('scroll', this.onScroll);
  //   }
  // },
  // hideAllReprot(curReport) {
  //   this.$set(curReport, 'showCardBackDrop', false);
  //   const demoReports = this.customCards.filter(reportItem => (reportItem.isDemo));
  //   for (let i = 0; i < demoReports.length; i += 1) {
  //     const demoReport = demoReports[i];
  //     if (demoReport.isDemo) {
  //       setTimeout(() => {
  //         this.$set(demoReport, 'RemoveAnimation', 'remove');
  //       }, 300);
  //       setTimeout(() => {
  //         this.$set(demoReport, 'hideCardReport', true);
  //         if (i === demoReports.length - 1) {
  //           this.$emit('onHideAllCard');
  //         }
  //       }, 1300);
  //     }
  //   }
  // },

  // hideThisReport(reportWidget) {
  //   this.$set(reportWidget, 'showCardBackDrop', false);
  //   setTimeout(() => {
  //     this.$set(reportWidget, 'RemoveAnimation', 'remove');
  //   }, 300);
  //   setTimeout(() => {
  //     this.$set(reportWidget, 'hideCardReport', true);
  //     this.$emit('onHideThisCard', reportWidget);
  //   }, 1300);
  // }
}
</script>
<style lang="less">
@baseFontSize: 75;
@baseThemeColor: #1890ff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.home-reports{
  background: #f5f7f9;
  .report-demo-card {
    .report-content {
      .px2rem(padding-top, 50);
      box-sizing: border-box;
      img {
        width: 100%;
      }
    }
  }
  .report-card-title{
    font-weight:600;
  }
  // .h3-dashboard-mobile__item--full{
  //   width:calc(100vh - env(safe-area-inset-bottom)) !important;
  // }
}
.report-content-new{
    .px2rem(height, 450);
    border-radius: 6px;
    margin-bottom: 0.4rem !important;
    .px2rem(margin-left,20);
    .px2rem(margin-right,20);
    box-shadow: 0 6px 28px 0 rgba(80, 119, 188, 0.11);
    .px2rem(border-radius,10);
    position: relative;
    .single-add{
      position: absolute;
      .px2rem(bottom,20);
      z-index: 100;
      width: 100%;
      right: 0;
      z-index: 100;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      background-color: rgba(255,255,255,0.5);
    }
    .h3-dashboard-mobile__item--full{
      width:calc(100vh - env(safe-area-inset-bottom)) !important;
    }
}
.backdropcontent{
  color: #333;
  p{
    .px2rem(font-size,30);
    .px2rem(line-height,48);
  }
}
.backdropBtn{
  span{
    border-top-color:#C4CAD9;
    color: #107FFF;
    .px2rem(height,100);
    .px2rem(font-size,28);
  }
}
</style>
