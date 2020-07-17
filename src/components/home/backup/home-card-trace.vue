<template>
  <div :class="wrapCls">
    <h3-swiper dots-position="center" :height="swiperHeight"
    :show-dots='approveData.length >1' v-if="approveTrace.length > 0 || isDemo "
    v-model="approveIndex" @on-index-change="onSwiperChange" dots-class="dots-index">
      <h3-swiper-item  v-for="(item,index) in approveData" :key="index" v-if="index < 5">
          <h3-card
            class="swiper-card"
            :has-body-content="true"
            :header-badge="false"
            :is-demo="isDemo"
            :approve-result="item.ApproveResult"
            :instance-approval="item.InstanceApproval"
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
                <span @click.stop="onReadApproveResult(item, index)" v-if="item.ApproveResult && item.ApproveResult === 'agree'">我知道了</span>
                <span @click.stop="onReadFormDetail(item)" v-if="item.ApproveResult && item.ApproveResult === 'disagree'">了解详情</span>
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
    <h3-card :has-body-content="false" class='trace-empty-card' v-if="!isDemo && approveTrace.length < 1">
        当前没有审批中的表单哦~
    </h3-card>
  </div>
</template>
<script>
import cx from 'classnames';
import { H3Swiper, H3SwiperItem } from '../../../packages/components/h3-swiper/index';
import H3Card from '../../../packages/widgets/h3-card-new/h3-card';
import H3ApproveTrace from './home-approve-trace';
import H3ApproveSumary from './home-approve-sumary';

const prefixCls = 'home-card-trace';
export default {
  name: 'home-card-trace',
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
  },
  data() {
    return {
      approveIndex: 0,
      oldItemIndex: 0,
      showDemoBackDrop: false,
      hideHeadbadge: true,
      swiperHeight: '',
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
      demoKey: 'approve-trace',
    };
  },
  created() {
    this.swiperHeight = `${472 / 75}rem`;
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
      window.localStorage.setItem(this.demoKey, true);
      this.$emit('RequestLatestData');
      this.isDemo = false;
      this.demoData = [];
      this.$set(this.approveData, this.approveTrace);
      this.showDemoBackDrop = false;
    },
    onReadApproveResult(item) {
      this.$emit('onReadApproveResult', item);
      this.readApproveResult(item, (items) => {
        setTimeout(() => {
          this.$set(items, 'RemoveAnimation', 'remove');
        }, 300);
      });
    },
    readApproveResult(item, callback) {
      callback(item);
      setTimeout(() => {
        this.$root.eventHub.$emit('trace-updated', item.InstanceId);
      }, 1300);
    },
    onPressToDo(item) {
      if (!this.isDemo) {
        this.$emit('onPressToDo', item);
      } else {
        this.showDemoBackDrop = true;
      }
    },
    onReadFormDetail(item) {
      this.$root.eventHub.$emit('trace-updated', item.InstanceId);
      this.$router.push({
        name: 'formPage',
        params: {
          bizObjectId: item.BizObjectId,
          schemaCode: item.WorkflowCode,
          workflowCode: item.WorkflowCode,
          instanceId: item.InstanceId,
        },
      });
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
        const isDemoShow = window.localStorage.getItem(this.demoKey);
        return this.approveData.length > 0 && this.withoutApproveData && !isDemoShow;
      },
      set() {
      },
    },
  },
};
</script>
<style lang="less">
@import '../../styles/common.less';
@baseFontSize: 75;
.px2rem(@name,@px) {
    @{name}: @px/@baseFontSize * 1rem;
}
.dots-index{
  bottom: 0px !important;
  a:first-child{
    margin-left: 0 !important;
  }
}
.trace-empty-card {
  .px2rem(margin-top, 24);
}
.footerBtn {
  border-top: 0;
  border: 0 !important;
  background-image: -webkit-linear-gradient(180deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
  background-image: linear-gradient(180deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: top;
  .disagree{
    border: 0 !important;
    background-image: -webkit-linear-gradient(270deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
    background-image: linear-gradient(270deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
    background-size: 1px 100%;
    background-repeat: no-repeat;
    background-position: right top;
  }
}
</style>


