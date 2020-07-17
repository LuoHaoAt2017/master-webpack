<template>
  <h3-modal
    v-model="visible"
    class="version-update-modal"
  >
    <div class="version-update-box">
      <img class="icon-img" src="../../assets/img/intro/icon.svg" alt="" />
      <img class="top-img" src="../../assets/img/intro/version-update.svg" alt="" />
      <img class="cloud-img" src="../../assets/img/intro/cloud.svg" alt="" />
      <div class="title">版本更新啦</div>
      <div class="version-update-content">
        <ul class="update-list">
          <li>1. 移动端支持新建轻应用；</li>
          <li>2. 移动端上线表单设计器功能；<li>
          <li>3. 移动端轻应用支持设置流程；</li>
          <li>4. 移动端轻应用支持看板视图；</li>
          <li>5. 更多精彩功能，等你来探索...</li>
        </ul>
        <div class="btn-box">
          <h3-button size="large" class="left-btn" @click="cancel">我知道了</h3-button>
          <h3-button size="large" class="right-btn" @click="confirm">开始体验</h3-button>
        </div>
      </div>
    </div>
  </h3-modal>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { H3Modal, H3Button } from '@h3/thinking-ui';
@Component({
  name: 'VersionUpdate',
  components: {
    H3Modal,
    H3Button
  }
})

export default class VersionUpdate extends Vue {
  @Prop()
  modalShow!: boolean;

  visible: boolean = false;

  @Watch('modalShow')
  onModalShow() {
    this.visible = this.modalShow;
  }

  cancel () {
    this.$emit('close');
  }

  confirm () {
    this.$emit('confirm');
  }
}
</script>

<style lang="less">
  .version-update-modal {
    .h3think-modal__content {
      width: 6.4rem!important;
      background: none!important;
    }
    .h3think-modal__body {
      padding: 0!important;
    }
    .h3think-modal__content {
      padding: 0!important;
    }
    .h3think-modal__footer {
      display: none;
    }
  }
</style>
<style lang='less' scoped>
@import '../../styles/light-app.less';
.version-update {
  &-box {
    position: relative;
    text-align: center;
    height: 9.17rem;
    overflow: hidden;
    .icon-img {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      .px2rem(width,324);
      .px2rem(height, 225);
      z-index: 4 ;
      animation: move 3s linear infinite;
    }
    .top-img {
      position: relative;
      .px2rem(width,234);
      .px2rem(height, 260);
      z-index: 3;
    }
    .cloud-img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      .px2rem(top,152);
      .px2rem(width,478);
      .px2rem(height, 146);
      z-index: 3;
    }
    .title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      color: @lightAppPrimaryColor;
      .px2rem(font-size, 36);
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      z-index: 4;
    }
  }
  &-content {
    width: 100%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 1.7rem;
    .px2rem(padding-top, 235);
    background: #fff;
    border-radius: 0.32rem;
    z-index: 1;
    .update-list {
      text-align: left;
      padding: 0 0.53rem;
      margin-bottom: 0.6rem;
      li {
        color: #666;
        .px2rem(font-size, 26);
        .px2rem(line-height, 42);
      }
    }
    /deep/ .h3think-button {
      margin:auto;
      .px2rem(margin-bottom, 60);
      .px2rem(width,270);
      .px2rem(line-height, 72);
      .px2rem(height, 72);
    }
    .btn-box {
      display: flex;
      border-top: 1px solid #ddd;
      .left-btn,
      .right-btn {
        border: 0;
        margin-bottom: 0;
        border-radius: 0;
        height: 1.2rem;
        line-height: 1.2rem;
      }
      .left-btn {
        color: #666;
        border-right: 1px solid #ddd;
      }
      .right-btn {
        color: #107fff;
      }
    }
  }
}
@keyframes move {
  0% {
    top: 0;
  }
  50% {
    top: 8px;
  }
  100% {
    top: 0px;
  }
}
</style>
