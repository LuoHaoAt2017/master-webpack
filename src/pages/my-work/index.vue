<template>
  <div id='my-work'>
      <div class="my-work" >
        <div class="container" >
          <h3-white-space :size="'lg'"></h3-white-space>
          <h3-card-to-do @goFlows="goFlows" :toDos="listData"></h3-card-to-do>
        </div>
      </div>
      <template v-if="hasAvailableWorkflow">
        <div class="fast-add" @click.stop='fastAdd' >
          <i class="icon aufont icon-base-plus"></i>
        </div>
        <h3-tool-tip content='点击发起流程'  @hideTip='hideTip' :showTip='showTip' direction="right-bottom" class="workflow-guide-tip"></h3-tool-tip>
      </template>
  </div>
</template>
<script>
import { GetHomeWorkflows } from '../../service/get-data';
import { setTitle, setLeft, closeApp } from '../../config/dingtalk-interface';
import H3CardToDo from '../../../packages/widgets/h3-card-todo';
import H3WhiteSpace from '../../../packages/components/h3-white-space';
import H3ToolTip from '../../../packages/widgets/h3-tool-tip/h3-tool-tip';


export default {
  name: 'myWork',
  components: {
    H3CardToDo,
    H3WhiteSpace,
    H3ToolTip,
  },
  data() {
    return {
      title: '我的工作',
      listData: [
        {
          color: '#F57C68',
          title: '我审批的',
          item: '待审批',
          state: '审批',
          num: 0,
          icon: 'icon-shenpi',
          workItemType: 2,
          routeUrl: 'approval',
          /* eslint-disable global-require */
          url: require('../../assets/img/sp.png'),
        },
        {
          color: '#F7B55D',
          title: '我经办的',
          item: '待办理',
          state: '经办',
          num: 0,
          icon: 'icon-jb',
          workItemType: 0,
          routeUrl: 'fillsheet',
          url: require('../../assets/img/jb.png'),
        },
        {
          color: '#108EE9',
          title: '我发起的',
          item: '进行中',
          state: '申请',
          num: 0,
          icon: 'icon-sqq',
          workItemType: -1,
          routeUrl: 'myapplication',
          url: require('../../assets/img/sqq.png'),
        },
        {
          color: '#3AD1DF',
          title: '抄送我的',
          item: '未读的',
          state: '抄送',
          num: 0,
          icon: 'icon-chuanyue',
          workItemType: 3,
          routeUrl: 'circulate',
          url: require('../../assets/img/chuanyue.png'),
          /* eslint-enable global-require */
        },
      ],
      menuWidth: `${(document.documentElement.clientWidth / 4) * 0.4}px`,
      colors: ['#F57C68', '#F7B55D', '#7EA6EA', '#108EE9', '#3AD1DF'],
      flowsObj: {},
      showTip: false,
      hasAvailableWorkflow: false,
    };
  },
  created() {
    const tipKey = `myWorkTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
    this.showTip = !(localStorage.getItem(tipKey));
  },
  activated() {
    const self = this;
    setTitle(this.title);
    this.queryFlowsCounts().then(() => {
      const workCount =
        self.flowsObj.ApproveCount +
        self.flowsObj.CirculateCount +
        self.flowsObj.FillCount;
      self.$store.state.todos = workCount;
      self.$store.state.homeData.TotalWorkflows = workCount;
    });
    setLeft(() => {
      this.goBack();
    });
    this.$store.state.initialSelectedIndex = 1;
  },
  methods: {
    // 获取流程状态的任务数量
    async queryFlowsCounts() {
      const appcode = this.$store.state.appCode;
      const solutioncode = this.$store.state.solutionCode;
      const res = await GetHomeWorkflows(appcode, solutioncode);
      if (res.Successful) {
        this.flowsObj = res.ReturnData;
        // 将取回的任务数量附值给各项数据
        for (const key in this.flowsObj) {
          if (Object.prototype.hasOwnProperty.call(this.flowsObj, key)) {
            switch (key) {
              case 'ApproveCount':
                this.$set(this.listData[0], 'num', this.flowsObj[key]);
                break;
              case 'CirculateCount':
                this.$set(this.listData[3], 'num', this.flowsObj[key]);
                break;
              case 'FillCount':
                this.$set(this.listData[1], 'num', this.flowsObj[key]);
                break;
              case 'InstanceCount':
                this.$set(this.listData[2], 'num', this.flowsObj[key]);
                break;
              case 'HasAvailableWorkflow':
                this.hasAvailableWorkflow = this.flowsObj[key] === '1';
                break;
              default:
                break;
            }
          }
        }
      }
    },
    fastAdd() {
      this.hideTip();
      this.$store.state.excludeComp = ['apps'];
      this.$router.push({ name: 'startWorkflow' });
    },
    goBack() {
      closeApp();
    },
    goFlows(item) {
      console.time('goflows');
      this.$router.push(`/${item.routeUrl}`);
    },
    hideTip() {
      this.showTip = false;
      const tipKey = `myWorkTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
      localStorage.setItem(tipKey, true);
    },
  },
};
</script>
<style lang='less'>
@import '../../../packages/styles/mixins';
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
#my-work {
  .my-work-wrap {
    filter: blur(3px);
  }
  .container {
    position: relative;
    box-sizing: border-box;
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
  }
  .fast-add {
    .px2rem(width, 88);
    .px2rem(height, 88);
    background-color: #1890FF;
    position: absolute;
    .px2rem(right, 44);
    .px2rem(bottom, 146);
    border-radius: 50%;
    z-index: 2;
    transition: all 1s;
    box-shadow: 0 3px 10px 0 rgba(24,144,255,0.41);
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-base-plus {
      color: white;
      .px2rem(font-size, 48);
    }
  }
  .workflow-guide-tip {
    position: absolute;
    .px2rem(right, 28);
    .px2rem(bottom, 280);
  }
}
</style>
