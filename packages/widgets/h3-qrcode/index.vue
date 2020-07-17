<template>
  <div id="qrcode" class="qrcode" :style="qrcodeStyle">
    <div class="loading" v-show="isLoading">
      <span>
        <img src="../../../src/assets/img/loading.png"/>
      </span>
      <span>加载中，请稍等</span>
    </div>
  </div>
</template>

<script>
import '../../libs/qrcode';
// import { setTimeout } from 'timers';
// import QRCode from 'qrcodejs2';

export default {
  name: 'h3-qrcode',
  props: {
    isLoading: Boolean,
    url: {
      type: String,
      default: '',
    },
    width: [String, Number],
    height: [String, Number],
    colorDark: {
      type: String,
      default: '#000000',
    },
    colorLight: {
      type: String,
      default: '#ffffff',
    },
  },
  components: {
  },
  data() {
    return {
    };
  },
  created() {
  },
  mounted() {
    this.initQrcode();
  },
  computed: {
    qrcodeStyle() {
      return {
        width: this.exchangePxToRem(this.width),
        height: this.exchangePxToRem(this.height),
      };
    },
    qrcode() {
      const qrcode = new QRCode('qrcode');
      return qrcode;
    },
  },
  methods: {
    onClick(index) {
      const val = this.apps[index][this.assoKey];
      if (this.onChange) {
        this.onChange(val);
      } else {
        this.$emit('onChange', val);
      }
    },
    initQrcode() {
      this.qrcode.makeCode(this.url);
    },
    exchangePxToRem(data) {
      return `${data / 75}rem`;
    },
  },
  watch: {
    url(newUrl) {
      this.qrcode.clear();
      this.qrcode.makeCode(newUrl);
    },
  },
};
</script>

<style lang="less" >
@import '../../styles/mixins.less';
.qrcode{
  position: relative;
  img{
    width: 100%;
    height: 100%;
  }
}
.loading{
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #323334;
  span:first-child{
    .px2rem(width,80);
    .px2rem(height,80);
    img{
      width: 100%;
      animation: spin 2s infinite linear;
    }
  }
  span:last-child{
    .px2rem(padding-top,30);
    color:#FFFFFF;
  }
}
@keyframes spin {
  0%   { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}
</style>



