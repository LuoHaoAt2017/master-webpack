<template>
    <div class="error-show">
        <div class="error-show-wrap dp-font34">{{errorInfo}}</div>
    </div>
</template>
<script>
import { setTitle, setLeft } from '../../config/dingtalk-interface';

export default {
  name: 'errorShow',
  data() {
    return {
      errorInfo: '',
    };
  },
  created() {
    this.errorInfo = this.$route.params.errorInfo;
  },
  activated() {
    const self = this;
    this.errorInfo = this.$route.params.errorInfo;
    setTitle('提示');
    window.backFn = function a() {
      self.goBack();
    };
    setLeft(window.backFn);
  },
  methods: {
    goBack() {
      this.$router.goBack();
    },
  },
};
</script>
<style lang='less'>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.error-show {
  .error-show-wrap {
    background-color: white;
    .px2rem(padding-top,21);
    .px2rem(padding-left,24);
    .px2rem(padding-right,24);
    color: #666;
  }
}
</style>


