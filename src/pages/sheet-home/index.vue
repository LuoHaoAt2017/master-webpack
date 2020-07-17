<template>
  <div id="sheethome">
    <layout
      :title="displayName"
      :leftOptions="{preventGoBack: true}"
      @on-click-back="goBack"
    >
      <workflow-state
        v-if="isCommentShow"
        class="form-comment"
        :bizObjectId="bizObjectId"
        :title="displayName"
      >
        <div
          v-if="responseContext.WorkflowState == 5 || responseContext.WorkflowState == 4"
          class="stamp-pic stamp-pic-done"
        >
          <img
            v-if="responseContext.WorkflowState == 5 || (responseContext.WorkflowState == 4 && responseContext.InstanceApproval == 0)"
            src="../../assets/img/zuofei.png"
            alt="图片"
          />
          <img
            v-if="responseContext.WorkflowState == 4 && responseContext.InstanceApproval == 1"
            src="../../assets/img/shenpitongguo.png"
            alt="图片"
          />
        </div>
      </workflow-state>
      <div v-show="!isCommentShow && responseContext && shouldShowTabbar" class="sheet-title">
        <div
          ref="readonlytextarea"
          class="textarea-view-wraper"
          :class="viewWrapperCls"
        >
          <div
            ref="inputTextareaText"
            :class="viewTextCls"
            class="textarea-view-text dp-font36"
            v-text="Name"
          >
          </div>
        </div>
        <div
          v-if="showViewOpreation"
          class="textarea-view-operate-warpper"
          @click="toogleViewText"
        >
          <div
            v-if="!isMore && showViewOpreation"
            class="textarea-view-operate dp-font28"
          >
            收起<i class="h3yun_All up-o"></i>
          </div>
          <div
            v-if="isMore && showViewOpreation"
            class="textarea-view-operate dp-font28"
          >
            展开<i class="h3yun_All right-o"></i>
          </div>
        </div>
      </div>
      <asso
        v-if="ready"
        :enableSns="EnableFormSns"
        :schemacode="schemaCode"
        :bizobjectId="bizObjectId"
        :associations="Associations"
        :associationAdds="AssociationsFastAdd"
        :appcode="appCode"
        :displayName="displayName"
        :name="Name"
        :summary="Summary"
        :isWorkFlow="isWorkFlow"
        :shouldShowTabbar="shouldShowTabbar"
      />
    </layout>
  </div>
</template>
<script>
import asso from '../../components/sheet-home/index.vue';
import { loadHomeData } from '../../service/get-data';
import {
// hideRightMenu,
  closeApp,
} from '../../config/dingtalk-interface';
// import { isiOS } from '../../../src/config/common';
import WorkflowState from '../../components/form/shared/workflow-state.vue';
// import * as FormLogic from '@/lib/form-logic/index';
import * as FormLogic from 'h3yun-formlogic';

/** @todo 这个文件需要用ts来改写 */
export default {
  name: 'sheethome',
  components: {
    asso,
    WorkflowState,
  },
  data () {
    return {
      isForward: false,
      schemaCode: '',
      bizObjectId: '',
      displayName: '',
      EnableFormSns: false,
      appCode: null,
      thumbnailUrl: null,
      // EnableTaskRemind:false,
      TaskCount: 0,
      Name: '',
      Summary: '',
      MobileDicData: [],
      Associations: [],
      AssociationsFastAdd: [],
      ready: false,
      delRetFlag: false, // 删除返回标识
      isDataUpdated: false,

      viewWrapperCls: '',
      isMore: false,
      showViewOpreation: false,
    };
  },
  computed: {
    viewTextCls () {
      if (this.isMore) {
        return 'textarea-view-text-overflow';
      }
      return '';
    },
    responseContext () {
      if (this.bizObjectId) {
        const formData = this.$store.state.Form.ViewModel[this.bizObjectId];
        return !!formData && formData.$responseContext;
      }
      return {};
    },
    // 判断是否需要workflow-state 流程状态组件
    isCommentShow () {
      const context = this.responseContext;
      return !!context && !context.IsCreateMode && context.InstanceId && context.WorkItems;
    },
    isWorkFlow () {
      return this.responseContext && (this.responseContext.FormDataType === 1 || this.responseContext.FormDataType === 3);
    },
    shouldShowTabbar () {
      return !!this.Name && typeof (this.responseContext.BizObjectStatus) === 'number'
        ? (this.responseContext.BizObjectStatus === 1 && this.Associations.length > 0)
        : false;
    },

  },
  watch: {
    $route (to, from) {
      if (to.name === 'secFormPage' && from.name === 'secFormPage' && to.params.bizObjectId !== from.params.bizObjectId) {
        this.$store.state.assoStashedTab = '';
      }
      if (from.name === 'sheethome' && to.name === 'sheethome' ||
        (to.name === 'secFormPage' && from.name === 'secFormPage' && to.params.bizObjectId !== from.params.bizObjectId) ||
        (to.name === 'secFormPage' && from.name === 'formPage') ||
        (from.name === 'list' && to.name === 'secFormPage')
      ) {
        this.ready = false;
        this.showViewOpreation = false;
        this.viewWrapperCls = '';
        this.isMore = false;
        this.schemaCode = to.params.schemaCode;
        this.bizObjectId = to.params.bizObjectId;
        this.displayName = to.params.displayName;
        this.getSheetHomeData(to.params.schemaCode, to.params.bizObjectId);
      }
    },
    displayName (val) {
      if (val) {
        // setTitle(`${val}的首页`);
        this.displayName = val;
      }
    },
    responseContext (newVal, olaValue) {
      if (!olaValue && newVal) {
        this.manageViewText();
      }
    },
  },
  created () {
    console.log('______________this.sto', this.$store.state);

    FormLogic.init(this.$store);
    this.schemaCode =
      this.$route.params.schemaCode || window.GlobalConfig.schemaCode;
    this.bizObjectId =
      this.$route.params.bizObjectId || window.GlobalConfig.bizObjectId;
    this.displayName = this.$route.params.displayName;
    this.appCode = this.$route.params.appCode;

    this.getSheetHomeData(this.schemaCode, this.bizObjectId);
    const that = this;
    this.$root.eventHub.$on('data-updated', () => {
      if (this.isDataUpdated) {
        return;
      }
      this.isDataUpdated = true;
      that.getSheetHomeData(that.schemaCode, that.bizObjectId);
    });
    this.$root.eventHub.$on('form-remove', () => {
      // that.$router.goBack();
      that.delRetFlag = true;
    });
  },
  activated () {
    if (this.delRetFlag) {
      this.delRetFlag = false;
      this.$router.go(-1);
    }
  },
  methods: {
    goBack () {
      // this.$router.replace({
      //   name: 'list',
      //   params: { appCode: this.appCode, schemaCode: this.schemaCode, appName: this.displayName },
      //   query: { schemaCode: this.schemaCode, },
      // });
      if (window.GlobalConfig.isAssociation && window.history.length === 1) {
        closeApp();
      } else {
        this.$router.goBack();
      }
    },
    async getSheetHomeData (schemaCode, bizObjectId) {
      this.AssociationsFastAdd = [];
      let data = await loadHomeData(schemaCode, bizObjectId);
      if (!data.Successful) {
        return;
      }
      data = data.ReturnData.Data;

      this.displayName = data.DisplayName;
      this.Name = data.Name;
      this.Summary = data.Summary;
      // if (!this.Name && !this.Summary && !this.delRetFlag) {
      //   this.$router.go(-1);
      //   return;
      // }
      this.EnableFormSns = data.EnableFormSns;
      // this.EnableTaskRemind = data.EnableTask;
      this.TaskCount = data.TaskCount;
      this.thumbnailUrl = data.ThumbnailUrl;

      this.MobileDicData = [];
      for (const dicData of data.MobileDicData) {
        for (const key in dicData) {
          if (dicData[key]) { this.MobileDicData.push({ key, value: dicData[key] }); }
        }
      }
      this.Associations = data.AssociationBOs;
      this.AssociationsFastAdd = [];
      if (this.Associations && this.Associations.length > 0) {
        for (const assos of this.Associations) {
          if (assos.EnableAdd === true) {
            this.AssociationsFastAdd.push(assos);
          }
        }
      }
      this.ready = true;
      this.manageViewText();
      this.$root.eventHub.$emit('updateDataCount', data.AssociationBOs);
    },
    toogleViewText () {
      this.isMore = !this.isMore;
      this.viewWrapperCls = 'input-view-wrapper-operating';
    },
    manageViewText () {
      this.$nextTick(() => {
        if (this.$refs.readonlytextarea) {
          const parentHeight = this.$refs.readonlytextarea.offsetHeight;
          const height = this.$refs.inputTextareaText.offsetHeight;
          if (height > parentHeight) {
            this.showViewOpreation = true;
            this.isMore = true;
          }
        }
      });
    },
  },
  beforeRouteLeave (to, from, next) {
    this.isDataUpdated = false;
    if (to.path === '/list' || to.path === 'workflows') {
      this.$root.eventHub.$off('form-remove');
      this.$store.state.excludeComp = ['sheethome'];
      this.$store.state.assoStashedTab = '';
    } else if (to.path === '/formPage') {
      this.$store.state.excludeComp = ['sheethome'];
      this.$destroy();
    } else {
      this.$store.state.excludeComp = [];
    }
    next();
  },
};
</script>
<style lang="less" >
// @import '../../assets/css/home.less';
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
#sheethome {
  .sheet-title {
    background-color: white;
    .px2rem(margin-top, 14);
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
    .px2rem(padding-top, 14);
    .px2rem(padding-bottom, 14);
    position: relative;
    .textarea-view-wraper {
        line-height: 25px;
        height: auto;
        max-height: 50px;
        overflow: hidden;
        .textarea-view-text-overflow {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        .textarea-view-text {
          font-weight: bold;
          word-break: break-all;
        }
    }
    .textarea-view-operate-warpper {
        // position: absolute;
        .px2rem(right,30);
        // .px2rem(bottom,-8);
        .px2rem(margin-top, 4);
        color: #1890ff;
        z-index: 1;
    }
    .textarea-view-operate {
        float:right;
        i{
            font-size: 12px;
        }
    }
    .input-view-wrapper-operating{
        max-height: none;
    }
  }
}
div.row {
  display: flex;
  flex-flow: wrap;
  //justify-content: space-around;
  align-items: flex-start;
  .px2rem(padding-left,23);
  .px2rem(padding-right,23);
  .px2rem(padding-top,40);
  .px2rem(padding-bottom,40);
  div.app {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    align-items: center;
    // .px2rem(margin-left,32);
    // .px2rem(margin-right,32);
    .px2rem(margin-top,20);
    .px2rem(margin-bottom,20);
    &.active {
      opacity: 0.5;
    }
    div.app-icon {
      .px2rem(width,90);
      .px2rem(height,90);
      // .px2rem(line-height,90);
      .px2rem(border-radius,18);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      span {
        font-size: 26px;
      }
    }
    div.app-name {
      text-align: center;
      font-size: 11px;
      color: #666;
      .px2rem(margin-top, 7);
      display: -webkit-box;
      /* autoprefixer: ignore next*/
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      // max-width: 90%;
    }
  }
}
#sheethome {
  height: 100%;
  & > .app-container > .app-main {
    display: flex;
    flex-direction: column;
  }
  .form-comment {
    .stamp-pic {
      // transition: all 0.3s;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .stamp-pic-start {
      position: absolute;
      top: 0;
      .px2rem(right, 30);
      .px2rem(width, 170);
      .px2rem(height, 135);
      z-index: 999999999;
    }
    .stamp-pic-done {
      position: absolute;
      .px2rem(top, 10);
      .px2rem(right, 30);
      .px2rem(width, 170);
      .px2rem(height, 135);
      // opacity: 0;
      // animation: stamp 0.4s ease 0.1s 1 forwards;
      z-index: 999999999;
    }
  }
}
</style>
