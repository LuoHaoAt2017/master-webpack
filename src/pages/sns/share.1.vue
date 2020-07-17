<template>
<!-- lbb修改代码规范 -->
    <div class="share-page">
        <layout 
        :title="pageTitle"
        >
        <div class="content">
          <div class="content__qrcode">
            <div class="title">{{displayName}}</div>
            <div class="qr-wrapper" id="qr-wrapper" v-if="qrCodeUrl">
              <img :src="qrCodeUrl" alt="二维码" />
            </div>
            <!-- <div class="description" v-if="action=='QrCode'">
                用钉钉扫一扫上面的二维码，查看数据<br/>
                注：仅限内部成员之间的分享，受权限控制
            </div> -->
            <div class="description" v-else>
              <span></span>&#xe984;
                分享功能是针对外部人员，可以将二维码分享给外部人员查看当前数据
            </div>
          </div>
          <div class="btn-share" v-if="action=='QrCode'">
            <div class="btn-share-content" @click="shareLink">分享链接</div>
          </div>
          <div class="btn-share" v-else>
            <div class="share-qrcode-tip">长按图片保存二维码至本地相册</div>
          </div>
        </div>
        </layout>
    </div>
</template>
<script>
import { getQrCodeUrl, shareSheet, getShareUrl } from '../../service/get-data';
import H3DeveloperPlugin from '../../lib/h3-plugins-developer';
import '../../lib/jquery-qrcode-min';
import { pickConversation, dingShare } from '../../config/dingtalk-interface';

export default {
  name: 'share',
  data() {
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
  components: {
  },
  created() {
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
  methods: {
    async requestQrUrl(schemaCode, bizObjectId, appCode) {
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
    async requestShareUrl(schemaCode, bizObjectId) {
      if (schemaCode && bizObjectId) {
        const res = await getShareUrl(schemaCode, bizObjectId);
        if (res.Successful) {
          this.url = res.ReturnData.ShareUrl;
          this.renderQrCode(this.url);
        }
      }
    },
    renderQrCode(url) {
      if (this.url) {
        const $qrWrapper = $('<div></div>');
        $qrWrapper.qrcode({ width: 200, height: 200, text: url });
        const canvas = $qrWrapper.find('canvas').get(0);
        if (canvas) {
          const dataUrl = canvas.toDataURL();
          this.qrCodeUrl = dataUrl;
        }
      }
    },
    shareLink() {
      const that = this;
      // this.$router.push({name:'shareselect',
      // params:{url:this.url,displayName:this.displayName }});
      pickConversation(this.$store.state.corpId, (cid) => {
        const title = `分享【${that.sheetName}】的数据给你查看`;
        that.shareLinkToOther(that.schemaCode, that.bizObjectId, title, that.summary, cid);
      });
    },
    shareQrCode() {
      const canvas = $('#qr-wrapper').find('canvas').get(0);
      if (canvas) {
        const dataUrl = canvas.toDataURL();
        dingShare({
          type: 0, // 分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
          url: dataUrl,
          title: '分享',
          content: '',
          image: dataUrl,
          onSuccess() {
            // onSuccess将在调起分享组件成功之后回调
            H3DeveloperPlugin.IShowSuccess('保存成功!');
          },
          onFail() {
            H3DeveloperPlugin.IShowError('保存失败!');
          },
        });
      }
    },
    async shareLinkToOther(schemaCode, bizObjectId, title, content, cid) {
      const res = await shareSheet(schemaCode, bizObjectId, null, title, content, cid);
      if (res.Successful) {
        H3DeveloperPlugin.IShowSuccess('分享成功!');
      } else {
        H3DeveloperPlugin.IShowError('分享失败!');
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },
  activated() {
    this.pageTitle = this.action === 'QrCode' ? '二维码' : '分享';
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
      .px2rem(margin-bottom,30);
    }
    .title {
      .px2rem(padding-top,58);
      .px2rem(padding-bottom,55);
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
      // max-width: 90%;
    }
    .description {
      .px2rem(padding-left,125);
      .px2rem(padding-right,125);
      text-align: center;
      .px2rem(font-size,24);
      color: #999;
    }
    .btn-share {
      .px2rem(margin-top,56);
      .px2rem(padding-left,24);
      .px2rem(padding-right,24);
      .btn-share-content {
        .px2rem(font-size,34);
        .px2rem(padding-top,20);
        .px2rem(padding-bottom,20);
        display: block;
        text-align: center;
        color: #fff;
        background: #108ee9;
        border-radius: 5px;
      }
      .share-qrcode-tip {
        text-align: center;
        color: #108ee9;
      }
    }
  }
}
</style>