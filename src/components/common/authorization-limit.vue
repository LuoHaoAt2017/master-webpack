<template>
  <div class="authorization-limit">
    <h3-modal
      :visible="show"
      confirmText="联系客服"
      cancelText="稍后提醒"
      title="温馨提示"
      @confirm="onOkClick"
      @cancel="onCancelClick"
    >
      <div class="limit-content">
        尊敬的用户，您当前企业组织使用氚云的人数为<i>{{ userCount }}</i>人，已超过贵司购买的平台许可人数<i>{{ authorizedCount }}</i>人上限，为避免影响贵司的正常使用，请您尽快联系客服人员升级版本规格，平台将于<i>2020年1月1日</i>起对超限人数进行登录限制，给您带来的不便之处，敬请谅解。
      </div>
    </h3-modal>
  </div>
</template>
<script>
import { H3Modal } from '@h3/thinking-ui';
export default {
  // name:'authorizationLimit',
  components: {
    H3Modal,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    authorizedCount: { // 许可人数
      type: Number,
      default: 0,
    },
    userCount: { // 企业使用人数
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      tttt: true,
    };
  },
  created () {
  },
  methods: {
    onOkClick () {
      this.$emit('contactCustomer');
    },
    onCancelClick () {
      this.$emit('closeLimit');
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
  .px2rem(font-size, 28);
  .px2rem(line-height, 42);
  color:#666;
  text-align: left;
  i{
    font-weight:500;
    color:#ff4384;
    font-style:normal;
  }
}

</style>
