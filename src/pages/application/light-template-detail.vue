<template>
  <layout
    :title="title"
    :leftOptions="{preventGoBack: true}"
    @on-click-back="goBack"
  >
    <div
      id="light-template-detail"
      class="light-template-detail"
    >
      <div v-if="skeletonLoading">
        <div
          v-for="(skeleton, index) in skeletons"
          :key="index"
          class="skeleton-loading"
        >
          <skeleton class="middle" />
        </div>
      </div>
      <div v-show="!skeletonLoading" class="header">
        <div class="header-left">
          <img :src="templateInfo.Logo" alt="" />
        </div>
        <div class="header-middle">
          <div class="top">
            {{ templateInfo.Name }}
          </div>
          <div class="middle">
            {{ templateInfo.Summary }}
          </div>
          <div class="bottom">
            <div class="btn" :class="{'price': !templateInfo.IsFree}">
              {{ templateInfo.IsFree ? '免费' : `￥${price.toFixed(2)}` }}
            </div>
            <!-- <div class="install">
              {{ templateInfo.InstalledCount }}次安装
            </div> -->
          </div>
        </div>
      </div>
      <div v-show="!skeletonLoading" class="content">
        <h3-tab
          v-model="tabIndex"
          :lineWidth="2"
          customBarWidth="60px"
        >
          <h3-tab-item @on-item-click="tabChange">
            模板介绍
          </h3-tab-item>
          <h3-tab-item @on-item-click="tabChange">
            模板截图
          </h3-tab-item>
        </h3-tab>
        <div v-if="tabIndex === 1" class="tab0">
          <h3-swiper :itemWidth="itemWidth">
            <h3-swiper-item v-for="(item, index) in mobileScreenShots" :key="index" class="h3-swiper-demo-img">
              <div class="img-par">
                <img :src="item" alt="" />
              </div>
            </h3-swiper-item>
          </h3-swiper>
        </div>
        <div v-show="tabIndex === 0" class="tab1" v-html="recommendation">
        </div>
      </div>
      <div v-show="!skeletonLoading" class="footer">
        <div v-if="templateInfo.IsFree" class="template-detail-free">
          <div v-if="showInstall && !isInstalling" class="install" @click="install">
            安装
          </div>
          <div v-if="showInstall && isInstalling" class="loading">
            <span class="h3yun_All loading-o"></span>
            安装中
          </div>
          <div v-if="showOpen" class="open" @click="open">
            打开
          </div>
        </div>
        <div v-else class="template-detail-charge">
          <div v-if="showPurchase" class="purchase" @click="purchase">
            购买
          </div>
          <!-- <div v-if="showPurchaseAgain" class="purchase" @click="purchase">
            再次购买
          </div> -->
          <div v-if="showTry && !isInstalling" @click="install">
            试用
          </div>
          <div v-if="showTry && isInstalling" class="loading">
            <span class="h3yun_All loading-o"></span>
            安装中
          </div>
          <div v-if="showOpen" @click="open">
            打开
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import {
  Vue, Component, Prop, Emit, Watch,
} from 'vue-property-decorator';
import {
  State, Getter, Mutation, Action, namespace,
} from 'vuex-class';
import { H3Scroll, H3Tab } from 'h3-mobile-vue';
import { H3Swiper } from '@h3/thinking-ui';
// import { H3Tab } from '@h3/thinking-ui';

import { installTemplate, getTemplateDetail } from '@/service/app.light.common.api';
import skeleton from '@/components/common/skeleton-loading.vue';
// vuex-class module命名空间

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

@Component({
  name: 'lightTemplateDetail',
  components: {
    H3Scroll,
    skeleton,
    H3Tab,
    H3TabItem: H3Tab.Item,
    H3Swiper,
    H3SwiperItem: H3Swiper.Item,
  },
})
export default class lightTemplateDetail extends Vue {
  @State('UserInfo') userInfo ;

  title:any = '模板详情页';

  skeletons: number = 5; // 骨架图显示数量

  skeletonLoading = false;

  lists = [];

  code:any = '';

  price = 0; // 价格

  mobileScreenShots:string[] = [];

  tabIndex = 0;

  itemWidth = 0;

  templateInfo: any = {};

  recommendation:string = '';

  isInstalling = false;

  appCode = '';

  installState:any = {
    UnInstalled: -1,
    Installed: 1,
    Removed: 2,
  };

  // get price () {
  //   return this.templateInfo.IsFree ? '免费' : `￥${this.templateInfo.Price}`;
  // }

  // get showInstall () {
  //   return this.templateInfo.IsFree && !this.templateInfo.InstallDate;
  // }

  // get showOpen () {
  //   return this.templateInfo.InstallDate;
  // }

  // get showPurchase () {
  //   return !this.templateInfo.IsFree && !this.templateInfo.HasPurchased;
  // }

  // get showTry () {
  //   return this.showPurchase && !this.templateInfo.InstallDate;
  // }

  // get showPurchaseAgain () {
  //   return !this.templateInfo.IsFree && this.templateInfo.HasPurchased;
  // }

  get showInstall () { // 是否显示安装
    return (this.templateInfo.State !== this.installState.Installed &&
      this.templateInfo.IsFree) ||
      (this.templateInfo.State === this.installState.Removed &&
      (this.templateInfo.HasPurchased || this.templateInfo.IsGift));
  }

  get showTry () { // 试用
    const flag = !this.templateInfo.IsFree &&
    !this.templateInfo.HasPurchased &&
    !this.templateInfo.IsGift &&
    ((this.templateInfo.State === this.installState.Removed && this.templateInfo.LeftTrialDays > 0) ||
    this.templateInfo.State === this.installState.UnInstalled);
    return flag;
  }

  get showTryExpire () { // 试用到期
    const flag = !this.templateInfo.IsFree &&
    !this.templateInfo.HasPurchased &&
    !this.templateInfo.IsGift &&
    ((this.templateInfo.State === this.installState.Removed && this.templateInfo.LeftTrialDays <= 0));
    return flag;
  }

  get showOpen () { // 打开
    return this.templateInfo.State === this.installState.Installed;
  }

  // get disableOpen () {
  //   return !this.templateInfo.IsFree &&
  //     this.templateInfo.LeftTrialDays <= 0 &&
  //     (!this.templateInfo.HasPurchased || !this.templateInfo.IsGift);
  // }

  get showPurchase () { // 购买
    return !this.templateInfo.IsFree && !this.templateInfo.isGift && !this.templateInfo.HasPurchased;
  }

  get showPurchaseAgain () { // 再次购买
    return !this.templateInfo.IsFree &&
      this.templateInfo.LeftTrialDays <= 0 &&
      (!this.templateInfo.HasPurchased || !this.templateInfo.IsGift);
  }

  /**
   * 系统管理员
  */
  get isAdministrator () {
    return this.userInfo.isAdministrator; // || this.userInfo.isSubAdministrator;
  }

  created () {
    this.itemWidth = window.innerWidth - 44.5;
    this.code = this.$route.query.code;
    this.skeletonLoading = true;
    this.getTemplateDetail();
  }

  activated () {

  }

  /**
   * 获取详情数据
  */
  async getTemplateDetail () {
    const ret = await getTemplateDetail(this.code);
    if (ret && ret.success) {
      this.skeletonLoading = false;
      const data = ret.returnData.TemplateDetail;
      this.templateInfo = ret.returnData.TemplateDetail;
      this.price = data.Price; // 价格
      this.appCode = data.AppCode;
      this.mobileScreenShots = data.MobileScreenShots;
      const strArr = data.Recommendation && data.Recommendation.split('\n');
      let strHtml = '';
      if (strArr instanceof Array) {
        strArr.forEach(item => {
          strHtml += `<div>${item}<div>`;
        });
      }
      this.recommendation = strHtml;
    }
  }

  /**
   * 安装
  */
  async install () {
    this.isInstalling = true;
    const ret = await installTemplate(this.code, true);
    if (ret.Successful) {
      this.isInstalling = false;
      // this.$set(this.templateInfo, 'InstallDate', new Date().toDateString);
      this.$set(this.templateInfo, 'State', this.installState.Installed);
    } else {
      this.isInstalling = false;
      this.$toast.show({ text: ret.ErrorMessage || '安装失败' });
      this.$set(this.templateInfo, 'State', this.installState.UnInstalled);
    }
  }

  /**
   * 购买
  */

  purchase () {
    // this.itemCode = this.goodsCode;
    // this.itemHasPurchased = this.hasPurchased;
    // window.Environment.EntryType = this.EntryType.Subject;
    // window.Environment.EntrySubjectCode = this.subjectCode;
    this.appPurchase();
  }

  // 购买app
  appPurchase () {
    if (this.templateInfo.HasPurchased) {
      return;
    }
    if (this.isAdministrator) {
      // 验证是否为最新版的客户
      this.isLatestVersion();
      // 验证是不是钉钉管理员
      // this.isDingtalkManager();
    } else {
      // this.showMessage('提示', '请联系钉钉系统管理员进行购买！');
      this.$modal.alert({
        title: '提示',
        content: '请联系钉钉系统管理员进行购买！',
        onConfirm: () => { },
      });
    }
  }

  isLatestVersion () {
    const ver = window.dd.version;
    if (window.dd.pc) { return; }
    if (window.dd.ios) {
      if (this.checkVersion(ver, '4.4.1')) {
        this.isDingtalkManager();
      } else {
        // this.showMessage('提示', '由于您的钉钉版本过低，请更新钉钉版本后再次购买，谢谢');
        this.$toast.show({ text: '由于您的钉钉版本过低，请更新钉钉版本后再次购买，谢谢' });
      }
      return;
    }
    if (this.checkVersion(ver, '4.5.3')) {
      this.isDingtalkManager();
    } else {
      this.$toast.show({ text: '由于您的钉钉版本过低，请更新钉钉版本后再次购买，谢谢' });
    }
  }

  checkVersion (ver: string, minver: string) {
    return true;
    // let supportService = true;
    // const minVerStr = minver.split('.').map(Number);
    // const verStr = ver.split('.').map(Number);
    // if (verStr.length !== minVerStr.length || verStr.length < 3) { return false; }
    // for (let i = 0; i < minVerStr.length; i += 1) {
    //   if (minVerStr[i] > verStr[i]) {
    //     return false;
    //   }
    //   supportService = true;
    // }
    // return supportService;
  }

  isDingtalkManager () {
    const self = this;
    window.dd.biz.user.get({
      corpId: self.$store.state.corpId,
      onSuccess (res) {
        if (res.isManager) {
          self.makeOrder();
        } else {
          self.$modal.alert({
            title: '提示',
            content: '请联系钉钉系统管理员进行购买！',
            onConfirm: () => { },
          });
        }
      },
      onFail () {
        self.$modal.alert({
          title: '提示',
          content: '订购失败，您可以联系我们的在线客服，谢谢',
          onConfirm: () => { },
        });
      },
    });
  }

  makeOrder () {
    const self = this;
    const orderParams = {
      corpId: self.$store.state.corpId,
      itemCode: self.templateInfo.ItemCode,
      cycNum: 1, // 几
      cycUnit: 1, // 年
      quantity: 1, // 几个
    };
    window.dd.biz.store.createOrder({
      params: JSON.stringify(orderParams),
      onSuccess (res) {
        self.getPurchasedUrl(res);
      },
      onFail (err:any) {
        self.$modal.alert({
          title: '提示',
          content: `下单失败，您可以联系我们的在线客服，谢谢.失败原因：${err.Reason || err.errorMessage}`,
          onConfirm: () => { },
        });
      },
    });
  }

  getPurchasedUrl (data) {
    const self = this;
    const obj = {
      orderId: data.bizOrderId,
    };
    window.dd.biz.store.getPayUrl({
      params: JSON.stringify(obj),
      onSuccess (res) {
        self.getPurchased(res);
      },
      onFail () {
        self.$modal.alert({
          title: '提示',
          content: '购买失败，请到应用中心底部的购买记录里支付订单。您也可以联系我们的在线客服，谢谢',
          onConfirm: () => { },
        });
      },
    });
  }

  getPurchased (res) {
    const self = this;
    this.$h3.modal.show({
      title: '即将购买氚云应用模板',
      type: 'alert',
      actions: [
        { text: '取消', onPress: () => {} },
        { text: '去支付', onPress: () => { this.getAlipay(res); } },
      ],
    });
  }

  getAlipay (data) {
    const self = this;
    window.dd.biz.alipay.pay({
      info: data.payUrl,
      onSuccess (res) {
        if (res.resultStatus === '9000') {
          self.goToSuccessPage();
        } else {
          self.goToFailPage();
        }
      },
      onFail () {
        self.goToFailPage();
      },
    });
  }

  goToSuccessPage () {
    this.$router.push({ path: '/serviceSuccess' });
  }

  goToFailPage () {
    this.$router.push({ path: '/serviceFail' });
  }

  /**
  * 打开
 */
  open () {
    this.$router.replace({
      name: 'schemas',
      params: {
        appCode: this.appCode,
      },
      query: {
        appCode: this.appCode,
      },
    });
  }

  tabChange (index) {
    console.log(index);
  }

  beforeRouteLeave (to, from, next) {
    this.$modal.hide(); // 关闭弹窗
    this.$store.state.excludeComp = ['lightTemplateDetail'];
    if (to.path === '/schemas') {
      this.$store.state.excludeComp = ['lightTemplateDetail', 'lightTemplate', 'viewAllTemplate'];
    }
    next();
  }

  goBack () {
    this.$router.go(-1);
  }
}
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #107fff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
#light-template-detail{
  position: absolute;
  top: 0;
  right: 0;
  // .px2rem(bottom, 60);
  left: 0;
  bottom:0;
  width: 100%;
  height: 100%;
  z-index: 998;
  overflow-y: auto;
  overflow-x: hidden;
  background: #F7F7F7;
  -webkit-overflow-scrolling: touch;

  .header {
    display: flex;
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
    .px2rem(padding-top, 30);
    .px2rem(padding-bottom, 30);
    background: #fff;
    &-left{
      .px2rem(width ,180);
      .px2rem(height, 180);
       display: flex;
      img{
        width:100%;
        height:100%;
        .px2rem(border-radius, 24);
      }
    }
    &-middle{
      .px2rem(margin-left,30);
      .top{
        .px2rem(width, 345);
        .px2rem(height, 45);
        .px2rem(line-height, 48);
        .px2rem(font-size, 32);
        font-weight:bold;
        color:#333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .middle{
        .px2rem(margin-top,8);
        .px2rem(height,32);
        .px2rem(line-height,32);
        .px2rem(margin-bottom,45);
        .px2rem(font-size,22);
        .px2rem(width,437);
        color:#999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .bottom{
        display: flex;
        .btn{
          // .px2rem(width,146);
          .px2rem(height, 54);
          .px2rem(line-height, 54);
          .px2rem(font-size, 28);
          .px2rem(border-radius,27);
          .px2rem(padding-left,40);
          .px2rem(padding-right,40);
          background:#DAF1DC;
          text-align: center;
          color: #0BCC1B;
          font-weight:500;
        }
        .price{
          background:#FFEAE4;
          color: #F2340F;
        }
        .install{
          .px2rem(height, 54);
          .px2rem(line-height, 54);
          .px2rem(margin-left, 12);
          .px2rem(font-size, 20);
          text-align: right;
          color:#666666;
        }
      }
    }
  }

  .content{
    .px2rem(margin-top, 20);
    /deep/ .h3-tab .h3-tab-item {
      color: #666;
    }

    /deep/ .h3-tab .h3-tab-item.h3-tab-selected {
      color: #107FFF;
      border-bottom: 3px solid #107FFF;
    }
    /deep/ .h3-tab-bar-inner{
      background-color: #107FFF;
    }
    .tab0{
      // position:absolute;
      // .px2rem(top,352);
      // bottom:0;
      // left:0;
      // right:0;
      height: 100%;
      margin-bottom: 2rem;
      /deep/ .h3think-swiper{
        height:100%;
        width:100%;
      }
      .h3-swiper-demo-img{

      }
      .img-par{
        .px2rem(margin-top,28);
        height:100%;
        // width:100%;
        width: calc(100% - 49 / @baseFontSize * 1rem);
        // display: flex;
        // justify-content: center;
        img{
          // height:100%;
          width:100%;
          text-align: center;
          position:relative;
          .px2rem(left,24.5);
        }
      }
    }
    .tab1{
      position:absolute;
      box-sizing: border-box;
      .px2rem(top,352);
      min-height: calc(100% - 352/@baseFontSize * 1rem);
      // bottom:0;
      left:0;
      right:0;
      .px2rem(padding-left, 30);
      .px2rem(padding-right, 30);
      .px2rem(padding-top, 18);
      .px2rem(padding-bottom, 150);
      color:#666;
      background: #fff;
    }
  }

  .footer{
    position:fixed;
    width:100%;
    .px2rem(height,148);
    .px2rem(bottom, 0);
    z-index:1060;
    background: #fff;
    display: flex;
    align-items: center;
     // 处理iphoneX适配问题
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .template-detail-free{
      display:flex;
      justify-content: space-between;
      width:100%;
      >div{
         width:100%;
        .px2rem(margin-left,30);
        .px2rem(margin-right,30);
        .px2rem(height,88);
        .px2rem(line-height,88);
        .px2rem(border-radius,50);
        color:#fff;
        .px2rem(font-size,30);
        background: #107EFF;
         text-align: center;
      }
    }
    .template-detail-charge{
      display:flex;
      justify-content: space-between;
      width:100%;
      .px2rem(padding-left,30);
      .px2rem(padding-right,30);
      >div{
        width:50%;
        .px2rem(height,88);
        .px2rem(line-height,88);
        .px2rem(border-radius,44);
        color:#fff;
        .px2rem(font-size,30);
        background: #107EFF;
        text-align: center;
        &:last-child{
          .px2rem(margin-left,16);
        }
      }
      .purchase{
        .px2rem(border-width,1);
        border-style: solid;
        border-color: #999;
        background: #fff;
        color:#333;
      }
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 1;
      transition: opacity 150ms linear;
      span {
        .px2rem(margin-right, 16);
        animation: installLoading 1s linear infinite;
      }
    }
  }
}

@keyframes installLoading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform:rotate(360deg);
  }
}

.skeleton-loading {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    .middle {
      flex: 1;
      .px2rem(height, 88);
      .px2rem(margin-left, 30);
      .px2rem(margin-right, 30);
      .px2rem(margin-top, 24);
      .px2rem(border-radius, 16);
    }
  }
  @keyframes skeleton-loading {
    0% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0 50%;
    }
  }
</style>
