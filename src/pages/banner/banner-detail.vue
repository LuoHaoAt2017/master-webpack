<template>
  <layout :title="title">
    <div class="banner-detail">
      <div class="banner-wrap">
        <div class="banner-title">{{ currentBanner.Title }}</div>
        <div class="banner-time">{{ currentBanner.ModifiedTime }}</div>
        <div
          class="banner-content"
          v-if="currentBanner.Content"
          v-html="currentBanner.Content"
          @click="openUrl($event)"
        >
        </div>
      </div>
    </div>
  </layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace, State } from 'vuex-class';
import { openLink } from '../../config/dingtalk-interface';

// vuex-class module命名空间
const homeModule = namespace('Home');

@Component({
  name: 'bannerDetail',
})
export default class BannerDetail extends Vue {
  @homeModule.State('BannerList') BannerList; // 首页banner
  title:string = '详情';
  bannerCode:string = '';
  scrollTop:number = 0;
  created() {
    this.bannerCode = this.$route.query.objectId.toString();
  }
  get currentBanner(){
    const that = this;
    let currentBanner:any = {};
    that.BannerList.forEach(bannerItem => {
      if (bannerItem.ObjectId == that.bannerCode) {
        currentBanner = bannerItem;
      }
    });
    let date = new Date(parseInt(currentBanner.ModifiedTime.slice(6)));
    currentBanner.ModifiedTime = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'  '+date.getHours()+':'+date.getMinutes();
    return currentBanner;
  }
  openUrl(e) {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      let url = e.target.href;
      if (url) {
        openLink(url);  
      }
    }
  }
  beforeRouteLeave(to, from, next) {
    this.$store.state.excludeComp.push('bannerDetail');
    next();
  }
}
</script>
<style lang="less" scoped>
// @import '../assets/css/base.less';
@baseFontSize: 75;
.px2rem(@name,@px) {
    @{name}: @px/@baseFontSize * 1rem;
}
.banner-detail {
  background: #fff;
  margin: 0;
  padding: 0;
  display: flex;
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  border-top: 1px solid #E4E4E4;
  height: 100vh;
  .banner-wrap {
    width: 100%;
    // margin: 24px auto;

    height: auto;
    background: #fff;
    text-align: left;
    .px2rem(padding-top, 40);
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
    .px2rem(font-size, 30);
    // padding: 32px 80px;
    box-sizing: border-box;
    .banner-title {
      .px2rem(font-size, 40);
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(0,0,0,0.85);
    }
    .banner-time {
      // font-size:24px;
      .px2rem(font-size, 24);
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,0,0,0.45);
      .px2rem(height, 20);
      .px2rem(line-height, 20);
      .px2rem(padding-bottom, 24);
      margin-top: 8px;
    }
    .banner-content {
      color: #666;
      .px2rem(margin-bottom, 120);
      word-break: break-word;
      .px2rem(line-height, 48);
      /deep/ ul,
      /deep/ ol {
        .px2rem(padding-left, 25);
      }
      /deep/ ul li {
        list-style: disc;
        .px2rem(line-height, 48);
      }
      /deep/ ol li {
        list-style: decimal;
        .px2rem(line-height, 48);
      }
      /deep/ img {
        width:100%;
        .px2rem(margin-top, 16);
        .px2rem(margin-bottom, 16);
      }

    }
  }
}
</style>
