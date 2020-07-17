<template>
  <div class="app-layout">
    <keep-alive :exclude="excludeComp">
      <router-view></router-view>
    </keep-alive>
    <tabbar v-show="tabbarShow"></tabbar>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Emit,
} from 'vue-property-decorator';
import { State } from 'vuex-class';
import Tabbar from "@/components/shared/layout/tabbar.vue";

@Component({
  components: {
    Tabbar
  }
})
export default class Root extends Vue {
  @State('tabbarShow')
  tabbarShow: boolean;

  @State('excludeComp')
  excludeComp: string[];
}
</script>

<style lang="less">
@import "../../assets/css/home.less";
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}
</style>
