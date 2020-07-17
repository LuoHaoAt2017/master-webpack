<template>
  <div class="service-success">
    <div class="service-success-icon">
      <img src="../../../assets/img/success3x.png" />
    </div>
    <div class="service-success-detail">
      {{detail}}
    </div>
    <div class="service-success-timer">
      将在<span>{{timeBase}}</span>秒后自动关闭
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
      title: '支付成功',
      timeBase: 5,
      detail: '恭喜你，成功获取专属服务',
      Dpr: null,
      timer: null,
    };
  },
  created() {
  },
  mounted() {
    this.setTime();
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
    // 获取个人中心客服链接等信息
    setTime() {
      let num = 5;
      this.timer = setInterval(() => {
        if (num < 1) {
          this.timer = window.clearInterval(this.timer);
          this.goToHomePage();
        } else {
          this.timeBase = this.timeBase - 1;
          num -= 1;
        }
      }, 1000);
    },
    goToHomePage() {
      this.$router.push({ path: '/home' });
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
.service-success {
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
  }
  &-timer{
    .px2rem(margin-top,40);
    .px2rem(line-height,44);
  }
}
</style>