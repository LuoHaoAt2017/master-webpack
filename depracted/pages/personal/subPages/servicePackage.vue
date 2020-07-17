<template>
  <div class="service-package">
    <div class="service-package-header">
      <h3-swiper mode="drawer" :show-dots="false"  @on-index-change="onSwiperChange">
        <h3-swiper-item v-for="(item,index) in Items" :key="index"> 
          <img :src="setPhotoType(item,'header')" @error="handleError($event)"/>
        </h3-swiper-item>
      </h3-swiper>
    </div>
    <div class="service-package-detail" >
      <img :src="setPhotoType(Items[selectedIndex],'detail')" @error="handleError($event)"/>
    </div>
    <div class="service-package-footer" :class="{'disable': isBaseService}" @click="onPurchasePackages" v-if="!Purchased && !isBaseService">
      立即购买
    </div>
  </div>
</template>
<script>
// eslint yjh
import { setTitle, setLeft, closeApp } from '../../../config/dingtalk-interface';
import { isiOS, isDingtalk } from '../../../config/common';
import { getSolutionServicePackages } from '../../../service/get-data';
import { H3Swiper, H3SwiperItem } from '../../../../packages/components/h3-swiper/index';

export default {
  components: {
    H3Swiper,
    H3SwiperItem,
  },
  data() {
    return {
      title: '企业名称',
      Dpr: null,
      CorpId: '',
      Items: [
        {
          Itemcode: '',
          Header2x: '',
          Header3x: '',
          Detail2x: '',
          Detail3x: '',
          IsBaseService: false,
        },
      ],
      Purchased: false,
      IsAdministrator: true,
      selectedIndex: 0,
      picIcon: require('../../../assets/img/icon-pic.png'),
    };
  },
  created() {
    this.getSolutionServicePackages();
    this.Dpr = window.devicePixelRatio;
  },
  mounted() {
  },
  activated() {
    this.getSolutionServicePackages();
    setTitle(this.title);
    const self = this;
    window.backFn = () => {
      self.goBack();
    };
    if (isiOS) {
      setLeft(window.backFn);
    }
  },
  methods: {
    async getSolutionServicePackages() {
      const res = await getSolutionServicePackages();
      if (res.Successful) {
        const data = res.ReturnData.Result;
        if (data && data.Items.length > 0) {
          this.CorpId = data.CorpId;
          this.Items = data.Items;
          this.title = data.CompanyName;
          this.Purchased = data.Purchased;
          this.IsAdministrator = data.IsAdministrator;
        }
      }
    },
    getTextInfos() {
      this.Purchased = false;
      this.IsAdministrator = true;
      this.Items = [
        {
          Itemcode: '1',
          Header2x: '../../../../src/assets/img/01x2.png',
          Header3x: '../../../../src/assets/img/01x2.png',
          Detail2x: '../../../../src/assets/img/d01x2.png',
          Detail3x: '../../../../src/assets/img/d01x2.png',
        },
        {
          Itemcode: '2',
          Header2x: '../../../../src/assets/img/02x2.png',
          Header3x: '../../../../src/assets/img/02x2.png',
          Detail2x: '../../../../src/assets/img/d02x2.png',
          Detail3x: '../../../../src/assets/img/d02x2.png',
        },
        {
          Itemcode: '3',
          Header2x: '../../../../src/assets/img/03x2.png',
          Header3x: '../../../../src/assets/img/03x2.png',
          Detail2x: '../../../../src/assets/img/d01x2.png',
          Detail3x: '../../../../src/assets/img/d01x2.png',
        },
        {
          Itemcode: '4',
          Header2x: '../../../../src/assets/img/01x2.png',
          Header3x: '../../../../src/assets/img/01x2.png',
          Detail2x: '../../../../src/assets/img/d02x2.png',
          Detail3x: '../../../../src/assets/img/d02x2.png',
        },
      ];
    },
    onPurchasePackages() {
      if (this.Purchased) { return; }
      if (this.isBaseService) { return; }
      if (this.IsAdministrator) {
        // 验证是否为最新版的客户端
        this.isLatestVersion();
        // 验证是不是钉钉管理员
        // this.isDingtalkManager();
      } else {
        this.showModal('请联系钉钉系统管理员进行购买！');
      }
    },
    isLatestVersion() {
      const ver = dd.version;
      if (dd.pc || !isDingtalk) { return; }
      if (dd.ios) {
        if (this.checkVersion(ver, '4.4.1')) {
          this.isDingtalkManager();
        } else {
          this.showModal('由于您的钉钉版本过低，请更新钉钉版本后再次购买，谢谢！');
        }
      }
      if (dd.android) {
        if (this.checkVersion(ver, '4.5.3')) {
          this.isDingtalkManager();
        } else {
          this.showModal('由于您的钉钉版本过低，请更新钉钉版本后再次购买，谢谢！');
        }
      }
    },
    checkVersion(ver, minver) {
      let supportService = true;
      const minVerStr = minver.split('.').map(Number);
      const verStr = ver.split('.').map(Number);
      if (verStr.length !== minVerStr.length || verStr.length < 3) { return false; }
      for (let i = 0; i < minVerStr.length; i += 1) {
        if (minVerStr[i] > verStr[i]) {
          return false;
        }
        supportService = true;
      }
      return supportService;
    },
    isDingtalkManager() {
      const self = this;
      if (isDingtalk) {
        dd.biz.user.get({
          corpId: this.CorpId,
          onSuccess(res) {
            if (res.isManager) {
              self.makeOrder();
            } else {
              self.showModal('请联系钉钉系统管理员进行购买！');
            }
          },
          onFail() {
            self.onError('订购失败，您可以联系我们的在线客服，谢谢');
          },
        });
      }
    },
    makeOrder() {
      const self = this;
      const orderParams = {
        corpId: self.CorpId,
        itemCode: self.Items[self.selectedIndex].ItemCode,
        cycNum: 1, // 几
        cycUnit: 1, // 年
        quantity: 1, // 几个
      };
      if (isDingtalk) {
        dd.biz.store.createOrder({
          params: JSON.stringify(orderParams),
          onSuccess(res) {
            self.getPurchasedUrl(res);
          },
          onFail() {
            self.showModal('下单失败，您可以联系我们的在线客服，谢谢');
          },
        });
      }
    },
    getPurchasedUrl(data) {
      const self = this;
      const obj = {
        orderId: data.bizOrderId,
      };
      if (isDingtalk) {
        dd.biz.store.getPayUrl({
          params: JSON.stringify(obj),
          onSuccess(res) {
            self.getPurchased(res);
          },
          onFail() {
            self.showModal('购买失败，请到应用中心底部的购买记录里支付订单。您也可以联系我们的在线客服，谢谢');
          },
        });
      }
    },
    getPurchased(res) {
      this.$h3.modal.show({
        title: '即刻购买氚云服务包 享受一对一专属服务',
        type: 'alert',
        actions: [
          { text: '取消', onPress: () => {} },
          { text: '去支付', onPress: () => { this.getAlipay(res); } },
        ],
      });
    },
    getAlipay(data) {
      const self = this;
      if (isDingtalk) {
        dd.biz.alipay.pay({
          info: data.payUrl,
          onSuccess(res) {
            if (res.resultStatus === '9000') {
              self.goToSuccessPage();
            } else {
              self.goToFailPage();
            }
          },
          onFail() {
            self.goToFailPage();
          },
        });
      }
    },
    showModal(tips) {
      this.$h3.modal.show({
        title: tips,
        type: 'alert',
        actions: [
          { text: '确定', onPress: () => {} },
        ],
      });
    },
    onError(failText) {
      window.toast.show({
        text: failText,
        iconType: 'fail',
        duration: 1000,
        mask: true,
      });
    },
    setPhotoType(item, type) {
      if (type === 'header') {
        return this.Dpr < 3 ? item.Header2x : item.Header3x;
      }
      return this.Dpr < 3 ? item.Detail2x : item.Detail3x;
    },
    goBack() {
      closeApp();
    },
    goToSuccessPage() {
      this.$router.push({ path: '/serviceSuccess' });
    },
    goToFailPage() {
      this.$router.push({ path: '/serviceFail' });
    },
    onSwiperChange(index) {
      this.selectedIndex = index;
    },
    handleError($event) {
      $event.currentTarget.src = this.picIcon;
    },
  },
  computed: {
    isBaseService() {
      return this.Items[this.selectedIndex].IsBaseService;
    },
  },
  watch: {
    title(newval) {
      // console.log(newval);
      setTitle(newval);
    },
  },
};
</script>
<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.service-package {
    background-color: #FFF;
    height: 100%;
    // overflow: scroll;
  &-header{
    .h3-swiper,.h3-swiper-drawer{
      .px2rem(height,340) !important;
      .h3-swiper-item{
        .px2rem(padding-top,24);
        .px2rem(padding-left,85);
        .px2rem(padding-right,85);
        .px2rem(padding-bottom,0);
        box-sizing: border-box;
      }
      img{
        width: 100%;
      }
    }
  }
  &-detail{
    .px2rem(margin-left,40);
    .px2rem(margin-right,100);
    .px2rem(margin-bottom,100);
    .px2rem(width,670);
    height: calc(~'100% - 224px');
    // .px2rem(height,710);
    overflow: scroll;
    img {
      width: 100%;
      height: auto;
    }
  }
  &-footer{
    position: fixed;
    width: 100%;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .px2rem(height,88);
    .px2rem(font-size,32);
    background-color: #3F4267;
    color: #FFF;
  }
  .disable{
    background-color: #BFBFBF !important;
  }
}
</style>
