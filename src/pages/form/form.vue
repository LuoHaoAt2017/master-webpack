<template>
  <layout
    :title="iShowTitle || DisplayName"
    :leftOptions="{preventGoBack: true}"
    :noSetleft="$route.name === 'secFormPage'"
    :showHeader="showHeader"
    @on-click-back="preGoBack"
  >
    <div
      id="form-page"
      v-show="vCloak"
      ref="formpage"
      :class="{'bottomHide': buttonActions.length === 0}"
    >
      <div class="form-child-wrapper">
        <workflow-state
          v-if="isCommentShow && $route.name !== 'secFormPage'"
          class="form-comment"
          :bizObjectId="bizObjectId"
          :EnableReviewExternalForm="EnableReviewExternalForm"
          :title="DisplayName"
        >
          <div
            v-if="showWorkflowSig"
            class="stamp-pic stamp-pic-done"
          >
            <img
              v-if="workflowSig"
              :src="workflowSig"
              alt="图片"
            />
          </div>
        </workflow-state>
        <form-wrapper
          id="form-wrap"
          ref="controlRender"
          :newform="newform"
          :bizObjectId="bizObjectId"
          class="formContent"
          :class="{'form-page__bottom': hasBottom}"
        />
      </div>
    </div>
    <form-footer
      :buttons="buttonActions"
      :islight="islightapp"
      :popup="footerPopup"
      @onClickButton="buttonClicked"
    />
    <div
      v-if="vCloak && !isFormNotice && !isExternalFormBol && !isExternalShareBol && isFromNotice"
      class="back-to-home-btn"
      @click="backToHome"
    >
      <span class="dp-font22">返回首页</span>
    </div>
    <validate-panel />
  </layout>
</template>
<script lang="ts">
import {
  Vue, Component, Prop, Watch, Mixins,
} from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import '../../utils/pre-view';
import { initFormData } from '@/service/form.service';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import { FormActionType, FormMutationType } from '@/store/modules/form/types';
import { isQQ } from '@/config/common';
import { SolutionState, SolutionTypes } from '../../config/license';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { closeApp } from '../../config/dingtalk-interface';
import FormCache from './form-cache';
import FormLoadError from './form-load-error';
import resultHandler from '../../utils/result-handler';
import WorkflowState from '../../components/form/shared/workflow-state.vue';
import FormWrapper from '@/components/form/shared/form-wrapper';
import ValidatePanel from '@/components/form/shared/validate-panel.vue';
import FormFooter from '@/components/form/shared/form-footer.vue';
// import FormMultiUser from '@/components/form/common-controls/form-multi-user.vue';
import UserOrg from './user-org.vue';
import { FormMode } from './config/const';

// import * as FormLogic from '@/lib/form-logic/index';
import * as FormLogic from 'h3yun-formlogic/src/index';
import { Mutation } from '@/lib/form-logic/modal/types';

// import appStart from '@/config/app-start';

import { AppActionType } from '@/store/modules/app/types';
const FormModule = namespace('Form');
const FormVM = namespace('Form/ViewModel');
const appModule = namespace('App');
const QQBrowserTouchMoveHandler = function (e) { e.preventDefault(); };

const ApprovalSig = require('../../assets/img/shenpitongguo.png');
const CanceledSig = require('../../assets/img/zuofei.png');

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);

@Component({
  name: 'formPage',
  components: {
    WorkflowState,
    FormWrapper,
    FormFooter,
    ValidatePanel,
    UserOrg,
  },
})
export default class FormPage extends Mixins(FormCache, FormLoadError) {
  // props 路由传参
  @Prop({ default: '' })
  MappingDataField!: string;

  @Prop({ default: '' })
  BOName!: string;

  @Prop({ default: '' })
  instanceId!: string;

  // @Prop({ default: '' })
  // mode!: string;

  @Prop({ default: '' })
  workflowCode!: string;

  @Prop({ default: '' })
  originator!: string;

  @Prop({ default: '' })
  WorkflowVersion!: string;

  @Prop({ default: '' })
  LinkBizObjectId!: string;

  @Prop({ default: false })
  isExternalForm!: string;

  @Prop({ default: '' })
  iShowTitle!: string;

  // 页面路由参数 手动赋值
  schemaCode: string = '';

  bizObjectId: string = '';

  workItemId: string = '';

  ContainsDevParams: number | string = 0;

  // data
  DisplayName: string = '';

  destActivity: string = ''; // what

  fromRoute: any[] = []; // what

  loadingTitle: string = '加载中...';

  fromHome: boolean = false;

  // 迭代26 是否从关联表单新增进来
  fromFormQuery: boolean = false;

  // isInputComment:false, //是否输入审批意见
  footerPopup: boolean = false;

  inputCommnets: string = ''; // 输入意见

  commentPlaceholder: string = '';

  buttonActions: any[] = [];

  initialControlsData: any = {};

  isFirstGetContorlsData: boolean = true;

  isEditBol: boolean = false; // what

  appCode: string = '';

  vCloak: boolean = false;

  scrollTop: number = 0;

  isExternalFormBol: boolean = false;

  isExternalShareBol: boolean = false;

  EnableReviewExternalForm: boolean = false;

  ReviewQrCodeUrl: string = '';

  currentCommentId: any = null;

  BizObjectStatus: any = {
    Draft: 0, // 草稿
    Effective: 1, // 审批通过或者表单提交后
    Running: 2, // 流程运行中
    Canceled: 3, // 被取消
  };

  mode = ''; // 模式

  isFormNotice: boolean = false;

  isFromNotice: boolean = false;

  isGoBackModal: boolean = false;

  hasBottom: boolean = false;

  realSchemaCode: string = '';

  // 由关联列表携带过来的关联表单填充值
  carryOverMapping: { [dataField: string]: H3.Form.QueryValue } = {};

  fromEdit: string = 'false';

  isHandleRouteChange: boolean = true;

  /**
   * 是否从表单设计器过来,从路由携带
   * add by guosha
   */
  isFromFormDesign: boolean = false;

  newform: object = {};

  // 用于加载表单数据的接口
  ddIngPid: string = '';

  // 用于加载表单数据的接口
  ddIngTid: string = '';

  formDefaultValue: object = {}; // 控件默认值

  fromBoard = false; // 是否从看板视图过来的表单

  // vuex

  @FormVM.Action(ViewModelAction.DOVALIDATE)
  doLogicValidate; // 逻辑层校验

  @FormVM.Action(ViewModelAction.GETFORMSTATE)
  getFormState; // 表单当前所处状态

  @FormVM.Action(ViewModelAction.DOACTION)
  doLogicAction; // 从逻辑层发起请求

  @FormVM.Action(ViewModelAction.DOAFTERSUBMIT)
  doAfterSubmit; // 提交后（发起请求后）的回调方法

  @FormModule.Action(FormActionType.SHOWVALIDMSG)
  showValidMsg;

  @FormModule.Action(FormActionType.GetFrontEvents)
  getFrontEvents;

  // 迭代26 设置一级表单bizobjectID 和是否是一级表单
  @FormModule.Mutation(FormMutationType.setPrimaryBizObjectId)
  setPrimaryBizObjectId;

  @FormModule.Mutation(FormMutationType.setSecondaryForm)
  setSecondaryForm;

  @FormModule.State('isSecondaryForm') isSecondaryForm;

  @FormModule.State('primaryBizObjectId') primaryBizObjectId;

  @FormModule.State('isKeyboardShow')
  isKeyboardShow;

  get isOpenQuery () {
    return window.GlobalConfig.isOpenQuery;
  }

  get showHeader () {
    return !this.$store.state.corpId && !this.isExternalFormBol && !this.EnableReviewExternalForm &&
    !this.isExternalShareBol && this.$route.name !== 'secFormPage';
  }

  // 是否显示流程水印
  get showWorkflowSig () {
    return [4, 5].indexOf(this.responseContext.WorkflowState) > -1;
  }

  // 流程水印类型
  get workflowSig () {
    const { WorkflowState: status, InstanceApproval } = this.responseContext;
    if (status === 5 || (status === 4 && InstanceApproval === 0)) {
      return CanceledSig;
    } else if (status === 4 && InstanceApproval === 1) {
      return ApprovalSig;
    }
    return null;
  }

  created () {
    /**
     * 是否从表单设计器过来,从路由携带
     * add by guosha
     */
    const { query } = this.$route || {};
    const { ddIngPid, ddIngTid } = window.GlobalConfig as any;
    this.isFromFormDesign = !!query.fromFormDesign;
    this.ddIngPid = ddIngPid;
    this.ddIngTid = ddIngTid;
    FormLogic.init(this.$store);
    this.initFormPageData();
    // qq浏览器卡
    if (isQQ) {
      window.addEventListener('touchmove', QQBrowserTouchMoveHandler);
    }
    // 给 H3 注册 showValidMsg 函数;
    H3PluginDeveloper.showValidMsg = this.showValidMsg;
  }

  beforeDestroyed () {
    if (isQQ) {
      window.removeEventListener('touchmove', QQBrowserTouchMoveHandler);
    }
  }

  activated () {
    // 设置滚动距离， 返回当前表单页面时回到上一次离开的位置
    const dom = document.getElementById('form-page');
    if (dom) {
      dom.scrollTop = this.scrollTop;
    }
  }

  /**
   * cacheData： H3.Form.DataCache 缓存的页面数据，用于再次打开表单时还原数据，不用重新请求
   * 出现场景： 1.当前表单 --》关联列表 --》新增关联表单 。。。返回当前表单时需要恢复临时数据
   * 注意： 切换到当前路由时需要区分是组件的新创建实例还是原有组件的激活，这两种状态在应用中共存
  */
  initFormPageData (cacheData?: H3.Form.DataCache) {
    const params = this.$route.params;
    this.fromEdit = this.$route.params.fromEdit;
    this.mode = params.mode || '';
    // 是否有自定义代码参数:0-默认(无)；1：有开发者参数
    this.ContainsDevParams = params.containsDevParams || 0; // 待梳理，可以考虑去掉
    // 是否有自定义代码参数:0-默认(无)；1：有开发者参数
    const {
      isExternalForm, isExternalShare, isFromNotice, menuCode, schemaCode,
    } = window.GlobalConfig;
    this.isExternalFormBol = isExternalForm; // 是否外链填单
    this.isExternalShareBol = isExternalShare; // 是否外链分享表单
    // 是否消息通知进来的表单，消息通知进来的表单，右下角会有返回首页的按钮，点击后回到移动端首页，
    // 不然，点击提交后会直接关闭应用
    this.isFromNotice = isFromNotice;

    if (cacheData) {
      this.appCode = cacheData.appCode;
      this.fromHome = cacheData.fromHome;
      this.bizObjectId = cacheData.bizObjectId;
      this.workItemId = cacheData.workItemId;
      this.schemaCode = cacheData.schemaCode;
      this.realSchemaCode = cacheData.schemaCode;
      this.DisplayName = cacheData.DisplayName;
      this.fromBoard = cacheData.fromBoard;
      FormLogic.restore(this.bizObjectId);
      this.renderActionButtons();
      this.$forceUpdate();
    } else {
      const query = this.$route.query;
      const {
        fromHome, fromFormQuery, bizObjectId, workItemId,
      } = query;

      this.fromHome = fromHome === '1';
      this.fromFormQuery = fromFormQuery === '1';
      this.bizObjectId = `${params.bizObjectId || bizObjectId || ''}`;
      this.workItemId = `${params.workItemId || workItemId ||
      window.GlobalConfig.workitemId || ''}`;
      this.isFormNotice = !!params.schemaCode;
      this.schemaCode = `${params.schemaCode ||
        query.schemaCode ||
        (schemaCode || menuCode)}`;
      const requestParams = this.getRequestParams(params, this.$route.query);
      this.getFormData(requestParams);
    }
  }

  /**
   * 格式化表单加载请求参数
  */
  getRequestParams (params, query) {
    const GlobalConfig: any = window.GlobalConfig;
    const requestParams: any = {
      IsMobile: true,
      ActionName: 'MobileLoadSheet',
    };
    // 判断是否是同一个引擎
    if (params.schemaCode) {
      // 外链表单传递isExternalForm
      requestParams.IsExternalForm = this.isExternalFormBol ? '1' : '0';
      requestParams.IsExternalShare = this.isExternalShareBol ? '1' : '0';
      // 列表BOID,可传可不传
      requestParams.BizObjectId = this.bizObjectId || '';
      // 工作项ID,可传可不传
      requestParams.WorkItemId = this.workItemId || '';
      // 流程实例ID
      requestParams.InstanceId = this.instanceId || '';
      // 流程实例ID
      requestParams.Originator = this.originator || '';
      // 流程Code,可传可不传
      requestParams.WorkflowCode = this.workflowCode || '';
      requestParams.WorkflowVersion = this.WorkflowVersion || '';
      // 表单所使用的模式
      if (this.mode) {
        requestParams.Mode = this.mode;
      } else if (this.fromEdit === 'true' || this.$route.query.refleshRoute === '2') {
        requestParams.Mode = '0';
      } else {
        requestParams.Mode = this.bizObjectId ? '1' : '';
      }
      // 关联BO对象
      requestParams.BOName = this.BOName ? encodeURIComponent(this.BOName) : '';
      if (this.MappingDataField) {
        const mappingDataFieldList = this.MappingDataField.split(';');
        requestParams.MappingDataField = mappingDataFieldList;
        mappingDataFieldList.forEach((item) => {
          const queryVal = {
            ObjectId: this.LinkBizObjectId,
            Name: encodeURIComponent(this.BOName),
          };
          requestParams[item] = queryVal;
          this.carryOverMapping[item] = queryVal;
        });
      }
    } else if (GlobalConfig.schemaCode || GlobalConfig.menuCode) {
      requestParams.WorkItemId = GlobalConfig.workitemId;
      requestParams.BizObjectId = GlobalConfig.bizObjectId || query.bizObjectId;
      requestParams.SharingKey = GlobalConfig.shareKey;
      requestParams.IsExternalForm = this.isExternalFormBol ? '1' : '0';
      requestParams.IsExternalShare = this.isExternalShareBol ? '1' : '0';
    } else {
      requestParams.WorkItemId = query.workitemId || '';
      requestParams.InstanceId = query.instanceId || '';
      requestParams.BizObjectId = query.bizObjectId;
    }
    requestParams.ddIngPid = GlobalConfig.ddIngPid;
    requestParams.ddIngTid = GlobalConfig.ddIngTid;
    // 取表单运行时结构的缓存，取时间戳 传至后台
    const schemaCache = this.$getRuntimeCache(this.schemaCode);
    // 获取表单缓存，如果localstorage已经存在该表单缓存，根据缓存中timestamp判断表单是否有更新，
    // 如果没有更新，则直接取缓存数据， 主要为了节约带宽
    requestParams.TimeStamp = schemaCache ? schemaCache.TimeStamp : -1;
    requestParams.CacheIsBetaForm = schemaCache
      ? schemaCache.CacheIsBetaForm
      : -1;
    requestParams.SchemaCode = this.schemaCode;
    requestParams.SheetCode = this.schemaCode;
    return requestParams;
  }

  // 请求应用表单数据
  // TODO 重构，职责不单一
  async getFormData (requestParams) {
    H3PluginDeveloper.IShowPreLoader(this.loadingTitle, { autoHide: false });
    const res = await initFormData(requestParams);
    if (res.Successful) {
      const Data = res.ReturnData.Data;
      const {
        AssociationBOs, ViewContext, FormContent, AppCode, DisplayName,
      } = Data;

      // 如果返回的数据中有HtmlContent，则刷新localStorage中的表单数据
      // 当FormContent有值时，表示以此数据进行解析
      // TODO 此处需要重新梳理, 什么情况下表单进入表单首页
      if (AssociationBOs &&
        AssociationBOs.length > 0 &&
        (ViewContext.FormMode === FormMode.Readonly || ViewContext.FormMode === FormMode.View) &&
        this.$route.name === 'formPage' &&
        this.$route.params.linkSource !== 'list' &&
        ViewContext.IsExternalForm === false &&
        ViewContext.IsExternalShare === false) {
        window.GlobalConfig.isAssociation = true;
        this.$router.replace({
          path: `/sheet-home/${requestParams.BizObjectId}/${requestParams.SheetCode}`,
          params: {
            appCode: AppCode,
            appName: DisplayName,
          },
        });
        H3PluginDeveloper.IHidePreLoader();
        return;
      }
      if (FormContent) {
        Data.HtmlContent = FormContent;
      }
      if (!Data.HtmlContent) {
        const itemCache = this.$getRuntimeCache(this.schemaCode);
        Data.HtmlContent = itemCache.SheetContent;
        Data.Javascript = itemCache.Javascript;
      } else {
        this.$setRuntimeCache(this.schemaCode, {
          SheetContent: Data.HtmlContent,
          TimeStamp: res.ReturnData.TimeStamp,
          CacheIsBetaForm: res.ReturnData.CacheIsBetaForm,
          Javascript: Data.Javascript,
        });
      }
      // 这里处理关联列表逻辑，难维护，未来重构
      // const mappingDataFieldList = this.MappingDataField.split(';');
      if (this.carryOverMapping) {
        for (const key in this.carryOverMapping) {
          if (this.carryOverMapping[key]) {
            this.carryOverMapping[key].Name = decodeURIComponent(this.carryOverMapping[key].Name);
          }
        }
      }
      Data.CarryOverMapping = this.carryOverMapping;

      this.setFormData(res.ReturnData);
      H3PluginDeveloper.IHidePreLoader();
    } else {
      H3PluginDeveloper.IHidePreLoader();
      this.formLoadErrorHandler(res, this);
    }
  }

  // 数据获取成功后的操作
  setFormData (returnData) {
    const {
      Data,
      EnableReviewExternalForm, // 是否启用外链查看
      ReviewMobileQrCodeUrl,
    } = returnData;
    const viewContext = Data.ViewContext;
    // 用来判断审批的时候是否覆盖意见. kappa 2018-10-23
    this.workItemId = viewContext.WorkItemId;
    this.bizObjectId = viewContext.BizObjectId;
    // 迭代26 如果时一级表单就暂存该表单
    if (!this.isSecondaryForm) {
      this.setPrimaryBizObjectId(this.bizObjectId);
    }
    this.realSchemaCode = viewContext.SchemaCode;
    if (
      viewContext &&
      viewContext.Comments &&
      viewContext.Comments.length > 0 &&
      !!this.workItemId
    ) {
      const currentWorkItem = viewContext.WorkItems.find(
        item => item.WorkItemId === this.workItemId,
      );
      if (currentWorkItem) {
        const selectedComment = viewContext.Comments.find(item => {
          if (item.WorkItemId) {
            return item.WorkItemId === this.workItemId;
          }
          return (
            item.TokenId === currentWorkItem.TokenId &&
            item.UserId === currentWorkItem.UserId &&
            item.IsMyComment
          );
        });
        this.currentCommentId = selectedComment && selectedComment.CommentId;
      }
    }
    const { mappingSchemaCode, mappingValue } = this.$route.params;
    if (mappingSchemaCode && mappingValue) {
      viewContext.RequestParameters[mappingSchemaCode] = mappingValue;
    }
    // 还原携带的默认值
    if (Object.keys(this.formDefaultValue).length > 0) {
      Object.keys(this.formDefaultValue).forEach((dataField:string) => {
        if (dataField in viewContext.ReturnData) {
          const value = (this.formDefaultValue as any)[dataField];
          viewContext.ReturnData[dataField].Value = value;
        }
      });
    }
    // 判断完毕
    this.vCloak = true;
    this.appCode = Data.AppCode;
    this.EnableReviewExternalForm = EnableReviewExternalForm;
    window.GlobalConfig.enableReviewExternalForm = EnableReviewExternalForm;
    this.ReviewQrCodeUrl = ReviewMobileQrCodeUrl;
    this.DisplayName = Data.DisplayName;
    Data.Version = returnData.IsLightApp ? 3 : 2;
    // 兼容pc 逻辑
    Data.RuntimeContent = Data.HtmlContent;
    FormLogic.add(this.$store, Data);
    this.renderActionButtons();
    // 在内部填单模式&新增模式不做跳转
    // 不过这里跳转的意义到底是啥呢?
    if (!this.$route.query.bizObjectId && !this.$route.query.IsInternalForm && this.$route.query.mode !== 'create') {
      this.isHandleRouteChange = !!this.$route.query.bizObjectId;
      this.$router.replace({
        name: this.$route.name,
        query: { ...this.$route.query, bizObjectId: this.bizObjectId },
        params: { ...this.$route.params },
      });
    }
  }

  preGoBack () {
    // TODO
    // 当前返回方法不支持IOS左滑返回操作
    // 后续考虑统一使用路由拦截处理
    const activeElement = document.activeElement;
    // 避免输入框未执行赋值处理
    if (activeElement) {
      (activeElement as any).blur();
    }
    setTimeout(() => {
      this.goBack();
    }, 0);
  }

  /**
   * 从表单设计器过来则返回列表而不是上一层
   */
  goToList () {
    // if (this.isFromFormDesign) { // 3.0 逻辑
    //   this.$router.replace({
    //     name: 'lightListPage',
    //     query: {
    //       appCode: this.appCode,
    //       sheetCode: this.schemaCode,
    //     },
    //   });
    // } else {
    //   this.$router.goBack();
    // }
    this.$router.goBack();
  }

  // 判断是否表单初始化结束
  // isFormReady: boolean = true;

  // 返回上一页
  async goBack () {
    const state = await this.getFormState({
      bizObjectId: this.bizObjectId,
    });

    const isFormReady = state === 'init';
    // state === 'init' ? this.isFormReady = false : this.isFormReady = true;

    H3PluginDeveloper.IHidePreLoader();
    if (this.$h3.modal.shown) {
      return;
    }
    if (window.GlobalConfig.isOpenQuery) {
      this.$router.goBack();
    } else if (
      !this.schemaCode ||
      (this.schemaCode && window.GlobalConfig.schemaCode && this.schemaCode === window.GlobalConfig.schemaCode) ||
      (window.GlobalConfig.menuCode && !window.GlobalConfig.isList)
    ) {
      closeApp();
    } else if (this.footerPopup) {
      this.footerPopup = !this.footerPopup;
    } else {
      if (
        this.responseContext.FormMode !== FormMode.View &&
        this.responseContext.FormMode !== FormMode.Readonly
      ) {
        const viewModelForm = this.$store.state.Form.ViewModel[
          this.bizObjectId
        ];
        if (viewModelForm && viewModelForm.$dirtyChanged && isFormReady) {
          const self = this;
          const isCreateMode = this.responseContext.FormMode === 2;
          const content = {
            title: `数据${isCreateMode ? '未保存' : '已更改'}，确定离开吗?`,
            content: `离开后将会放弃本次${isCreateMode ? '填写' : '更改'}的内容`,
          };
          self.$h3.modal.show({
            ...content,
            type: 'alert',
            actions: [
              {
                text: '取消',
                onPress: () => {
                  self.isGoBackModal = false;
                },
              },
              {
                text: '确定',
                onPress () {
                  self.isGoBackModal = false;
                  // self.$router.goBack();
                  self.goToList();
                },
              },
            ],
          });
          this.isGoBackModal = true;
        } else {
          // this.$router.goBack();
          this.goToList();
        }
      } else {
        // this.$router.goBack();
        this.goToList();
      }
    }
    const solutionStates = window.GlobalConfig.solutionStates;
    const solutionType = window.GlobalConfig.solutionType;
    const hasSend = window.localStorage.getItem('hasSend');
    if (
      solutionStates &&
      solutionStates.indexOf(SolutionState.Expire) > -1 &&
      solutionType !== SolutionTypes.APass
    ) {
      this.$h3.modal.hide();
    }
    if (
      solutionStates &&
      solutionStates.indexOf(SolutionState.WillExpire) > -1 &&
      !hasSend
    ) {
      // nothing to do
    } else if (
      window.GlobalConfig.isAdmin &&
      !hasSend &&
      (solutionStates.indexOf(SolutionState.FileSizeExceed) > -1 ||
        solutionStates.indexOf(SolutionState.FileSizeWillExceed) > -1)
    ) {
      if (!this.$h3.modal.show.length) {
        this.$h3.modal.hide();
      }
    }
    this.$store.state.isClickCommentButton = false;
  }

  handleClick (actionItem) {
    const activeElement = document.activeElement;
    // 避免输入框未执行赋值处理
    if (activeElement) {
      (activeElement as any).blur();
    }
    setTimeout(() => {
      this.buttonClicked(actionItem);
    }, 0);
  }

  // 提交，保存按钮
  async buttonClicked (actionItem) {
    // if (!window.navigator.onLine) {
    //   H3PluginDeveloper.IShowWarn('提示', '网络不给力，请稍后再试');
    //   return;
    // }
    const self = this;
    const commentItem = actionItem;
    const state = await self.getFormState({
      bizObjectId: this.bizObjectId,
    });
    if (state === 'update') {
      H3PluginDeveloper.IShowWarn(
        '提示',
        '本次操作相关的计算还未执行完，请稍后再试',
      );
      return;
    }
    // 重置表单的脏值检测
    this.$store.commit(
      `Form/ViewModel/${this.bizObjectId}/${Mutation.RESETDIRTY}`,
    );
    // 此处判断转发
    commentItem.DoAction = function () {
      if (commentItem.OnAction) {
        return commentItem.OnAction.apply(commentItem);
      } else {
        if (commentItem.Action) {
          const okFunction = function (t) {
            self.dispatchDoAction(commentItem, commentItem.Text, null);
          };
          // 移动端，删除数据时提示功能
          if (commentItem.Action === 'Remove') {
            H3PluginDeveloper.IConfirm(
              '提示',
              '确定删除此条数据吗？',
              () => {},
            );
          } else if (commentItem.Action === 'CancelInstance') {
            H3PluginDeveloper.IConfirm(
              '提示',
              '确定作废此条流程吗？',
              () => {},
            );
          } else {
            return self.dispatchDoAction(commentItem, commentItem.Text, null);
          }
        }
      }
    };
    // 判断按钮规则，通过数组循环的方式调用匹配器和触发器，取代之前冗长的if-else
    const actionTypeRules = [
      {
        match () {
          return (
            commentItem.Action === 'Submit' &&
            (self.responseContext.InstanceId ||
              self.responseContext.WorkItemId) &&
            !self.responseContext.IsCreateMode &&
            self.responseContext.WorkflowState !== 4 &&
            self.responseContext.WorkItemType === 2
          );
        },
        async action () {
          const pageValid = await self.validateControls(commentItem.Action);
          if (pageValid) {
            self.$router.push({
              name: 'approve',
              params: {
                commentPlaceholder: self.commentPlaceholder,
                commmentItem: JSON.stringify(commentItem),
                destActivity: self.destActivity,
                fromRoute: self.fromRoute.toString(),
                bizObjectId: self.bizObjectId,
                currentCommentId: self.currentCommentId,
              },
            });
          }
        },
      },
      {
        match () {
          return commentItem.Action === 'Submit' || commentItem.Action === 'Save';
        },
        async action () {
          const pageValid = await self.validateControls(commentItem.Action);
          const option = {};
          if (pageValid) {
            self.dispatchDoAction(commentItem, commentItem.Text, null, option);
          }
        },
      },
      {
        match () {
          return commentItem.Action === 'Reject';
        },
        action () {
          self.commentPlaceholder = '请输入您的审批意见';
          self.$router.push({
            name: 'approve',
            params: {
              commentPlaceholder: self.commentPlaceholder,
              commmentItem: JSON.stringify(commentItem),
              destActivity: self.destActivity,
              fromRoute: self.fromRoute.toString(),
              bizObjectId: self.bizObjectId,
              currentCommentId: self.currentCommentId,
            },
          });
        },
      },
      {
        match () {
          return commentItem.Action === 'Edit';
        },
        action () {
          self.$router.replace({
            name: self.$route.name,
            params: {
              schemaCode: self.responseContext.SchemaCode,
              bizObjectId: self.responseContext.BizObjectId,
              isExternalForm: self.isExternalFormBol ? '1' : '',
              mode: '0',
              fromEdit: 'true',
              fromBoard: self.fromBoard ? 'true' : 'false',
            },
            query: {
              refleshRoute: '2',
              schemaCode: self.responseContext.SchemaCode,
              bizObjectId: self.responseContext.BizObjectId,
            },
          });
        },
      },
      {
        match () {
          return commentItem.Action === 'LinkToSns';
        },
        action () {
          const snscounts = commentItem.Text.substring(
            commentItem.Text.indexOf('(') + 1,
            commentItem.Text.indexOf(')'),
          );
          if (snscounts !== '0') {
            self.$router.push({
              name: 'snslist',
              params: {
                schemaCode: self.schemaCode || window.GlobalConfig.schemaCode,
                bizObjectId:
                  self.bizObjectId || self.responseContext.BizObjectId,
              },
            });
          } else {
            self.$router.push({
              name: 'snscomment',
              params: {
                preRoute: 'form',
                schemaCode: self.schemaCode || window.GlobalConfig.schemaCode,
                bizObjectId:
                  self.bizObjectId || self.responseContext.BizObjectId,
              },
            });
          }
        },
      },
      {
        match () {
          return (
            commentItem.Action === 'QrCode' ||
            commentItem.Action === 'ExternalShare'
          );
        },
        async action () {
          let schemaCode = '';
          if (self.realSchemaCode) {
            schemaCode = self.realSchemaCode;
          } else {
            schemaCode = window.GlobalConfig.schemaCode;
          }
          if (self.islightapp) {
            self.$router.push({
              name: 'lightshare',
              query: {
                displayName: self.responseContext.Name,
                bizObjectId: self.responseContext.BizObjectId,
                schemaCode,
              },
            });
          } else {
            self.$router.push({
              name: 'share',
              params: {
                displayName: self.responseContext.Name,
                bizObjectId: self.responseContext.BizObjectId,
                schemaCode,
                appCode: self.appCode,
                action: commentItem.Action,
              },
            });
          }
        },
      },
      {
        match () {
          return commentItem.Action === 'CancelInstance';
        },
        action () {
          // 有问题
          H3PluginDeveloper.IConfirm('提示', '确定作废此条流程吗?', ev => {
            if (ev) {
              self.dispatchDoAction(commentItem, commentItem.Text, null);
            }
          });
        },
      },
      {
        match () {
          return commentItem.Action === 'Remove';
        },
        action () {
          // 有问题
          H3PluginDeveloper.IConfirm('提示', '确定删除此条数据吗?', ev => {
            if (ev) {
              self.dispatchDoAction(commentItem, commentItem.Text, null);
            }
          });
        },
      },
      {
        match () {
          return commentItem.Action === 'Forward';
        },
        action () {
          self.$router.push({
            name: 'forwardSelect',
            params: {
              actionControl: commentItem,
              bizObjectId: self.bizObjectId,
            },
          });
        },
      },
      {
        match () {
          return true;
        },
        action () {
          const option = {};
          self.dispatchDoAction(commentItem, commentItem.Text, null, option);
        },
      },
    ];
    // 进行循环逻辑判断
    for (const rule of actionTypeRules) {
      if (rule.match()) {
        rule.action();
        break;
      }
    }
    this.$root.eventHub.$emit('form-button-clicked');
  }

  // 自定义校验每个控件
  validateControls (actionName) {
    const controlRender = this.$refs.controlRender as Vue;
    const controls = controlRender.$children;
    const viewValid = controls.every((control: any) => {
      if (control.dataField && control.validate) {
        return control.validate();
      } else {
        return true;
      }
    });
    if (!viewValid) {
      return false;
    }
    return this.doLogicValidate({
      bizObjectId: this.bizObjectId,
      actionName,
    }).then(validResult => {
      const controlComponents = (this.$refs.controlRender as Vue).$children;
      const { pass, invalidControl } = validResult;
      if (!pass) {
        // 校验失败，页面滚动到第一个校验失败的控件，并且内部input和textarea聚焦
        for (const control of controlComponents) {
          const container = document.getElementById('form-page');
          const ctrl: any = control;
          let newCtrl: any = null;
          if (ctrl.dataField === invalidControl) {
            if (ctrl.isFormGridView) {
              newCtrl = ctrl;
              // TODO 禁止使用label for循环
              if (ctrl.valid.gridChildErr) {
                for (let i = 0; i < ctrl.$children.length; i++) {
                  let breakLoop = false;
                  const iChildItem = ctrl.$children[i];
                  for (let j = 0; j < iChildItem.$children.length; j++) {
                    const jChildItem = iChildItem.$children[j];
                    const valid = jChildItem.valid;
                    if (jChildItem.isIngrid && valid) {
                      if (valid.empty || valid.custom) {
                        newCtrl = jChildItem;
                        breakLoop = true;
                        break;
                      } else if (valid.value) {
                        // 有值, 但格式不对, 也要报错;
                        newCtrl = jChildItem;
                        breakLoop = true;
                        break;
                      }
                    }
                  }
                  if (breakLoop) {
                    break;
                  }
                }
              }
            } else {
              newCtrl = ctrl;
            }

            if (!newCtrl) {
              continue;
            }
            const el = newCtrl.$el as HTMLElement;
            const scrollTop = el.offsetTop;
            if (container) {
              container.scrollTop = scrollTop;
            }
            const input: HTMLElement | null = el.querySelector(
              'input, textarea,.form-text-box.control-error',
            );
            // const scrollTop = input.offsetTop || input.getBoundingClientRect().top;
            // if (container) {
            //   container.scrollTop = scrollTop;
            // }
            if (input) {
              input.focus();
            }
            if (newCtrl.valid.empty) {
              this.showValidMsg(newCtrl.valid.message || '请填写必填信息');
            }

            if (newCtrl.valid.message) {
              this.showValidMsg(newCtrl.valid.message || '');
            }
            break;
          }
        }
      }
      // const scrollToControl = this.$refs.controlRender
      return pass;
    });
  }

  // 分发提交
  async dispatchDoAction (item, text, attachments, reqParams = {}) {
    const self = this;
    const schemaCodeExternal =
      this.schemaCode || window.GlobalConfig.schemaCode;
    const displayName = this.DisplayName;
    const bizObjectId = this.bizObjectId;
    const reviewQrCodeUrl = this.ReviewQrCodeUrl;
    const enableReviewExternalForm = this.EnableReviewExternalForm;
    try {
      const response = await this.doLogicAction({
        bizObjectId,
        actionControl: item,
        inputCommnets: text,
        attachments,
        reqParams,
      });
      if (response && response.Successful) {
        this.doAfterSubmit({
          action: item.Action,
          responseValue: response.ReturnData.StartFormResponse,
          bizObjectId,
        });
        H3PluginDeveloper.IHidePreLoader();
        if (item.Action === 'Submit') {
          if (
            self.responseContext.IsCreateMode &&
          self.appCode !== 'Sys_Workflow'
          ) {
            self.$store.dispatch('Home/recordForm', self.schemaCode);
          }
          resultHandler(
            item,
            response.ReturnData.StartFormResponse,
            self,
            bizObjectId,
            self.isExternalFormBol,
            schemaCodeExternal,
            reviewQrCodeUrl,
            displayName,
            enableReviewExternalForm,
          );
        } else {
          if (
            item.Action === 'Save' &&
          self.responseContext.IsCreateMode &&
          self.appCode !== 'Sys_Workflow'
          ) {
            self.$store.dispatch('Home/recordForm', self.schemaCode);
          }
          resultHandler(
            item,
            response.ReturnData.StartFormResponse,
            self,
            bizObjectId,
          );
        }
      }
    } catch (e) {
      H3PluginDeveloper.IHidePreLoader();
      this.$toast.show({ text: '出错了，请检查网络或联系管理员' });
    }
  }

  @appModule.Action(AppActionType.GetAppList) getAppList;

  @State('UserInfo') userInfo;

  async backToHome () {
    this.$store.state.appCode = this.appCode;
    const ret = await this.getAppList();
    const apps = ret.Apps;
    if (
      apps.length === 1 &&
      apps[0] !== 'Sys_Workflow' &&
      !this.userInfo.isAdministrator
    ) {
      this.$store.state.backFromScanForm = true;
    }
    this.$router.replace({
      name: 'home',
    });
    window.GlobalConfig.bizObjectId = '';
    window.GlobalConfig.schemaCode = '';
    window.GlobalConfig.workitemId = '';
    window.GlobalConfig.menuCode = '';
    window.GlobalConfig.isExternalForm = false;
    window.GlobalConfig.isExternalShare = false;
    window.GlobalConfig.isFromNotice = false;
  }

  // 过滤按钮
  renderActionButtons () {
    const actionsArr: any[] = [];
    for (const action in this.responseContext.Actions) {
      if (
        Object.prototype.hasOwnProperty.call(
          this.responseContext.Actions,
          action,
        )
      ) {
        actionsArr.push(this.responseContext.Actions[action]);
      }
    }
    // 二维码在创建模式，或者外链查看状态，或者外链分享状态，不需要显示
    if (
      !this.responseContext.IsCreateMode &&
      !this.isExternalFormBol &&
      !this.isExternalShareBol
    ) {
      const shareAction = { Action: 'QrCode', Icon: '', Text: '二维码' };
      if (
        actionsArr.length &&
        actionsArr[actionsArr.length - 1].Action === 'Remove'
      ) {
        actionsArr.splice(actionsArr.length - 1, 0, shareAction);
      } else {
        actionsArr.push(shareAction);
      }
    }

    if (this.fromEdit === 'true' || this.$route.query.refleshRoute === '2') {
      this.buttonActions = actionsArr.filter(btn => btn.Action === 'Submit');
    }
    // 针对老数据, 强行显示提交按钮, 有风险...
    // 这个修复会导致分享表单页显示提交按钮, isExternalShareBol 的判断不生效; 先注释修改
    // 外链表单只有一个提交按钮
    // 问题产生原因，有一部分老数据(3.0外链功能存在之前的老数据)外链缺失提交按钮（后端兼容处理）
    // 代码逻辑有问题，需要确认为什么有时外了表单不显示提交按钮，此处代码可以先注释
    // else if (
    //   this.responseContext.IsCreateMode &&
    //   this.isExternalFormBol &&
    //   !this.isExternalShareBol
    // ) {
    //   // 后端代码控制隐藏了，外链是否还要显示的问题
    //   this.buttonActions = [{
    //     Action: 'Submit',
    //     Icon: 'h3yun_All check',
    //     Text: '提交',
    //     IsPrintAction: false,
    //     PrintTemplateCode: null,
    //     SortKey: 0,
    //     CommentConfig: null,
    //   }];
    // }
    else {
      this.buttonActions = actionsArr;
    }
    // this.buttonActions = actionsArr;
  }

  /**
   * 设置当前页面的表单数据缓存
   */
  setPageCache (schemaCode, bizObjectId) {
    const currentKey = schemaCode + bizObjectId || '';
    const currentCacheData = this.$getDataCache(currentKey);
    if (!currentCacheData && currentKey) {
      this.$setDataCache(currentKey, {
        schemaCode: this.schemaCode,
        bizObjectId: this.bizObjectId,
        appCode: this.appCode,
        workItemId: this.workItemId,
        DisplayName: this.DisplayName,
        fromHome: this.fromHome,
        fromBoard: this.fromBoard,
      });
    }
  }

  // 过滤表单
  filterFormData (forms, renderControls) {
    // 过滤人员单、多选，部门单，多选
    const newRenderControls = renderControls.filter((item) => {
      const dataField = item.dataField;
      // 明细表时
      if (item.controlKey === 'FormGridView') {
        this.filterGridControls(forms, dataField);
      }
      // 人员单/多选，部门单/多选控件，关联表单, 隐藏不做校验，
      if (item.controlKey === 'FormUser' || item.controlKey === 'FormMultiUser') {
        forms[dataField].visible = false;
      }
      return item.controlKey !== 'FormUser' && item.controlKey !== 'FormMultiUser' &&
      item.dataField !== 'CreatedTime' && item.dataField !== 'ModifiedTime';
    });
    forms.$renderControls = [...newRenderControls];
    return forms;
  }

  // 过滤明细表
  filterGridControls (forms, dataField) {
    const gridForm = forms[dataField];
    const controls = gridForm.controls;
    const newControls = controls.filter(item => {
      const rowsValue = gridForm.value;

      // 明细表 人员单/多选，部门单/多选控件，隐藏不做校验，
      for (const row of rowsValue) {
        const gridObj = gridForm[row];
        Object.keys(gridObj).forEach(items => {
          const options = gridObj[items].options;
          if (options && (options.controlkey === 'FormUser' ||
          options.controlkey === 'FormMultiUser')) {
            gridObj[items].visible = false;
          }
        });
      }
      return item.controlKey !== 'FormUser' && item.controlKey !== 'FormMultiUser';
    });
    gridForm.controls = [...newControls];
  }

  /**
   * 获取相应表单数据缓存
   */
  getPageCache (schemaCode, bizObjectId) {
    const targetKey = schemaCode + bizObjectId || '';
    const targetCacheData = this.$getDataCache(targetKey);
    return targetCacheData;
  }

  get responseContext () {
    // 表单页面进入表单页面测试
    if (this.$store.state.Form.ViewModel && this.$store.state.Form.ViewModel[this.bizObjectId]) {
      return this.$store.state.Form.ViewModel[this.bizObjectId]
        .$responseContext;
    }
    return {};
  }

  get islightapp () {
    if (this.$store.state.Form.ViewModel && this.$store.state.Form.ViewModel[this.bizObjectId]) {
      return this.$store.state.Form.ViewModel[this.bizObjectId]
        .$responseContext.IsLight;
    }
    return false;
  }

  // // 判断是否需要workflow-state 流程状态组件
  get isCommentShow () {
    const context = this.responseContext;
    return (
      !context.IsCreateMode &&
      context.InstanceId &&
      context.WorkItems &&
      !this.isExternalShareBol
    );
  }

  beforeRouteLeave (to, from, next) {
    // console.log('form routerleave', to.name, from.name);
    // 判断路由切换到哪个页面，判断是否需要缓存
    const pageMap = 'boardEntry list lightListPage apps singleApp schemas secFormPage blankForm report todo myWork flowview formPage home approval fillsheet myapplication circulate startWorkflow openquery'.split(
      ' ',
    );
    if (
      pageMap.some(n => to.name === n) ||
      ((to.name === 'boardEntry' || to.name === 'list' || to.name === 'lightListPage' || to.name === 'openquery') && to.query.schemaCode === this.schemaCode)
    ) {
      // 不缓存formPage
      this.$store.state.excludeComp = ['formPage', 'sheethome'];
      // 处理IShowForm的问题，如果是表单内的跳转，不要销毁FormLogic
      if (this.bizObjectId && to.name !== 'formPage') {
        // this.destroyFormLogic({ bizObjectId: this.bizObjectId });
        FormLogic.destroy({
          store: this.$store,
          bizObjectId: this.bizObjectId,
        });
      }
      this.scrollTop = 0;
      // 初始化动作
    } else {
      // 缓存formPage
      this.$store.state.excludeComp = [];
      // 记录滚动距离
      const dom = document.getElementById('form-page');
      if (dom) {
        this.scrollTop = dom.scrollTop;
      }
    }
    // 有开发者参数【排除前往关联表单页面】
    if (this.ContainsDevParams === 1 && to.name !== 'formquery') {
      window.GlobalConfig.globalCache.pop();
      window.GlobalConfig.callbackCache.pop();
    }
    if (from.name === 'secFormPage' && to.name === 'formPage') {
      this.$destroy();
    }
    if (
      (to.name === 'formquery' && from.name === 'formPage') ||
      (to.name === 'formquery' && from.name === 'formQueryPage') ||
      (to.name === 'formquery' && from.name === 'secFormPage')
    ) {
      this.setPageCache(this.schemaCode, this.bizObjectId);
    }
    next();
  }

  @Watch('$route')
  routeChange (to, from) {
    // 当前页面跳走，跳走时缓存当前页面数据;
    // 若跳走时有缓存，说明是往回跳，所以要清除掉对应缓存
    if (!this.isHandleRouteChange) {
      this.isHandleRouteChange = true;
      return;
    }
    if (to.name === 'formPage' && to.query.reScroll === '1') {
      document.querySelector('#form-page').scrollTop = 0;
    }
    if (
      (to.name === 'formPage' && from.name === 'formPage') ||
      (to.name === 'secFormPage' && from.name === 'secFormPage')
    ) {
      const currentKey = from.query.schemaCode + from.query.bizObjectId || '';
      const currentCacheData = this.$getDataCache(currentKey);
      if (!currentCacheData && currentKey) {
        this.$setDataCache(currentKey, {
          schemaCode: this.schemaCode,
          bizObjectId: this.bizObjectId,
          appCode: this.appCode,
          workItemId: this.workItemId,
          DisplayName: this.DisplayName,
        });
      }
      const targetKey = to.query.schemaCode + to.query.bizObjectId || '';
      // 目标页面数据缓存，有缓存用缓存 无缓存发请求
      const targetCacheData = this.$getDataCache(targetKey);
      // 当前页面跳走，跳走时缓存当前页面数据;
      // 若跳走时目标页面有缓存，说明是往回跳，所以要清除掉对应缓存
      // 关联表单间跳转
      if (
        to.query.refleshRoute === '1' ||
        to.query.refleshRoute === '2' ||
        !to.query.bizObjectId
      ) {
        this.initFormPageData();
      } else {
        this.initFormPageData(targetCacheData);
      }
    }

    if (to.name === 'formPage' && from.name === 'formquery') {
      // 如果是从关联表单列表页面返回到第一层表单页面 那么获取缓存数据
      const bizObjectId = from.params.bizObjectId || this.primaryBizObjectId;
      const schemaCode = to.query.schemaCode || this.responseContext.SchemaCode;
      const targetCacheData = this.getPageCache(schemaCode, bizObjectId);
      this.initFormPageData(targetCacheData);
    }
    if (to.name === 'formquery' && from.name === 'formQueryPage') {
      // 如果是从 第二层表单 -> 到第二层关联表单列表页 [情况一]
      // 或者是从 第二层表单 -> 返回第一层关联表单列表页 [情况二]
      if (
        Object.keys(to.params).length < 1 ||
        to.params.bizObjectId === this.primaryBizObjectId
      ) {
        // [情况二]
        this.setSecondaryForm(false);
      }
      this.setPageCache(this.schemaCode, this.bizObjectId);
    }
    if (to.name === 'formquery' && from.name === 'formPage') {
      // 如果是从 第一层表单 -> 到第一层关联表单列表页
      this.setPageCache(this.schemaCode, this.bizObjectId);
    }
    if (
      to.name === 'formQueryPage' &&
      from.name === 'formquery' &&
      to.query.refleshRoute === '3'
    ) {
      // 如果是从 第二层关联表单列表页 -> 返回第二层表单 [情况一]
      // 或者是从 第一层关联表单列表页 -> 新增第二层表单 [情况二]
      if (from.params.isSecondaryForm) {
        const bizObjectId = from.params.bizObjectId || this.primaryBizObjectId;
        const targetCacheData = this.getPageCache(
          to.query.BOSchemaCode,
          bizObjectId,
        );
        if (targetCacheData) { // #48257
          this.initFormPageData(targetCacheData);
        }
      } else {
        // [情况二]
        this.initFormPageData();
      }
    }

    if (from.name === 'formquery' && to.name === 'secFormPage' && to.query.refleshRoute === '2') {
      const bizObjectId = from.params.bizObjectId || this.primaryBizObjectId;
      const schemaCode = to.query.schemaCode || this.responseContext.SchemaCode;
      const targetCacheData = this.getPageCache(schemaCode, bizObjectId);
      if (targetCacheData) { // 这里需要判断是否存在，否则会二次进来
        this.initFormPageData(targetCacheData);
      }
    }
  }

  @Watch('isKeyboardShow')
  KeyboardShowChange (val) {
    this.hasBottom = val;
  }
}
</script>
<style lang='less'>
@import '../../styles/reset.css';
@import '../../../packages/styles/mixins';
@import '../../../packages/styles/icon/iconfont.css';

@font-color-blue: #107fff;
@gird-form-font-size: 30;
@gird-form-font-color: #666666;

#form-page.bottomHide {
    .px2rem(bottom, 0);
  }
 #form-page{
  position: absolute;
  top: 0;
  right: 0;
  .px2rem(bottom, 99);
  left: 0;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  height: auto;
  // background-color: #fff;
  -webkit-overflow-scrolling: touch;
  textarea::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #999;
    font-size: 15px;
    font-family: 'PingFang-SC-Regular', 'PingFang-SC';
  }
  textarea::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #999;
    font-size: 15px;
    font-family: 'PingFang-SC-Regular', 'PingFang-SC';
  }
  textarea:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #999;
    font-size: 15px;
    font-family: 'PingFang-SC-Regular', 'PingFang-SC';
  }
  a {
    display: inline-block;
  }
  a:active {
    background-color: #f2f3f5;
    color: @font-color-blue;
  }
  .cover {
    position: absolute;
    top: 0;
    right: 0;
    width: 65.6%;
    height: 100%;
    opacity: 0;
  }
  .aufont {
    font-family: 'aufont' !important;
  }

  .approver{
    background: #fff;
    // margin-top: 10px;
    .px2rem(margin-top, 10);
    .px2rem(margin-bottom, 10);
  }
  .form-child-wrapper{
    // .px2rem(margin-bottom, 98);
  }
  #form-wrap {
    position: relative;
    .px2rem(margin-top, 15);
    background: #fff;
    -webkit-overflow-scrolling: touch;
  }

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

  .no-scrolling {
    -webkit-overflow-scrolling: auto !important;
  }
  .form-child-wrapper {
    //height: calc(~"100% + 1px");
    min-height: calc(~'100% + 1px');
    .static-grid-header {
      top: 0;
      width: calc(~'100% - 15px');
      .px2rem(font-size, 34);
      .px2rem(margin-left, 30);
      font-weight: 600;
      color: #333;
    }
    .static-grid-child-header {
      width: calc(~'100% - 30px');
      .px2rem(top, 90);
      .px2rem(margin-left, 60);
      .px2rem(font-size, @gird-form-font-size);
      color: @gird-form-font-color;
    }
    .static-grid-header,
    .static-grid-child-header {
      position: fixed;
      z-index: 999;
      // width: 100%;
      box-sizing: border-box;
      .px2rem(height, 90);
      .px2rem(line-height, 90);
      .px2rem(padding-right, 30);
      background-color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .hairline('bottom', #eee);
      .icon-base-down {
        .px2rem(font-size, 24);
      }
    }
  }
}
.back-to-home-btn {
  position: fixed;
  .px2rem(bottom, 126);
  .px2rem(width, 98);
  .px2rem(height, 98);
  .px2rem(right, 44);
  background-color: white;
  color: @font-color-blue;
  border-radius: 50%;
  /* text-align: center; */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px 0 @font-color-blue;
  z-index: 103; // p{
  //     .px2rem(width,48);
  // }
  span {
    .px2rem(width, 48);
  }
}
.no-transform {
  transform: none !important;
}
.form-page__bottom {
  .px2rem(padding-bottom, 400) !important;
}

@keyframes stamp {
  from {
    opacity: 1;
    transform: scale(0.1) rotate(30deg);
    transform-origin: center bottom;
  }

  50% {
    opacity: 1;
    transform: rotate(-8deg);
  }

  70% {
    opacity: 1;
    transform: rotate(1deg);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
// @keyframes stamp {
//   0% {
//     opacity: 1;
//     transform: scale3d(1.8, 1.8, 1);
//     filter: saturate(0.5);
//   }

//   18% {
//     transform: scale3d(1.82, 1.82, 1);
//     filter: saturate(0.5);
//   }

//   50% {
//     transform: scale3d(1, 1, 1);
//     filter: saturate(0.5);
//   }

//   75% {
//     transform: scale3d(1, 1, 1);
//     filter: saturate(0.75);
//   }

//   100% {
//     transform: scale3d(1, 1, 1);
//     filter: saturate(1);
//     opacity: 1;
//   }
// }
</style>
