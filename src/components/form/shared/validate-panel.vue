<template>
  <!-- <transition
    :duration="1000"
    leave-active-class="animated slideOutUp"
    enter-active-class="animated slideInDown"
  > -->
  <div v-show="validatePanel.show" class="validate-panel" :style="{top: top}">
    {{ validatePanel.msg }}
  </div>
  <!-- </transition> -->
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const FormModule = namespace('Form');

@Component
export default class ValidatePanel extends Vue {
  @FormModule.State('validatePanel')
  validatePanel;

  top:number|string = 0;

  @Watch('validatePanel.show')
  showChanged () {
    const body = document.querySelector('body');
    const bh = body.scrollTop + 'px';
    if (!this.$store.state.hasVirtualHeader) {
      this.top = bh;
    }
  }

  destroyed () {
    this.validatePanel.show = false;
  }
}
</script>
<style lang="less">
  @baseFontSize: 75;
  .px2rem(@name,@px) {
      @{name}: @px/@baseFontSize * 1rem;
  }
  .validate-panel {
    position: fixed;
    left: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #f0a007;
    color: #ffffff;
    font-size: 13px;
    text-align: center;
    z-index: 9999999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
