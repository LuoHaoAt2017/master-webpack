<template>
    <div class="graph">
        <layout 
        :title="title"
        :show-header="!$store.state.corpId&&!isExternalFormBol&&!enableReviewExternalForm&&!isExternalShare"
        >
<!-- :class="{hasMarginTop:!$store.state.corpId}" -->
        <div class="legend">
            <div>
                <span class="finished"></span>
                已流转节点
            </div>
            <div>
                <span class="working"></span>
                处理中节点
            </div>
            <div>
                <span class="next"></span>
                未流转节点
            </div>
        </div>
        <div class="wrapper" ref="wrapper">
            <div> 
                <div class="workspace-wrapper" >
                    <div id="workspace" class="workspace"></div>
                </div>
            </div>
        </div>
        </layout>
    </div>
</template>
<script>

import '../../lib/hammer';
import { getInstanceGraph } from '../../service/get-data';
import { isiOS } from '../../config/common';
import { WorkflowMode } from './js/setting';
import './js/global';
import init from './js/loader';
import './style/graph.css';
import globalConfig from '../../config/app-start/global-config';

export default {
  name: 'graph',
  components: {
  },
  data() {
    return {
      workflowCode: null,
      instanceId: null,
      title: '流程图',
      isExternalFormBol: false,
      isExternalShare: false,
      enableReviewExternalForm: false
      // scroll: null,
    };
  },
  created() {
    const globalConfig = window.GlobalConfig;
    this.workflowCode = this.$route.params.workflowCode;
    this.instanceId = this.$route.params.instanceId;
    this.isExternalFormBol = globalConfig.isExternalForm;
    this.isExternalShare = globalConfig.isExternalShare;
    this.enableReviewExternalForm = globalConfig.enableReviewExternalForm;
    this.requestInstanceGraph(this.workflowCode, this.instanceId);
  },
  mounted() {
    const workspace = document.getElementById('workspace');
    this.drag(workspace);
  },
  activated() {
  },
  beforeRouteLeave(to, from, next) {
    this.$store.state.excludeComp = ['graph'];
    next();
  },
  methods: {
    async requestInstanceGraph(workflowCode, instanceId) {
      const res = await getInstanceGraph(workflowCode, instanceId);
      if (res.Successful) {
        GlobalWorkflowProperties.WorkflowCode = workflowCode;
        GlobalWorkflowProperties.WorkflowInstance = res.ReturnData.WorkflowInstance;
        GlobalWorkflowProperties.WorkflowTemplate = res.ReturnData.WorkflowTemplate;
        GlobalWorkflowProperties.WorkItems = res.ReturnData.WorkItems;
        GlobalWorkflowProperties.WorkflowMode = WorkflowMode.MobileView;
        GlobalWorkflowProperties.ActivityTemplateConfigs = res.ReturnData.ActivityTemplateConfigs;
        init(
          workflowCode, GlobalWorkflowProperties.WorkflowTemplate,
          GlobalWorkflowProperties.ActivityTemplateConfigs,
        );
      }
    },
    getCss(o, key) {
      return o.currentStyle ?
        o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
    },
    drag(elements) {
      const element = elements;
      element.style.top = this.getCss(element, 'top');
      element.style.left = this.getCss(element, 'left');
      /* eslint-disable */
      const hammer = new Hammer(element); // hammer实例
      let x = 0;
      let y = 0;
      hammer.on('panstart', () => {
        x = parseInt(element.style.left, 10);
        y = parseInt(element.style.top, 10);
      });
      hammer.on('panmove', (event) => {
        element.style.top = `${y+event.deltaY}px`;
        element.style.left = `${x+event.deltaX}px`;
      });
    },
  },
};
</script>

<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.graph{
  background-color: #fff;
  height: 100%;
  .wrapper {
    background-color: #fff;
    position: absolute;
    // top: 0;
    .px2rem(top,225);
    bottom: 0;
    width: 100%;
    z-index: 998;
    overflow-y: auto;
    overflow-x: hidden;
  }
  div.legend {
    display: flex;
    // margin-top: 46px;
    justify-content: space-around;
    .px2rem(height,90);
    .px2rem(padding-top,30);
    .px2rem(padding-bottom,30);
    z-index: 9999;
    div {
      display: flex;
      align-items: center;
      span {
        display: inline-block;
        .px2rem(width,30);
        .px2rem(height,30);
        .px2rem(margin-right,16);
        &.finished {
          background: #cadcf6;
        }
        &.working {
          background: #108ee9;
        }
        &.next {
          border: 1px solid #cadcf6;
        }
      }
    }
  }
}

</style>