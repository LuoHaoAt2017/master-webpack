<template>
  <div class="service-fail">
    <div class="service-fail-icon">
      <img src="../../../assets/img/fail3x.png" />
    </div>
    <div class="service-fail-detail">
      支付失败， 您本次支付未成功
      <br>
      请查看账户信息后重新支付
    </div>
    <div class="service-fail-describe">
      关闭支付后，可在钉钉<br>
      应用市场--已开通--购买记录<br>
      中进行重新支付
    </div>
    <div class="service-fail-footer" @click="onRePurchasePackages">
      重新支付
    </div>
  </div>
</template>
<script>
// eslint yjh
import { setTitle, setLeft, closeApp } from '../../../config/dingtalk-interface';
import { isiOS } from '../../../config/common';


export default {
  components: {
  },
  data() {
    return {
      title: '支付失败',
    };
  },
  created() {
  },
  mounted() {
  },
  activated() {
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
    onRePurchasePackages() {
      this.$router.push({ path: '/servicePackage' });
    },
    goBack() {
      closeApp();
    },
  },
  computed: {
  },
};
</script>
<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.service-fail {
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #FFF;
  .px2rem(font-size,28);
  color: #333;
  height: 100%;
  overflow: scroll;
  &-icon{
    .px2rem(margin-top,157);
    img{
      .px2rem(width,160);
      .px2rem(height,160);
    }
  }
  &-detail{
    .px2rem(margin-top,64);
    .px2rem(line-height,44);
    text-align: center;
  }
  &-describe{
    .px2rem(margin-top,40);
    .px2rem(line-height,44);
    text-align: center;
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
}
</style>