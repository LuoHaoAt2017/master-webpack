<template>
  <div class="liaghtshare">
        <layout
        title="数据分享"
        >
        <div class="content">
          <div class="content__qrcode">
            <p class="download">
              <!-- <i class="cloud-download-o h3yun_All"></i> -->
            </p>
            <div class="title">{{displayName}}</div>
            <div class="qr-wrapper" id="qr-wrapper" v-show="qrCodeUrl">
              <img :src="qrCodeUrl" alt="二维码"  ref="qrCodeUrl"/>
            </div>
            <div class="description">
                任何人可以通过链接和二维码查看数据
            </div>
          </div>
           <div class="btn-share">
            <div class="btn-share-content" @click="shareLink">分享</div>
          </div>
        </div>
        </layout>
    </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import { getShareUrl } from '@/light-app/service/external';
import { dingShare } from '@/config/dingtalk-interface';
import '../../../lib/jquery-qrcode-min';
import H3DeveloperPlugin from '../../../lib/h3-plugins-developer';


@Component({
  name: 'LightappShare',
  components: {
  }
})

export default class LightappShare extends Vue {

  displayName: string = ''
  shareUrl:string = ""
  schemaCode: string = ''
  bizObjectId: string = ''
  url: string = ''
  qrCodeUrl: string = ''

  activated() {
    this.displayName = (this.$route.query.displayName) as any;
    this.schemaCode = (this.$route.query.schemaCode) as any;
    this.bizObjectId = (this.$route.query.bizObjectId) as any;
    this.getUrl();
  }

   // 获取轻应用外链分享
  async getUrl(){
    const result = await getShareUrl(this.schemaCode, this.bizObjectId);
    if (result.success) {
       this.shareUrl = result.returnData.ShortUrl;
       this.renderQrCode(this.shareUrl);
      } else {
        this.$h3.toast.show('获取二维码失败!');
      }
  }

  shareLink() {
    dingShare({
      type: 0,
      url: this.shareUrl,
      title: this.displayName || '未命名表单',
      content: '氚云——简单好用的在线管理工具',
      image: 'http://h3yunproductmain-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/suitegzd1mwh0ferurv4d/logo?Expires=1580610257&OSSAccessKeyId=LTAICDQBavDJ6TRk&Signature=yPzpKfE2By6s4nVWxAVB4M4kQW8%3D',
      onSuccess : function() {
      },
      onFail : function(err) {}
    })
  }


 
  renderQrCode(url: string) {
    const $qrWrapper = $('<div></div>');
    ($qrWrapper as any).qrcode({ width: 500, height: 500, text: url });
    const canvas = $qrWrapper.find('canvas').get(0);
    if (canvas) {
      const dataUrl = (canvas as any).toDataURL('image/png');
      this.qrCodeUrl = dataUrl;
    }
  }

}
</script>

<style lang='less' scoped>
  @baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.download {
   position: relative;
  .px2rem(padding-top,53);
  // .px2rem(padding-bottom,53);
}
.cloud-download-o {
  color:#107FFF;
  position: absolute;
  .px2rem(right,30);
  .px2rem(top,30);
  .px2rem(font-size,40);
}
.liaghtshare {
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
      .px2rem(margin-top,78);
      .px2rem(margin-left,68);
      .px2rem(margin-right,68);
      .px2rem(border-radius,4);
    }
    #qr-wrapper {
      .px2rem(padding-left,109);
      .px2rem(padding-right,109);
      .px2rem(padding-top,42);
      .px2rem(padding-bottom,24);
      .px2rem(height, 396);
      text-align: center;
      img {
        width:100%;
      }
    }
    .title {
      // .px2rem(padding-top,35);
      text-align: center;
      .px2rem(font-size,34);
      color: #333;
      // .px2rem(padding-left,68);
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .description {
      // .px2rem(padding-left,125);
      // .px2rem(padding-right,125);
      // .px2rem(padding-top,35);
      .px2rem(padding-bottom,66);
      text-align: center;
      .px2rem(font-size,22);
      color: rgba(138,139,144,1);
    }
    .btn-share {
      .px2rem(margin-top,74);
      .px2rem(margin-left,68);
      .px2rem(margin-right,68);
      position: relative;
      .btn-share-content {
        .px2rem(font-size,30);
        .px2rem(height,88);
        .px2rem(line-height,88);
        display: block;
        text-align: center;
        color: #fff;
        background: #107FFF;
        .px2rem(border-radius,10);
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
