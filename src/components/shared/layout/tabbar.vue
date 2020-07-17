<template>
  <h3-tabbar id="root-tabbar">
    <h3-tabbar-item :selected="selectedIndex==0" :link="homeLink">
      <i slot="icon" class="icon-Sales_008 h3yun_All"/>
      <i slot="icon-active" class="icon-Sales_008 h3yun_All"></i>
      <span slot="label">工作台</span>
    </h3-tabbar-item>
    <h3-tabbar-item :selected="selectedIndex==1" :link="appsLink">
      <i slot="icon" class="icon-Sales_013 h3yun_All"/>
      <i slot="icon-active" class="icon-Sales_013 h3yun_All"></i>
      <span slot="label">应用</span>
    </h3-tabbar-item>
  </h3-tabbar>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit, Watch
} from 'vue-property-decorator';
import { State, Getter, namespace } from 'vuex-class';
import { H3Tabbar } from 'h3-mobile-vue';
// vuex-class module命名空间
const homeModule = namespace('Home');

@Component({
  components: {
    H3Tabbar,
    H3TabbarItem: H3Tabbar.Item
  }
})
export default class AppTabbar extends Vue {
  homeLink: any = {
    path: '/home',
    replace: true,
  };

  @Getter('isSingleApp') isSingleApp: boolean;

  @State('appCode') appCode;

  @State('separatedAppCodeList') separatedAppCodeList;

  @State('backFromScanForm') backFromScanForm;

  get selectedIndex(): number {
    return this.$route.name === 'home' ? 0 : 1;
  }

  get appsLink() {
    if (this.isSingleApp) {
      return {
        path: '/rootSchemas',
        params: {
          appCode: this.backFromScanForm ? this.appCode : this.separatedAppCodeList[0],
        },
        query: {
          appCode: this.backFromScanForm ? this.appCode : this.separatedAppCodeList[0],
        }
      }
    }
    return {
      path: 'apps',
      replace: true,
    }
  }

}
</script>
<style lang="less">
#root-tabbar {
  position: fixed;
  &:before {
    border-color: rgba(237, 237, 237, 1);
  }
  .h3-tabbar__item {
    padding-top: 0.24rem !important;
    .h3-tabbar__icon {
      width: 0.56rem !important;
      height: 0.56rem !important;
      margin-bottom: 0.08rem !important;
    }
    .h3-tabbar__icon > i,
    i.h3-tabbar__icon {
      font-size: 0.53333333rem !important;
    }
    .h3-tabbar__label {
      height: 0.42666667rem !important;
      line-height: 0.42666667rem !important;

      span {
        font-size: 0.26666667rem;
      }
    }
  }
  .h3-bar__item_on {
    .h3-tabbar__icon i:before {
      color: #107fff;
    }
    .h3-tabbar__label {
      color: #107fff !important;
    }
  }
}
</style>
