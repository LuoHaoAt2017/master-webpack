<template>
  <div :class="wrapCls">
    <h3-swiper dots-position="center" :height='height'
    :show-dots='approveData.length >1' v-if="approveTrace.length > 0 || isDemo "
    v-model="approveIndex" @on-index-change="onSwiperChange" dots-class="dots-index">
      <h3-swiper-item  v-for="(item,index) in approveData" :key="index" v-if="index < 5">
          <h3-card
            :has-body-content="true"
            :header-badge="!item.hideHeadbadge"
            :is-demo="isDemo"
            :approve-result="item.ApproveResult"
            :class-name="item.RemoveAnimation"
            body-class-name="min-body-height"
            @onClickBody="onClickBody(item)"
            back-drop-height="100%"
            :show-back-drop="showDemoBackDrop">
            <template slot="headerTitle">
              {{'我的'+item.DisplayName}}
            </template>
            <template slot="headerExtra" >
              {{item.ModifiedTime}}
            </template>

            <h3-approve-trace :approve-info="item" v-if="!item.ApproveResult"></h3-approve-trace>
            <h3-approve-sumary :approve-item="item" type="trace" v-if="item.ApproveResult"></h3-approve-sumary>

            <template slot="footerContent">
              <div class="footerBtn">
                <span @click.stop="onPressToDo(item)" v-if="!item.ApproveResult">催办</span>
                <span @click.stop="onReadApproveResult(item, index)" v-if="item.ApproveResult">我知道了</span>
              </div>
            </template>

            <template slot="backdrop">
              <div class="backdropcontent">
                若你发起了流程可利用此卡片追踪审批进度
              </div>
              <div class="backdropBtn">
                <span @click="onReadDemo">我知道了</span>
              </div>
            </template>

          </h3-card>
      </h3-swiper-item>
    </h3-swiper>
    <h3-card :has-body-content="false"  v-if="!isDemo && approveTrace.length < 1">
        当前没有审批中的表单哦~
    </h3-card>
  </div>
</template>
<script>
import cx from 'classnames';
import { H3Swiper, H3SwiperItem } from '../../components/h3-swiper/index';
import H3Card from './h3-card.vue';
import H3ApproveTrace from '../h3-approve-trace/h3-approve-trace.vue';
import H3ApproveSumary from '../h3-approve-trace/h3-approve-sumary.vue';

const prefixCls = 'h3-card-trace';
export default {
  name: 'h3-card-trace',
  components: {
    H3Swiper,
    H3SwiperItem,
    H3Card,
    H3ApproveTrace,
    H3ApproveSumary,
  },
  props: {
    className: String,
    H3Style: Object,
    approveTrace: {
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
      hideHeadbadge: true,
      demoData: [
        {
          DisplayName: '示例采购记录',
          ModifiedTime: '22:34',
          PartcipantName: '张三',
          ProfilePhotoUrl: 'https://cn.vuejs.org/images/bit.png',
          SpendTime: '用时39分钟',
          IsLastNode: false,
          ApproveResult: '',
          ItemSumary: '',
          MobileDicData: [],
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
      this.$set(this.approveData, this.approveTrace);
      this.showDemoBackDrop = false;
    },
    onReadApproveResult(item, index) {
      this.$emit('onReadApproveResult', item);
      setTimeout(() => {
        this.$set(item, 'RemoveAnimation', 'remove');
      }, 300);
      setTimeout(() => {
        this.approveData = this.approveTrace.splice(index, 1);
        this.isLastItem();
      }, 1300);
    },
    onPressToDo(item) {
      this.$emit('onPressToDo', item);
    },
    hideDemoCard() {
      this.$emit();
      this.isDemo = false;
    },
    isLastItem() {
      if (this.approveTrace.length === 0) {
        this.demoData = [];
      }
    },
    onSwiperChange(index) {
      this.$emit('onSwiperChange', index);
      if (this.approveTrace[this.oldItemIndex] === undefined) { return; }
      this.approveTrace[this.oldItemIndex].hideHeadbadge = true;
      this.oldItemIndex = index;
    },
  },
  computed: {
    approveData: {
      get() {
        return this.approveTrace.length > 0 ? this.approveTrace : this.demoData;
      },
      set() {
      },
    },
    wrapCls() {
      return cx(prefixCls, this.className);
    },
    withoutApproveData() {
      return this.approveTrace === undefined || this.approveTrace.length < 1;
    },
    isDemo: {
      get() {
        return this.approveData.length > 0 && this.withoutApproveData;
      },
      set() {
      },
    },
    height() {
      let realHeight = (this.swiperHeight + 46) / 75;
      return realHeight + 'rem';
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';
@import '../../styles/h3-ui/h3-card';

.dots-index{
  bottom: 0px !important;
  a:first-child{
    margin-left: 0 !important;
  }
}
</style>


