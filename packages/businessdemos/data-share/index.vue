<template>
  <div class="share-page">
    <div class="form-title">表单名称</div>
    <div class="first-tips">钉钉扫一扫二维码，填写表单</div>
    <h3-qrcode :is-loading="isLoading" :url="url" :width="width" :height="height"></h3-qrcode>
    <div class="second-tips">注意：仅限权限内成员邀填</div>
    <h3-button type="primary">发送邀填链接</h3-button>
  </div>
</template>

<script>
import cx from 'classnames';
import H3Qrcode from '../../widgets/h3-qrcode/index';
import H3Button from '../../widgets/h3-button/index';
// import { setTimeout } from 'timers';

export default {
  name: 'data-list-demo',
  components: {
    H3Qrcode,
    H3Button,
  },
  data() {
    return {
      url: '1111111',
      isLoading: true,
      width: 330,
      height: 330,
    };
  },
  mounted() {
    this.initSetTimer();
  },
  activated() {
  },
  methods: {
    jump(type) {
      this.$router.push({
        name: type,
      });
    },
    initSetTimer() {
      this.isLoading = true;
      setTimeout(() => {
        this.url = 'http://www.baidu.com';
        this.isLoading = false;
      }, 5000);
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
.share-page{
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .form-title{
    color: #333333;
    .px2rem(font-size,34);
    .px2rem(margin-top,120);
    .px2rem(margin-bottom,144);
  }
  .first-tips{
    color: #666666;
    .px2rem(font-size,28);
    .px2rem(margin-bottom,40);
  }
  .second-tips{
    color: #999999;
    .px2rem(font-size,24);
    .px2rem(margin-top,30);
  }
  .h3-button-primary{
    .px2rem(font-size,34);
    .px2rem(margin-top,127);
    .px2rem(width,630);
    .px2rem(height,94);

  }
}
</style>