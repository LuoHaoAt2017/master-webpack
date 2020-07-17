<template>
  <layout :title="title" :leftOptions="{preventGoBack: true}" @on-click-back="goBack">
    <div id="home-page" class="main wrapper">
      <div class="sec-wrapper">
        <home-user-info />

        <home-mywork-list />

        <home-quick-build />

        <home-ad-banner @hideHeaderTitle="hideHeaderTitle" />

        <home-reports />

        <template>
          <div class="home-button-box">
            <div v-if="UserInfo.isAdministrator" class="flex-box">
              <a class="aButton contact-service" @click="link">联系客服</a>
            </div>
            <div class="flex-box">
              <a class="aButton contact-service" @click="manageCardSetting">自定义卡片</a>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- <version-update
      :modalShow="guideModalShow"
      @close="closeUpdateModal"
      @confirm="goToCreateApp"
    /> -->
  </layout>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit, Watch, Mixins,
} from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import {
  closeApp, openLink, hideRightMenu, showRightMenu,
} from '@/config/dingtalk-interface';
import homeUserInfo from '@/components/home/home-user-info.vue';
import homeMyworkList from '@/components/home/home-mywork-list.vue';
import homeQuickBuild from '@/components/home/home-quick-build.vue';
import homeAdBanner from '@/components/home/home-ad-banner.vue';
import VersionUpdate from '@/pages/intro-home/version-update.vue';
import { HomeActionType } from '@/store/modules/home/types';
import { checkGuide } from '@/service/app.light.common.api';
import { getAppList } from '@/service/app.service';
// vuex-class module命名空间
const homeModule = namespace('Home');
// 异步组件的方式，先加载关键数据，异步加载首页报表
const HomeReports = () => import(/* webpackChunkName: "homereports" */ '@/components/home/reports/home-reports.vue');

Component.registerHooks(['beforeRouteLeave']);

@Component({
  name: 'home',
  components: {
    homeUserInfo,
    homeMyworkList,
    homeQuickBuild,
    homeAdBanner,
    HomeReports,
    VersionUpdate,
  },
})
export default class Home extends Vue {
  title: string = '氚云';

  isInit: boolean = true;

  guideModalShow: boolean = false;

  @State('UserInfo')
  UserInfo: H3.Common.UserInfo;

  @homeModule.Action(HomeActionType.GetHomeDatas)
  getHomeDatas;

  async mounted () {
    // 屏蔽新手引导
    // const guideModalShow = localStorage.getItem('ShowGuide');
    // if (guideModalShow === 'false') {
    //   this.guideModalShow = false;
    // } else {
    //   // 获取用户是否需要引导
    //   const res = await checkGuide();
    //   if (res.success) {
    //     this.guideModalShow = res.returnData.showGuide;
    //     localStorage.setItem('ShowGuide', JSON.stringify(false));
    //   }
    // }
  }

  activated () {
    showRightMenu();
    this.getHomeDatas(this.isInit);
    this.isInit = false;
  }

  manageCardSetting () {
    this.$router.push({ name: 'customsetting', params: { fromHome: 'true' } });
  }

  beforeRouteEnter (to, from, next) {
    getAppList().then((res: any) => {
      if (res.Successful && res.ReturnData.Apps.length === 0) {
        next('/guide');
      } else {
        next();
      }
    });
    next();
  }

  beforeRouteLeave (to, from, next) {
    this.$store.state.excludeComp = [];
    hideRightMenu();
    next();
  }

  hideHeaderTitle () {
    this.title = '';
  }

  goBack () {
    closeApp();
  }

  link () {
    openLink('https://www.sobot.com/chat/pc/index.html?sysNum=ba53512829e343058872e7c2ab942a7e&channelFlag=2&groupId=b106bb580a2c49bea27715159d6a71c3');
  }

  /**
   * 关闭版本更新提示
   */
  closeUpdateModal () {
    this.backStack.pop();
    this.guideModalShow = false;
  }

  /**
   * 前往创建3.0轻应用
   */
  goToCreateApp () {
    this.backStack.pop();
    const str = this.guideModalShow.toString();
    this.guideModalShow = false;
    this.$router.push({
      name: 'apps',
      params: {
        showGuide: str,
      },
    });
  }
}
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
#home-page {
  background-color: #F5F7F9;
  .home-button-box {
    .px2rem(margin-top, 30);
    .px2rem(margin-bottom, 60);
    display: flex;
    .flex-box {
      flex: 1;
      text-align: center;
      a.aButton {
        background-color: #fff;
        display: inline-block;
        .px2rem(width, 194);
        .px2rem(height, 64);
        .px2rem(line-height, 64);
        .px2rem(border-radius, 40);
        .px2rem(font-size, 24);
        text-align: center;
        color: #107fff;
        box-shadow: 0 6px 28px rgba(80, 119, 188, 0.11);
      }
    }
  }
}
</style>
