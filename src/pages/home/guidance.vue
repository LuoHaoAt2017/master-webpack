<template>
  <div class="guidance">
    <h3-swiper dots-position='center' v-model='number' @on-index-change='indexChange'>
      <h3-swiper-item v-for='(item, index) in swiperList' :key='index'>
        <welcome-to-h3 :target="item">
          <div v-if="index === 0" class="words">
            <p>零代码自主搭建应用</p>
            <p>100+免费模板开箱即用</p>
          </div>
          <div v-else-if="index === 1" class="words">
            <p>拖拉拽控件搭建表单</p>
            <p>实现数据的在线采集和管理</p>
          </div>
          <div v-else-if="index === 2" class="words">
            <p>让表单和数据按照业务流程和</p>
            <p>规则在不同成员之间流转</p>
          </div>
          <div v-else class="words">
            <p>多维度全方面数据透视</p>
            <p>数据驱动业务和决策</p>
          </div>
        </welcome-to-h3>
      </h3-swiper-item>
    </h3-swiper>
    <div v-if="isShowButton">
      <div v-if="startToInstall" class="start-h3 dp-font34 " @click="getInstallStatus">
        <span class="start-btn">开始探索氚云</span>
      </div>
      <div v-else class="start-h3">
        <div class="under-install">
          <span class="dp-font34">安装中, 稍等片刻...</span>
          <img src='../../assets/img/titlebar.svg' class="loading">
        </div>
      </div>
    </div>
    <h3-dialog v-model="callHelperShow" class="guidance-call-operation" hide-on-blur>
        <div class='part-one'>
          <a class='call' href="tel:15827542596">智能办公电话</a>
          <span class='helper'></span>
          <span class='copy' data-clipboard-text='15827542596'>复制</span>
        </div>
        <div class='part-two'>
          <span class='cancel' @click="handleCancel">取消</span>
        </div>
    </h3-dialog>
  </div>
</template>
<script>
import WelcomeToH3 from './welcome-to-h3';
import { isDingtalk } from '@/config/common';
import { H3Swiper, H3Dialog } from 'h3-mobile-vue';
import { isInstalledOK } from '@/service/get-data';
import { AppActionType } from '@/store/modules/app/types';
import { finishGuidance, checkShowGuidance, getAppList } from "@/service/app.service";
import { setLeft, closeApp, callCommonTelephone } from '@/config/dingtalk-interface';
import { mapActions } from "vuex";
import Clipboard from 'clipboard';
export default {
  name: 'guidance',
  components: {
    H3Swiper,
    H3Dialog,
    H3SwiperItem: H3Swiper.Item,
    WelcomeToH3
  },
  data() {
    return {
      /* eslint-disable global-require */
      number: 0,
      currentLength: 0,
      startToInstall: true,
      isShowButton: false,
      callHelperShow: false,
      swiperList: [
        {
          title: {
            type: 'img',
            value: require('@/assets/img/guidance/step-1/编组.png')
          },
          words: '零代码自主搭建应用 100+免费模板开箱即用',
          graph: {
            src: require('@/assets/img/guidance/step-1/pic1.png'),
            alt: '氚云'
          }
        },
        {
          title: {
            type: 'text',
            value: '表单'
          },
          words: '托拉拽控件搭建表单实现数据的在线采集和管理',
          graph: {
            src: require('@/assets/img/guidance/step-2/pic2.png'),
            alt: '表单'
          }
        },
        {
          title: {
            type: 'text',
            value: '流程'
          },
          words: '让表单和数据按照业务流程和规则在不同成员之间流转',
          graph: {
            src: require('@/assets/img/guidance/step-3/pic3.png'),
            alt: '流程'
          }
        },
        {
          title: {
            type: 'text',
            value: '报表'
          },
          words: '多维度全方面数据透视数据驱动业务和决策',
          graph: {
            src: require('@/assets/img/guidance/step-4/pic4.png'),
            alt: '报表'
          }
        }
      ]
    };
  },
  activated() {
    setLeft(() => {
      this.goBack();
    });
  },
  methods: {
    indexChange(index) {
      if (index === (this.swiperList.length - 1)) {
        this.isShowButton = true;
      } else {
        this.isShowButton = false;
      }
    },
    getInstallStatus() {
      if (window.GlobalConfig.isInstalled) {
        this.afterGuide();
      } else {
        this.loopInstallStatus(0);
      }
    },
    loopInstallStatus(delay = 3000) {
      setTimeout(async() => {
        const code = window.GlobalConfig.solutionCode;
        const res = await isInstalledOK(code);
        if (res.Successful) {
          if (res.ReturnData.InstallComplete) {
            this.afterGuide();
          } else {
            this.loopInstallStatus();
          }
        } else {
          this.failToInstall();
        }
      }, delay);
    },
    failToInstall() {
      const self = this;
      this.startToInstall = true;
      this.$h3.modal.show({
        title: `
          <span class='add-app-failure-container'>
            <i class="add-app-failure-icon"></i>
          </span>
          <span class='add-app-close-container' id='guidance-xyz-close'>
            <i class="add-app-close-icon"></i>
          </span>
        `,
        type: 'alert',
        content: `
          <div class="add-app-failure-modal">
            <p>安装失败</p>
            <span>链接引擎服务器失败，引擎可能被禁用，请联系服务商。</span>
          </div>
        `,
        actions: [
          {
            text: '联系服务商',
            style: 'color:rgba(16,127,255,1);',
            onPress() {
              // 智能办公电话
              self.callHelperShow = true;
              const clipboard = new Clipboard('.copy');
              clipboard.on('success', function() {
                self.$h3.toast.show({
                  text: '复制成功',
                  iconType: 'check-circle-o',
                  duration: 2000,
                  mask: false
                });
              });
              clipboard.on('error', function() {
                self.$h3.toast.show({
                  text: '复制失败',
                  iconType: 'close',
                  duration: 2000,
                  mask: false
                });
              });
              const callElem = document.querySelector('.call');
              callElem.addEventListener('click', function() {
                
              });
            },
          },
          {
            text: '稍后重试',
            style: 'color:rgba(153,153,153,1);',
            onPress() {
              self.$h3.modal.hide();
            },
          },
          {
            text: '',
            style: 'display:none;',
            onPress() {
            },
          },
        ],
        onShow: self.onShow,
        mask: true
      });
    },
    async afterGuide() {
      // 在完成路由跳转之前首先通知后段引导已经完成了。
      // 如果没有完成请求就跳转啦，那么抵达guide页面，此时ShowGuide还是true就会再次跳到guidance。
      await finishGuidance();
      const action = `App/${AppActionType.GetAppList}`;
      const res = await this.$store.dispatch(action);
      // 前置条件：能够进入到引导页面首先必需是管理员而且isShowGuide字段是true
      if (res.Apps.length > 0) {
        this.$router.push('/home');
      } else {
        this.$router.push('/guide');
      }
    },
    goBack() {
      closeApp();
    },
    onShow() {
      setTimeout(() => {
        const elem = document.getElementById('guidance-xyz-close')
        elem && elem.addEventListener('click', () => {
          this.$h3.modal.hide();
        });
      }, 500);
    },
    px2rem(value) {
      return value / 75 + 'rem'
    },
    handleCall() {
      this.callHelperShow = false;
      console.log('check Dingtalk');
      if (isDingtalk) {
        console.log('is in Dingtalk');
        window.dd.ready(() => {
          console.log('dd is ready call');
          dd.biz.telephone.showCallMenu({
            phoneNumber: '4000899893', // 期望拨打的电话号码
            code: '+86', // 国家代号，中国是+86
            showDingCall: true, // 是否显示钉钉电话
            onSuccess : function(res) {
              console.error('success call');
            },
            onFail : function(err) {
              console.error('faulure call: ', err);
            }
          });
        });
      }
    },
    handleCopy() {
      this.callHelperShow = false;
      const context = this;
      const success = window.clipboardData.setData("Text", '15827542596');
      if (success) {
        context.$h3.toast.show({
          text: '复制成功',
          iconType: 'check-circle-o',
          duration: 2000,
          mask: false
        });
      } else {
        context.$h3.toast.show({
          text: '复制失败',
          iconType: 'close',
          duration: 2000,
          mask: false
        });
      }
    },
    handleCancel() {
      this.callHelperShow = false;
    }
  }
};
</script>
<style lang='less'>
@import "../../styles/common.less";
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.guidance{
  height: 100%;
  .h3-slider {
    height: 100%;
    .h3-swiper {
      height: 100%!important;
    }
    .h3-indicator {
      .px2rem(bottom, 200)!important;
    }
  }
  .vux-slider{
    height: 100%;
  }
  img{
    width: 100%;
    height: 100%;
  }
  .skip-out{
    position: absolute;
    .px2rem(top,30);
    .px2rem(right,30);
    border: 1px solid grey;
    .px2rem(width,112);
    .px2rem(height,48);
    .px2rem(border-radius,100);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
    color: #fff;
  }
  .start-h3 {
    position: absolute;
    .px2rem(bottom,200);
    .px2rem(width,690);
    .px2rem(height,88);
    .px2rem(left,30);
    .px2rem(border-radius,44);
    background:rgba(16,127,255,1);
    display: flex;
    justify-content: center;
    align-items: center;
    .under-install {
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        .px2rem(line-height, 42);
        .px2rem(font-size, 30);
        .px2rem(height, 42);
        .px2rem(margin-right, 15);
      }
    }
    .start-btn {
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
      .px2rem(line-height, 42);
      .px2rem(font-size, 30);
      .px2rem(height, 42);
    }
    .loading {
      .px2rem(width,41.6);
      .px2rem(height,41.6);
      .px2rem(margin-right,20);
      vertical-align: bottom;
      opacity: 1;
      color: #ffffff;
      animation: spinner-anime 1s linear infinite;
    }
    @keyframes spinner-anime {
      100% {
        transform: rotate(360deg);
      }
    }
  }
  .vux-slider > .vux-indicator > a:last-child{
    .px2rem(margin-right,12)!important;
  }
  .words {
      .px2rem(margin-top, 24);
      .px2rem(margin-bottom, 90);
      text-align: center;
      p {
        .px2rem(max-width, 480);
        .px2rem(font-size, 36);
        .px2rem(line-height, 50);
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
      }
  }
}
.add-app-failure-modal {
  position: relative;
  .px2rem(padding-top, 30);
  p {
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    .px2rem(line-height, 52);
    .px2rem(font-size, 36);
    .px2rem(width, 480);
    .px2rem(margin-bottom, 12);
  }
  span {
    display: block;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    .px2rem(line-height, 44);
    .px2rem(font-size, 28);
    .px2rem(width, 480);
  }
}
.add-app-failure-container {
  position: absolute;
  .px2rem(top, -55);
  left: 50%;
  transform: translateX(-50%);

  .px2rem(width, 112);
  .px2rem(height, 112);
  .px2rem(border-radius, 56);
  background:rgba(255,67,132,1);

  display: flex;
  justify-content: center;
  align-items: center;
  .add-app-failure-icon {
    .px2rem(width, 56);
    .px2rem(height, 56);
    display: inline-block;
    background: url("../../assets/img/guidance/close/close.png");
    background-size: cover;
  }
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
.guidance-call-operation {
  .h3-dialog {
    position: fixed;
    .px2rem(bottom, -125);
    top: auto;
    width: 95%;
    background: rgba(0, 0, 0, 0);
    max-width: none!important;
    .part-one, .part-two {
      background: #ffffff;
      .px2rem(border-radius, 20);
      display: flex;
      flex-direction: column;
      box-shadow:0px 1px 0px 0px rgba(212,212,212,0.5);
      span, a {
        display: block;
        text-align: center;
        .px2rem(font-size, 36);
        .px2rem(height, 110);
        .px2rem(line-height, 110);
        .px2rem(border-radius, 20);
        font-family:PingFangSC-Medium,PingFang SC;
        color:rgba(72,73,81,1);
        position: relative;
      }
      a {
        text-decoration: none;
      }
    }
    .part-one {
      font-weight:400;
      .helper {
        display: block;
        height: 1px;
        width: 100%;
        background: #eee;
      }
    }
    .part-two {
      .px2rem(margin-top, 24);
      span {
        font-weight:500;
        color:rgba(72,73,81,1);
      }
    }
  }
}
</style>
