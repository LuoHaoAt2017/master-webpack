<template>
  <div class="fixed-head-contanier">
    <div id="fixed-head-tab-header" :class="{'fixed-header':isFixedBol}">
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
import { H3Tab, H3TabItem } from '../h3-tab/';

export default {
  name: 'fixedHeadTab',
  components: {
    H3Tab,
    H3TabItem,
  },
  props: {
    tabItems: Array,
  },
  data() {
    return {
      isFixedBol: false,
    };
  },
  activated() {
    const headTab = document.getElementById('fixed-head-tab-header');
    const offsetTop = headTab.offsetTop;
    let scrollTop = 0;
    document.addEventListener('scroll', () => {
      scrollTop = document.documentElement.scrollTop;
      if (scrollTop >= offsetTop) {
        this.isFixedBol = true;
      } else {
        this.isFixedBol = false;
      }
    });
  },
};
</script>
<style lang="less">
.fixed-head-contanier{
  #fixed-head-tab-header{
    // height: 40px;
    width: 100%;
    overflow: scroll;
  }
  .noscroll-bar {
    -ms-overflow-style:none;
    overflow:-moz-scrollbars-none;
  }
  .noscroll-bar::-webkit-scrollbar{width:0px}
  .fixed-header{
    background-color: blue;
    position: fixed;
    top: 0;
  }
  .content{
    width: 100%;
  }
}

</style>

