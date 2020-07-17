<template>
  <layout title="个人中心" :left-options="{ preventGoBack: true }" @on-click-back="goBack">
    <div class="personal">
        <div class="background-scroll"></div>
        <div class="wrapper" ref="wrapper" :class="{hasPaddingTop:!$store.state.corpId}">
          <div class="scrollSmooth">
            <div class="user" >
              <div class="profile">
                  <img :src="$store.state.UserInfo.profilePhotoUrl" @click="showUserInfo()" v-if="$store.state.UserInfo.profilePhotoUrl"></img>
                  <span class="dp-font24" v-else>{{$store.state.UserInfo.userName | showUserName}}</span>
              </div>
              <div class="name" v-if="$store.state.UserInfo.profilePhotoUrl">{{$store.state.UserInfo.userName}}</div>
              <div class="department">{{$store.state.UserInfo.departmentName}}</div>
            </div>
            <div class="group">
              <div class="bd-bot group-container">
                <div class="cell bd-bot" v-for="item in customLinks" @click="openCustomLink(item)">
                  <div v-if="item.IsSystem">
                      <span :class="item.IconClass"></span>
                  </div>
                  <div v-else>
                      <img width="20px" height="20px" :style="item.DisplayName === '分享有礼' ? {width:'18px',height:'18px'} : {}"  :src="item.IconLink"/>
                  </div>
                  <div class="right" >
                      <div>
                        <span :class="item.DisplayName === '分享有礼'? 'cell-explain' : ''" class="cell-name">{{item.DisplayName}}</span>
                      </div>
                      <div :class="item.DisplayName === '分享有礼'&& dotStatus? 'dot' : ''" >
                          <span class="icon-nextpage"></span>
                      </div>
                  </div>
                </div>
                <div class="cell bd-bot"  @click="goToSaasPurchase" v-if="showServicePackage">
                  <div>
                      <span class="aufont icon-base-Trophy"></span>
                  </div>
                  <div v-if="false">
                      <img width="20px" height="20px" :src="item.IconLink"/>
                  </div>
                  <div class="right" >
                      <div>
                        <span class="cell-name">服务购买</span>
                      </div>
                      <div>
                          <span class="icon-nextpage"></span>
                      </div>
                  </div>
                </div>
                <h3-tool-tip content='点击获得更多帮助内容' @hideTip='hideTip' :showTip='showTip' direction="left-top" class='personal-tool-tip'></h3-tool-tip>
              </div>
            </div>
          </div>
        </div>
    </div>
  </layout>
</template>
<script>
// eslint yjh
import BScroll from 'better-scroll';
import { closeApp, openLink } from '../../config/dingtalk-interface';
import { isDingtalk } from '../../config/common';
import H3DeveloperPlugin from '../../lib/h3-plugins-developer';
import { getPersonalCenterData } from '../../service/get-data';
import H3ToolTip from '../../../packages/widgets/h3-tool-tip/h3-tool-tip.vue';

export default {
  components: {
    H3ToolTip,
  },
  data() {
    return {
      isLink: true,
      scroll: null,
      url: {
        onlineService:
          'http://www.sobot.com/chat/h5/index.html?sysNum=ba53512829e343058872e7c2ab942a7e&color=0f92ed&lan=cn&invite=0&visitStartTime=1508925375184&unreadcount=0',
        help: 'http://help.h3yun.com/',
      },
      customLinks: [],
      showTip: false,
      showServicePackage: true,
      hasDot: false,
    };
  },
  created() {
    const solutioncode = this.$store.state.solutionCode;
    const suiteKey = this.$store.state.suiteKey;
    this.getPersonalCenterInfo(solutioncode, suiteKey);
  },
  mounted() {
    if (!this.scroll) {
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: 3,
        click: true,
        scrollY: true,
      });
    }
  },
  methods: {
    // 获取个人中心客服链接等信息
    async getPersonalCenterInfo(solutioncode, suiteKey) {
      const res = await getPersonalCenterData(solutioncode, suiteKey);
      if (res.Successful) {
        const data = res.ReturnData;
        if (data && data.SuiteCustomLinks.length > 0) {
          this.showServicePackage = data.ShowServicePackage;
          const shareIndex = data.SuiteCustomLinks.findIndex(val => val.DisplayName === '分享有礼');
          if (shareIndex !== -1) {
            const shareItem = data.SuiteCustomLinks.splice(shareIndex, 1);
            this.customLinks = shareItem.concat(data.SuiteCustomLinks);
          } else {
            this.customLinks = data.SuiteCustomLinks;
          }
          const tipKey = `personalTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
          this.showTip = this.customLinks[1] && this.customLinks[1].DisplayName === '帮助中心' && !(localStorage.getItem(tipKey));
          this.$nextTick(() => {
            if (this.scroll) {
              this.scroll.refresh();
            }
          });
        }
      }
    },
    openCustomLink(item) {

      if (isDingtalk && item.Link && item.Link.trim().length > 0) {
        let link = item.Link;
        // 年前临时上线解决方案
        link = item.DisplayName === '帮助中心' ? 'http://help.h3yun.com/' : link;
        if (item.DisplayName === '帮助中心' && this.showTip) {
          this.hideTip();
        }
        if (link.match(/^http/) === null) {
          link = `${window.location.protocol}//${window.location.host}${link}`;
        }
        if(sessionStorage&&item.DisplayName === '模板中心'){
          sessionStorage.setItem('refreshApps',1);
        }
        openLink(link);
      }
      if (isDingtalk && item.Link === '' && item.DisplayName === '分享有礼') {
        const link = `${window.location.origin}/Activity/Mobile/index.html?showmenu=false&enginecode=${window.GlobalConfig.engineCode}&userid=${window.GlobalConfig.userId}&dingid=${window.GlobalConfig.dingId}&accesstoken=${window.GlobalConfig.accessToken}`;
        const date = new Date();
        const dateY = date.getFullYear();
        const dateM = date.getMonth() + 1;
        const dateD = date.getDate();
        this.hasDot = false;
        window.localStorage.setItem(`hasDot${dateY}-${dateM}-${dateD}`, true);
        this.$store.commit('updateDotStatus', { status: false });
        openLink(link);
      }
    },
    goToSaasPurchase() {
      this.$router.push({ path: '/servicePackage' });
    },
    goBack() {
      closeApp();
    },
    showUserInfo() {
      if (isDingtalk) {
        const corpId = this.$store.state.corpId;
        const dingtalkAccount = this.$store.state.UserInfo.dingtalkAccount;
        const userId = dingtalkAccount.substring(0, dingtalkAccount.indexOf('.'));
        H3DeveloperPlugin.IShowUserInfo(userId, corpId);
      }
    },
    hideTip() {
      this.showTip = false;
      const tipKey = `personalTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
      localStorage.setItem(tipKey, true);
    },
  },
  computed: {
    dotStatus() {
      return this.$store.state.showDot;
    },
  },
  filters: {
    showUserName(val) {
      let length = 0;
      let name = '';
      if (val) {
        length = val.length;
        name = val.substring(length - 2, length);
      }
      return name;
    },
  },
};
</script>
<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.personal {
  background-color: #fff;
  .background-scroll{
    .px2rem(height,500);
    position: absolute;
    left: 0;
    right: 0;
    top: -1px;
    background-color: #108ee9;
  }
  .wrapper {
    position: absolute;
    top: 0;
    // bottom: 60px;
    .px2rem(bottom,98);
    width: 100%;
  }
  .hasPaddingTop {
    .px2rem(top,98);
  }
  .user {
    width: 100%;
    .px2rem(height,372);
    .px2rem(padding-top,51);
    // .px2rem(padding-bottom,78);
    background: #108ee9;
    div {
      text-align: center;
      color: #fff;
      &.name {
        font-size: 16px;
        .px2rem(margin-bottom,9);
      }
      &.department {
        font-size: 13px;
      }
      &.profile {
        // .px2rem(width,148);
        .px2rem(height,148);
        .px2rem(margin-bottom,23);
        img, span {
          .px2rem(width,148);
          .px2rem(height,148);
          border-radius: 50%;
          border: 1px solid #fff;
        }
        span {
          display: inline-block;
          text-align: center;
          .px2rem(line-height, 148);
          font-size: 24px;
        }
      }
    }
  }
  .bd-bot {
    width: 100%;
    border: 0 !important;
    background-image: -webkit-linear-gradient(0deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
    background-image: linear-gradient(0deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
  }
  .group-container {
    position: relative;
    background-color: #fff;
    .px2rem(padding-left,24);
    .px2rem(padding-right,24);
    .personal-tool-tip{
      position: absolute;
      .px2rem(top,200);
      .px2rem(left,80);
    }
  }
  .cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .px2rem(padding-top,29);
    .px2rem(padding-bottom,29);
    .px2rem(font-size,28);
    span.icon {
      .px2rem(font-size,36);
    }

    span.cell-name{
      overflow:hidden;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-line-clamp:1;
      -webkit-box-orient:vertical;
      &.cell-explain::after {
        content: '邀请好友，领取红包';
        .px2rem(margin-left,16);
        .px2rem(font-size,28);
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(153,153,153,1);
      }
    }

    .right {
      flex-basis: 90%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #333;
      div:first-child {
        flex-basis:80%;
        .px2rem(margin-left,22);
      }
      .dot{
        position: relative;
        &:before {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          .px2rem(left,-20);
          .px2rem(width,12);
          .px2rem(height,12);
          background:rgba(245,34,45,1);
          border-radius:50%;
        }
      }
    }
  }
  .scrollSmooth{
    -webkit-overflow-scrolling:touch;
    transform:translated3d(0,0,0);
    -ms-transform:translated3d(0,0,0);
    -moz-transform:translated3d(0,0,0);
    -webkit-transform:translated3d(0,0,0);
  }
}
</style>
