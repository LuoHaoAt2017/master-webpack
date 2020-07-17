<template>
  <div class="external-share-wrap">
    <layout
      title="分享"
    >
      <div class="content">
        <h3-tab v-model="tabKey">
          <h3-tab-item :key="0">
            分享填单
          </h3-tab-item>
          <h3-tab-item :key="1">
            公开查询
          </h3-tab-item>
        </h3-tab>
        <h3-swiper v-model="tabKey" class="container">
          <h3-swiper-item :key="0">
            <div class="share">
              <div class="external-header">
                <div class="header-left">
                  <div class="desc">
                    开启后将允许外部人员通过链接或二维码填报数据
                  </div>
                </div>
                <div class="header-right">
                  <h3-switch
                    v-model="enable"
                    color="#107FFF"
                    @onClick="switchClick"
                  />
                </div>
              </div>

              <div class="external-body">
                <div v-if="!enable" class="share-closed">
                  <img src="../../assets/img/share-closed.png" />
                  <span>功能未开启</span>
                </div>
                <template v-else>
                  <div class="content__qrcode">
                    <div class="title">
                      {{ title }}
                    </div>
                    <div id="qr-wrapper" v-show="qrCodeUrl" class="qr-wrapper">
                      <img ref="qrCodeUrl" :src="qrCodeUrl" alt="二维码" />
                    </div>
                  </div>

                  <div class="btn-share">
                    <div class="btn-share-content" @click="shareLink(false)">
                      分享
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </h3-swiper-item>
          <h3-swiper-item :key="1">
            <div class="query">
              <div class="query-header">
                开启后将允许外部人员通过链接或二维码查询数据
              </div>
              <div class="query-body">
                <div v-if="!queryEnabled" class="query-closed">
                  <img src="../../assets/img/share-closed.png" />
                  <p>暂未开启<br />请前往电脑端开启公开查询功能</p>
                </div>
                <div v-else>
                  <div class="content__qrcode">
                    <div class="title">
                      {{ queryTitle }}
                    </div>
                    <div id="query-qr-wrapper" v-show="queryQrCodeUrl" class="qr-wrapper">
                      <img ref="queryQrCodeUrl" :src="queryQrCodeUrl" alt="二维码" />
                    </div>
                    <div v-if="openLevel !== 0" class="password">
                      <span>查询密码：{{ password }}</span>
                    </div>
                  </div>

                  <div class="btn-share">
                    <div class="btn-share-content" @click="shareLink(true)">
                      分享
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </h3-swiper-item>
        </h3-swiper>
      </div>
    </layout>
  </div>
</template>

<script lang='ts'>
import {
  Vue, Component, Prop, Emit, Watch,
} from 'vue-property-decorator';
import { H3Switch } from 'h3-mobile-vue';
import {
  getExternalStatus, getExternalShortUrl, switchfillform, getOpenQuerySetting,
} from '@/light-app/service/external';
import { dingShare } from '@/config/dingtalk-interface';
import '../../lib/jquery-qrcode-min';
import { H3Toast, H3Tab, H3Swiper } from '@h3/thinking-ui';
Vue.use(H3Toast);

enum statusType {
  OPEN = 1,
  CLOSE = 0,
}

@Component({
  name: 'externalShare',
  components: {
    H3Switch,
    H3Tab,
    H3TabItem: H3Tab.Item,
    H3Swiper,
    H3SwiperItem: H3Swiper.Item,
  },
})
export default class externalShare extends Vue {
  // 标题
  title: string = '';

  // 分享url
  shareUrl:string = '';

  displayName:string = '';

  // 表单编码
  schemaCode: string = '';

  // 二维码
  qrCodeUrl: string = '';

  // 是否开启
  enable: boolean = true;

  queryEnabled = false;

  queryUrl = '';

  queryQrCodeUrl = '';

  queryTitle = '';

  tabKey = 0; // 0 分享填单 1 公开查询

  openLevel = 0;

  password = '';

  get shareText () {
    if (this.enable) {
      return '功能已开启';
    }
    return '未开启';
  }

  // @Watch('tabKey')
  // onTabKeyChanged (val) {
  //   if (val === 1 && !this.queryQrCodeUrl && this.queryEnabled) {
  //     this.renderQrCode(this.queryUrl, true);
  //   }
  // }

  async activated () {
    const schemaCode: any = this.$route.query.schemaCode;
    const displayName: any = this.$route.query.displayName;
    this.displayName = displayName;
    this.tabKey = 0;
    if (schemaCode) {
      this.schemaCode = schemaCode;
      // const status = await this.getFormStatus(statusType.OPEN);
      // if (status.success) this.enable = true;
      // else {
      //   this.enable = false;
      //   this.$h3.toast.show('默认开启失败');
      // }
      this.getExternalInfo();
      this.getUrl();
      this.getOpenQuerySettingInfo();
    }
  }

  // 获取外链信息
  async getExternalInfo () {
    const result = await getExternalStatus(this.schemaCode);
    if (result.success) {
      const setting = result.returnData.Setting;
      if (setting) {
        this.title = setting.title || this.displayName; // 标题
        this.enable = setting.status > 0;
      }
    } else {
      this.title = '';
      this.enable = false;
      this.$h3.toast.show(result.errorMsg);
    }
  }

  // 获取外链url
  async getUrl () {
    const result = await getExternalShortUrl(this.schemaCode);
    if (result.success) {
      this.shareUrl = result.returnData.ShortUrl;
      this.renderQrCode(this.shareUrl);
      // TODO 可以考虑由服务端生成二维码图片url，纯前端生成的base64图片在移动端无法长按下载
    } else {
      this.$h3.toast.show(result.errorMsg);
    }
  }

  // 开启或关闭
  async switchClick (val) {
    if (val) {
      this.$h3.modal.show({
        title: '停用分享填单',
        content: '停用后已分享的链接将失效，确认停用吗？',
        type: 'alert',
        maskClosable: false,
        actions: [
          {
            text: '取消',
            onPress: () => {
              this.enable = true;
              this.$h3.modal.hide();
            },
          },
          {
            text: '确认',
            onPress: () => {
              this.closeExternalShare();
            },
          },
        ],
      });
    } else {
      const status = await this.getFormStatus(statusType.OPEN);
      if (status.success) this.enable = true;
      else {
        this.enable = false;
        this.$h3.toast.show(`${status.errorMsg}`);
      }
    }
  }

  async getFormStatus (status) {
    const result = await switchfillform({
      schemaCode: this.schemaCode,
      status: status,
    });
    return result;
  }

  // 关闭外链分享
  async closeExternalShare () {
    const { appCode } = this.$route.query;
    const result = await this.getFormStatus(statusType.CLOSE);
    if (result.success) {
      // this.$toast.show({icon: 'check-circle-o', text: "停用成功", duration: 2000})
      //   this.$router.push({
      //   path: '/schemas',
      //   query: {
      //     appCode: appCode,
      //   },
      // });
      this.$h3.modal.hide();
      this.enable = false;
    } else {
      this.$toast.show({ icon: 'close-circle-o', text: '停用失败' });
    }
  }

  async getOpenQuerySettingInfo () {
    const ret = await getOpenQuerySetting(this.schemaCode);
    if (ret.success) {
      const { Setting } = ret.returnData;
      this.queryEnabled = Setting.status;
      this.queryUrl = Setting.url;
      this.queryTitle = Setting.title;
      const { accessLevel, password } = Setting.extAttr;
      this.openLevel = accessLevel;
      this.password = password;
      if (this.queryEnabled) {
        this.renderQrCode(this.queryUrl, true);
      }
    }
  }

  // 分享链接
  shareLink (isQuery: boolean) {
    const url = isQuery ? this.queryUrl : this.shareUrl;
    dingShare({
      type: 0,
      url: url,
      title: this.title || this.displayName,
      content: '氚云——简单好用的在线管理工具',
      image: '../../assets/img/logo.svg',
      onSuccess: function () {
      },
      onFail: function (err) {},
    });
  }

  // 生成二维码
  renderQrCode (url: string, isQuery = false) {
    const $qrWrapper = $('<div></div>');
    ($qrWrapper as any).qrcode({ width: 500, height: 500, text: url });
    const canvas = $qrWrapper.find('canvas').get(0);
    if (canvas) {
      const dataUrl = (canvas as any).toDataURL('image/png');
      if (!isQuery) {
        this.qrCodeUrl = dataUrl;
      } else {
        this.queryQrCodeUrl = dataUrl;
      }
    }
  }
}
</script>

<style lang='less' scoped>
@externalClass: external-share-wrap;
@baseFontSize: 75;

.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.download {
  .px2rem(padding-top,30);
  .px2rem(padding-bottom,30);
}
.cloud-download-o {
  color:#107FFF;
  float: right;
  .px2rem(margin-right,30);
  .px2rem(font-size,40);
}

.@{externalClass} {
  height: 100%;
  .content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #F5F7F9;
    display: flex;
    flex-direction: column;
    .share,
    .query {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .external-header {
      .px2rem(height, 112);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #FFFFFF;
      .px2rem(padding-left, 32);
      .px2rem(padding-right, 32);
      // .px2rem(padding-top, 35);
      // .px2rem(padding-bottom, 35);
      box-sizing: border-box;

      .header-left {
        display: flex;
        flex-flow: column nowrap;
        .px2rem(font-size, 28);
        // .tip {
        //   color: #333333;
        // }
        .desc {
          .px2rem(padding-top, 7);
          color: #666;
        }
      }
    }
    .external-body {
      flex: 1;
      .share-closed {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          .px2rem(width, 212);
          .px2rem(height, 212);
        }
        span {
          color:rgba(153,153,153,1);
        }
      }
    }
    .query-body {
      flex: 1;
      .query-closed {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          .px2rem(width, 212);
          .px2rem(height, 212);
          .px2rem(margin-bottom, 12);
        }
        p {
          .px2rem(margin-bottom, 12);
          .px2rem(line-height, 44);
          .px2rem(font-size, 28);
          font-family:PingFangSC-Regular,PingFang SC;
          color:rgba(153,153,153,1);
          text-align: center;
        }
      }
    }

    .container {
      flex: 1;
    }

    .content__qrcode {
      position: relative;
      background-color: #fff;
      .px2rem(margin-top,74);
      .px2rem(margin-left,68);
      .px2rem(margin-right,68);
      .px2rem(border-radius,4);
    }
    .qr-wrapper {
      .px2rem(padding-left,109);
      .px2rem(padding-right,109);
      .px2rem(padding-top,42);
      .px2rem(padding-bottom,110);
      .px2rem(height, 396);
      text-align: center;
      img {
        width:100%;
        -webkit-touch-callout:default;
      }
    }
    .title {
      .px2rem(padding-top,35);
      text-align: center;
      .px2rem(font-size,34);
      color: #333;
      // .px2rem(padding-left,68);
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .query-header {
      .px2rem(height,113);
      .px2rem(line-height,113);
      .px2rem(padding-left,30);
      background:#fff;
      .px2rem(font-size,28);
      font-family:PingFangSC-Regular,PingFang SC;
      color:#666;
    }
    .password {
      position: absolute;
      .px2rem(bottom, 25);
      left: 0;
      width: 100%;
      .px2rem(height, 50);
      .px2rem(line-height, 50);
      text-align: center;
      span {
        .px2rem(font-size, 24);
        font-family:PingFangSC-Regular,PingFang SC;
        color:rgba(51,51,51,1);
      }
    }
    .btn-share {
      // .px2rem(margin-top,74);
      position: absolute;
      .px2rem(left,68);
      .px2rem(right,68);
      .px2rem(bottom,82);
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
