<template>
  <div class="form-button" v-show="isVisible && !$store.state.IsExternalShare">
    <box gap="10px 10px">
        <!-- <flexbox-item> -->
          <x-button @click.native='clickButton()'>{{formVal.displayname}}</x-button>
        <!-- </flexbox-item> -->
    </box>
  </div>
</template>
<script>
import { XButton, Box } from 'vux';

export default {
  name: 'FormButton',
  components: {
    XButton,
    Box,
  },
  props: ['formVal', 'keyName', 'ObjectId'],
  data() {
    return {
      Action: '',
      isVisible: true,
    };
  },
  created() {
    // console.log(this.formVal)
    this.Action = this.keyName;
  },
  mounted() {},
  methods: {
    clickButton() {
      this.$store.state.isHtmlChangedBol = true;
      this.$store.state.isClickCustomButtom = true;
      SmartForm.OnAction(this, this);
    },
    // 设置是否可见
    SetVisible(flag) {
      this.isVisible = flag;
    },
  },
};
</script>
<style lang="less">
.form-button {
  text-align: center;
  .weui-btn_default {
    background-color: white;
  }
}
</style>
