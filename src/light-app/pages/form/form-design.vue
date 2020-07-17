<template>
  <layout
    class="light-form-edit-container"
    :title="title"
    @on-click-back="goBack"
    :leftOptions="{ preventGoBack: true }"
  >
    <template v-if="!loadingError">
      <div
        class="app-pages"
        @click="cancelSelected($event)"
        ref="formEdit"
      >

        <template v-if="loading">
          <div class="loading-box">
            <div class="loading-header">
              <skeleton-loading class="loading"></skeleton-loading>
            </div>
            <div class="loading-content">
              <skeleton-loading class="loading-title"></skeleton-loading>
              <skeleton-loading class="loading-text"></skeleton-loading>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            ref="sheetNameEditGuide"
            class="light-form-edit__header"
            @click="goToNameEdit()"
          >
            <div class="title no-user-select">{{sheetName}}</div>
            <span class="icon-box">
              <i class="icon h3yun_All edit-o"></i>
            </span>
          </div>
          <div class="light-form-edit__content">
            <div v-if="sheetControlList.length > 0">
              <form-control
                @downAddControl="downAddControl"
                @handleControlStatus="handleControlStatus"
                :subSheet="isSubSheet"
                :sheetControlList="sheetControlList"
              ></form-control>
              <div class="form-add-box">
                <div
                  ref="addControlGuide"
                  class="btn no-user-select"
                  @click="showAddControl"
                >
                  <span class="icon h3yun_All plus-circle no-user-select"></span>
                  <span class="no-user-select">添加字段</span>
                </div>
              </div>
            </div>
            <!-- 无字段缺省 -->
            <div
              v-else
              class="no-sheet-box"
            >
              <img
                class="no-sheet-img"
                src="~@/assets/img/no-app-light.svg"
              >
              <span class="no-sheet-text">当前数据表尚未配置任何字段</span>
              <div
                class="no-sheet-add-box"
                @click="showAddControl"
              >
                <span class="no-sheet-add-box__text">添加字段</span>
              </div>
            </div>
          </div>

          <div
            class="light-form-edit__footer light-app-footer"
            v-if="sheetControlList.length > 0"
          >
            <button
              class="btn-reset preview-btn no-user-select"
              @click="goToPreview"
              v-if="!isSubSheet"
            >预 览</button>
            <div ref="commitSheetGuide" class="sure-btn-box">
              <button
                class="btn-reset sure-btn no-user-select"
                :style="{width: isSubSheet ? '100%': ''}"
                @click="commit('')"
              >保 存</button>              
            </div>

          </div>
        </template>

      </div>
      <bottom-sheet
        :show="isAppShow"
        title="选择字段"
        @close="closeAddControl"
      >
        <div class="light-form-edit__icon-sheet">
          <div class="title">基础字段</div>
          <ul class="icon-control-list">
            <template v-for="(control, index) in baseControl">
              <li
                :key="index"
                class="icon-control-item"
                @click="choiceControl(control)"
                v-if="controlsShow(control.id)"
                :class="{ 'selected': control.id == selected }"
              >
                <div class="icon-box">
                  <span :class="['icon', 'h3yun_All', control.icon]"></span>
                </div>
                <div class="name">{{control.name}}</div>
              </li>
            </template>
          </ul>
          <div v-if="systemControl.length >= 5 && !isSubSheet">
            <div class="title">系统字段</div>
            <ul class="icon-control-list">
              <template v-for="(control, index) in systemControl">
                <li
                  class="icon-control-item"
                  @click="choiceControl(control)"
                  :class="{ 'selected': control.id == selected }"
                  v-if="doSystemControlShow(control)"
                  :key="index"
                >
                  <div class="icon-box">
                    <span>
                      <i :class="['icon', 'h3yun_All', control.icon]"></i>
                    </span>
                  </div>
                  <div class="name">{{control.name}}</div>
                </li>
              </template>
            </ul>
          </div>

        </div>
      </bottom-sheet>
      <!-- 确定保存 -->
      <h3-dialog
        :show.sync="isCommit"
        class="l-dialog"
      >
        <div class="l-dialog__content">
          <div class="icon-tips-box">
            <i class="icon h3yun_All check"></i>
          </div>
          <div class="l-dialog__text">
            <div class="parimary-tips">保存成功!</div>
            <div class="second-tips">更多功能请在电脑端进行设置</div>
            <!-- <div
              class="bottom bd-top"
              @click="goToShare"
            >邀请他人填单</div> -->
            <div
              class="bottom bd-top"
              @click="goToAddData"
            >新增数据</div>
            <div
              ref="goToListGuide"
              class="bottom bd-top"
              @click="goToSchemas"
            >返回列表</div>
          </div>
          <div
            class="close-box"
            @click="closeDialog"
          >
            <i class="icon h3yun_All icons.sucess close"></i>
          </div>
        </div>
      </h3-dialog>
      <div class="action-sheet">
        <h3-actionsheet
          :menus="menus"
          show-cancel
          @on-click-menu="onActionSheet"
          @on-click-mask="closeActionSheet"
          v-model="actionsheetShow"
        >
        </h3-actionsheet>
      </div>
    </template>
    <div
      class="app-pages"
      ref="formEdit"
      v-else
    >
      <default-error @refresh="getControls"></default-error>
    </div>

  </layout>
</template>

<script lang='ts'>
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { ContorlTypeObject } from '@/light-app/config/form-control-type';
import { H3Dialog, H3Actionsheet } from 'h3-mobile-vue';
import {
  LightAppActionType,
  LightAppMutationType
} from '@/light-app/store/types';
import {
  FormStatus,
  ControlStatus,
  DefaultFormControls
} from '@/light-app/config/const';
import { FormControlType } from '@/light-app/config/form-control-type';
import { autoRename, handleColsName, createControlCode } from '@/light-app/utils';
import { getGridViewCode } from '@/light-app/service';
import SkeletonLoading from '@/components/common/skeleton-loading.vue';
import H3PluginDeveloper from '@/lib/h3-plugins-developer';
import FormControl from './control/form-control.vue';
import BottomSheet from '@/components/common/bottom-sheet.vue';
import DefaultError from '@/light-app/components/default-error.vue';
import cloneDeep from 'lodash/cloneDeep';
import Guide from '@/plugins/intro/guide';

const LightApp = namespace('LightApp');

@Component({
  name: 'EditForm',
  components: {
    FormControl,
    BottomSheet,
    H3Dialog,
    H3Actionsheet,
    SkeletonLoading,
    DefaultError
  }
})
export default class EditForm extends Vue {
  title: string = '';
  isAppShow: boolean = false;
  isCommit: boolean = false;
  baseControl: object[] = [];
  systemControl: object[] = [];
  selected: number = -1; //弹窗中被选中的字段
  formNameStatus: boolean = false; // 数据表名称是否更新,用于主表
  formControlsStatus: boolean = false; // 数据表字段更新状态，主表明细表复用
  isSubSheet: boolean = false; //当前组件是否为明细表组件
  controlStatus: string = ControlStatus.Create;
  subControlStatus: string = ControlStatus.Create;
  scroll: number = 0;
  subScroll: number = 0;
  actionsheetShow: boolean = false;
  controlKey: string = '';
  sheetControlList: H3.LightApp.ControlType[] = [];
  sheetName: string = '';
  formInfo: any = {
    formCode: '',
    appCode: ''
  };
  formStatus: string = '';
  subFormStatus: string = '';
  loading: boolean = true;
  loadingError: boolean = false;
  menus: any[] = [
    {
      label: '是否保存本次数据表配置结果？'
    },
    {
      label: '保存',
      value: 'commit'
    },
    {
      label: '不保存',
      value: 'noCommit'
    }
  ];

  @LightApp.State('colsNameList') colsNameList;
  @LightApp.State('subColsNameList') subColsNameList;
  @LightApp.State('formObjectId') formObjectId;
  @LightApp.State('formDataUpdateStatus') formDataUpdateStatus;
  @LightApp.State('formName') formName; // 主表的名称用store存起来是因为字段编辑接口请求中有针对仅更新名称的请求
  @LightApp.State('subFormName') subFormName;
  @LightApp.State('appCode') appCode;
  @LightApp.State('formCode') formCode;
  @LightApp.State('formControls') formControls;
  @LightApp.State('subFormControls') subFormControls;
  @LightApp.State('controlCodeList') controlCodeList;
  @LightApp.State('uniqueControl') uniqueControl;
  @LightApp.Action(LightAppActionType.CreateForm) createForm;
  @LightApp.Action(LightAppActionType.UpdateForm) updateForm;
  @LightApp.Action(LightAppActionType.AsyncUpdateFormName) asyncUpdateFormName;
  @LightApp.Action(LightAppActionType.GetFormControls) getFormControls;
  @LightApp.Mutation(LightAppMutationType.FormCode) updateFormCode;
  @LightApp.Mutation(LightAppMutationType.AppCode) updateAppCode;
  @LightApp.Mutation(LightAppMutationType.UpdateFormControls)
  updateFormControls;
  @LightApp.Mutation(LightAppMutationType.UpdateFormName) updateFormName;
  @LightApp.Mutation(LightAppMutationType.SelectedControl)
  updateSelectedControl;
  @LightApp.Mutation(LightAppMutationType.UpdateControlCodeList)
  updateControlCodeList;
  @LightApp.Mutation(LightAppMutationType.HandleUniqueControls)
  handleUniqueControls;
  @LightApp.Mutation(LightAppMutationType.UpdateColsNameList)
  updateColsNameList;
  @Mutation('excludeComp') excludeComp;

  $refs!: {
    formEdit: any;
    sheetNameEditGuide: HTMLElement;
    goToListGuide: HTMLElement;
    addControlGuide: HTMLElement;
    commitSheetGuide: HTMLElement;
  };

  // 主表字段如果有更新，需要更新字段状态，以确保保存时请正确的接口
  @Watch('formControls', { immediate: true })
  updateFormControlsStatus(newVal, oldVal) {
    this.formControlsStatus = true;
    if (!this.isSubSheet) {
      this.sheetControlList = this.formControls;
    }
  }

  @Watch('subFormControls', { immediate: true })
  updateSubFormControl(newVal, oldVal) {
    if (this.isSubSheet) {
      this.sheetControlList = this.subFormControls;
    }
  }
  @Watch('formName', { immediate: true })
  handleFormName(newVal, oldVal) {
    if (!this.isSubSheet) {
      this.formNameStatus = true;
      this.sheetName = this.formName;
    }
  }

  @Watch('subFormName', { immediate: true })
  handleSubFormName(newVal, oldVal) {
    if (this.isSubSheet) {
      this.sheetName = this.subFormName;
    }
  }
  @Watch('$route')
  routeHandler(to, from) {
    if (from) {
      if (
        (from.name === 'lightFormSubSheetDesignPage' &&
          to.name === 'lightFormDesignPage') ||
        (from.name === 'lightFormDesignPage' &&
          to.name === 'lightFormSubSheetDesignPage')
      ) {
        this.init();
        this.$nextTick(() => {
          this.scrollActivated();
        });
      }
    }
  }

  created() {
    const { formCode, appCode, subSheet, formStatus } = this.$route.query;
    // 从路由拿到code后，先做一次code的更新
    if (formCode) {
      this.updateFormCode(formCode);
    }
    if (appCode) {
      this.updateAppCode(appCode);
    }
    // formInfo用于储存主表的基本信息，只在主表状态时使用
    if (!subSheet && formStatus !== FormStatus.Create) {
      this.formInfo = Object.assign({}, this.formInfo, {
        appCode: this.appCode,
        formCode: this.formCode
      });
      this.getControls();
    } else {
      this.loading = false;
    }
    this.init();
    this.controlIcon();
  }

  mounted() {
    this.$refs.formEdit.addEventListener('scroll', this.handleScroll);
  }

  init() {
    const { formStatus, subSheet, key } = this.$route.query as any;
    if (key) {
      this.controlKey = key;
    }
    // 分开储存明细表和主表的状态，避免主表明细表状态由于缓存原因被合并一致
    if (subSheet === 'true') {
      this.isSubSheet = true;
      this.subFormStatus = formStatus;
      this.subSheetInit();
    } else {
      this.isSubSheet = false;
      this.formStatus = formStatus ? formStatus : this.formStatus;
      this.sheetInit();
    }
  }

  sheetInit() {
    const { formStatus } = this.$route.query as any;
    if (this.formStatus === FormStatus.Edit) {
      this.title = '编辑数据表';
    } else {
      this.title = '新建数据表';
      // 从明细表返回主表不带状态，防止主表为创建状态时，formControls被重新更新
      if (formStatus) {
        const key = createControlCode(this.controlCodeList);
        const defaultFormControls = Object.assign(
          {},
          cloneDeep(DefaultFormControls),
          { Key: key },
        );
        defaultFormControls.Options.DataField = key;
        this.updateFormControls({
          control: [cloneDeep(defaultFormControls)],
          subSheet: false
        });
        this.updateColsNameList({ name: '单行文本', subSheet: false });
        this.updateControlCodeList({ key });
        // 当用户创建数据表时，可能由于之前的操作导致store中的formName被清空，所以需要重新赋值
        this.updateFormName({
          name: '未命名的数据表',
          subSheet: false
        });
        // 新手引导
        // if (Guide.hasGuid) {
        //   const timer = window.setTimeout(() => {
        //     Guide.setStep(3, {
        //       el: this.$refs.sheetNameEditGuide,
        //       content: '输入数据表名称，比如“客户”',
        //       zIndex: 100,
        //       placement: 'bottom',
        //       toolTipClass: 'sheet-name-edit-guide'
        //     });
        //     Guide.setStep(4, {
        //       el: this.$refs.addControlGuide,
        //       content: '点击添加字段，完善数据表配置',
        //       zIndex: 100,
        //       placement: 'bottom',
        //       toolTipClass: 'sheet-add-control-guide'
        //     });
        //     Guide.setStep(6, {
        //       el: this.$refs.commitSheetGuide,
        //       content: '保存数据表',
        //       zIndex: 100,
        //       placement: 'top',
        //       showNext: false,
        //       showEnd: false,
        //       toolTipClass: 'commit-sheet-guide'
        //     });
        //     Guide.next();
        //     Guide.show();
        //     this.backStack.push(() => {
        //       if (!this.isSubSheet) {
        //         Guide.quit();
        //       }

        //     });
        //     window.clearTimeout(timer);
        //   }, 300);          
        // }
      }
    }
    this.sheetName = this.formName;
    this.sheetControlList = this.formControls;
  }

  subSheetInit() {
    if (this.subFormStatus === FormStatus.Edit) {
      this.getSubFormControls();
      this.title = '编辑明细表';
    } else {
      this.title = '新建明细表';
      const key = createControlCode(this.controlCodeList);
      const defaultFormControls = Object.assign(
        {},
        cloneDeep(DefaultFormControls),
        { Key: key }
      );
      defaultFormControls.Options.DataField = key;
      this.updateFormControls({
        control: [cloneDeep(defaultFormControls)],
        subSheet: true
      });
      this.updateControlCodeList({ key });
      this.updateColsNameList({ name: '单行文本', subSheet: true });
      const name = autoRename('明细表', handleColsName(this.colsNameList));
      this.updateFormName({
        name: name,
        subSheet: true
      });
    }
    this.sheetName = this.subFormName;
    this.sheetControlList = this.subFormControls;
  }

  async getControls() {
    this.loading = true;
    this.loadingError = false;
    const res = await this.getFormControls({ sheetCode: this.formCode });
    if (res.success) {
      this.loading = false;
    } else {
      this.loading = false;
      this.loadingError = true;
    }
  }

  getSubFormControls() {
    const controls = this.formControls.find(
      control => control.Key === this.controlKey
    );
    this.updateFormControls({
      control: cloneDeep(controls.ChildControls),
      subSheet: 'true'
    });
    controls.ChildControls.forEach(control => {
      this.updateColsNameList({
        name: control.Options.DisplayName,
        subSheet: true
      });
    });
    this.updateFormName({
      status: this.subFormStatus,
      name: controls.Options.DisplayName,
      subSheet: 'true'
    });
  }

  /**
   * 滚动缓存
   */
  activated() {
    this.scrollActivated();
    // 处理首次进入表单设计器情况，不执行next(),保证新手引导正确展示
    if (!this.isSubSheet && Guide.hasGuid && Guide.currentStep > 2 && this.formControls.length > 0) {
      Guide.next();
      if (Guide.currentStep === 6) {
        const timer = window.setTimeout(() => {
          Guide.show();
          this.backStack.push(Guide.quit);
          window.clearTimeout(timer);
        }, 300);
      } else {
        Guide.show();
        this.backStack.push(Guide.quit);
      }
    }
  }

  scrollActivated() {
    const scroll = this.isSubSheet ? this.subScroll : this.scroll;
    const controlStatus = this.isSubSheet
      ? this.subControlStatus
      : this.controlStatus;
    if (scroll > 0) {
      let el = document.querySelector('.form-control-item.selected');
      let desc = 0;
      if (el) {
        desc = (el as any).offsetHeight;
        if (controlStatus === ControlStatus.DownAdd) {
          desc = (el.previousElementSibling as any).offsetHeight;
        }
      }
      if (controlStatus !== ControlStatus.Edit) {
        this.$refs.formEdit.scrollTop = scroll + desc;
      } else {
        this.$refs.formEdit.scrollTop = scroll;
      }
    } else {
      this.$refs.formEdit.scrollTop = scroll;
    }
  }

  handleScroll(event) {
    if (this.isSubSheet) {
      this.subScroll = event.target.scrollTop;
    } else {
      this.scroll = event.target.scrollTop;
    }
  }

  /**
   * 拆分字段为系统字段和基础字段
   */
  controlIcon() {
    Object.keys(ContorlTypeObject).forEach(control => {
      const obj = {
        id: control,
        name: ContorlTypeObject[control].name,
        icon: ContorlTypeObject[control].icon
      };
      ContorlTypeObject[control].systemControl
        ? this.systemControl.push(obj)
        : this.baseControl.push(obj);
    });
  }

  closeAddControl() {
    this.backStack.pop();
    this.selected = -1;
    this.isAppShow = false;
  }

  showAddControl() {
    if (!this.isSubSheet && Guide.hasGuid) {
      Guide.hide();
      this.backStack.popOnly();
    }
    this.isAppShow = true;
    if (this.isSubSheet) {
      this.subControlStatus = ControlStatus.Create;
    } else {
      this.controlStatus = ControlStatus.Create;
    }

    this.backStack.push(this.closeAddControl);
  }

  async commit(status = false) {
    if (this.isSubSheet) {
      this.handleSubsheetCommit();
      return;
    }
    let data = {
      displayName: this.formName,
      appCode: this.appCode,
      formControls: this.formControls,
      visibility: true
    };
    if (this.formStatus === FormStatus.Create) {
      if (Guide.hasGuid) {
        Guide.hide();
        this.backStack.popOnly();
      }
      H3PluginDeveloper.IShowPreLoader('创建中...', { autoHide: false });
      const res = await this.createForm(data);
      H3PluginDeveloper.IHidePreLoader();
      if (res) {
        this.formInfo.formCode = res.sheetCode;
        this.updateFormCode(res.sheetCode);
        this.formStatus = FormStatus.Edit;
        this.isCommit = true;
        this.title = '编辑数据表';
      } else {
        Guide.quit();
        this.$h3.toast.show({ text: '创建失败' });
      }
    } else {
      H3PluginDeveloper.IShowPreLoader('保存中...', { autoHide: false });
      data = Object.assign({}, data, { code: this.formCode });
      const res = this.formControlsStatus
        ? await this.updateForm(data)
        : await this.asyncUpdateFormName(data);
      H3PluginDeveloper.IHidePreLoader();
      if (res) {
        H3PluginDeveloper.IHidePreLoader();
        // 如果是返回按钮的返回，那么保存以后直接返回列表
        if (status) {
          this.goToSchemas();
          return;
        }
        this.isCommit = true;
        this.formControlsStatus = false;
        this.formNameStatus = false;
      } else {
        this.$h3.toast.show({ text: '保存失败' });
      }
    }
  }

  async handleSubsheetCommit() {
    let newKey = this.controlKey;
    const status = newKey ? 'edit' : 'create';
    // 存在key值，则当前属于明细表编辑，不存在则当前为明细表添加
    if (!newKey) {
      try {
        H3PluginDeveloper.IShowPreLoader('保存中...', { autoHide: false });
        const res = await getGridViewCode();
        if (res.success) {
          newKey = res.returnData.code;
          H3PluginDeveloper.IHidePreLoader();
        } else {
          throw Error;
        }
      } catch (error) {
        H3PluginDeveloper.IHidePreLoader();
        this.$h3.toast.show({ text: '请求出错，保存失败' });
        return false;
      }
    }
    this.subFormControls.forEach(item => {
      item.ParentKey = newKey;
    });
    // 明细表key需要加上主表前缀
    const childControls = cloneDeep(this.subFormControls);
    childControls.forEach(control => {
      if (!control.Key.includes(newKey)) {
        const key = control.Key.split('.')[0];
        control.Key = `${newKey}.${key}`;
        control.Options.DataField = `${newKey}.${key}`;
      }
    });
    const control = {
      Key: newKey,
      ParentKey: '',
      Options: {
        DisplayName: this.subFormName,
        DataField: newKey
      },
      Type: FormControlType.FormGridView,
      ChildControls: childControls
    };
    this.updateFormControls({
      subSheet: false,
      control: control,
      status: this.subFormStatus
    });
    this.updateColsNameList({ status: 'reset', subSheet: false });
    this.updateSelectedControl({ code: newKey, subSheet: false });
    this.$router.replace({
      name: 'lightFormDesignPage',
      query: {
        subSheet: 'false'
      }
    });
  }

  goToAddData() {
    Guide.quit();
    this.$router.replace({
      name: 'formPage',
      query: {
        schemaCode: this.formCode,
        fromFormDesign: 'true'
      },
      params: {
        schemaCode: this.formCode,
        fromFormDesign: 'true'
      }
    });
  }

  goToSchemas() {
    if (Guide.hasGuid) {
      Guide.hide();
      this.backStack.popOnly();
    }
    // 所有返回 到当前应用的数据表列表
    this.$router.replace({
      name: 'schemas',
      query: {
        appCode: this.appCode
      },
      params: {
        appCode: this.appCode
      }
    });
  }

  goToShare() {
    this.$router.replace({
      name: 'lightFormSharePage',
      query: {
        formCode: this.formCode,
        formObjectId: this.formObjectId,
        appCode: this.appCode,
        formName: this.formName
      }
    });
  }

  goToNameEdit() {
    if (!this.isSubSheet && Guide.hasGuid) {
      Guide.hide();
      this.backStack.popOnly();
    }
    this.$router.push({
      name: 'lightFormNameEditPage',
      query: {
        formStatus: this.isSubSheet ? this.subFormStatus : this.formStatus,
        subSheet: this.isSubSheet.toString()
      }
    });
  }

  goBack() {
    if (!this.isSubSheet) {
      if (!this.formDataUpdateStatus || this.sheetControlList.length === 0) {
        this.goToSchemas();
      } else {
        this.actionsheetShow = true;
        this.backStack.push(this.closeActionSheet);
      }
    } else {
      // 未保存将明细表恢复原状
      if (this.subFormStatus === FormStatus.Edit) {
        this.getSubFormControls();
      }
      this.$router.replace({
        name: 'lightFormDesignPage',
        query: {
          subSheet: 'false'
        }
      });
    }
  }

  goToPreview() {
    this.$router.push({
      name: 'lightFormPreviewPage'
    });
  }

  /**
   * 处理选中字段
   */

  choiceControl(control) {
    this.selected = control.id;
    this.isAppShow = false;
    if (Number(control.id) === FormControlType.FormGridView) {
      this.$router.push({
        name: 'lightFormSubSheetDesignPage',
        query: {
          formStatus: this.controlStatus,
          subSheet: 'true'
        }
      });
    } else {
      this.$router.push({
        name: 'lightControlAttributePage',
        query: {
          type: control.id,
          status: !this.isSubSheet ? this.controlStatus : this.subControlStatus,
          subSheet: this.isSubSheet.toString()
        }
      });
    }
  }

  /**
   * 更新字段状态
   */

  handleControlStatus(status) {
    if (this.isSubSheet) {
      this.subControlStatus = status;
    } else {
      this.controlStatus = status;
    }
  }

  /**
   * 系统字段显示与隐藏
   */
  doSystemControlShow (control) {
    let hasSystemControl = this.uniqueControl.some(
      item => item === Number(control.id)
    );
    if (Number(control.id) === FormControlType.FormSeqNo) {
      hasSystemControl = true;
    }
    return !hasSystemControl;
  }

  /**
   * 明细表弹窗中的字段显示
   */
  controlsShow(id) {
    // 明细表不展示的字段
    const gridNotShows = [
      FormControlType.FormGridView,
      FormControlType.FormMap,
    ];
    const sheetNotShows = [
      FormControlType.WorkFlow,
      FormControlType.Participant,
      FormControlType.ActivityName,
    ];
    if (this.isSubSheet && gridNotShows.includes(Number(id))) {
      return false;
    }
    if (!this.isSubSheet && this.uniqueControl.includes(Number(id))) {
      return false;
    }
    if (sheetNotShows.includes(Number(id))) {
      return false;
    }
    return true;
  }

  closeActionSheet() {
    this.actionsheetShow = false;
  }

  onActionSheet(status) {
    this.backStack.pop();
    switch (status) {
      case 'commit':
        this.commit(true);
        break;
      case 'noCommit':
        this.goToSchemas();
        break;
      case 'cancel':
        this.closeActionSheet();
        break;
      default:
        break;
    }
  }

  downAddControl(control) {
    this.showAddControl();
    if (this.isSubSheet) {
      this.subControlStatus = ControlStatus.DownAdd;
    } else {
      this.controlStatus = ControlStatus.DownAdd;
    }
  }

  /**
   * 点击空白区域时应该取消字段选中状态
   */
  cancelSelected(e) {
    const el = e.target;
    if (el.classList.contains('app-pages')) {
      this.updateSelectedControl({ code: '', subSheet: this.isSubSheet });
    }
  }

  closeDialog() {
    this.isCommit = false;
  }

  beforeRouteLeave(to, from, next) {
    this.$h3.modal.hide();
    // 进入以下路由需要缓存
    const cacheRouters = [
      'lightControlAttributePage',
      'lightFormNameEditPage',
      'lightFormPreviewPage',
      'lightFormSubSheetDesignPage',
      'lightFormDesignPage'
    ];
    if (
      to.name === 'lightFormDesignPage' &&
      from.name === 'lightFormSubSheetDesignPage'
    ) {
      // 明细表返回主表时，需对明细表储存的状态进行清空
      this.updateColsNameList({
        name: this.subFormName,
        subSheet: true,
        clear: true
      });
      this.controlKey = '';
      this.updateFormControls({ subSheet: true, control: [] });
      this.subScroll = 0;
      this.sheetName = this.formName;
      this.updateSelectedControl({ code: '', subSheet: true });
    }
    if (!cacheRouters.includes(to.name)) {
      // 退出表单设计器后，需要清空store内的数据，以免带来后续路由进入的数据切换或者不更新
      // this.updateFormControls({ status: '', control: [] });
      // this.updateFormName({ subSheet: this.isSubSheet, name: '' });
      this.updateColsNameList({
        name: this.subFormName,
        subSheet: false,
        clear: true
      });
      this.updateControlCodeList({
        clear: true
      });
      this.excludeComp(['EditForm']);
      this.updateSelectedControl({ code: '', subSheet: false });
      this.updateFormCode('');
      this.handleUniqueControls({ status: '', control: [] });
      this.$refs.formEdit.removeEventListener('scroll', this.handleScroll);
    } else {
      // 缓存后的页面需要对选中状态重新处理
      this.selected = -1;
    }
    this.closeAddControl();
    next();
  }
}
</script>
<style lang="less">
.light-form-edit-container {
  .bottom-sheet {
    .card__footer {
      display: none !important;
    }
  }
  .h3-dialog {
    background: transparent;
  }
  background: #f5f7f9;
}
</style>
<style lang='less' scoped>
@import '~@/light-app/styles/light-app.less';
.action-sheet {
  /deep/.h3ui-actionsheet__cell {
    .px2rem(height, 112);
    .px2rem(font-size, 30);
    .px2rem(line-height, 112);
    background: #fff;
  }
  /deep/.h3ui-actionsheet {
    border-radius: 0.213333rem 0.213333rem 0 0;
    .h3ui-actionsheet__menu {
      border-radius: 0.213333rem 0.213333rem 0 0;
      overflow: hidden;
    }
  }
}
.light-form-edit {
  &__header {
    display: flex;
    justify-content: space-between;
    padding: 0.64rem 0.3733rem 0.5067rem 0.53333rem;
    background: #fff;
    box-sizing: border-box;
    .title {
      .px2rem(margin-right, 24);
      .px2rem(font-size, 36);
      color: #333;
      font-family: PingFangSC-Semibold;
    }
    .icon-box {
      .px2rem(line-height, 54);
      .icon {
        .px2rem(font-size, 36);
        .px2rem(line-height, 54);
        color: #6c7482;
      }
    }
  }
  &__content {
    position: relative;
    .px2rem(margin-top, 20);
    .form-add-box {
      width: 100%;
      .px2rem(margin-bottom, 400);
      .px2rem(margin-top, 72);
      .btn {
        margin: 0 0.4rem;
        padding-top: 0.2667rem;
        padding-bottom: 0.2667rem;
        .px2rem(font-size, 30);
        text-align: center;
        color: @lightAppPrimaryColor;
        border-radius: 0.10677rem;
        border: 1px dashed @lightAppPrimaryColor;
        background: #fff;
      }
      .icon {
        .px2rem(font-size, 32);
        .px2rem(margin-right, 16);
        color: @lightAppPrimaryColor;
      }
    }

    .no-sheet {
      &-box {
        position: fixed;
        top: 50%;
        left: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%) translateY(-50%);
      }
      &-img {
        .px2rem(width, 220);
        .px2rem(height, 220);
        .px2rem(margin-bottom, 48);
      }
      &-text {
        .px2rem(font-size, 28);
        .px2rem(margin-bottom, 48);
        color: #999;
      }
      &-add-box {
        .px2rem(width, 270);
        .px2rem(height, 72);
        .px2rem(height, 72);
        .px2rem(font-size, 32);
        .px2rem(border-radius, 6);
        .px2rem(line-height, 72);
        text-align: center;
        color: #fff;
        background: #107fff;
        &__text {
          .px2rem(font-size, 32);
        }
      }
    }
  }
  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    z-index: 999;
    background: #fff;

    .btn {
      .px2rem(font-size, 32);
    }
    .preview-btn {
      border: 1px solid #ccc;
      color: #333;
      margin: 0.2133rem 0.4rem;
      .px2rem(height, 88);
      .px2rem(width, 200);
      background: #fff;
    }
    .sure-btn-box {
      width: auto;
      flex: 1;
      padding: 0.2133rem 0.4rem;
    }
    .sure-btn {
      color: #fff;
      .px2rem(height, 88);
      // .px2rem(width, 472);
      background: @lightAppPrimaryColor;
    }
  }
  &__icon-sheet {
    .title {
      .px2rem(margin-bottom, 18);
      .px2rem(font-size, 24);
      color: #333;
    }
    .icon-control-list {
      display: flex;
      flex-wrap: wrap;
    }
    .icon-control-item {
      .px2rem(width, 150);
      .px2rem(height, 140);
      .px2rem(margin-right, 30);
      .px2rem(margin-bottom, 24);
      .px2rem(border-radius, 8);
      border: 1px solid #e0e0e0;
      box-sizing: border-box;
      text-align: center;
      &:nth-child(4n) {
        margin-right: 0;
      }

      .name {
        .px2rem(font-size, 24);
        color: #666;
      }
      .icon-box {
        margin: 0 auto;
        .px2rem(width, 48);
        .px2rem(height, 48);
        .px2rem(margin-top, 30);
        .px2rem(margin-bottom, 9);
        .icon {
          .px2rem(font-size, 48);
          color: #6c7482;
        }
      }
      &.selected {
        border: 0;
        color: #fff;
        background: @lightAppPrimaryColor;
        .icon {
          color: #fff;
        }
        .name {
          color: #fff;
        }
      }
      &.disabled {
        .icon {
          color: #b4b7bc;
        }
        .name {
          color: #999;
        }
      }
    }
  }
  &-container {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .loading-box {
      .loading-header {
        display: flex;
        justify-content: space-between;
        .px2rem(height, 136);
        padding: 0.64rem 0.3733rem 0.5067rem 0.53333rem;
        box-sizing: border-box;
        background-clip: content-box;
        background: #fff;
        .loading {
          width: 100%;
          height: 100%;
        }
      }
      .loading-content {
        width: 100%;
        .px2rem(margin-top, 20);
        .px2rem(height, 188);
        .px2rem(padding-top, 20);
        .px2rem(padding-left, 36);
        .px2rem(padding-right, 36);
        .px2rem(padding-bottom, 24);
        box-sizing: border-box;
        background: #fff;
        .loading-title {
          .px2rem(width, 120);
          .px2rem(height, 50);
          .px2rem(margin-bottom, 10);
        }
        .loading-text {
          width: 100%;
          .px2rem(height, 88);
        }
      }
    }
    .l-dialog {
      .h3-dialog {
        background: transparent !important;
      }
      &__content {
        .px2rem(width, 540);
        .px2rem(height, 580);
        width: 100%;
        .icon-tips-box {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          .px2rem(width, 104);
          .px2rem(height, 104);
          margin: auto;
          border-radius: 50%;
          background: #107ff0;
          .icon {
            .px2rem(font-size, 72);
            color: #fff;
          }
        }
        .close-box {
          position: absolute;
          .px2rem(top, 76);
          .px2rem(right, 24);
          .px2rem(width, 32);
          .px2rem(height, 32);
          .icon {
            .px2rem(font-size, 32);
            color: #b4b7bc;
          }
        }
      }
      &__text {
        border-radius: 0.1067rem;
        background: #fff;
        .px2rem(margin-top, 52);
        .px2rem(padding-top, 85);
        width: 100%;
        .parimary-tips {
          .px2rem(font-size, 34);
          .px2rem(margin-bottom, 18);
          font-family: PingFang-SC-Medium;
          color: #333;
        }
        .second-tips {
          .px2rem(margin-bottom, 30);
          .px2rem(font-size, 28);
          color: #999;
        }
        .bottom {
          .px2rem(padding-top, 30);
          .px2rem(padding-bottom, 30);
          .px2rem(font-size, 34);
          color: #107fff;
        }
      }
    }
  }
}
</style>
