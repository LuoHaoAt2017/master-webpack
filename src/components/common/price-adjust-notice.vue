<template>
  <div class="authorization-limit">
    <h3-modal
      :visible="true"
      confirmText="查看详情"
      cancelText="取消"
      title="调价通知"
      @confirm="onOkClick"
      @cancel="onCancelClick"
    >
      <div class="limit-content">
        <p>亲爱的用户，氚云一直以来致力于为企业提供高品质的数字化管理平台。鉴于旧版价格已持续两年，在兼顾市场发展和用户利益的前提下，2020年4月1日起将进行价格调整。</p>
        <p>客户的成功才是我们的成功，感谢您一如既往的支持。</p>
      </div>
    </h3-modal>
  </div>
</template>
<script>
import { H3Modal } from '@h3/thinking-ui';
import { PriceAdjust } from '@/service/common.service';
export default {
  name: 'PriceAdjustNotice',
  components: {
    H3Modal,
  },
  data () {
    return {
    };
  },
  methods: {
    onOkClick () {
      PriceAdjust();
      this.$emit('detail');
    },
    onCancelClick () {
      this.$emit('close');
      PriceAdjust();
    },
  },
};
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.limit-content{
  .px2rem(line-height, 42);
  color:#666;
  text-align: left;
  p {
    .px2rem(font-size, 24);
  }
  p:last-child {
    .px2rem(margin-top, 32);
  }
}

</style>
