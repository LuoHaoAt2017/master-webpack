<template>
    <div >
        <div>
            <keep-alive >
                <router-view ></router-view>
            </keep-alive>
        </div>

         <tabbar class="tabbar">
            <tabbar-item :selected="selectedIndex==0" :link="homeLink">
                <i slot="icon" class="icon-home-o" />
                <i slot="icon-active" class="icon-home"></i>
                <span slot="label">首页</span>
            </tabbar-item>
            <tabbar-item :selected="selectedIndex==1" :link="myWorkLink">
                <i slot="icon" class="icon-daiban_1" />
                <i slot="icon-active" class="icon-daiban"></i>
                <span slot="label" class="work-undo">待办<span v-if="totalWorkflows" >{{totalWorkflows}}</span></span>
            </tabbar-item>
            <tabbar-item  :selected="selectedIndex==2" :link="appsLink">
                <i slot="icon" class="icon-yingyong_1" />
                <i slot="icon-active" class="icon-yingyong"></i>
                <span slot="label">应用</span>
            </tabbar-item>
            <tabbar-item :show-dot="dotStatus" :selected="selectedIndex==3" :link="personalLink">

                <i slot="icon" class="icon-wode_1" />
                <i slot="icon-active" class="icon-wode"></i>
                <span slot="label">我的</span>
            </tabbar-item>
         </tabbar>
    </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux';
import { GetHomeWorkflows } from '../../service/get-data';
import { TipsMessage, isDingtalk, SolutionTypes, SolutionState, removeCookie,
  getCookie } from '../../config/common';
import { openLink, setLeft } from '../../config/dingtalk-interface';

export default {
  name: 'root',
  components: {
    Tabbar,
    TabbarItem,
  },
  data() {
    return {
      homeLink: {
        path: '/home',
        replace: true,
      },
      myWorkLink: {
        path: '/myWork',
        replace: true,
      },
      appsLink: {
        path: '/apps',
        replace: true,
      },
      personalLink: {
        path: '/personal',
        replace: true,
      },
      hasDot: false,
      // selectedIndex: 0
    };
  },
  created() {
    const that = this;
    this.GetTodoNum();
    this.setDotStatus();
    this.$root.eventHub.$on('form-updated', () => {
      that.GetTodoNum();
    });
    this.$root.eventHub.$on('commission-updated', () => {
      that.GetTodoNum();
    });
    document.addEventListener('resume', this.resume, false);
      // window.backFn = function () {
      //   that.goBack();
      // };
      // setLeft(window.backFn);
  },
  methods: {
    async GetTodoNum() {
      const res = await GetHomeWorkflows(this.$store.state.appCode, this.$store.state.solutionCode, true);
      if (res.Successful) {
        this.$store.state.homeData.TotalWorkflows =
          res.ReturnData.ApproveCount + res.ReturnData.CirculateCount + res.ReturnData.FillCount;
      }
    },
    resume() {
      const solutionState = window.GlobalConfig.solutionStates;
      const solutionType = window.GlobalConfig.solutionType;
      const licenseSolutionName = window.GlobalConfig.LicenseSolutionName;
      let tipsMessage = '';
      if (solutionType === SolutionTypes.Sass || solutionType === SolutionTypes.Template) {
        tipsMessage = TipsMessage.ExpireMessage.replace('氚云', licenseSolutionName);
      }
      if (solutionType === SolutionTypes.Sass && (licenseSolutionName === '决招进销存' || licenseSolutionName === '决招CRM' || licenseSolutionName === '决招HRM')) {
        tipsMessage = TipsMessage.ExpireMessage.replace('氚云', licenseSolutionName).replace('4000-899-893', '400-1399-566');
      }
      if (solutionState.indexOf(SolutionState.Expire) > -1 && window.GlobalConfig.backAction) {
        window.GlobalConfig.expired = true;
        if (!window.GlobalConfig.isAdministrator) {
          this.$h3.modal.show({
            title: TipsMessage.ExpireTitle,
            maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
            content: `<div style='text-align:left;font-size:15px;padding: 8px 6px 31px 6px;'>尊敬的用户，您的${solutionType === SolutionTypes.APass ? '氚云' : licenseSolutionName}服务<span style='color:#F5222D;font-size:15px'>已到期</span>，请联系贵公司管理员续费</div>`,
            type: 'alert',
          });
          return false;
        }
        window.GlobalConfig.backAction = false;
        if (window.GlobalConfig.GoodsCode) {
          const corpId = window.GlobalConfig.corpId || '$CORPID$';
          this.$h3.modal.show({
            title: TipsMessage.ExpireTitle,
            maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
            content: tipsMessage,
            type: 'alert',
            actions: [
              {
                text: '立即续费',
                onPress: () => {
                  const payUrl =
                      'https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&' +
                      `goodsCode=${window.GlobalConfig.GoodsCode}&corpId=${corpId}`;
                  if (isDingtalk) {
                    openLink(payUrl);
                    window.GlobalConfig.backAction = true;
                  } else {
                    window.location.href = payUrl;
                    window.GlobalConfig.backAction = true;
                  }
                },
              },
            ],
          });
        } else {
          this.$h3.modal.show({
            title: TipsMessage.ExpireTitle,
            maskStyle: { 'padding-bottom': '40%', 'box-sizing': 'border-box' },
            content: tipsMessage,
            type: 'alert',
            actions: [
              {
                text: '立即咨询',
                onPress: () => {
                  if (isDingtalk) {
                    openLink(TipsMessage.payUrl);
                    window.GlobalConfig.backAction = true;
                  } else {
                    window.location.href = TipsMessage.payUrl;
                    window.GlobalConfig.backAction = true;
                  }
                },
              },
            ],
          });
        }
        return false;
      }
      //this.goApp();
      return false;
    },
    goApp(){
      var redirectApp = getCookie('go-to-app');
      if(redirectApp){//判断是否需要跳转到相应应用
      document.cookie = "go-to-app = ;domain = 'h3yun.com';expires = -1";
      //removeCookie('go-to-app');//移除的时候判断顶级域名，并且删除123;
       this.$router.push({
         name:'apps',
         params:{
           app:redirectApp
         }
       })
       this.$store.state.initialSelectedIndex = 2;
      }
    },
    goBack() {
      const solutionState = window.GlobalConfig.solutionStates;
      const solutionType = window.GlobalConfig.solutionType;
      const hasSend = window.localStorage.getItem('hasSend');
      if (solutionState.indexOf(SolutionState.Expire) > -1 && solutionType !== SolutionTypes.APass) {
        this.$h3.modal.hide();
      }
      if (solutionState.indexOf(SolutionState.WillExpire) > -1 && !hasSend) {
        this.$h3.modal.hide();
      } else if (window.GlobalConfig.isAdministrator && !hasSend && (solutionState.indexOf(SolutionState.FileSizeWillExceed) > -1 || solutionState.indexOf(SolutionState.FileSizeExceed) > -1)) {
        this.$h3.modal.hide();
      }
    },
    setDotStatus() {
      const date = new Date();
      const dateY = date.getFullYear();
      const dateM = date.getMonth() + 1;
      const dateD = date.getDate();
      const hasDot = window.localStorage.getItem(`hasDot${dateY}-${dateM}-${dateD}`);
      if (!hasDot && window.GlobalConfig.isAPaaS) {
        this.$store.commit('updateDotStatus', { status: true });
      } else {
        this.$store.commit('updateDotStatus', { status: false });
      }
    },
  },
  computed: {
    excludeComp() {
      return this.$store.state.excludeComp;
    },
    selectedIndex() {
      return this.$store.state.initialSelectedIndex;
    },
    totalWorkflows() {
      const totalCount = this.$store.state.homeData.TotalWorkflows;
      return totalCount > 99 ? '99+' : totalCount;
    },
    dotStatus() {
      return window.Environment && window.Environment.EnableActivity && this.$store.state.showDot;
    },
  },
  beforeDestroy() {
    document.removeEventListener('resume', this.resume);
  },
};
</script>

<style lang="less">
@import '../../assets/css/home.less';
</style>
