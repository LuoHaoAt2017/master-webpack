<template>
  <div class="guidance">
    <h3-swiper dots-position='center' v-model='number' @on-index-change='indexChange'>
      <h3-swiper-item v-for='(item, index) in currentUrl' :key='index'><img :src="item.url" alt="图片"></h3-swiper-item>
    </h3-swiper>
    <!-- <div class="skip-out dp-font28" @click='goToHomePage' v-if='installed'>跳过</div> -->
    <div class="button" >
      <div class="under-install" v-if="!installed">
        <img src='../../assets/img/titlebar.svg' class="loading">
        <span class="dp-font34">应用安装中</span>
      </div>
      <div class="start-btn dp-font34" @click='goToHomePage' v-if='installed'>开始体验</div>
    </div>
  </div>
</template>
<script>
import { H3Swiper } from 'h3-mobile-vue';
import { isInstalledOK } from '@/service/get-data';
import { setLeft, closeApp } from '@/config/dingtalk-interface';
// import { requestAuthCode } from '../../config/dingtalk-interface';

export default {
  name: 'guidance',
  components: {
    H3Swiper,
    H3SwiperItem: H3Swiper.Item,
  },
  data() {
    return {
      /* eslint-disable global-require */
      number: 0,
      currentLength: 0,
      currentUrl: '',
      installed: false,
      // isShowBol: false,
      crmImgUrl1: [
        {
          url: require('@/assets/img/CRM/1企业主.jpg'),
        },
        {
          url: require('@/assets/img/CRM/2销售经理.jpg'),
        },
        {
          url: require('@/assets/img/CRM/3销售人员.jpg'),
        },
      ],
      crmImgUrl2: [
        {
          url: require('@/assets/img/CRM/1企业主x.jpg'),
        },
        {
          url: require('@/assets/img/CRM/2销售经理x.jpg'),
        },
        {
          url: require('@/assets/img/CRM/3销售人员x.jpg'),
        },
      ],
      erpImgUrl1: [
        {
          url: require('@/assets/img/ERP/1采购管理.jpg'),
        },
        {
          url: require('@/assets/img/ERP/2库存管理.jpg'),
        },
        {
          url: require('@/assets/img/ERP/3销售管理.jpg'),
        },
        {
          url: require('@/assets/img/ERP/4财务管理.jpg'),
        },
      ],
      erpImgUrl2: [
        {
          url: require('@/assets/img/ERP/1采购管理x.jpg'),
        },
        {
          url: require('@/assets/img/ERP/2库存管理x.jpg'),
        },
        {
          url: require('@/assets/img/ERP/3销售管理x.jpg'),
        },
        {
          url: require('@/assets/img/ERP/4财务管理x.jpg'),
        },
      ],
      schoolImgUrl1: [
        {
          url: require('@/assets/img/platform/校园版1.jpg'),
        },
        {
          url: require('@/assets/img/platform/校园版2.jpg'),
        },
        {
          url: require('@/assets/img/platform/校园版3.jpg'),
        },
        {
          url: require('@/assets/img/platform/校园版4.jpg'),
        },
      ],
      schoolImgUrl2: [
        {
          url: require('@/assets/img/platform/校园版1x.jpg'),
        },
        {
          url: require('@/assets/img/platform/校园版2x.jpg'),
        },
        {
          url: require('@/assets/img/platform/校园版3x.jpg'),
        },
        {
          url: require('@/assets/img/platform/校园版4x.jpg'),
        },
      ],
      standardImgUrl1: [
        {
          url: require('@/assets/img/platform/标准版1.jpg'),
        },
        {
          url: require('@/assets/img/platform/标准版2.jpg'),
        },
        {
          url: require('@/assets/img/platform/标准版3.jpg'),
        },
        {
          url: require('@/assets/img/platform/标准版4.jpg'),
        },
      ],
      standardImgUrl2: [
        {
          url: require('@/assets/img/platform/标准版1x.jpg'),
        },
        {
          url: require('@/assets/img/platform/标准版2x.jpg'),
        },
        {
          url: require('@/assets/img/platform/标准版3x.jpg'),
        },
        {
          url: require('@/assets/img/platform/标准版4x.jpg'),
        },
      ],
      ehrImgUrl: [
        {
          url: require('@/assets/img/eHR/引导页1.jpg'),
        },
        {
          url: require('@/assets/img/eHR/引导页2.jpg'),
        },
        {
          url: require('@/assets/img/eHR/引导页3.jpg'),
        },
        {
          url: require('@/assets/img/eHR/引导页4.jpg'),
        },
      ],
      hjwImgUrl1: [
        {
          url: require('@/assets/img/hjw/hjw1.jpg'),
        },
        {
          url: require('@/assets/img/hjw/hjw2.jpg'),
        },
        {
          url: require('@/assets/img/hjw/hjw3.jpg'),
        },
        {
          url: require('@/assets/img/hjw/hjw4.jpg'),
        },
      ],
      hjwImgUrl2: [
        {
          url: require('@/assets/img/hjw/hjw1x.jpg'),
        },
        {
          url: require('@/assets/img/hjw/hjw2x.jpg'),
        },
        {
          url: require('@/assets/img/hjw/hjw3x.jpg'),
        },
        {
          url: require('@/assets/img/hjw/hjw4x.jpg'),
        },
      ],
      width: 0,
      height: 0,
      ratio: 0,
    };
  },
  created () {
    this.width = window.screen.width;
    this.height = window.screen.height;
    this.ratio = this.height / this.width;
    const solutionCode = window.GlobalConfig.solutionCode;
    if (solutionCode && solutionCode.toLowerCase().indexOf('crm') > -1 && this.ratio < 2) {
      this.currentUrl = this.crmImgUrl1;
    } else if (solutionCode && solutionCode.toLowerCase().indexOf('crm') > -1 && this.ratio >= 2) {
      this.currentUrl = this.crmImgUrl2;
    } else if (solutionCode && solutionCode.toLowerCase().indexOf('erp') > -1 && this.ratio < 2) {
      this.currentUrl = this.erpImgUrl1;
    } else if (solutionCode && solutionCode.toLowerCase().indexOf('erp') > -1 && this.ratio >= 2) {
      this.currentUrl = this.erpImgUrl2;
    } else if (solutionCode && solutionCode.toLowerCase().indexOf('school') > -1 && this.ratio < 2) {
      this.currentUrl = this.schoolImgUrl1;
    } else if (solutionCode && solutionCode.toLowerCase().indexOf('school') > -1 && this.ratio >= 2) {
      this.currentUrl = this.schoolImgUrl2;
    } else if (solutionCode && solutionCode.toLowerCase().indexOf('standard') > -1 && this.ratio >= 2) {
      this.currentUrl = this.standardImgUrl2;
    } else if (solutionCode && solutionCode.toLowerCase().indexOf('standard') > -1 && this.ratio < 2) {
      this.currentUrl = this.standardImgUrl1;
    } else if (solutionCode && solutionCode.toLowerCase().indexOf('ehr') > -1) {
      this.currentUrl = this.ehrImgUrl;
    } else if (solutionCode && solutionCode.toLowerCase().indexOf('szxy') > -1 && this.ratio < 2) {
      this.currentUrl = this.hjwImgUrl1;
    } else if (solutionCode && solutionCode.toLowerCase().indexOf('szxy') > -1 && this.ratio >= 2) {
      this.currentUrl = this.hjwImgUrl2;
    }
    this.currentLength = this.currentUrl.length;
    this.installed = window.GlobalConfig.hasInstalled;
    if (!window.GlobalConfig.hasInstalled) {
      this.getInstalledMessage();
    } else {
      localStorage.setItem(`isShowGuidance-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionCode}`, true);
    }
  },
  activated() {
    setLeft(() => {
      this.goBack();
    });
  },
  methods: {
    indexChange() {
      // if (index === (this.currentLength - 1) && !this.isShowBol) {
      //   this.isShowBol = true;
      // }
    },
    getInstalledMessage() {
      const self = this;
      setTimeout(async () => {
        const res = await isInstalledOK(window.GlobalConfig.solutionCode);
        if (!res.Successful) {
          self.getInstalledMessage();
        } else {
          self.installed = true;
          localStorage.setItem(`isShowGuidance-${window.GlobalConfig.engineCode}-${window.GlobalConfig.solutionCode}`, true);
        }
      }, 5000);
    },
    goToHomePage() {
      this.$router.push('home');
    },
    goBack() {
      closeApp();
    },
    // clipImg(imgWidth, imgHeight, width, height) {
    //   const ratioV = width / height;
    //   const ratioImg = imgWidth / imgHeight;
    //   if (ratioV < ratioImg) {
    //     const w2 = imgHeight * ratioV;
    //     const h2 = imgHeight;
    //     const x = (imgWidth - w2) / 2;
    //     const y = 0;
    //   } else {
    //     const w2 = imgWidth;
    //     const h2 = imgWidth / ratioV;
    //     const x = 0;
    //     const y = (imgHeight - h2)/2;
    //   }
    // },
  },
};
</script>
<style lang='less'>
@import "../../styles/common.less";
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.guidance{
  height: 100%;
  .h3-slider {
    height: 100%;
    .h3-swiper {
      height: 100%!important;
    }
  }
  .vux-slider{
    height: 100%;
  }
  img{
    width: 100%;
    height: 100%;
  }
  .skip-out{
    position: absolute;
    .px2rem(top,30);
    .px2rem(right,30);
    border: 1px solid grey;
    .px2rem(width,112);
    .px2rem(height,48);
    .px2rem(border-radius,100);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
    color: #fff;
  }
  .button{
    position: absolute;
    .px2rem(bottom,80);
    .px2rem(width,330);
    .px2rem(height,78);
    .px2rem(left,210);
    .px2rem(border-radius,100);
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 9px 23px 0 rgba(0,0,0,.14);
    .under-install{
      color: #333333;
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        opacity: .3;
      }
    }
    .loading{
      .px2rem(width,41.6);
      .px2rem(height,41.6);
      .px2rem(margin-right,10);
      vertical-align: bottom;
      opacity: 0.3;
      animation: spinner-anime 1s linear infinite;
    }
    @keyframes spinner-anime {
      100% {
        transform: rotate(360deg);
      }
    }
    .start-btn{
      color: #333333;
    }
  }
  .vux-slider > .vux-indicator > a:last-child{
    .px2rem(margin-right,12)!important;
  }
}
</style>
