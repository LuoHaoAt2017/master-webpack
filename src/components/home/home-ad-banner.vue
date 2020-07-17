<template>
    <div class="home-ad-banner" v-show="showBanner && showBannerList.length > 0 && UserInfo.isAdministrator">
        <h3-swiper dotsPosition="center">
            <h3-swiper-item
            v-for="(banner,index) in showBannerList"
            :key="index"
            @click.native="goBannerPage(banner)"
            class="banner-container"
            v-if="index < 3"
            >
            <div class="banner-border">
                <img :src="banner.FilePath" v-cloak/>
            </div>
            </h3-swiper-item>
        </h3-swiper>
        <a href="javascriptt:;" class="close-banner" @click.stop="closeBannerShow">X</a>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { State, Action, namespace } from 'vuex-class';
import { openLink } from '@/config/dingtalk-interface';
// vuex-class module命名空间
const homeModule = namespace('Home');

import { H3Swiper } from 'h3-mobile-vue';
@Component({
  components: {
    H3Swiper,
    H3SwiperItem: H3Swiper.Item,
  }
})
export default class HomeAdBanner extends Vue {
  @homeModule.State('BannerList') BannerList; // 首页banner
  @State('UserInfo')
  UserInfo: H3.Common.UserInfo;

  showBanner:boolean = true;
  created(){
  }
  closeBannerShow(){
    this.showBanner = false;
    let delBannerId = [];
    this.BannerList.forEach(bannerItem => {
        delBannerId.push(bannerItem.ObjectId); 
    });
    let bannerDelData = window.localStorage.getItem('bannerDelet');
    if (bannerDelData) {
        delBannerId = delBannerId.concat(JSON.parse(bannerDelData));    
    }
    window.localStorage.setItem('bannerDelet',JSON.stringify(delBannerId));
    this.$emit('hideHeaderTitle');
  }
  get showBannerList(){
     let delBannerIdArr = window.localStorage.getItem('bannerDelet');
     let showBannerList = [];
     let that = this;
     if (delBannerIdArr) {
        delBannerIdArr = JSON.parse(delBannerIdArr);
        showBannerList = that.BannerList.filter(item => {
            return !that.isInDelBanner(delBannerIdArr,item.ObjectId);
        }) 
     } else {
        showBannerList = this.BannerList;
     }
     return showBannerList;
  }
  isInDelBanner(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
  }  
  goBannerPage(banner: H3.Home.Banner) {
    const code: string = banner.ObjectId;
    const existDetail: boolean = banner.ExistDetail;
    let LinkUrl: string = banner.LinkUrl;
    if (existDetail) {
        this.$router.push({
            name: 'bannerDetail',
            query: {
                objectId: code,
            }
        });
    } else if(LinkUrl){
        if(LinkUrl.indexOf('lottery')>=0){
            const corpid = this.$store.state.corpId;
            const suitekey = this.$store.state.suiteKey;
            LinkUrl = LinkUrl.replace('#/lottery','')
            LinkUrl = `${LinkUrl}?corpid=${corpid}&suitkey=${suitekey}`;
            openLink(LinkUrl+'#/lottery'); 
        }else{
            openLink(LinkUrl);
        }
    }else {

        return;
    }
  }
}
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #1890ff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.home-ad-banner{
    .px2rem(padding-bottom, 60); 
    background-color: #F5F7F9;
    position: relative;
    /deep/ .h3-slider>.h3-swiper>.h3-swiper-item>a>.h3-img{
       .px2rem(border-radius, 10);  
    }
    /deep/ .h3-slider>.h3-swiper{
        .px2rem(border-radius, 10); 
         box-shadow: 0 6px 28px 0 rgba(80, 119, 188, 0.11);
         .px2rem(height, 242) !important;
         .h3-swiper-item{
            .px2rem(padding-right, 20);
            .px2rem(padding-left, 20); 
            box-sizing: border-box;
         }
    }
    .banner-border{
        width:100%;
        height:100%; 
        img{
            width:100%;
            height:100%; 
            .px2rem(border-radius, 10);  
            object-fit: cover;
        }   
    }
    /deep/ .h3-slider>.h3-indicator{
        .px2rem(bottom, -32);
    }
    /deep/ .h3-slider>.h3-indicator>a>.h3-icon-dot{
        width: 5px;
        background-color:#ddd;
        transition: all .3s ease-out;
    }
    /deep/ .h3-slider>.h3-indicator>a>.h3-icon-dot.active{
        width: 8px;
        background-color:#107FFF;
    }
    /deep/ .h3-slider{
        overflow: inherit; 
    }
    .close-banner{
        .px2rem(width, 44);
        .px2rem(height, 42); 
        .px2rem(border-bottom-right-radius, 26);
        .px2rem(border-bottom-left-radius, 26);
        background-color: rgba(74, 74, 74, 0.3588);
        position: absolute;
        top: 0;
        .px2rem(right, 40);
        z-index: 999;
        color: #fff;
        text-align: center;
         .px2rem(line-height, 42); 
         font-size: 12px;
    }
}
</style>
