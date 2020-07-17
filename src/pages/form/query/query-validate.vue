<template>
  <div class="open-query-validate">
    <div>
      <div class="open-query-validate__title">
        查询数据需要验证密码
      </div>
      <div class="open-query-validate__desc">
        温馨提示：如不知道密码，请咨询分享此链接的相关人员
      </div>
      <label class="open-query-validate__content" for="pwdInput" @click="keyboardVisible = true">
        <span class="highlight">{{ password.slice(0,1) }}</span>
        <span :class="password.length > 1 ? 'highlight' : ''">{{ password.slice(1,2) }}</span>
        <span :class="password.length > 2 ? 'highlight' : ''">{{ password.slice(2,3) }}</span>
        <span :class="password.length > 3 ? 'highlight' : ''">{{ password.slice(3,4) }}</span>
        <span :class="password.length > 4 ? 'highlight' : ''">{{ password.slice(4,5) }}</span>
        <span :class="password.length > 5 ? 'highlight' : ''">{{ password.slice(5,6) }}</span>
      </label>
      <!-- <input
        id="pwdInput"
        ref="pwdInput"
        v-model.trim="password"
        type="number"
        placeholder="请输入六位数字验证码"
      /> -->
      <h3-input
        id="pwdInput"
        ref="pwdInput"
        v-model="password"
        placeholder="请输入六位数字验证码"
        readonly
      />
      <h3-number-keyboard
        v-model="keyboardVisible"
        :value="password"
        @change="password = $event"
      />
      <div class="open-query-validate__button" :class="activeCls" @click="validate">
        确定
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from 'vue-property-decorator';
import { H3Input, H3NumberKeyboard } from '@h3/thinking-ui';

@Component({
  name: 'open-query-validate',
  components: {
    H3Input,
    H3NumberKeyboard,
  },
})
export default class OpenQueryValidate extends Vue {
  password = '';

  keyboardVisible = true;

  get activeCls () {
    if (this.password.length >= 6) {
      return 'active';
    }
    return '';
  }

  @Watch('password')
  onPasswordChanged (val) {
    if (val) {
      this.$emit('change');
    }
  }

  mounted () {
    // 兼容性问题
    // (this.$refs.pwdInput as HTMLElement).focus();
  }

  validate () {
    if (this.password.length < 6) {
      return;
    }
    this.$emit('validate', this.password);
    this.password = '';
  }
}

</script>

<style lang="less" scoped>
@openqueryvalidateCls: open-query-validate;
@baseFontSize: 75;

.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}

.@{openqueryvalidateCls} {
  height: 100%;
  .px2rem(padding-top, 68);
  .px2rem(padding-left, 30);
  .px2rem(padding-right, 30);
  background: #fff;
  &__title {
    .px2rem(height, 53);
    .px2rem(line-height, 53);
    .px2rem(padding-left, 34);
    .px2rem(font-size, 36);
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(51,51,51,1);
  }
  &__desc {
    .px2rem(margin-bottom, 24);
    .px2rem(height, 40);
    .px2rem(line-height, 40);
    .px2rem(padding-left, 34);
    .px2rem(font-size, 24);
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(153,153,153,1);
  }
  &__content {
    .px2rem(padding-left, 34);
    .px2rem(padding-right, 34);
    display: flex;
    justify-content: space-between;
    label {
      // padding: 20px;
    }
    span {
      vertical-align: middle;
      border:1px solid rgba(102,102,102,1);
      display: inline-block;
      .px2rem(height, 120);
      .px2rem(line-height, 120);
      .px2rem(width, 84);
      .px2rem(font-size, 36);
      text-align: center;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      // &.highlight {
      //   border-color: purple;
      // }
    }
  }
  #pwdInput {
    position: absolute;
    opacity: 0;
  }
  &__button {
    .px2rem(margin-top, 52);
    .px2rem(height, 88);
    .px2rem(line-height, 88);
    background:rgba(235,237,242,1);
    border-radius:44px;
    text-align: center;
    .px2rem(font-size, 30);
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(204,204,204,1);
    &.active {
      background: #107fff;
      color: #fff;
    }
  }
}
</style>
