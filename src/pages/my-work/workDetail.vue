<template>
  <div class="work-detail">
    <layout
      :title="title"
      :showHeader="showHeader"
    >
      <!-- :class="{hasMarginTop:!$store.state.corpId}" -->
      <h3-tab
        v-if="!isLight && !isOpenQuery"
        :activeColor="'rgba(24,144,255,1)'"
        :barActiveColor="'rgba(24,144,255,1)'"
        class="work-detail__tab"
      >
        <h3-tab-item
          selected
          @on-item-click="toggleNav"
        >
          流程日志
        </h3-tab-item>
        <h3-tab-item @on-item-click="toggleNav">
          流程图
        </h3-tab-item>
      </h3-tab>

      <router-view />
    </layout>
  </div>
</template>
<script lang="ts">
import {
  Vue, Component, Prop, Emit, Watch,
} from 'vue-property-decorator';
import {
  State, Getter, Mutation, Action, namespace,
} from 'vuex-class';
import { H3Tab, H3TabItem } from '../../../packages/components/h3-tab/';
import { isDingtalk } from '@/config/common';
const FormVM = namespace('Form/ViewModel');
const FormModule = namespace('Form');

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);

@Component({
  name: 'workDetail',
  components: {
    H3Tab,
    H3TabItem,
  },
})
export default class WorkDetail extends Vue {
  workflowCode: any = null;

  instanceId: any = null;

  groupWorkItems: any = [];

  title: string = '流程详情';

  showIndex: number = 0;

  isExternalFormBol: boolean = false;

  isExternalShare: boolean = false;

  isOpenQuery = false;

  enableReviewExternalForm: boolean = false;

  // 当前数据id
  @FormModule.State('primaryBizObjectId') primaryBizObjectId;

  // 当前表单数据
  @FormModule.State('ViewModel') formList;

  // 获取表单上下文对象
  get responseContext () {
    return this.formList && this.formList[this.primaryBizObjectId].$responseContext;
  }

  // 获取是否氚云3.0
  get isLight () {
    return this.responseContext && this.responseContext.IsLight;
  }

  get showHeader () {
    if (this.isOpenQuery) {
      if (isDingtalk) {
        return false;
      }
      return true;
    }
    return !this.$store.state.corpId && !this.isExternalFormBol &&
     !this.enableReviewExternalForm && !this.isExternalShare;
  }

  created () {
    const globalConfig = window.GlobalConfig;
    this.isExternalFormBol = globalConfig.isExternalForm;
    this.isExternalShare = globalConfig.isExternalShare;
    this.isOpenQuery = globalConfig.isOpenQuery;
    this.enableReviewExternalForm = globalConfig.enableReviewExternalForm;
    this.workflowCode = this.$route.params.workflowCode;
    this.instanceId = this.$route.params.instanceId;
    this.groupWorkItems = this.$route.params.groupWorkItems;
    this.title = this.$route.params.title;
    this.$router.replace({
      name: 'workLog',
      params: {
        groupWorkItems: this.groupWorkItems,
      },
    });
  }

  beforeRouteLeave (to, from, next) {
    this.$store.state.excludeComp = ['workDetail'];
    next();
  }

  toggleNav (index) {
    this.showIndex = index;
    if (index === 0) {
      this.$router.replace({
        name: 'workLog',
        params: {
          groupWorkItems: this.groupWorkItems,
        },
      });
    } else {
      this.$router.replace({
        name: 'workGraph',
        params: {
          workflowCode: this.workflowCode,
          instanceId: this.instanceId,
        },
      });
    }
  }
}
</script>

<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.work-detail {
  height: 100%;
  .work-detail__tab {
    height: 44px;
  }
}
</style>
