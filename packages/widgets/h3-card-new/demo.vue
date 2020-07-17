<template>
    <div class="">
      <h3-card-menu :title-extra="favoriateArray"></h3-card-menu>
      <div class="card-item" v-if="false">
        <h3-title 
          title="审批助手"
          size="lg"
          iconDirection="left"
          iconType="cross"
          :iconAction="onClickIcon"
          iconColor="#6abf47">
          <template slot="extra" @click="onClickExtra">查看全部</template>
        </h3-title>
        <h3-card
          :has-body-content="!noContent"
          :header-badge="true"
          :is-demo="true">
          <template slot="headerTitle">
            张三的付款申请
          </template>
          <template slot="headerExtra">
            11:32
          </template>
          <template v-if="!noContent">
            <p class="testContent" v-for="(item,index) in extraArr" :key="index"> 
              {{item.title}} : {{item.value}}
            </p>
          </template>
          <template v-if="noContent">
            <h3-icon
              class="location-icon" 
              size='md' 
              color="#6abf47"
              type='cross'>
            </h3-icon>
            暂时还没有内容哦~
          </template>
          <template slot="footerContent">
            <h3-button-group :buttonGroup="buttonArray" ></h3-button-group>
          </template>
        </h3-card>
      </div>
      <div class="card-item" v-if="false">
        <h3-title 
          title="审批追踪"
          size="lg"
          iconDirection="left"
          iconType="cross"
          :iconAction="onClickIcon"
          iconColor="#6abf47">
          <template slot="extra" @click="onClickExtra">管理</template>
        </h3-title>
        <h3-swiper dots-position="center" :aspect-ratio='swiperHeight' :show-dots='approveTrace.length > 1'>
          <h3-swiper-item  v-for="(item,index) in approveTrace" :key="index">
              <h3-card
                :has-body-content="!noContent"
                :header-badge="true">
                <template slot="headerTitle">
                  我的报销申请
                </template>
                <template slot="headerExtra">
                  11:32
                </template>
                <template v-if="!noContent" >
                  <h3-approve-trace :approve-info="item"></h3-approve-trace>
                </template>
                <template v-if="noContent">
                  <h3-icon
                    class="location-icon" 
                    size='md' 
                    color="#6abf47"
                    type='cross'>
                  </h3-icon>
                  暂时还没有内容哦~
                </template>
                <template slot="footerContent">
                  <h3-button-group :buttonGroup="buttonArray2" ></h3-button-group>
                </template>
              </h3-card>
          </h3-swiper-item>
        </h3-swiper>
      </div>  
      <h3-title 
          title="审批追踪"
          size="lg"
          iconDirection="left"
          iconType="close"
          iconColor="#6abf47">
          <template slot="extra" @click="onClickExtra">查看全部</template>
      </h3-title>
      <h3-card-trace></h3-card-trace>

      <!-- <h3-card-report 
        title="图形报表" 
        tool-tip-content="这是管理员给你设置的" 
        :report-widgets="reportWidgets">
      </h3-card-report> -->
      <h3-icon-button :on-click="onClickIcon" type="default"></h3-icon-button>
      <h3-filter></h3-filter>
    </div>
</template>

<script>
import { H3Swiper, H3SwiperItem } from '../../components/h3-swiper/index';
import H3Title from '../h3-title/h3-title.vue';
import H3Icon from '../../components/h3-icon/index.vue';
import H3Button from '../h3-button/index.vue';
import H3ButtonGroup from '../h3-button/h3-button-group.vue';
import H3Card from './h3-card.vue';
import H3ApproveTrace from '../h3-approve-trace/h3-approve-trace.vue';
import H3IconButton from '../h3-button-icon/h3-button-icon.vue';
import H3ToolTip from '../h3-tool-tip/h3-tool-tip.vue';
import H3CardReport from './h3-card-report.vue';
import H3CardMenu from './h3-card-menu.vue';
import H3CardTrace from './h3-card-trace.vue';
import report from '../../../src/components/reports/index.vue';
import H3Filter from '../h3-filter/h3-filter.vue';

export default {
  components: {
    H3Swiper,
    H3SwiperItem,
    H3Title,
    H3Icon,
    H3Card,
    H3Button,
    H3ButtonGroup,
    H3ApproveTrace,
    H3CardTrace,
    H3IconButton,
    H3ToolTip,
    report,
    H3CardReport,
    H3CardMenu,
    H3Filter,
  },
  data() {
    return {
      swiperHeight: 0.62,
      noContent: false,
      favoriteNodes: [],
      reportWidgets: [
        {
          ReportId: 'c6c332df-c619-4dca-b702-f1d9d9517423',
          ReportWidgetId: 'e67e01b2-e78f-40a1-9e64-de8e4083edd0',
          ReportWidgetName: '本周销售开发',
        },
        {
          ReportId: '95a0de04-b1f2-41db-b216-6dbf83dedffa',
          ReportWidgetId: '129aff9a-ae75-41c0-8982-f8e6cbb5bad3',
          ReportWidgetName: '销售目标完成分析',
        },
        {
          ReportId: 'c6c332df-c619-4dca-b702-f1d9d9517423',
          ReportWidgetId: '212d48c2-4af3-4351-b973-44d2800102ea',
          ReportWidgetName: '本周成交推进',
        },
        {
          ReportId: '11c85406-c0a6-467b-8d79-a407472bf537',
          ReportWidgetId: '43379d75-2d4c-43f3-a582-5f76929007d9',
          ReportWidgetName: '出库总金额按日趋势图',
        },
        {
          ReportId: 'D000001Overview',
          ReportWidgetId: '98699d94-b18e-41eb-9351-80083c10a3c9',
          ReportWidgetName: '客户漏斗',
        },

      ],
      extraArr: [
        { title: '审批追踪', value: '第一个值' },
        { title: '常用应用', value: '第二个值' },
        { title: '常用应用', value: '第二个值' },
        { title: '常用应用', value: '第二个值' },
        { title: '常用应用', value: '第二个值' },
      ],
      buttonArray: [{
        title: '按钮一',
        type: '',
        size: '',
        onClick: this.onClickExtra,
      }, {
        title: '按钮二',
        type: '',
        size: '',
        onClick: this.onClickExtra,
      },
      ],
      buttonArray2: [{
        title: '发起流程',
        type: '',
        size: '',
        onClick: this.onClickExtra,
      },
      ],
      approveTrace: [
        {
          DisplayName: 'realTraceOne',
          ModifiedTime: '20:34',
          NodeName: '张三',
          Icon: 'https://cn.vuejs.org/images/bit.png',
          SpendTime: '666',
          IsLastNode: false,
        },
        {
          DisplayName: 'realTraceTwo',
          ModifiedTime: '20:34',
          NodeName: '小二',
          Icon: 'https://cn.vuejs.org/images/bit.png',
          SpendTime: '666',
          IsLastNode: false,
        },
      ],
      toolTip: [
        {
          name: '管理',
          action: this.onClickExtra,
        }, {
          name: '删除',
          action: this.onClickExtra,
        },
      ],
      favoriateArray: [
        {
          name: '管理',
          action: this.goFavoriateSetting,
        },
      ],
    };
  },
  created() {
  },
  activated() {
  },
  methods: {
    goFavoriateSetting() {
      // favoriate
      this.$router.push({ path: '/favoriate' });
    },
    onClickChange: () => { this.noContent = !this.noContent; },
    onClickIcon: () => { alert('this is icon click'); },
    onClickExtra: () => { console.log(this.reportWidgets); },
    onClickExtras: (index) => { console.log(index); },
  },
};
</script> 
<style lang="less" scoped>
@import '../../styles/mixins';

.testContent{
  .px2rem(font-size, 26);
  .px2rem(margin-bottom,8);
}
.vux-slider > .vux-swiper {
  .px2rem(height,438) !important;
}

</style>