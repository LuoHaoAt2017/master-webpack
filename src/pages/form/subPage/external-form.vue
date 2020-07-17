<template>
  <div class="external-form">
    <div class="content">
      <div class="description">
        <div class="h3yun_All check-circle"></div>
        <p class="submit-success dp-font34">
          提交成功！
        </p>
      </div>
      <div class="code__wrap">
        <div id="qr-wrapper" class="qr-wrapper"></div>
        <div class="qr__description">
          <span class="h3yun_All dingding"></span>
          钉钉扫一扫，查看数据
        </div>
      </div>
      <div class="btn-share-content dp-font28" @click="reviewData">
        查看
      </div>
    </div>
  </div>
</template>

<script>
import '../../../lib/jquery-qrcode-min';
import { setTitle, setLeft, closeApp }
  from '../../../config/dingtalk-interface';
import { getShortUrl } from '../../../service/get-data';

export default {
  name: 'ExternalForm',
  data () {
    return {
      displayName: null,
    };
  },
  created () {
    this.displayName = this.$route.params.displayName;
    this.schemaCode = this.$route.params.schemaCode;
    this.bizObjectId = this.$route.params.bizObjectId;
    this.appCode = this.$route.params.appCode;
    this.ReviewQrCodeUrl = this.$route.params.ReviewQrCodeUrl;
    this.isExternalForm = this.$route.params.isExternalForm;
  },
  mounted () {
    this.requestQrUrl();
  },
  activated () {
    setTitle(this.displayName);

    const self = this;
    window.backFn = () => {
      self.goBack();
    };
    setLeft(window.backFn);
  },
  methods: {
    requestQrUrl () {
      const tempUrl = `${this.ReviewQrCodeUrl}&bizObjectId=${this.bizObjectId}&schemaCode=${this.schemaCode}`;
      if (tempUrl) {
        const originalUrl = encodeURIComponent(tempUrl);
        this.getShortUrlAsync(originalUrl, (shortUrl) => {
          $('#qr-wrapper').qrcode({ width: 200, height: 200, text: shortUrl });
        }, () => {
          $('#qr-wrapper').qrcode({ width: 200, height: 200, text: originalUrl });
        }, () => {
          const qrCanvas = document.getElementsByTagName('canvas')[0];
          const img = this.convertCanvasToImage(qrCanvas);
          $('#qr-wrapper').empty().append(img);
        });
      }
    },
    // 从 canvas 提取图片image
    convertCanvasToImage (canvas) {
      const image = new Image();
      image.src = canvas.toDataURL('image/png');
      return image;
    },
    goBack () {
      closeApp();
    },
    async getShortUrlAsync (originalUrl, success, error, callback) {
      const result = await getShortUrl(originalUrl);
      if (result) {
        if (result.Successful) {
          success(result.ReturnData.ShortUrl);
        } else {
          error();
        }
        callback();
      }
    },
    reviewData () {
      setLeft(() => {
        this.$router.go(-1);
      });

      this.$router.push({
        name: 'formPage',
        params: { schemaCode: this.schemaCode, bizObjectId: this.bizObjectId, ReviewQrCodeUrl: this.ReviewQrCodeUrl },
        query: { schemaCode: this.schemaCode, bizObjectId: this.bizObjectId },
      });
    },
  },
};
</script>

<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}

.external-form {
  .content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    // margin-top: 46px;
    background: #F5F7F9;
    .px2rem(padding-top, 108);
    overflow-y: auto;
    #qr-wrapper {
      width: 100%;
      text-align: center;
      // .px2rem(margin-bottom,30);
      .px2rem(padding-top,82);
    }
    .description {
      text-align: center;
      color: #333;
      .px2rem(margin-bottom,80);
      p{
        .px2rem(font-size,30);
        .px2rem(line-height,45);
        .px2rem(padding-left,20);
        .px2rem(margin-top,5);
      }
      .icon-base-check-circle-o{
        .px2rem(font-size,80);
        color: #52C41A;
        font-family: 'aufont' !important;
      }
      .h3yun_All {
        color: #1DCCA3;
        font-size: 50px;
      }
    }
    .code__wrap {
      background-color: white;
      .px2rem(margin-left,52);
      .px2rem(margin-right,52);
      .qr__description {
        // .px2rem(padding-left,125);
        // .px2rem(padding-right,125);
        .px2rem(padding-top,34);
        .px2rem(padding-bottom,67);
        text-align: center;
        .px2rem(font-size,28);
        color: #107FF0;
        .dingding {
          font-size: 18px;
        }
      }
    }
    .btn-share-content {
      .px2rem(width,580);
      .px2rem(height,88);
      .px2rem(border-radius,10);
      border:1px solid rgba(16,127,240,1);
      margin: 0 auto;
      .px2rem(margin-top,61);
      color: #107FF0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
