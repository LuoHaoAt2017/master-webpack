<template>
  <layout
    :title="title"
    :leftOptions="{preventGoBack: true}"
    @on-click-back="goBack"
  >
    <search v-if="appList.length >= 1" />
    <div
      id="apps-page"
      class="apps-main"
      :style="{bottom: addAppShow ? '0' : '1.30666667rem'}"
    >
      <ul
        v-if="appList.length >= 1"
        class="app-list"
      >
        <li
          v-if="isShowAddApp"
          class="app-list__item app-list__item--add"
          @click="addApp"
        >
          <cell-list
            class="app-list__item-cell"
            name="新建应用"
            :dashed="true"
          >
            <i class="add-btn fa box-icon h3yun_All plus-o"></i>
          </cell-list>
        </li>
        <template v-for="(app, index) in appList">
          <li
            v-if="app.Code !== 'Sys_Workflow'"
            :key="app.ObjectId"
            class="app-list__item"
            :class="{'first-app-guide': index === 0}"
            @click="openApp(app)"
          >
            <cell-list
              :id="app.ObjectId"
              class="app-list__item-cell"
              :name="app.DisplayName"
              iconType="round"
              :iconName="app.IconCss || 'icon-Personnel_021'"
              :loading="app.loading"
              :iconColorIndex="app.IconColorIndex"
              :isLight="app.IsLight"
            />
          </li>
        </template>
      </ul>
      <div
        v-else
        class="app-no-data"
      >
        <div
          v-if="isShowEmptyAddApp"
          class="wrapper"
        >
          <img src="../../assets/img/no-app-admin.png" />
          <span>暂无应用，您可以快速新建空白应用</span>
          <div
            class="add-btn"
            @click="addApp"
          >
            新建应用
          </div>
        </div>
        <div
          v-else
          class="wrapper"
        >
          <img src="../../assets/img/no-app-normal.png" />
          <span>还没有内容，您可以联系管理员</span>
        </div>
      </div>
    </div>
    <bottom-sheet
      :show="addAppShow"
      title="新建应用"
      @close="closeAddApp"
      @touchmove.native.stop.prevent
    >
      <div class="add-option">
        <div
          ref="addOptionGuide"
          class="add-option-card add-option-card--template"
          @click="goToBlank"
        >
          <img
            src="../../assets/img/go-to-new-blank.svg"
            class="card-icon"
          />
          <div class="card-desc">
            <p class="card-desc__title">
              空白应用
            </p>
            <p class="card-desc__tips">
              根据您的业务场景自主搭建，快速开展工作
            </p>
          </div>
          <div class="card-entry-icon">
            <i class="h3yun_All right-o fa box-icon"></i>
          </div>
        </div>
        <div
          v-show="canCreateLightApp"
          class="add-option-card add-option-card--template"
          @click="goToLightTemplate"
        >
          <img
            src="../../assets/img/go-to-new-template.svg"
            class="card-icon"
          />
          <div class="card-desc">
            <p class="card-desc__title">
              应用模板
            </p>
            <p class="card-desc__tips">
              精选100+款场景应用，10万＋企业的选择，管理和业务场景全面覆盖
            </p>
          </div>
          <div class="card-entry-icon">
            <i class="h3yun_All right-o fa box-icon"></i>
          </div>
        </div>
        <div
          v-show="canCreateOldApp"
          class="add-option-card add-option-card--template"
          @click="goToOldTemplate"
        >
          <img
            src="../../assets/img/go-to-new-template.svg"
            class="card-icon"
          />
          <div class="card-desc">
            <p class="card-desc__title">
              模板中心
            </p>
            <p class="card-desc__tips">
              精选100+款场景应用，10万＋企业的选择，管理和业务场景全面覆盖
            </p>
          </div>
          <div class="card-entry-icon">
            <i class="h3yun_All right-o fa box-icon"></i>
          </div>
        </div>
        <div
          v-show="canCreateOldApp"
          class="add-option-card add-option-card--template"
          @click="goToCS"
        >
          <img
            src="../../assets/img/go-to-client.svg"
            class="card-icon scale-img"
          />
          <div class="card-desc">
            <p class="card-desc__title">
              官方定制
            </p>
            <p class="card-desc__tips">
              联系客服提交需求，专业团队为您定制企业专属解决方案
            </p>
          </div>
          <div class="card-entry-icon">
            <i class="h3yun_All right-o fa box-icon"></i>
          </div>
        </div>
      </div>
    </bottom-sheet>
    <div class="app-guide-tool">
      <guide-tool-tip
        v-if="showGuideTip"
        content="点击进入模版"
        :showTip="showGuideTip"
        direction="left-top"
        @hideTip="hideGuideTip"
      />
    </div>
  </layout>
</template>
<script lang="ts">
import {
  Vue, Component, Prop, Emit, Watch,
} from 'vue-property-decorator';
import {
  State, Getter, Mutation, Action, namespace,
} from 'vuex-class';
import { closeApp, openLink } from '@/config/dingtalk-interface';
import bottomSheet from '../../components/common/bottom-sheet.vue';
import cellList from '../../components/common/cell-list.vue';
import search from '../../components/common/search.vue';
import { AppActionType } from '@/store/modules/app/types';
import { MutationType } from '@/store/types';
import { addAppRequestLog, getAppList } from '@/service/app.service';
import Guide from '@/plugins/intro/guide';
import GuideToolTip from '@/components/introduce/guide-tool-tip/index.vue';
// vuex-class module命名空间
const appModule = namespace('App');
const homeModule = namespace('Home');

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

@Component({
  name: 'apps',
  components: {
    bottomSheet,
    cellList,
    search,
    GuideToolTip
  },
})
export default class Apps extends Vue {
  @appModule.State('appList') appList; // 应用列表

  @appModule.State('canCreateLightApp') canCreateLightApp;

  @appModule.State('canCreateOldApp') canCreateOldApp;

  @appModule.Getter('isShowAddApp') isShowAddApp; // 是否显示添加按钮

  @appModule.Getter('isShowEmptyAddApp') isShowEmptyAddApp; // 是否显示空应用状态下的添加按钮

  @appModule.Mutation('handleAppTitle') handleAppTitle;

  title: string = '应用';

  appLoading: boolean = true;

  addAppShow: boolean = false;

  templateInstalled: any = null;

  backTimer: any = null;

  isJumped: boolean = false;

  showGuideTip: boolean = false;

  @appModule.Action(AppActionType.GetAppList) getAppList;

  @Mutation(MutationType.ToggleTabbarShow) toggleTabbarShow;

  @Mutation('excludeComp') excludeComp;

  // 从模板中心返回后重新请求数据，判断是否需要打开表单
  @Watch('appList')
  gotoSchema () {
    const val = this.appList;
    if (!val || !val.length || !val[0].Code) return;
    if (localStorage && localStorage.getItem('appStoreSchemaCode')) {
      const code = localStorage.getItem('appStoreSchemaCode');
      localStorage.removeItem('appStoreSchemaCode');
      for (let i = 0; i < val.length; i++) {
        if (val[i].Code === code) {
          this.openApp(val[i]);
          break;
        }
      }
    }
  }

  handleClose() {
    const tipKey = `appTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
    const hasGuide = localStorage.getItem(tipKey);
    if (window.GlobalConfig.isShowGuide && !JSON.parse(hasGuide)) {
      this.showGuideTip = this.appList.length === 1;
      localStorage.setItem(tipKey, JSON.stringify(true));
    }
  }

  handleSuccess() {
    const self = this;
    const timer = window.setTimeout(() => {
      this.$h3.modal.show({
        maskClosable: false,
        title: `<i class="add-app-success-icon"></i>
          <span class='add-app-close-container' id='template-xyz-close'>
            <i class="add-app-close-icon"></i>
          </span>
        `,
        content: `
          <div class="add-app-success-modal">
            <p>模版安装成功</p>
            <span>修改模版前往电脑端氚云</span>
          </div>
        `,
        actions: [
          {
            text: '知道了',
            onPress () {
              self.$nextTick(() => {
                self.handleClose();
              });
            },
          },
        ],
        mask: true,
        onShow: self.onShow,
      });
      window.clearTimeout(timer);
    }, 400);
  }

  activated () {
    this.toggleTabbarShow(true);
    const { templateInstalled } = this.$route.params;
    this.templateInstalled = templateInstalled;
    // 在弹出模版安装成功弹窗之前，已经完成了应用数据请求。
    this.getAppList().then(() => {
      if (templateInstalled) {
        this.handleSuccess();
      }
    });
  }

  beforeRouteEnter (to, from, next) {
    if (from.path === '/lightTemplate' || from.path === '/schemas') {
      next(vm => {
        vm.getAppList();
      });
    }
    next();
  }

  beforeRouteLeave (to, from, next) {
    // if (to.name !== 'lightAppCreatePage') {
    //   Guide.quit();
    // }
    this.$store.state.excludeComp = ['APPs'];
    window.clearInterval(this.backTimer);
    this.backTimer = null;
    this.showGuideTip = false;
    next();
  }

  goBack () {
    closeApp();
  }

  addApp () {
    // 埋点
    // （实测中发现该接口仅返回许可信息, 询问后台并未有埋点处理，仍有疑问中）
    addAppRequestLog('NewAppAction');
    this.addAppShow = true;
    this.toggleTabbarShow(false);
    this.backStack.push(this.closeAddApp);
    // H3 2.0禁止在移动端创建应用
  }

  closeAddApp () {
    this.backStack.pop();
    this.addAppShow = false;
    this.toggleTabbarShow(true);
  }

  openApp (app: H3.App.AppListItem) {
    if (app.loading) {
      return;
    }
    this.handleAppTitle(app.DisplayName);
    if (this.templateInstalled) {
      this.$router.push({
        name: 'schemas',
        params: {
          appCode: app.Code,
          first: 'true'
        },
        query: {
          appCode: app.Code,
          first: 'true'
        },
      });
    } else {
      this.$router.push({
        name: 'schemas',
        params: {
          appCode: app.Code,
        },
        query: {
          appCode: app.Code,
        },
      });
    }
  }

  goToOldTemplate () {
    // 埋点
    addAppRequestLog('NewAppAction-FromStore');
    window.clearInterval(this.backTimer);
    this.backTimer = window.setInterval(() => {
      const fromStore = localStorage.getItem('fromStore');
      if (fromStore) {
        if (this.isJumped) {
          return;
        }
        this.isJumped = true;
        localStorage.removeItem('fromStore');
        this.getAppList();
        window.clearInterval(this.backTimer);
        this.isJumped = false;
      }
    }, 500);
    openLink(this.$store.state.UserInfo.storeUrl + '&fromH3=true');
    this.closeAddApp();
  }

  goToLightTemplate () {
    this.$router.push({
      name: 'lightTemplate',
    });
    this.closeAddApp();
  }

  goToBlank () {
    // 埋点
    addAppRequestLog('NewAppAction-FromPC');
    // if (this.canCreateLightApp) {
    //   // 先隐藏引导弹窗再关闭新增弹窗
    //   // if (Guide.hasGuid) {
    //   //   Guide.hide();
    //   //   this.backStack.popOnly();
    //   // }
    //   this.closeAddApp();
    //   this.$router.push({
    //     name: 'lightAppCreatePage',
    //   });
    // } else {
    //   this.$router.push({
    //     name: 'newBlank',
    //   });
    // }
    this.$router.push({
      name: 'newBlank',
    });
  }

  goToCS () {
    // 埋点
    addAppRequestLog('NewAppAction-FromService');
    openLink(
      'https://www.sobot.com/chat/pc_new/index.html?sysNum=ba53512829e343058872e7c2ab942a7e&amp;color=0f92ed&amp;lan=cn&amp;invite=0&amp;unreadcount=0',
    );
    this.closeAddApp();
  }

  hideGuideTip() {
    this.showGuideTip = false;
  }

  onShow() {
    setTimeout(() => {
      const elem = document.getElementById('template-xyz-close')
      elem && elem.addEventListener('click', () => {
        this.$h3.modal.hide();
        this.handleClose();
      });
    }, 500);
  }
}
</script>
<style lang="less">
@baseFontSize: 75;
@baseThemeColor: #107fff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
#apps-page {
  position: absolute;
  top: 0;
  right: 0;
  // .px2rem(bottom, 60);
  left: 0;
  width: 100%;
  // height: 100%;
  z-index: 998;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f5f7f9;
  -webkit-overflow-scrolling: touch;
  .app-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    min-height: 35%;
    .px2rem(margin-top, 108);
    .px2rem(margin-bottom, 100);
    background: #fff;
    &__item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 33%;
      background: #fff;
      transition: background 0.2s;
      &:not(.app-list__item--add):active {
        background: #f6fafd;
      }
      .px2rem(padding-top, 20);
      .px2rem(padding-bottom, 10);
      &-cell {
        .add-btn {
          color: @baseThemeColor;
        }
      }
    }
  }
  .app-no-data {
    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      .px2rem(margin-top, 220);
      img {
        .px2rem(width, 450);
      }
      span {
        font-size: 15px;
        color: #666;
      }
      .add-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        .px2rem(width, 320);
        .px2rem(height, 72);
        .px2rem(margin-top, 60);
        .px2rem(border-radius, 44);
        background: @baseThemeColor;
        color: #fff;
        font-size: 15px;
        transition: background 0.15s;
        &:active {
          background: #0c6cd9;
        }
      }
    }
  }
}
.add-option {
  display: flex;
  flex-direction: column;
  align-items: center;

  &-card {
    display: flex;
    align-items: center;
    width: 100%;
    .px2rem(height, 200);
    .px2rem(border-radius, 10);
    background: #fff;
    box-shadow: 0px 11px 55px 0px rgba(80, 119, 188, 0.11);
    transition: box-shadow 0.2s ease;
    &:active {
      box-shadow: 0px 6px 20px 3px rgba(80, 119, 188, 0.11);
    }
    &--template {
      position: relative;
      background-size: cover;
      .px2rem(margin-bottom, 20);
      &:last-child {
        margin-bottom: 0;
      }
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        .px2rem(right, 20);
        width: 0;
        height: 0;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid #fff;
      }
      .card-entry-icon {
        position: absolute;
        .px2rem(right, 24);
        .px2rem(font-size, 14);
        color: #bfc3cb;
      }
    }
    .card-icon {
      .px2rem(width, 120);
      .px2rem(margin-left, 32);
      .px2rem(margin-right, 58);
      &.scale-img {
        .px2rem(width, 90);
        .px2rem(margin-left, 47);
        .px2rem(margin-right, 73);
      }
    }
    .card-desc {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .px2rem(height, 140);
      .px2rem(margin-right, 75);
      &__title {
        font-size: 15px;
        font-family: PingFangSC-Semibold;
        color: #333;
      }
      &__tips {
        font-size: 13px;
        font-weight: 400;
        color: #999;
        .px2rem(font-size, 26);
        .px2rem(line-height, 34);
      }
    }
  }
}
/deep/ .bottom-sheet .card__body {
  .px2rem(max-height, 880);
}
.app-guide-tool {
  position: absolute;
  .px2rem(left, 300);
  .px2rem(top, 350);
  z-index: 999;
}
.add-app-close-container {
  position: absolute;
  .px2rem(top, 15);
  .px2rem(right, 24);
  .add-app-close-icon {
    .px2rem(width, 40);
    .px2rem(height, 40);
    display: inline-block;
    background: url("../../assets/img/guidance/close/close(1).png");
    background-size: cover;
  }
}
</style>
