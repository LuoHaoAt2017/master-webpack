<template>
  <layout
    :title="appTitle"
    :leftOptions="{preventGoBack: true}"
    :rightOptions="isLightApp && operationPermission ? rightOptions : {}"
    @on-click-back="goBack"
  >
    <div
      v-if="popoverNew && isLightApp"
      class="popoverWrapper"
    >
      在这里可以新建数据表
      <i
        class="close icon h3yun_All"
        @click="handleClosePopover"
      ></i>
      <i class="arrow"></i>
    </div>
    <template v-if="schemaList.length > 0">
      <search :schema="true" />
      <div
        id="schemas-page"
        :class="{'schemas-page__bottom': isTabbarShow}"
      >
        <div class="schemas-wrapper">
          <div
            v-if="showFirstTips && !isLightApp"
            class="schemas-edit-tips"
          >
            <span>
              表单编辑路径：钉钉电脑端 > 工作台 > 氚云
            </span>
            <img
              src="../../assets/img/modal-close.svg"
              @click="showFirstTips = false"
            />
          </div>
          <div
            v-for="(group, index) in schemaList"
            :key="group.GroupCode"
            class="schemas-group"
          >
            <template v-if="group.loading">
              <div
                :class="{last: index === schemaList.length - 1}"
                class="schemas-group__loading"
              >
                <skeleton class="left" />
                <skeleton class="right" />
              </div>
            </template>
            <template v-else>
              <div
                :class="{ungroup: group.GroupDisplayName === '未分组', last: index === schemaList.length - 1 && group.fold}"
                class="schemas-group__name"
              >
                <div
                  class="schemas-name__mask"
                  @click="toggleGroup(index, $event)"
                >
                  <div class="folder">
                    <img
                      v-show="group.fold"
                      src="../../assets/img/schema-fold.svg"
                    />
                    <img
                      v-show="!group.fold"
                      src="../../assets/img/schema-unfold.svg"
                    />
                  </div>
                  <span class="group-name">{{ group.GroupDisplayName }}</span>
                  <i
                    :class="{expand: !group.fold}"
                    class="arrow h3yun_All right-o fa box-icon"
                  ></i>
                </div>
              </div>
              <!-- 轻应用 -->
              <ul
                v-if="isLightApp"
                :class="{ungroup: group.GroupDisplayName === '未分组', expand: !group.fold}"
                :style="!group.fold ? `height: ${group.Childrens.length * 1.49333333}rem` : ''"
                class="schemas-group__light"
              >
                <li
                  v-for="(schema, itemIndex) in group.Childrens"
                  :key="schema.Code"
                  class="light-list-item bd-bot"
                >
                  <i
                    class="schema-icon fa box-icon h3yun_All table-o"
                  ></i>
                  <span
                    class="schema-name"
                    @click="openLightForm(schema)"
                  >{{ schema.DisplayName }}</span>
                  <i
                    v-if="operationPermission && schema.NodeType !== 270"
                    class="icon h3yun_All ellipsis-o light-list-item__h3-guide"
                    @click="handleSettingSheetShow(schema, itemIndex)"
                  ></i>
                </li>
              </ul>
              <!-- 普通应用 -->
              <ul
                v-else
                :class="{ungroup: group.GroupDisplayName === '未分组', expand: !group.fold}"
                :style="!group.fold ? `height: ${group.Childrens.length * 1.46667}rem` : ''"
                class="schemas-group__list"
              >
                <li
                  v-for="(schema, i) in group.Childrens"
                  :key="schema.Code"
                  :class="{
                    last: index === schemaList.length - 1 && i === group.Childrens.length - 1,
                    'first-schema-guide': index === 0 && i === 0 // 以第一组第一个表单为例进行引导
                  }"
                  class="list-item"
                  @click="openForm(schema)"
                >
                  <i
                    :style="{color: getIconColor(schema.ObjectId)}"
                    :class="`${schema.IconCss}-o`"
                    class="schema-icon fa box-icon h3yun_All"
                  ></i>
                  <span class="schema-name">{{ schema.DisplayName }}</span>
                  <span
                    v-if="schema.NodeType !== 200 && schema.NodeType !== 240 && schema.NodeType !== 300"
                    :class="{workflow: schema.NodeType === 210 || schema.NodeType === 250, dashboard: schema.NodeType === 270}"
                    class="schema-type"
                  >{{ schema.NodeType | formatSchemaType(schema.NodeType) }}</span>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </div>
    </template>
    <div
      v-else
      class="schemas-no-data"
    >
      <div
        v-if="isLightApp"
        class="light-empty"
      >
        <img src="~@/assets/img/no-app-light.png" />
        <template v-if="operationPermission">
          <span>新建数据表，开始构建您的应用</span>
          <div
            class="new-sheets-btn"
            @click="handleNewSheet()"
          >
            新建数据表
          </div>
        </template>
        <span v-else>暂无内容，您可以联系管理员</span>
      </div>
      <div
        v-else
        class="not-light-empty"
      >
        <img src="~@/assets/img/no-app-normal.png" />
        <span>还没有内容，您可以联系管理员</span>
      </div>
    </div>
    <!-- 轻应用 -->
    <div class="setting-dropdown-menu">
      <h3-actionsheet
        v-model="actionSettingSheetShow"
        :menus="settingMenus"
        showCancel
        @on-click-menu="onClickSettingMenu"
        @on-click-mask="closeSettingMask"
      />
      <h3-actionsheet
        v-model="actionsheetShow"
        :menus="menus"
        showCancel
        @on-click-menu="onClickMenu"
        @on-click-mask="closeMoreMask"
      />
    </div>
    <div class="schema-guide-tool">
      <guide-tool-tip
        v-if="showGuideTip || true"
        content="点击进入数据表"
        :showTip="showGuideTip"
        direction="left-top"
        @hideTip="hideTip"
      />
    </div>
  </layout>
</template>
<script lang="ts">
import {
  Component,
  Mixins,
  Watch
} from 'vue-property-decorator';
import { State, Mutation, namespace } from 'vuex-class';
import { closeApp } from '../../config/dingtalk-interface';
// import cellList from '../../components/common/cell-list.vue';
import skeleton from '@/components/common/skeleton-loading.vue';
import search from '@/components/common/search.vue';
import calcIconColor from '@/utils/calc-icon-color';
import GuideToolTip from '@/components/introduce/guide-tool-tip/index.vue';
import { AppActionType, AppMutationType } from '@/store/modules/app/types';
import { LightAppMutationType } from '@/light-app/store/types';
import { MutationType } from '@/store/types';
import OpenFormMixin from '../../mixins/openForm';
import {
  getLastBizObjectIdBySchema, startWorkFlow, closeWorkFlow, getExternalform,
} from '@/service/app.service';
import { H3Actionsheet } from 'h3-mobile-vue';
import { FormStatus } from '@/light-app/config/const';
import Guide from '@/plugins/intro/guide';

// vuex-class module命名空间
const appModule = namespace('App');
const lightAppModule = namespace('LightApp');
const NodeType = {
  // 190: '应用程序',
  200: '非流程', // 列表模块（不能发起流程）
  210: '流程', // 流程列表模块（可以发起流程）
  220: '报表', // 报表模块
  // 230: '分组', // 节点分组
  240: '非流程', // 表单模块（无列表，单行数据）
  250: '流程', // 流程列表模块（可以发起流程）
  300: '自定义表单', // 自定义列表模块（不含表单）
  270: '仪表盘', // 自定义列表模块（不含表单）
};

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

@Component({
  name: 'schemas',
  components: {
    skeleton,
    search,
    H3Actionsheet,
    GuideToolTip
  },
  filters: {
    formatSchemaType (val: number) {
      return NodeType[val];
    },
  },
})
export default class Schemas extends Mixins(OpenFormMixin) {
  @State('UserInfo') userInfo;

  @appModule.State('schemaList') schemaList;

  // 表单列表
  @appModule.State('appTitle') appTitle;

  @appModule.State('isLightApp') isLightApp;

  // 是否为轻应用判断
  @lightAppModule.State('formObjectId') formObjectId; // 选中表单ObjectId

  @appModule.Getter('operationPermission') operationPermission; // 表单操作权限控制

  @appModule.Action(AppActionType.GetAppSchemas) getAppSchemas;

  @appModule.Action(AppActionType.DelSheet) delSheet;

  @appModule.Action(AppActionType.GetFormFreeFlow) getFormFreeFlowAction;

  @Mutation(MutationType.ToggleTabbarShow) toggleTabbarShow;

  @appModule.Mutation(AppMutationType.DelSheetIndex) delSheetIndex;

  @appModule.Mutation(AppMutationType.HandleRenameSheetsIndex)
  handleRenameSheetsIndex;

  @lightAppModule.Mutation(LightAppMutationType.SelectFormObjectId)
  selectFormObjectId;

  // 选中表单ObjectId
  @lightAppModule.Mutation(LightAppMutationType.UpdateFormName)
  updateFormName; // 选中表单ObjectId

  appCode: string = '';

  showFirstTips: boolean = false;

  viewHeight: number = 0;

  selectSheetName: null;

  selectSheetCode: null;

  hasLightNoSupportControl: boolean = false;

  selectSheetObjectId: null;

  listIndex: number = 1;

  renameSheetIndex: number = -1;

  rightOptions = {
    text: '更多',
    callback: this.formMore,
  };

  popoverNew: boolean = false;

  actionsheetShow: boolean = false;

  actionSettingSheetShow: boolean = false;

  menus: any[] = [
    {
      label: '新建数据表',
    },
  ];

  // 当前正在操作的schema
  activeSchema: any;

  settingMenus: any[] = [];

  storageKey: string = 'viewConfig';

  showGuideTip: boolean = false;

  // @Watch('schemaList')
  // handleSchemaList() {
  //   if (!this.schemaList[0].loading && this.schemaList.length > 0) {
  //     this.$nextTick(() => {
  //       if (Guide.hasGuid) {
  //         Guide.setStep(7, {
  //           el: document.querySelector('.light-list-item__h3-guide'),
  //           content: '点击这里可设计数据表、启用流程、分享',
  //           zIndex: 100,
  //           placement: 'bottom',
  //           showNext: true,
  //           showEnd: false,
  //           toolTipClass: 'light-app-list-guide',
  //           nextText: '开始使用',
  //           next: () => {
  //             this.backStack.pop();
  //             return true;
  //           }
  //         });
  //         Guide.go(7);
  //         Guide.show();
  //         this.backStack.push(() => {
  //           Guide.quit();
  //         })
  //       }
  //     });
  //   }
  // }

  @Watch('schemaList')
  handleSchemaList() {
    const showGuide = window.GlobalConfig.isShowGuide;
    const tipKey = `schemaTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
    const hasGuided = localStorage.getItem(tipKey);
    if (!this.schemaList[0].loading && showGuide && !hasGuided) {
      this.$nextTick(() => {
        this.showGuideTip = true;
        localStorage.setItem(tipKey, "true");
      });
    }
  }

  // 点击更多
  formMore () {
    this.backStack.pop();
    this.actionSettingSheetShow = false;
    setTimeout(() => {
      this.actionsheetShow = true;
      this.backStack.push(() => {
        this.actionsheetShow = false;
      });
    }, 200);
  }

  handleClosePopover () {
    this.popoverNew = false;
  }

  onCancel () {
    this.actionsheetShow = false;
  }

  closeMoreMask () {
    this.actionsheetShow = false;
    this.backStack.pop();
  }

  onSettingCancel () {
    this.actionSettingSheetShow = false;
  }

  // 开启流程
  handleOpenWorkFlow () {
    this.actionSettingSheetShow = false;
    // 一组不上先屏蔽
    getExternalform(this.activeSchema.SchemaCode).then(res => {
      if (res.returnData.Setting.status === 0) {
        this.$h3.modal.show({
          title: '确定启用流程?',
          content:
            '<div style="color:#999999;">发起流程时可发起人自选审批人</div>',
          type: 'alert',
          actions: [
            {
              text: '取消',
              style: {
                color: '#999999',
              },
              onPress: () => {
                this.cancalDelete();
              },
            },
            {
              text: '启用',
              style: {
                color: '#107FFF',
              },
              onPress: () => {
                this.openWorkFlow();
              },
            },
          ],
          maskClosable: true,
        });
        // 一组不上先屏蔽
      } else {
        this.$h3.modal.show({
          title: '确定启用流程?',
          content:
                    '<div style="color:#999999;">分享填单不支持发起人自选审批人，启用流程后将停用分享填单</div>',
          type: 'alert',
          actions: [
            {
              text: '取消',
              style: {
                color: '#999999',
              },
              onPress: () => {
                this.cancalDelete();
              },
            },
            {
              text: '启用',
              style: {
                color: '#107FFF',
              },
              onPress: () => {
                this.openWorkFlow();
              },
            },
          ],
        });
      }
    });
    this.backStack.push(() => {
      this.$h3.modal.hide();
    });
  }

  openWorkFlow () {
    startWorkFlow(this.activeSchema.SchemaCode).then(res => {
      if (res.success) {
        this.activeSchema.IsWorkflow = !this.activeSchema.IsWorkflow;
        this.$h3.toast.show({ text: '启用成功' });
      } else {
        this.$h3.toast.show({ text: '启用失败' });
      }
      this.cancalDelete();
    });
  }

  // 关闭流程
  handleCloseWorkFlow () {
    this.actionSettingSheetShow = false;
    this.$h3.modal.show({
      title: '确定停用流程',
      content:
        '<div style="color:#999999;">停用后新增数据将不再发起流程</div>',
      type: 'alert',
      actions: [
        {
          text: '取消',
          style: {
            color: '#999999',
          },
          onPress: () => {
            this.cancalDelete();
          },
        },
        {
          text: '停用',
          style: {
            color: '#D94838',
          },
          onPress: () => {
            closeWorkFlow(this.activeSchema.SchemaCode).then(res => {
              if (res.success) {
                this.activeSchema.IsWorkflow = !this.activeSchema.IsWorkflow;
                this.$h3.toast.show({ text: '停用成功' });
              } else {
                this.$h3.toast.show({ text: '停用失败' });
              }
              this.cancalDelete();
            });
          },
        },
      ],
      maskClosable: true,
    });
    this.backStack.push(() => {
      this.$h3.modal.hide();
    });
  }

  closeSettingMask () {
    this.actionSettingSheetShow = false;
    this.backStack.pop();
  }

  handleNewSheet () {
    const { appCode } = this.$route.query;
    this.$router.push({
      name: 'lightFormDesignPage',
      query: {
        appCode: appCode,
        formStatus: FormStatus.Create,
      },
    });
  }

  // 新建表单
  onClickMenu (key) {
    this.backStack.pop();
    if (key === 'cancel') {
      this.onCancel();
    } else {
      this.handleNewSheet();
    }
  }

  // 轻应用列表设置操作
  onClickSettingMenu (key) {
    this.backStack.pop();
    switch (key) {
      case 'cancel':
        this.onSettingCancel();
        break;
      case 'openWorkFlow':
        this.handleOpenWorkFlow();
        break;
      case 'closeWorkFlow':
        this.handleCloseWorkFlow();
        break;
      case 'design':
        this.handleRouterFormDesign();
        break;
      case 'share':
        this.handleRouterFormShare();
        break;
      case 'rename':
        this.handleRouterNameEdit();
        break;
      case 'del':
        this.handleDelSheetModel();
        break;
      case 'openExternal':
        this.handleExternalShare();
        break;
      default:
        break;
    }
  }

  deleteForm () {
    this.backStack.pop();
    this.delSheet(this.selectSheetCode);
  }

  cancalDelete () {
    this.backStack.pop();
    this.$h3.modal.hide();
  }

  get getDelSchemaCode () {
    return this.selectSheetCode;
  }

  hideTip () {
    this.showGuideTip = false;
  }

  created () {
    const { appCode, first } = this.$route.query;
    if (first) {
      this.showFirstTips = true;
    }

    this.viewHeight = document.body.getBoundingClientRect().height;
    // this.getAppSchemas(appCode);
  }

  mounted () {
    const isAdmin = this.$store.state.UserInfo.isAdministrator;
    const isFirst = localStorage.getItem('first');
    // 管理员&第一次&有数据
    if (!isFirst) {
      if (isAdmin && !isFirst && this.schemaList.length) {
        this.popoverNew = true;
      }
      localStorage.setItem('first', '1');
    }
  }

  activated () {
    const appCode = this.$route.query.appCode || this.$route.query.appid;
    this.getAppSchemas(appCode);
  }

  beforeRouteLeave (to, from, next) {
    if (to.name === 'apps' || to.name === 'home') {
      this.$store.state.excludeComp = ['schemas'];
    } else {
      this.$store.state.excludeComp = [];
    }
    this.showGuideTip = false;
    next();
  }

  toggleGroup (index: number, event: any) {
    this.schemaList[index].fold = !this.schemaList[index].fold;
  }

  getIconColor (id) {
    return calcIconColor(id);
  }

  goBack () {
    if (window.GlobalConfig.appRankType) {
      closeApp();
    } else {
      this.$router.push({
        name: 'apps',
      });
    }
  }

  get isTabbarShow () {
    return this.$route.name === 'rootSchemas';
  }

  /**
    * 判断是否启动流程下拉列表显示不一样
  */
  getSettingMenus (schema) {
    const isAuthorized = schema.IsWorkflow;
    const settingMenus: any[] = [
      {
        label: '设计数据表',
        value: 'design',
      },
      {
        label: '分享',
        value: 'openExternal',
      },
      {
        label: '重命名',
        value: 'rename',
      },
      {
        label: '删除',
        type: 'error',
        value: 'del',
      },
    ];
    // 管理员才有开启和关闭流程的权限，添加是否有分享填单功能
    if (this.operationPermission) {
      // 未授权
      if (!isAuthorized) {
        settingMenus.splice(1, 0, {
          label: '启用流程',
          value: 'openWorkFlow',
        });
      } else {
        settingMenus.splice(1, 0, {
          label: '停用流程',
          value: 'closeWorkFlow',
        });
      }
    }

    return settingMenus;
  }

  // 是否开启了填单
  async getfillForm (schemaCode, menus) {
    // const result = await getExternalStatus(schemaCode);
    // if (result.success) {
    //   const setting = result.returnData.Setting;
    //   if (setting) {
    //     menus.splice(2, 0, {
    //       label: '分享',
    //       value: 'openExternal',
    //     });
    //     // if (setting.status) {
    //     //   menus.splice(2, 0, {
    //     //     label: '分享填单',
    //     //     value: 'openExternal',
    //     //   });
    //     // } else {
    //     //   menus.splice(2, 0, {
    //     //     label: '开启分享填单',
    //     //     value: 'openExternal',
    //     //   });
    //     // }
    //   }
    // } else {
    //   this.$h3.toast.show(result.errorMsg);
    // }
  }

  // 点击表单设置
  handleSettingSheetShow (schema, index: number) {
    if (Guide.hasGuid) {
      Guide.quit();
      this.backStack.popOnly();
    }

    /**
     * 判断是否启动流程下拉列表显示不一样
     */
    this.activeSchema = schema;
    this.settingMenus = this.getSettingMenus(schema);
    // this.getfillForm(schema.SchemaCode, this.settingMenus); // 判断是否开启分享填单
    this.actionSettingSheetShow = true;
    this.backStack.push(() => {
      this.actionSettingSheetShow = false;
    });
    this.hasLightNoSupportControl = schema.HasLightNoSupportControl;
    this.selectSheetName = schema.DisplayName;
    this.selectSheetCode = schema.Code;
    this.selectSheetObjectId = schema.ObjectId;
    // this.settingSheetShow = true;
    this.delSheetIndex(index);
    this.handleRenameSheetsIndex(index);
    this.renameSheetIndex = index;
    this.selectFormObjectId(schema.ObjectId);
  }

  // 分享填单
  async handleExternalShare () {
    // 是否为自由流
    const { appCode } = this.$route.query;
    // const result = await this.getFormFreeFlowAction(this.selectSheetCode);
    // if (result.success) {
    //   const isFreeFlow = result.returnData.IsFreeflow;
    //   if (isFreeFlow) {
    //     this.$h3.modal.show({
    //       title: '启用分享填单失败',
    //       type: 'alert',
    //       content: '工作流程为发起人自选模式，暂无法使用分享填单功能',
    //       actions: [{
    //         text: '知道了',
    //         onPress: () => {
    //           this.$h3.modal.hide();
    //         },
    //       }],
    //     });
    //   } else {
    //     this.$router.push({
    //       path: '/external/share',
    //       query: {
    //         appCode: appCode,
    //         displayName: this.activeSchema.DisplayName,
    //         schemaCode: this.selectSheetCode,
    //       },
    //     });
    //   }
    // }
    // 自由流逻辑的判断后移到分享填单开启中
    this.$router.push({
      path: '/external/share',
      query: {
        appCode: appCode,
        displayName: this.activeSchema.DisplayName,
        schemaCode: this.selectSheetCode,
      },
    });
  }

  handleDelSheetModel () {
    this.actionSettingSheetShow = false;
    this.$h3.modal.show({
      title: '删除数据表',
      content:
        '数据表里添加的所有数据将会被彻底删除，且无法恢复，你确认要删除吗？',
      type: 'alert',
      actions: [
        {
          text: '取消',
          onPress: () => {
            this.cancalDelete();
          },
        },
        {
          text: '确认',
          onPress: () => {
            this.deleteForm();
          },
        },
      ],
      maskClosable: true,
    });
    this.backStack.push(() => {
      this.$h3.modal.hide();
    });
  }

  handleRouterNameEdit () {
    this.updateFormName({ name: this.selectSheetName, subSheet: false });
    this.actionSettingSheetShow = false;
    const { appCode } = this.$route.query;
    this.$router.push({
      name: 'lightFormNameEditPage',
      query: {
        appCode: appCode,
        sheetCode: this.selectSheetCode,
        index: `${this.renameSheetIndex}`,
      },
    });
  }

  handleRouterFormDesign () {
    if (this.hasLightNoSupportControl) {
      this.backStack.push(() => {
        this.$h3.modal.hide();
      });
      this.$h3.modal.show({
        title: '提示',
        type: 'alert',
        content: '当前数据表已转化为表单设计器模式，无法继续在移动端设计，请在PC端进行操作',
        actions: [{
          text: '我知道了',
          onPress: () => {
            this.backStack.pop();
          },
        }],
      });
    } else {
      this.updateFormName(this.selectSheetName);
      this.actionSettingSheetShow = false;
      const { appCode } = this.$route.query;
      this.$router.push({
        name: 'lightFormDesignPage',
        query: {
          appCode: appCode,
          formStatus: 'edit',
          formCode: this.selectSheetCode,
        },
      });
    }
  }

  handleRouterFormShare () {
    this.updateFormName(this.selectSheetName);
    this.actionSettingSheetShow = false;
    const { appCode } = this.$route.query;
    this.$router.push({
      name: 'lightFormSharePage',
      query: {
        appCode: appCode,
        formCode: this.selectSheetCode,
        formName: this.selectSheetName,
        formObjectId: this.selectSheetObjectId,
      },
    });
  }

  // 轻应用打开表单
  openLightForm (schema: H3.App.SchemaListItem) {
    const appCode = schema.AppCode;
    const sheetCode = schema.Code;
    const sheetName = schema.DisplayName;
    const canAdd = schema.BeCreated;
    const viewMode = schema.DisplayMode;
    const viewConfigs = schema.ViewConfigs;
    const displayName = schema.DisplayName;
    const enableBoard = true;
    if (schema.NodeType === 270) {
      // 去到仪表盘
      this.$router.push({
        name: 'dashboard',
        query: {
          reportId: schema.Code,
          AppCode: schema.AppCode,
        },
        params: {
          displayName,
        },
      });
    } else {
      // this.$router.push({
      //   name: 'lightListPage',
      //   query: {
      //     appCode,
      //     sheetCode,
      //     enableBoard: `${enableBoard}`,
      //     canAdd: `${canAdd}`,
      //   },
      //   params: {
      //     sheetName,
      //   },
      // });
      // 区分视图类型(DisplayMode) 暂时屏蔽
      // TODO 是否启用了看板视图，如果没有，进入表格视图都不显示视图切换标志
      switch (viewMode) {
        case 0:
          this.$router.push({
            name: 'lightListPage',
            query: {
              appCode,
              sheetCode,
              enableBoard: `${enableBoard}`,
              canAdd: `${canAdd}`,
            },
            params: {
              sheetName,
            },
          });
          break;
        case 3:
          this.$router.push({
            name: 'boardEntry',
            query: {
              appCode,
              sheetCode,
              enableBoard: `${enableBoard}`,
              canAdd: `${canAdd}`,
            },
            params: {
              sheetName,
            },
          });
          break;
        default:
          break;
      }
    }
  }
}
</script>
<style lang="less">
@baseFontSize: 75;
@baseThemeColor: #107fff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
#schemas-page {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 499;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background: #f5f7f9;
  .schemas-edit-tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .px2rem(padding-top, 12);
    .px2rem(padding-bottom, 12);
    .px2rem(padding-left, 20);
    .px2rem(padding-right, 20);
    background: #f2f8ff;
    span {
      font-size: 12px;
      color: #50a8ff;
    }
    img {
      .px2rem(width, 25);
      .px2rem(height, 25);
    }
  }
  .schemas-wrapper {
    .px2rem(margin-top, 112);
    .px2rem(min-height, 550);
  }
  .schemas-group {
    overflow: hidden;
    background-color: #fff;
    // &:first-of-type {
    //   .px2rem(margin-top, 20);
    // }
    &__name {
      display: flex;
      align-items: center;
      position: relative;
      .px2rem(height, 110);
      // .px2rem(margin-left, 28);
      border-bottom: 1px solid #ebedf2;
      .schemas-name__mask {
        display:flex;
        width:100%;
      }
      &.ungroup {
        display: none;
      }
      &.last {
        border-bottom: none;
      }
      .folder {
        display: flex;
        align-items: center;
        justify-content: center;
        .px2rem(width, 50);
        .px2rem(margin-left, 34);
        .px2rem(margin-right, 34);
        img {
          width: 100%;
        }
      }
      .arrow {
        .px2rem(width, 100);
        color: #c4cad9;
        text-align: center;
        transition: transform 0.15s ease;
        &.expand {
          transform: rotate(90deg);
        }
      }
      .group-name {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    &__light {
      height: 0;
      opacity: 0;
      transition: height 0.15s ease, opacity 0.15s ease;
      // &.ungroup {
      //   .light-list-item {
      //     margin: 0;
      //   }
      // }
      &.expand {
        opacity: 1;
      }
      .light-list-item {
        display: flex;
        align-items: center;
        .px2rem(height, 112);
        .px2rem(padding-left, 32);
        padding-right: 0;
        // .px2rem(width, 718);
        align-items: center;
        .schema-icon {
          color: #107fff;
        }
        .schema-name {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          height: 100%;
          .px2rem(line-height, 112);
          .px2rem(padding-right, 20);
          .px2rem(font-size, 30);
          color: #333;
          padding-left: 0.45333333rem;
        }
        .ellipsis-o {
          transform: rotateZ(90deg);
          padding: 0.6rem 0.4rem;
          margin-left: auto;
          &::before {
            color: #b4b7bc;
            .px2rem(font-size, 48);
          }
        }
      }
    }
    &__list {
      height: 0;
      opacity: 0;
      transition: height 0.15s ease, opacity 0.15s ease;
      &.ungroup {
        .list-item {
          // .px2rem(margin-left, 28);
          margin: 0;
        }
      }
      &.expand {
        opacity: 1;
      }
      .list-item {
        display: flex;
        align-items: center;
        .px2rem(height, 108);
        .px2rem(margin-left, 70);
        .px2rem(padding-right, 30);
        border-bottom: 1px solid #ebedf2;
        &.last {
          border-bottom: none;
        }
        .schema-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          .px2rem(width, 50);
          .px2rem(margin-left, 34);
          .px2rem(margin-right, 34);
          .px2rem(font-size, 45);
          // font-size: 22px;
          // .px2rem(line-height, 88);
        }
        .schema-type {
          display: flex;
          justify-content: center;
          align-items: center;
          .px2rem(width, 88);
          .px2rem(height, 40);
          background: #e0ecfa;
          border-radius: 20px;
          color: @baseThemeColor;
          font-size: 11px;
          &.workflow {
            background: rgba(32, 207, 48, 0.1);
            color: #069913;
          }
          &.dashboard {
            background: rgba(255,117,39,0.1);
            color: #FF7527;
          }
        }
        .schema-name {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .px2rem(margin-right, 20);
        }
      }
    }
    &__loading {
      display: flex;
      align-items: center;
      width: 100%;
      .px2rem(height, 110);
      .px2rem(padding-left, 38);
      border-bottom: 1px solid #ebedf2;
      &.last {
        width: 80%;
        border-bottom: none;
      }
      .left {
        .px2rem(width, 70);
        .px2rem(height, 70);
        .px2rem(border-radius, 6);
      }
      .right {
        flex: 1;
        .px2rem(height, 70);
        .px2rem(margin-left, 38);
        .px2rem(margin-right, 76);
        .px2rem(border-radius, 6);
      }
    }
  }
}
.schemas-no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  img {
    display: block;
  }
  .light-empty {
    .px2rem(margin-top, 210);
    img {
      .px2rem(width, 240);
      margin: 0 auto;
    }
    span {
      .px2rem(font-size, 26);
      color: #999;
      .px2rem(margin-top, 48);
    }
    .new-sheets-btn {
      .px2rem(width, 270);
      .px2rem(height, 72);
      .px2rem(line-height, 72);
      .px2rem(border-radius, 6);
      background: rgba(16, 127, 255, 1);
      margin: 0.64rem auto 0;
      .px2rem(font-size, 32);
      text-align: center;
      color: #fff;
    }
  }
  .not-light-empty {
    .px2rem(margin-top, 220);
    img {
      .px2rem(width, 450);
    }
  }
  span {
    font-size: 15px;
    color: #666;
    display: inherit;
    text-align: center;
  }
}
// 轻应用
.setting-dropdown-menu {
  /deep/.h3ui-actionsheet__cell {
    .px2rem(height, 112);
    .px2rem(font-size, 30);
    .px2rem(line-height, 112);
    background: #fff;
  }
  /deep/.h3ui-actionsheet {
    border-radius: 0.213333rem 0.213333rem 0 0;
    // 处理iphoneX适配问题
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .h3ui-actionsheet__menu {
      border-radius: 0.213333rem 0.213333rem 0 0;
      overflow: hidden;
    }
  }
  /deep/.h3-actionsheet-menu-default {
    &:first-child {
      box-shadow: 0 0.12rem 0.9866666rem 0 rgba(0, 115, 233, 0.03);
    }
  }
  /deep/.h3ui-actionsheet__action {
    .px2rem(margin-top, 21);

    .h3ui-actionsheet__cell {
      &::before {
        background: none !important;
      }
    }
  }
  /deep/.h3ui-actionsheet-cancel-button-mask {
    background-color: #f5f7f9;
  }
}
.popoverWrapper {
  position: absolute;
  .px2rem(top, 16);
  .px2rem(right, 20);
  background: #107fff;
  color: #fff;
  .px2rem(width, 312);
  .px2rem(height, 64);
  .px2rem(line-height, 64);
  .px2rem(border-radius, 6);
  .px2rem(font-size, 24);
  .px2rem(padding-left, 20);
  box-shadow: 0px 0.02666rem 0.10666rem 0px rgba(16, 127, 255, 0.22);
  z-index: 10001;
  .close {
    .px2rem(font-size, 32);
    color: #fff;
    float: right;
    .px2rem(margin-right, 16);
    vertical-align: middle;
  }
  .arrow {
    position: absolute;
    background: #107fff;
    .px2rem(width, 24);
    .px2rem(height, 24);
    .px2rem(top, -12);
    .px2rem(right, 46);
    transform: rotate(45deg);
    z-index: 0;
  }
}

.schema-guide-tool {
  position: absolute;
  .px2rem(left, 100);
  .px2rem(top, 280);
  z-index: 999;
}
@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
</style>
