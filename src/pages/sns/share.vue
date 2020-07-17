<template>
  <!-- lbb修改代码规范 -->
  <div class="share-page">
    <layout
      :title="pageTitle"
    >
      <div class="content">
        <div class="content__qrcode">
          <div class="title">
            {{ displayName }}
          </div>
          <div id="qr-wrapper" v-if="qrCodeUrl" class="qr-wrapper">
            <img :src="qrCodeUrl" alt="二维码" />
          </div>
          <div v-if="action != 'QrCode'" class="description">
            分享功能是针对外部人员，可以将二维码分享给外部人员查看当前数据。
          </div>
          <div v-if="action == 'QrCode'" class="description">
            <span class="h3yun_All dingding"></span>
            钉钉扫一扫，查看数据
          </div>
        </div>
        <div v-if="action == 'QrCode'" class="btn-share">
          <div class="btn-share-content" @click="shareLink">
            分享链接(组织内部分享)
          </div>
        </div>
        <div v-if="action != 'QrCode'" class="btn-share">
          <div ref="shareUrl" class="share-input">
            {{ url }}
          </div>
          <div class="btn-share-content cobyOrderSn" data-clipboard-target=".share-input" @click="copyShareUrl">
            复制查看链接
          </div>
        </div>
      </div>
    </layout>
  </div>
</template>
<script>
import Vue from 'vue';
import { getQrCodeUrl, shareSheet, getShareUrl } from '../../service/get-data';
import H3DeveloperPlugin from '../../lib/h3-plugins-developer';
import '../../lib/jquery-qrcode-min';
import { pickConversation, dingShare } from '../../config/dingtalk-interface';
import clipboard from 'clipboard';

Vue.prototype.clipboard = clipboard;

export default {
  name: 'Share',
  components: {
  },
  data () {
    return {
      action: '',
      displayName: null,
      sheetName: null,
      schemaCode: null,
      bizObjectId: null,
      appCode: null,
      url: null,
      qrCodeUrl: null,
      summary: null,
      pageTitle: '',
    };
  },
  created () {
    this.displayName = this.$route.params.displayName;
    // this.summary=this.$route.params.summary;
    this.schemaCode = this.$route.params.schemaCode;
    this.bizObjectId = this.$route.params.bizObjectId;
    this.appCode = this.$route.params.appCode;
    this.action = this.$route.params.action;
    if (this.action === 'QrCode') {
      this.requestQrUrl(this.schemaCode, this.bizObjectId, this.appCode);
    } else {
      this.requestShareUrl(this.schemaCode, this.bizObjectId);
    }
  },
  activated () {
    this.pageTitle = this.action === 'QrCode' ? '二维码' : '分享';
  },
  methods: {
    async requestQrUrl (schemaCode, bizObjectId, appCode) {
      const res = await getQrCodeUrl(schemaCode, bizObjectId, appCode);
      if (res.Successful) {
        this.url = res.ReturnData.Url;
        this.summary = res.ReturnData.Summary;
        this.sheetName = res.ReturnData.DisplayName;
        if (this.url) {
          this.renderQrCode(this.url);
        }
      }
    },
    async requestShareUrl (schemaCode, bizObjectId) {
      if (schemaCode && bizObjectId) {
        const res = await getShareUrl(schemaCode, bizObjectId);
        if (res.Successful) {
          this.url = res.ReturnData.ShareUrl;
          this.renderQrCode(this.url);
        }
      }
    },
    renderQrCode (url) {
      if (this.url) {
        const $qrWrapper = $('<div></div>');
        $qrWrapper.qrcode({ width: 200, height: 200, text: url });
        const canvas = $qrWrapper.find('canvas').get(0);
        if (canvas) {
          const dataUrl = canvas.toDataURL();
          console.log(dataUrl);
          this.qrCodeUrl = dataUrl;
        }
      }
    },
    shareLink () {
      const that = this;
      // this.$router.push({name:'shareselect',
      // params:{url:this.url,displayName:this.displayName }});
      pickConversation(this.$store.state.corpId, (cid) => {
        const title = `分享【${that.sheetName}】的数据给你查看`;
        that.shareLinkToOther(that.schemaCode, that.bizObjectId, title, that.summary, cid);
      });
    },
    shareQrCode () {
      const canvas = $('#qr-wrapper').find('canvas').get(0);
      if (canvas) {
        const dataUrl = canvas.toDataURL();
        dingShare({
          type: 0, // 分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
          url: dataUrl,
          title: '分享',
          content: '',
          image: dataUrl,
          onSuccess () {
            // onSuccess将在调起分享组件成功之后回调
            H3DeveloperPlugin.IShowSuccess('保存成功!');
          },
          onFail () {
            H3DeveloperPlugin.IShowError('保存失败!');
          },
        });
      }
    },
    copyShareUrl () {
      const _this = this;
      const clipboard = new this.clipboard('.cobyOrderSn');
      clipboard.on('success', function () {
        H3DeveloperPlugin.IShowSuccess('复制成功!');
      });
      clipboard.on('error', function () {
        H3DeveloperPlugin.IShowError('复制失败!请重新复制');
      });
    },
    async shareLinkToOther (schemaCode, bizObjectId, title, content, cid) {
      const res = await shareSheet(schemaCode, bizObjectId, null, title, content, cid);
      if (res.Successful) {
        H3DeveloperPlugin.IShowSuccess('分享成功!');
      } else {
        H3DeveloperPlugin.IShowError('分享失败!');
      }
    },
  },
  beforeRouteLeave (to, from, next) {
    this.$destroy();
    next();
  },
};
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.share-page {
  height: 100%;
  .content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    // margin-top: 46px;
    background: #F5F7F9;
    .content__qrcode {
      background-color: #fff;
      .px2rem(margin-top,72);
      .px2rem(margin-left,52);
      .px2rem(margin-right,52);
    }
    #qr-wrapper {
      width: 100%;
      text-align: center;
    }
    .title {
      .px2rem(padding-top,58);
      .px2rem(margin-bottom,55);
      text-align: center;
      .px2rem(font-size,34);
      color: #333;
      .px2rem(padding-left,68);
      .px2rem(padding-right,68);
      display: -webkit-box;
      /* autoprefixer: ignore next*/
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-all;
      // max-width: 90%;
    }
    .description {
      .px2rem(padding-left,125);
      .px2rem(padding-right,125);
      .px2rem(padding-top,35);
      .px2rem(padding-bottom,56);
      text-align: center;
      .px2rem(font-size,28);
      color: #107FF0;
    }
    .btn-share {
      .px2rem(margin-top,75);
      .px2rem(padding-left,85);
      .px2rem(padding-right,85);
      position: relative;
      .btn-share-content {
        .px2rem(font-size,28);
        .px2rem(padding-top,20);
        .px2rem(padding-bottom,20);
        display: block;
        text-align: center;
        color: #fff;
        background: #108ee9;
        border-radius: 5px;
        cursor: pointer;
      }
      .share-qrcode-tip {
        text-align: center;
        color: #108ee9;
      }
      .share-input {
        position: absolute;
        width: 100%;
        left: 0;
        opacity: 0;
        top: 40px;
      }
    }
  }
}
</style>
