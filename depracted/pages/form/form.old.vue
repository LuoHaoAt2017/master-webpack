<template>
    <view-box id="form-page" v-show='vCloak'>
        <x-header slot="header" class="dp-font34" v-if="!$store.state.corpId&&!isExternalFormBol&&!EnableReviewExternalForm&&!isExternalShareBol" :left-options="{preventGoBack:true}" @on-click-back="goBack()">
            {{DisplayName}}
        </x-header>
        <!-- <div class="form-wrapper" ref="formWrapper"> -->
        <div class="form-child-wrapper">
            <form-comment class='form-comment' :EnableReviewExternalForm="EnableReviewExternalForm" v-if='isCommentShow&&noEditBtnActive&&responseContext.WorkItems&&!isExternalShareBol' :class="{'form-content-margin':!$store.state.corpId&&!EnableReviewExternalForm&&!isExternalShareBol}"></form-comment>
            <blog-post ref='viewBoxBody' id='form-wrap' v-if="isBlogPostShow" :class="{'form-content-margin':!$store.state.corpId && !isCommentShow&&!isExternalFormBol&&!EnableReviewExternalForm&&!isExternalShareBol}"
                :sortedArr='sortedArr' :propValue="propValue" :schemaCode="schemaCode" class="formContent" @getChildrenLen="getChildrenLen"
                @getGridLen='getGridLen'>
                <div slot='stamp' class="stamp-pic stamp-pic-done" v-if="(responseContext.WorkflowState==5||responseContext.WorkflowState==4)&&noEditBtnActive&&!isExternalShareBol">
                <!-- <div slot='stamp' class="stamp-pic stamp-pic-done" :class="[stampBol?'stamp-pic-done':'stamp-pic-start']" v-if="(responseContext.WorkflowState==5||responseContext.WorkflowState==4)&&noEditBtnActive"> -->
                    <img src="../../assets/img/zuofei.png" alt="图片" v-if="responseContext.WorkflowState==5 || (responseContext.WorkflowState==4&&responseContext.InstanceApproval==0)">
                    <img src="../../assets/img/shenpitongguo.png" alt="图片" v-if="responseContext.WorkflowState==4&&responseContext.InstanceApproval==1">
                </div>
            </blog-post>
        </div>
        <!-- </div> -->
        <div slot="bottom" class="bd-top footer" v-if="responseContextActions">
            <a href="Javascript:;" class="dp-font32 bd-top" v-for="item in showButtons" :key='item.Text' @click="buttonClicked($event,item, item.Text)">
                {{item.Text}}
            </a>
            <a href="Javascript:;" v-if="isActionHide&&hideButtons.length>0" @click="showMoreActions" class="dp-font32 bd-top">更多</a>
            <div class="back-to-home-btn" @click='backToHome' v-if='!isFromNotice&&!isExternalFormBol&&!isExternalShareBol'>
                <span class="dp-font22">返回首页</span>
            </div>
            <transition :duration='100' enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
                <div class="popupBtn" @touchstart="popDown" v-show="isPopUp">
                    <div class="popup-btn-sheet">
                        <div class="popup-btn-ctn">
                            <a href="Javascript:;" class="dp-font32" v-for="item in hideButtons" :key='item.Text' @click="buttonClicked($event,item, item.Text, responseContext)">
                                {{item.Text}}
                            </a>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <input type="hidden" :title="childLen">
    </view-box>
</template>
<script>
import { XHeader, ViewBox } from 'vux';
import math from '../../lib/math';
import '../../utils/pre-view';
import { initFormData } from '../../service/get-data';
// 引入执行自定义代码文件
import SmartForm from '../../lib/smart-form';
import { getDomPropertys, parseDom, parseUrlParam } from '../../config/common';
import { SolutionState, SolutionTypes} from '../../config/license';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { setTitle, setLeft, closeApp } from '../../config/dingtalk-interface';
import formLocalStorage from './js/form-local-storage';
import preventBodyScrollMixin from '../../mixins/prevent-body-scroll';
import { HomeActionType } from '@/store/modules/home/types';
import FormComment from '../../components/forms/common-controls/form-comment.vue';
/* eslint-disable global-require */

const FormTextBox = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-text-box.vue')), 'FormTextBox');
const FormRadioButtonList = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-radio-button-list.vue')), 'FormRadioButtonList');
const FormDropDownList = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-drop-down-list.vue')), 'FormDropDownList');
const FormCheckboxList = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-checkbox-list.vue')), 'FormCheckboxList');
const FormNumber = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-number.vue')), 'FormNumber');
const FormFormula = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-formula.vue')), 'FormFormula');
const FormTextArea = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-text-area.vue')), 'FormTextArea');
const FormDateTime = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-date-time.vue')), 'FormDateTime');
const FormCheckbox = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-checkbox.vue')), 'FormCheckbox');
const FormTitle = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-title.vue')), 'FormTitle');
const FormUser = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-user.vue')), 'FormUser');
const FormMultiUser = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-multi-user.vue')), 'FormMultiUser');
const FormAttachment = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-attachment.vue')), 'FormAttachment');
const FormPhoto = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-photo.vue')), 'FormPhoto');
const FormQuery = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-query.vue')), 'FormQuery');
const FormMultiQuery = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-multi-query.vue')), 'FormMultiQuery');
const FormAreaSelect = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-area-select.vue')), 'FormAreaSelect');
const FormButton = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-button.vue')), 'FormButton');
const FormMap = r => require.ensure([], () =>
  r(require('../../components/forms/common-controls/form-map.vue')), 'FormMap');
const FormSeqNo = r => require.ensure([], () =>
  r(require('../../components/forms/system-controls/form-seq-no.vue')), 'FormSeqNo');
const FormLabel = r => require.ensure([], () =>
  r(require('../../components/forms/system-controls/form-label.vue')), 'FormLabel');
const FormGridView = r => require.ensure([], () =>
  r(require('../../components/forms/layout-controls/form-grid-view.vue')), 'FormGridView');
/* eslint-enable global-require */
export default {
  name: 'formPage',
  components: {
    XHeader,
    ViewBox,
    FormComment,
    // 创建渲染该表单所有数据的父组件
    'blog-post': {
      props: ['sortedArr', 'propValue', 'schemaCode'],
      // slot:'stamp',
      // 初始化改表单的所有组件
      render(h) {
        const children = [];
        let gridLen = 0;
        if (this.propValue) {
          for (const obj of this.sortedArr) {
            if (obj.controlkey === undefined) {
              continue;
            }
            const key = obj.dataField;
            switch (obj.controlkey) {
              case 'FormTitle':
                children.push(h(FormTitle, {
                  props: { formVal: obj },
                }));
                break;
              case 'FormTextBox':
                children.push(h(FormTextBox, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormCheckboxList':
                children.push(h(FormCheckboxList, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormDropDownList':
                children.push(h(FormDropDownList, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormRadioButtonList':
                children.push(h(FormRadioButtonList, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormNumber':
                children.push(h(FormNumber, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormFormula':
                children.push(h(FormFormula, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormTextArea':
                children.push(h(FormTextArea, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormDateTime':
                children.push(h(FormDateTime, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormCheckbox':
                children.push(h(FormCheckbox, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormUser':
                children.push(h(FormUser, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormMultiUser':
                children.push(h(FormMultiUser, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormMap':
                children.push(h(FormMap, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormAttachment':
                children.push(h(FormAttachment, {
                  props: {
                    formVal: this.propValue[obj.dataField],
                    keyName: key,
                    schemaCode: this.schemaCode,
                  },
                }));
                break;
              case 'FormPhoto':
                children.push(h(FormPhoto, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormQuery':
                children.push(h(FormQuery, {
                  props: {
                    formVal: this.propValue[obj.dataField],
                    keyName: key,
                    schemaCode: this.schemaCode,
                  },
                }));
                break;
              case 'FormMultiQuery':
                children.push(h(FormMultiQuery, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormAreaSelect':
                children.push(h(FormAreaSelect, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormButton':
                children.push(h(FormButton, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormSeqNo':
                children.push(h(FormSeqNo, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormLabel':
                children.push(h(FormLabel, {
                  props: { formVal: this.propValue[obj.dataField], keyName: key },
                }));
                break;
              case 'FormGridView':
                if (
                  (this.propValue[obj.dataField].Value.R.length &&
                    !this.$store.state.formData.responseContext.IsCreateMode) ||
                  this.$store.state.formData.responseContext.IsCreateMode
                ) {
                  gridLen += 1;
                }
                children.push(h(FormGridView, {
                  props: {
                    formVal: this.propValue[obj.dataField],
                    keyName: key,
                    schemaCode: this.schemaCode,
                  },
                }));
                break;
              default:
                break;
            }
          }
        }
        this.$emit('getChildrenLen', children.length);
        this.$nextTick(function a() {
          this.$emit('getGridLen', gridLen);
          const $formChildren = $('.formContent').children();
          if ($('.stamp-pic').length) {
            this.$store.state.childRenderedLen = $formChildren.length - 1;
          } else {
            this.$store.state.childRenderedLen = $formChildren.length;
          }
        });
        return h('div', {}, [children, this.$slots.stamp]);
      },
    },
  },
  data() {
    return {
      propValue: '',
      sortedArr: '',
      Javascript: '',
      DisplayName: '',
      schemaCode: '',
      isPopUp: false,
      isActionHide: false,
      destActivity: '',
      postValue: {},
      groupValue: {},
      fromRoute: [],
      fromHome: false,
      loadingTitle: '加载中...',
      childComponentLen: 0,
      instanceId: '',
      mode: '',
      bizObjectId: '',
      workItemId: '',
      isCommentShow: false, // 判断是否需要comment组件
      hasPaddingTop: true,
      BOName: '',
      MappingDataField: '',
      Options: '',
      isBlogPostShow: true,
      // isInputComment:false, //是否输入审批意见
      commentItem: '',
      inputCommnets: '', // 输入意见
      commentPlaceholder: '',
      showButtons: [],
      hideButtons: [],
      stampBol: false,
      initialControlsData: {},
      isFirstGetContorlsData: true,
      isEditBol: false,
      noEditBtnActive: true,
      hasFormBeEdited: false,
      formscroll: null,
      btnUpdatedBol: false, // 判断是否是点击按钮触发的updated
      isFirstInitStamp: true,
      appCode: '',
      vCloak: false,
      scrollTop: '',
      isExternalFormBol: false,
      isExternalShareBol: false,
      isRenderHtmlBol: false, // 判断页面是否执行过smartform的load
      gridLen: 0,
      EnableReviewExternalForm: false,
      ReviewQrCodeUrl: '',
      currentCommentId: null,
      BizObjectStatus: {
        Draft: 0, // 草稿
        Effective: 1, // 审批通过或者表单提交后
        Running: 2, // 流程运行中
        Canceled: 3, // 被取消
      },
      isFromNotice: false,
      isCanBack: true,
    };
  },
  mixins: [preventBodyScrollMixin],
  created() {
    window.math = math;
    this.fromHome = this.$route.query.fromHome === '1';
    this.$store.state.childRenderedLen = 0;
    this.$store.state.gridChildLen = 0;
    this.$store.state.isFormInitFinish = false;
    this.$store.state.isHtmlChangedBol = false;
    window.SmartForm = SmartForm;
    window.H3PluginDeveloper = H3PluginDeveloper;
    // 判断是从应用还是流程页面跳转进来的
    // 接受评论数量变化
    this.$root.eventHub.$on('sns-updated', (count) => {
      for (const item of this.showButtons) {
        if (item.Action === 'LinkToSns') {
          item.Text = count > 99 ? '评论(99+)' : `评论(${count})`;
        }
      }
      for (const item of this.hideButtons) {
        if (item.Action === 'LinkToSns') {
          item.Text = count > 99 ? '评论(99+)' : `评论(${count})`;
        }
      }
    });
    this.initFormPageData();
  },
  mounted() {
    const self = this;
    $('textarea')
      .each(function b() {
        this.setAttribute('style', `height:${this.scrollHeight}px;overflow-y:hidden;`);
      })
      .on('input', function c() {
        this.style.height = 'auto';
        this.style.height = `${this.scrollHeight}px`;
      });

    // 盖章动画需要的bol值
    if (this.isFirstInitStamp) {
      setTimeout(() => {
        self.stampBol = true;
      }, 200);
      this.isFirstInitStamp = false;
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vms) => {
      const vm = vms;
      if (!vm.$router.isBack) {
        vm.fromRoute.push(from.name);
      }
      if (from.name === 'blankForm') {
        vm.noEditBtnActive = false;
      }
    });
  },
  updated() {
    if (this.btnUpdatedBol || this.$route.name !== 'formPage') {
      this.btnUpdatedBol = false;
      return;
    }
    /* eslint-disable */
    if (this._inactive) {
      this.$destroy();
    }
  },
  activated() {
    // hideRightMenu();
    const self = this;
    setTitle(this.DisplayName);
    window.backFn = function d() {
      self.goBack();
    };
    setLeft(window.backFn);
    // 设置滚动距离
    const dom = document.getElementById('vux_view_box_body');
    dom.scrollTop = this.scrollTop;
  },
  beforeRouteLeave(to, from, next) {
    // 判断路由切换到哪个页面，判断是否需要缓存
    if (
      to.name === 'schemas' ||
      to.name === 'blankForm' ||
      to.name === 'sheethome' ||
      to.name === 'report' ||
      (to.name === 'list' && $.isEmptyObject(to.params)) ||
      to.name === 'todo' ||
      to.name === 'myWork' ||
      to.name === 'flowsview' ||
      to.name === 'home' ||
      to.name === 'approval' ||
      to.name === 'fillsheet' ||
      to.name === 'myapplication' ||
      to.name === 'circulate' ||
      to.name === 'formPage' ||
      to.name === 'startWorkflow'
    ) {
      this.$store.state.excludeComp = ['formPage'];
      this.scrollTop = 0;
      // 初始化动作
      this.$router.isBack = false;
      this.$store.state.isHtmlChangedBol = false;
      this.$store.state.isFormInitFinish = false;
      this.$store.state.childRenderedLen = 0;
      this.$store.state.gridChildLen = 0;
    } else {
      // 记录滚动距离
      const dom = document.getElementById('vux_view_box_body');
      this.scrollTop = dom.scrollTop;
      this.$store.state.excludeComp =[];
    }
    if (this.ContainsDevParams === 1) {
      // 有开发者参数
      window.GlobalConfig.globalCache.pop();
      window.GlobalConfig.callbackCache.pop();
    }
    next();
  },
  methods: {
    getGridLen(val) {
      this.gridLen = val;
    },
    initFormPageData(isHashNeeded) { // 参数用来判断是否是从表单页面到表单页面，是的话就需要解析链接中的参数
      if (this.$route.params.mode && this.$route.params.instanceId) {
        this.hasPaddingTop = false;
      }
      this.showList = this.$route.params.showList ?
        this.$route.params.showList : false; // 是否右上角菜单显示列表菜单
      if (this.$route.params.showList == 'false') {
        this.showList = false;
      }
      // this.hasPaddingTop = false
      this.MappingDataField = this.$route.params.MappingDataField || '';
      this.BOName = this.$route.params.BOName || '';
      this.schemaCode = this.$route.params.schemaCode;
      this.isFromNotice = !!this.$route.params.schemaCode;
      this.bizObjectId = this.$route.params.bizObjectId || '';
      this.instanceId = this.$route.params.instanceId || '';
      this.mode = this.$route.params.mode || '';
      this.workflowCode = this.$route.params.workflowCode || '';
      this.workItemId = this.$route.params.workItemId || '';
      this.originator = this.$route.params.originator || '';
      this.WorkflowVersion = this.$route.params.WorkflowVersion || '';
      this.LinkBizObjectId = this.$route.params.LinkBizObjectId || '';

      // 是否有自定义代码参数:0-默认(无)；1：有开发者参数
      this.ContainsDevParams = this.$route.params.containsDevParams || 0;

      this.Options = { IsMobile: true, ActionName: 'MobileLoadSheet' };
      // 判断是否是同一个引擎
      formLocalStorage.Init(this.$store.state.EngineCode);
      if (this.schemaCode) {
        // *Schema编码必须传递
        this.Options.SheetCode = this.schemaCode;
        // 数据模型编码
        this.Options.SchemaCode = this.schemaCode;

        // 外链表单传递isExternalForm
        if (this.$route.params.isExternalForm) {
          this.Options.isExternalForm = this.$route.params.isExternalForm;
        }

        // 列表BOID,可传可不传
        if (this.bizObjectId) {
          this.Options.BizObjectId = this.bizObjectId;
        }
        // 工作项ID,可传可不传
        if (this.workItemId) {
          this.Options.WorkItemId = this.workItemId;
        }
        // 流程实例ID
        if (this.instanceId) {
          this.Options.InstanceId = this.instanceId;
        }
        // 流程实例ID
        if (this.originator) {
          this.Options.Originator = this.originator;
        }
        // 流程Code,可传可不传
        if (this.workflowCode) {
          this.Options.WorkflowCode = this.workflowCode;
        }
        if (this.WorkflowVersion) {
          this.Options.WorkflowVersion = this.WorkflowVersion;
        }
        // 表单所使用的模式
        if (this.mode) {
          this.Options.Mode = this.mode;
        }
        // 关联BO对象
        if (this.MappingDataField) {
          this.MappingDataField = this.MappingDataField.split(';');
          this.Options.MappingDataField = this.MappingDataField;
          this.Options.MappingDataField.forEach((item, idx) => {
            this.Options[this.MappingDataField[idx]] = {
              ObjectId: this.LinkBizObjectId,
              Name: decodeURIComponent(this.BOName),
            };
          })
        }
        if (this.BOName) {
          this.Options.BOName = decodeURIComponent(this.BOName);
        }
      } else if ((window.GlobalConfig.schemaCode || window.GlobalConfig.menuCode) && !isHashNeeded) {
        this.Options.SheetCode = window.GlobalConfig.schemaCode || window.GlobalConfig.menuCode;
        this.Options.SchemaCode = window.GlobalConfig.schemaCode || window.GlobalConfig.menuCode;
        this.Options.WorkItemId = window.GlobalConfig.workitemId;
        this.Options.BizObjectId = window.GlobalConfig.bizObjectId;
        this.Options.SharingKey = window.GlobalConfig.shareKey;
        this.Options.IsExternalForm = window.GlobalConfig.isExternalForm ? '1' : '0';
        this.Options.IsExternalShare = window.GlobalConfig.isExternalShare ? '1' : '0';
        this.isExternalFormBol = window.GlobalConfig.isExternalForm;
        this.isExternalShareBol = window.GlobalConfig.isExternalShare;
      } else {
        this.Options.SheetCode = parseUrlParam(window.location.hash.replace('#', ''), 'schemaCode');
        this.schemaCode = this.Options.SheetCode;
        this.Options.SchemaCode = parseUrlParam(window.location.hash.replace('#', ''), 'schemaCode');
        if (parseUrlParam(window.location.hash.replace('#', ''), 'workitemId')) {
          this.Options.WorkItemId = parseUrlParam(window.location.hash.replace('#', ''), 'workitemId');
        }
        if (parseUrlParam(window.location.hash.replace('#', ''), 'instanceId')) {
          this.Options.InstanceId = parseUrlParam(window.location.hash.replace('#', ''), 'instanceId');
        }
        this.Options.BizObjectId = parseUrlParam(window.location.hash.replace('#', ''), 'bizobjectid');
      }
      const sheetContentCacheItem = formLocalStorage.Get(this.schemaCode);
      let timeStamp = -1;
      if (sheetContentCacheItem) {
        timeStamp = sheetContentCacheItem[formLocalStorage.TimeStampName] - 0;
      }
      this.Options.TimeStamp = timeStamp;

      this.getFormData(this.Options);
    },
    // 请求应用表单数据
    async getFormData(options) {
      H3PluginDeveloper.IShowPreLoader(this.loadingTitle);
      const res = await initFormData(options);
      if (res.Successful) {
        const Data = res.ReturnData.Data;
        const viewContext = res.ReturnData.Data.ViewContext;
        this.schemaCode = viewContext.SchemaCode;
        window.GlobalConfig.isExternalShare = Data.ViewContext.isExternalShare;
        //用来判断审批的时候是否覆盖意见. kappa 2018-10-23
        self.workItemId = res.ReturnData.Data.ViewContext.WorkItemId;
        if(viewContext&&viewContext.Comments&&viewContext.Comments.length>0&&!!self.workItemId){
          const self=this;
          const currentWorkItem=viewContext.WorkItems.filter(item=>item.WorkItemId==self.workItemId)[0];
          if( currentWorkItem ){
             const selectedComment=viewContext.Comments.find((item)=>{
             if(item.WorkItemId){
               return item.WorkItemId==self.workItemId;
             }
             return item.TokenId===currentWorkItem.TokenId&&item.UserId===currentWorkItem.UserId&&item.IsMyComment;
            });
            this.currentCommentId = selectedComment&&selectedComment.CommentId;
          }
        }//判断完毕
        document.title = res.ReturnData.Data.DisplayName;
        this.vCloak = true;
        this.appCode = Data.AppCode;
        this.EnableReviewExternalForm = res.ReturnData.EnableReviewExternalForm;
        this.ReviewQrCodeUrl = res.ReturnData.ReviewMobileQrCodeUrl;
        H3PluginDeveloper.IHidePreLoader();
        if (!Data.HtmlContent) {
          const itemCache = formLocalStorage.Get(this.schemaCode);
          this.$set(Data, 'HtmlContent', itemCache.SheetContent);
          this.$set(Data, 'Javascript', itemCache.Javascript);
        } else {
          formLocalStorage.Set(
            this.schemaCode,
            Data.HtmlContent,
            res.ReturnData.TimeStamp,
            Data.Javascript,
            this.$store.state.engineCode,
          );
        }
        this.setFormData(Data);
      } else {
        H3PluginDeveloper.IHidePreLoader();
        H3PluginDeveloper.IShowTip('提示', res.ErrorMessage, () => {
          if (window.GlobalConfig.schemaCode ||
            window.GlobalConfig.enableAssociation) {
            closeApp();
          }else{
            this.$router.go(-1);
          }
        },3000);
      }
    },
    // 数据获取成功后的操作
    setFormData(datas) {
      const data = datas;
      if (this.MappingDataField && this.MappingDataField.length) {
        // this.MappingDataField = this.MappingDataField.split(';');
        this.MappingDataField.forEach((item) => {
          if (item.indexOf('.') < 0) {
            if (data.ViewContext.ReturnData[item] !== undefined) {
              data.ViewContext.ReturnData[item].Value =
              this.Options[item];
            }
          } else {
            const subTableFieldKey = item.split('.')[0];
            if (data.ViewContext.ReturnData[subTableFieldKey] !== undefined) {
              const subTableValue = data.ViewContext.ReturnData[subTableFieldKey].Value;
              if (subTableValue.T[item] !== undefined) {
                subTableValue.T[item].Value = this.Options[item];
              }
            }
          }
        })
      }
      const nodes = parseDom(data.HtmlContent);
      const htmlData = getDomPropertys(nodes, false);
      // 处理button 数据
      for (const nodesObj of htmlData) {
        if (nodesObj.controlkey === 'FormButton') {
          this.$set(data.ViewContext.ReturnData, nodesObj.dataField, nodesObj);
        }
      }
      const returnData = data.ViewContext.ReturnData;
      for (const ele of htmlData) {
        for (const key in returnData) {
          if (!!ele.dataField && ele.dataField === key) {
            this.mergeData(ele, returnData[key]);
            this.mergeData(returnData[key], ele);
          }
        }
      }
      for (const child of htmlData) {
        if (child.controlkey === 'FormGridView') {
          for (const key in child.Value.T) {
            if (Object.prototype.hasOwnProperty.call(child.Value.T, key)) {
              for (const childVal of child.children) {
                if (key === childVal.dataField) {
                  this.mergeData(child.Value.T[key], childVal);
                }
              }
            }
          }
        }
      }
      for (const key in returnData) {
        if (returnData[key].controlkey) {
          if (returnData[key].controlkey === 'FormGridView') {
            const val = returnData[key];
            val.Value.L = JSON.parse(JSON.stringify(val.Value.R));
            val.Value.L = [];
            for (const children of val.children) {
              if (data.IsCreateMode) {
                for (const secKey in val.Value.T) {
                  if (children.dataField === secKey) {
                    this.mergeData(val.Value.T[secKey], children);
                  }
                }
              } else {
                for (let i = 0; i < val.Value.R.length; i += 1) {
                  for (const thirdKey in val.Value.R[i]) {
                    if (children.dataField === thirdKey) {
                      this.mergeData(val.Value.R[i][thirdKey], children);
                    }
                  }
                }
              }
            }
          }
        }
      }
      // 表单页面进入表单页面测试
      this.$store.state.formData.responseContext = data.ViewContext;
      this.$store.state.formData.data = data.ViewContext.ReturnData;
      this.$store.state.formData.pageId = data.ViewContext.SchemaCode;
      this.propValue = this.$store.state.formData.data;
      this.sortedArr = htmlData;
      this.DisplayName = data.DisplayName;
      this.isCreateMode = data.ViewContext.IsCreateMode;
      setTitle(this.DisplayName);
      if (!data.ViewContext.IsCreateMode && data.ViewContext.InstanceId) {
        this.isCommentShow = true;
      }
      if (data.Javascript === null) {
        data.Javascript =
          '$.extend($.JForm,{\n' +
          'OnLoad:function(){},\n' +
          'OnLoadActions:function(actions){},\n' +
          'OnValidate:function(actionControl){return true;},\n' +
          'BeforeSubmit:function(action, postValue){},\n' +
          'AfterSubmit:function(action, responseValue){}\n' +
          '});';
      }
      this.Javascript = `try{${data.Javascript}; \r }catch(err){console.info(err)}`;
      // 把返回的Javascript字符串转化成js
      this.assignSelfJavascript();
    },
    mergeData(obj1, obj2) {
      Object.assign(obj1, obj2);
    },
    // 将客户自定义代码转化成js
    assignSelfJavascript() {
      this.Javascript = this.Javascript.replace(/(\$\.JForm)|(\$\.SmartForm)|(DataField)|(\$\.I)/g, (match) => {
        switch (match) {
          case '$.JForm':
            return 'SmartForm';
          case '$.SmartForm':
            return 'SmartForm';
          case 'DataField':
            return 'keyName';
          case '$.I':
            return 'H3PluginDeveloper.I';
          default:
            break;
        }
        return false;
      });
      const that = this;
      eval(that.Javascript);
      // CreateScriptBlock(this.Javascript)
    },
    // 初始化客户自定义代码
    initCustomCode() {
      const self = this;
      SmartForm.Load(self.responseContext, self);
    },
    // 跳转到列表页面
    toList() {
      this.$router.push({
        name: 'list',
        params: {
          appCode: this.$store.state.appId,
          schemaCode: this.schemaCode,
          appName: this.DisplayName,
        },
      });
    },
    // 返回上一页
    goBack() {

      if (this.backStack.getStackSize() > 0) {
        this.backStack.pop();
        return
      }

      H3PluginDeveloper.IHidePreLoader();
      if (!this.isCanBack) {
        return;
      }
      const $modal = $('.h3-modal-container');
      const $button = $('.h3-modal-button');
      const modalStyle = $modal.css('display');
      if (modalStyle !== 'none') {
        $button.click();
      } else if (this.$store.state.attachmentPreviewShow) { // 判断是否有预览
        this.$store.state.attachmentPreviewShow = false;
      } else if (this.$store.state.photoPreviewShow) {
        this.$store.state.photoPreviewShow = false;
      } else if (this.$store.state.DateTimePluginShow) {
        this.$vux.datetime.hide();
      } else if (window.GlobalConfig.confirmPanelShow) {
        window.GlobalConfig.confirmPanelShow = false;
        this.$vux.confirm.hide();
        return;
      } else {
        if (!this.schemaCode || (this.schemaCode && window.GlobalConfig.schemaCode && !window.GlobalConfig.enableAssociation && !window.GlobalConfig.isList) || (window.GlobalConfig.menuCode && !window.GlobalConfig.isList)) {
          closeApp();
        } else if (this.$store.state.AreaCotrolPopObj.bol) {
          this.$store.state.AreaCotrolPopObj.bol = false;
        } else if (this.$store.state.DateCotrolPopObj.bol) {
          this.$store.state.DateCotrolPopObj.bol = false;
        } else if (this.$store.state.CotrolPopBol) {
          this.$store.state.CotrolPopBol = false;
        } else if (this.isPopUp) {
          this.isPopUp = !this.isPopUp;
          this.removeModalClassName();
        } else {
          if (this.responseContext.FormMode != 4 && this.responseContext.FormMode != 1) {
            if (this.$store.state.isHtmlChangedBol) {
              const isCreateMode = this.responseContext.FormMode === FormMode.CREATE;
              const content = {
                title: `数据${isCreateMode?'未保存':'已更改'}，确定离开吗?`,
                content:`离开后将会放弃本次${isCreateMode?'填写':'更改'}的内容`
              }
              H3PluginDeveloper.IConfirm(content.title, content.content, (result) => {
                if (result === 1) {
                  this.$router.goBack();
                }
              });
            } else {
              this.$router.goBack();
            }
          } else {
            this.$router.goBack();
          }
        }
      }
      const solutionState = window.GlobalConfig.solutionStates;
      const solutionType = window.GlobalConfig.solutionType;
      const hasSend = window.localStorage.getItem('hasSend');
      if (solutionState && solutionState.indexOf(SolutionState.Expire) > -1 && solutionType !== SolutionTypes.APass) {
        this.$h3.modal.hide();
      }
      if (solutionState && solutionState.indexOf(SolutionState.WillExpire) > -1 && !hasSend) {

      } else if (window.GlobalConfig.isAdministrator && !hasSend &&
       (solutionState.indexOf(SolutionState.FileSizeExceed) > -1 || solutionState.indexOf(SolutionState.FileSizeWillExceed) > -1)) {
        if (!this.$h3.modal.show.length) {
          this.$h3.modal.hide();
        }
      }
      this.$store.state.isClickCommentButton = false;
    },
    // 提交，保存按钮
    buttonClicked(e, items, text) {
      // if (!window.navigator.onLine) {
      //   H3PluginDeveloper.IShowWarn('提示', '网络不给力，请稍后再试');
      //   return;
      // }
      const item = items;
      this.isPopUp = false;
      const self = this;
      this.btnUpdatedBol = true;
      this.clickButton = item;
      // 此处判断转发
      item.DoAction = function () {
        const item = self.clickButton;
        if (item.OnAction) {
          return item.OnAction.apply(item);
        } else {
          if (item.Action) {
            let okFunction = function(t) {
              SmartForm.OnAction(t, self);
            };
            // 移动端，删除数据时提示功能
            if (item.Action == 'Remove') {
              const that = item;
              $.IConfirm('提示', '确定删除该条数据', function(e) {
                if (e) {
                }
              });
            } else if (item.Action == 'CancelInstance') {
              const that = item;
              $.IConfirm('提示', '确定取消流程', function(e) {
                if (e) {
                }
              });
            } else {
              return SmartForm.OnAction(item, self);
            }
          }
        }
      };
      // 此处判断转发
      if (item.Action === 'Submit') {
        // '同意'
        // 判断是否是流程和发起环节
        if (SmartForm.ResponseContext &&
          (SmartForm.ResponseContext.InstanceId || SmartForm.ResponseContext.WorkItemId) &&
          !SmartForm.ResponseContext.IsCreateMode &&
          SmartForm.ResponseContext.WorkflowState !== 4 &&
          SmartForm.ResponseContext.WorkItemType === 2
        ) {
          this.commentItem = item;
          this.commentItem.Comments = SmartForm.ResponseContext.Comments;
          this.commentPlaceholder = '请输入您的审批意见';
          const flag = SmartForm.Validate(item, self);
          if (flag) {
            this.$router.push({
              name: 'approve',
              params: {
                commentPlaceholder: this.commentPlaceholder,
                commmentItem: this.commentItem,
                destActivity: this.destActivity,
                postValue: this.postValue,
                groupValue: this.groupValue,
                fromRoute: this.fromRoute,
                schemaCode: this.schemaCode,
                currentCommentId:this.currentCommentId
              },
            });
          }
        } else {
          const schemaCodeExternal = this.schemaCode || window.GlobalConfig.schemaCode;
          const bizObjectIdExternal = this.bizObjectId || this.responseContext.BizObjectId;
          const displayName = this.DisplayName;
          this.isCanBack = false;
          SmartForm.Submit(
            item, text, [], this.destActivity,
            this.postValue, this.groupValue, self, this.fromRoute, this.ReviewQrCodeUrl,
            schemaCodeExternal, bizObjectIdExternal, displayName, this.EnableReviewExternalForm,
            this.isExternalFormBol, this.isCreateMode
          );
        }
      } else if (item.Action === 'Save') {
        // '暂存'
        this.isCanBack = false;
        SmartForm.Save(item, self, this.fromRoute);
      } else if (item.Action === 'Remove') {
        // '删除'
        SmartForm.Remove(item, self, self.fromRoute);
      } else if (item.Action === 'CancelInstance') {
        // 有问题
        H3PluginDeveloper.IConfirm('提示', '您确定作废流程吗？', (ev) => {
          if (ev) {
            SmartForm.OnAction(item, self, self.fromRoute);
          }
        });
      } else if (item.Action === 'Read') {
        SmartForm.OnAction(item, self, self.fromRoute);
      } else if (item.Action === 'Forward') {
        this.$router.push({
          name: 'forwardSelect',
        });
      } else if (item.Action === 'Reject') {
        this.commentItem = item;
        this.commentItem.Comments = SmartForm.ResponseContext.Comments;
        this.commentPlaceholder = '请输入您的审批意见';
        this.$router.push({
          name: 'approve',
          params: {
            commentPlaceholder: this.commentPlaceholder,
            commmentItem: this.commentItem,
            destActivity: this.destActivity,
            postValue: this.postValue,
            groupValue: this.groupValue,
            fromRoute: this.fromRoute,
            schemaCode: this.schemaCode,
            currentCommentId:this.currentCommentId
          },
        });
      } else if (item.Action === 'Edit') {
        this.$router.replace({
          name: 'blankForm',
          params: {
            schemaCode: this.responseContext.SchemaCode,
            bizObjectId: this.responseContext.BizObjectId,
            isExternalForm: this.isExternalFormBol ? '1' : '',
            mode: '0',
          },
        });
      } else if (item.Action === 'FinishInstance') {
        SmartForm.FinishInstance(item, self, self.fromRoute);
      } else if (item.Action === 'RetrieveInstance') {
        SmartForm.RetrieveInstance(item, self, self.fromRoute);
      } else if (item.Action === 'LinkToSns') {
        const snscounts = item.Text.substring(item.Text.indexOf('(')+1,item.Text.indexOf(')'));
        if (snscounts !== '0') {
          this.$router.replace({
            name: 'snslist',
            params: {
              schemaCode: this.schemaCode || window.GlobalConfig.schemaCode,
              bizObjectId: this.bizObjectId || this.responseContext.BizObjectId,
            },
          });
        } else {
          this.$router.push({
            name: 'snscomment',
            params: {
              schemaCode: this.schemaCode || window.GlobalConfig.schemaCode,
              bizObjectId: this.bizObjectId || this.responseContext.BizObjectId,
            },
          });
        }
      } else if (item.Action === 'QrCode' || item.Action === 'ExternalShare') {
        let schemaCode = '';
        if (this.schemaCode) {
          schemaCode = this.schemaCode;
        } else {
          schemaCode = window.GlobalConfig.schemaCode;
        }
        this.$router.push({
          name: 'share',
          params: {
            displayName: this.responseContext.Name,
            bizObjectId: this.responseContext.BizObjectId,
            schemaCode,
            appCode: this.appCode,
            action: item.Action,
          },
        });
      } else {
        SmartForm.OnAction(item, self, self.fromRoute);
      }
      this.$root.eventHub.$emit('form-button-clicked');
    },

    initSmartFormControls() {
      const dataFields = Object.keys(SmartForm.controls);
      if (dataFields.length > 0) {
        for (const dataField of dataFields) {
          delete SmartForm[dataField];
        }
        SmartForm.controls = {};
      }
      SmartForm.components = [];
      SmartForm.mappingControlsVal = {};
      Object.assign(SmartForm, {
        OnLoad() {},
        OnLoadActions() {},
        OnValidate() {
          return true;
        },
        BeforeSubmit() {},
        AfterSubmit() {},
      });
    },
    // 按钮过多隐藏成弹出框的弹回
    popDown(e) {
      if (e.target.className === 'popupBtn') {
        this.isPopUp = false;
        this.removeModalClassName();
      }
    },
    // 显示更多按钮
    showMoreActions() {
      this.isPopUp = !this.isPopUp;
      this.btnUpdatedBol = true;
      if (this.isPopUp) {
        this.addModalClassName();
      } else {
        this.removeModalClassName();
      }
    },
    // 取消弹出框
    cancelPopUp() {
      this.isPopUp = false;
      this.removeModalClassName();
    },
    getChildrenLen(val) {
      this.childComponentLen = val;
    },
    backToHome() {
      this.$store.state.appId = this.appCode;
      this.$router.push({
        name: 'home',
      });
      window.GlobalConfig.bizObjectId = '';
      window.GlobalConfig.schemaCode = '';
      window.GlobalConfig.workitemId = '';
      window.GlobalConfig.menuCode = '';
      this.isExternalFormBol = false;
    },
  },
  computed: {
    // 过滤按钮
    responseContextActions() {
      // let responseContext = this.$store.state.formData.responseContext;
      const actionsArr = [];
      this.showButtons.splice(0, this.showButtons.length);
      this.hideButtons.splice(0, this.hideButtons.length);
      for (const action in this.responseContext.Actions) {
        if (Object.prototype.hasOwnProperty.call(this.responseContext.Actions, action)) {
          actionsArr.push(this.responseContext.Actions[action]);
        }
      }
      const responseContext = this.$store.state.formData.responseContext;
      if (!responseContext.IsCreateMode) {
        if (!this.EnableReviewExternalForm && !this.isExternalShareBol) {
          const shareAction = { Action: 'QrCode', Icon: '', Text: '二维码' };
          if ((actionsArr.length && actionsArr[actionsArr.length - 1].Action === 'Remove')) {
            actionsArr.splice(actionsArr.length - 1, 0, shareAction);
          } else {
            actionsArr.push(shareAction);
          }
        }
      }

      if (actionsArr.length > 3) {
        this.isActionHide = true;
        this.showButtons = actionsArr.slice(0, 2);
        this.hideButtons = actionsArr.slice(2, actionsArr.length);
      } else {
        this.showButtons = actionsArr;
      }

      return actionsArr;
    },
    responseContext() {
      // 表单页面进入表单页面测试
      const responseContext = this.$store.state.formData.responseContext;
      if (responseContext) {
        for (const action in responseContext.Actions) {
          if (action === 'Close' || action === 'Print' || action === 'ViewQrCode'
            || action === 'ViewInstance'
            || ((responseContext.BizObjectStatus === this.BizObjectStatus.Draft) && action === 'LinkToSns')) {
            delete responseContext.Actions[action];
          }
        }
      }
      return responseContext;
    },
    childLen() {
      const num = this.$store.state.childRenderedLen;
      if (
        num === this.childComponentLen &&
        num > 0 &&
        !this.isRenderHtmlBol &&
        this.$store.state.gridChildLen === this.gridLen
      ) {
        this.isRenderHtmlBol = true;
        // 执行自定义代码的onload 和 onloadActions
        this.initCustomCode();
        // 需要等这个方法执行完之后才能让用户点击关联表单！！
        // 有控件影藏的话formtitle也要跟着影藏
        // this.hideTitle();
        // 子表的上一个控件不需要border
        for (const dom of $('.form-grid')) {
          $(dom)
            .prev()
            .find('.content')
            .css('background-image', 'none');
        }
        // 更新scroll
        // this.formscroll.refresh();
        this.$store.state.isFormInitFinish = true;
      }
      return num;
    },
  },
  watch: {
    '$store.state.isGridPopupBol': function b(val) {
      if (!val) {
        const self = this;
        window.backFn = function c() {
          self.goBack();
        };
        setLeft(window.backFn);
      }
    },
    $route(to, from) {
      if (from.name === 'formPage' && to.name === 'formPage' && to.query.schemaCode) {
        this.$store.state.childRenderedLen = 0;
        this.$store.state.gridChildLen = 0;
        this.$store.state.isFormInitFinish = false;
        this.propValue = '';
        this.isRenderHtmlBol = false;
        this.initSmartFormControls();
        this.initFormPageData(true);
      }
    },
  },
};
</script>
<style lang='less'>
@import '../../styles/reset.css';
@import '../../assets/css/form-base.less';

#form-page {
  overflow-x: hidden;
  a {
    display: inline-block;
  }
  a:active {
    background-color: #f2f3f5;
    color: #108ee9;
  }
  .comment,
  .form-content-margin {
    // margin-top: .98rem;
    .px2rem(padding-top, 98);
  }
  .vux-header {
    .px2rem(height, 98);
    // position: fixed;
    // top: 0;
    // left: 0;
    // z-index: 888;
  }
  .weui-cells {
    margin-top: 0;
    border: none;
  }
  .weui-cells::before {
    border: none;
  }
  .weui-label {
    display: inline !important;
  }
  .vux-label-desc {
    color: transparent; // margin-left: -.1rem;
    .px2rem(margin-left, -10); // display: none;
  } // overflow: hidden;
  .form-content-padding {
    //   padding-top: .98rem;
    .px2rem(padding-top, 98);
  }
  .cover {
    position: absolute;
    top: 0;
    right: 0;
    width: 65.6%;
    height: 100%;
    opacity: 0;
  }
  .require {
    color: red;
  }
  .top-ding {
    top: 44px !important;
  }

  .top-default {
    top: 90px !important;
  }
  .header {
    position: fixed;
    font-size: 14px;
    background-color: #108ee9;
    display: flex;
    justify-content: space-between;
    align-items: center; // height: .98rem;
    .px2rem(height, 98);
    width: 100%;
    z-index: 999;
    span {
      // line-height: .98rem;
      .px2rem(line-height, 98);
    }
    .back,
    .list {
      // width: 1rem;
      .px2rem(width, 100);
      text-align: center;
    }
    .title {
      margin: 0 auto;
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    width: 100%; // height: .98rem;
    .px2rem(height, 98);
    background-color: white;
    display: flex;
    justify-content: space-around;
    left: 0; // border-top:1px solid #D9D9D9;
    // box-shadow: inset 0 1px 0 0 #D9D9D9;
    z-index: 101;
    a {
      border: none; // background-color: white;
      color: @font-color-blue;
      flex-grow: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    a:after {
      content: ''; // top: .34rem;
      .px2rem(top, 34);
      bottom: 0;
      position: absolute;
      width: 1px; // height: .3rem;
      .px2rem(height, 30);
      background-color: #d9d9d9;
      right: 0;
    }
    a:last-child:after {
      width: 0;
    }
    .popupBtn {
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0); // z-index: 99999;
      text-align: center; // transition: opacity .5s;
      z-index: 104;
      .popup-btn-sheet {
        position: absolute;
        .px2rem(min-width, 192);
        .px2rem(right, 24);
        .px2rem(max-width, 310);
        .px2rem(bottom, 124);
        border: 1px solid #d9d9d9;
        background-color: white;
        .px2rem(padding-top, 10);
        .px2rem(padding-bottom, 10); // .px2rem(padding-left,24);
        .px2rem(border-radius, 8);
        box-shadow: 0 2px 4px 0 rgba(183, 200, 224, 0.1);
        &:before {
          content: ' ';
          border-top: 7px solid #d9d9d9;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          position: absolute;
          right: 42px;
          bottom: -7px;
        }
        &:after {
          content: ' ';
          border-top: 5px solid #fff;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          position: absolute;
          right: 44px;
          bottom: -5px;
        }
        .popup-btn-ctn {
          a {
            width: 100%;
            background-color: transparent;
            color: @font-color-blue;
            .px2rem(height, 86);
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            .px2rem(line-height, 86);
            .px2rem(padding-left, 24);
            box-sizing: border-box;
            &:active {
              background-color: #f2f3f5;
            }
            &:after {
              width: 0;
            }
          }
        }
      }
    }
  }

  .top-dingding {
    top: 0;
  }
  .top-pcdefault {
    //   top: .98rem;
    .px2rem(top, 98);
  }
  #form-wrap {
    position: relative;
    .px2rem(padding-bottom, 98);
    .stamp-pic {
      // transition: all 0.3s;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .stamp-pic-start {
      position: absolute;
      .px2rem(top, 280);
      right: 0;
      .px2rem(width, 400);
      .px2rem(height, 332);
    }
    .stamp-pic-done {
      position: absolute;
      .px2rem(top, -50);
      .px2rem(right, 22);
      .px2rem(width, 222);
      .px2rem(height, 180);
    }
  }
  .vux-header {
    .vux-header-left {
      font-size: inherit;
      .vux-header-back {
        font-size: inherit;
        background-color: transparent;
        color: white;
      }
    }
    .vux-header-title {
      font-size: inherit;
    }
  }
  .back-to-home-btn {
    position: fixed;
    .px2rem(bottom, 126);
    .px2rem(width, 98);
    .px2rem(height, 98);
    .px2rem(right, 44);
    background-color: white;
    color: #108ee9;
    border-radius: 50%;
    /* text-align: center; */
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 4px 0 #108ee9;
    z-index: 103; // p{
    //     .px2rem(width,48);
    // }
    span {
      .px2rem(width, 48);
    }
  }
  .no-scrolling {
    -webkit-overflow-scrolling: auto !important;
  }
  .form-child-wrapper {
    height: calc(100% + 1px);
  }
}
.no-transform {
  transform: none !important;
}
.weui-mask_transparent{
  top: 60px;
}
</style>
