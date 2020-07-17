<template>
  <div :class="wrapCls">
      <h3-swiper dots-position="center"  :height="swiperHeight"
                :show-dots='approveData.length >1' v-if="approveAssist.length > 0 || isDemo "
                v-model="approveIndex" @on-index-change="onSwiperChange" dots-class="dots-index">
        <h3-swiper-item  v-for="(item,index) in approveData" :key="index" v-if="index < 5" >
            <h3-card
              class="swiper-card"
              :has-body-content="true"
              :header-badge="false"
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
                  <template v-if="!item.isHandle && !item.HasRequired && (item.ShowDisApprove || item.ShowApprove)">
                    <span class="disagree" v-if="!item.hasResult && item.ShowDisApprove" @click.stop="onDisAgree(item, index)">{{item.DisApproveText}}</span>
                    <span v-if="!item.hasResult && item.ShowApprove" @click.stop="onAgree(item, index)">{{item.ApproveText}}</span>
                    <span v-if="item.hasResult && item.ApproveResult ==='disagree' " >{{item.DisApproveText + '成功'}}</span>
                    <span v-if="item.hasResult && item.ApproveResult ==='agree'" >{{item.ApproveText + '成功'}}</span>
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

    <h3-card :has-body-content="false" class="assist-empty-card" v-if="!isDemo && approveAssist.length < 1">
        当前没有待审批的单据哦~
    </h3-card>
  </div>
</template>
<script>
import cx from 'classnames';
import { H3Swiper, H3SwiperItem } from '../../../packages/components/h3-swiper';
import H3Card from '../../../packages/widgets/h3-card-new/h3-card.vue';
import H3ApproveSumary from './home-approve-sumary.vue';
import { getApproveWorkflow, getRejectWorkflow } from '../../service/get-data';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';

const prefixCls = 'home-card-assist';
export default {
  name: 'home-card-assist',
  components: {
    H3Swiper,
    H3SwiperItem,
    H3Card,
    H3ApproveSumary,
  },
  props: {
    className: String,
    approveAssist: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      approveIndex: 0,
      oldItemIndex: 0,
      showDemoBackDrop: false,
      withoutContent: false,
      hideHeadbadge: true,
      swiperHeight: '',
      demoData: [
        {
          DisplayName: '张三的付款',
          ItemSummary: '收款人全称: 李四     ||付款日期: 2017-07-25 ||付款方式: 支票 ||付款金额: 1000000 ||',
          MobileDicData: [
            { 收款人全称: '李四' },
            { 付款日期: ' 2017-07-25' },
            { 付款方式: ' 支票 ' },
            { 付款金额: ' 1000000 ' },
            { 银行账户: ' 007876688755 ' },
            { 付款事由: ' 采购 ' },
          ],
          ReceiveTime: '2017/12/11 19:27:43',
        },
      ],
      demoKey: 'approve-assist',
      onAgreeFlag:false,
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
      this.$set(this.approveData, this.approveAssist);
      this.approveData = this.approveAssist;
      this.showDemoBackDrop = false;
    },
    onDisAgree(item) {
      if (this.isDemo) { return; }
      // this.$emit('RequestLatestData');
      if (this.onAgreeFlag) return;
      this.reject(item, (items) => {
        this.$set(items, 'hasResult', true);
        this.$set(items, 'ApproveResult', 'disagree');
        setTimeout(() => {
          this.$set(items, 'RemoveAnimation', 'remove');
        }, 300);
      });
    },
    async reject(item, callback) {
      this.onAgreeFlag = true;
      const {
        ObjectID,
        WorkflowCode,
        WorkflowVersion,
        InstanceId,
        BizObjectId,
      } = item;
      const data =
        await getRejectWorkflow(ObjectID, WorkflowCode, WorkflowVersion, InstanceId, BizObjectId);
      if (data.Successful === true) {
        callback(item);
        setTimeout(() => {
          this.$root.eventHub.$emit('commission-updated');
        }, 1300);
      } else {
        H3PluginDeveloper.IShowError('提示', data.ErrorMessage);
      }
      this.onAgreeFlag = false;
    },
    onAgree(item) {
      if (this.isDemo) { return; }
      if (this.onAgreeFlag) return;
      this.approve(item, (items) => {
        this.$set(items, 'hasResult', true);
        this.$set(items, 'ApproveResult', 'agree');
        setTimeout(() => {
          this.$set(items, 'RemoveAnimation', 'remove');
        }, 300);
      });
    },
    async approve(item, callback) {
      this.onAgreeFlag = true;
      const {
        ObjectID, WorkflowCode, WorkflowVersion, InstanceId, BizObjectId,
      } = item;
      const data =
        await getApproveWorkflow(ObjectID, WorkflowCode, WorkflowVersion, InstanceId, BizObjectId);

      if (data.Successful === true) {
        // 更新代办,审批助手，审批追踪数量
        callback(item);
        setTimeout(() => {
          this.$root.eventHub.$emit('commission-updated');
        }, 1300);
      } else if (data.ErrorMessage !== '审批失败') {
        H3PluginDeveloper.IConfirm('提示', data.ErrorMessage, (result) => {
          if (result === 1) {
            this.initSmartFormControls();
            this.$router.push({
              name: 'formPage',
              params: {
                bizObjectId: BizObjectId,
                schemaCode: WorkflowCode,
                workflowCode: WorkflowCode,
                workItemId: ObjectID,
                instanceId: InstanceId,
                mode: 'Edit',
              },
            });
          }
          // 表单被删除后流程记录没有删除掉
        });
      } else {
        H3PluginDeveloper.IShowError('提示', data.ErrorMessage);
      }
      this.onAgreeFlag = false;
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
        const isDemoShow = window.localStorage.getItem(this.demoKey);
        return this.approveData.length > 0 && this.withoutApproveData && !isDemoShow;
      },
      set() {
      },
    },
    wrapCls() {
      return cx(prefixCls, this.className);
    },
  },
};
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
    @{name}: @px/@baseFontSize * 1rem;
}
.assist-empty-card {
  .px2rem(margin-top, 24);
}
</style>


