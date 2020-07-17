<template>
  <div
    id="app"
    class="app-wrap"
  >
    <keep-alive :exclude="excludeComp">
      <router-view />
    </keep-alive>
    <!-- <authorization-limit
      :authorizedCount="authorizedCount"
      :userCount="userCount"
      :show="limitModal"
      @closeLimit="closeLimit"
      @contactCustomer="contactCustomer"
    /> -->
  </div>
</template>

<script lang="ts">
/**
 * @author YJH
 */
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { getAuthorizationInfo, addAppRequestLog } from '@/service/app.service';
import { IsExpires, SetLimitStorage } from '@/config/limit-number';
import { openLink } from '@/config/dingtalk-interface';
import '@/pages/form/config/FormLogicContext';
// import AuthorizationLimit from '@/components/common/authorization-limit.vue';

@Component({
  name: 'MainApp',
})
export default class App extends Vue {
  loaded: boolean = false;

  limitModal = false; // 人数许可弹窗

  authorizedCount = 0; // 人数许可上限人数

  userCount = 0; // 公司通讯录人数

  @State('excludeComp')
  excludeComp: string[];

  @State('engineCode')
  engineCode: string;

  @State('UserInfo')
  userInfo: any;

  get isAdministrator () {
    return this.userInfo.isAdministrator;
  }

  created () {
    window.$h3 = this.$h3;
    window.$aut = this.$aut;
    this.$store.state.suiteKey = window.GlobalConfig.suiteKey;
    this.$store.state.corpId = window.GlobalConfig.corpId;
    // PC端模拟支持查看数据
    this.$store.state.appId = window.GlobalConfig.appCode || 'home';
    this.$store.state.appCode = window.GlobalConfig.appCode || 'home';
    this.$store.state.homeType = window.GlobalConfig.homeType;
    this.$store.state.engineCode = window.GlobalConfig.engineCode;
    this.$store.state.solutionCode = window.GlobalConfig.solutionCode || 'home';
    this.$store.state.IsExternalForm = window.GlobalConfig.isExternalForm;
    this.$store.state.IsExternalShare = window.GlobalConfig.isExternalShare;
    this.$store.state.agentId = window.GlobalConfig.agentId;
    this.$store.state.UserInfo.userId = window.GlobalConfig.userId;
    this.$store.state.UserInfo.userName = window.GlobalConfig.userName;
    this.$store.state.UserInfo.userParent = window.GlobalConfig.userParent;
    this.$store.state.UserInfo.companyId = window.GlobalConfig.companyId;
    this.$store.state.UserInfo.profilePhotoUrl =
      window.GlobalConfig.userPhotoUrl;
    this.$store.state.UserInfo.isAdministrator = window.GlobalConfig.isAdmin;
    this.$store.state.UserInfo.storeUrl = window.GlobalConfig.storeUrl;
    this.$store.state.UserInfo.companyName = window.GlobalConfig.companyName;
    this.$store.state.separatedAppCodeList =
      window.GlobalConfig.separatedAppCodeList;
    this.$store.state.solutionName = window.GlobalConfig.solutionName;
    this.$store.state.isShowGuide = window.GlobalConfig.isShowGuide;
    this.$store.state.isAPaas = window.GlobalConfig.isAPaaS;
    this.$store.state.isSingleApp = window.GlobalConfig.isSingleApp;
    this.$sentry.configureScope(function (scope) {
      scope.setUser({
        id: window.GlobalConfig.userId,
        username: window.GlobalConfig.userName,
        engine: window.GlobalConfig.engineCode,
        solutionCode: window.GlobalConfig.solutionCode || 'home',
        appId: window.GlobalConfig.appCode || 'home',
        appCode: window.GlobalConfig.appCode || 'home',
        agentId: window.GlobalConfig.agentId,
      });
    });
    // addAppRequestLog('Mobile Loaded'); // 解决首次登陆权限弹窗问题
  }

  mounted () {
    // 监听窗口变化事件（弹出键盘），如果当前正在输入，则页面滚动至正在输入的文本框
    window.addEventListener('resize', () => {
      if (!document.activeElement) {
        return;
      }
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA'
      ) {
        setTimeout(() => {
          if (
            document.activeElement &&
            document.activeElement.scrollIntoViewIfNeeded
          ) {
            document.activeElement.scrollIntoViewIfNeeded();
          }
        }, 0);
      }
    });
    // this.getAuthorizationInfo();
  }

  async getAuthorizationInfo () {
    const engineCode = this.$store.state.engineCode;
    const userId = this.$store.state.UserInfo.userId;
    // eslint-disable-next-line no-trailing-spaces
    if (IsExpires(engineCode, userId) && 
      this.$store.state.UserInfo.isAdministrator) { // 需要弹窗
      const ret = await getAuthorizationInfo();
      if (ret.Successful) {
        const data = ret.ReturnData;
        this.limitModal = data.IsUpgradeSystem;
        this.authorizedCount = data.AuthorizedCount;
        this.userCount = data.UserCount;
        if (this.limitModal) {
          SetLimitStorage(engineCode, userId, 2);
        }
      }
    }
  }

  /**
   * 稍后提醒
  */
  closeLimit () {
    this.limitModal = false;
  }

  /**
   * 联系客服
  */
  contactCustomer () {
    this.limitModal = false;
    openLink('https://www.sobot.com/chat/pc/index.html?sysNum=ba53512829e343058872e7c2ab942a7e&channelFlag=2&groupId=b106bb580a2c49bea27715159d6a71c3');
  }
}
</script>

<style lang="less">
@import "./styles/reset.css";
@import "./styles/common.less";
@import "./assets/css/tip-box.less";
@import "./plugins/intro/guide.less";
// @import './icons/style.css';

@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.px2remimp(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem !important;
}
#app {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 0; //加这一句，否则预览组件在审批页面不显示
  // background-color: #fff;
}

.slide-left-enter,
.slide-right-leave-active {
  //  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  //  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100% 0);
}

.app-container-box .weui-toast {
  z-index: 99999;
}
.h3-modal-container {
  z-index: 100000 !important;
}
/*.h3-modal {
  .h3-modal-content {
    .h3-modal-header {
      padding: 13px 15px;
      .h3-modal-title {
        line-height: 1;
        font-size: 17px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    .h3-modal-body {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 21px;
    }
    .h3-modal-footer {
      .h3-modal-button-group-h .h3-modal-button {
        font-size: 17px !important;
      }
    }
  }
}*/
.add-app-success-modal {
  position: relative;
  p {
    .px2rem(margin-bottom, 10);
    .px2rem(font-size, 36);
    .px2rem(height, 50);
    .px2rem(line-height, 50);
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
  }
  span {
    .px2rem(font-size, 30);
    .px2rem(height, 42);
    .px2rem(line-height, 42);
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
  }
}
.add-app-success-icon {
  position: absolute;
  .px2rem(top, -55);
  left: 50%;
  transform: translateX(-50%);
  .px2rem(width, 120);
  .px2rem(height, 120);
  background: url("./assets/img/add-app-success-icon.svg");
  background-size: cover;
}
.single-app-update-layout {
  position: absolute;
  .px2rem(top, -55);
  left: 50%;
  transform: translateX(-50%);
  .px2rem(width, 120);
  .px2rem(height, 120);
  background: url("./assets/img/updateLayout.png");
  background-size: cover;
}
.h3-modal-wrap .h3-modal-content {
  overflow: initial;
}
</style>
