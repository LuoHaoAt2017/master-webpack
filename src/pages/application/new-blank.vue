<template>
  <layout title="新建空白应用">
    <div class="new-blank">
      <section class="head">
      </section>
      <section class="body">
        <div class="part-one">
          <div class="container">
            <img :src="icons[0].src" :alt="icons[0].alt">
            <div>
              <h3>表单</h3>
              <p>拖拉拽控件搭建表单，实现数据的在线采集和管理</p>
            </div>
          </div>
          <div class="container">
            <img :src="icons[1].src" :alt="icons[1].alt">
            <div>
              <h3>流程</h3>
              <p>让表单和数据按照业务流程和规则在不同成员之间流转</p>
            </div>
          </div>
          <div class="container">
            <img :src="icons[2].src" :alt="icons[2].alt">
            <div>
              <h3>报表</h3>
              <p>多维度全方面数据透视，数据驱动业务和决策</p>
            </div>
          </div>
        </div>
        <div class="part-two">
          <h3>如何访问电脑端氚云？</h3>
          <div class="step-1">
            <span>1. 通过电脑端钉钉工作台访问氚云</span>
            <button @click="sendMesssageToPC">发送链接</button>
            <div>
              <img :src="icons[3].src" :alt="icons[3].alt">
            </div>
          </div>
          <div class="step-2">
            <span>
              2. 通过浏览器访问氚云，网页链接：
              <a href="http://www.h3yun.com">www.h3yun.com</a>
            </span>
            <div>
              <img :src="icons[4].src" :alt="icons[4].alt">
            </div>
          </div>
        </div>
      </section>
    </div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { setTitle, closeApp, openLink } from '@/config/dingtalk-interface';
import { sendQickEntryLink } from "@/service/app.service";
import Storage from '@/utils/storage';

@Component({
  name: 'NewBlank',
})
export default class NewBlank extends Vue {
  icons: Array<any> = [
    {
      src: require('@/assets/img/new-app/step-1.png'),
      alt: 'step-1'
    },
    {
      src: require('@/assets/img/new-app/step-2.png'),
      alt: 'step-2'
    },
    {
      src: require('@/assets/img/new-app/step-3.png'),
      alt: 'step-3'
    },
    {
      src: require('@/assets/img/new-app/step-4.png'),
      alt: 'step-4'
    },
    {
      src: require('@/assets/img/new-app/step-5.png'),
      alt: 'step-5'
    }
  ];
  sendMesssageToPC() {
    const self = this;
    const engineCode = window.GlobalConfig.engineCode;
    const hasSend = Storage.getExpire(`send-message-to-pc-${engineCode}`);
    if (hasSend) {
      // 如果已经发送了链接给电脑端，那么直接打开新建空白应用页面。
      self.$h3.toast.show({
        text: '链接已发送，前往电脑端钉钉工作通知，打开消息链接。',
        iconType: 'check-circle-o',
        duration: 1500,
        mask: true
      });
    } else {
      // 发送消息没有超过上限，发送链接给电脑端。
      sendQickEntryLink().then((res) => {
        self.$h3.toast.show({
          text: '链接发送成功',
          iconType: 'check-circle-o',
          duration: 1500,
          mask: true
        });
        const engineCode = window.GlobalConfig.engineCode;
        Storage.setExpire(`send-message-to-pc-${engineCode}`, true);
      }).catch((err) => {
        self.$h3.toast.show({
          text: '链接发送失败',
          iconType: 'close',
          duration: 1500,
          mask: true
        });
      });
    }
  };
}
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #107fff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.new-blank {
  position: absolute;
  .px2rem(top, 0);
  .px2rem(bottom, 0);
  .px2rem(left, 0);
  .px2rem(right, 0);
  background: rgba(245,247,249,1);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  .head {
    background-image: url('../../assets/img/new-app/step-0.png');
    background-repeat: no-repeat;
    background-size: 100%;
    .px2rem(height, 466);
    width: 100%;
  }

  .body {
    margin: auto;
    box-shadow:0px 11px 55px 0px rgba(80,119,188,0.11);
    z-index: 100;

    position: absolute;
    .px2rem(left, 30);
    .px2rem(right, 30);
    .px2rem(top, 365);
    .px2rem(bottom, 24);
  }

  .part-one {
    .px2rem(padding-top, 66);
    .px2rem(padding-bottom, 66);
    .px2rem(padding-left, 43);
    .px2rem(padding-right, 43);
    .px2rem(border-radius, 24);
    background:rgba(255,255,255,1);
    .container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .px2rem(margin-bottom, 62);
      div {
        .px2rem(margin-left, 50);
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        h3 {
          .px2rem(font-size, 36);
          .px2rem(line-height, 50);
          font-family:PingFangSC-Medium,PingFang SC;
          font-weight:500;
          color:rgba(51,51,51,1);
        }

        p {
          .px2rem(font-size, 32);
          .px2rem(line-height, 45);
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(102,102,102,1);
        }
      }
      img {
        .px2rem(width, 164);
        .px2rem(height, 164);
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .part-two {
    .px2rem(margin-top, 24);
    .px2rem(margin-bottom, 34);
    .px2rem(padding-left, 46);
    .px2rem(padding-top, 38);
    .px2rem(padding-bottom, 41);
    .px2rem(border-radius, 24);
    background:rgba(255,255,255,1);
    h3 {
      .px2rem(font-size, 36);
      .px2rem(line-height, 50);
      .px2rem(margin-bottom, 24);
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
    }

    .step-1 {
      display: flex;
      flex-direction: column;
      span {
        display: block;
        .px2rem(font-size, 32);
        .px2rem(line-height, 46);
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
      }
      button {
        display: block;
        .px2rem(width, 192);
        .px2rem(height, 64);
        .px2rem(line-height, 64);
        .px2rem(border-radius, 8);
        .px2rem(margin-top, 8);
        .px2rem(font-size, 32);
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        outline: none;
        border: none;
        background:rgba(16, 127, 255, 1);
      }
      div {
        width: 100%;
        .px2rem(height, 260);
        .px2rem(margin-top, 24);
        img {
          display: block;
          .px2rem(margin-left, 110);
          .px2rem(width, 374);
          .px2rem(height, 260);
        }
      }
    }

    .step-2 {
      display: flex;
      flex-direction: column;
      .px2rem(margin-top, 46);
      span {
        display: block;
        .px2rem(font-size, 32);
        .px2rem(line-height, 46);
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        a {
          text-decoration: none;
          .px2rem(font-size, 32);
          .px2rem(line-height, 46);
          .px2rem(padding-left, 35);
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(51,51,51,1);
        }
      }
      div {
        width: 100%;
        .px2rem(height, 260);
        .px2rem(margin-top, 24);
        img {
          display: block;
          .px2rem(margin-left, 110);
          .px2rem(width, 374);
          .px2rem(height, 260);
          .px2rem(border-radius, 20);
        }
      }
    }
  }
}
.animate-step1 {
  animation-name: scale;
  animation-iteration-count: 1;
  animation-delay: 0s;
  animation-fill-mode: forwards;
  animation-duration: 1s;
}
.animate-step2 {
  animation-name: scale;
  animation-iteration-count: 1;
  animation-delay: 0.8s;
  animation-fill-mode: forwards;
  animation-duration: 1s;
}
.animate-step3 {
  animation-name: scale;
  animation-iteration-count: 1;
  animation-delay: 1.6s;
  animation-fill-mode: forwards;
  animation-duration: 1s;
}
@keyframes scale {
  from {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
    transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }

  60% {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
    opacity: 1;
  }

  80% {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
    transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
  }

  to {
    -webkit-transform: perspective(400px);
    transform: perspective(400px);
    opacity: 1;
  }
}
</style>


<style lang="less">
.h3-toast-text-icon {
  width: 150px!important;
  .h3-toast-text-info {
    -webkit-line-clamp: 3;
  }
}
</style>