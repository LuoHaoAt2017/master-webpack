<template>
  <layout :title="title" :leftOptions="{preventGoBack: true}" @on-click-back="goBack">
    <div class="guide">
      <div v-if="showGuideLoadingMask" class="guide__mask">
        <h3-icon style="color: #999; font-size: 12px;" type="loading" />
        <span style="margin-left: 5px;">正在加载</span>
      </div>
      <div class="guide__container">
        <h1 class="template-tips">开始搭建您的第一个应用</h1>
        <ul class="app-list">
          <li class="app-list__item" @click="createAppBySelf">
            <cell-list
              class="app-list__item-cell self-create"
              name="自主搭建"
              :address="addApp.src"
              :loading="false"
            />
          </li>
          <li v-for="item in templateList" :key="item.Code" class="app-list__item" @click="openApp(item)">
            <cell-list
              class="app-list__item-cell"
              :name="item.Name"
              :address="item.Logo"
              :loading="item.loading"
            />
            <div v-if="item.detailLoading" class="app-list__item--loading">
              <span aria-label="loading" class="h3-loading-spinner"></span>
            </div>
          </li>
          <li class="app-list__item add" @click="goToTemplate">
            <cell-list class="app-list__item-cell" name="更多模板" :address="templateIconBase64" />
          </li>
        </ul>
        <bottom-sheet :show="templateDetailShow" title="模板详情" @close="closeTemplateDetail">
          <h3-template-detail
            v-model="screenshotsShow"
            :logo="templateDetail.Logo"
            :name="templateDetail.Name"
            :code="templateDetail.Code"
            :isFree="templateDetail.IsFree"
            :price="templateDetail.Price"
            :rate="templateDetail.Rate"
            :recommendation="templateDetail.Recommendation"
            :summary="templateDetail.Summary"
            :installedCount="templateDetail.InstalledCount"
            :screenShots="templateDetail.MobileScreenShots"
            :commentListTotal="templateDetail.CommentListTotal"
            :showComment="false"
          />
          <div slot="footer">
            <h3-button
              type="primary"
              :disabled="isInstalling || disabled"
              :loading="isInstalling"
              size="large"
              @click="installTemplate"
              inline
              style="width: 100%; background: #107fff;"
            >
              <span style="font-size: 17px">{{ installTips }}</span>
            </h3-button>
          </div>
        </bottom-sheet>
      </div>
    </div>
  </layout>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { State, Getter, Mutation, Action, namespace } from "vuex-class";
import {
  setTitle,
  setLeft,
  closeApp,
  openLink
} from "@/config/dingtalk-interface";
import { isDingtalk } from "@/config/common";
import cellList from "@/components/common/cell-list.vue";
import bottomSheet from "../../components/common/bottom-sheet.vue";
import { H3Button, H3Icon } from "h3-mobile-vue";
import { H3TemplateDetail } from "h3-template-detail";
import { AppActionType } from "@/store/modules/app/types";
import {
  getRecommendTemplates,
  getTemplateDetail,
  installTemplate,
  addAppRequestLog,
  sendQickEntryLink,
  checkShowGuidance,
  getAppList
} from "@/service/app.service";
import App = H3.App;
import Reponse = H3.Http.Response;
import Storage from '@/utils/storage';
import setTitle$ from 'dingtalk-jsapi/api/biz/navigation/setTitle';
const appModule = namespace("App");

Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate" // for vue-router 2.2+
]);

@Component({
  components: {
    cellList,
    bottomSheet,
    H3Button,
    H3TemplateDetail,
    H3Icon
  }
})
export default class guide extends Vue {
  @appModule.State("appList") appList; // 应用列表

  title: string = "新建应用";

  templateList: any[] = [];

  templateDetail: any = {};

  showSteps: boolean = false;

  templateDetailShow: boolean = false;

  screenshotsShow: boolean = false;

  isInstalling: boolean = false;

  disabled: boolean = false;

  showGuideLoadingMask: boolean = false;

  countdownTimer: any = null;

  backTimer: any = null;

  installTips: string = "安装";

  isJumped: boolean = false;

  @appModule.Action(AppActionType.GetAppList) getAppList;

  addApp: Object = {
    alt: '自主搭建应用',
    src: require('@/assets/img/plus-app/plus-o.png')
  }
  templateIconBase64: string =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzZweCIgaGVpZ2h0PSI3NHB4IiB2aWV3Qm94PSIwIDAgNzYgNzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjYgKDY3NDkxKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5Db21iaW5lZCBTaGFwZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMTAwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIiBpZD0ibGluZWFyR3JhZGllbnQtMSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiM1M0E2RkYiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwODBGRiIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSLnp7vliqjnq68t5a6a56i/IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMDIt5paw5bu65bqU55SoLWNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MTMuMDAwMDAwLCAtOTUzLjAwMDAwMCkiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMSkiPgogICAgICAgICAgICA8ZyBpZD0iUmVjdGFuZ2xlLUNvcHktOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzk2LjAwMDAwMCwgODk5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IuaooeeJiOS4reW/gyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTE3LjAwMDAwMCwgNTQuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTQ2LDQwIEw3Miw0MCBDNzQuMjA5MTM5LDQwIDc2LDQxLjc5MDg2MSA3Niw0NCBMNzYsNzAgQzc2LDcyLjIwOTEzOSA3NC4yMDkxMzksNzQgNzIsNzQgTDQ2LDc0IEM0My43OTA4NjEsNzQgNDIsNzIuMjA5MTM5IDQyLDcwIEw0Miw0NCBDNDIsNDEuNzkwODYxIDQzLjc5MDg2MSw0MCA0Niw0MCBaIE00NiwwIEw3MiwwIEM3NC4yMDkxMzksLTQuMDU4MTIyNTFlLTE2IDc2LDEuNzkwODYxIDc2LDQgTDc2LDMwIEM3NiwzMi4yMDkxMzkgNzQuMjA5MTM5LDM0IDcyLDM0IEw0NiwzNCBDNDMuNzkwODYxLDM0IDQyLDMyLjIwOTEzOSA0MiwzMCBMNDIsNCBDNDIsMS43OTA4NjEgNDMuNzkwODYxLDQuMDU4MTIyNTFlLTE2IDQ2LDAgWiBNNCw0MCBMMzAsNDAgQzMyLjIwOTEzOSw0MCAzNCw0MS43OTA4NjEgMzQsNDQgTDM0LDcwIEMzNCw3Mi4yMDkxMzkgMzIuMjA5MTM5LDc0IDMwLDc0IEw0LDc0IEMxLjc5MDg2MSw3NCAyLjcwNTQxNWUtMTYsNzIuMjA5MTM5IDAsNzAgTDAsNDQgQy0yLjcwNTQxNWUtMTYsNDEuNzkwODYxIDEuNzkwODYxLDQwIDQsNDAgWiBNNCwwIEwzMCwwIEMzMi4yMDkxMzksLTQuMDU4MTIyNTFlLTE2IDM0LDEuNzkwODYxIDM0LDQgTDM0LDMwIEMzNCwzMi4yMDkxMzkgMzIuMjA5MTM5LDM0IDMwLDM0IEw0LDM0IEMxLjc5MDg2MSwzNCAyLjcwNTQxNWUtMTYsMzIuMjA5MTM5IDAsMzAgTDAsNCBDLTIuNzA1NDE1ZS0xNiwxLjc5MDg2MSAxLjc5MDg2MSw0LjA1ODEyMjUxZS0xNiA0LDAgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";

  @Watch("screenshotsShow", { immediate: true })
  modals(newVal: boolean, oldVal: boolean) {
    if (newVal && this.templateDetailShow) {
      this.backStack.push(() => {
        this.screenshotsShow = false;
      });
    } else if (!newVal && this.templateDetailShow) {
      this.backStack.push(() => {
        this.screenshotsShow = false;
      });
      this.backStack.pop();
    }
  }

  async created() {
    if (isDingtalk) {
      window.dd.ready(() => {
        document.addEventListener("resume", this.resume, false);
      });
    }
    this.getTemplates();
    // const res = await getStoreUrl();
    // if (res.Successful) {
    //   this.$store.state.autoLoginToStoreUrl = res.ReturnData.StoreUrl;
    // }
  }

  activated() {
    this.title = "新建应用";
    this.installTips = "安装";
    this.backTimer = null;
  }

  beforeRouteEnter(to, from, next) {
    // 直接进入落地页，如果发现需要进入引导页，那么需要首先进入引导页面。
    const isAdmin = window.GlobalConfig.isAdmin;
    checkShowGuidance().then(res => {
      if (res.ReturnData.ShowGuide && isAdmin) {
        next('/guidance');
      } else {
        next();
      }
    });
  }

  beforeRouteLeave(to, from, next) {
    document.removeEventListener("resume", this.resume);
    window.clearInterval(this.backTimer);
    this.backTimer = null;
    next();
  }

  resume() {
    // todo: 后台接口速度提升再用
    this.showGuideLoadingMask = true;
    this.getAppList().then((res) => {
      if (res.Apps.length >= 1) {
        this.$router.push({
          name: 'apps'
        });
        return;
      }
    }).finally(() => {
      this.showGuideLoadingMask = false;
    });

    // if (this.isJumped) {
    //   return;
    // }
    // this.isJumped = true;
    // this.$router.push({
    //   name: "apps"
    // });
    // this.isJumped = false;
  }

  async getTemplates() {
    this.templateList = new Array(5).fill({ loading: true }); // 展现加载状态
    try {
      const res = await getRecommendTemplates();
      if (res.Successful) {
        const result = res.ReturnData.Result;
        if (result) {
          result.forEach(item => {
            item.detailLoading = false;
          });
          this.templateList = result;
        } else {
          this.templateList = [];
        }
      } else {
        this.$h3.toast.show({
          text: res.ErrorMessage,
          iconType: "warning"
        });
      }
    } catch (error) {
      this.$h3.toast.show({
        text: "请求失败",
        iconType: "warning"
      });
    }
  }

  async openApp(item: any) {
    if (this.isInstalling || item.loading) {
      return;
    }
    item.detailLoading = true;
    this.backStack.push(() => {
      this.templateDetailShow = false;
    });
    try {
      const res = await getTemplateDetail(item.Code);
      if (res.Successful) {
        this.templateDetailShow = true;
        item.detailLoading = false;
        this.templateDetail = res.ReturnData.TemplateDetail;
        this.templateDetail.CommentListTotal = res.ReturnData.CommentListTotal;
        this.installTips = this.templateDetail.IsFree ? "安装" : "安装试用";
      } else {
        item.detailLoading = false;
        this.$h3.toast.show({
          text: res.ErrorMessage,
          iconType: "warning"
        });
      }
    } catch (error) {
      item.detailLoading = false;
      this.$h3.toast.show({
        text: "请求失败",
        iconType: "warning"
      });
    }
  }

  createAppBySelf() {
    // 点击新建应用埋点
    addAppRequestLog('NewAppAction');
    const self = this;
    const engineCode = window.GlobalConfig.engineCode;
    const hasSend = Storage.getExpire(`send-message-to-pc-${engineCode}`);
    if (hasSend) {
      // 如果已经发送了链接给电脑端，那么直接打开新建空白应用页面。
      this.$router.push({name: "newBlank"});
    } else {
      // 发送消息没有超过上限，发送链接给电脑端。
      this.$h3.modal.show({
        title: `
          <span class='push-mesg-to-pc-container'>
            <i class="push-mesg-to-pc-icon"></i>
          </span>
          <span class='add-app-close-container' id='guide-xyz-close'>
            <i class="add-app-close-icon"></i>
          </span>
        `,
        content: `
          <div class="push-mesg-to-pc-modal">
            <p>前往电脑端钉钉工作通知打开消息链接，快速启动氚云搭建应用</p>
          </div>
        `,
        actions: [
          {
            text: '发送链接',
            style: 'color:rgba(16,127,255,1);',
            onPress () {
              self.sendMesssageToPC();
            },
          },
        ],
        onShow: self.onShow,
      });
    }
  }

  async sendMesssageToPC() {
    const res = await sendQickEntryLink();
    if (!res.Successful) {
      this.$h3.toast.show({
        text: '链接发送失败',
        iconType: 'close',
        duration: 1500,
        mask: true
      });
    } else {
      this.$h3.toast.show({
        text: '链接发送成功',
        iconType: 'check-circle-o',
        duration: 1500,
        mask: true
      });
      const engineCode = window.GlobalConfig.engineCode;
      Storage.setExpire(`send-message-to-pc-${engineCode}`, true);
    }
  }

  closeTemplateDetail() {
    this.backStack.pop();
    this.templateDetailShow = false;
    this.screenshotsShow = false;
  }

  async installTemplate() {
    if (this.isInstalling) {
      return;
    }
    this.isInstalling = true;
    this.installTips = "安装中";
    try {
      const res = await installTemplate(
        this.templateDetail.Code,
        !this.templateDetail.IsFree
      );
      if (res.Successful) {
        addAppRequestLog('NewAppAction-FromTemplate');
        this.isInstalling = false;
        this.installTips = "已安装";
        this.$router.push({
          name: "apps",
          params: {
            templateInstalled: "true"
          }
        });
      } else {
        this.isInstalling = false;
        this.installTips = "重新安装";
        this.$h3.toast.show({
          text: res.ErrorMessage,
          iconType: "warning"
        });
      }
    } catch (error) {
      this.isInstalling = false;
      this.installTips = "重新安装";
      this.$h3.toast.show({
        text: "请求失败",
        iconType: "warning"
      });
    }
  }

  goToTemplate() {
    this.backTimer = window.setInterval(() => {
      const fromStore = localStorage.getItem("fromStore");
      if (fromStore) {
        // if (this.isJumped) {
        //   return;
        // }
        // this.isJumped = true;
        localStorage.removeItem("fromStore");
        // this.$router.push({
        //   name: "apps"
        // });
        window.clearInterval(this.backTimer);
        // this.isJumped = false;
      }
    }, 500);
    // 在新窗口上打开链接
    openLink(this.$store.state.UserInfo.storeUrl + "&fromH3=true");
  }

  hideGuideHome() {
    this.showSteps = true;
  }

  goBack() {
    closeApp();
  }

  onShow() {
    setTimeout(() => {
      const elem = document.getElementById('guide-xyz-close')
      elem && elem.addEventListener('click', () => {
        this.$h3.modal.hide();
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
.guide__mask {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  z-index: 9999;
  vertical-align: middle;
}
.guide__container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f7f9;
  .template-tips {
    .px2rem(margin-top, 62);
    .px2rem(margin-right, 44);
    .px2rem(margin-left, 44);
    .px2rem(margin-bottom, 60);
    font-size: 21px;
    font-weight: 500;
    text-align: center;
    animation: title-in 0.7s ease;
  }
  .app-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .px2rem(margin-left, 44);
    .px2rem(margin-right, 44);
    .px2rem(padding-top, 16);
    .px2rem(padding-bottom, 28);
    animation: list-in 0.7s ease;
    &__item {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .px2rem(width, 310);
      .px2rem(margin-bottom, 42);
      background: #fff;
      box-shadow: 0px 5px 22px 0px rgba(80, 119, 188, 0.08);
      transition: background 0.2s;
      &:not(.add):active {
        background: #f6fafd;
      }
      .px2rem(padding-top, 30);
      .px2rem(padding-bottom, 10);
      &-cell {
        .add-btn {
          color: @baseThemeColor;
        }
      }
      &--loading {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.6);
      }
    }
    .more-templates {
      color: @baseThemeColor;
      font-size: 13px;
    }
  }
}
.guide__home {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  width: 100%;
}
.guide__wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  overflow: auto;
  background: #fff;
}
.home__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  .px2rem(padding-bottom, 74);
  &-icon {
    width: 100%;
  }
}
.home__title {
  .px2rem(font-size, 46);
  color: @baseThemeColor;
  &-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    .px2rem(width, 258);
    .px2rem(height, 56);
    .px2rem(font-size, 26);
    .px2rem(margin-top, 24);
    background: #eef7ff;
    border-radius: 1000px;
    color: @baseThemeColor;
  }
}
.home__content {
  position: relative;
  .px2rem(width, 440);
  .px2rem(min-height, 490);
  .px2rem(margin-bottom, 50);
  margin-left: auto;
  margin-right: auto;
}
.home__icon {
  width: 100%;
}
.animate-word {
  position: absolute;
  .px2rem(font-size, 34);
  color: @baseThemeColor;
  &--one {
    .px2rem(top, 125);
    left: 0;
    animation: word-one 3s ease infinite both;
  }
  &--two {
    .px2rem(top, 65);
    .px2rem(left, 54);
    animation: word-two 3s ease 0.8s infinite both;
  }
  &--three {
    .px2rem(top, 50);
    .px2rem(right, 84);
    animation: word-three 3s ease 0.4s infinite both;
  }
  &--four {
    .px2rem(top, 104);
    right: 0;
    animation: word-four 3s ease 1.2s infinite both;
  }
}
.home__tips {
  text-align: center;
  .px2rem(margin-bottom, 20);
  font-size: 14px;
  color: #91969a;
}
.home__btn {
  .px2rem(margin-top, 45);
  flex: none;
  .px2rem(width, 428);
}
.guide__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  .px2rem(bottom, 56);
  .px2rem(height, 82);
  .px2rem(padding-left, 32);
  .px2rem(padding-right, 32);
}
.guide__bottom-home {
  width: 100%;
  text-align: center;
}
.guide__home-btn {
  .px2rem(width, 428);
  .px2rem(margin-top, 38);
  background: @baseThemeColor;
  // background: linear-gradient(90deg, @bubbleGradientFrom, @bubbleGradientTo);
  font-size: 17px;
}

.guide-home-enter-active,
.guide-home-leave-active {
  transition: all 0.4s ease-out;
}
.guide-home-enter, .guide-home-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}
.push-mesg-to-pc-modal {
  position: relative;
  p {
    .px2rem(widthm, 480);
    .px2rem(height, 88);
    .px2rem(font-size, 28);
    .px2rem(line-height, 44);
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
  }
}
.push-mesg-to-pc-container {
  position: absolute;
  .px2rem(top, -55);
  left: 50%;
  transform: translateX(-50%);

  .px2rem(width, 112);
  .px2rem(height, 112);
  .px2rem(border-radius, 56);
  background:rgba(16,127,255,1);

  display: flex;
  justify-content: center;
  align-items: center;

  .push-mesg-to-pc-icon {
    .px2rem(width, 56);
    .px2rem(height, 56);

    display: inline-block;
    background: url("../../assets/img/guidance/desktop-o.svg");
    background-size: cover;
  }
}
.app-list__item-cell.self-create {
  .cell-list__top {
    &--img {
      .px2rem(border-radius, 16)!important;
      border: 1px dashed #107FFF!important;
      img {
        transform: scale(0.5);
      }
    }
  }
}
// TODO 该删除会影响正常的加载样式
/*.h3-loading-spinner {
  width: 12px;
  height: 12px;
  position: relative;
}*/

@keyframes word-one {
  0% {
    opacity: 0;
    transform: scale(0.65) translate3d(0, 0, 0);
    transform-origin: center bottom;
  }
  90% {
    opacity: 1;
  }
  99% {
    transform: scale(1) translate3d(0, -0.35rem, 0);
  }
  100% {
    opacity: 0;
    transform: scale(0.65) translate3d(0, 0, 0);
    transform-origin: center bottom;
  }
}

@keyframes word-two {
  0% {
    opacity: 0;
    transform: scale(0.65) translate3d(0, 0, 0);
    transform-origin: center bottom;
  }
  90% {
    opacity: 1;
  }
  99% {
    transform: scale(1) translate3d(0, -0.67rem, 0);
  }
  100% {
    opacity: 0;
    transform: scale(0.65) translate3d(0, 0, 0);
    transform-origin: center bottom;
  }
}

@keyframes word-three {
  0% {
    opacity: 0;
    transform: scale(0.65) translate3d(0, 0, 0);
    transform-origin: center bottom;
  }
  90% {
    opacity: 1;
  }
  99% {
    transform: scale(1) translate3d(0, -0.65rem, 0);
  }
  100% {
    opacity: 0;
    transform: scale(0.65) translate3d(0, 0, 0);
    transform-origin: center bottom;
  }
}

@keyframes word-four {
  0% {
    opacity: 0;
    transform: scale(0.65) translate3d(0, 0, 0);
    transform-origin: center bottom;
  }
  90% {
    opacity: 1;
  }
  99% {
    transform: scale(1) translate3d(0, -0.6rem, 0);
  }
  100% {
    opacity: 0;
    transform: scale(0.65) translate3d(0, 0, 0);
    transform-origin: center bottom;
  }
}

@keyframes title-in {
  0% {
    opacity: 0;
    transform: scale3d(0.8, 0.8, 1);
    transform-origin: center center;
  }
  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
    transform-origin: center center;
  }
}

@keyframes list-in {
  0% {
    opacity: 0;
    transform: scale3d(0.65, 0.65, 1);
    transform-origin: center bottom;
  }
  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
    transform-origin: center bottom;
  }
}
</style>
