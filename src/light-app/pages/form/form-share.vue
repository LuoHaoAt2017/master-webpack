<template>
  <layout
    title="邀请他人填单"
    @on-click-back="goBack"
    :leftOptions="{ preventGoBack: true }"
  >
    <div
      class="container"
      ref="imageWrapper"
    >
      <div
        class="tab-control"
        v-show="!onlyInnner"
      >
        <div
          v-for="(title,index) in tabTitle"
          :key="index"
          class="control-item"
          :class="{active:tabCur==index}"
          @click="switchTab(index)"
          style="user-select:none;"
        >{{title}}
        </div>
      </div>
      <div
        class="tab-content"
        :class="{onlyinnner: onlyInnner}"
      >
        <template v-if="!loading">
          <div
            class="item"
            v-for="(m,index) in tabMain"
            :key="index"
            v-show="tabCur==index"
          >
            <div
              class="content-title"
              style="user-select:none;"
            >{{ displayName }}</div>
            <div
              class="qr-wrapper"
              id="qr-wrapper"
            >
              <img :src="m" />
            </div>
            <p
              class="text"
              style="user-select:none;"
            >钉钉扫一扫，填写数据</p>
          </div>
        </template>
        <template v-else>
          <skeleton></skeleton>
        </template>
      </div>
      <div
        class="share-link-btn"
        v-if="tabCur==0"
        @click="shareLink"
        style="user-select:none;"
      >分享链接（组织内部分享）
      </div>
      <div
        class="save-photos-btn"
        :class="{outer:tabCur==1}"
        style="user-select:none;"
      >长按二维码保存至相册</div>
    </div>
  </layout>
</template>

<script lang='ts'>
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import '@/lib/jquery-qrcode-min';
import { pickConversation, dingShare } from '@/config/dingtalk-interface';
import { shareSheet } from '@/service/get-data';
import { shareLightSheet } from '@/light-app/service';
import watchShake$ from 'dingtalk-jsapi/api/device/accelerometer/watchShake';
import skeleton from '@/components/common/skeleton-loading.vue';
const lightAppModule = namespace('LightApp');
@Component({
  name: 'FormShare',
  components: {
    skeleton
  }
})
export default class FormShare extends Vue {
  tabTitle: string[] = ['内部邀请', '外部邀请'];
  tabMain: string[] = [];
  tabCur: number = 0;
  onlyInnner: boolean = false;
  innerUrl: string = '';
  outerUrl: string = '';
  summary: null;
  displayName: string | string[];
  schemaCode: string | string[];
  bizObjectId: string | string[] = '';
  appCode: any = '';
  loading: boolean = true;
  created() {
    // this.bizObjectId = this.$route.query.formObjectId;
    // this.requestQrUrl(this.schemaCode);
  }
  @lightAppModule.State('formName') formName;
  activated() {
    this.loading = true; // 恢复初始状态
    this.displayName = this.$route.query.formName;
    this.schemaCode = this.$route.query.formCode;
    this.appCode = this.$route.query.appCode;
    this.requestQrUrl(this.schemaCode);
  }
  get getFormName() {
    return this.formName || this.displayName;
  }
  switchTab(index) {
    this.tabCur = index;
  }
  goBack() {
    this.$router.replace({
      name: 'schemas',
      query: {
        appCode: this.appCode
      },
      params: {
        appCode: this.appCode
      }
    });
  }
  async requestQrUrl(schemaCode) {
    const res = await shareLightSheet(schemaCode);
    if (res.success) {
      this.innerUrl = res.returnData.InternalShortLink;
      this.outerUrl = res.returnData.ExternalShortLink;
      if (this.innerUrl) {
        this.renderQrCode(this.innerUrl, true);
      }
      if (this.outerUrl) {
        this.renderQrCode(this.outerUrl, false);
        this.onlyInnner = false;
      } else {
        this.onlyInnner = true;
      }
      this.loading = false;
    } else {
      this.$h3.toast.show('获取二维码失败!');
      this.loading = false;
    }
  }
  /**
   * 分享二维码链接
   * @params url //分享链接
   * @params isInner //判断是内外部分享
   */
  renderQrCode(url: string, isInner: boolean) {
    const $qrWrapper = $('<div></div>');
    ($qrWrapper as any).qrcode({ width: 500, height: 500, text: url });
    const canvas = $qrWrapper.find('canvas').get(0);
    if (canvas) {
      const dataUrl = (canvas as any).toDataURL('image/png');
      if (isInner) {
        this.tabMain.splice(0, 1, dataUrl);
      } else {
        this.tabMain.splice(1, 1, dataUrl);
      }
    }
  }
  shareLink() {
    const that = this;
    pickConversation(this.$store.state.corpId, cid => {
      const title = `${this.$store.state.UserInfo.userName}邀请你填写${this.displayName}`;
      that.shareLinkToOther(
        that.schemaCode,
        that.bizObjectId,
        title,
        that.summary,
        cid
      );
    });
  }

  async shareLinkToOther(schemaCode, bizObjectId, title, content, cid) {
    const res = await shareSheet(
      schemaCode,
      bizObjectId,
      null,
      title,
      content,
      cid
    );
    if (res.Successful) {
      this.$h3.toast.show('分享成功!');
    } else {
      this.$h3.toast.show('分享失败!');
    }
  }
}
</script>

<style lang='less' scoped>
@import '~@/light-app/styles/light-app.less';
.app-container {
  background: #f5f7f9;
}
.tab-control {
  font-size: 0;
  .control-item {
    background: #d8d8d8;
    display: inline-block;
    width: 50%;
    text-align: center;
    .px2rem(height, 84);
    .px2rem(line-height, 84);
    color: #333;
    .px2rem(font-size, 30);
    background-color: #fff;
    font-weight: normal;
    &.active {
      color: #107ff0;
      font-weight: 600;
      border-bottom: 0.05333rem solid #107ff0;
    }
  }
}
.tab-content {
  .px2rem(width, 650);
  .px2rem(height, 700);
  background-color: #fff;
  margin: 1.0666rem auto 0;
  /deep/ .skeleton-loading {
    width: 100%;
    height: 100%;
  }
  &.onlyinnner {
    .px2rem(margin-top, 164);
  }
  .content-title {
    .px2rem(line-height, 50);
    color: #333;
    .px2rem(font-size, 36);
    font-weight: 600;
    padding: 0.97333rem 0.6rem 0;
    box-sizing: border-box;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .qr-wrapper {
    .px2rem(width, 356);
    .px2rem(height, 356);
    margin: 1.0666rem auto 0;
    img {
      width: 100%;
    }
  }
  .text {
    color: #999;
    .px2rem(font-size, 30);
    .px2rem(margin-top, 30);
    .px2rem(line-height, 42);
    text-align: center;
  }
}
.share-link-btn {
  .px2rem(width, 580);
  .px2rem(height, 88);
  .px2rem(line-height, 88);
  .px2rem(border-radius, 10);
  background: rgba(16, 127, 240, 1);
  text-align: center;
  color: #fff;
  .px2rem(font-size, 30);
  margin: 1.6rem auto 0;
}
.save-photos-btn {
  width: 100%;
  .px2rem(line-height, 40);
  .px2rem(font-size, 28);
  color: rgba(153, 153, 153, 1);
  text-align: center;
  .px2rem(margin-top, 36);
  &.outer {
    .px2rem(margin-top, 244);
  }
}
</style>
