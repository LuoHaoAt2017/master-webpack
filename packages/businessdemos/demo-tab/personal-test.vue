<template>
    <div class="personal">
        <!-- <div class="background-scroll"></div> -->
        <div class="wrapper" ref="wrapper">
          <div class="scrollSmooth">
            <div class="user" >
              <div class="profile">
                  <img src="../../assets/img/touxiang.jpeg" @click="showUserInfo()"></img>
              </div>
              <div class="name">姓名</div>
              <div class="department">研发中心</div>
            </div>
            <div class="group">
              <div class="bd-bot group-container">
                <div class="cell bd-bot" v-for="item in customLinksTest" @click="openCustomLink(item)">
                  <div v-if="item.IsSystem">
                      <i :class="item.IconClass" class="personal-test-fonts"></i>
                  </div>
                  <div v-else>
                      <img width="20px" height="20px" :src="item.IconLink"/>
                  </div>
                  <div class="right" >
                      <div>
                        <span class="cell-name">{{item.DisplayName}}</span>
                      </div>
                  </div>
                  <div class="personal-test-nextpage-wrapper">
                    <i class="icon aufont icon-base-right icon-nextpage"></i>
                  </div>
                </div>
                <h3-tool-tip content='点击获得更多帮助内容' @hideTip='hideTip' :showTip='showTip' direction="left-top" class='personal-tool-tip'></h3-tool-tip>
              </div>
            </div>
          </div>
        </div>
    </div>
    

</template>
<script>
import headerImg from '../../../src/assets/img/touxiang.jpeg';

export default {
  data() {
    return {
      title: '个人中心',
      headerImg: headerImg,
      isLink: true,
      scroll: null,
      url: {
        onlineService:
          'http://www.sobot.com/chat/h5/index.html?sysNum=ba53512829e343058872e7c2ab942a7e&color=0f92ed&lan=cn&invite=0&visitStartTime=1508925375184&unreadcount=0',
        help: 'http://help.h3yun.com/channels/773.html',
        appMarket: `${window.location.protocol}//${window.location.host}/store/m/index.html`,
      },
      customLinks: [],
      customLinksTest: [
        {
          IsSystem: true,
          IconClass: 'font aufont icon-base-customerservice',
          DisplayName: '在线客服',
        },
        {
          IsSystem: true,
          IconClass: 'font aufont icon-base-exclamation-circle',
          DisplayName: '帮助中心',
        },
        {
          IsSystem: true,
          IconClass: 'font aufont icon-base-find',
          DisplayName: '其他',
        },
      ],
      showTip: false,
    };
  },
  created() {
    const solutioncode = this.$store.state.solutionCode;
    const suiteKey = this.$store.state.suiteKey;
    this.getPersonalCenterInfo(solutioncode, suiteKey);
  },
  methods: {
    openCustomLink(item) {
      if (isDingtalk && item.Link && item.Link.trim().length > 0) {
        if (item.DisplayName === '帮助中心' && this.showTip) {
          this.hideTip();
        }
        openLink(item.Link);
      }
    },
    goBack() {
      closeApp();
    },
    showUserInfo() {
      if (isDingtalk) {
        const corpId = this.$store.state.corpId;
        const dingtalkAccount = this.$store.state.UserInfo.dingtalkAccount;
        const userId = dingtalkAccount.substring(0, dingtalkAccount.indexOf('.'));
        // H3DeveloperPlugin.IShowUserInfo(userId, corpId);
      }
    },
    hideTip() {
      this.showTip = false;
      const tipKey = `personalTip-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionName}`;
      localStorage.setItem(tipKey, true);
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
    .px2rem(height,500);
    box-sizing: border-box;
    overflow: hidden;
    background: #1890ff;
    div {
      text-align: center;
      color: #fff;
      &.name {
        // font-size: 16px;
        .px2rem(font-size, 32);
        .px2rem(line-height, 45);
        .px2rem(height, 45) !important;
        .px2rem(margin-top,23);
      }
      &.department {
        .px2rem(font-size, 26);
        .px2rem(line-height, 37);
        .px2rem(margin-top, 9);
      }
      &.profile {
        .px2rem(width,148);
        .px2rem(height,148);
        .px2rem(margin-top, 160);
        .px2rem(margin-left, 301);
        img {
          .px2rem(width,148);
          .px2rem(height,148);
          border-radius: 50%;
          border: 1px solid #fff;
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
    .px2rem(padding-left,30);
    box-sizing: border-box;
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
    position: relative;
    .px2rem(padding-top,30);
    .px2rem(padding-bottom,30);
    .px2rem(font-size,30);
    .px2rem(line-height,51);
    span.icon {
      .px2rem(font-size,37);
    }
    span{
      .px2rem(font-size,30);
      .px2rem(line-height,51);
    }
    .personal-test-fonts{
      .px2rem(font-size,37);
      color: #999;
    }

    span.cell-name{
      overflow:hidden;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-line-clamp:1;
      -webkit-box-orient:vertical;
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
    }
    .personal-test-nextpage-wrapper{
      position: absolute;
      .px2rem(width, 104);
      .px2rem(height, 112);
      right: 0;
      top: 0;
      .icon-nextpage{
        position: absolute;
        .px2rem(right, 30);
        .px2rem(top, 40);
        .px2rem(font-size, 30);
        color: #c7c7c7;
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