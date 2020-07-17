<template>
  <div :class="wrapCls">
      <h3-swiper dots-position="center"  :height="height"
                :show-dots='approveData.length >1' v-if="approveAssist.length > 0 || isDemo "
                v-model="approveIndex" @on-index-change="onSwiperChange" dots-class="dots-index">
        <h3-swiper-item  v-for="(item,index) in approveData" :key="index" v-if="index < 5" >
            <h3-card
              :has-body-content="true"
              :header-badge="!item.hideHeadbadge"
              :is-demo="isDemo"
              :approve-result="item.ApproveResult"
              :class-name="item.RemoveAnimation"
              @onClickBody="onClickBody(item)"
              body-class-name="min-body-height"
              back-drop-height="100%"
              :show-back-drop="showDemoBackDrop"
              ref='card'>
              <template slot="headerTitle">
                {{item.DisplayName}}
              </template>
              <template slot="headerExtra" >
                {{item.ReceiveTime}}
              </template>

              <h3-approve-sumary :approve-item="item" type="assist"></h3-approve-sumary>

              <template slot="footerContent">
                <div class="footerBtn">
                  <template v-if="!item.isHandle">
                    <span v-if="!item.hasResult" @click.stop="onDisAgree(item, index)">不同意</span>
                    <span v-if="!item.hasResult" @click.stop="onAgree(item, index)">同意</span>
                    <span v-if="item.hasResult && item.ApproveResult ==='disagree' " >审批不同意</span>
                    <span v-if="item.hasResult && item.ApproveResult ==='agree'" >审批同意</span>
                  </template>
                  <span v-else @click.stop="onHandle(item)">{{item.handleText}}</span>
                </div>
              </template>

              <template slot="backdrop">
                <div class="backdropcontent">
                  当前表单无数据，默认显示示例卡片<br><br>
                  示例卡片隐藏后，若有表单数据产生，会默认为你展示
                </div>
                <div class="backdropBtn">
                  <span @click="onReadDemo">我知道了</span>
                </div>
              </template>
            </h3-card>
        </h3-swiper-item>
      </h3-swiper>
   
    <h3-card :has-body-content="false"  v-if="!isDemo && approveAssist.length < 1">
        当前没有待审批的单据哦~
    </h3-card>
  </div>
</template>
<script>
// import { setTimeout } from 'timers';
import cx from 'classnames';
import { H3Swiper, H3SwiperItem } from '../../components/h3-swiper/index';
import H3Card from './h3-card.vue';
import H3ApproveSumary from '../h3-approve-trace/h3-approve-sumary.vue';

const prefixCls = 'h3-card-assist';
export default {
  name: 'h3-card-assist',
  components: {
    H3Swiper,
    H3SwiperItem,
    H3Card,
    H3ApproveSumary,
  },
  props: {
    className: String,
    H3Style: Object,
    approveAssist: {
      type: Array,
      default: () => [],
    },
    swiperHeight: {
      type: Number,
      default: 438,
    },
  },
  data() {
    return {
      approveIndex: 0,
      oldItemIndex: 0,
      showDemoBackDrop: false,
      withoutContent: false,
      hideHeadbadge: true,
      demoData: [
        {
          DisplayName: '刘鹏的采购结款申请',
          ItemSummary: '供应商: 东莞市博钺电子有限公司     ||付款人: 刘鹏||付款日期: 2017-12-11 ||本次应付总金额: 55927 ||本次实付额: 55927 ||',
          MobileDicData: [
            { 供应商: '东莞市博钺电子有限公司' },
            { 付款人: '刘鹏' },
            { 付款日期: ' 2017-12-11' },
            { 本次实付额: ' 55927 ' },
            { 银行账户: ' 007876688755 ' },
            { 付款事由: ' 采购 ' },
            { 本次实付额: ' 55927 ' },
            { 本次实付额: ' 55927 ' },
          ],
          ReceiveTime: '2017/12/11 19:27:43',
        },
      ],
    };
  },
  methods: {
    onClickBody(item) {
      if (this.isDemo) {
        this.showDemoBackDrop = true;
      } else {
        this.$emit('onClickContent', item);
      }
    },
    onReadDemo() {
      this.$emit('RequestLatestData');
      this.isDemo = false;
      this.demoData = [];
      this.$set(this.approveData, this.approveAssist);
      this.approveData = this.approveAssist;
      this.showDemoBackDrop = false;
    },
    onDisAgree(item, index) {
      if (this.isDemo) { return; }
      // this.$emit('RequestLatestData');
      this.$emit('onDisAgree', item);
      this.$set(item, 'hasResult', true);
      this.$set(item, 'ApproveResult', 'disagree');
      setTimeout(() => {
        this.$set(item, 'RemoveAnimation', 'remove');
      }, 300);
      setTimeout(() => {
        this.approveData = this.approveAssist.splice(index, 1);
        this.isLastItem();
      }, 1300);
    },
    onAgree(item, index) {
      if (this.isDemo) { return; }
      // this.$emit('RequestLatestData');
      this.$emit('onAgree', item);
      this.$set(item, 'hasResult', true);
      this.$set(item, 'ApproveResult', 'agree');
      setTimeout(() => {
        this.$set(item, 'RemoveAnimation', 'remove');
      }, 300);
      setTimeout(() => {
        this.approveData = this.approveAssist.splice(index, 1);
        this.isLastItem();
      }, 1300);
    },
    onHandle(item) {
      this.$emit('onHandle', item);
    },
    isLastItem() {
      if (this.approveAssist.length === 0) {
        this.demoData = [];
      }
    },
    onSwiperChange(index) {
      this.$emit('onSwiperChange', index);
      if (this.approveAssist[this.oldItemIndex] === undefined) { return; }
      this.approveAssist[this.oldItemIndex].hideHeadbadge = true;
      this.oldItemIndex = index;
    },
  },
  computed: {
    withoutApproveData() {
      return this.approveAssist === undefined || this.approveAssist.length < 1;
    },
    approveData: {
      get() {
        return this.approveAssist.length > 0 ? this.approveAssist : this.demoData;
      },
      set() {
      },
    },
    isDemo: {
      get() {
        return this.approveData.length > 0 && this.withoutApproveData;
      },
      set() {
      },
    },
    wrapCls() {
      return cx(prefixCls, this.className);
    },
    height() {
      let realHeightWithDots = (this.swiperHeight + 46) / 75;
      let realHeightWithoutDots = (this.swiperHeight + 20) / 75;
      // return this.approveData.length > 1
      //   ? realHeightWithDots + 'rem'
      //   : realHeightWithoutDots + 'rem';
      return realHeightWithDots + 'rem';
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';
@import '../../styles/h3-ui/h3-card';
</style>


